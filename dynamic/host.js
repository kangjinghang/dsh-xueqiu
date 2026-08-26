return {
  inject: ['timer'],
  apply(ctx) {
    const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    const BASE = 'https://stock.xueqiu.com'
    const SITE = 'https://www.xueqiu.com'
    // 跨平台：Windows 上 DSH shell 层是 PowerShell（pwsh -Command），单引号字面量语义与 POSIX 一致；
    // 但 PS 5.1 里 curl 是 Invoke-WebRequest 的别名 → 显式 curl.exe（Win10+ 自带）；
    // /dev/null 在 Windows 不存在 → NUL。Cookie 值里的引号（正常不会有）剥除以防注入。
    const WIN = typeof process !== 'undefined' && process.platform === 'win32'
    const CURL = WIN ? 'curl.exe' : 'curl'
    const NULL_DEV = WIN ? 'NUL' : '/dev/null'
    const DEFAULT_WATCHLIST = ['SH600519', 'SZ300750', 'SZ002594', 'SH601318', '00700', 'AAPL']

    const state = { cookie: '' }
    let watchlist = null
    let uiState = null
    // 可选登录态：粘贴浏览器 Cookie 后启用（云端自选股）。null = 匿名模式
    let login = null
    let cloudPid = null   // 默认自选组合 pid（首次云端操作时探测并缓存）

    // ---- 请求调度：并发 2 + 最小间隔 100ms（对齐雪球网页端行为，留有安全余量）----
    const MIN_GAP_MS = 100
    const MAX_CONCURRENCY = 2
    let running = 0
    let lastStart = 0
    const waiters = []

    function delay(ms) { return new Promise(function (r) { ctx.timeout(r, ms) }) }

    function release() {
      running--
      pump()
    }

    function pump() {
      while (running < MAX_CONCURRENCY && waiters.length) {
        const next = waiters.shift()
        running++
        next()
      }
    }

    // 看门狗：单个请求最长 30s，超时强制释放槽位，防止悬挂请求冻结整条管线
    const GATE_TIMEOUT_MS = 30000

    function gate(fn) {
      return new Promise(function (resolve, reject) {
        waiters.push(async function () {
          let released = false
          function rel() {
            if (released) return
            released = true
            running--
            pump()
          }
          let settled = false
          let watchdog = null
          function settle(fnName, arg) {
            if (settled) return
            settled = true
            if (watchdog) { try { watchdog() } catch (e) { /* ignore */ } }
            if (fnName === 'resolve') resolve(arg)
            else reject(arg)
          }
          try { watchdog = ctx.timeout(function () { rel(); settle('reject', new Error('[timeout] 请求超时(' + GATE_TIMEOUT_MS + 'ms)，已释放调度槽')) }, GATE_TIMEOUT_MS) } catch (e) { /* ignore */ }
          try {
            const wait = lastStart + MIN_GAP_MS - Date.now()
            if (wait > 0) await delay(wait)
            lastStart = Date.now()
            settle('resolve', await fn())
          } catch (e) {
            settle('reject', e)
          } finally {
            rel()
          }
        })
        pump()
      })
    }

    // ---- TTL 缓存 + in-flight 去重：同一 URL 在途请求共享同一个 Promise ----
    const cache = new Map()   // key -> { at, value }
    const inflight = new Map() // key -> Promise
    const CACHE_MAX_KEYS = 200

    function cacheGet(key, ttl) {
      const e = cache.get(key)
      if (e && ttl > 0 && Date.now() - e.at < ttl) return e.value
      return undefined
    }

    // 淘汰：kline 的 begin 参数按分钟取整，每分钟产生新 URL → 新条目；不清理则无界泄漏。
    // 写入时顺手清一轮过期条目（O(n) 但 n 被 200 上限钳住），再按容量兜底删最旧。
    function cachePut(key, value) {
      cache.set(key, { at: Date.now(), value: value })
      if (cache.size > CACHE_MAX_KEYS) {
        const now = Date.now()
        for (const k of Array.from(cache.keys())) {
          const e = cache.get(k)
          // 无 TTL 元信息（各调用点 ttl 不同）：超过 24h 的条目一律可清
          if (now - e.at > 86400000) cache.delete(k)
        }
      }
      while (cache.size > CACHE_MAX_KEYS) {
        const oldest = cache.keys().next().value   // Map 保插入序，最旧在最前
        cache.delete(oldest)
      }
    }

    function enc(s) {
      try { return encodeURIComponent(String(s)) } catch (e) { return String(s) }
    }

    function toQuery(params) {
      const parts = []
      for (const k in params) {
        const v = params[k]
        if (v === undefined || v === null || v === '') continue
        parts.push(enc(k) + '=' + enc(v))
      }
      return parts.length ? '?' + parts.join('&') : ''
    }

    function getShell() { return ctx.get('shell') }

    let cookieSeeding = null
    async function ensureCookie(force) {
      if (state.cookie && !force) return state.cookie
      if (cookieSeeding) return cookieSeeding // 并发去重：同一时刻只播种一次
      const shell = getShell()
      if (!shell) return ''
      cookieSeeding = (async function () {
      // 播种 URL 兜底链：/hq 无 WAF 挑战、直接发全套匿名 token（PR#2）；
      // 首页 / 在部分地区会被阿里云 WAF JS 挑战接管（只发 acw_tc），作第一备选。
      // 逐个尝试，拿到 xq_a_token 即成功；全部失败返回空串走无 cookie 路径。
      const seedUrls = [
        'https://xueqiu.com/hq',
        'https://www.xueqiu.com/'
      ]
      let seen = {}
      let pairs = []
      for (let i = 0; i < seedUrls.length; i++) {
        const cmd = CURL + " -s -L --max-time 12 -D - -o " + NULL_DEV + " '" + seedUrls[i] + "' -H 'User-Agent: " + UA + "'"
        const spec = shell.resolve({ command: cmd, timeoutMs: 15000, stdoutMaxBytes: 65536 })
        let res = null
        try { res = await shell.run(spec) } catch (e) { res = null }
        if (!res || res.exitCode !== 0) continue
        seen = {}
        pairs = []
        const lines = String(res.stdout.text || '').split('\n')
        for (let j = 0; j < lines.length; j++) {
          const m = /^set-cookie:\s*([^=;\s]+)=([^;]*)/i.exec(lines[j].trim())
          if (m && !seen[m[1]]) { seen[m[1]] = true; pairs.push(m[1] + '=' + m[2]) }
        }
        if (seen.xq_a_token) break // 拿到核心 token，播种成功
      }
      // kline 端点要求 cookie 里存在 u=<id>；优先用种子响应里的真实 u，缺失才补随机值
      if (!seen.u) pairs.push('u=' + String(Date.now()) + String(Math.floor(Math.random() * 1e6)))
      state.cookie = pairs.join('; ')
      return state.cookie
      })()
      const r = cookieSeeding
      r.then(function () { cookieSeeding = null }, function () { cookieSeeding = null })
      return r
    }

    async function curl(url, opts) {
      opts = opts || {}
      const shell = getShell()
      if (!shell) throw new Error('shell 服务不可用，无法访问雪球')
      // 登录态优先：请求头用用户 Cookie；显式 cookie 参数（登录校验）最高；
      // anonymous=true 强制匿名（cookie_expired 降级重试：公开数据不需要登录态）
      const cookie = opts.cookie !== undefined ? opts.cookie
        : (opts.anonymous || !login) ? await ensureCookie(false)
        : login.cookie
      let cmd = CURL + " -s --max-time 12 -X " + (opts.method || 'GET') + " '" + url + "'"
      cmd += " -H 'User-Agent: " + UA + "'"
      cmd += " -H 'Referer: https://www.xueqiu.com/'"
      cmd += " -H 'Accept: application/json'"
      if (cookie) cmd += " -H 'Cookie: " + String(cookie).replace(/['"]/g, '') + "'"
      if (opts.body) {
        cmd += " -H 'Content-Type: application/x-www-form-urlencoded' --data '" + String(opts.body).replace(/'/g, '%27') + "'"
      }
      const spec = shell.resolve({ command: cmd, timeoutMs: 15000, stdoutMaxBytes: 4194304 })
      const result = await shell.run(spec)
      if (result.exitCode !== 0) {
        // 不回显 stderr：bash 语法错误会把完整命令行（含内部拼接细节）透给调用方
        throw new Error('curl 失败 (' + result.exitCode + ')')
      }
      return String(result.stdout.text || '')
    }

    // ---- 错误分类：cookie_expired / rate_limited / parse / network / empty ----
    function classifyError(data) {
      if (!data || !data.error_code || data.error_code === 0) return null
      const code = String(data.error_code)
      const desc = String(data.error_description || '')
      if (code === '400016') return { kind: 'cookie_expired', code: code, desc: desc || 'Cookie 失效', retryable: true }
      if (/频繁|频率|too many|429/i.test(desc) || code === '400017') return { kind: 'rate_limited', code: code, desc: desc || '请求过于频繁', retryable: true }
      return { kind: 'api', code: code, desc: desc || ('雪球错误 ' + code), retryable: false }
    }

    async function getJSON(path, params, opts) {
      opts = opts || {}
      const url = (opts.base || BASE) + path + toQuery(params || {})
      const ttl = opts.ttl || 0
      // cookie_expired 降级：登录 Cookie 失效时，公开数据改用匿名种子 Cookie 重试，
      // 避免过期登录态毒化所有匿名可用的行情接口（云端专属接口失败照常抛错）。
      let anonymous = opts.anonymous === true

      async function attempt(depth) {
        const err = await (async function () {
          let text
          try { text = await curl(url, { cookie: opts.cookie, anonymous: anonymous }) } catch (e) { return { kind: 'network', message: e.message, retryable: depth < 1 } }
          if (!text) return { kind: 'empty', message: '雪球返回空响应（可能被风控）', retryable: true }
          let data
          try { data = JSON.parse(text) } catch (e) { return { kind: 'parse', message: '响应解析失败: ' + text.slice(0, 120), retryable: false } }
          const cls = classifyError(data)
          if (cls) return { kind: cls.kind, message: cls.desc, code: cls.code, retryable: cls.retryable }
          // kline 陷阱：缺 u cookie 时返回 200 + 空 items 且无 column（静默失败）
          const d = data && data.data
          if (path.indexOf('/chart/kline') !== -1 && d && typeof d === 'object'
            && !Array.isArray(d.column) && String(d.items_size || '0') === '0') {
            return { kind: 'empty_kline', message: '无K线数据（检查代码是否正确，如 SH600519；大陆网络下也可能是 cookie 种子不完整）', retryable: true }
          }
          return { data: data }
        })()

        if (!err.kind) return err.data
        if (!err.retryable || depth >= 2) throw new Error('[' + err.kind + '] ' + err.message)

        if (err.kind === 'cookie_expired' || err.kind === 'empty' || err.kind === 'empty_kline') {
          if (err.kind === 'cookie_expired' && !anonymous && opts.cookie === undefined && login) {
            anonymous = true   // 登录 Cookie 被判失效：先降级匿名重试
          }
          await ensureCookie(true)   // 重新播种 cookie 后再试
        } else if (err.kind === 'rate_limited') {
          await delay(2000 * (depth + 1)) // 指数退避：2s → 4s
        } else if (err.kind === 'network') {
          await delay(500)
        }
        return attempt(depth + 1)
      }

      const hit = cacheGet(url, ttl)
      if (hit !== undefined) return Promise.resolve(hit)
      const pending = inflight.get(url)
      if (pending) return pending
      const p = gate(function () { return attempt(0) }).then(function (data) {
        if (ttl > 0) cachePut(url, data)
        return data
      })
      p.then(function () { inflight.delete(url) }, function () { inflight.delete(url) })
      inflight.set(url, p)
      return p
    }

    // ---- data normalizers ----
    function nz(v) { return v === undefined ? null : v }

    function sanitize(v) {
      if (v === undefined) return null
      if (v === null || typeof v !== 'object') return v
      if (Array.isArray(v)) {
        const out = []
        for (let i = 0; i < v.length; i++) out.push(sanitize(v[i]))
        return out
      }
      const out = {}
      for (const k in v) {
        if (Object.prototype.hasOwnProperty.call(v, k)) out[k] = sanitize(v[k])
      }
      return out
    }

    function pickQuote(q) {
      if (!q) return null
      return {
        symbol: nz(q.symbol), name: nz(q.name), code: nz(q.code), exchange: nz(q.exchange), type: nz(q.type),
        current: nz(q.current), percent: nz(q.percent), chg: nz(q.chg),
        open: nz(q.open), last_close: nz(q.last_close), high: nz(q.high), low: nz(q.low),
        volume: nz(q.volume), amount: nz(q.amount), turnover_rate: nz(q.turnover_rate),
        market_capital: nz(q.market_capital), float_market_capital: nz(q.float_market_capital),
        volume_ratio: nz(q.volume_ratio), amplitude: nz(q.amplitude), current_year_percent: nz(q.current_year_percent),
        pe_ttm: nz(q.pe_ttm), pe_lyr: nz(q.pe_lyr), pe_forecast: nz(q.pe_forecast), pb: nz(q.pb), eps: nz(q.eps),
        dividend_yield: nz(q.dividend_yield), high52w: nz(q.high52w), low52w: nz(q.low52w),
        limit_up: nz(q.limit_up), limit_down: nz(q.limit_down), status: nz(q.status)
      }
    }

    function mapKline(data) {
      const d = data && data.data ? data.data : null
      if (!d || !d.column || !d.item) return { period: null, rows: [] }
      const idx = {}
      for (let i = 0; i < d.column.length; i++) idx[d.column[i]] = i
      const rows = d.item.map(function (it) {
        return {
          timestamp: it[idx.timestamp], open: it[idx.open], high: it[idx.high],
          low: it[idx.low], close: it[idx.close], volume: it[idx.volume],
          amount: it[idx.amount], percent: it[idx.percent], chg: it[idx.chg],
          turnoverrate: it[idx.turnoverrate], pe: it[idx.pe], pb: it[idx.pb],
          market_capital: it[idx.market_capital]
        }
      })
      return { period: null, rows: rows }
    }

    function mapPosts(list) {
      if (!Array.isArray(list)) return []
      return list.map(function (p) {
        let text = p.description || p.text || ''
        text = String(text).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').slice(0, 200)
        return {
          id: p.id, title: p.title || '', text: text,
          created_at: p.created_at, reply_count: p.reply_count, fav_count: p.fav_count,
          view_count: p.view_count, target: p.target,
          user: p.user ? { id: p.user.id, screen_name: p.user.screen_name, followers_count: p.user.followers_count } : null
        }
      })
    }

    function mapKOL(arr) {
      if (!Array.isArray(arr)) return []
      return arr.map(function (u) {
        return {
          id: u.id, screen_name: u.screen_name, description: u.description || '',
          followers_count: u.followers_count, status_count: u.status_count,
          verified: u.verified, verified_description: u.verified_description,
          profile: u.profile, profile_image_url: u.profile_image_url
        }
      })
    }

    function mapFinance(list) {
      if (!Array.isArray(list)) return []
      return list.map(function (r) {
        function v(key) { return (r[key] && r[key][0] !== undefined) ? r[key][0] : null }
        return {
          report_name: r.report_name, report_date: r.report_date,
          avg_roe: v('avg_roe'), basic_eps: v('basic_eps'),
          gross_selling_rate: v('gross_selling_rate'), net_selling_rate: v('net_selling_rate'),
          operating_income_yoy: v('operating_income_yoy'), net_profit_atsopc_yoy: v('net_profit_atsopc_yoy'),
          asset_liab_ratio: v('asset_liab_ratio'), current_ratio: v('current_ratio'),
          total_revenue: v('total_revenue'), net_profit_atsopc: v('net_profit_atsopc'),
          np_per_share: v('np_per_share'), operate_cash_flow_ps: v('operate_cash_flow_ps')
        }
      })
    }

    // ---- actions ----
    async function actQuote(args) {
      const symbols = Array.isArray(args.symbols) ? args.symbols : [String(args.symbols || '')]
      const list = symbols.filter(function (s) { return /^[A-Za-z0-9_.]+$/.test(s) })
      if (!list.length) return { list: [], status: null }
      const data = await getJSON('/v5/stock/batch/quote.json', { symbol: list.join(',') }, { ttl: 10000 })
      const items = (data && data.data && data.data.items) || []
      const first = items[0]
      const status = first && first.market ? first.market.status_id : null
      return {
        status: nz(status),
        list: items.map(function (it) { return pickQuote(it.quote) }).filter(Boolean)
      }
    }

    async function actQuoteDetail(args) {
      const symbol = String(args.symbol || '')
      const data = await getJSON('/v5/stock/quote.json', { symbol: symbol, extend: 'detail' }, { ttl: 15000 })
      return { quote: pickQuote(data.data && data.data.quote), market: data.data && data.data.market }
    }

    async function actKline(args) {
      // 周期白名单：上游对未知 period 返回 200+空数据（静默失败），模型手滑传 '1h' 之类
      // 会拿到空数组还以为没数据——未知周期兜底为 day
      const PERIODS = { '1m': 1, '5m': 1, '15m': 1, '30m': 1, '60m': 1, 'day': 1, 'week': 1, 'month': 1 }
      const period = PERIODS[String(args.period)] ? String(args.period) : 'day'
      const count = Math.min(Math.max(parseInt(args.count, 10) || 120, 5), 500)
      const symbol = String(args.symbol || '')
      // begin 按分钟取整，保证 TTL 窗口内缓存 key 稳定（count 为负，返回的是最近 N 根）。
      // args.begin（毫秒时间戳，通常传当前最早一根）：取该根往前的更早历史
      let begin = Math.floor(Date.now() / 60000) * 60000
      if (isFinite(Number(args.begin)) && Number(args.begin) > 0) begin = Math.floor(Number(args.begin) / 60000) * 60000
      const data = await getJSON('/v5/stock/chart/kline.json', {
        symbol: symbol, period: period, type: 'before', begin: begin,
        count: -count, indicator: 'kline,pe,pb,ps,pcf,market_capital'
      }, { ttl: period === 'day' ? 300000 : 30000 })
      return mapKline(data)
    }

    async function actMinute(args) {
      const symbol = String(args.symbol || '')
      const data = await getJSON('/v5/stock/chart/minute.json', { symbol: symbol, period: '1d' }, { ttl: 10000 })
      const d = data && data.data ? data.data : null
      if (!d || !d.items) return { last_close: null, items: [] }
      return {
        last_close: d.last_close,
        items: d.items.map(function (it) {
          return { timestamp: it.timestamp, current: it.current, avg_price: it.avg_price, percent: it.percent, volume: it.volume, high: it.high, low: it.low }
        })
      }
    }

    async function actHot(args) {
      const market = String(args.market || 'cn')
      const typeMap = { global: 10, us: 11, cn: 12, hk: 13 }
      const size = Math.min(Math.max(parseInt(args.size, 10) || 10, 1), 30)
      const data = await getJSON('/v5/stock/hot_stock/list.json', { type: typeMap[market] || 12, size: size }, { ttl: 300000 })
      const items = (data && data.data && data.data.items) || []
      return {
        list: items.map(function (it) {
          return { symbol: it.symbol, code: it.code, name: it.name, current: it.current, percent: it.percent, chg: it.chg, exchange: it.exchange, value: it.value, rank_change: it.rank_change, increment: it.increment }
        })
      }
    }

    async function actSearch(args) {
      const q = String(args.q || '')
      if (!q) return { list: [] }
      const data = await getJSON('/query/v1/suggest_stock.json', { q: q, count: Math.min(parseInt(args.count, 10) || 8, 20) }, { base: SITE, ttl: 60000 })
      const list = (data && data.data) || []
      return {
        list: list.map(function (it) {
          return { code: it.code, name: it.query || it.name, type: it.type, stock_type: it.stock_type, label: it.label }
        })
      }
    }

    async function actSearchPosts(args) {
      const q = String(args.q || '')
      if (!q) return { list: [] }
      const data = await getJSON('/query/v1/search/status.json', { q: q, count: Math.min(parseInt(args.count, 10) || 10, 30) }, { base: SITE, ttl: 120000 })
      return { list: mapPosts(data && data.list) }
    }

    async function actNews(args) {
      const count = Math.min(Math.max(parseInt(args.count, 10) || 20, 1), 50)
      // max_id 翻页游标：-1 取最新一页；传上一页最旧一条 id 继续往回翻
      const maxId = parseInt(args.max_id, 10)
      const cursor = isFinite(maxId) && maxId > 0 ? maxId : -1
      const data = await getJSON('/statuses/livenews/list.json', { since_id: -1, max_id: cursor, count: count }, { base: SITE, ttl: 120000 })
      const items = (data && data.items) || []
      return {
        items: items.map(function (it) {
          return { id: it.id, text: it.text, mark: it.mark, created_at: it.created_at, target: it.target, view_count: it.view_count, reply_count: it.reply_count }
        })
      }
    }

    async function actKOL(args) {
      const symbol = String(args.symbol || '')
      const count = Math.min(Math.max(parseInt(args.count, 10) || 8, 1), 20)
      const data = await getJSON('/recommend/user/stock_hot_user.json', { symbol: symbol, start: 0, count: count }, { base: SITE, ttl: 3600000 })
      return { list: mapKOL(data) }
    }

    async function actUser(args) {
      const userId = String(args.userId || args.id || '')
      if (!userId) return { user: null, posts: [] }
      const data = await getJSON('/statuses/user_timeline.json', { user_id: userId, page: 1, count: Math.min(parseInt(args.count, 10) || 10, 30) }, { base: SITE, ttl: 300000 })
      const statuses = (data && data.statuses) || []
      const first = statuses[0]
      return {
        user: first && first.user ? {
          id: first.user.id, screen_name: first.user.screen_name,
          followers_count: first.user.followers_count, status_count: first.user.status_count,
          verified: first.user.verified, description: first.user.description, profile: first.user.profile
        } : null,
        posts: mapPosts(statuses)
      }
    }

    async function actFinance(args) {
      const symbol = String(args.symbol || '')
      const data = await getJSON('/v5/stock/finance/cn/indicator.json', { symbol: symbol, type: 'all', is_detail: 'true', count: 4 }, { ttl: 86400000 })
      const d = data && data.data ? data.data : null
      return {
        quote_name: d ? d.quote_name : null, last_report_name: d ? d.last_report_name : null,
        list: mapFinance(d ? d.list : null)
      }
    }

    // ---- 状态文件落点：稳定目录优先，工作区回退 ----
    // 旧实现 cwd=工作区根 → 状态文件跟着 dsh web 启动目录漂移（换目录启动=换一套
    // 自选/登录/界面状态）。现在优先写 $DSH_HOME/dsh-xueqiu/（writeText 自动建目录），
    // 沙箱策略拒绝工作区外绝对路径时探测失败，透明回退旧工作区行为（零回归）。
    // 读取顺序：稳定文件 → 缺失则回读旧工作区文件（存量数据无缝迁移，首次保存落到稳定目录）。
    let stateBasePromise = null
    function stableStateDir() {
      try {
        const env = (typeof process !== 'undefined' && process && process.env) || {}
        const base = env.DSH_HOME || ((env.HOME || env.USERPROFILE) ? (env.HOME || env.USERPROFILE) + '/.dsh' : '')
        return base ? String(base).replace(/[/\\]+$/, '') + '/dsh-xueqiu' : ''
      } catch (e) { return '' }
    }
    function stateBase(fs, root) {
      if (!stateBasePromise) {
        stateBasePromise = (async function () {
          const dir = stableStateDir()
          if (!fs || !dir) return ''
          try {
            const probe = await fs.resolve(dir + '/.write-probe', { cwd: root })
            await fs.writeText(probe, String(Date.now()))
            return dir
          } catch (e) { return '' }
        })()
      }
      return stateBasePromise
    }
    // 读：稳定文件优先；稳定模式且稳定文件缺失时，回读旧工作区路径（迁移源）
    async function stateRead(name, fs, root) {
      const dir = await stateBase(fs, root)
      if (dir) {
        try { return await fs.readText(await fs.resolve(dir + '/' + name, { cwd: root })) } catch (e) { /* 试旧工作区 */ }
      }
      if (!root) return null
      try { return await fs.readText(await fs.resolve(name, { cwd: root })) } catch (e) { return null }
    }
    // 写：稳定模式写稳定目录；否则旧工作区。返回真实落点（排障暴露用）
    async function stateWrite(name, text, fs, root) {
      const dir = await stateBase(fs, root)
      const target = await fs.resolve(dir ? dir + '/' + name : name, { cwd: root })
      await fs.writeText(target, text)
      return target
    }

    // ---- watchlist ----
    async function loadWatchlist() {
      if (watchlist) return watchlist
      watchlist = { symbols: DEFAULT_WATCHLIST.slice() }
      const fs = ctx.get('fs')
      const sp = ctx.get('sandboxPolicy')
      const root = sp && sp.workspaceRoot ? sp.workspaceRoot : null
      if (fs) {
        try {
          const text = await stateRead('.xueqiu-watchlist.json', fs, root)
          const parsed = text == null ? null : JSON.parse(text)
          if (parsed && Array.isArray(parsed.symbols) && parsed.symbols.length) {
            watchlist = { symbols: parsed.symbols.slice(0, 200), lastSyncAt: Number(parsed.lastSyncAt) || 0 }
          }
        } catch (e) { /* 首次运行或无写权限时使用默认列表 */ }
      }
      return watchlist
    }

    async function saveWatchlist() {
      const fs = ctx.get('fs')
      const sp = ctx.get('sandboxPolicy')
      const root = sp && sp.workspaceRoot ? sp.workspaceRoot : null
      if (!fs) return
      try {
        await stateWrite('.xueqiu-watchlist.json', JSON.stringify(watchlist), fs, root)
      } catch (e) { /* 保持内存态 */ }
    }

    async function actWatchlistGet() {
      const wl = await loadWatchlist()
      await maybeAutoSync()   // 登录态：节流后台同步云端自选（云端为准）
      return { symbols: (watchlist || wl).symbols }
    }

    // 后台自动同步（登录态 · 云端为准的双端统一）：
    // - 节流 10 分钟（lastSyncAt 持久化在 .xueqiu-watchlist.json）
    // - 云端列表直接镜像到本地：网页端加/删都会被跟随
    // - 本地 add/remove 本就双写云端；若云端写失败，下次同步会被镜像纠正（统一语义）
    // - 静默失败：cookie 过期等异常不影响 watchlist.get 返回
    let syncInflight = false
    const SYNC_INTERVAL_MS = 10 * 60 * 1000
    async function maybeAutoSync(force) {
      const lg = await loadLogin()
      if (!lg || syncInflight) return false
      const wl = await loadWatchlist()
      const last = Number(wl.lastSyncAt) || 0
      if (!force && Date.now() - last < SYNC_INTERVAL_MS) return false
      syncInflight = true
      try {
        const cloud = await fetchCloudWatchlist()
        if (!cloud.symbols.length) {
          // 空结果不镜像（接口异常/账号无自选都不该清空本地），但必须推进 lastSyncAt——
          // 否则 cookie 半失效时节流永不生效，每次 watchlist.get 都重复打上游 2 个请求
          wl.lastSyncAt = Date.now()
          watchlist = wl
          await saveWatchlist()
          return false
        }
        const cur = wl.symbols
        const changed = cur.length !== cloud.symbols.length || cloud.symbols.some(function (s, i) { return cur[i] !== s })
        if (changed) {
          watchlist = { symbols: cloud.symbols.slice(0, 200), lastSyncAt: Date.now() }
        } else {
          wl.lastSyncAt = Date.now()
          watchlist = wl
        }
        await saveWatchlist()
        return changed
      } catch (e) {
        return false   // 静默：debug RPC 可观察 login/cookie 状态
      } finally {
        syncInflight = false
      }
    }

    async function actWatchlistAdd(args) {
      const symbol = String(args.symbol || '')
      if (!/^[A-Za-z0-9_.]+$/.test(symbol)) throw new Error('无效代码: ' + symbol)
      const wl = await loadWatchlist()
      if (wl.symbols.indexOf(symbol) === -1) {
        wl.symbols.push(symbol)
        await saveWatchlist()
        cloudWatchAdd(symbol).catch(function () { /* 尽力而为：失败由下次同步纠正 */ })   // 云端添加失败不影响本地
      }
      return { symbols: wl.symbols }
    }

    async function actWatchlistRemove(args) {
      const symbol = String(args.symbol || '')
      const wl = await loadWatchlist()
      const i = wl.symbols.indexOf(symbol)
      if (i !== -1) {
        wl.symbols.splice(i, 1)
        await saveWatchlist()
        cloudWatchDelete(symbol).catch(function () { /* 尽力而为：失败由下次同步纠正 */ })   // 云端删除失败不影响本地
      }
      return { symbols: wl.symbols }
    }

    // ---- 可选登录：粘贴浏览器 Cookie（借鉴 xueqiu-cli 手动模式）----
    // 雪球登录态 = xq_a_token(+xq_id_token/u) 两个 Cookie，本地解析 JWT 即可拿到 uid/昵称/过期时间
    function b64urlDecode(s) {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'
      const map = {}
      for (let i = 0; i < chars.length; i++) map[chars[i]] = i
      let bits = 0, acc = 0, out = ''
      for (let i = 0; i < s.length; i++) {
        const v = map[s[i]]
        if (v === undefined) continue
        acc = (acc << 6) | v
        bits += 6
        if (bits >= 8) {
          bits -= 8
          out += String.fromCharCode((acc >> bits) & 0xff)
        }
      }
      // UTF-8 多字节还原：先转码单元再 decode
      try { return decodeURIComponent(out.split('').map(function (c) { return '%' + ('0' + c.charCodeAt(0).toString(16)).slice(-2) }).join('')) }
      catch (e) { return out }
    }

    function decodeJwt(token) {
      try {
        const parts = String(token).split('.')
        if (parts.length < 2) return null
        return JSON.parse(b64urlDecode(parts[1]))
      } catch (e) { return null }
    }

    function cookieJar(cookie) {
      const jar = {}
      String(cookie || '').split(';').forEach(function (kv) {
        const i = kv.indexOf('=')
        if (i > 0) jar[kv.slice(0, i).trim()] = kv.slice(i + 1).trim()
      })
      return jar
    }

    function cleanCookieInput(raw) {
      let c = String(raw || '').trim()
      if (/^cookie\s*:/i.test(c)) c = c.replace(/^cookie\s*:\s*/i, '')
      return c.replace(/[\r\n]+/g, ' ').trim()
    }

    // 登录文件真实落点（稳定目录优先，见 stateBase）——排障时绝不靠猜，
    // login.status 会把这个真实路径暴露出去。
    async function loginFilePath() {
      const fs = ctx.get('fs')
      const sp = ctx.get('sandboxPolicy')
      const root = sp && sp.workspaceRoot ? sp.workspaceRoot : null
      if (!fs) return null
      try {
        const dir = await stateBase(fs, root)
        return await fs.resolve(dir ? dir + '/.xueqiu-login.json' : '.xueqiu-login.json', { cwd: root })
      } catch (e) { return null }
    }

    async function loadLogin() {
      if (login !== null) return login
      const fs = ctx.get('fs')
      const sp = ctx.get('sandboxPolicy')
      const root = sp && sp.workspaceRoot ? sp.workspaceRoot : null
      if (fs) {
        try {
          const text = await stateRead('.xueqiu-login.json', fs, root)
          const parsed = text == null ? null : JSON.parse(text)
          if (parsed && parsed.cookie && /xq_a_token=/.test(parsed.cookie)) login = parsed
        } catch (e) { /* 未登录 */ }
      }
      return login
    }

    async function saveLogin() {
      const fs = ctx.get('fs')
      const target = await loginFilePath()
      if (!fs || !target) return
      try {
        await fs.writeText(target, JSON.stringify(login || {}))
      } catch (e) { /* 保持内存态 */ }
    }

    // 云端自选股：默认组合 pid 探测 + 股票列表（读端点，pysnowball api_ref 同款）
    // 真实账号的默认自选在 stocks 系统分类里（负数 pid，「全部」id=-1 含沪深/港/美股全部），
    // portfolios 字段仅在老接口形态/个人组合账号出现，作为回退。
    function pickCloudPid(data) {
      const cats = data.stocks || []
      for (let i = 0; i < cats.length; i++) {
        const c = cats[i]
        if (c && (c.name === '全部' || c.id === -1) && (c.pid || c.id)) return c.pid || c.id
      }
      if (cats.length && (cats[0].pid || cats[0].id)) return cats[0].pid || cats[0].id
      const portfolios = data.portfolios || []
      const def = portfolios[0] || null
      return def ? (def.pid || def.id || def.portfolio_id || null) : null
    }

    async function fetchCloudWatchlist() {
      const plist = await getJSON('/v5/stock/portfolio/list.json', { system: 'true' }, {})
      const data = (plist && plist.data) || plist || {}
      const pid = pickCloudPid(data)
      if (!pid) return { pid: null, symbols: [] }
      cloudPid = pid
      const s = await getJSON('/v5/stock/portfolio/stock/list.json', { size: 200, category: 1, pid: pid }, {})
      const stocks = ((s && s.data && s.data.stocks) || (s && s.data) || [])
      const symbols = []
      for (let i = 0; i < stocks.length; i++) {
        const sym = stocks[i] && (stocks[i].stock_symbol || stocks[i].symbol)
        if (sym && symbols.indexOf(sym) === -1) symbols.push(sym)
      }
      return { pid: pid, symbols: symbols }
    }

    async function ensureCloudPid() {
      if (cloudPid) return cloudPid
      try { await fetchCloudWatchlist() } catch (e) { /* 未登录或接口变动 */ }
      return cloudPid
    }

    // 云端加/删自选（尽力而为：端点为网页端行为，失败静默回退本地）
    // 云端加/删自选（真实端点：portfolio/stock/add.json / cancel.json，POST form）
    // 写失败静默（下次云端为准同步会纠正本地），成功则双端一致
    async function cloudWatchAdd(symbol) {
      if (!login) return
      await curl(BASE + '/v5/stock/portfolio/stock/add.json', { method: 'POST', body: 'symbols=' + enc(symbol) + '&category=1' })
    }

    async function cloudWatchDelete(symbol) {
      if (!login) return
      await curl(BASE + '/v5/stock/portfolio/stock/cancel.json', { method: 'POST', body: 'symbols=' + enc(symbol) })
    }

    async function actLoginStatus() {
      const lg = await loadLogin()
      const path = await loginFilePath()
      if (!lg) return { loggedIn: false, path: path }
      // 本地 JWT 过期预检：过期则提示重登（不自动清除，等用户确认）
      let expired = false
      const jar = cookieJar(lg.cookie)
      const jwt = jar.xq_id_token ? decodeJwt(jar.xq_id_token) : null
      if (jwt && jwt.exp && Date.now() / 1000 > jwt.exp) expired = true
      // 登录文件缺 uid/screenName 字段时（旧版写入/手工编辑）回退到 JWT 解码值
      let uid = lg.uid || null
      let screenName = lg.screenName || ''
      if (jwt && !expired) {
        if (!uid) uid = jwt.uid || null
        if (!screenName) screenName = String(jwt.cn || jwt.screen_name || jwt.name || '')
      }
      return { loggedIn: !expired, expired: expired, screenName: screenName, uid: uid, path: path, savedAt: lg.savedAt || null }
    }

    async function actLoginSave(args) {
      const cookie = cleanCookieInput(args.cookie)
      if (!cookie || cookie.indexOf('xq_a_token=') === -1) {
        throw new Error('Cookie 中缺少 xq_a_token，请确认复制的是已登录雪球的完整 Cookie 请求头')
      }
      const jar = cookieJar(cookie)
      let uid = null, screenName = ''
      const jwt = jar.xq_id_token ? decodeJwt(jar.xq_id_token) : null
      if (jwt) {
        uid = jwt.uid || null
        screenName = String(jwt.cn || jwt.screen_name || jwt.name || '')
        if (jwt.exp && Date.now() / 1000 > jwt.exp) {
          throw new Error('Cookie 已过期（登录令牌有效期已过），请重新登录雪球后复制新 Cookie')
        }
      }
      if (!uid && jar.u) uid = jar.u
      // 远端校验 + 探测默认自选组合（不走 getJSON 重试链，校验失败直接报给用户）
      const url = BASE + '/v5/stock/portfolio/list.json' + toQuery({ system: 'true' })
      let plist
      try {
        const text = await curl(url, { cookie: cookie })
        plist = JSON.parse(text)
      } catch (e) {
        throw new Error('无法访问雪球校验 Cookie: ' + String((e && e.message) || e))
      }
      const cls = classifyError(plist)
      if (cls) throw new Error('Cookie 校验失败 [' + cls.code + ']: ' + cls.desc + '（请确认浏览器处于登录状态后重新复制）')
      login = { cookie: cookie, uid: uid, screenName: screenName, savedAt: Date.now() }
      cloudPid = null
      await saveLogin()
      // 登录成功即强制同步一次云端自选（云端为准镜像；失败不阻塞登录）
      let symbols = null
      try {
        await maybeAutoSync(true)
        symbols = (watchlist || {}).symbols
      } catch (e) { /* 云端自选拉取失败，保留本地列表 */ }
      return { loggedIn: true, screenName: screenName, uid: uid, symbols: symbols }
    }

    async function actLoginLogout() {
      login = null
      cloudPid = null
      await saveLogin()   // 写入 {} 清空
      return { loggedIn: false }
    }

    async function actWatchlistPull() {
      const lg = await loadLogin()
      if (!lg) throw new Error('未登录：请先在「账号」中粘贴 Cookie 登录')
      const changed = await maybeAutoSync(true)   // 手动按钮：绕过节流强制同步（云端为准镜像）
      if (changed === false) {
        // 同步判定未变化或失败：仍给按钮一个明确的拉取结果
        const cloud = await fetchCloudWatchlist().catch(function () { return { symbols: [] } })
        if (!cloud.symbols.length) throw new Error('同步失败：无法获取云端自选（Cookie 可能已过期）')
      }
      return { symbols: (watchlist || {}).symbols || [] }
    }

    // ---- UI 状态持久化 ----
    async function loadUiState() {
      if (uiState) return uiState
      uiState = { pos: null, tab: 'market', minimized: false }
      const fs = ctx.get('fs')
      const sp = ctx.get('sandboxPolicy')
      const root = sp && sp.workspaceRoot ? sp.workspaceRoot : null
      if (fs) {
        try {
          const text = await stateRead('.xueqiu-ui-state.json', fs, root)
          const parsed = text == null ? null : JSON.parse(text)
          if (parsed && typeof parsed === 'object') uiState = parsed
        } catch (e) { /* 默认状态 */ }
      }
      return uiState
    }

    async function saveUiState() {
      const fs = ctx.get('fs')
      const sp = ctx.get('sandboxPolicy')
      const root = sp && sp.workspaceRoot ? sp.workspaceRoot : null
      if (!fs) return
      try {
        await stateWrite('.xueqiu-ui-state.json', JSON.stringify(uiState), fs, root)
      } catch (e) { /* 保持内存态 */ }
    }

    async function actUiGet() {
      const s = await loadUiState()
      const hNum = Number(s.dockH)
      const validTabs = ['market', 'hot', 'search', 'news']
      return {
        // 损坏状态文件的非法 tab 一律回退（防类型穿透）
        tab: (typeof s.tab === 'string' && validTabs.indexOf(s.tab) >= 0) ? s.tab : 'market',
        // v1.22.8 引入回归：open 字段曾被上一行的行尾注释吞掉，导致客户端刷新后不恢复面板开合状态
        open: s.open !== false,
        dockH: (s.dockH !== undefined && isFinite(hNum) && hNum >= 160 && hNum <= 1200) ? hNum : null,
        badgeW: (s.badgeW !== undefined && isFinite(Number(s.badgeW)) && Number(s.badgeW) >= 120 && Number(s.badgeW) <= 480) ? Number(s.badgeW) : null,
        badgePos: (s.badgePos && isFinite(Number(s.badgePos.x)) && isFinite(Number(s.badgePos.y)))
          ? { x: Number(s.badgePos.x), y: Number(s.badgePos.y) } : null
      }
    }

    async function actUiSet(args) {
      const s = await loadUiState()
      if (args.tab !== undefined) s.tab = String(args.tab)
      if (args.open !== undefined) s.open = !!args.open
      if (args.badgePos && typeof args.badgePos === 'object' && isFinite(Number(args.badgePos.x)) && isFinite(Number(args.badgePos.y))) {
        s.badgePos = { x: Number(args.badgePos.x), y: Number(args.badgePos.y) }
      }
      // null = 显式复位（客户端"双击复位/默认高度"会发送 null）；
      // 不能走 Number(null)=0 的钳制路径，否则复位被写成了下限值(120/160)
      if (args.dockH !== undefined) {
        if (args.dockH === null) { s.dockH = null }
        else {
          const dh = Number(args.dockH)
          if (isFinite(dh)) s.dockH = Math.min(Math.max(dh, 160), 1200)
        }
      }
      if (args.badgeW !== undefined) {
        if (args.badgeW === null) { s.badgeW = null }
        else {
          const bw = Number(args.badgeW)
          if (isFinite(bw)) s.badgeW = Math.min(Math.max(bw, 120), 480)
        }
      }
      await saveUiState()
      return { ok: true }
    }

    // ---- RPC dispatch ----
    const dispatch = {
      quote: actQuote, quoteDetail: actQuoteDetail, kline: actKline, minute: actMinute,
      hot: actHot, search: actSearch, searchPosts: actSearchPosts, news: actNews,
      kol: actKOL, user: actUser, finance: actFinance,
      'watchlist.get': actWatchlistGet, 'watchlist.add': actWatchlistAdd, 'watchlist.remove': actWatchlistRemove,
      'watchlist.pull': actWatchlistPull,
      'login.status': actLoginStatus, 'login.save': actLoginSave, 'login.logout': actLoginLogout,
      'ui.get': actUiGet, 'ui.set': actUiSet,
      debug: async function () {
        return { running: running, waiters: waiters.length, inflight: Array.from(inflight.keys()), cacheKeys: cache.size, cookie: state.cookie ? 'set' : 'none', login: login ? ('uid=' + (login.uid || '?')) : 'anonymous' }
      }
    }

    async function handleCall (req) {
      const reqObj = (req && typeof req === 'object') ? req : {}
      const action = reqObj.action
      const args = reqObj.args || {}
      if (!dispatch[action]) return { ok: false, error: '未知操作: ' + action }
      try {
        const data = await dispatch[action](args)
        return { ok: true, data: sanitize(data) }
      } catch (e) {
        return { ok: false, error: String((e && e.message) || e) }
      }
    }

    // 动态插件运行时提供 harness 门面；静态安装（bundle layer）没有，
    // 改走 webServer 前缀路由，client 用同源 fetch 调 /xq-rpc。
    if (typeof harness !== 'undefined') {
      ctx.effect(function () {
        return harness.handle('xq.call', handleCall)
      })
    } else {
      ctx.inject(['webServer'], function (webCtx) {
        webCtx.effect(function () {
          return webCtx.webServer.register({
          kind: 'prefix',
          path: '/xq-rpc',
          handler: async function (req, res) {
            // 同源栅栏：Host 头必须是回环，Origin 必须存在且同源（防 DNS rebinding/CSRF/无 Origin 的跨进程直调）
            const hostHeader = String(req.headers.host || '')
            const origin = req.headers.origin ? String(req.headers.origin) : ''
            // 端口剥离：要求冒号前存在非冒号字符——裸 IPv6 '::1' 不会被误剥末尾 ':1'（曾致白名单死代码）
            const hostAuth = hostHeader.replace(/^(.*[^:]):\d+$/, '$1')
            const loopback = hostAuth === '127.0.0.1' || hostAuth === 'localhost' || hostAuth === '[::1]' || hostAuth === '::1'
            if (!loopback) { res.writeHead(403); res.end('forbidden'); return }
            // 浏览器对（哪怕同源的）POST fetch 必带 Origin；无 Origin 一律拒绝（curl/本机进程裸调）
            if (!origin || (origin !== 'http://' + hostHeader && origin !== 'https://' + hostHeader)) {
              res.writeHead(403); res.end('forbidden'); return
            }
            const chunks = []
            let received = 0
            for await (const c of req) {
              received += c.length
              if (received > 1048576) { res.writeHead(413); res.end('payload too large'); return }   // 1MB 上限：防失控本地进程 OOM
              chunks.push(c)
            }
            let body = {}
            try { body = JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}') } catch (e) { body = {} }
            const result = await handleCall(body)
            const text = JSON.stringify(result)
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' })
            res.end(text)
          }
          })
        })
      })
    }

    // ---- Agent 工具（一期 6 个）：模型在对话中直接查询雪球数据 ----
    // 输出统一为 JSON 字符串（对齐 dsh-us-stocks 的 jsonOutput 模式，schema 简单、渲染即文本）。
    function xqToolOutput() {
      return {
        schema: { type: 'string' },
        render: function (_args, value) { return [{ type: 'text', text: String(value) }] }
      }
    }
    function xqIso(ms) {
      // 本地时区格式化（toISOString 是 UTC，中文环境会差 8 小时）
      const d = new Date(Number(ms))
      if (isNaN(d.getTime())) return null
      const p = function (n) { return (n < 10 ? '0' : '') + n }
      return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()) + ' ' + p(d.getHours()) + ':' + p(d.getMinutes()) + ':' + p(d.getSeconds())
    }

    const XQ_AGENT_TOOLS = [
      {
        name: 'xueqiu_quote',
        description: '获取股票/指数实时行情快照（雪球数据源，支持A股/港股/美股/指数/ETF）。\n\n何时使用：用户问"XX现在多少钱"、"XX今天涨跌多少"、"XX市值/市盈率多少"，或需要多只股票的当前价格做对比、计算持仓市值时。\n\n输入：symbols 为雪球代码，逗号分隔，一次最多 20 只。代码格式：A股 SH600519/SZ300750（贵茅台/宁德），港股 00700（腾讯），美股 AAPL/TSLA，指数 SH000001（上证）。用户只说中文名或 ticker 时，先用 xueqiu_search 查代码。\n\n输出：每只返回 symbol、name、current（现价）、percent（涨跌幅%）、chg（涨跌额）、open/high/low、last_close（昨收）、volume/amount（量/额；volume 单位为股，A股 1手=100股，换算手数请 ÷100）、market_capital（市值）、pe_ttm、pb、turnover_rate。港股美股实时，A股盘中实时。',
        parameters: {
          type: 'object',
          properties: {
            symbols: { type: 'string', description: '雪球代码，逗号分隔，如 "SH600519,00700,AAPL"' }
          },
          required: ['symbols'],
          additionalProperties: true
        },
        output: xqToolOutput(),
        timeoutMs: 30000,
        async execute(args) {
          const list = String(args.symbols || '').split(',').map(function (s) { return s.trim() }).filter(Boolean).slice(0, 20)
          const r = await actQuote({ symbols: list })
          const rows = (r.list || []).map(function (q) {
            return {
              symbol: q.symbol, name: q.name, current: q.current, percent: q.percent, chg: q.chg,
              open: q.open, last_close: q.last_close, high: q.high, low: q.low,
              volume: q.volume, amount: q.amount, market_capital: q.market_capital,
              pe_ttm: q.pe_ttm, pb: q.pb, turnover_rate: q.turnover_rate
            }
          })
          return JSON.stringify({ status: r.status, count: rows.length, list: rows })
        }
      },
      {
        name: 'xueqiu_kline',
        description: '获取历史K线（OHLCV + 涨跌幅），用于走势分析和技术计算。\n\n何时使用：用户问"XX最近的走势"、"最近一个月涨了多少"，或需要计算均线/区间涨跌幅/波动率等技术指标时。只要最新价格就够的话用 xueqiu_quote，别拉K线。\n\n输入：symbol 为单只雪球代码（如 SH600519）；period 可选 1m/5m/15m/30m/60m/day/week/month（默认 day）；count 5–250 根（默认 60，含最新一根）。\n\n输出：按时间升序的数组，每根含 time（本地时区 ISO）、open/high/low/close、volume（单位为股，A股 1手=100股）、percent（该根涨跌幅%）。可直接用于计算区间涨跌 = (末根 close / 首根前收盘 - 1)。',
        parameters: {
          type: 'object',
          properties: {
            symbol: { type: 'string', description: '雪球代码，如 SH600519' },
            period: { type: 'string', enum: ['1m', '5m', '15m', '30m', '60m', 'day', 'week', 'month'], description: 'K线周期，默认 day' },
            count: { type: 'number', description: '返回根数 5–250，默认 60' }
          },
          required: ['symbol'],
          additionalProperties: true
        },
        output: xqToolOutput(),
        timeoutMs: 30000,
        async execute(args) {
          const r = await actKline({
            symbol: String(args.symbol || ''),
            period: String(args.period || 'day'),
            count: Math.min(Math.max(parseInt(args.count, 10) || 60, 5), 250)
          })
          const rows = (r.rows || []).map(function (k) {
            return { time: xqIso(k.timestamp), open: k.open, high: k.high, low: k.low, close: k.close, volume: k.volume, percent: k.percent }
          })
          if (!rows.length) return JSON.stringify({ error: '无K线数据（检查代码是否正确，如 SH600519）' })
          return JSON.stringify({ symbol: String(args.symbol || ''), period: String(args.period || 'day'), count: rows.length, rows: rows })
        }
      },
      {
        name: 'xueqiu_search',
        description: '按名称/拼音/代码搜索雪球证券，把用户口中的股票名解析为雪球代码。\n\n何时使用：用户提到股票中文名（"茅台"、"腾讯"）、ticker（"AAPL"、"TSLA"）或纯代码（"600519"），而你不确定对应的雪球代码时，先调本工具再调 xueqiu_quote / xueqiu_kline。支持A股/港股/美股/指数/ETF。\n\n输入：q 为搜索词（中文名、全拼如 maotai、代码或 ticker）。\n\n输出：候选列表（代码+名称），按相关度排序；同名/近似名多只时取第一条或多条并列让用户确认。',
        parameters: {
          type: 'object',
          properties: {
            q: { type: 'string', description: '搜索词：中文名、拼音、代码或 ticker' }
          },
          required: ['q'],
          additionalProperties: true
        },
        output: xqToolOutput(),
        timeoutMs: 30000,
        async execute(args) {
          const r = await actSearch({ q: String(args.q || ''), count: 10 })
          return JSON.stringify({ count: (r.list || []).length, list: r.list || [] })
        }
      },
      {
        name: 'xueqiu_hot',
        description: '获取雪球热门股票榜（按社区讨论热度排名，非涨幅榜）。\n\n何时使用：用户问"今天什么股票最火"、"大家在讨论什么股票"、"雪球热榜"，或想了解当前市场关注度集中在哪里时。\n\n输入：market 可选 cn（A股，默认）/ hk（港股）/ us（美股）/ global（全球）；size 1–30 条（默认 10）。\n\n输出：每条含 symbol、name、current、percent、rank_change（排名变化，正数=热度上升）。注意这是热度榜：下跌的股票讨论激烈也会上榜。',
        parameters: {
          type: 'object',
          properties: {
            market: { type: 'string', enum: ['cn', 'hk', 'us', 'global'], description: '市场，默认 cn' },
            size: { type: 'number', description: '返回条数 1–30，默认 10' }
          },
          required: [],
          additionalProperties: true
        },
        output: xqToolOutput(),
        timeoutMs: 30000,
        async execute(args) {
          const r = await actHot({
            market: String(args.market || 'cn'),
            size: Math.min(Math.max(parseInt(args.size, 10) || 10, 1), 30)
          })
          const rows = (r.list || []).map(function (h) {
            return { symbol: h.symbol, name: h.name, current: h.current, percent: h.percent, rank_change: h.rank_change }
          })
          return JSON.stringify({ market: String(args.market || 'cn'), count: rows.length, list: rows })
        }
      },
      {
        name: 'xueqiu_news',
        description: '获取雪球7×24实时财经快讯流（A股/港美股/宏观）。\n\n何时使用：用户问"今天有什么财经新闻"、"盘中有什么消息"、"刚才发生了什么"，或需要市场背景信息辅助解读行情时。\n\n输入：count 1–30 条（默认 15，上游每页约 10 条，超出时自动向后翻页补足）；max_id 为翻页游标——需要看更早的历史时，传上一页返回的 oldest_id。\n\n输出：按时间降序的快讯数组，每条含 time、text、mark（1=重要，其余为普通）；返回值带 oldest_id 供继续翻页。',
        parameters: {
          type: 'object',
          properties: {
            count: { type: 'number', description: '返回条数 1–30，默认 15' },
            max_id: { type: 'number', description: '翻页游标：上一页最旧一条的 id' }
          },
          required: [],
          additionalProperties: true
        },
        output: xqToolOutput(),
        timeoutMs: 30000,
        async execute(args) {
          // 上游固定每页 ~10 条且忽略 count 参数：请求多于 10 条时用 max_id 自动翻页补足
          const want = Math.min(Math.max(parseInt(args.count, 10) || 15, 1), 30)
          const rows = []
          let cursor = args.max_id
          for (let page = 0; page < 3 && rows.length < want; page++) {
            const r = await actNews({ count: 30, max_id: cursor })
            const items = r.items || []
            if (!items.length) break
            for (let i = 0; i < items.length && rows.length < want; i++) {
              const n = items[i]
              rows.push({ id: n.id, time: xqIso(n.created_at), mark: n.mark, text: String(n.text || '').slice(0, 160) })
            }
            cursor = items[items.length - 1].id
          }
          return JSON.stringify({ count: rows.length, oldest_id: rows.length ? rows[rows.length - 1].id : null, items: rows })
        }
      },
      {
        name: 'xueqiu_kol',
        description: '查询某只股票在雪球社区讨论最热的投资大V（KOL），了解聪明钱的关注面。\n\n何时使用：用户问"XX有哪些大V在关注"、"雪球上谁在讨论XX"，或想从社区视角评估一只股票的关注质量时。\n\n输入：symbol 为雪球代码（如 SH600519，不确定就用 xueqiu_search 查）；count 1–10 条（默认 8）。\n\n输出：KOL 列表，每条含 screen_name（昵称）、followers_count（粉丝数）、verified（是否认证）、description（简介）。',
        parameters: {
          type: 'object',
          properties: {
            symbol: { type: 'string', description: '雪球代码，如 SH600519' },
            count: { type: 'number', description: '返回条数 1–10，默认 8' }
          },
          required: ['symbol'],
          additionalProperties: true
        },
        output: xqToolOutput(),
        timeoutMs: 30000,
        async execute(args) {
          const r = await actKOL({
            symbol: String(args.symbol || ''),
            count: Math.min(Math.max(parseInt(args.count, 10) || 8, 1), 10)
          })
          const rows = (r.list || []).map(function (u) {
            return { screen_name: u.screen_name, followers_count: u.followers_count, verified: !!u.verified, description: String(u.description || '').slice(0, 80) }
          })
          return JSON.stringify({ symbol: String(args.symbol || ''), count: rows.length, list: rows })
        }
      }
    ]

    // 注册：动态环境走 harness 门面（defineTool 会做标记+校验）；
    // 静态 bundle 层没有 harness，参数已是 JSON Schema 根，直接注册 plain 对象
    // （tools 服务在静态路径无 defineTool 守卫），用 inject 等服务就绪。
    // 统一包装 execute：args 为 null/undefined 时兜底 {}（工具层直解引用会抛 TypeError）
    function wrapToolSpec(spec) {
      const raw = spec.execute
      if (!raw) return spec
      return Object.assign({}, spec, { execute: function (args) { return raw.call(this, args || {}) } })
    }
    if (typeof harness !== 'undefined') {
      for (let i = 0; i < XQ_AGENT_TOOLS.length; i++) {
        const spec = XQ_AGENT_TOOLS[i]
        ctx.effect(function () {
          return harness.registerTool(ctx, harness.defineTool(wrapToolSpec(spec)))
        })
      }
    } else {
      ctx.inject(['tools'], function (toolsCtx) {
        for (let i = 0; i < XQ_AGENT_TOOLS.length; i++) {
          const spec = XQ_AGENT_TOOLS[i]
          toolsCtx.effect(function () {
            return toolsCtx.tools.register(wrapToolSpec(spec))
          })
        }
      })
    }
  }
}
