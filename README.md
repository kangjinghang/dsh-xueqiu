# dsh-xueqiu · 雪球 mini 行情面板

> DeepSeek Harness 上的雪球行情面板：**免登录**查看 A股/港股/美股实时行情、K线、分时、热榜、搜索、7×24 快讯与热议用户。面板嵌入输入框上方不遮挡对话，迷你徽章常驻实时指数，交易时段智能刷新。

![badge](https://img.shields.io/badge/dsh-plugin-xueqiu-1DA1F2)
![badge](https://img.shields.io/badge/platform-web-blue)
![license](https://img.shields.io/badge/license-MIT-green)

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
| ⌨️ Esc 收起 | Esc 先关个股详情，再收起面板；点徽章或底部指数条重新展开 |
| ⏱️ 智能刷新 | 盘中 20s 刷新行情，收盘自动放慢，降低被风控概率 |
| 🌗 主题自适应 | 跟随 DSH 明暗主题 |

所有数据来自雪球公开接口（访问首页获取匿名 cookie + 浏览器 UA/Referer），**无需登录**。

## 📸 截图

**嵌入式主面板**：停靠在输入框上方，指数卡 + 自选股行情 + 四个功能页签：

![主面板](https://raw.githubusercontent.com/wanderer-yk/dsh-xueqiu/main/assets/panel.png)

**个股详情**：16 项行情数据 + K线蜡烛图（成交量柱 / MA5-10-20 均线 / 十字光标）+ 财务指标 + 热议用户：

![个股详情](https://raw.githubusercontent.com/wanderer-yk/dsh-xueqiu/main/assets/detail.png)

**迷你徽章**：常驻实时指数，点击开合面板，可拖动：

![迷你徽章](https://raw.githubusercontent.com/wanderer-yk/dsh-xueqiu/main/assets/badge.png)

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
- **右下角迷你徽章**常驻显示上证/深成指实时涨跌；**点击**开合面板，**拖动**调整位置（记忆位置）。
- 输入框下方的**指数条**点击也可展开面板。
- 点击自选股、指数卡或热榜行 → 个股详情：16 项行情数据 + K线/分时切换（悬停图表看十字光标详情）+ 财务指标（ROE/毛利率/净利同比等）+ 热议用户。
- 刷新频率：盘中行情 20s、内容 60s；收盘后自动降为 60s / 3min。

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

## ⚠️ 免责声明

- 本项目**非雪球官方**产品，与雪球网/雪球公司无关；"雪球"为雪球公司商标，此处仅作数据来源描述。
- 数据来自雪球公开 Web 接口，仅供**学习与研究**，**不构成任何投资建议**；请勿高频请求，遵守目标网站条款。
- 接口可能随时变更导致功能失效，欢迎提 [Issue](https://github.com/wanderer-yk/dsh-xueqiu/issues) / PR。

## 📄 License

[MIT](./LICENSE)
