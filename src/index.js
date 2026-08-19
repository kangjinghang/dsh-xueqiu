export default {
  inject: ['timer'],
  apply(ctx) {
    const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    const BASE = 'https://stock.xueqiu.com'
    const SITE = 'https://www.xueqiu.com'
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

    function cacheGet(key, ttl) {
      const e = cache.get(key)
      if (e && ttl > 0 && Date.now() - e.at < ttl) return e.value
      return undefined
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
      // 雪球主域 302 → www.xueqiu.com，必须 -L 跟随才能拿到 Set-Cookie
      const cmd = "curl -s -L --max-time 12 -D - -o /dev/null 'https://www.xueqiu.com/' -H 'User-Agent: " + UA + "'"
      const spec = shell.resolve({ command: cmd, timeoutMs: 15000, stdoutMaxBytes: 65536 })
      const res = await shell.run(spec)
      if (res.exitCode !== 0) return ''
      const seen = {}
      const pairs = []
      const lines = String(res.stdout.text || '').split('\n')
      for (let i = 0; i < lines.length; i++) {
        const m = /^set-cookie:\s*([^=;\s]+)=([^;]*)/i.exec(lines[i].trim())
        if (m && !seen[m[1]]) { seen[m[1]] = true; pairs.push(m[1] + '=' + m[2]) }
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
      // 登录态优先：请求头用用户 Cookie；显式 cookie 参数（登录校验）最高
      const cookie = opts.cookie !== undefined ? opts.cookie : (login ? login.cookie : await ensureCookie(false))
      let cmd = "curl -s --max-time 12 -X " + (opts.method || 'GET') + " '" + url + "'"
      cmd += " -H 'User-Agent: " + UA + "'"
      cmd += " -H 'Referer: https://www.xueqiu.com/'"
      cmd += " -H 'Accept: application/json'"
      if (cookie) cmd += " -H 'Cookie: " + cookie + "'"
      if (opts.body) {
        cmd += " -H 'Content-Type: application/x-www-form-urlencoded' --data '" + String(opts.body).replace(/'/g, '%27') + "'"
      }
      const spec = shell.resolve({ command: cmd, timeoutMs: 15000, stdoutMaxBytes: 4194304 })
      const result = await shell.run(spec)
      if (result.exitCode !== 0) {
        const err = ((result.stderr && result.stderr.text) || '').slice(0, 200)
        throw new Error('curl 失败 (' + result.exitCode + '): ' + err)
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

      async function attempt(depth) {
        const err = await (async function () {
          let text
          try { text = await curl(url, { cookie: opts.cookie }) } catch (e) { return { kind: 'network', message: e.message, retryable: depth < 1 } }
          if (!text) return { kind: 'empty', message: '雪球返回空响应（可能被风控）', retryable: true }
          let data
          try { data = JSON.parse(text) } catch (e) { return { kind: 'parse', message: '响应解析失败: ' + text.slice(0, 120), retryable: false } }
          const cls = classifyError(data)
          if (cls) return { kind: cls.kind, message: cls.desc, code: cls.code, retryable: cls.retryable }
          // kline 陷阱：缺 u cookie 时返回 200 + 空 items 且无 column（静默失败）
          const d = data && data.data
          if (path.indexOf('/chart/kline') !== -1 && d && typeof d === 'object'
            && !Array.isArray(d.column) && String(d.items_size || '0') === '0') {
            return { kind: 'empty_kline', message: 'kline 空数据（cookie 种子可能不完整）', retryable: true }
          }
          return { data: data }
        })()

        if (!err.kind) return err.data
        if (!err.retryable || depth >= 2) throw new Error('[' + err.kind + '] ' + err.message)

        if (err.kind === 'cookie_expired' || err.kind === 'empty' || err.kind === 'empty_kline') {
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
        if (ttl > 0) cache.set(url, { at: Date.now(), value: data })
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
      const period = String(args.period || 'day')
      const count = Math.min(Math.max(parseInt(args.count, 10) || 120, 5), 500)
      const symbol = String(args.symbol || '')
      // begin 按分钟取整，保证 TTL 窗口内缓存 key 稳定（count 为负，返回的是最近 N 根）
      const begin = Math.floor(Date.now() / 60000) * 60000
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

    // ---- watchlist ----
    async function loadWatchlist() {
      if (watchlist) return watchlist
      watchlist = { symbols: DEFAULT_WATCHLIST.slice() }
      const fs = ctx.get('fs')
      const sp = ctx.get('sandboxPolicy')
      const root = sp && sp.workspaceRoot ? sp.workspaceRoot : null
      if (fs && root) {
        try {
          const target = await fs.resolve('.xueqiu-watchlist.json', { cwd: root })
          const text = await fs.readText(target)
          const parsed = JSON.parse(text)
          if (parsed && Array.isArray(parsed.symbols) && parsed.symbols.length) {
            watchlist = { symbols: parsed.symbols.slice(0, 50) }
          }
        } catch (e) { /* 首次运行或无写权限时使用默认列表 */ }
      }
      return watchlist
    }

    async function saveWatchlist() {
      const fs = ctx.get('fs')
      const sp = ctx.get('sandboxPolicy')
      const root = sp && sp.workspaceRoot ? sp.workspaceRoot : null
      if (!fs || !root) return
      try {
        const target = await fs.resolve('.xueqiu-watchlist.json', { cwd: root })
        await fs.writeText(target, JSON.stringify(watchlist))
      } catch (e) { /* 保持内存态 */ }
    }

    async function actWatchlistGet() {
      const wl = await loadWatchlist()
      return { symbols: wl.symbols }
    }

    async function actWatchlistAdd(args) {
      const symbol = String(args.symbol || '')
      if (!/^[A-Za-z0-9_.]+$/.test(symbol)) throw new Error('无效代码: ' + symbol)
      const wl = await loadWatchlist()
      if (wl.symbols.indexOf(symbol) === -1) {
        wl.symbols.push(symbol)
        await saveWatchlist()
        cloudWatchAdd(symbol)   // 尽力而为：云端添加失败不影响本地
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
        cloudWatchDelete(symbol)   // 尽力而为：云端删除失败不影响本地
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

    async function loadLogin() {
      if (login !== null) return login
      const fs = ctx.get('fs')
      const sp = ctx.get('sandboxPolicy')
      const root = sp && sp.workspaceRoot ? sp.workspaceRoot : null
      if (fs && root) {
        try {
          const target = await fs.resolve('.xueqiu-login.json', { cwd: root })
          const text = await fs.readText(target)
          const parsed = JSON.parse(text)
          if (parsed && parsed.cookie && /xq_a_token=/.test(parsed.cookie)) login = parsed
        } catch (e) { /* 未登录 */ }
      }
      return login
    }

    async function saveLogin() {
      const fs = ctx.get('fs')
      const sp = ctx.get('sandboxPolicy')
      const root = sp && sp.workspaceRoot ? sp.workspaceRoot : null
      if (!fs || !root) return
      try {
        const target = await fs.resolve('.xueqiu-login.json', { cwd: root })
        await fs.writeText(target, JSON.stringify(login || {}))
      } catch (e) { /* 保持内存态 */ }
    }

    // 云端自选股：默认组合 pid 探测 + 股票列表（端点来自 pysnowball api_ref）
    async function fetchCloudWatchlist() {
      const plist = await getJSON('/v5/stock/portfolio/list.json', { system: 'true' }, {})
      const data = (plist && plist.data) || plist || {}
      const portfolios = data.portfolios || []
      const def = portfolios[0] || null
      const pid = def ? (def.pid || def.id || def.portfolio_id) : null
      if (def && !pid && def.portfolio_id) return { pid: null, symbols: [] }
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
    async function cloudWatchAdd(symbol) {
      if (!login) return
      const pid = await ensureCloudPid()
      if (!pid) return
      await curl(BASE + '/v5/stock/watch.json?symbol=' + enc(symbol) + '&pid=' + enc(pid), { method: 'POST', body: 'flag=1' })
    }

    async function cloudWatchDelete(symbol) {
      if (!login) return
      const pid = await ensureCloudPid()
      if (!pid) return
      await curl(BASE + '/v5/stock/watch.json?symbol=' + enc(symbol) + '&pid=' + enc(pid), { method: 'DELETE' })
    }

    async function actLoginStatus() {
      const lg = await loadLogin()
      if (!lg) return { loggedIn: false }
      // 本地 JWT 过期预检：过期则提示重登（不自动清除，等用户确认）
      let expired = false
      const jar = cookieJar(lg.cookie)
      const jwt = jar.xq_id_token ? decodeJwt(jar.xq_id_token) : null
      if (jwt && jwt.exp && Date.now() / 1000 > jwt.exp) expired = true
      return { loggedIn: !expired, expired: expired, screenName: lg.screenName || '', uid: lg.uid || null }
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
      // 登录成功即拉一次云端自选覆盖本地（失败不阻塞登录）
      let symbols = null
      try {
        const cloud = await fetchCloudWatchlist()
        if (cloud.symbols && cloud.symbols.length) {
          watchlist = { symbols: cloud.symbols.slice(0, 50) }
          await saveWatchlist()
          symbols = watchlist.symbols
        }
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
      const cloud = await fetchCloudWatchlist()
      if (cloud.symbols.length) {
        watchlist = { symbols: cloud.symbols.slice(0, 50) }
        await saveWatchlist()
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
      if (fs && root) {
        try {
          const target = await fs.resolve('.xueqiu-ui-state.json', { cwd: root })
          const text = await fs.readText(target)
          const parsed = JSON.parse(text)
          if (parsed && typeof parsed === 'object') uiState = parsed
        } catch (e) { /* 默认状态 */ }
      }
      return uiState
    }

    async function saveUiState() {
      const fs = ctx.get('fs')
      const sp = ctx.get('sandboxPolicy')
      const root = sp && sp.workspaceRoot ? sp.workspaceRoot : null
      if (!fs || !root) return
      try {
        const target = await fs.resolve('.xueqiu-ui-state.json', { cwd: root })
        await fs.writeText(target, JSON.stringify(uiState))
      } catch (e) { /* 保持内存态 */ }
    }

    async function actUiGet() {
      const s = await loadUiState()
      const hNum = Number(s.dockH)
      return {
        tab: s.tab || 'market', open: s.open !== false,
        dockH: (s.dockH !== undefined && isFinite(hNum) && hNum >= 160 && hNum <= 1200) ? hNum : null,
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
      if (args.dockH !== undefined) {
        const dh = Number(args.dockH)
        if (isFinite(dh)) s.dockH = Math.min(Math.max(dh, 160), 1200)
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
            // 同源栅栏：Host 头必须是回环，带 Origin 时必须同源（防 DNS rebinding/CSRF）
            const hostHeader = String(req.headers.host || '')
            const origin = req.headers.origin ? String(req.headers.origin) : ''
            const hostAuth = hostHeader.replace(/:\d+$/, '')
            const loopback = hostAuth === '127.0.0.1' || hostAuth === 'localhost' || hostAuth === '[::1]' || hostAuth === '::1'
            if (!loopback) { res.writeHead(403); res.end('forbidden'); return }
            if (origin && origin !== 'http://' + hostHeader && origin !== 'https://' + hostHeader) {
              res.writeHead(403); res.end('forbidden'); return
            }
            const chunks = []
            for await (const c of req) chunks.push(c)
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
  }
}
