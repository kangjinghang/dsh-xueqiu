// 成交量单位回归（v1.22.13）：雪球 volume 字段全市场均为「股」（实证 amount/volume≈price）。
// A股按 1手=100股 换算显示、港/美以股计；host 侧 kline 周期白名单防静默空数据。离线运行。
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { loadPlugin, makeCtx } from './mock-ctx.js'

const here = dirname(fileURLToPath(import.meta.url))
let pass = 0, fail = 0
function ok(cond, name, detail) {
  if (cond) { pass++; console.log('  ✅ ' + name) }
  else { fail++; console.log('  ❌ ' + name + (detail ? '  >> ' + detail : '')) }
}

// ---- 1. 从 client.js 源码中提取 fmtVol（花括号配对），new Function 实测 ----
console.log('== fmtVol 市场感知 ==')
const src = readFileSync(join(here, '../dynamic/client.js'), 'utf8')
const start = src.indexOf('function fmtVol(')
ok(start > 0, 'client.js 中找到 fmtVol 定义')
let depth = 0, end = -1
for (let i = src.indexOf('{', start); i < src.length; i++) {
  if (src[i] === '{') depth++
  else if (src[i] === '}') { depth--; if (depth === 0) { end = i + 1; break } }
}
const fmtVol = new Function('return (' + src.slice(start, end) + ')')()
ok(typeof fmtVol === 'function', 'fmtVol 可独立求值')

// A股：股 → 手（÷100）。茅台 1450472 股 = 14504.72 手 = 1.45万手
ok(fmtVol(1450472, 'SH600519') === '1.45万手', 'A股 日量 145万股 → 1.45万手', fmtVol(1450472, 'SH600519'))
ok(fmtVol(33102261000, 'SH000001') === '3.31亿手', 'A股指数 331亿股 → 3.31亿手', fmtVol(33102261000, 'SH000001'))
ok(fmtVol(523303851, 'SH510300') === '523.30万手', 'A股ETF → 万手', fmtVol(523303851, 'SH510300'))
ok(fmtVol(950, 'SH600519') === '10手', 'A股 950股 → 10手（整手显示）', fmtVol(950, 'SH600519'))
ok(fmtVol(200000000, 'SZ300750') === '200.00万手', 'A股 2亿股 → 200.00万手', fmtVol(200000000, 'SZ300750'))
ok(fmtVol(1450472, 'sz600519') === '1.45万手', '小写前缀同样识别 A股', fmtVol(1450472, 'sz600519'))
ok(fmtVol(1450472, 'BJ430047') === '1.45万手', '北交所同样 ÷100', fmtVol(1450472, 'BJ430047'))

// 港/美：股原样（单位=股）
ok(fmtVol(7811792, '00700') === '781.18万股', '港股 腾讯 → 万股', fmtVol(7811792, '00700'))
ok(fmtVol(25869807, 'AAPL') === '2586.98万股', '美股 AAPL → 万股', fmtVol(25869807, 'AAPL'))
ok(fmtVol(4687681500, 'AAPL') === '46.88亿股', '美股 大量 → 亿股', fmtVol(4687681500, 'AAPL'))
ok(fmtVol(5000, 'TSLA') === '5000股', '美股 小量 → 股', fmtVol(5000, 'TSLA'))

// 边界
ok(fmtVol(null, 'SH600519') === '--', 'null → --')
ok(fmtVol(undefined, 'AAPL') === '--', 'undefined → --')
ok(fmtVol('abc', 'SH600519') === '--', '非数值 → --')
ok(fmtVol(0, 'SH600519') === '0手', '0 → 0手', fmtVol(0, 'SH600519'))
ok(fmtVol(1450472, '') === '145.05万股', '无 symbol 上下文 → 按股（保守不 ÷100）', fmtVol(1450472, ''))

// ---- 2. host：kline 周期白名单 ----
console.log('== kline 周期白名单 ==')
const KLINE = JSON.stringify({ error_code: 0, data: { column: ['timestamp', 'open', 'high', 'low', 'close', 'volume', 'amount', 'percent', 'chg', 'turnoverrate', 'pe', 'pb', 'market_capital'], item: [[1717000000000, 1, 2, 0.5, 1.5, 100, 200, 3, 0.5, 1, 10, 2, 1e10]] } })
const calls = []
const shell = {
  resolve: (s) => s,
  run: async (spec) => {
    calls.push(spec.command)
    if (String(spec.command).includes(' -D - ')) return { exitCode: 0, stdout: { text: 'HTTP/1.1 200 OK\nset-cookie: xq_a_token=abc; Path=/\n' }, stderr: { text: '' } }
    return { exitCode: 0, stdout: { text: KLINE }, stderr: { text: '' } }
  }
}
let handler = null
const toolSpecs = []
globalThis.harness = { handle: (m, h) => { handler = h; return () => {} }, registerTool: (_c, s) => { toolSpecs.push(s); return () => {} }, defineTool: (s) => s }
const plugin = loadPlugin()
plugin.apply(makeCtx({ shell }))
delete globalThis.harness
const call = (action, args) => handler({ action, args: args || {} })

async function klineUrl(period, symbol) {
  calls.length = 0
  await call('kline', { symbol: symbol, period: period, count: 10 })
  const u = (calls.find((c) => String(c).includes('/chart/kline')) || '')
  const m = String(u).match(/period=([a-z0-9]+)/)
  return m ? m[1] : '(未请求)'
}
// 每次用不同 symbol 避开 TTL 缓存（同 URL 命中缓存就不会发请求）
ok((await klineUrl('week', 'SH600519')) === 'week', '合法周期 week 原样透传')
ok((await klineUrl('day', 'SZ000001')) === 'day', '合法周期 day 原样透传')
ok((await klineUrl('1h', 'SH600036')) === 'day', "模型手滑 '1h' → 兜底 day（上游会静默返回空数据）", await klineUrl('1h', 'SH600036'))
ok((await klineUrl('decade', 'SZ000858')) === 'day', "垃圾周期 'decade' → 兜底 day", await klineUrl('decade', 'SZ000858'))
ok((await klineUrl('', 'SH601318')) === 'day', '空周期 → day', await klineUrl('', 'SH601318'))
ok((await klineUrl('DAY', 'SZ300750')) === 'day', '大写 DAY → day（白名单大小写敏感，兜底）', await klineUrl('DAY', 'SZ300750'))

// ---- 3. 工具描述携带单位说明（模型侧防误读） ----
console.log('== 工具描述单位标注 ==')
const quoteDesc = (toolSpecs.find((t) => t.name === 'xueqiu_quote') || {}).description || ''
const klineDesc = (toolSpecs.find((t) => t.name === 'xueqiu_kline') || {}).description || ''
ok(quoteDesc.includes('1手=100股'), 'xueqiu_quote 描述注明 volume 单位为股')
ok(klineDesc.includes('1手=100股'), 'xueqiu_kline 描述注明 volume 单位为股')

console.log('========== vol-units 汇总 ==========')
console.log(`总计: ${pass + fail}，通过: ${pass}，失败: ${fail}`)
process.exit(fail ? 1 : 0)
