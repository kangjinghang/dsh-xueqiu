// QA 测试夹具：在 Node 中以受控 ctx 实例化 dynamic/host.js，不需要真实 DSH 运行时。
// 用法见 qa/unit.mjs / qa/live.mjs
import { readFileSync } from 'node:fs'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { mkdtempSync, writeFileSync, readFileSync as rfs } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
const run = promisify(execFile)

export function loadPlugin() {
  const src = readFileSync(new URL('../dynamic/host.js', import.meta.url), 'utf8')
  return new Function(src)() // -> { inject, apply }
}

// fakeShell: 可以注入脚本化响应（离线单测），或直通本机 curl（live 测试）
export function makeCtx(opts = {}) {
  const effects = []
  const injected = []
  const root = opts.root || mkdtempSync(join(tmpdir(), 'xq-qa-'))
  const files = {} // 内存文件系统（loadXxx 读到什么由用例控制）
  if (opts.files) Object.assign(files, opts.files)

  const ctx = {
    timeout(fn, ms) { const t = setTimeout(fn, ms); return () => clearTimeout(t) },
    effect(fn) { const d = fn(); effects.push(d); return d },
    inject(deps, fn) { injected.push(deps); fn(ctx) },
    get(name) {
      if (name === 'shell') return opts.shell
      if (name === 'fs') return {
        resolve: async (p) => join(root, p),
        readText: async (p) => { const f = files[p.split('/').pop()]; if (f === undefined) throw new Error('ENOENT'); return f },
        writeText: async (p, t) => { files[p.split('/').pop()] = t },
      }
      if (name === 'sandboxPolicy') return { workspaceRoot: root }
      return undefined
    },
    // 测试内省
    __files: files, __effects: effects, __injected: injected, __root: root,
  }
  return ctx
}

// 真实 shell：用本机 curl 跑，shell.resolve/run 语义对齐 DSH shell 服务
export function realShell() {
  return {
    resolve: (spec) => spec,
    run: async (spec) => {
      try {
        const { stdout, stderr } = await run('/bin/bash', ['-c', spec.command], { timeout: spec.timeoutMs, maxBuffer: spec.stdoutMaxBytes || 4 * 1024 * 1024 })
        return { exitCode: 0, stdout: { text: stdout }, stderr: { text: stderr || '' } }
      } catch (e) {
        return { exitCode: e.code ?? 1, stdout: { text: e.stdout || '' }, stderr: { text: e.stderr || e.message } }
      }
    },
  }
}

export function pluginApi(plugin, ctx) {
  // 抓 handleCall：静态分支下走 webServer，这里直接 mock harness 门面
  let handler = null
  globalThis.harness = {
    handle: (m, h) => { handler = h; return () => {} },
    registerTool: () => () => {},
    defineTool: (s) => s,
  }
  plugin.apply(ctx)
  delete globalThis.harness
  return async (action, args) => handler({ action, args: args || {} })
}
