export default {

  apply(ctx) {
    const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    const BASE = 'https://stock.xueqiu.com'
    const SITE = 'https://www.xueqiu.com'
    const DEFAULT_WATCHLIST = ['SH600519', 'SZ300750', 'SZ002594', 'SH601318', '00700', 'AAPL']

    const state = { cookie: '' }
    let watchlist = null
    let uiState = null

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

    async function ensureCookie(force) {
      if (state.cookie && !force) return state.cookie
      const shell = getShell()
      if (!shell) return ''
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
      // kline 端点要求 cookie 里存在 u=<id>（值任意）；无登录态时补一个随机 u
      if (!seen.u) pairs.push('u=' + String(Date.now()) + String(Math.floor(Math.random() * 1e6)))
      state.cookie = pairs.join('; ')
      return state.cookie
    }

    async function curl(url) {
      const shell = getShell()
      if (!shell) throw new Error('shell 服务不可用，无法访问雪球')
      const cookie = await ensureCookie(false)
      let cmd = "curl -s --max-time 12 '" + url + "'"
      cmd += " -H 'User-Agent: " + UA + "'"
      cmd += " -H 'Referer: https://www.xueqiu.com/'"
      cmd += " -H 'Accept: application/json'"
      if (cookie) cmd += " -H 'Cookie: " + cookie + "'"
      const spec = shell.resolve({ command: cmd, timeoutMs: 15000, stdoutMaxBytes: 4194304 })
      const result = await shell.run(spec)
      if (result.exitCode !== 0) {
        const err = ((result.stderr && result.stderr.text) || '').slice(0, 200)
        throw new Error('curl 失败 (' + result.exitCode + '): ' + err)
      }
      return String(result.stdout.text || '')
    }

    async function getJSON(path, params, base, depth) {
      const url = (base || BASE) + path + toQuery(params || {})
      let text = await curl(url)
      if (!text && state.cookie) {
        await ensureCookie(true)
        text = await curl(url)
      }
      if (!text) throw new Error('雪球返回空响应（可能被风控，稍后再试）')
      let data
      try { data = JSON.parse(text) } catch (e) { throw new Error('雪球响应解析失败: ' + text.slice(0, 120)) }
      if (data && data.error_code && data.error_code !== 0) {
        const code = String(data.error_code)
        const desc = (data.error_description || ('雪球错误 ' + code)).slice(0, 120)
        if (code === '400016' && depth < 2) {
          await ensureCookie(true)
          return getJSON(path, params, base, (depth || 0) + 1)
        }
        throw new Error(desc)
      }
      return data
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
      const data = await getJSON('/v5/stock/batch/quote.json', { symbol: list.join(',') })
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
      const data = await getJSON('/v5/stock/quote.json', { symbol: symbol, extend: 'detail' })
      return { quote: pickQuote(data.data && data.data.quote), market: data.data && data.data.market }
    }

    async function actKline(args) {
      const period = String(args.period || 'day')
      const count = Math.min(Math.max(parseInt(args.count, 10) || 120, 5), 500)
      const symbol = String(args.symbol || '')
      const data = await getJSON('/v5/stock/chart/kline.json', {
        symbol: symbol, period: period, type: 'before', begin: Date.now(),
        count: -count, indicator: 'kline,pe,pb,ps,pcf,market_capital'
      })
      return mapKline(data)
    }

    async function actMinute(args) {
      const symbol = String(args.symbol || '')
      const data = await getJSON('/v5/stock/chart/minute.json', { symbol: symbol, period: '1d' })
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
      const data = await getJSON('/v5/stock/hot_stock/list.json', { type: typeMap[market] || 12, size: size })
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
      const data = await getJSON('/query/v1/suggest_stock.json', { q: q, count: Math.min(parseInt(args.count, 10) || 8, 20) }, SITE)
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
      const data = await getJSON('/query/v1/search/status.json', { q: q, count: Math.min(parseInt(args.count, 10) || 10, 30) }, SITE)
      return { list: mapPosts(data && data.list) }
    }

    async function actNews(args) {
      const count = Math.min(Math.max(parseInt(args.count, 10) || 20, 1), 50)
      const data = await getJSON('/statuses/livenews/list.json', { since_id: -1, max_id: -1, count: count }, SITE)
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
      const data = await getJSON('/recommend/user/stock_hot_user.json', { symbol: symbol, start: 0, count: count }, SITE)
      return { list: mapKOL(data) }
    }

    async function actUser(args) {
      const userId = String(args.userId || args.id || '')
      if (!userId) return { user: null, posts: [] }
      const data = await getJSON('/statuses/user_timeline.json', { user_id: userId, page: 1, count: Math.min(parseInt(args.count, 10) || 10, 30) }, SITE)
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
      const data = await getJSON('/v5/stock/finance/cn/indicator.json', { symbol: symbol, type: 'all', is_detail: 'true', count: 4 })
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
      }
      return { symbols: wl.symbols }
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
      return {
        tab: s.tab || 'market', open: s.open !== false,
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
      await saveUiState()
      return { ok: true }
    }

    // ---- RPC dispatch ----
    const dispatch = {
      quote: actQuote, quoteDetail: actQuoteDetail, kline: actKline, minute: actMinute,
      hot: actHot, search: actSearch, searchPosts: actSearchPosts, news: actNews,
      kol: actKOL, user: actUser, finance: actFinance,
      'watchlist.get': actWatchlistGet, 'watchlist.add': actWatchlistAdd, 'watchlist.remove': actWatchlistRemove,
      'ui.get': actUiGet, 'ui.set': actUiSet
    }

    ctx.effect(function () {
      return harness.handle('xq.call', async function (req) {
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
      })
    })
  }
}
