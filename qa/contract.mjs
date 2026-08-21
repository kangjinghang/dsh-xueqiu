// 雪球云端自选接口契约测试：直接 curl 真实端点，验证 add.json / cancel.json / list.json 契约。
// 背景：v1.20.4 曾因虚构端点(watch.json)得出"写接口被封锁"的错误结论——WAF 对未知路径统一 403。
// 本文件是防回归锚点：雪球若改接口，这里最先失败。
//
// Cookie 来源（按优先级）：
//   1. 环境变量 XQ_COOKIE（CI secret，原始 Cookie 请求头字符串，需含 xq_a_token）
//   2. 本机 ~/.xueqiu-login.json（本地手动运行）
// 都没有则 skip（exit 0），CI 匿名跑不失败。
//
// 运行: node qa/contract.mjs
// 注意：会真实写入/删除一次云端自选（测试标的 SH600519，结束后还原），每日 CI 一次的频率安全。
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'

const BASE = 'https://stock.xueqiu.com'
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'

// ---- Cookie 解析 ----
function resolveCookie() {
  if (process.env.XQ_COOKIE) return process.env.XQ_COOKIE.trim()
  try {
    const f = JSON.parse(readFileSync(join(homedir(), '.xueqiu-login.json'), 'utf8'))
    return f.cookie || null
  } catch { return null }
}
const cookie = resolveCookie()
if (!cookie || !cookie.includes('xq_a_token')) {
  console.log('⏭️  contract: 无登录 Cookie（XQ_COOKIE / ~/.xueqiu-login.json），skip')
  process.exit(0)
}

let pass = 0, fail = 0
function ok(cond, name) { if (cond) { pass++; console.log('  ✅ ' + name) } else { fail++; console.log('  ❌ ' + name) } }

function curl(path, method, body) {
  const args = ['-s', '--max-time', '12', '-X', method, BASE + path,
    '-H', 'User-Agent: ' + UA, '-H', 'Referer: https://www.xueqiu.com/',
    '-H', 'Accept: application/json', '-H', 'Cookie: ' + cookie]
  if (body) args.push('-H', 'Content-Type: application/x-www-form-urlencoded', '--data', body)
  return execFileSync('curl', args, { encoding: 'utf8', timeout: 15000 })
}
const enc = encodeURIComponent
const SYMBOL = 'SH600519' // 测试标的：添加后立即删除还原

// pid 探测（与 host.js pickCloudPid 同语义）：stocks 分类里「全部」id=-1 优先
function pickPid(listData) {
  const cats = listData.stocks || []
  for (const c of cats) if (c && (c.name === '全部' || c.id === -1) && (c.pid || c.id)) return c.pid || c.id
  if (cats.length && (cats[0].pid || cats[0].id)) return cats[0].pid || cats[0].id
  const cubes = listData.cubes || []
  return cubes.length ? (cubes[0].pid || cubes[0].id) : null
}
function fetchList(pid) {
  const d = JSON.parse(curl('/v5/stock/portfolio/stock/list.json?size=200&category=1&pid=' + pid, 'GET'))
  // 响应形如 {data:{stocks:[...]}}；兼容裸 stocks 形态
  return (d.data && d.data.stocks) || d.stocks || []
}

// ---- 1. 读契约：组合列表 + 自选列表 ----
console.log('== C1 读契约 ==')
const pid = (() => {
  const d = JSON.parse(curl('/v5/stock/portfolio/list.json?system=true', 'GET'))
  ok(d.error_code === 0 || d.error_code === undefined, 'portfolio/list.json 无错误码')
  const p = pickPid((d.data) || d)
  ok(!!p, '取到默认自选分类 pid (' + p + ')')
  return p
})()
if (pid) {
  const stocks = fetchList(pid)
  ok(Array.isArray(stocks) && stocks.length > 0, 'portfolio/stock/list.json 返回非空 stocks (' + stocks.length + ' 只)')
}

// ---- 2. 写契约：add → 在列表 → cancel → 还原 ----
console.log('== C2 写契约（真实往返后还原） ==')
const before = (() => {
  const stocks = fetchList(pid)
  return { count: stocks.length, has: stocks.some((s) => (s.stock_symbol || s.symbol) === SYMBOL) }
})()

if (!before.has) {
  const addRaw = curl('/v5/stock/portfolio/stock/add.json', 'POST', 'symbols=' + enc(SYMBOL) + '&category=1')
  const add = JSON.parse(addRaw)
  ok(add.data === true, 'add.json 契约 {data:true}（真实响应: ' + addRaw.slice(0, 80) + '）')
  ok(fetchList(pid).some((s) => (s.stock_symbol || s.symbol) === SYMBOL), 'add 后云端列表包含测试标的')

  const cancelRaw = curl('/v5/stock/portfolio/stock/cancel.json', 'POST', 'symbols=' + enc(SYMBOL))
  const cancel = JSON.parse(cancelRaw)
  ok(cancel.data === true, 'cancel.json 契约 {data:true}')
  const after = fetchList(pid)
  ok(!after.some((s) => (s.stock_symbol || s.symbol) === SYMBOL), 'cancel 后已还原（' + after.length + ' 只，before ' + before.count + '）')
} else {
  // 标的已在云端列表（用户自选里有茅台）：只验 cancel 不可误删，改为验证 add 重复添加幂等
  const addRaw = curl('/v5/stock/portfolio/stock/add.json', 'POST', 'symbols=' + enc(SYMBOL) + '&category=1')
  ok(JSON.parse(addRaw).data === true, 'add.json 重复添加幂等 {data:true}')
  console.log('  ⚠️ 测试标的已在云端自选，跳过 cancel 还原验证')
}

console.log('\n' + (fail === 0 ? '✅' : '❌') + ` contract: ${pass} passed, ${fail} failed`)
process.exit(fail === 0 ? 0 : 1)
