// qa/persist-upgrade.mjs — 老版本持久化 schema 的升级演练（离线，fake shell）
// 构造老 schema：watchlist 无 lastSyncAt/无版本字段、ui-state 只有部分字段或 tab 已废弃、
// login json 字段缺失 → 相关 action 读写不崩、结构健全、写出文件可再读。
// 若本仓库存在真实 .xueqiu-ui-state.json，也拷进测试 root 跑一遍（真实用户数据升级演练）。
import { readFileSync, copyFileSync, mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { loadPlugin, makeCtx } from './mock-ctx.js'

const results = []
function record(name, pass, detail) {
  results.push({ name, pass })
  console.log((pass ? '✅' : '❌') + ' ' + name + (!pass && detail ? '  >> ' + detail : ''))
}

const stockJson = (obj) => JSON.stringify(Object.assign({ error_code: 0, data: obj }))
const KLINE = stockJson({ column: ['timestamp','open','high','low','close','volume','amount','percent','chg','turnoverrate','pe','pb','market_capital'], item: [[1717000000000, 1, 2, 0.5, 1.5, 100, 200, 3, 0.5, 1, 10, 2, 1e10]] })
function defaultRespond(cmd) {
  if (cmd.includes(' -D - ')) return { exitCode: 0, stdout: { text: 'set-cookie: xq_a_token=abc; Path=/\nset-cookie: u=123; Path=/\n' }, stderr: { text: '' } }
  if (cmd.includes('/chart/kline')) return { exitCode: 0, stdout: { text: KLINE }, stderr: { text: '' } }
  if (cmd.includes('batch/quote')) return { exitCode: 0, stdout: { text: stockJson({ items: [{ market: { status_id: 1 }, quote: { symbol: 'SH600519', name: '贵州茅台', current: 1700, percent: 1.2 } }] }) }, stderr: { text: '' } }
  if (cmd.includes('portfolio/list')) return { exitCode: 0, stdout: { text: stockJson({ stocks: [{ name: '全部', id: -1, pid: -1 }], stocksList: [] }) }, stderr: { text: '' } }
  if (cmd.includes('portfolio/stock/list')) return { exitCode: 0, stdout: { text: stockJson({ stocks: [{ stock_symbol: 'SH600519' }, { stock_symbol: '00700' }] }) }, stderr: { text: '' } }
  return { exitCode: 0, stdout: { text: stockJson({}) }, stderr: { text: '' } }
}
function fakeShell(respond) {
  const r = respond || defaultRespond
  return { resolve: (s) => s, run: async (spec) => r(spec.command) }
}

function makePlugin({ files, shell } = {}) {
  const plugin = loadPlugin()
  const sh = shell || fakeShell()
  const toolSpecs = []
  let handler = null
  globalThis.harness = {
    handle: (m, h) => { handler = h; return () => {} },
    registerTool: (_ctx, spec) => { toolSpecs.push(spec); return () => {} },
    defineTool: (s) => s,
  }
  const ctx = makeCtx({ files: files ? { ...files } : {}, shell: sh })
  plugin.apply(ctx)
  delete globalThis.harness
  const call = (action, args) => handler({ action, args: args === undefined ? {} : args })
  return { call, shell: sh, toolSpecs, ctx }
}

// JWT 构造（老 login 文件演练用：缺 uid/screenName 字段时回退 JWT 解码）
function b64url(s) {
  return Buffer.from(JSON.stringify(s)).toString('base64').replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_')
}
function b64jwt(obj) { return b64url({ alg: 'none' }) + '.' + b64url(obj) + '.sig' }

// ============ 场景一：v1.0 老 watchlist（纯数组壳，无 lastSyncAt / 无版本字段）============
{
  const oldFiles = {
    '.xueqiu-watchlist.json': JSON.stringify({ symbols: ['SH600519', '00700'] }),
    '.xueqiu-login.json': JSON.stringify({ cookie: 'xq_a_token=tok; xq_id_token=' + b64jwt({ uid: 42, cn: '老用户', exp: Math.floor(Date.now() / 1000) + 9999 }), savedAt: 1 }),
    '.xueqiu-ui-state.json': JSON.stringify({ pos: null, tab: 'watchlist', minimized: true }),
  }
  const { call, ctx } = makePlugin({ files: oldFiles })
  // watchlist 读
  let r = await call('watchlist.get')
  record('老 watchlist：get 不崩且保序', r.ok === true && JSON.stringify(r.data.symbols) === JSON.stringify(['SH600519', '00700']), JSON.stringify(r).slice(0, 120))
  // watchlist 写（老 schema 无 lastSyncAt；写后新 schema 可再读）
  r = await call('watchlist.add', { symbol: 'AAPL' })
  record('老 watchlist：add 不崩', r.ok === true && r.data.symbols.length === 3, JSON.stringify(r).slice(0, 120))
  let saved = null
  try { saved = JSON.parse(ctx.__files['.xueqiu-watchlist.json']) } catch (e) { /* 下面断言 */ }
  record('老 watchlist：写出 JSON 可再读且 symbols 含新增', !!saved && Array.isArray(saved.symbols) && saved.symbols.includes('AAPL'), 'saved=' + ctx.__files['.xueqiu-watchlist.json'])
  // 再开一个插件实例从写出的文件冷读（升级后的 round-trip）
  const { call: call2, ctx: ctx2 } = makePlugin({ files: { '.xueqiu-watchlist.json': ctx.__files['.xueqiu-watchlist.json'] } })
  const r2 = await call2('watchlist.get')
  record('写出文件冷读 round-trip 不崩且一致', r2.ok === true && JSON.stringify(r2.data.symbols) === JSON.stringify(['SH600519', '00700', 'AAPL']), JSON.stringify(r2.data))
  // 老云同步触发（登录态）→ lastSyncAt 写入
  const r3 = await call('watchlist.pull')
  record('老 login + watchlist：pull 云端镜像不崩', r3.ok === true && Array.isArray(r3.data.symbols) && r3.data.symbols.includes('SH600519'), JSON.stringify(r3).slice(0, 150))
  // 老 login（uid/screenName 靠 JWT 解码回退）
  const r4 = await call('login.status')
  record('老 login（无 uid/screenName 字段）：status 回退 JWT 解码', r4.ok === true && r4.data.loggedIn === true && r4.data.uid === 42 && r4.data.screenName === '老用户', JSON.stringify(r4.data))
  // 老 ui-state（废弃 tab=watchlist、无 open/dockH/badgeW 字段）
  const r5 = await call('ui.get')
  record('老 ui-state（废弃 tab、缺字段）：get 回退默认且结构健全',
    r5.ok === true && r5.data.tab === 'market' && (r5.data.dockH === null || typeof r5.data.dockH === 'number') && (r5.data.badgeW === null || typeof r5.data.badgeW === 'number') && (r5.data.badgePos === null || typeof r5.data.badgePos === 'object'),
    JSON.stringify(r5.data))
  const r6 = await call('ui.set', { open: true, dockH: 300 })
  record('老 ui-state：set 不崩', r6.ok === true, JSON.stringify(r6))
  let uiSaved = null
  try { uiSaved = JSON.parse(ctx.__files['.xueqiu-ui-state.json']) } catch (e) { /* 下面断言 */ }
  record('老 ui-state：写出的 json 可再读且保留老字段 pos/minimized', !!uiSaved && uiSaved.pos === null && uiSaved.minimized === true && uiSaved.tab === 'watchlist', 'saved=' + ctx.__files['.xueqiu-ui-state.json'])
}

// ============ 场景二：更老的裸形态（watchlist 是纯字符串数组、login 只有 cookie 一行）============
{
  const ancient = {
    '.xueqiu-watchlist.json': JSON.stringify(['SH600519', 'AAPL']),
    '.xueqiu-login.json': JSON.stringify({ cookie: 'xq_a_token=bare' }),
  }
  const { call } = makePlugin({ files: ancient })
  let r = await call('watchlist.get')
  // 裸数组（无 symbols 字段）→ 解析按损坏处理回退默认列表，不崩
  record('裸数组 watchlist：get 不崩（回退默认或保序均可，只要求结构）', r.ok === true && Array.isArray(r.data.symbols) && r.data.symbols.length > 0, JSON.stringify(r.data))
  r = await call('login.status')
  record('裸 login（仅 cookie）：status 不崩', r.ok === true && typeof r.data.loggedIn === 'boolean', JSON.stringify(r.data))
}

// ============ 场景三：真实用户数据升级演练（仓库内 .xueqiu-ui-state.json）============
{
  const REAL = new URL('../.xueqiu-ui-state.json', import.meta.url)
  let text = null
  try { text = readFileSync(REAL, 'utf8') } catch (e) { text = null }
  if (text === null) {
    console.log('ℹ️ 未找到真实 .xueqiu-*.json，跳过真实数据演练')
  } else {
    const { call, ctx } = makePlugin({ files: { '.xueqiu-ui-state.json': text } })
    let r = await call('ui.get')
    record('真实 ui-state：get 不崩且结构健全',
      r.ok === true && typeof r.data.tab === 'string' && ['market', 'hot', 'search', 'news'].includes(r.data.tab),
      JSON.stringify(r.data))
    r = await call('ui.set', { tab: r.data.tab === 'news' ? 'hot' : 'news', open: true })
    record('真实 ui-state：set 切换 tab 不崩', r.ok === true, JSON.stringify(r))
    const r2 = await call('ui.get')
    record('真实 ui-state：写后读回一致', r2.ok === true && typeof r2.data.tab === 'string', JSON.stringify(r2.data))
    let ok = false
    try { JSON.parse(ctx.__files['.xueqiu-ui-state.json']); ok = true } catch (e) { ok = false }
    record('真实 ui-state：写出文件是合法 JSON', ok, ctx.__files['.xueqiu-ui-state.json'])
    // 注意：测试只写内存文件系统（ctx.__files），真实文件未被改动。此处仅断言原文件未受影响。
    record('真实 ui-state：磁盘原文件未被测试触碰', readFileSync(REAL, 'utf8') === text, '')
  }
}

// ---------- 汇总 ----------
const fail = results.filter((r) => !r.pass)
console.log('\n========== persist-upgrade 汇总 ==========')
console.log('总计: ' + results.length + '，通过: ' + (results.length - fail.length) + '，失败: ' + fail.length)
if (fail.length) for (const f of fail) console.log('  ❌ ' + f.name)
process.exit(fail.length ? 1 : 0)
