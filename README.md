# dsh-xueqiu · 雪球 mini 行情面板

> DeepSeek Harness 上的雪球行情面板：**免登录**查看 A股/港股/美股实时行情、K线、分时、热榜、搜索、7×24 快讯与热议用户。面板嵌入输入框上方不遮挡对话，常驻行情区域显示四大指数与自选股涨跌，交易时段智能刷新。

[![npm version](https://img.shields.io/npm/v/dsh-xueqiu?style=flat-square&label=npm)](https://www.npmjs.com/package/dsh-xueqiu)
[![npm downloads](https://img.shields.io/npm/dm/dsh-xueqiu?style=flat-square)](https://www.npmjs.com/package/dsh-xueqiu)
[![GitHub stars](https://img.shields.io/github/stars/wanderer-yk/dsh-xueqiu?style=flat-square)](https://github.com/wanderer-yk/dsh-xueqiu/stargazers)
[![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](./LICENSE)
[![dsh-plugin](https://img.shields.io/badge/dsh--plugin-xueqiu-1DA1F2?style=flat-square)](#-安装)

中文 | [English](./README.en.md)

**[功能](#-功能) · [截图](#-截图) · [安装](#-安装) · [使用](#️-使用) · [稳定性](#-稳定性设计) · [质量与测试](#-质量与测试) · [FAQ](#-faq) · [更新日志](#-更新日志)**

## 🆚 与同类行情插件

| 能力 | dsh-xueqiu | 股票皮肤类插件 |
| --- | --- | --- |
| 面板形态 | 嵌入输入框上方，不遮挡对话 | 全局换肤/状态栏 |
| K线/分时 | KLineChart 引擎蜡烛图/分时面积图+均线+十字光标，7 档周期 | 部分有 |
| 热榜/快讯/KOL | 全有 | 多数无 |
| 数据源 | 雪球（社区数据：帖子/热议用户独有） | 腾讯/Yahoo 等 |
| 请求防护 | 闸门+看门狗+缓存+自愈+隐藏暂停 | 一般仅缓存 |
| 常驻行情区域 | 四大指数+12 自选两列平铺，⤡ 调宽 | 多为纯状态栏 |
| 主题 | 跟随 DSH 明暗 | 需整体换肤 |

## ✨ 功能

| 功能 | 说明 |
| --- | --- |
| 📊 实时行情 | 大盘指数（上证/深证/创业板/科创50）+ 自选股列表，涨红跌绿，**表头点击排序** |
| 🕯️ K线图 | 基于 [KLineChart v10](https://github.com/klinecharts/KLineChart) 引擎（canvas 渲染，内置主题适配）：蜡烛图 + 独立成交量窗格 + **MA 均线** + 十字光标 legend，5分/15分/30分/60分/日K/周K/月K 7 档切换；**滚轮缩放 + 拖拽平移**，左拖触底自动加载更早历史（500 根/次，已实测连续加载至 3400+ 根） |
| ⏱️ 分时图 | 面积价格线（涨跌色）+ 均价线 + 昨收基准虚线，十字光标 tooltip 查任意分钟 价/均价/涨跌 |
| 🔥 热榜 | 雪球热门榜，A股/美股/港股/全球 切换 |
| 🔍 搜索 | 搜股票（一键加自选/看详情）、搜帖子 |
| 📰 快讯 | 7×24 实时快讯，重要新闻高亮 |
| 👥 热议用户 | 个股热门 KOL（粉丝数/认证标识） |
| 💼 自选股 | 本地持久化，增删随点随改；**可选登录**后直接使用雪球云端自选股 |
| 👤 可选登录 | 粘贴浏览器 Cookie 即可登录（借鉴 [xueqiu-cli](https://github.com/fanxinqi/xueqiu-cli) 手动模式）：登录后自动拉取云端自选股，加/删自选尽力同步到云端；Cookie 仅存本机 `~/.dsh` 工作区文件，不上传任何第三方 |
| 🧲 嵌入式面板 | 完整面板停靠在**输入框上方**（官方 `conversation.input.dock` 槽位），随页面布局流动，**不遮挡对话记录** |
| 🏷️ 行情区域 | 常驻悬浮区域：头部一行 logo/盘中状态，**四大指数两列**（上证/深证/创业/科创50）+ **自选前 12 只两列平铺**；点击开合面板，拖动调整位置（记忆），右下角 **⤡ 手柄**调宽度 120–480px（双击复位 320），宽度/位置持久化 |
| 📏 面板高度可调 | 拖动面板底边调整高度（160px–85% 视口，双击复位），高度持久化记忆 |
| ⌨️ Esc 收起 | Esc 先关个股详情，再收起面板；点行情区域或底部指数条重新展开 |
| 🛡️ 请求防护 | 并发 2 + 100ms 最小间隔对齐网页端行为；**30s 看门狗**强制释放悬挂请求防管线冻结；Cookie 失效/风控自动重播种重试；限频指数退避；**页面隐藏自动暂停全部轮询**（回前台立即恢复） |
| 🗂️ 渐进详情 | 个股详情报价+K线先上屏，分时/财务/KOL 到达后增量合并，不用等齐 |
| ⏱️ 智能刷新 | 盘中 20s 刷新行情，收盘自动放慢，降低被风控概率 |
| 🕐 交易时段 | 面板头常驻显示 **A 股/港股/美股** 盘中·午休·盘前·休市（本地时区推算，不含节假日），行情区域显示精确 A 股时段 |
| 🌗 主题自适应 | 跟随 DSH 明暗主题 |
| 🤖 Agent 工具 | **对话内直接问行情**：`xueqiu_quote`（实时行情）、`xueqiu_kline`（K线）、`xueqiu_search`（搜股票）、`xueqiu_hot`（热榜）、`xueqiu_news`（7×24 快讯）、`xueqiu_kol`（个股热议大V）——模型直接调用，无需翻网页 |
| 🃏 工具调用卡片 | `xueqiu_quote` 渲染为红涨绿跌行情表、`xueqiu_kline` 为迷你蜡烛图、`xueqiu_hot` 为热榜排名列表、`xueqiu_news` 为快讯时间线（重要快讯高亮），对话流内直接看结果 |

所有数据来自雪球公开接口（访问首页获取匿名 cookie + 浏览器 UA/Referer），**无需登录**。

## 📸 截图

**嵌入式主面板**：停靠在输入框上方，指数卡 + 自选股行情 + 四个功能页签：

![主面板](https://raw.githubusercontent.com/wanderer-yk/dsh-xueqiu/main/assets/panel.png)

**个股详情**：16 项行情数据 + K线蜡烛图（成交量柱 / MA5-10-20 均线 / 十字光标）+ 财务指标 + 热议用户：

![个股详情](https://raw.githubusercontent.com/wanderer-yk/dsh-xueqiu/main/assets/detail.png)

**迷你行情区域**：四大指数 + 自选 12 只两列平铺，⤡ 手柄调宽度，点击开合面板，可拖动：

![迷你行情区域](https://raw.githubusercontent.com/wanderer-yk/dsh-xueqiu/main/assets/badge.png)

**Agent 工具调用卡片**（对话内直接问行情，结果渲染为专属卡片而非 JSON）：

| `xueqiu_quote` 行情表 | `xueqiu_kline` 蜡烛图 |
| --- | --- |
| ![quote](https://raw.githubusercontent.com/wanderer-yk/dsh-xueqiu/main/assets/toolcards/quote.png) | ![kline](https://raw.githubusercontent.com/wanderer-yk/dsh-xueqiu/main/assets/toolcards/kline.png) |

| `xueqiu_hot` 热榜 | `xueqiu_news` 快讯时间线 |
| --- | --- |
| ![hot](https://raw.githubusercontent.com/wanderer-yk/dsh-xueqiu/main/assets/toolcards/hot.png) | ![news](https://raw.githubusercontent.com/wanderer-yk/dsh-xueqiu/main/assets/toolcards/news.png) |

## 📦 安装

### 方式一：标准 bundle 插件（推荐）

```bash
# npm 包
dsh plugin --profile web add dsh-xueqiu

# 或 GitHub 源（git 安装会直接从源码构建）
dsh plugin --profile web add github:wanderer-yk/dsh-xueqiu

# 或本地目录
dsh plugin --profile web add ./dsh-xueqiu
```

添加后重启一次 `dsh web`（插件行发现按启动缓存），之后刷新页面即可看到面板。

### 方式二：动态插件（已实测）

本仓库 `dynamic/` 目录提供**已实测可用**的动态 Cordis 插件源码（`host.js` + `client.js`）。在任意 DSH 会话中让 Agent 加载即可：

```
请读取本仓库 dynamic/host.js 与 dynamic/client.js 两个文件，
用 cordis_define（kind: new）定义插件：
  code.host 填入 host.js 的内容，code.client 填入 client.js 的内容，
  然后 cordis_run 启动它。
```

## 🎛️ 使用

- **面板停靠在输入框上方**：与对话同列流动，不遮挡任何消息；`收起 —` 或 `Esc` 收起。
- **右下角行情区域**常驻显示四大指数 + 自选前 12 只（两列平铺）；**点击**开合面板，**拖动**调整位置（记忆位置），**⤡ 手柄**横向调宽（120–480px，双击复位）。
- 输入框下方的**指数条**点击也可展开面板。
- 点击自选股、指数卡或热榜行 → 个股详情：16 项行情数据 + K线/分时切换（悬停图表看十字光标详情）+ 财务指标（ROE/毛利率/净利同比等）+ 热议用户。
- **面板高度**：拖动面板底边的手柄上下调整（160px ~ 85% 视口高度），**双击手柄复位**；高度会被记忆。
- **登录雪球（可选）**：点面板右上「👤 登录」，按提示从浏览器复制 Cookie 整行粘贴即可。登录后自选股切换为你的**雪球云端自选股（云端为准，10 分钟自动同步）**；「同步云端自选」可随时手动拉取；加/删自选双端同步（`portfolio/stock/add.json` / `cancel.json`）。Cookie 只保存在本机，退出登录即清除。
- 刷新频率：盘中行情 20s、内容 60s；收盘后自动降为 60s / 3min。

## 🔧 稳定性设计

数据层内置多层防护，长时间挂机也不会卡死：

- **请求闸门**：并发上限 2、请求间最小间隔 100ms，模拟网页端节奏，降低风控概率。
- **30s 看门狗**：单个请求悬挂超 30s 即强制释放调度槽并报错，不会冻结后续所有请求。
- **TTL 缓存 + in-flight 去重**：相同 URL 短时间窗内直接命中缓存，并发重复请求共享同一 Promise。
- **Cookie 自愈**：匿名 cookie 失效（错误码 400016）或被风控返回空响应时，自动重新访问雪球首页播种新 cookie 再重试。
- **限频退避**：遇到"请求频繁"按 2s→4s 指数退避后重试。
- **渐进渲染**：详情页报价 + K线先行上屏，分时/财务/KOL 异步到达后增量合并。

## 🧪 质量与测试

> **平台要求**：macOS / Linux / Windows。macOS/Linux 走 POSIX shell curl；Windows 走 DSH 的 PowerShell 层显式调用 `curl.exe`（Win10+ 自带），引号语义天然兼容，已在 GitHub Actions `windows-latest` 上真连雪球全量验证（含匿名 Cookie 播种链路）。

三套互补的自动化测试，每次发版前全部通过（最近一次实测 2026-08-20，macOS + dsh web 3080 端口）：

| 套件 | 覆盖 | 实测结果 |
| --- | --- | --- |
| `scripts/static-smoke.sh` | 静态安装 7 道门禁（tarball 解包 → cordis 组合 → bundle 注册 → RPC 起活） | ✅ 7/7 |
| `scripts/feature-matrix.py` | 20 个 RPC 动作 × 正常/边界/非法/降级 × 未登录/已登录/Cookie过期 三环境 | ✅ 54–56 项断言全过 / 每环境 |
| `scripts/browser-interact.sh` | 真实鼠标交互：徽章拖动/⤡调宽/双击复位/面板开合/四个页签数据/越界恢复钳制 | ✅ 全过 |

**热缓存性能实测**（数据已在 TTL 窗口内，即用户连续操作时的体验）：

```
kline       日K 120 根      1–12 ms
quote       3 只行情批量      1 ms
quoteDetail 个股详情         1 ms
search      搜索"茅台"        2 ms
finance     财务指标          2 ms
```

首次冷请求（需访问雪球取数）典型耗时 100–700ms，全部经请求闸门（并发 2）排队。复现方式：装好插件后 `python3 scripts/feature-matrix.py --base http://127.0.0.1:3080 --mode logged`。

## 📁 目录结构

```
dsh-xueqiu/
├── src/
│   ├── index.js          # Host 插件（curl 数据层 + connection RPC）
│   └── client/index.js   # Client 插件（嵌入式面板 + 常驻行情区域 UI）
├── dynamic/
│   ├── host.js           # 动态插件版 Host（已实测）
│   └── client.js         # 动态插件版 Client（已实测）
├── package.json          # bundle 声明（dsh.bundle / dsh.client）
└── cordis.patch.yml      # bundle 层插入
```

## ❓ FAQ

**Q: 安装后面板不出现？**
按安装说明重启一次 `dsh web`（插件行按启动缓存发现），再硬刷新页面（Ctrl/Cmd+Shift+R）。仍无面板时看右下角有无行情区域——区域在则点它展开。

**Q: 行情数据突然全空/报错？**
雪球匿名 cookie 偶发被风控（错误码 400016 或空响应）。插件会自动重播种 cookie 并重试；连续失败时等 1–2 分钟再点「刷新」，或收起面板降低请求频率。

**Q: K线周期里分时下为什么没有周期按钮？**
分时模式只展示当日分钟线，K线模式才有 7 档周期，属设计行为。

**Q: 交易时段提示节假日准吗？**
不准。时段按每周一至周五的固定钟点本地推算，不含法定节假日调休，仅供参考。

**Q: 自选股和面板设置存在哪？**
宿主本地文件 `~/.xueqiu-watchlist.json` 与 `~/.xueqiu-ui-state.json`（含区域宽度/位置），与浏览器 localStorage 无关，换浏览器不丢。

**Q: 会不会影响 DSH 本体？**
插件 UI 全部挂在官方槽位（`conversation.input.dock` / `shell.overlay` / `conversation.composer.dock`），卸载即完全消失，不改 DSH 源码。

## ⚠️ 免责声明

- 本项目**非雪球官方**产品，与雪球网/雪球公司无关；"雪球"为雪球公司商标，此处仅作数据来源描述。
- 数据来自雪球公开 Web 接口，仅供**学习与研究**，**不构成任何投资建议**；请勿高频请求，遵守目标网站条款。
- 接口可能随时变更导致功能失效，欢迎提 [Issue](https://github.com/wanderer-yk/dsh-xueqiu/issues) / PR。

## 📋 更新日志

- **1.22.6**（2026-08-26）
  - 修复：**分时悬停信息双份叠加**（1.22.5 排查发现）。分时面积图"开=高=低=收"同值，canvas OHLC 图例纯冗余，且 xq-minute 指标图例（昨收/均价）与自定义 .xq-tip 重复显示两遍。分时模式现在彻底关闭 canvas 图例（蜡烛+指标），悬停只保留 .xq-tip。
  - 新增：**K线悬停显示 MA 数值**（1.22.0 以来 MA 值无处可看的补课）。指标图例改 `follow_cross`：悬停时蜡烛行（开高低收量）下方第二行彩色显示 MA5/10/30/60 数值（实测茅台 MA 行单行占宽 70%，不折行），与雪球一致。
- **1.22.5**（2026-08-26）
  - 修复：**悬停 OHLC 图例折成两行压图**（1.22.3 遗留）。`follow_cross` 后默认英文 time/open/high/low/close/volume 标题过长，悬停时图例在窄面板折两行盖住蜡烛。改为紧凑中文单行（`开 高 低 收 量`，字号 10）+ 隐藏 ticker 标题——实测悬停图例单行 10px 高、占宽 45%，不再折行。
- **1.22.4**（2026-08-26）
  - 修复：**切分时整个面板崩溃消失**（1.22.3 回归）。双击回最新的清理函数里用了 `boxRef.current.removeEventListener`，但 React 卸载组件时先清 ref 再跑 effect 清理，此时 `boxRef.current` 已是 null → 抛 TypeError → `conversation.input.dock` 槽位整体崩溃，只剩自选股小徽章且无法重开。改为 effect 内闭包捕获节点。回归：K线↔分时来回 4 轮 + 收起/徽章重开/再进详情，0 报错。
- **1.22.3**（2026-08-26）
  - 修复：**K线 OHLC 图例常驻压蜡烛**。KLineChart v10 默认 `candle.tooltip.showRule: 'always'` 把 time/open/high/low/close/volume 永久画在蜡烛区左上角（像素级实测 1394 个文字像素自 y=23 起覆盖蜡烛）。改为 `follow_cross`（十字光标悬停才显示，与雪球一致），此前只关了指标 tooltip 漏了蜡烛自身的。
  - 修复：**"双击回最新"标签承诺无实现**。图表下方文案写了"双击回最新"但代码没有 dblclick 处理（实测左拖加载 999 根后双击无反应）。现监听容器 dblclick → `chart.scrollToRealTime()`（实测可视区 132→430-500 回到最新）。
  - 细节：K线日期标签补年份（500 根日K时"08-26 ~ 08-24"像时间倒流，实际跨两年；现显示"2024-08-02 ~ 2026-08-25"）；详情页 hero 现价/涨跌额按现价实际小数位显示（港股 00700 此前 440.40 → 440.4）。
- **1.22.2**（2026-08-24）
  - 修复：**K线均线 / 分时均价误落附图**。KLineChart v10 的 `createIndicator('MA')` 默认给指标新开 pane——均线不在蜡烛主图上（主图被挤到 72px），分时均价/昨收也在独立附图。须传 `{ name, paneId: 'candle_pane' }` 显式叠加到主图（pane id 从引擎源码确认）。修复后：K线主图 173px 蜡烛+MA5/10/30/60 叠加、附图仅成交量；分时只剩一张主图（分时曲线+均价+昨收全部叠加），与雪球布局一致。
  - 样式：**详情页参考雪球重排版**——顶部行情主标题（大号红/绿现价 + 涨跌额 + 涨跌幅，如 `1304.66 +31.83 +2.50%`）；16 格 stat 卡片更轻盈（浅底/圆角/等宽数字/标签次要色）；卡片标题左侧主题色强调条；K线/分时与周期按钮选中态改主题色 tint 填充；K线画布 264→300px；MA 均线和谐四色（蓝/橙/紫/青）；关闭最高/最低点重复标注（消除窄图顶部杂乱数字）。
- **1.22.1**（2026-08-24）
  - chore：移除 peerDependencies 避免安装警告；静态冒烟脚本自动兜底本地 `npx dsh`（prepublishOnly 下找不到 dsh 命令）。
- **1.22.0**（2026-08-24）
  - 新增：**K线/分时切换 KLineChart v10 引擎**（canvas 渲染、内置明暗主题适配）：蜡烛图 + 成交量 + MA 均线 + 十字光标，5分/15分/30分/60分/日K/周K/月K 7 档；滚轮缩放、拖拽平移、左拖触底自动加载更早历史（500 根/次）；分时面积图（涨跌色）+ 均价线 + 昨收虚线。
- **1.21.7**（2025-08-24）
  - 修复：**越屏钳制改为逐渲染执行**。1.21.6 的"effect 依赖 badgePos + ResizeObserver"方案在 CI 慢环境仍漏过"渲染后才长高"的时序（数据异步到达→徽章长高→无重触发钳制）。现在 `useLayoutEffect` 每次渲染后钳制（数据到达必伴随重渲染，无时序死角；ui.set 仅在有变更时触发下一轮，收敛不循环）。CI 实测踩坑修复。
  - 新增：**浏览器 E2E 进 CI**（`browser-e2e` job）。此前这层（唯一抓到过钳制死代码真 bug 的测试）只在本机手动跑。`scripts/e2e-ci-boot.sh` 合成"已完成引导"的隔离 DSH 实例（settings 跳过 onboarding + workspace 表 + 含完整一轮对话的逐行 zstd 会话日志——踩坑记录：DSH 逐记录写日志，每 zstd 帧恰好一行；slug 规则 cwd 去首 `/`、余 `/`→`-`、两端包 `--`），agent-browser 跑全部 18 项断言。E2E 脚本兜底：全新实例无活动对话时先展开会话分组再点开一个会话（conversation.input.dock 槽需要对话视图）。
- **1.21.6**（2025-08-24）
  - 修复：**徽章越屏钳制是死代码**。挂载后的实测钳制 `useEffect` 依赖为 `[]`，只在首帧跑一次——而 hydrate 异步恢复 badgePos 发生在其后，钳制永远空跑；DockGate 恢复时的估算宽度（badgeW 空时按 320）又偏小，实测 346px。后果：恢复越屏坐标后徽章右/下缘出屏，真实鼠标点击落空，面板打不开（热榜/快讯/搜索随之全空）。修复：effect 依赖加 badgePos（hydrate 后按实测尺寸再钳一次）+ ResizeObserver 监听徽章自身长高长宽再钳。浏览器回归连跑 3 轮 18 项全绿。
  - 测试：浏览器回归脚本修两处不稳定——① `agent-browser dblclick` 的两次点击间隔超出系统双击判定阈值（页面 dblclick 监听计数为 0），改派发 dblclick 事件；② 交互步骤前 rpc 固定徽章到视口中部再刷新，消除"上一轮遗留位置导致真实鼠标命中失败"的漂移。
- **1.21.5**（2025-08-24）
  - 测试：**写失败契约 + cache stampede 冒烟**（`qa/contract.mjs` 新增 C3：add 无效代码被拒或静默忽略且列表不变、cancel 不存在代码幂等零副作用、坏 Cookie 写被 400016 拒绝零副作用；`qa/unit.mjs` 新增 5 URL × 3 并发回源恰 5 次的 stampede 冒烟）。实测发现：上游对无效代码 add 返回 `{data:true}` 但列表不变（静默忽略）。
  - 修复：**登录文件错位排障盲区**。登录文件位置由运行时 workspaceRoot 决定（随会话变化），此前 `login.status` 不暴露路径，排障只能猜（曾误查 `~/.` 而插件实际写入会话工作区）。现在 `login.status` 返回真实 `path` 与 `savedAt`；契约测试多候选探测（env → `~/.` → cwd → 父目录）并打印命中的文件路径；Cookie 过期（400016）时哨兵直接提示"重新登录更新 XQ_COOKIE"而非误报接口变更。另：实测登录 Cookie 约 3 天过期，过期后需重跑插件登录并更新 secret。
- **1.21.0**（2025-08-21）
  - 新增：**Windows 支持**。DSH 在 Windows 上的 shell 层是 PowerShell（`pwsh -Command`），单引号字面量语义与 POSIX 一致——原先"cmd 引号不兼容"的障碍实际不存在。三处适配：① 显式调用 `curl.exe`（绕开 PS 5.1 中 `curl` = `Invoke-WebRequest` 别名，Win10+ 自带 curl.exe）；② Cookie 播种的 `-o /dev/null` 在 Windows 换成 `NUL`；③ Cookie 请求头剥离引号字符防注入。测试桩 `realShell` 平台对齐（win32 走 pwsh，同 DSH win32 层）。CI 新增 `windows-latest` 任务：单测 + cookie 测试 + live.mjs 真连雪球（51 断言，含匿名播种链路）全绿。README 平台要求同步更正为 macOS / Linux / Windows。
- **1.20.6**（2025-08-21）
  - 测试：**雪球云端自选接口契约测试进 CI**（`qa/contract.mjs`，7 断言）——直连真实端点验证 `portfolio/list.json` / `portfolio/stock/list.json` / `add.json` / `cancel.json` 契约（含真实 add→cancel 往返后还原）。每日定时（UTC 21:00）用 `XQ_COOKIE` secret 真跑，雪球改接口时这里最先失败，防止 `watch.json` 类"虚构端点"事故重演；无 secret 时（push/PR）自动 skip，同一定时任务顺带跑 live.mjs（51 断言）。需在仓库 Settings → Secrets 配置 `XQ_COOKIE`（浏览器完整 Cookie 请求头，含 `xq_a_token`）。
- **1.20.5**（2025-08-21）
  - 修复：**云端自选双写从未生效**——此前调用的 `watch.json` 是不存在的端点（WAF 对未知路径统一 403，曾误判为"雪球封禁第三方写入"）。真实端点是 `portfolio/stock/add.json` / `cancel.json`（POST form，symbols 参数）。已修正并经真实账号完整往返验证：插件加自选 → 云端 116 只 ✓ → 插件移除 → 云端还原 115 只 ✓。本地加/删自选恢复真正的双端同步，账号面板与 README 文案同步更正。
- **1.20.4**（2025-08-21）
  - 修复：**host 内存缓存无淘汰**——K 线 begin 参数按分钟取整使缓存 key 持续增长，长开实例会无界泄漏；现在写入时清理过期条目并设 200 条容量上限（写入即清，无后台任务）。
  - 修正：**云端自选写入已被雪球风控封禁**（读接口正常、写接口 openresty 403）——账号面板与 README 文案如实说明「云端为准：本地加/删会在下次同步时被云端覆盖，改自选请去雪球网页/App」。
  - 测试：看门狗 30s 超时路径单测（挂起请求精确 30s 释放、槽位归零）；缓存淘汰单测（230 条→钳 200）；云端同步真实往返 E2E；agent 工具真实会话 E2E（自然语言→选工具→卡片渲染→结构化回复，数据与直连一致）。
- **1.20.3**（2025-08-21）
  - 修复：**徽标位置视口钳制**——窗口缩小/分辨率变化后徽标不再滞留屏幕外；挂载时按真实渲染尺寸（含边框）钳制，resize 实时重钳制（浏览器实测 375px/320px 视口均不溢出）。
  - 加固：`/xq-rpc` 请求体 1MB 上限（超出 413），防失控本地进程 OOM。
  - 声明：README 明确平台要求 macOS / Linux（POSIX shell curl，Windows 暂不支持）。
  - 测试：完成浏览器级 UI 走查（徽标/面板 4 tab/搜索/详情/K线十字光标/登录三档错误路径）与动态分支协议验证，登录态备份-恢复全程无损。
- **1.20.2**（2025-08-21）
  - 修复：**完整 QA 测试轮发现的 3 个缺陷**——① `login.status` 在登录文件缺 uid/screenName 字段时不再返回空，回退到 JWT 解码值；② K 线查询无效代码的错误文案不再误导为「cookie 不完整」，明确提示检查代码格式；③ `xueqiu_news` 的 count 参数现在真正生效（上游固定每页 ~10 条并忽略 count，工具层用 max_id 自动翻页补足，最多 3 页）。
  - 新增：**离线单测套件 `qa/`**（mock shell，不发网络）并接入 GitHub Actions——覆盖调度节流/TTL 缓存/重试链/云端同步语义/cookie 双 URL 回退/命令注入防护等 40 项断言；另有本地 live 套件 `qa/live.mjs` 对真实 API 做 51 项数据正确性验证。
- **1.20.1**（2025-08-20）
  - 打磨：**6 个 agent Tool 描述重写**——每个工具的 description 扩展为结构化说明（何时使用 / 输入格式与示例 / 输出字段），并写明工具间的协作关系（不确定代码先 `xueqiu_search`、只要最新价别拉 K 线、热榜≠涨幅榜等边界）。纯文案改动，直接提升 agent 选工具与传参的准确率（对标 dsh-us-stocks 的描述深度）。
- **1.20.0**（2025-08-20）
  - 新增：**登录态自选股自动同步（云端为准的双端统一）**——打开面板/行情刷新时自动检查，距上次同步超过 10 分钟即在后台拉取云端自选并镜像到本地；你在雪球网页/App 上加删自选，插件端 10 分钟内自动跟随。节流时间戳持久化，多实例不重复拉取；接口异常静默失败不影响行情；云端返回空列表时不镜像（防误清空）。「同步云端自选」按钮保留，点击强制立即同步。
- **1.19.1**（2025-08-20）
  - 修复：匿名 cookie 播种改为**双 URL 兜底链**——优先 `xueqiu.com/hq`（无 WAF 挑战，直接发全套匿名 token），失败再回退首页。部分地区首页被阿里云 WAF JS 挑战接管后只发 `acw_tc`，导致匿名请求报 400016，此修复使播种不再依赖单一入口（感谢 [@Lambenthan](https://github.com/Lambenthan) PR#2 的定位与验证）。
- **1.19.0**（2025-08-20）
  - 新增：**K线滚轮缩放 + 拖拽平移**——详情页K线默认显示尾部 120 根（缓冲 500 根），滚轮以鼠标位置为锚点缩放（20~全部），水平拖动平移看历史；拖到缓冲头部自动追加拉取更早 500 根（按时间戳去重合并，上限 3000 根）；双击复位。图底标注 `窗口/总数 根` 与操作提示。
  - host：`kline` RPC 新增 `begin` 参数（毫秒时间戳），返回该根往前的历史，供平移分页（分钟取整保证缓存 key 稳定）。
- **1.18.2**（2025-08-20）
  - 修复：Agent 工具的时间戳用了 UTC（`toISOString`），快讯/K线时间比本地早 8 小时（18:14 显示成 10:14）。现按本地时区格式化。
- **1.18.1**（2025-08-20）
  - 新增：`xueqiu_hot` 热榜卡片（排名+名称+热度升降+现价涨跌）与 `xueqiu_news` 快讯卡片（时间线、mark=1 重要快讯高亮、列表内滚动）。
- **1.18.0**（2025-08-20）
  - 新增：**Agent 工具调用卡片**——`xueqiu_quote` 结果渲染为红涨绿跌行情表，`xueqiu_kline` 渲染为迷你蜡烛图（复用面板图表组件，头部含周期/根数/区间/区间涨跌），对话流内直接看图，不再是一坨 JSON。
- **1.17.0**（2025-08-20）
  - **新增：Agent 工具（一期 6 个）**——模型在对话中直接调用雪球数据，不必再让 agent 爬网页：`xueqiu_quote`（实时行情，一次 20 只）、`xueqiu_kline`（7 档周期 OHLCV）、`xueqiu_search`（代码/中文名/拼音搜索）、`xueqiu_hot`（热榜）、`xueqiu_news`（7×24 快讯，可翻页）、`xueqiu_kol`（个股热议大V，雪球社区数据独有）。复用既有请求闸门/缓存/Cookie 自愈，数据层零新增请求路径。
- **1.16.1**（2025-08-20）
  - 修复：双击 ⤡ 复位徽章宽度时，`badgeW:null` 被 host 侧 `Number(null)=0` 钳制为下限 120px 落盘——刷新后徽章变成 120px 窄条（`dockH` 同理被钳为 160）。现 null 按显式复位处理。
  - 修复：恢复徽章位置时的视口钳制按实际宽度计算（原先固定 `-140`，区域模式宽达 480px 时右缘出屏）。
  - 新增：`scripts/browser-interact.sh` 浏览器交互回归（真实鼠标事件：拖拽/调宽/双击复位/面板四 tab/越屏恢复）。
- **1.16.0**（2025-08-20）
  - 修复：登录 Cookie 过期后，公开行情接口（报价/K线/分时/热榜等）被一并毒化全部报错 —— 现自动降级为匿名请求继续工作，仅云端自选等功能提示重新登录。
  - 新增：`scripts/feature-matrix.py` 功能矩阵回归测试（155 项断言 × 未登录/已登录/Cookie过期 三环境）。
- **1.15.2**（2025-08-19）
  - `package.json` 补齐 `repository`/`bugs`/`homepage` 字段——将 npm 包与 GitHub 仓库关联，供插件市场自动采集下载量。
- **1.15.1**（2025-08-19）
  - 徽章升级为**常驻行情区域**：四大指数（上证/深证/创业板/科创50）两列 + 自选前 12 只两列平铺，静态展示不再轮动。
  - **⤡ 手柄**调宽度 120–480px（双击复位 320px），宽度/位置持久化；恢复位置时钳制到视口内，永不丢失。
  - 底部指数条与面板市场页：沪深300 → **科创50**。
  - 修复：云端自选对真实账号永远拉不到——默认自选在 `stocks` 系统分类（pid=-1 全部）而非 `portfolios` 字段；自选上限 50 → 200。
  - 修复：区域模式 `const` 重新赋值导致徽章槽位崩溃；徽章头部三元素竖排散架。
  - 移除：悬停弹层（搜索/速览已被区域模式取代）。
- **1.10.0**（2025-08-19）
  - 新增：**可选登录雪球**——面板右上「👤 登录」，粘贴浏览器 Cookie 整行即可（借鉴 [xueqiu-cli](https://github.com/fanxinqi/xueqiu-cli) 手动登录模式）。
  - 登录后自动拉取并使用**雪球云端自选股**；加/删自选尽力同步云端（尽力而为，失败静默回退本地）；「同步云端自选」随时手动拉取。
  - 安全细节：本地解析 `xq_id_token`（JWT）预检过期；远端调组合接口二次校验（400016 拒绝无效 Cookie，实测验证）；Cookie 仅存本机 `.xueqiu-login.json`，退出即清除；不登录则完全保持原匿名模式。
- **1.9.0**（2025-08-19）
  - 微交互：tab/详情切换淡入动画、刷新按钮旋转 loading 态。
  - 快讯时间轴：左侧竖线 + 「今天/昨天/X月X日」分组锚点，长列表快速定位时间。
  - 徽章 hover 预览：悬停 300ms 弹出自选速览（名称/现价/涨跌幅 chip，30s 缓存），点击展开面板，拖拽不误触。
  - K线/分时十字光标轴标签：光标价位（右侧）+ 日期/时间（底部）底色读数块。
- **1.8.0**（2025-08-19）
  - 专业感升级三件套：全界面等宽数字（tabular-nums，价格跳动不抖列）；涨跌幅色块 chip（红涨/绿跌半透明底，扫一眼定位）；自选行价格变动闪烁动画（涨红闪/跌绿闪，0.8s 渐隐）。
- **1.7.2**（2025-08-19）
  - 新增：快讯 tab 翻页——滚动到底或点「加载更早」自动加载历史快讯（max_id 游标，自动去重），「刷新」重置回最新一页。
- **1.7.1**（2025-08-19）
  - 修复：`dsh plugin add` 静态安装后 `dsh web` 启动即崩（`harness is not defined`）——静态安装改走 `webServer` 前缀路由 `/xq-rpc`（带回环 + 同源双重栅栏），动态运行时仍走 `harness.handle`，双模式自动切换。
  - 修复：静态安装的浏览器端 bundle 格式（`__ModuleLoader__` CJS 工厂）与网络通道（同源 fetch 替代 `host.call`），面板/徽章/指数条在静态模式下完整可用。
- **1.7.0**（2025-08-19）
  - 新增：页面隐藏时自动暂停面板/徽章/指数条全部轮询，回到前台立即刷新——切走不浪费请求，显著降低雪球风控触发概率。
  - 新增：A 股/港股/美股三市场交易时段提示（盘中·午休·盘前·休市，本地 Intl 时区推算，不含节假日），面板头常驻显示，徽章显示精确 A 股时段，每分钟自动刷新。
- **1.6.1**（2025-08-18）
  - 修复：请求管线死锁——悬挂请求永久占用调度槽导致面板整体冻结，现由 30s 看门狗强制释放。
  - 修复：详情页内点「行情/热榜/搜索/快讯」标签无响应（view 优先级遮蔽 tab）。
  - 修复：徽章位置持久化后恢复时 `badgePos.y` 被误当函数调用导致位置重置失败。
  - 新增：`debug` RPC（running/waiters/inflight/cache/cookie 实时观测）。
- **1.6.0** — 面板高度拖拽调节（丝滑零重渲染、双击复位、持久化）。
- **1.5.x** — 请求调度与缓存优化（并发 2 + 100ms 间隔、TTL 缓存、错误分类重试）。
- **1.4.x** — 详情提速：渐进渲染、全 K线周期、十字光标。

## 📄 License

[MIT](./LICENSE)
