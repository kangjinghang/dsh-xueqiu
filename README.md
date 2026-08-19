# dsh-xueqiu · 雪球 mini 行情面板

> DeepSeek Harness 上的雪球行情面板：**免登录**查看 A股/港股/美股实时行情、K线、分时、热榜、搜索、7×24 快讯与热议用户。面板嵌入输入框上方不遮挡对话，迷你徽章常驻实时指数，交易时段智能刷新。

[![npm version](https://img.shields.io/npm/v/dsh-xueqiu?style=flat-square&label=npm)](https://www.npmjs.com/package/dsh-xueqiu)
[![npm downloads](https://img.shields.io/npm/dm/dsh-xueqiu?style=flat-square)](https://www.npmjs.com/package/dsh-xueqiu)
[![GitHub stars](https://img.shields.io/github/stars/kangjinghang/dsh-xueqiu?style=flat-square)](https://github.com/kangjinghang/dsh-xueqiu/stargazers)
[![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](./LICENSE)
[![dsh-plugin](https://img.shields.io/badge/dsh-plugin-xueqiu-1DA1F2?style=flat-square)](#-安装)

中文 | [English](./README.en.md)

**[功能](#-功能) · [截图](#-截图) · [安装](#-安装) · [使用](#️-使用) · [稳定性](#-稳定性设计) · [FAQ](#-faq) · [更新日志](#-更新日志)**

## 🆚 与同类行情插件

| 能力 | dsh-xueqiu | 股票皮肤类插件 |
| --- | --- | --- |
| 面板形态 | 嵌入输入框上方，不遮挡对话 | 全局换肤/状态栏 |
| K线/分时 | 蜡烛图+均线+十字光标，7 档周期 | 部分有 |
| 热榜/快讯/KOL | 全有 | 多数无 |
| 数据源 | 雪球（社区数据：帖子/热议用户独有） | 腾讯/Yahoo 等 |
| 请求防护 | 闸门+看门狗+缓存+自愈+隐藏暂停 | 一般仅缓存 |
| 主题 | 跟随 DSH 明暗 | 需整体换肤 |

## ✨ 功能

| 功能 | 说明 |
| --- | --- |
| 📊 实时行情 | 大盘指数（上证/深证/创业板/沪深300）+ 自选股列表，涨红跌绿，**表头点击排序** |
| 🕯️ K线图 | **蜡烛图** + 成交量柱 + **MA5/10/20 均线** + **十字光标悬浮详情**（开高低收/涨跌/量/均线值），5分/15分/30分/60分/日K/周K/月K 7 档切换 |
| ⏱️ 分时图 | 价格线 + 均价线 + 昨收基准虚线，十字光标查任意分钟报价 |
| 🔥 热榜 | 雪球热门榜，A股/美股/港股/全球 切换 |
| 🔍 搜索 | 搜股票（一键加自选/看详情）、搜帖子 |
| 📰 快讯 | 7×24 实时快讯，重要新闻高亮 |
| 👥 热议用户 | 个股热门 KOL（粉丝数/认证标识） |
| 💼 自选股 | 本地持久化，增删随点随改 |
| 🧲 嵌入式面板 | 完整面板停靠在**输入框上方**（官方 `conversation.input.dock` 槽位），随页面布局流动，**不遮挡对话记录** |
| 🏷️ 迷你徽章 | 常驻悬浮徽章显示**上证/深成指实时涨跌**与盘中状态；点击开合面板，整体可拖动到任意位置（位置记忆） |
| 📏 面板高度可调 | 拖动面板底边调整高度（160px–85% 视口，双击复位），高度持久化记忆 |
| ⌨️ Esc 收起 | Esc 先关个股详情，再收起面板；点徽章或底部指数条重新展开 |
| 🛡️ 请求防护 | 并发 2 + 100ms 最小间隔对齐网页端行为；**30s 看门狗**强制释放悬挂请求防管线冻结；Cookie 失效/风控自动重播种重试；限频指数退避；**页面隐藏自动暂停全部轮询**（回前台立即恢复） |
| 🗂️ 渐进详情 | 个股详情报价+K线先上屏，分时/财务/KOL 到达后增量合并，不用等齐 |
| ⏱️ 智能刷新 | 盘中 20s 刷新行情，收盘自动放慢，降低被风控概率 |
| 🕐 交易时段 | 面板头常驻显示 **A 股/港股/美股** 盘中·午休·盘前·休市（本地时区推算，不含节假日），徽章显示精确 A 股时段 |
| 🌗 主题自适应 | 跟随 DSH 明暗主题 |

所有数据来自雪球公开接口（访问首页获取匿名 cookie + 浏览器 UA/Referer），**无需登录**。

## 📸 截图

**嵌入式主面板**：停靠在输入框上方，指数卡 + 自选股行情 + 四个功能页签：

![主面板](https://raw.githubusercontent.com/kangjinghang/dsh-xueqiu/main/assets/panel.png)

**个股详情**：16 项行情数据 + K线蜡烛图（成交量柱 / MA5-10-20 均线 / 十字光标）+ 财务指标 + 热议用户：

![个股详情](https://raw.githubusercontent.com/kangjinghang/dsh-xueqiu/main/assets/detail.png)

**迷你徽章**：常驻实时指数，点击开合面板，可拖动：

![迷你徽章](https://raw.githubusercontent.com/kangjinghang/dsh-xueqiu/main/assets/badge.png)

## 📦 安装

### 方式一：标准 bundle 插件（推荐）

```bash
# npm 包
dsh plugin --profile web add dsh-xueqiu

# 或 GitHub 源（git 安装会直接从源码构建）
dsh plugin --profile web add github:kangjinghang/dsh-xueqiu

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
- **右下角迷你徽章**常驻显示上证/深成指实时涨跌；**点击**开合面板，**拖动**调整位置（记忆位置）。
- 输入框下方的**指数条**点击也可展开面板。
- 点击自选股、指数卡或热榜行 → 个股详情：16 项行情数据 + K线/分时切换（悬停图表看十字光标详情）+ 财务指标（ROE/毛利率/净利同比等）+ 热议用户。
- **面板高度**：拖动面板底边的手柄上下调整（160px ~ 85% 视口高度），**双击手柄复位**；高度会被记忆。
- 刷新频率：盘中行情 20s、内容 60s；收盘后自动降为 60s / 3min。

## 🔧 稳定性设计

数据层内置多层防护，长时间挂机也不会卡死：

- **请求闸门**：并发上限 2、请求间最小间隔 100ms，模拟网页端节奏，降低风控概率。
- **30s 看门狗**：单个请求悬挂超 30s 即强制释放调度槽并报错，不会冻结后续所有请求。
- **TTL 缓存 + in-flight 去重**：相同 URL 短时间窗内直接命中缓存，并发重复请求共享同一 Promise。
- **Cookie 自愈**：匿名 cookie 失效（错误码 400016）或被风控返回空响应时，自动重新访问雪球首页播种新 cookie 再重试。
- **限频退避**：遇到"请求频繁"按 2s→4s 指数退避后重试。
- **渐进渲染**：详情页报价 + K线先行上屏，分时/财务/KOL 异步到达后增量合并。

## 📁 目录结构

```
dsh-xueqiu/
├── src/
│   ├── index.js          # Host 插件（curl 数据层 + connection RPC）
│   └── client/index.js   # Client 插件（嵌入式面板 + 迷你徽章 UI）
├── dynamic/
│   ├── host.js           # 动态插件版 Host（已实测）
│   └── client.js         # 动态插件版 Client（已实测）
├── package.json          # bundle 声明（dsh.bundle / dsh.client）
└── cordis.patch.yml      # bundle 层插入
```

## ❓ FAQ

**Q: 安装后面板不出现？**
按安装说明重启一次 `dsh web`（插件行按启动缓存发现），再硬刷新页面（Ctrl/Cmd+Shift+R）。仍无面板时看右下角有无迷你徽章——徽章在则点徽章展开。

**Q: 行情数据突然全空/报错？**
雪球匿名 cookie 偶发被风控（错误码 400016 或空响应）。插件会自动重播种 cookie 并重试；连续失败时等 1–2 分钟再点「刷新」，或收起面板降低请求频率。

**Q: K线周期里分时下为什么没有周期按钮？**
分时模式只展示当日分钟线，K线模式才有 7 档周期，属设计行为。

**Q: 交易时段提示节假日准吗？**
不准。时段按每周一至周五的固定钟点本地推算，不含法定节假日调休，仅供参考。

**Q: 自选股和面板设置存在哪？**
宿主本地文件 `~/.xueqiu-watchlist.json` 与 `~/.xueqiu-ui-state.json`，与浏览器 localStorage 无关，换浏览器不丢。

**Q: 会不会影响 DSH 本体？**
插件 UI 全部挂在官方槽位（`conversation.input.dock` / `shell.overlay` / `conversation.composer.dock`），卸载即完全消失，不改 DSH 源码。

## ⚠️ 免责声明

- 本项目**非雪球官方**产品，与雪球网/雪球公司无关；"雪球"为雪球公司商标，此处仅作数据来源描述。
- 数据来自雪球公开 Web 接口，仅供**学习与研究**，**不构成任何投资建议**；请勿高频请求，遵守目标网站条款。
- 接口可能随时变更导致功能失效，欢迎提 [Issue](https://github.com/kangjinghang/dsh-xueqiu/issues) / PR。

## 📋 更新日志

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
