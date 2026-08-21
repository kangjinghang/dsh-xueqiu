// 真实数据测试：走本机 curl 直连雪球（与插件相同的请求路径）。运行: node qa/live.mjs
// 注意会消耗真实请求配额（约 30 个上游请求），不要高频重复跑。
import { loadPlugin, makeCtx, realShell } from './mock-ctx.js'

let pass = 0, fail = 0, warn = 0
function ok(cond, name) { if (cond) { pass++; console.log('  ✅ ' + name) } else { fail++; console.log('  ❌ ' + name) } }
function warnIf(cond, name) { if (cond) { warn++; console.log('  ⚠️ ' + name) } }

const plugin = loadPlugin()
const ctx = makeCtx({ shell: realShell() })
const call = await pluginApi(plugin, ctx)
function pluginApi(p, c) {
  let handler = null
  globalThis.harness = { handle: (m, h) => { handler = h; return () => {} }, registerTool: () => () => {}, defineTool: (s) => s }
  p.apply(c)
  delete globalThis.harness
  return async (action, args) => handler({ action, args: args || {} })
}

console.log('== L1 行情 (quote/quoteDetail/minute) ==')
{
  const r = await call('quote', { symbols: ['SH600519', '00700', 'AAPL', 'SH000001'] })
  ok(r.ok && r.data.list.length === 4, 'quote 混合 A股/港/美/指数 4 只全部返回')
  const moutai = r.data.list.find((q) => q.symbol === 'SH600519')
  ok(moutai && moutai.name.includes('茅台'), '茅台名称正确')
  ok(moutai && Number(moutai.current) > 100, '茅台现价 >100 (' + moutai.current + ')')
  const idx = r.data.list.find((q) => q.symbol === 'SH000001')
  ok(idx && idx.name.includes('上证'), '上证指数识别')
  ok(r.data.list.every((q) => q.percent !== null && q.percent !== undefined), '全部有涨跌幅')
}
{
  const r = await call('quoteDetail', { symbol: 'SH600519' })
  ok(r.ok && r.data.quote && r.data.market, 'quoteDetail 返回 quote+market')
}
{
  const r = await call('minute', { symbol: 'SH600519' })
  // 开盘后每分钟一个点；盘外则接近 240。只要 >30 即证明分时链路正常
  ok(r.ok && r.data.items.length > 30, 'minute 分时数据点数合理 (' + r.data.items.length + ')')
  ok(r.data.last_close !== null, 'minute 有昨收基准')
}

console.log('== L2 K线 ==')
for (const period of ['day', 'week', '60m', '5m']) {
  const r = await call('kline', { symbol: 'SH600519', period, count: 30 })
  ok(r.ok && r.data.rows.length >= 20 && r.data.rows.length <= 30, `kline ${period} 返回 ${r.data.rows.length} 根`)
  if (r.ok) {
    const bad = r.data.rows.filter((k) => !(k.high >= k.low && k.high >= k.open && k.high >= k.close && k.low <= Math.min(k.open, k.close)))
    ok(bad.length === 0, `kline ${period} OHLC 一致性(high>=low,high>=open/close)`)
    const ts = r.data.rows.map((k) => k.timestamp)
    ok(ts.every((t, i) => i === 0 || t > ts[i - 1]), `kline ${period} 时间升序`)
  }
}
{
  // 传入超范围 count → RPC 层钳制 5..500
  const r = await call('kline', { symbol: 'SH600519', count: 99999 })
  ok(r.ok && r.data.rows.length <= 500, 'kline count 超上限被钳制 (' + r.data.rows.length + ')')
}
{
  // begin 翻页：取第一页最早一根往前取历史
  const p1 = await call('kline', { symbol: 'SH600519', count: 20 })
  const earliest = p1.data.rows[0].timestamp
  const p2 = await call('kline', { symbol: 'SH600519', count: 20, begin: earliest })
  ok(p2.ok && p2.data.rows[p2.data.rows.length - 1].timestamp === earliest && p2.data.rows.slice(0, -1).every((k) => k.timestamp < earliest), 'kline begin 翻页取更早历史(含边界根)')
}

