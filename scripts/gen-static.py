#!/usr/bin/env python3
"""从 dynamic/ 生成静态安装形态 src/，并校验无 drift。

单一真源约定：
  - dynamic/host.js、dynamic/client.js 是唯一手写源（函数体形式）。
  - src/index.js     = dynamic/host.js 包上 `export default {...}`
  - src/client/index.js = dynamic/client.js 包上 __ModuleLoader__ CJS 工厂，
    并做两个模式替换（styles.insert→insertStyle；host.call→同源 fetch /xq-rpc）。

用法：
  python3 scripts/gen-static.py          # 生成并校验（drift 时退出码 1，先重写文件）
  python3 scripts/gen-static.py --check  # 只校验，不写文件（CI 用）
"""
import sys, os, pathlib

root = pathlib.Path(__file__).resolve().parent.parent
check_only = '--check' in sys.argv

def die(msg):
    print('GEN-STATIC FAIL:', msg)
    sys.exit(1)

host_body = (root / 'dynamic/host.js').read_text(encoding='utf-8').strip()
client_body = (root / 'dynamic/client.js').read_text(encoding='utf-8').strip()

if not host_body.startswith('return {'):
    die('dynamic/host.js 必须以 "return {" 开头（函数体形式）')
if not client_body.startswith('return {'):
    die('dynamic/client.js 必须以 "return {" 开头（函数体形式）')

# ---- host: export default 包装（函数体顶层 return 换成 export default）----
# 注意：不注入任何宿主包 import —— file: 安装不会安装 peer 依赖，顶层 import
# 会直接 ERR_MODULE_NOT_FOUND 崩掉宿主。agent 工具注册见 host 尾部 xqDefineTool：
# 动态环境用 harness.defineTool，静态环境在运行时从宿主进程解析 dsh-tools，再退回 plain。
assert host_body.startswith('return {')
host_static = 'export default {' + host_body[len('return {'):] + '\n'

# ---- client: CJS 工厂 + 两个模式替换 ----
if "styles.insert(" not in client_body:
    die('dynamic/client.js 缺少 styles.insert —— 转换锚点漂移，请更新本脚本')
if "host.call('xq.call'" not in client_body:
    die("dynamic/client.js 缺少 host.call('xq.call') —— 转换锚点漂移，请更新本脚本")

c = client_body.replace("styles.insert(", "insertStyle(")
c = c.replace(
    "await host.call('xq.call', { action: action, args: args || {} })",
    "await fetch('/xq-rpc', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: action, args: args || {} }) }).then(function (res) { return res.json() })",
)
# 函数体顶层 return {...} → exports.default = {...}（loader 取 exports.default ?? exports）
assert c.startswith('return {')
c = 'exports.default = {' + c[len('return {'):]

client_static = '''// 由 scripts/gen-static.py 从 dynamic/client.js 生成 —— 勿手改；改 dynamic/ 后重新生成。
// 静态 bundle 格式：classic script 注册到 __ModuleLoader__，factory 为 CJS 形式。
window.__ModuleLoader__.load({
  id: 'dsh-xueqiu',
  factory: function (require) {
    var module = { exports: {} }
    var exports = module.exports
    const React = require('react')

    // 动态运行时 styles.insert 的替代：自管 <style> 标签（随插件停用移除交给卸载流程）
    let _styleTag = null
    function insertStyle (css) {
      if (typeof document === 'undefined' || !document.head) return
      _styleTag = document.createElement('style')
      _styleTag.setAttribute('data-plugin', 'dsh-xueqiu')
      _styleTag.textContent = css
      document.head.appendChild(_styleTag)
    }

''' + c + '''
    return module.exports
  }
})
'''

targets = {
    root / 'src/index.js': host_static,
    root / 'src/client/index.js': client_static,
}

drift = []
for path, content in targets.items():
    old = path.read_text(encoding='utf-8') if path.exists() else None
    if old != content:
        drift.append(path.name)
        if not check_only:
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text(content, encoding='utf-8')
            print('regenerated', path.relative_to(root))

if drift:
    if check_only:
        die('src/ 与 dynamic/ 不同步: ' + ', '.join(drift) + ' — 运行 python3 scripts/gen-static.py')
    print('OK (已重新生成: ' + ', '.join(drift) + ')')
else:
    print('OK: src/ 与 dynamic/ 完全同步')
