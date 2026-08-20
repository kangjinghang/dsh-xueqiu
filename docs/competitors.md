# 竞品调研：dsh 插件市场股票类插件

> 调研日期：2026-08-20。数据来源：npm registry（registry.npmjs.org）+ GitHub API + 各仓库 README 原文。
> 覆盖市场搜索结果 11 个目标，逐一查证；**无一凭记忆或传闻**。

## 一、直接竞品（A 股 / 美股行情 + UI，与 dsh-xueqiu 同赛道）

### 1. dsh-stock-watch —— 迭代最快的盯盘弹窗

- **作者 / 来源**：Awu12277，npm `dsh-stock-watch`，GitHub `Awu12277/dsh-stock-watch`
- **版本**：1.0.8（2026-08-17 发布；0.1.0 起共 16 个版本，迭代速度全场第一梯队）
- **数据源**：腾讯财经分钟接口（与其终端 CLI 项目 [stocking](https://github.com/Awu12277/stocking) 同源）
- **主要功能**：Web 右上角可折叠弹窗盯盘——分时 / K 线、目标价提醒、主题切换、可拖动、添加股票分组
- **存储**：localStorage 为唯一数据源（首次可从 `~/.stocking/settings.json` 一次性迁移）
- **配色**：A 股红涨绿跌惯例
- **短评**：形态上与我们的旧版角标最接近；数据不出浏览器，无登录态 / 云端自选概念。

### 2. dsh-stock-terminal —— 功能密度最高的行情皮肤

- **作者 / 来源**：linhut（linhut.cn），GitHub `linhut/dsh-stock-terminal`，**未发 npm**（v1.3.0，⭐3）
- **数据源**：A 股 / 港股 / 指数走**腾讯前复权**；美股腾讯不足时**回退 Yahoo**；加密货币走 **Binance**；服务端 60s 缓存 + 在途去重
- **主要功能**：
  - 全局交易终端皮肤：顶栏 K 线品牌图标、持仓摘要芯片、仿终端窗口按钮、自定义 favicon / 页面标题，亮暗双主题 CSS 变量
  - 实时行情跑马灯（hover 暂停，点击弹个股 K 线）
  - 个股 K 线弹窗：日/周/月 K、滚轮锚点缩放（20~200 根）、拖拽平移、十字光标 + OHLC 浮层、MA5/MA10、成交量幅图、区间涨跌统计
  - 拼音首字母 + 代码 + 名称模糊搜索（`gzmt` → 贵州茅台），内置 130+ 品种词典 + 在线 API 兜底
  - 持仓盈亏管理：现价 / 市值 / 浮动盈亏 / 汇总
- **license**：Apache-2.0（注意：非 MIT）
- **短评**：覆盖面最广（A 股 / 港股 / 美股 / 指数 / 加密 / 外汇），UI 工程最重。是我们 UI 维度上最强的对手。

### 3. dsh-bull-bear —— 差异化玩法：行情桌宠

- **作者 / 来源**：匿名，npm `dsh-bull-bear`（0.1.1，2026-08-18）
- **数据源**：新浪实时行情，免登录
- **主要功能**：牛熊行情宠物 🐮🐻——由自选组合平均涨跌驱动跑速（越接近收益 +20% 跑得越猛），可拖动、自选面板、行情赛跑
- **短评**：情绪化 / 玩具向定位，不拼数据完整性。思路值得借鉴（把行情变成 ambient 感知），功能上与我们不冲突。

### 4. dsh-us-stocks —— 工程化标杆（纯工具、美股）

- **作者 / 来源**：Realyujie，npm `dsh-us-stocks`（0.3.0，2026-08-16），GitHub `Realyujie/dsh-us-stocks`
- **数据源**：[yahoo-finance2](https://github.com/gadicc/yahoo-finance2)（唯一带正式运行时依赖的竞品）
- **主要功能**：无 UI，纯 agent 工具——美股 6 件套：quote / 历史 K 线 / 财务报表 / 分析师共识 / 新闻 / 股东结构
- **亮点**：README 有严谨的 **before/after benchmark**：同一 AAPL 任务，未装插件 14 步 31 次调用 213.5s，装后 2 步 5 次调用 33.2s；附 `npm run benchmark` 可复现验收（6 工具并发 3.14s）
- **短评**：中英双 README + 实测数据 + 可复现基准，**工程传播形象全场最佳**，做法直接值得抄。

### 5. dsh-trading-toolkit —— 只读轻量工具箱

- **作者 / 来源**：kentleenot，GitHub `kentleenot/dsh-trading-toolkit`（master 分支，⭐1，未发 npm）
- **数据源**：东方财富，国内直连免 Key
- **主要功能**：4 个只读工具——`market_quote`（A 股 + 美股自动识别，支持中文名 / 指数）、`kline_history`（1m~1M，最多 1000 根）、`regime_signal`（ADX 三状态：趋势 / 震荡 / 噪声 + 200-EMA 偏向）、`backtest_run`（跨状态规则简易回测）
- **设计声明**：**只读——永不下单、不触碰交易凭据**
- **短评**：小而克制，ADX 市场状态分类是独有的小亮点（纯计算，不依赖数据源）。

## 二、泛金融、不同赛道

### 6. dsh-quant —— 框架级玩家（量化 OS）

- **来源**：npm `dsh-quant`（0.63.0，2026-08-20），GitHub `pengpengyi92/dsh-quant`，独立官网 dsh-quant-site.pages.dev
- **体量**：**0.6.0 起共 63 个版本、46 个工具、6 个可插拔域**（data / alpha / ML / risk / execution / ecosystem），一套 PDAT→PET 研究流水线；有 CI
- **数据层**：可插（Binance 或自有数据）
- **理念**："Methods open, secrets internal"——开源范式（模块组合 / 契约 / 无前视对齐），内部策略与模型闭源
- **关系**：量化研究框架，不做盯盘 UI，**不与我们直接冲突**；但其 63 版本的发布节奏值得敬畏。

### 7. dsh-trading —— 占坑包

- npm `dsh-trading` 0.0.1（2026-08-19，dushaobindoudou）。描述原话："name reserved; first release in development"。**无任何功能**。
- 启示：好名字会被抢注；我们握有 `dsh-xueqiu` 即握有品类词。

### 8. dsh-finreport —— 每日财经日报

- **来源**：GitHub `SkyloveQiu/dsh-finreport`（未发 npm）
- **数据源**：全部免费无 Key——全球指数 / 外汇 / 金油 / 加密行情 + Google News 聚合（来源权重 + 时效排序）+ 手工维护的央行日程 `events.json`；零运行时依赖（仅 Node 内置 fetch）
- **主要功能**：中英双语日报，按目标独立定时（DST 安全），推送 8 个 IM 通道（WhatsApp / Telegram / Discord / 飞书 / 钉钉 / 企微 / QQ / 微信）；需给 `@xmanrui/dsh-im@0.2.2` 打主动发送补丁（patch/ 镜像提供）
- **关系**："内容推送 vs 盯盘工具"，互补大于竞争。

### 9. dsh-trend-radar —— 不是股票

- npm `dsh-trend-radar` 0.2.1（2026-08-17）。**dsh 插件生态自身的趋势面板**：快照 dsh-plugin topic 与 awesome 列表，周报新插件 / 涨星 / 品类热度 / 关键词雷达。依赖 zod。
- 搜索时容易误认，与股票无关。

### 10. dsh-plugin（Tabbit-Browser）—— 不是股票

- GitHub `Tabbit-Browser/dsh-plugin`（⭐90）。Tabbit 浏览器官方插件，让 agent 控制 Tabbit 浏览器（加载 Skill Provider）。
- **命名撞车警示**：以 `dsh-plugin` 为名搜索 / 讨论时会命中的是它。

### 11. bigA（zzhtl/biga）—— 不是 dsh 插件

- GitHub `zzhtl/biga`（⭐52，Rust + Svelte，Tauri 桌面应用，最后推送 2026-07-15）。独立的大 A 深度学习预测系统：Candle 框架、MACD/KDJ/RSI/布林等指标、背离检测、市场状态分类、多因子评分、每天 8 点预测 10 只候选。
- 被市场收录但**严格说是 dsh 生态外的桌面软件**；若其作者日后封装成 dsh 插件，预测赛道才有交集。

## 三、数据源格局一览

| 数据源 | 使用者 |
|---|---|
| 腾讯财经 | dsh-stock-watch、dsh-stock-terminal（美股回退 Yahoo） |
| 新浪 | dsh-bull-bear |
| 东方财富 | dsh-trading-toolkit |
| Yahoo (yahoo-finance2) | dsh-us-stocks、dsh-stock-terminal（回退） |
| Binance | dsh-stock-terminal（加密）、dsh-quant（可插） |
| **雪球** | **仅 dsh-xueqiu 一家** |

## 四、对 dsh-xueqiu 的定位结论

1. **雪球数据源独占**：腾讯系两家、新浪、东财、Yahoo 各有归属，**雪球只有我们**。雪球的差异化资产——登录态、云端自选同步、KOL / 组合等雪球特有数据——没有第二家做，这是护城河而非红海。
2. **UI 军备竞赛在腾讯系**：dsh-stock-terminal（全局皮肤 + 跑马灯 + K 线弹窗 + 持仓 + 拼音搜索）功能密度最猛，dsh-stock-watch 16 版迭代最快。我们的**区域模式徽章**路线（ambient 感知、不抢焦点）与它们的顶栏 / 弹窗路线错位，不必跟进对拼。
3. **工程化标杆是 dsh-us-stocks**：其 before/after benchmark 写法（同任务对照实测、可复现命令）值得 README 借鉴——我们已有 feature-matrix（56×3 断言）、static-smoke（7 门）、browser-interact（真实鼠标）三套测试，完全可以包装成同等分量的卖点。
4. **两个无人占据的空档**：
   - **港美股 + 雪球组合 / KOL 数据**维度无竞品；
   - **测试完备度**维度无竞品（全场没有一个竞品在 README 展示测试体系）。
5. **命名风险**："trading" 已被占坑（dsh-trading 0.0.1），`dsh-plugin` 一词被 Tabbit 占用——对外沟通时始终用完整包名 `dsh-xueqiu`。
