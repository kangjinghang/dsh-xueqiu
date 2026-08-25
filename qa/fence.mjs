// qa/fence.mjs — webServer 分支的同源栅栏单测（离线，不设 globalThis.harness）
// 覆盖：Host 回环校验、Origin 同源校验、1MB body 上限、非法 JSON 容错。
import { loadPlugin, makeCtx } from './mock-ctx.js'

const results = []
function record(name, pass, detail) {
  results.push({ name, pass })
  console.log((pass ? '✅' : '❌') + ' ' + name + (!pass && detail ? '  >> ' + detail : ''))
}

const stockJson = (obj) => JSON.stringify(Object.assign({ error_code: 0, data: obj }))
// 与 edge.mjs defaultRespond 同模式：按 URL 关键字返回脚本化 JSON
function defaultRespond(cmd) {
  if (cmd.includes(' -D - ')) return { exitCode: 0, stdout: { text: 'set-cookie: xq_a_token=abc; Path=/\nset-cookie: u=123; Path=/\n' }, stderr: { text: '' } }
  if (cmd.includes('batch/quote')) return { exitCode: 0, stdout: { text: stockJson({ items: [{ market: { status_id: 1 }, quote: { symbol: 'SH600519', name: '贵州茅台', current: 1700, percent: 1.2 } }] }) }, stderr: { text: '' } }
  return { exitCode: 0, stdout: { text: stockJson({}) }, stderr: { text: '' } }
}
function fakeShell(respond) {
  return { resolve: (s) => s, run: async (spec) => respond(spec.command) }
}

// 不设 globalThis.harness → host.js 走 ctx.inject(['webServer']) 静态分支。
// mock-ctx 的 inject 立即回调、effect 立即执行，所以 webServer 必须在 apply 前挂好。
function makeFence(shell) {
  const plugin = loadPlugin()
  const ctx = makeCtx({ shell: shell || fakeShell(defaultRespond) })
  let captured = null
  ctx.webServer = { register: (reg) => { captured = reg; return () => {} } }
  // 静态分支同时会 inject(['tools']) 注册 agent 工具：给个空注册器避免 apply 抛错
  ctx.tools = { register: () => () => {} }
  plugin.apply(ctx)
  if (!captured) throw new Error('未捕获到 webServer.register 的注册对象')
  return captured
}

// 构造异步可迭代 req（handler 里 for await (const c of req)）
function makeReq(headers, chunks) {
  return {
    headers: headers || {},
    [Symbol.asyncIterator]() {
      let i = 0
      return {
        next() { return Promise.resolve(i < chunks.length ? { value: Buffer.from(chunks[i++]), done: false } : { done: true }) },
      }
    },
  }
}
// res 收集器
function makeRes() {
  const out = { status: null, headers: null, body: '' }
  return {
    out,
    writeHead(s, h) { out.status = s; out.headers = h },
    end(t) { out.body = out.body + String(t == null ? '' : t) },
  }
}
async function fire(handler, headers, chunks) {
  const req = makeReq(headers, chunks || [])
  const res = makeRes()
  await handler(req, res)
  return res.out
}

const reg = makeFence()
record('注册对象 kind=prefix / path=/xq-rpc', reg.kind === 'prefix' && reg.path === '/xq-rpc', JSON.stringify({ kind: reg.kind, path: reg.path }))

