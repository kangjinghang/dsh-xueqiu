# 发布流程与质量关卡

## 背景

2025-08-19 的教训（v1.7.0）：动态模式三轮自测全绿，但用户 `dsh plugin add` 静态安装后
`dsh web` 启动即崩（`harness is not defined`）。根因是**两条加载路径的运行时差异没有任何机制强制对齐**：

| 差异点 | 动态（开发模式） | 静态（用户安装） |
|---|---|---|
| Host RPC | `harness.handle()` 门面 | 不存在；须走 `webServer` 路由 |
| Client 载入 | 函数体注入闭包（自带 `React`/`styles`/`host` 符号） | classic script，须 `__ModuleLoader__.load` CJS 工厂 |
| Client→Host | `host.call`（只路由动态注册表） | 同源 `fetch('/xq-rpc')` |

## 三层防护（现状）

1. **源码单一真源** — `dynamic/` 是唯一手写源，`src/` 由 `scripts/gen-static.py` 生成。
   发布前 `--check` 校验无 drift；转换锚点（`styles.insert` / `host.call`）漂移时生成器主动报错。
   ```bash
   npm run generate   # 改完 dynamic/ 后重新生成 src/
   ```

2. **静态冒烟关卡** — `scripts/static-smoke.sh` 在隔离 `DSH_HOME` 临时目录里
   走完整用户路径：`dsh plugin add` → `--dump-config` → 真实启动 → boot 清单 → bundle 格式
   （含 `host.call` 残留检查）→ `/xq-rpc` 真实行情 → 同源栅栏 403。
   已用 v1.7.0 坏代码做过负向验证：第 3 步必然失败。
   ```bash
   bash scripts/static-smoke.sh              # 无浏览器，CI 可跑
   SMOKE_BROWSER=1 bash scripts/static-smoke.sh   # 本机可追加浏览器徽章检查
   ```

3. **发布钩子 + CI** — `npm publish` 前自动跑 `npm run check`（drift + 语法 + 冒烟）；
   `.github/workflows/check.yml` 在 push/PR 时跑同样关卡。

## 发布 checklist

1. 改代码：只改 `dynamic/`，然后 `npm run generate`
2. 动态模式自测（cordis define/run + 浏览器）
3. `npm run check`（静态关卡）
4. 版本号 + 双语 changelog → commit → push
5. `npm publish --registry https://registry.npmjs.org`（prepublishOnly 会再跑一遍关卡；
   本机默认 registry 是 npmmirror 镜像，**必须显式指定官方 registry**）
6. tag + GitHub Release（**别漏**——v1.10~v1.15.2 曾只发 npm 漏建 Release，后补 12 个）：
   ```bash
   git tag -a v<X.Y.Z> -m "v<X.Y.Z> — <标题>" && git push --tags
   gh release create v<X.Y.Z> --title "v<X.Y.Z> — <标题>" --notes "<从 changelog 提取>"
   ```
   注意：tag 已存在时 `gh release create` **不要**再传 `--target`（会 422），直接用 tag。
7. （仅首次）确认 `package.json` 含 `repository` 字段——npm 包 ↔ GitHub 仓库的关联依据，
   插件市场（dsh-market 1.15.0+）靠它自动采集下载量排序；已随 v1.15.2 补齐
