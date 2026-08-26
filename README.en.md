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

> **Platform requirement**: macOS / Linux / Windows. macOS/Linux use POSIX shell curl; on Windows the plugin goes through DSH's PowerShell layer with an explicit `curl.exe` call (bundled since Win10) — quoting semantics are naturally compatible. Fully verified against real Xueqiu APIs on GitHub Actions `windows-latest` (including the anonymous cookie seeding path).

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

- **1.22.13** (2026-08-26) — **A-share volume overstated 100× + dead watchlist entries vanish + kline period whitelist**. ① Xueqiu's `volume` field is in **shares** for every market (proven by `amount/volume ≈ price` across quote/kline/minute and A/HK/US/ETF/index), yet `fmtVol` formatted it as lots: Moutai's 1.45M shares rendered as "145.05万手" (truth: 1.45万手). Now market-aware: CN symbols (SH/SZ/BJ, incl. ETF/index/BSE) divide by 100 into 手; HK/US stay in shares. `qa/vol-units.mjs` (26 cases: fmtVol extracted from client source and evaluated standalone + host period whitelist) wired into check:fast. ② Batch quote silently drops invalid/delisted symbols — adding SH999999 reported success but the row never appeared anywhere. Placeholder rows now render (`--` everywhere, name falls back to the symbol, still deletable) and the price-flash logic is null-immune. ③ Unknown kline periods (a model slipping in `1h`) got 200 + 0 rows from upstream with no error; a host-side whitelist now falls back to `day`. ④ Tool descriptions now note `volume is in shares (A-share 1 手 = 100 shares)` to prevent model-side unit mistakes.
- **1.22.12** (2026-08-26) — **State files no longer drift with the startup directory + drag-direction label fix + drag cursor feedback + `::1` whitelist dead code**. ① Watchlist/login/UI state used to live wherever `dsh web` was started (cwd = workspace root) — starting from another directory meant a whole new personality. State now prefers `$DSH_HOME/dsh-xueqiu/` (auto-created); a startup probe falls back transparently to the legacy workspace behavior when the sandbox denies absolute-path writes outside the workspace (zero regression); reads fall back to the legacy workspace file when the stable one is missing, so existing data migrates seamlessly on first save (legacy files left untouched). `qa/state-paths.mjs` (11 cases, wired into check:fast) covers stable/migration/fallback/first-run. Note: host-side change takes effect after the next `dsh web` restart; migration happens on the first write after that. ② The chart hint "drag left to load earlier" had the direction backwards since 1.22.0 — klinecharts' `scroll(drag delta)` is content-follows-hand: dragging **right** surfaces earlier history at the left edge and auto-fetches at the boundary; dragging left heads toward "now" and leaves right-side blank. Corrected in 6 client spots + 3 README spots after a user report and engine-source verification. ③ New drag cursor feedback (user suggestion): `grab` on hover, `grabbing` while pressed, with a window-level mouseup fallback; listeners unified in `klcSetup` for both K-line and minute charts. ④ Bare-IPv6 `::1` Host header whitelist branch was unreachable — the port-strip regex `/:\d+$/` ate the trailing `:1`; now `/^(.*[^:]):\d+$/`, and the former xfail fence case flipped to expecting 200.
- **1.22.11** (2026-08-26) — **`open=true` was never persisted — panel state lost on every reload** (sibling of the 1.22.10 fix). `ui.set({open:true})` fires before the panel component's subscription exists (it is established on mount), so nothing ever re-triggered saveUi. The open flip now triggers persistence directly inside `ui.set`. Verified end-to-end: open panel → host `open:true` → reload → panel restored. Also: a CI time-zone bomb — the live minute-count assertion hardcoded `>30`, guaranteed red for CI runs triggered 9:30-10:01 Beijing time (only a dozen points right after open); now adaptive to the session time.
- **1.22.10** (2026-08-25) — **Five fixes from a full QA sweep (host persistence regression, period-switch UX, light-theme readability, theme reactivity, hydration race) + 4 new offline test suites**. ① Panel open/close state stopped surviving reload — a 1.22.8 regression where `open: s.open !== false` in `ui.get` was swallowed by the previous line's trailing comment; caught by the new 254-case edge suite (test kept red until fixed). ② Switching the K-line period wiped the entire detail (quote/minute/finance/KOL) and refetched all 5 endpoints — the period pills row vanished for 100-300ms and human-speed clicking dropped taps; now a period switch clears only chart data and issues 1 request, keeping pills and quote interactive (300ms full-sequence 11/11 taps land; 130ms machine-gun final state correct). ③ Light-theme chart text was near-unreadable — `cssVarColor` read theme tokens on `<html>` while the GUI defines them on `<body>`, so both themes always rendered the hardcoded `#8a8f98` fallback (1.8:1 on white); now reads body first: light legend/axis use the real token `#61666b` (~5.8:1). ④ Charts didn't restyle on theme flips — the GUI follows the OS color scheme without mutating DOM attributes, so the MutationObserver never fired; added a `matchMedia('(prefers-color-scheme)')` change listener. ⑤ Clicking the panel open right after page load got clobbered by late hydration; hydrate now skips `open`/`tab` fields the user already touched. Plus: KlineChart gates on `hasRows` (empty-mount safety, same pattern as the minute chart). New test assets wired into scripts: `qa/edge.mjs` (254 black-box cases), `qa/fence.mjs` (18 same-origin fence cases incl. one `::1` dead-code xfail marker), `qa/regress-v1228.mjs` (21), `qa/persist-upgrade.mjs` (16, includes a real state-file upgrade drill); `check:fast` stays seconds-level (1.8s).
- **1.22.9** (2026-08-25) — **K-line OHLC legend now always visible**. `showRule` follow_cross → always: the latest bar's 开高低收量 shows on entering the detail; hovering follows the crosshair bar (the colored MA row stays hover-only). The 1.22.3 hover-only change existed because the old two-line English legend covered candles; since 1.22.5 it's a compact single Chinese line (size 10) with pixel-verified zero candle overlap.
- **1.22.8** (2026-08-25) — **4 defect classes + 6 low-risk hardenings from the comprehensive audit** — `/xq-rpc` same-origin fence tightened (Origin must exist and match: browsers always send Origin on same-origin POST, so bare curl / cross-process calls get 403); `ui.get` tab whitelist (corrupt state files fall back to market); curl failures no longer echo stderr (info leak); empty cloud results still advance the sync throttle timestamp; cloud add/delete failures fail silently; tool `execute` guards null args with `args || {}`; news items with invalid `created_at` no longer render NaN月NaN日.
- **1.22.7** (2026-08-26) — **Fix: minute chart flattened into a straight line after switching stocks** (e.g. viewing CATL after Maotai). `registerIndicator('xq-minute')` registers globally exactly once, and its calc closure captured the *first* mount instance's `baseRef` — so the second stock's minute chart reused the stale calc, keeping the previous stock's prev-close as baseline (CATL got Maotai's 1304.66; the y-axis stretched to 404~1229 while prices sat in 378~388, flattening the line). Fix: rebind a fresh calc bound to the current instance's baseRef via `overrideIndicator` on every mount. Verified with three back-to-back switches (Maotai 1304.66 → CATL 387.89 → BOE 5.75): prev-close always correct, price spans healthy at 130~180px.
- **1.22.6** (2026-08-26) — **Fix: duplicate hover info on the minute tab** (found while auditing 1.22.5). For the minute area chart open=high=low=close are identical, so the canvas OHLC legend was pure redundancy, and the xq-minute indicator legend (prev-close/avg) duplicated the custom .xq-tip. Minute mode now disables canvas legends entirely (candle + indicator); hover keeps only .xq-tip. Also: **K-line hover now shows MA values** (catching up on a gap since 1.22.0 where MA numbers were visible nowhere) — indicator legend set to `follow_cross`: on hover a second colored line below the candle row shows MA5/10/30/60 values (measured on Maotai: single line, 70% width, no wrap), matching Xueqiu.
- **1.22.5** (2026-08-26) — **Fix: hover OHLC legend wrapped to two lines over the candles** (leftover from 1.22.3). After `follow_cross`, the default English time/open/high/low/close/volume titles were too long for the narrow panel and the legend folded onto two lines covering candles on hover. Now a compact single-line Chinese legend (`开 高 低 收 量`, size 10) with the ticker title hidden — measured on hover: one 10px line at 45% width, no wrapping.
- **1.22.4** (2026-08-26) — **Fix: switching to the minute tab crashed the whole panel** (1.22.3 regression). The double-click-to-latest cleanup used `boxRef.current.removeEventListener`, but React clears refs before running effect cleanup on unmount, so `boxRef.current` was null → TypeError → the `conversation.input.dock` slot crashed entirely, leaving only the mini badge with no way back in. Now the node is captured in a closure inside the effect. Regression-tested: K-line↔minute 4 toggle rounds + collapse/badge-reopen/re-enter detail, 0 errors.
- **1.22.3** (2026-08-26) — **Fix: K-line OHLC legend permanently drawn over the candles**. KLineChart v10 defaults `candle.tooltip.showRule` to `'always'`, painting time/OHLC/volume in the candle pane's top-left corner at all times (pixel-scan measured 1394 text pixels covering candles from y=23). Changed to `'follow_cross'` (shown on crosshair hover, like Xueqiu) — the indicator tooltip had been disabled but the candle's own legend was missed. Also: the chart footer promised "double-click to return to latest" but no dblclick handler existed (verified: after left-drag loaded 999 bars, double-click did nothing) — now wired to `chart.scrollToRealTime()` (verified: visible range 132→430-500). Minor: K-line date label now includes the year (a 500-bar daily range showed "08-26 ~ 08-24", reading like time travel across two years); the detail-page hero price/change now follows the quote's actual decimal digits (HK 00700 previously 440.40 → 440.4).
- **1.22.2** (2026-08-24) — **Fix: MA / avg-price lines landed in sub-panes instead of overlaying the main chart**. KLineChart v10's `createIndicator('MA')` opens a new pane by default — MAs were not on the candle pane (squeezed to 72px) and the minute chart's avg/prev-close lived in their own sub-pane. The fix passes `{ name, paneId: 'candle_pane' }` to explicitly overlay the main pane (pane id confirmed from engine source). Result: candlestick pane at 173px with MA5/10/30/60 overlaid (volume remains the only sub-pane); minute chart is a single pane with price + avg + prev-close overlaid, matching Xueqiu's layout. Also a Xueqiu-inspired detail-page restyle: hero quote header (large red/green price + change + pct), lighter 16-stat grid (tinted cards, tabular numerals), accent bar on card titles, theme-tinted active states for mode/period buttons, chart height 264→300px, harmonized 4-color MA palette, and high/low duplicate price marks disabled.
- **1.22.1** (2026-08-24) — chore: drop peerDependencies to silence install warnings; static smoke script falls back to local `npx dsh` (dsh not on PATH under prepublishOnly).
- **1.22.0** (2026-08-24) — **K-line / minute charts migrated to the KLineChart v10 engine** (canvas rendering, built-in light/dark theming): candles + volume + MA overlays + crosshair legend across 7 periods (5m/15m/30m/60m/day/week/month); wheel zoom, drag pan, and auto-fetch of earlier history on left-drag (500 bars per fetch); minute chart as a price-colored area with avg line and prev-close baseline.
- **1.21.0** (2025-08-21) — **Windows support**. DSH's Windows shell layer is PowerShell (`pwsh -Command`), whose single-quote literal semantics match POSIX — the original "cmd quoting incompatible" obstacle turned out not to exist. Three adaptations: ① explicit `curl.exe` call (dodges PS 5.1's `curl` = `Invoke-WebRequest` alias; curl.exe ships with Win10+); ② the cookie-seeding `-o /dev/null` becomes `NUL` on Windows; ③ quote characters stripped from Cookie headers against injection. The `realShell` test stub now mirrors the platform (pwsh on win32, same as DSH's win32 layer). CI gains a `windows-latest` job: unit + cookie tests + live.mjs against real Xueqiu (51 assertions incl. anonymous seeding) — all green. README platform requirement updated to macOS / Linux / Windows.
- **1.20.6** (2025-08-21) — **Cloud watchlist contract test wired into CI** (`qa/contract.mjs`, 7 assertions): hits the real endpoints (`portfolio/list.json`, `portfolio/stock/list.json`, `add.json`, `cancel.json`) including a genuine add→cancel round-trip with restore. Runs daily (UTC 21:00) via the `XQ_COOKIE` repo secret so any Xueqiu API change fails here first — preventing another `watch.json`-style phantom-endpoint incident. Skips automatically on push/PR without the secret; the same scheduled job also runs live.mjs (51 assertions). Requires setting the `XQ_COOKIE` secret (full browser Cookie header containing `xq_a_token`).
- **1.20.5** (2025-08-21) — **Cloud watchlist dual-write never worked**: the previously used `watch.json` endpoint does not exist (the WAF's blanket 403 on unknown paths was misread as "Xueqiu blocks third-party writes"). The real endpoints are `portfolio/stock/add.json` / `cancel.json` (POST form, symbols param). Fixed and verified with a real-account full round-trip: plugin add → cloud 116 ✓ → plugin remove → cloud restored 115 ✓. Local add/remove now genuinely syncs both ways; the 1.20.4 "writes are blocked" claim is retracted.
- **1.20.4** (2025-08-21) — **Host cache eviction fixed**: kline's minute-rounded begin param kept generating new cache keys with no eviction — an unbounded slow leak on long-running instances. Entries are now pruned on write with a 200-key cap. Also: cloud watchlist writes are confirmed blocked by Xueqiu's WAF (reads fine, writes 403) — the account panel and README now honestly state "cloud-as-truth: local add/remove gets overwritten at next sync; manage your watchlist on xueqiu.com". Tests added: watchdog 30s timeout path (hung request released at exactly 30s, slot freed), cache eviction (230→200 cap), real cloud-sync round-trip E2E, and a real agent-tool E2E (natural language → tool selection → card render → structured reply, data matching direct API).
- **1.20.3** (2025-08-21) — **Badge viewport clamping fixed**: the badge no longer stays off-screen after the window shrinks; clamped by real rendered size (borders included) on mount and re-clamped live on resize (browser-verified at 375px/320px viewports). Hardening: 1MB cap on `/xq-rpc` request bodies (413 beyond). Platform requirement documented (macOS/Linux). Completed browser-level UI walkthrough (badge / 4 tabs / search / detail / K-line crosshair / three-tier login error paths) and dynamic-branch protocol verification, with lossless login-state backup-restore.
- **1.20.2** (2025-08-21) — **3 fixes from a full QA test round**: ① `login.status` now falls back to JWT-decoded uid/screen_name when those fields are missing from the login file; ② the "empty kline" error message no longer misleads as a cookie problem and tells you to check the symbol format; ③ `xueqiu_news` now actually honors the count parameter (the upstream API ignores it and always returns ~10 per page — the tool layer auto-pages with max_id, up to 3 pages). Also added an offline unit-test suite under `qa/` (mock shell, no network, 40 assertions covering throttling/caching/retry chains/cloud-sync semantics/cookie dual-URL fallback/injection guards) wired into GitHub Actions, plus a local live suite `qa/live.mjs` with 51 real-API assertions.
- **1.20.1** (2025-08-20) — **Agent tool descriptions rewritten**: each of the 6 tools' descriptions expanded into structured form (when to use / input format with examples / output fields), including inter-tool guidance (run `xueqiu_search` first when unsure about a code, use `xueqiu_quote` instead of K-line when only the latest price is needed, hot rank ≠ gainers). Text-only change that directly improves agent tool-selection and parameter accuracy (closing the last gap vs dsh-us-stocks' description depth).
- **1.20.0** (2025-08-20) — **Automatic watchlist sync for logged-in users (cloud-as-truth)**: panel open / market refresh cycles check in the background; if the last sync is older than 10 minutes, the cloud watchlist is mirrored to local — additions/removals on xueqiu.com or the app propagate to the plugin within 10 minutes. Throttle timestamp is persisted; API failures are silent and never affect quotes; an empty cloud response is never mirrored (guards against accidental wipes). The manual "sync cloud watchlist" button remains and forces an immediate sync.
- **1.19.1** (2025-08-20) — **Cookie seeding dual-URL fallback**: try `xueqiu.com/hq` first (no WAF challenge, serves the full anonymous token set), fall back to the homepage. In some regions the homepage is taken over by an Aliyun WAF JS challenge that only issues `acw_tc`, breaking anonymous requests with 400016. (Diagnosis and verification by [@Lambenthan](https://github.com/Lambenthan), PR#2.)
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
