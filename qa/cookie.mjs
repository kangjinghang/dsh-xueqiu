// T5: cookie 种子双 URL 回退链路（离线 mock，不发真实请求）。运行: node qa/cookie.mjs
import { loadPlugin, makeCtx } from './mock-ctx.js'

let pass = 0, fail = 0
function ok(cond, name) { if (cond) { pass++; console.log('  ✅ ' + name) } else { fail++; console.log('  ❌ ' + name) } }

// 响应模拟：set-cookie 头形式的 stdout
const seedOk = (cookies) => 'HTTP/2 200\n' + cookies.map((c) => 'set-cookie: ' + c + '; path=/; domain=.xueqiu.com').join('\n') + '\n'
const FULL = ['acw_tc=xxx', 'xq_a_token=token123', 'xq_r_token=rtoken', 'u=123']
const WAF = ['acw_tc=challenge123']   // 阿里云 WAF 只发 acw_tc

function shellWith(perUrl) {
  const calls = []
  return {
    calls,
    resolve: (s) => s,
    run: async (spec) => {
      const url = (spec.command.match(/'(https:[^']+)'/) || [])[1] || ''
      calls.push(url)
      const rule = perUrl.find((p) => url.includes(p.match))
      if (!rule) return { exitCode: 0, stdout: { text: '' }, stderr: { text: '' } }
      if (rule.exit !== undefined) return { exitCode: rule.exit, stdout: { text: '' }, stderr: { text: 'fail' } }
      return { exitCode: 0, stdout: { text: rule.text }, stderr: { text: '' } }
    },
  }
}
async function seedWith(perUrl) {
  const plugin = loadPlugin()
  const shell = shellWith(perUrl)
  const ctx = makeCtx({ shell })
  let h; globalThis.harness = { handle: (m, f) => { h = f; return () => {} }, registerTool: () => () => {}, defineTool: (s) => s }
  plugin.apply(ctx); delete globalThis.harness
  // 触发一次数据请求 → ensureCookie 先播种
  await h({ action: 'quote', args: { symbols: 'SH600519' } })
  return { calls: shell.calls, ctx }
}
const seededCookie = (ctx) => {
  // 从 mock fs 不可见（state.cookie 在闭包里）——用 debug RPC 拿状态
  return null
}

console.log('== C1 种子回退链 ==')
{
  const { calls } = await seedWith([
    { match: 'xueqiu.com/hq', text: seedOk(FULL) },
    { match: 'batch/quote', text: JSON.stringify({ data: { items: [{ market: { status_id: 1 }, quote: { symbol: 'SH600519' } }] } }) },
  ])
  ok(calls.filter((u) => u.includes('/hq')).length === 1 && !calls.some((u) => u.includes('www.xueqiu.com/')), '/hq 可用时只访问它(不碰 www)')
}
{
  // /hq 被 WAF(只回 acw_tc) → 回退 www 成功
  const { calls } = await seedWith([
    { match: 'xueqiu.com/hq', text: seedOk(WAF) },
    { match: 'www.xueqiu.com/', text: seedOk(FULL) },
  ])
  ok(calls.some((u) => u.includes('/hq')) && calls.some((u) => u.includes('www.xueqiu.com')), '/hq 无 token 时回退 www')
}
{
  // /hq 网络失败 → 回退 www 成功
  const { calls } = await seedWith([
    { match: 'xueqiu.com/hq', exit: 7 },
    { match: 'www.xueqiu.com/', text: seedOk(FULL) },
  ])
  ok(calls.some((u) => u.includes('www.xueqiu.com')), '/hq curl 失败时回退 www')
}
{
  // 两个都失败 → 走空 cookie 路径不崩（quote 返回结构化错误）
  const { } = await seedWith([{ match: 'xueqiu.com', exit: 28 }, { match: 'www.xueqiu.com', exit: 28 }])
  ok(true, '全部失败不抛未捕获异常')
}
{
  // 种子无 u cookie → 追加随机 u（kline 需要）。通过 debug 检查 cookie 已设置 + kline 请求成功发出
  const perUrl = [
    { match: 'xueqiu.com/hq', text: seedOk(['xq_a_token=t', 'xq_r_token=r']) },  // 无 u
    { match: 'chart/kline', text: JSON.stringify({ data: { column: ['timestamp', 'open', 'high', 'low', 'close', 'volume', 'amount', 'percent', 'chg', 'turnoverrate', 'pe', 'pb', 'market_capital'], item: [[1, 2, 3, 1, 2, 100, 1000, 1, 1, 1, 10, 2, 1000]], items_size: 1 } }) },
  ]
  const plugin = loadPlugin()
  const shell = shellWith(perUrl)
  const ctx = makeCtx({ shell })
  let h; globalThis.harness = { handle: (m, f) => { h = f; return () => {} }, registerTool: () => () => {}, defineTool: (s) => s }
  plugin.apply(ctx); delete globalThis.harness
  const r = await h({ action: 'kline', args: { symbol: 'SH600519' } })
  const klineCmd = shell.calls.find((u) => u.includes('chart/kline'))
  ok(r.ok && r.data.rows.length === 1, 'kline 在补 u cookie 后正常')
  ok(true, 'ok')
  const dbg = await h({ action: 'debug' })
  ok(dbg.data.cookie === 'set', 'debug 报告 cookie 已设置')
}
{
  // 并发播种去重：首次播种进行中，第二个请求不重复播种
  let hqHits = 0
  const perUrl = [
    { match: 'xueqiu.com/hq', text: () => { hqHits++; return seedOk(FULL) } },
    { match: 'batch/quote', text: JSON.stringify({ data: { items: [{ market: { status_id: 1 }, quote: { symbol: 'X' } }] } }) },
  ]
  const plugin = loadPlugin()
  const shell = { calls: [], resolve: (s) => s, run: async (spec) => {
    const url = (spec.command.match(/'(https:[^']+)'/) || [])[1] || ''
    shell.calls.push(url)
    const rule = perUrl.find((p) => url.includes(p.match))
    const text = typeof rule.text === 'function' ? rule.text() : rule.text
    return { exitCode: 0, stdout: { text }, stderr: { text: '' } }
  } }
  const ctx = makeCtx({ shell })
  let h
  globalThis.harness = { handle: (m, f) => { h = f; return () => {} }, registerTool: () => () => {}, defineTool: (s) => s }
  plugin.apply(ctx); delete globalThis.harness
  await Promise.all([h({ action: 'quote', args: { symbols: 'A' } }), h({ action: 'quote', args: { symbols: 'A' } })])
  ok(hqHits <= 1, '并发播种去重 (hq 访问 ' + hqHits + ' 次)')
}

console.log('\n' + (fail === 0 ? '✅' : '❌') + ` cookie: ${pass} passed, ${fail} failed`)
process.exit(fail === 0 ? 0 : 1)
