# dsh-xueqiu · Xueqiu Mini Market Panel

> A Xueqiu (Snowball) market panel for DeepSeek Harness: **no login required** — live A-share/HK/US quotes, candlestick & minute charts, hot lists, search, 7×24 news and trending KOLs. The panel docks above the composer without covering the conversation; a draggable always-on market region shows the four major indices plus your top-12 watchlist quotes.

[![npm version](https://img.shields.io/npm/v/dsh-xueqiu?style=flat-square&label=npm)](https://www.npmjs.com/package/dsh-xueqiu)
[![npm downloads](https://img.shields.io/npm/dm/dsh-xueqiu?style=flat-square)](https://www.npmjs.com/package/dsh-xueqiu)
[![GitHub stars](https://img.shields.io/github/stars/wanderer-yk/dsh-xueqiu?style=flat-square)](https://github.com/wanderer-yk/dsh-xueqiu/stargazers)
[![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](./LICENSE)
[![dsh-plugin](https://img.shields.io/badge/dsh--plugin-xueqiu-1DA1F2?style=flat-square)](#install)

[中文](./README.md)

**[Features](#features) · [Screenshots](#screenshots) · [Install](#install) · [Usage](#usage) · [Stability](#stability-design) · [FAQ](#faq) · [Changelog](#changelog)**

## Features

| Feature | Notes |
| --- | --- |
| 📊 Live quotes | Major indices (SSE/SZSE/ChiNext/STAR50) + watchlist, CN-style red-up/green-down, **sortable columns** |
| 🕯️ Candlestick | Candles + volume bars + **MA5/10/20** + **crosshair tooltip** (OHLC/pct/vol/MAs); 7 periods: 5m/15m/30m/60m/day/week/month; **wheel zoom + drag pan** with auto earlier-history fetching, double-click resets |
| ⏱️ Minute chart | Price + avg lines with prev-close baseline, crosshair for any minute |
| 🔥 Hot list | Xueqiu trending stocks, switch CN/US/HK/global |
| 🔍 Search | Stocks (one-click watch/add detail) and posts |
| 📰 News | 7×24 live news, important items highlighted |
| 👥 Trending KOLs | Per-stock hot users (followers / verified badge) |
| 💼 Watchlist | Persisted locally, add/remove in one click |
| 🧲 Docked panel | Full panel docks **above the composer** (official `conversation.input.dock` slot), flows with layout, **never covers messages** |
| 🏷️ Market region | Floating region: header row + four indices (SSE/SZSE/ChiNext/STAR50) in two columns + top-12 watchlist quotes in a two-column grid; click toggles the panel, drag to reposition, ⤡ grip resizes width 120–480px (double-click resets 320px), width & position persisted |
| 📏 Resizable | Drag the bottom handle (160px–85% viewport, double-click resets); height persisted |
| ⌨️ Esc collapse | Esc closes detail first, then the panel; reopen via badge or ticker bar |
| 🛡️ Request guard | Concurrency 2 + 100ms min gap; **30s watchdog** force-releases hung slots; cookie risk-control auto reseed & retry; rate-limit backoff; **auto-pauses all polling while the tab is hidden** |
| 🗂️ Progressive detail | Quote + kline render first; minute/finance/KOL merge in as they arrive |
| ⏱️ Smart refresh | 20s during trading hours, slows down after close |
| 🕐 Market sessions | Header shows **CN/HK/US** session (open·lunch·pre·closed), badge shows precise A-share session |
| 🌗 Theme aware | Follows the DSH light/dark theme |
| 🤖 Agent tools | **Ask about markets right in the conversation**: `xueqiu_quote`, `xueqiu_kline`, `xueqiu_search`, `xueqiu_hot`, `xueqiu_news`, `xueqiu_kol` — the model calls Xueqiu live data directly instead of scraping the web |
| 🃏 Toolview cards | `xueqiu_quote` renders as a red/green quote table, `xueqiu_kline` as a mini candlestick chart, `xueqiu_hot` as a ranked hot list, `xueqiu_news` as a news timeline — results are readable directly in the flow |

All data comes from Xueqiu public web endpoints (anonymous cookie seeded by visiting the homepage + browser UA/Referer). **No login.**

## Screenshots

**Docked panel** — above the composer, index cards + watchlist + four tabs:

![Panel](https://raw.githubusercontent.com/wanderer-yk/dsh-xueqiu/main/assets/panel.png)

**Stock detail** — 16 quote stats + candlestick (volume / MA5-10-20 / crosshair) + financials + trending users:

![Detail](https://raw.githubusercontent.com/wanderer-yk/dsh-xueqiu/main/assets/detail.png)

**Mini market region** — four indices + 12 watchlist quotes in two columns, ⤡ grip resizes width, click to toggle, draggable:

![Badge](https://raw.githubusercontent.com/wanderer-yk/dsh-xueqiu/main/assets/badge.png)

**Agent toolview cards** — ask about markets right in the conversation; results render as purpose-built cards instead of raw JSON:

| `xueqiu_quote` table | `xueqiu_kline` candles |
| --- | --- |
| ![quote](https://raw.githubusercontent.com/wanderer-yk/dsh-xueqiu/main/assets/toolcards/quote.png) | ![kline](https://raw.githubusercontent.com/wanderer-yk/dsh-xueqiu/main/assets/toolcards/kline.png) |

| `xueqiu_hot` hot list | `xueqiu_news` timeline |
| --- | --- |
| ![hot](https://raw.githubusercontent.com/wanderer-yk/dsh-xueqiu/main/assets/toolcards/hot.png) | ![news](https://raw.githubusercontent.com/wanderer-yk/dsh-xueqiu/main/assets/toolcards/news.png) |

## Install

### Option 1: Standard bundle plugin (recommended)

```bash
# from npm
dsh plugin --profile web add dsh-xueqiu

# or from GitHub source
dsh plugin --profile web add github:wanderer-yk/dsh-xueqiu

# or a local checkout
dsh plugin --profile web add ./dsh-xueqiu
```

Restart `dsh web` once after adding (plugin rows are discovered at startup), then refresh the page.

### Option 2: Dynamic plugin (battle-tested)

The `dynamic/` directory ships tested dynamic Cordis plugin sources (`host.js` + `client.js`). Ask any DSH agent session to load them:

```
Read dynamic/host.js and dynamic/client.js from this repo,
define a plugin with cordis_define (kind: new):
  code.host = contents of host.js, code.client = contents of client.js,
  then cordis_run it.
```

## Usage

- The panel docks above the composer, in the conversation column; `Collapse —` or `Esc` hides it.
- The bottom-right market region shows four indices (SSE/SZSE/ChiNext/STAR50) plus your top-12 watchlist quotes; **click** toggles the panel, **drag** to move, **⤡ grip** resizes width (remembered).
- The ticker bar under the composer also expands the panel on click.
- Click any watchlist row, index card or hot-list row for the detail view: 16 stats + K-line/minute toggle (hover for crosshair) + financials + trending users.
- **Resize**: drag the handle under the panel (160px–85% viewport); double-click resets; height is remembered.
- Refresh cadence: 20s quotes / 60s content during trading hours; 60s / 3min after close.

## Stability design

The data layer is defended in depth — safe to leave open for hours:

- **Request gate**: max 2 concurrent, 100ms minimum gap, mirroring the web client's rhythm.
- **30s watchdog**: any hung request is force-released after 30s so the pipeline never freezes.
- **TTL cache + in-flight dedup**: identical URLs hit cache within the window; concurrent duplicates share one Promise.
- **Cookie self-healing**: anonymous cookie expiry (error 400016) or risk-control empty responses trigger automatic reseeding and retry.
- **Rate-limit backoff**: 2s → 4s exponential backoff on "too frequent" errors.
- **Hidden-tab pause**: all polling stops while the page is hidden and refreshes immediately on return.
- **Progressive rendering**: quote + kline first; the rest merges in.

## FAQ

**Panel doesn't show up after install?** Restart `dsh web` once (see above) and hard-refresh (Ctrl/Cmd+Shift+R). If the badge is visible, click it to expand the panel.

**Quotes suddenly empty / errors?** The anonymous cookie occasionally gets risk-controlled (error 400016 or empty body). The plugin reseeds and retries automatically; if it keeps failing, wait a minute and hit refresh, or collapse the panel to lower the request rate.

**Why no period buttons in minute mode?** Minute mode shows only the current day; the 7 periods exist in K-line mode. By design.

**Are session hints holiday-aware?** No — they're fixed-clock weekday estimates without holiday calendars, for reference only.

**Where is my data stored?** Host-side files `~/.xueqiu-watchlist.json` and `~/.xueqiu-ui-state.json` — browser-independent.

**Does it touch DSH itself?** No. All UI mounts in official slots (`conversation.input.dock` / `shell.overlay` / `conversation.composer.dock`); uninstalling removes everything.

## Disclaimer

- This is **not** an official Xueqiu product. "雪球/Xueqiu" is a trademark of Xueqiu Inc., referenced here only as the data source.
- Data comes from public web endpoints for **study and research** only; **not investment advice**. Do not hammer the endpoints; respect the site's terms.
- Endpoints may change at any time and break features — [issues](https://github.com/wanderer-yk/dsh-xueqiu/issues) and PRs welcome.

## Changelog

- **1.19.0** (2025-08-20) — **K-line wheel zoom + drag pan**: detail chart shows the last 120 bars by default (500-bar buffer); wheel zooms anchored at the cursor (20 bars → all), horizontal drag pans through history; reaching the buffer head auto-fetches 500 more earlier bars (timestamp-deduped merge, 3000-bar cap); double-click resets. Host `kline` RPC gains a `begin` param for paged history.
- **1.18.2** (2025-08-20) — Fix: agent-tool timestamps used UTC (`toISOString`), showing news/kline times 8 hours early in CST. Now formatted in the local timezone.
- **1.18.1** (2025-08-20) — Hot-list card for `xueqiu_hot` (rank + name + rank-change + price/pct) and news-timeline card for `xueqiu_news` (mark=1 items highlighted, scrollable in place).
- **1.18.0** (2025-08-20) — **Toolview cards**: `xueqiu_quote` results render as a red/green quote table, `xueqiu_kline` as a mini candlestick chart (reusing the panel chart component), readable directly in the conversation flow.
- **1.17.0** (2025-08-20) — **Agent tools (first batch of 6)**: the model can now call Xueqiu live data directly in conversation — `xueqiu_quote` (batch quotes), `xueqiu_kline` (7 periods OHLCV), `xueqiu_search`, `xueqiu_hot`, `xueqiu_news` (paginated), `xueqiu_kol` (per-stock trending users, unique community data). Reuses the existing request gate / cache / cookie self-healing; zero new request paths.
- **1.9.0** (2025-08-19) — Micro-interactions (tab fade, refresh spinner), news timeline with day-group anchors, badge hover watchlist preview, and crosshair axis labels (price + date/time) on K-line/minute charts.
- **1.8.0** (2025-08-19) — Pro polish: tabular-nums everywhere (no column jitter), red/green percent chips, and price-change flash animation on watchlist rows.
- **1.7.2** (2025-08-19) — News tab pagination: scroll-to-bottom or "load earlier" fetches older items (max_id cursor, deduped); refresh resets to the latest page.
- **1.7.1** (2025-08-19) — Fix static install (`dsh plugin add`) crashing `dsh web` startup: dual-mode RPC (harness.handle for dynamic runs, a loopback+same-origin fenced `/xq-rpc` webServer route for static installs) and a proper `__ModuleLoader__` CJS client bundle.
- **1.7.0** (2025-08-19) — Hidden-tab polling pause + CN/HK/US market session hints.
- **1.6.1** — Pipeline deadlock watchdog fix, tab-switch fix, badgePos restore fix, debug RPC.
- **1.6.0** — Draggable panel height (smooth zero-rerender, double-click reset, persisted).
- **1.5.x** — Request scheduling & cache hardening (concurrency 2 + 100ms gap, TTL cache, error-classified retries).
- **1.4.x** — Progressive detail rendering, full kline periods, crosshair.

## License

[MIT](./LICENSE)