console.log('== L3 热榜/搜索/帖子 ==')
{
  const r = await call('hot', { market: 'cn', size: 10 })
  ok(r.ok && r.data.list.length === 10, 'hot cn 返回 10 条')
  ok(r.data.list.every((h) => h.symbol && h.name), 'hot 每条有 symbol+name')
  const hk = await call('hot', { market: 'hk', size: 5 })
  ok(hk.ok && hk.data.list.length >= 1, 'hot hk 有数据')
}
{
  for (const q of ['茅台', 'maotai', '600519', 'AAPL']) {
    const r = await call('search', { q })
    ok(r.ok && r.data.list.length > 0, `search "${q}" 有候选`)
    if (q === '600519') ok(r.data.list.some((it) => it.code === 'SH600519'), 'search 600519 命中 SH600519')
    if (q === 'AAPL') ok(r.data.list.some((it) => String(it.code).toUpperCase().includes('AAPL')), 'search AAPL 命中美股')
  }
  const empty = await call('search', { q: '' })
  ok(empty.ok && empty.data.list.length === 0, 'search 空串返回空列表(不发请求)')
}
{
  const r = await call('searchPosts', { q: '贵州茅台', count: 5 })
  ok(r.ok, 'searchPosts 返回')
  warnIf(r.data.list.length === 0, 'searchPosts 0 条（可能需登录态，正常可接受）')
}

console.log('== L4 快讯/翻页 ==')
{
  const p1 = await call('news', { count: 15 })
  // 已知问题 F3(P3): 上游忽略 count 参数，匿名固定返回 10 条
  ok(p1.ok && p1.data.items.length > 0 && p1.data.items.length <= 10, 'news 第一页返回条数 (' + p1.data.items.length + ', 上游固定10)')
  const ids = p1.data.items.map((n) => n.id)
  ok(new Set(ids).size === ids.length, 'news id 无重复')
  const ts = p1.data.items.map((n) => n.created_at)
  ok(ts.every((t, i) => i === 0 || t <= ts[i - 1]), 'news 时间降序')
  const oldest = ids[ids.length - 1]
  const p2 = await call('news', { count: 15, max_id: oldest })
  ok(p2.ok && p2.data.items.length > 0, 'news max_id 翻页有结果')
  ok(p2.data.items.every((n) => n.id < oldest), 'news 翻页全是更早的条目')
}

console.log('== L5 KOL/用户/财务 ==')
{
  const r = await call('kol', { symbol: 'SH600519', count: 5 })
  ok(r.ok && r.data.list.length > 0, 'kol 茅台有热议用户 (' + r.data.list.length + ')')
  ok(r.data.list.every((u) => u.screen_name && typeof u.followers_count === 'number'), 'kol 每条有昵称+粉丝数')
}
{
  const kol1 = (await call('kol', { symbol: 'SH600519' })).data.list[0]
  const r = await call('user', { userId: String(kol1.id), count: 3 })
  ok(r.ok && r.data.user && r.data.posts.length > 0, 'user 按 KOL id 拉时间线')
}
{
  const r = await call('finance', { symbol: 'SH600519' })
  ok(r.ok && r.data.list.length > 0, 'finance 茅台有财报指标')
  const latest = r.data.list[0]
  ok(latest.report_date && latest.basic_eps !== null, 'finance 最新期有 EPS')
}

console.log('== L6 异常输入 ==')
{
  const r = await call('quote', { symbols: 'NOT_A_CODE_12345' })
  ok(r.ok && r.data.list.length === 0, 'quote 不存在的代码返回空列表不崩')
}
{
  const r = await call('kline', { symbol: 'XX000000' })
  // 已知问题 F2(P3): 无效代码返回 [empty_kline] 结构化错误（文案误导为 cookie 问题，实际应提示代码不正确）
  ok(!r.ok && /empty_kline/.test(r.error), 'kline 无效代码返回结构化错误不崩')
}
{
  const r = await call('hot', { market: 'mars', size: 100 })
  ok(r.ok && r.data.list.length > 0, 'hot 非法 market 回退 cn')
}
{
  const r = await call('news', { count: 'abc' })
  ok(r.ok && r.data.items.length > 0, 'news count 非数字回退默认')
}
{
  const r = await call('kol', { symbol: 'ZZZZZZ', count: 8 })
  ok(r.ok, 'kol 无效代码不崩')
}

console.log('== L7 Agent 工具（工具层包装）==')
{
  // 通过 dispatch 之外的路径直接调用工具 execute：动态注册分支已捕获 spec
  // 这里复用 RPC: quote/kline/hot/news/search 已覆盖。补充验证 quote 20 只上限
  const syms = Array.from({ length: 30 }, (_, i) => 'SH60051' + (i % 10)).join(',')
  const r = await call('quote', { symbols: syms.split(',') })
  ok(r.ok, 'quote 30 只批量不崩')
}

console.log('== L8 持久化状态 ==')
{
  const r = await call('watchlist.get')
  ok(r.ok && Array.isArray(r.data.symbols) && r.data.symbols.length > 0, 'watchlist.get 返回非空列表')
  const ui = await call('ui.get')
  ok(ui.ok && ui.data.tab, 'ui.get 返回 tab')
}

console.log('\n' + (fail === 0 ? '✅' : '❌') + ` live: ${pass} passed, ${fail} failed, ${warn} warn`)
process.exit(fail === 0 ? 0 : 1)
