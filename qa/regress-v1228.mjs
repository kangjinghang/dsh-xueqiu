// qa/regress-v1228.mjs — v1.22.8 host 修复的回归单测（离线，fake shell）
// a. actUiGet tab 白名单  b. curl 失败 stderr 脱敏  c. maybeAutoSync 空云结果推进 lastSyncAt
// d. cloudWatchAdd/Delete 失败不产生 unhandledRejection  e. wrapToolSpec args 兜底 {}
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
  if (cmd.includes('portfolio/stock/list')) return { exitCode: 0, stdout: { text: stockJson({ stocks: [] }) }, stderr: { text: '' } }
  return { exitCode: 0, stdout: { text: stockJson({}) }, stderr: { text: '' } }
}
function fakeShell(respond) {
  const calls = []
  return {
    calls,
    resolve: (s) => s,
    run: async (spec) => { calls.push(spec.command); const out = respond(spec.command); if (out && out.__throw) throw new Error(out.__throw); return out },
  }
}

function makePlugin({ files, shell } = {}) {
  const plugin = loadPlugin()
  const sh = shell || fakeShell(defaultRespond)
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

// ---------- a. actUiGet tab 白名单 ----------
{
  const { call } = makePlugin({ files: { '.xueqiu-ui-state.json': JSON.stringify({ tab: 'market', open: true }) } })
  // ui.set 写入非法 tab（actUiSet 不设白名单，直写），ui.get 读取时必须回退
  await call('ui.set', { tab: '<script>' })
  let r = await call('ui.get')
  record('a. ui.get tab=<script> 回退 market', r.ok === true && r.data.tab === 'market', JSON.stringify(r.data))
  await call('ui.set', { tab: 'xxx' })
  r = await call('ui.get')
  record('a. ui.get tab=xxx 回退 market', r.ok === true && r.data.tab === 'market', JSON.stringify(r.data))
  await call('ui.set', { tab: 'hot' })
  r = await call('ui.get')
  record('a. ui.get 合法 tab=hot 保留', r.ok === true && r.data.tab === 'hot', JSON.stringify(r.data))
  // 老版本状态文件里已废弃的 tab 值
  const { call: c2 } = makePlugin({ files: { '.xueqiu-ui-state.json': JSON.stringify({ tab: 'watchlist', open: true }) } })
  const r2 = await c2('ui.get')
  record('a. 老文件废弃 tab=watchlist 回退 market', r2.ok === true && r2.data.tab === 'market', JSON.stringify(r2.data))
}

// ---------- b. curl 失败脱敏 ----------
{
  const SENTINEL = 'LEAK_SENTINEL_x9q7'
  const sh = fakeShell(() => ({ exitCode: 2, stdout: { text: '' }, stderr: { text: 'curl: (2) ' + SENTINEL + ' details-of-command' } }))
  const { call } = makePlugin({ shell: sh })
  const r = await call('quote', { symbols: 'SH600519' })
  record('b. curl 失败 error 匹配 /curl 失败 \\(2\\)/', r.ok === false && /curl 失败 \(2\)/.test(r.error || ''), 'error=' + r.error)
  record('b. curl 失败 error 不含 stderr 哨兵', !(r.error || '').includes(SENTINEL), 'error=' + r.error)
}

// ---------- c. maybeAutoSync 空云结果推进 lastSyncAt 并落盘 ----------
{
  // 登录态 + 云端 stock/list 返回空 stocksList → 不镜像但必须写 lastSyncAt
  const sh = fakeShell((cmd) => {
    if (cmd.includes(' -D - ')) return { exitCode: 0, stdout: { text: 'set-cookie: xq_a_token=abc\n' }, stderr: { text: '' } }
    if (cmd.includes('portfolio/list')) return { exitCode: 0, stdout: { text: stockJson({ stocks: [{ name: '全部', id: -1, pid: -1 }], stocksList: [] }) }, stderr: { text: '' } }
    if (cmd.includes('portfolio/stock/list')) return { exitCode: 0, stdout: { text: stockJson({ stocks: [] }) }, stderr: { text: '' } }
    return { exitCode: 0, stdout: { text: stockJson({}) }, stderr: { text: '' } }
  })
  const before = Date.now()
  const { call, ctx } = makePlugin({
    files: {
      '.xueqiu-watchlist.json': JSON.stringify({ symbols: ['SH600519'], lastSyncAt: 0 }),
      '.xueqiu-login.json': JSON.stringify({ cookie: 'xq_a_token=tok; u=1', uid: 1, screenName: 't', savedAt: before - 1000 }),
    },
    shell: sh,
  })
  const r = await call('watchlist.get')
  record('c. 空云结果 watchlist.get 正常返回', r.ok === true && Array.isArray(r.data.symbols), JSON.stringify(r).slice(0, 120))
  let saved = null
  try { saved = JSON.parse(ctx.__files['.xueqiu-watchlist.json']) } catch (e) { /* 下面断言 */ }
  record('c. 落盘文件含更新的 lastSyncAt', !!saved && Number(saved.lastSyncAt) >= before, 'saved=' + JSON.stringify(saved))
  // 且本地 symbols 未被空云结果清空
  record('c. 空云结果不清空本地列表', r.ok === true && r.data.symbols.length === 1 && r.data.symbols[0] === 'SH600519', JSON.stringify(r.data))
}

// ---------- d. cloudWatchAdd/Delete 失败不产生 unhandledRejection ----------
{
  // portfolio 写端点直接抛错（shell.run reject）→ cloudWatchAdd 的 .catch 必须兜住
  const sh = fakeShell((cmd) => {
    if (cmd.includes(' -D - ')) return { exitCode: 0, stdout: { text: 'set-cookie: xq_a_token=abc\n' }, stderr: { text: '' } }
    if (cmd.includes('portfolio/stock/add.json') || cmd.includes('portfolio/stock/cancel.json')) return { __throw: 'boom portfolio write' }
    if (cmd.includes('portfolio/list')) return { exitCode: 0, stdout: { text: stockJson({ stocks: [{ name: '全部', id: -1, pid: -1 }], stocksList: [] }) }, stderr: { text: '' } }
    if (cmd.includes('portfolio/stock/list')) return { exitCode: 0, stdout: { text: stockJson({ stocks: [] }) }, stderr: { text: '' } }
    return { exitCode: 0, stdout: { text: stockJson({}) }, stderr: { text: '' } }
  })
  let leaked = null
  const onLeak = (e) => { leaked = e }
  process.on('unhandledRejection', onLeak)
  const { call } = makePlugin({
    files: { '.xueqiu-login.json': JSON.stringify({ cookie: 'xq_a_token=tok; u=1', uid: 1, screenName: 't' }) },
    shell: sh,
  })
  try {
    const r1 = await call('watchlist.add', { symbol: 'AAPL' })
    record('d. 云端 add 抛错时本地 add 仍成功', r1.ok === true && r1.data.symbols.includes('AAPL'), JSON.stringify(r1).slice(0, 120))
    const r2 = await call('watchlist.remove', { symbol: 'AAPL' })
    record('d. 云端 delete 抛错时本地 remove 仍成功', r2.ok === true && !r2.data.symbols.includes('AAPL'), JSON.stringify(r2).slice(0, 120))
    await new Promise((r) => setTimeout(r, 50))
    record('d. 无 unhandledRejection', leaked === null, 'leaked=' + (leaked && leaked.message))
  } finally {
    process.off('unhandledRejection', onLeak)
  }
}
// d 变体：写端点返回错误体（400016）而非抛异常
{
  const sh = fakeShell((cmd) => {
    if (cmd.includes(' -D - ')) return { exitCode: 0, stdout: { text: 'set-cookie: xq_a_token=abc\n' }, stderr: { text: '' } }
    if (cmd.includes('portfolio/stock/add.json') || cmd.includes('portfolio/stock/cancel.json')) return { exitCode: 0, stdout: { text: JSON.stringify({ error_code: 400016, error_description: 'cookie 过期' }) }, stderr: { text: '' } }
    if (cmd.includes('portfolio/list')) return { exitCode: 0, stdout: { text: stockJson({ stocks: [{ name: '全部', id: -1, pid: -1 }], stocksList: [] }) }, stderr: { text: '' } }
    if (cmd.includes('portfolio/stock/list')) return { exitCode: 0, stdout: { text: stockJson({ stocks: [] }) }, stderr: { text: '' } }
    return { exitCode: 0, stdout: { text: stockJson({}) }, stderr: { text: '' } }
  })
  let leaked = null
  const onLeak = (e) => { leaked = e }
  process.on('unhandledRejection', onLeak)
  const { call } = makePlugin({
    files: { '.xueqiu-login.json': JSON.stringify({ cookie: 'xq_a_token=tok; u=1', uid: 1, screenName: 't' }) },
    shell: sh,
  })
  try {
    const r = await call('watchlist.add', { symbol: 'TSLA' })
    record('d. 云端 add 返回错误体时本地 add 仍成功', r.ok === true && r.data.symbols.includes('TSLA'), JSON.stringify(r).slice(0, 120))
    await new Promise((r2) => setTimeout(r2, 50))
    record('d. 错误体路径无 unhandledRejection', leaked === null, 'leaked=' + (leaked && leaked.message))
  } finally {
    process.off('unhandledRejection', onLeak)
  }
}

// ---------- e. wrapToolSpec：spec.execute.call({}, undefined) 不抛 ----------
{
  const { toolSpecs } = makePlugin()
  record('e. 注册了 6 个 agent 工具', toolSpecs.length === 6, 'count=' + toolSpecs.length)
  for (const spec of toolSpecs) {
    let ok = false, out = ''
    try {
      const r = await Promise.race([
        spec.execute.call({}, undefined),
        new Promise((_, rej) => setTimeout(() => rej(new Error('挂起')), 25000)),
      ])
      ok = typeof r === 'string'
      try { JSON.parse(r) } catch (e) { ok = false }
      out = String(r).slice(0, 80)
    } catch (e) {
      ok = false
      out = (e && e.message) || String(e)
    }
    record('e. ' + spec.name + '.execute.call({}, undefined) 不抛且返回 JSON', ok, out)
  }
}

// ---------- 汇总 ----------
const fail = results.filter((r) => !r.pass)
console.log('\n========== regress-v1228 汇总 ==========')
console.log('总计: ' + results.length + '，通过: ' + (results.length - fail.length) + '，失败: ' + fail.length)
if (fail.length) for (const f of fail) console.log('  ❌ ' + f.name)
process.exit(fail.length ? 1 : 0)
