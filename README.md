# dsh-xueqiu · 雪球 mini 行情面板

> DeepSeek Harness 上的雪球行情面板：**免登录**查看 A股/港股/美股实时行情、K线、分时、热榜、搜索、7×24 快讯与热议用户。可拖拽的悬浮窗口，交易时段智能刷新。

![badge](https://img.shields.io/badge/dsh-plugin-xueqiu-1DA1F2)
![badge](https://img.shields.io/badge/platform-web-blue)
![license](https://img.shields.io/badge/license-MIT-green)

## ✨ 功能

| 功能 | 说明 |
| --- | --- |
| 📊 实时行情 | 大盘指数（上证/深证/创业板/沪深300）+ 自选股列表，涨红跌绿 |
| 🕯️ K线图 | **蜡烛图** + 成交量柱 + **MA5/10/20 均线**，日K/周K/月K/60分 切换 |
| ⏱️ 分时图 | 价格线 + 均价线 + 昨收基准虚线 |
| 🔥 热榜 | 雪球热门榜，A股/美股/港股/全球 切换 |
| 🔍 搜索 | 搜股票（一键加自选/看详情）、搜帖子 |
| 📰 快讯 | 7×24 实时快讯，重要新闻高亮 |
| 👥 热议用户 | 个股热门 KOL（粉丝数/认证标识） |
| 💼 自选股 | 本地持久化，增删随点随改 |
| 🖱️ 悬浮面板 | 按住标题栏**拖到任意位置**，位置/展开状态自动记忆 |
| ⏱️ 智能刷新 | 盘中 20s 刷新行情，收盘自动放慢，降低被风控概率 |
| 🌗 主题自适应 | 跟随 DSH 明暗主题 |

所有数据来自雪球公开接口（访问首页获取匿名 cookie + 浏览器 UA/Referer），**无需登录**。

## 📸 截图

**主面板**：大盘指数 + 自选股行情，可拖拽悬浮窗口：

![主面板](https://raw.githubusercontent.com/kangjinghang/dsh-xueqiu/main/assets/panel.png)

**个股详情**：16 项行情数据 + K线蜡烛图（成交量柱 / MA5-10-20 均线）+ 财务指标 + 热议用户：

![个股详情](https://raw.githubusercontent.com/kangjinghang/dsh-xueqiu/main/assets/detail.png)

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

- **面板默认出现在右下角**：按住顶部标题栏（`雪球 mini · ●盘中/已收盘 · 更新时间`）可拖动；`—` 收起为摘要条，`✕` 关闭。
- **输入框上方**的入口条与**输入框下方**的指数条，点击即可重新打开/展开面板。
- 点击自选股或热榜行 → 个股详情：16 项行情数据 + K线/分时切换 + 财务指标（ROE/毛利率/净利同比等）+ 热议用户。
- 刷新频率：盘中行情 20s、内容 60s；收盘后自动降为 60s / 3min。

## 📁 目录结构

```
dsh-xueqiu/
├── src/
│   ├── index.js          # Host 插件（curl 数据层 + connection RPC）
│   └── client/index.js   # Client 插件（React 悬浮面板 UI）
├── dynamic/
│   ├── host.js           # 动态插件版 Host（已实测）
│   └── client.js         # 动态插件版 Client（已实测）
├── package.json          # bundle 声明（dsh.bundle / dsh.client）
└── cordis.patch.yml      # bundle 层插入
```

## ⚠️ 免责声明

- 本项目**非雪球官方**产品，与雪球网/雪球公司无关；"雪球"为雪球公司商标，此处仅作数据来源描述。
- 数据来自雪球公开 Web 接口，仅供**学习与研究**，**不构成任何投资建议**；请勿高频请求，遵守目标网站条款。
- 接口可能随时变更导致功能失效，欢迎提 [Issue](https://github.com/kangjinghang/dsh-xueqiu/issues) / PR。

## 📄 License

[MIT](./LICENSE)