// ---- 403：无 Origin ----
{
  const r = await fire(reg.handler, { host: '127.0.0.1:3080' }, [])
  record('无 Origin → 403', r.status === 403, 'status=' + r.status)
}
// ---- 403：跨源 Origin ----
{
  const r = await fire(reg.handler, { host: '127.0.0.1:3080', origin: 'http://evil.example.com' }, [])
  record('跨源 Origin → 403', r.status === 403, 'status=' + r.status)
  const r2 = await fire(reg.handler, { host: '127.0.0.1:3080', origin: 'http://127.0.0.1:9999' }, [])
  record('同 Host 不同端口 Origin → 403', r2.status === 403, 'status=' + r2.status)
  const r3 = await fire(reg.handler, { host: '127.0.0.1:3080', origin: 'https://127.0.0.1:3080' }, [])
  record('协议不匹配 Origin（https vs http host 头组合之一）→ 至少不是数据泄露', r3.status === 200 || r3.status === 403, 'status=' + r3.status)
}
// ---- 403：Host 非回环（即使 Origin 匹配）----
{
  const r = await fire(reg.handler, { host: 'evil.example.com', origin: 'http://evil.example.com' }, [])
  record('Host 非回环 + Origin 匹配 → 403', r.status === 403, 'status=' + r.status)
  const r2 = await fire(reg.handler, { host: '192.168.1.5:3080', origin: 'http://192.168.1.5:3080' }, [])
  record('Host 局域网 IP → 403', r2.status === 403, 'status=' + r2.status)
  const r3 = await fire(reg.handler, { host: '127.0.0.1.evil.com:3080', origin: 'http://127.0.0.1.evil.com:3080' }, [])
  record('Host 前缀伪造（127.0.0.1.evil.com）→ 403', r3.status === 403, 'status=' + r3.status)
}
// ---- 200：合法同源请求 ----
{
  const body = JSON.stringify({ action: 'quote', args: { symbols: 'SH600519' } })
  const r = await fire(reg.handler, { host: '127.0.0.1:3080', origin: 'http://127.0.0.1:3080' }, [body])
  let parsed = null
  try { parsed = JSON.parse(r.body) } catch (e) { /* 下面断言 */ }
  record('Host 127.0.0.1:P + 同源 Origin → 200 且 quote ok:true',
    r.status === 200 && parsed && parsed.ok === true && parsed.data && Array.isArray(parsed.data.list) && parsed.data.list[0] && parsed.data.list[0].symbol === 'SH600519',
    'status=' + r.status + ' body=' + r.body.slice(0, 150))
  record('响应头 Content-Type json + no-store', !!r.headers && /application\/json/.test(r.headers['Content-Type'] || '') && r.headers['Cache-Control'] === 'no-store', JSON.stringify(r.headers))

  const r2 = await fire(reg.handler, { host: 'localhost:3080', origin: 'http://localhost:3080' }, [body])
  record('localhost host → 200', r2.status === 200 && JSON.parse(r2.body).ok === true, 'status=' + r2.status)
  const r3 = await fire(reg.handler, { host: '[::1]:3080', origin: 'http://[::1]:3080' }, [body])
  record('[::1] host → 200', r3.status === 200 && JSON.parse(r3.body).ok === true, 'status=' + r3.status)
  const r4 = await fire(reg.handler, { host: '::1', origin: 'http://::1' }, [body])
  // 已知问题（xfail，不阻塞 check:fast）：host.js 的端口剥离正则 /:\d+$/ 会把裸 '::1'
  // 末尾的 ':1' 当端口剥掉，得到 ':' → 白名单里的 hostAuth === '::1' 分支永远不可达。
  // 真实浏览器 IPv6 回环用 '[::1]' 括号形态（上面已验证 200），影响极小。
  // 断言语义：若上游修复了死代码，本条会变成"预期 403 但得到 200"从而失败，提醒删除 xfail 标记。
  record('::1 host（无端口）当前按 403 拒绝【xfail:已知死代码 bug，详见测试报告】', r4.status === 403, 'status=' + r4.status)
}
// ---- 413：body 累计 > 1MB ----
{
  const big = Buffer.alloc(600 * 1024, 65).toString() // 600KB ×2 块 = 1.2MB
  const r = await fire(reg.handler, { host: '127.0.0.1:3080', origin: 'http://127.0.0.1:3080' }, [big, big])
  record('body 两块累计 >1MB → 413', r.status === 413, 'status=' + r.status)
  const ok1 = Buffer.alloc(600 * 1024, 66).toString()
  const r2 = await fire(reg.handler, { host: '127.0.0.1:3080', origin: 'http://127.0.0.1:3080' }, [ok1, ok1.slice(0, 100)])
  record('body 恰好 <1MB → 不 413', r2.status !== 413, 'status=' + r2.status)
}
// ---- 非法 JSON → 200 + 结构化错误 ----
{
  const r = await fire(reg.handler, { host: '127.0.0.1:3080', origin: 'http://127.0.0.1:3080' }, ['{not json'])
  let parsed = null
  try { parsed = JSON.parse(r.body) } catch (e) { /* 下面断言 */ }
  record('非法 JSON body → 200 + 结构化错误', r.status === 200 && parsed && parsed.ok === false && /未知操作/.test(parsed.error || ''), 'status=' + r.status + ' body=' + r.body.slice(0, 120))
  // 空 body：Buffer.concat([]).toString() = '' → '{}' → action undefined → 未知操作
  const r2 = await fire(reg.handler, { host: '127.0.0.1:3080', origin: 'http://127.0.0.1:3080' }, [])
  let p2 = null
  try { p2 = JSON.parse(r2.body) } catch (e) { /* 下面断言 */ }
  record('空 body → 200 + 结构化错误', r2.status === 200 && p2 && p2.ok === false, 'status=' + r2.status + ' body=' + r2.body.slice(0, 120))
}
// ---- 合法 JSON 但 body 分多块到达 ----
{
  const full = JSON.stringify({ action: 'debug', args: {} })
  const r = await fire(reg.handler, { host: '127.0.0.1:3080', origin: 'http://127.0.0.1:3080' }, [full.slice(0, 10), full.slice(10, 20), full.slice(20)])
  let parsed = null
  try { parsed = JSON.parse(r.body) } catch (e) { /* 下面断言 */ }
  record('body 分 3 块到达 → 正常解析执行', r.status === 200 && parsed && parsed.ok === true, 'status=' + r.status + ' body=' + r.body.slice(0, 120))
}

// ---- 汇总 ----
const fail = results.filter((r) => !r.pass)
console.log('\n========== fence 汇总 ==========')
console.log('总计: ' + results.length + '，通过: ' + (results.length - fail.length) + '，失败: ' + fail.length)
if (fail.length) for (const f of fail) console.log('  ❌ ' + f.name)
process.exit(fail.length ? 1 : 0)
