// 状态文件落点策略测试：稳定目录优先 + 工作区回退 + 存量迁移
// 用全路径键控的本地 fs mock（区别于 mock-ctx 的 basename 键控），
// 使稳定目录与工作区两个存储槽位可独立观测。
import { loadPlugin } from './mock-ctx.js'

const DSH_HOME = process.env.DSH_HOME   // mock-ctx 导入时已指向临时目录
const STABLE = DSH_HOME.replace(/\/+$/, '') + '/dsh-xueqiu'
const WS = '/fake-workspace'

const results = []
function record(name, pass, detail) {
  results.push(pass)
  console.log((pass ? '✅' : '❌') + ' ' + name + (pass ? '' : '  >> ' + String(detail).slice(0, 200)))
}

function pathFs(files, opts = {}) {
  return {
    resolve: async (p) => (p && p[0] === '/') ? p : (WS + '/' + p),
    readText: async (p) => { if (!(p in files)) throw new Error('ENOENT: ' + p); return files[p] },
    writeText: async (p, t) => {
      if (opts.denyOutsideWs && p.indexOf(WS + '/') !== 0) throw new Error('EPERM: ' + p)
      files[p] = String(t)
    },
  }
}

function makePlugin(fs) {
  const plugin = loadPlugin()
  let handler = null
  globalThis.harness = {
    handle: (m, h) => { handler = h; return () => {} },
    registerTool: () => () => {},
    defineTool: (s) => s,
  }
  const ctx = {
    timeout(fn) { const t = setTimeout(fn, 1e9); return () => clearTimeout(t) },
    effect(fn) { const d = fn(); return d },
    inject(deps, fn) { fn(ctx) },
    get(n) { if (n === 'fs') return fs; if (n === 'sandboxPolicy') return { workspaceRoot: WS }; return undefined },
  }
  plugin.apply(ctx)
  delete globalThis.harness
  return (action, args) => handler({ action, args: args || {} })
}

// ---- 1. 稳定模式：写入落稳定目录 ----
{
  const files = {}
  const call = makePlugin(pathFs(files))
  await call('ui.set', { tab: 'news' })
  const stableKey = Object.keys(files).find((k) => k === STABLE + '/.xueqiu-ui-state.json')
  record('稳定模式：ui.set 落在稳定目录', !!stableKey, 'keys=' + Object.keys(files).join(','))
  if (stableKey) {
    const parsed = JSON.parse(files[stableKey])
    record('稳定模式：内容含 tab=news', parsed.tab === 'news', files[stableKey])
  }
  record('稳定模式：探测文件存在', STABLE + '/.write-probe' in files, 'keys=' + Object.keys(files).join(','))
  // login 排障路径暴露稳定目录
  const st = await call('login.status', {})
  const pathStr = String((st.data && st.data.path) || st.path || JSON.stringify(st))
  record('login.status 暴露稳定目录路径', pathStr.indexOf(STABLE) >= 0, pathStr)
}

// ---- 2. 迁移读：稳定槽空、工作区槽有旧数据 → 读旧、写新 ----
{
  const files = {}
  files[WS + '/.xueqiu-ui-state.json'] = JSON.stringify({ pos: null, tab: 'hot', minimized: false, legacy: true })
  const call = makePlugin(pathFs(files))
  const got = await call('ui.get', {})
  record('迁移读：ui.get 读到旧工作区数据(tab=hot)', got.data && got.data.tab === 'hot', JSON.stringify(got))
  await call('ui.set', { tab: 'search' })
  record('迁移写：新数据落稳定目录', (STABLE + '/.xueqiu-ui-state.json') in files, 'keys=' + Object.keys(files).join(','))
  const legacy = JSON.parse(files[WS + '/.xueqiu-ui-state.json'])
  record('迁移写：旧工作区文件不被删改', legacy.tab === 'hot' && legacy.legacy === true, files[WS + '/.xueqiu-ui-state.json'])
}

// ---- 3. 回退模式：稳定目录写入被拒 → 行为与旧版一致 ----
{
  const files = {}
  files[WS + '/.xueqiu-ui-state.json'] = JSON.stringify({ pos: null, tab: 'market', minimized: false })
  const call = makePlugin(pathFs(files, { denyOutsideWs: true }))
  const got = await call('ui.get', {})
  record('回退模式：仍能读工作区数据', got.data && got.data.tab === 'market', JSON.stringify(got))
  await call('ui.set', { tab: 'news' })
  const wsKey = WS + '/.xueqiu-ui-state.json'
  record('回退模式：写回工作区路径', JSON.parse(files[wsKey]).tab === 'news', files[wsKey])
  record('回退模式：稳定目录无残留写入', !(STABLE + '/.xueqiu-ui-state.json' in files), 'keys=' + Object.keys(files).join(','))
}

// ---- 4. 首次运行：两槽皆空 → 默认状态不崩 ----
{
  const files = {}
  const call = makePlugin(pathFs(files))
  const got = await call('ui.get', {})
  record('首次运行：ui.get 返回默认 market', got.ok === true && got.data && got.data.tab === 'market', JSON.stringify(got))
}

const failed = results.filter((r) => !r).length
console.log('========== state-paths 汇总 ==========')
console.log('总计: ' + results.length + '，通过: ' + (results.length - failed) + '，失败: ' + failed)
process.exit(failed ? 1 : 0)
