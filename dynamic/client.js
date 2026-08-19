return {
  inject: ['timer'],
  apply(ctx) {
    styles.insert('\n' +
      '.xq-dock{background:var(--dsw-alias-bg-layer-1);border:1px solid var(--dsw-alias-border-l1);border-radius:10px;overflow:hidden;font-size:13px;line-height:1.45;color:var(--dsw-alias-label-primary);margin-bottom:6px;}\n' +
      '.xq-dock *{box-sizing:border-box;}\n' +
      '.xq-dock-head{display:flex;align-items:center;gap:8px;padding:7px 12px;border-bottom:1px solid var(--dsw-alias-border-l1);}\n' +
      '.xq-dock-body{height:52vh;max-height:80vh;overflow-y:auto;padding:8px 12px 10px;}\n' +
      '.xq-dock-resize{display:flex;align-items:center;justify-content:center;height:12px;cursor:ns-resize;user-select:none;border-top:1px solid var(--dsw-alias-border-l1);}\n' +
      '.xq-dock-resize span{display:block;width:36px;height:3px;border-radius:2px;background:var(--dsw-alias-border-l2);}\n' +
      '.xq-badge{position:fixed;right:16px;bottom:64px;display:flex;flex-direction:column;align-items:stretch;gap:6px;padding:8px 12px;border-radius:14px;background:var(--dsw-alias-bg-layer-1);border:1px solid var(--dsw-alias-border-l2);box-shadow:0 6px 24px rgba(0,0,0,.25);font-size:11.5px;line-height:1.4;color:var(--dsw-alias-label-primary);cursor:grab;user-select:none;pointer-events:auto;z-index:1200;}\n' +
      '.xq-badge:active{cursor:grabbing;}\n' +
      '.xq-badge b{color:var(--dsw-alias-brand-primary);}\n' +
      '.xq-badge-val{font-weight:700;}\n' +
      '.xq-badge-hint{color:var(--dsw-alias-label-secondary);}\n' +
      '.xq-logo{font-weight:700;font-size:14px;letter-spacing:.5px;white-space:nowrap;}\n' +
      '.xq-logo b{color:var(--dsw-alias-brand-primary);}\n' +
      '.xq-update{font-size:11px;color:var(--dsw-alias-label-secondary);white-space:nowrap;}\n' +
      '.xq-status{font-size:10px;padding:1px 6px;border-radius:8px;background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-secondary);white-space:nowrap;}\n' +
      '.xq-status.xq-live{color:var(--dsw-alias-state-error-primary);}\n' +
      '.xq-spacer{flex:1;}\n' +
      '.xq-btn{font-size:12px;padding:2px 10px;border-radius:6px;border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary);cursor:pointer;}\n' +
      '.xq-btn:hover{border-color:var(--dsw-alias-brand-primary);}\n' +
      '.xq-btn:disabled{opacity:.5;cursor:default;}\n' +
      '.xq-btn-mini{font-size:11px;padding:1px 8px;border-radius:5px;border:1px solid var(--dsw-alias-border-l2);background:transparent;color:var(--dsw-alias-label-secondary);cursor:pointer;line-height:1.4;}\n' +
      '.xq-btn-mini:hover{color:var(--dsw-alias-label-primary);border-color:var(--dsw-alias-label-secondary);}\n' +
      '.xq-tabs{display:flex;gap:4px;align-items:center;border-bottom:1px solid var(--dsw-alias-border-l1);margin-bottom:8px;}\n' +
      '.xq-tab{font-size:13px;padding:5px 12px;border:none;background:none;color:var(--dsw-alias-label-secondary);cursor:pointer;border-bottom:2px solid transparent;}\n' +
      '.xq-tab:hover{color:var(--dsw-alias-label-primary);}\n' +
      '.xq-tab-active{color:var(--dsw-alias-brand-primary);border-bottom-color:var(--dsw-alias-brand-primary);font-weight:600;}\n' +
      '.xq-idx{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:8px;}\n' +
      '.xq-idx-card{flex:1;min-width:120px;background:var(--dsw-alias-bg-layer-2);border:1px solid var(--dsw-alias-border-l1);border-radius:8px;padding:6px 8px;cursor:pointer;}\n' +
      '.xq-idx-card:hover{border-color:var(--dsw-alias-brand-primary);}\n' +
      '.xq-sort-h{cursor:pointer;user-select:none;}\n' +
      '.xq-sort-h:hover{color:var(--dsw-alias-label-primary);}\n' +
      '.xq-sort-on{color:var(--dsw-alias-label-primary);font-weight:600;}\n' +
      '.xq-idx-name{font-size:11px;color:var(--dsw-alias-label-secondary);}\n' +
      '.xq-idx-row{display:flex;align-items:baseline;gap:6px;}\n' +
      '.xq-idx-cur{font-size:14px;font-weight:700;}\n' +
      '.xq-idx-pct{font-size:11px;}\n' +
      '.xq-up{color:var(--dsw-alias-state-error-primary);}\n' +
      '.xq-down{color:var(--dsw-alias-state-success-primary);}\n' +
      '.xq-flat{color:var(--dsw-alias-label-secondary);}\n' +
      // 专业感三件套：①等宽数字 ②涨跌幅色块 ③价格闪烁
      '.xq-dock,.xq-badge,.xq-ticker{font-variant-numeric:tabular-nums;}\n' +
      '.xq-pct-chip{display:inline-block;min-width:52px;text-align:center;padding:1px 6px;border-radius:5px;font-size:11.5px;font-weight:600;}\n' +
      '.xq-pct-chip.xq-up{background:color-mix(in srgb, var(--dsw-alias-state-error-primary) 12%, transparent);}\n' +
      '.xq-pct-chip.xq-down{background:color-mix(in srgb, var(--dsw-alias-state-success-primary) 12%, transparent);}\n' +
      '.xq-pct-chip.xq-flat{background:var(--dsw-alias-bg-layer-2);}\n' +
      '.xq-idx-pct.xq-pct-chip{min-width:46px;padding:0 5px;font-size:10.5px;}\n' +
      '@keyframes xq-flash-up{0%{background:color-mix(in srgb, var(--dsw-alias-state-error-primary) 18%, transparent);}100%{background:transparent;}}\n' +
      '@keyframes xq-flash-down{0%{background:color-mix(in srgb, var(--dsw-alias-state-success-primary) 18%, transparent);}100%{background:transparent;}}\n' +
      '.xq-flash-up{animation:xq-flash-up .8s ease-out;}\n' +
      '.xq-flash-down{animation:xq-flash-down .8s ease-out;}\n' +
      // 微交互：内容切换淡入 + 刷新按钮旋转
      '@keyframes xq-fade-in{from{opacity:0;transform:translateY(3px);}to{opacity:1;transform:none;}}\n' +
      '.xq-view{animation:xq-fade-in .18s ease-out;}\n' +
      '@keyframes xq-spin{to{transform:rotate(360deg);}}\n' +
      '.xq-refresh-spin{display:inline-block;animation:xq-spin .8s linear infinite;}\n' +
      '.xq-tab{transition:color .15s,border-color .15s;}\n' +
      // 快讯时间轴：左侧竖线 + 时间锚点分组
      '.xq-news-tl{position:relative;padding-left:14px;}\n' +
      '.xq-news-tl::before{content:"";position:absolute;left:4px;top:6px;bottom:6px;width:1px;background:var(--dsw-alias-border-l2);}\n' +
      '.xq-news-group{font-size:10.5px;color:var(--dsw-alias-label-secondary);margin:8px 0 5px;display:flex;align-items:center;gap:6px;}\n' +
      '.xq-news-group::before{content:"";width:7px;height:7px;border-radius:50%;background:var(--dsw-alias-border-l2);margin-left:-13px;flex:none;}\n' +
      '.xq-news-item{position:relative;}\n' +
      // 徽章 hover 预览弹层
      // 徽章区域模式：右下角宽度调节手柄（⤡），拖动横向改变宽度
      '.xq-badge-grip{position:absolute;right:0;bottom:0;width:14px;height:14px;cursor:ew-resize;display:flex;align-items:flex-end;justify-content:flex-end;color:var(--dsw-alias-label-secondary);font-size:9px;line-height:1;opacity:0;transition:opacity .15s;}\n' +
      '.xq-badge:hover .xq-badge-grip{opacity:.85;}\n' +
      '.xq-wgrid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:3px 12px;}\n' +
      '.xq-witem{white-space:nowrap;display:flex;justify-content:space-between;gap:6px;}\n' +
      '.xq-witem .xq-badge-hint{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:0 1 auto;}\n' +
      '.xq-idxgrid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:3px 12px;padding-bottom:5px;border-bottom:1px solid var(--dsw-alias-border-l2);}\n' +
      '.xq-idxrow{display:flex;justify-content:space-between;gap:6px;white-space:nowrap;}\n' +
      '.xq-grid{display:grid;gap:0;border:1px solid var(--dsw-alias-border-l1);border-radius:8px;overflow:hidden;margin-bottom:8px;}\n' +
      '.xq-grid-hd,.xq-grid-row{display:grid;grid-template-columns:1.6fr 1fr 1fr 1fr 84px;align-items:center;}\n' +
      '.xq-grid-hd{font-size:11px;color:var(--dsw-alias-label-secondary);background:var(--dsw-alias-bg-layer-2);padding:5px 8px;}\n' +
      '.xq-grid-row{padding:6px 8px;border-top:1px solid var(--dsw-alias-border-l1);cursor:pointer;font-size:12.5px;}\n' +
      '.xq-grid-row:hover{background:var(--dsw-alias-bg-layer-2);}\n' +
      '.xq-name{font-weight:600;}\n' +
      '.xq-sub{font-size:10.5px;color:var(--dsw-alias-label-secondary);}\n' +
      '.xq-muted{font-size:12px;color:var(--dsw-alias-label-secondary);}\n' +
      '.xq-err{font-size:12px;color:var(--dsw-alias-state-warn-primary);background:var(--dsw-alias-bg-layer-2);border:1px solid var(--dsw-alias-border-l1);border-radius:6px;padding:5px 8px;margin-bottom:6px;}\n' +
      '.xq-actions{display:flex;gap:4px;justify-content:flex-end;}\n' +
      '.xq-input{font-size:12.5px;padding:4px 8px;border-radius:6px;border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary);}\n' +
      '.xq-input:focus{outline:none;border-color:var(--dsw-alias-brand-primary);}\n' +
      '.xq-search-row{display:flex;gap:6px;margin-bottom:8px;}\n' +
      '.xq-search-row .xq-input{flex:1;}\n' +
      '.xq-seg{display:inline-flex;gap:2px;border:1px solid var(--dsw-alias-border-l2);border-radius:6px;padding:1px;}\n' +
      '.xq-seg button{font-size:11.5px;border:none;background:none;color:var(--dsw-alias-label-secondary);padding:2px 8px;border-radius:5px;cursor:pointer;}\n' +
      '.xq-seg button.xq-seg-on{background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary);font-weight:600;}\n' +
      '.xq-news{display:flex;flex-direction:column;gap:7px;max-height:380px;overflow-y:auto;}\n' +
      '.xq-news-item{font-size:12.5px;padding:6px 8px;background:var(--dsw-alias-bg-layer-2);border:1px solid var(--dsw-alias-border-l1);border-radius:7px;}\n' +
      '.xq-news-item.xq-important{border-left:3px solid var(--dsw-alias-state-warn-primary);}\n' +
      '.xq-news-time{font-size:10.5px;color:var(--dsw-alias-label-secondary);margin-top:3px;}\n' +
      '.xq-news-more{font-size:11.5px;color:var(--dsw-alias-label-secondary);text-align:center;padding:6px 0 2px;cursor:pointer;user-select:none;}\n' +
      '.xq-news-more:hover{color:var(--dsw-alias-label-primary);}\n' +
      '.xq-detail-head{display:flex;align-items:center;gap:10px;margin-bottom:8px;flex-wrap:wrap;}\n' +
      '.xq-detail-name{font-size:15px;font-weight:700;}\n' +
      '.xq-detail-code{font-size:11px;color:var(--dsw-alias-label-secondary);}\n' +
      '.xq-detail-cur{font-size:20px;font-weight:800;}\n' +
      '.xq-detail-pct{font-size:13px;}\n' +
      '.xq-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-bottom:8px;}\n' +
      '.xq-stat{background:var(--dsw-alias-bg-layer-2);border:1px solid var(--dsw-alias-border-l1);border-radius:6px;padding:4px 7px;}\n' +
      '.xq-stat-k{font-size:10.5px;color:var(--dsw-alias-label-secondary);}\n' +
      '.xq-stat-v{font-size:12.5px;font-weight:600;}\n' +
      '.xq-card{background:var(--dsw-alias-bg-layer-2);border:1px solid var(--dsw-alias-border-l1);border-radius:8px;padding:8px 10px;margin-bottom:8px;}\n' +
      '.xq-card-t{font-size:12px;font-weight:700;margin-bottom:6px;display:flex;align-items:center;gap:8px;flex-wrap:wrap;}\n' +
      '.xq-periods{display:inline-flex;flex-wrap:wrap;gap:2px;border:1px solid var(--dsw-alias-border-l2);border-radius:6px;padding:1px;}\n' +
      '.xq-periods button,.xq-modes button{font-size:11.5px;border:none;background:none;color:var(--dsw-alias-label-secondary);padding:2px 9px;border-radius:5px;cursor:pointer;}\n' +
      '.xq-periods button.xq-on,.xq-modes button.xq-on{background:var(--dsw-alias-bg-overlay);color:var(--dsw-alias-label-primary);font-weight:600;}\n' +
      '.xq-chart{width:100%;height:auto;display:block;}\n' +
      '.xq-chart-wrap{position:relative;}\n' +
      '.xq-tip{position:absolute;top:4px;z-index:5;pointer-events:none;background:var(--dsw-alias-bg-overlay);border:1px solid var(--dsw-alias-border-l2);border-radius:6px;padding:4px 8px;font-size:10.5px;line-height:1.6;color:var(--dsw-alias-label-primary);box-shadow:0 4px 14px rgba(0,0,0,.28);white-space:nowrap;}\n' +
      '.xq-tip-d{font-weight:700;}\n' +
      '.xq-tip-r{display:flex;gap:8px;}\n' +
      '.xq-tip-k{color:var(--dsw-alias-label-secondary);}\n' +
      '.xq-chart-labels{display:flex;justify-content:space-between;font-size:10.5px;color:var(--dsw-alias-label-secondary);margin-top:2px;}\n' +
      '.xq-ma-legend{display:flex;gap:10px;font-size:10.5px;color:var(--dsw-alias-label-secondary);}\n' +
      '.xq-kol{display:flex;flex-wrap:wrap;gap:6px;}\n' +
      '.xq-kol-chip{font-size:12px;padding:4px 10px;border-radius:14px;border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-1);cursor:pointer;}\n' +
      '.xq-kol-chip:hover{border-color:var(--dsw-alias-brand-primary);}\n' +
      '.xq-verif{font-size:9.5px;color:var(--dsw-alias-brand-primary);margin-left:4px;}\n' +
      '.xq-hot-row{display:flex;align-items:center;gap:8px;padding:6px 8px;border-bottom:1px solid var(--dsw-alias-border-l1);cursor:pointer;}\n' +
      '.xq-hot-row:last-child{border-bottom:none;}\n' +
      '.xq-hot-row:hover{background:var(--dsw-alias-bg-layer-2);}\n' +
      '.xq-rank{font-size:12px;font-weight:700;width:20px;text-align:center;color:var(--dsw-alias-label-secondary);}\n' +
      '.xq-ticker{display:flex;gap:14px;font-size:11px;color:var(--dsw-alias-label-secondary);padding:2px 2px;flex-wrap:wrap;cursor:pointer;}\n' +
      '.xq-ticker:hover{color:var(--dsw-alias-label-primary);}\n' +
      '.xq-tick{display:inline-flex;gap:5px;align-items:baseline;}\n' +
      '.xq-tick-name{color:var(--dsw-alias-label-secondary);}\n' +
      '.xq-tick-cur{font-weight:600;}\n' +
      '.xq-caret{font-size:11px;color:var(--dsw-alias-label-secondary);flex-shrink:0;}\n' +
      '.xq-loading{font-size:12px;color:var(--dsw-alias-label-secondary);padding:12px 0;text-align:center;}\n' +
      // 账号登录（可选）：粘贴浏览器 Cookie 启用云端自选股
      '.xq-acc-btn.xq-acc-on{border-color:color-mix(in srgb, var(--dsw-alias-brand-primary) 45%, transparent);color:var(--dsw-alias-brand-primary);}\n' +
      '.xq-login{display:flex;flex-direction:column;gap:9px;max-width:560px;}\n' +
      '.xq-login-hd{font-size:13.5px;font-weight:700;}\n' +
      '.xq-login-tip{font-size:12px;color:var(--dsw-alias-label-secondary);line-height:1.7;background:var(--dsw-alias-bg-layer-2);border:1px solid var(--dsw-alias-border-l1);border-radius:7px;padding:7px 10px;}\n' +
      '.xq-login-tip b{color:var(--dsw-alias-label-primary);}\n' +
      '.xq-login-tip ol{margin:4px 0 0;padding-left:18px;}\n' +
      '.xq-login-tip a{color:var(--dsw-alias-brand-primary);}\n' +
      '.xq-login textarea{font-size:11.5px;font-family:ui-monospace,Menlo,monospace;width:100%;min-height:64px;resize:vertical;padding:6px 8px;border-radius:6px;border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary);}\n' +
      '.xq-login textarea:focus{outline:none;border-color:var(--dsw-alias-brand-primary);}\n' +
      '.xq-login-msg{font-size:12px;}\n' +
      '.xq-login-row{display:flex;gap:6px;align-items:center;flex-wrap:wrap;}\n' +
      '.xq-login-user{font-size:12.5px;color:var(--dsw-alias-label-primary);}\n' +
      '.xq-login-ok{color:var(--dsw-alias-state-success-primary);}\n' +
      '.xq-login-bad{color:var(--dsw-alias-state-warn-primary);}\n' +
      '.xq-acc-mark{font-size:10px;color:var(--dsw-alias-label-secondary);}\n'
    )

    function el(type, props, children) { return React.createElement(type, props, children) }

    async function call(action, args) {
      const r = await host.call('xq.call', { action: action, args: args || {} })
      if (!r || !r.ok) throw new Error((r && r.error) || '调用失败')
      return r.data
    }

    function fmt(v, d) {
      if (v === null || v === undefined || v === '') return '--'
      const n = Number(v)
      if (!isFinite(n)) return '--'
      const digits = (d === undefined) ? 2 : d
      return n.toFixed(digits)
    }
    function fmtPct(v) {
      if (v === null || v === undefined) return '--'
      const n = Number(v)
      if (!isFinite(n)) return '--'
      return (n >= 0 ? '+' : '') + n.toFixed(2) + '%'
    }
    function fmtBig(v) {
      if (v === null || v === undefined) return '--'
      const n = Number(v)
      if (!isFinite(n)) return '--'
      if (Math.abs(n) >= 1e8) return (n / 1e8).toFixed(2) + '亿'
      if (Math.abs(n) >= 1e4) return (n / 1e4).toFixed(2) + '万'
      return String(n)
    }
    function fmtVol(v) {
      if (v === null || v === undefined) return '--'
      const n = Number(v)
      if (!isFinite(n)) return '--'
      if (n >= 1e8) return (n / 1e8).toFixed(2) + '亿手'
      if (n >= 1e4) return (n / 1e4).toFixed(2) + '万手'
      return String(n)
    }
    function fmtTime(ts) {
      if (!ts) return ''
      const d = new Date(Number(ts))
      function p(n) { return n < 10 ? '0' + n : String(n) }
      return p(d.getHours()) + ':' + p(d.getMinutes()) + ':' + p(d.getSeconds())
    }
    function fmtDay(ts) {
      if (!ts) return ''
      const d = new Date(Number(ts))
      function p(n) { return n < 10 ? '0' + n : String(n) }
      return p(d.getMonth() + 1) + '-' + p(d.getDate())
    }
    function fmtFullDay(ts) {
      if (!ts) return ''
      const d = new Date(Number(ts))
      function p(n) { return n < 10 ? '0' + n : String(n) }
      return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate())
    }
    function colorOf(pct) {
      if (pct === null || pct === undefined) return 'xq-flat'
      const n = Number(pct)
      if (n > 0) return 'xq-up'
      if (n < 0) return 'xq-down'
      return 'xq-flat'
    }
    function upColor(up) { return up ? 'var(--dsw-alias-state-error-primary)' : 'var(--dsw-alias-state-success-primary)' }

    function viewport() {
      try { if (typeof window !== 'undefined' && window.innerWidth) return { w: window.innerWidth, h: window.innerHeight } } catch (e) { /* ignore */ }
      try { if (typeof document !== 'undefined' && document.documentElement && document.documentElement.clientWidth) return { w: document.documentElement.clientWidth, h: document.documentElement.clientHeight } } catch (e) { /* ignore */ }
      return null
    }

    function pageHidden() {
      try { return typeof document !== 'undefined' && document.hidden } catch (e) { return false }
    }

    // 交易时段：本地 Intl 时区判定（不含节假日，仅供参考）
    // segs: [[开盘分,收盘分],...]；lunch: [午休起,午休止]（可选）
    function sessionState(tz, segs, lunch) {
      try {
        var now = new Date()
        var f = new Intl.DateTimeFormat('en-US', { timeZone: tz, hour12: false, weekday: 'short', hour: '2-digit', minute: '2-digit' })
        var p = {}
        f.formatToParts(now).forEach(function (x) { p[x.type] = x.value })
        if (p.weekday === 'Sat' || p.weekday === 'Sun') return '休市'
        var h = parseInt(p.hour, 10) % 24
        var cur = h * 60 + parseInt(p.minute, 10)
        var inSess = segs.some(function (s) { return cur >= s[0] && cur < s[1] })
        if (inSess) return '盘中'
        if (lunch && cur >= lunch[0] && cur < lunch[1]) return '午休'
        return cur < segs[0][0] ? '盘前' : '休市'
      } catch (e) { return '' }
    }
    function aSession() { return sessionState('Asia/Shanghai', [[570, 690], [780, 900]], [690, 780]) }
    function hkSession() { return sessionState('Asia/Hong_Kong', [[570, 720], [780, 960]], [720, 780]) }
    function usSession() { return sessionState('America/New_York', [[570, 960]], null) }
    function sessionsText() {
      var a = aSession(), hk = hkSession(), us = usSession()
      if (!a && !hk && !us) return ''
      return [a && 'A股' + a, hk && '港股' + hk, us && '美股' + us].filter(Boolean).join(' · ')
    }

    // ---------- 共享 UI 状态：面板开合 / 当前标签 / 徽章位置 ----------
    const ui = {
      open: false, tab: 'market', badgePos: null, badgeW: null, dockH: null, hydrated: false,
      _fns: [],
      subscribe: function (fn) {
        this._fns.push(fn)
        const self = this
        return function () {
          const i = self._fns.indexOf(fn)
          if (i !== -1) self._fns.splice(i, 1)
        }
      },
      notify: function () {
        const fns = this._fns.slice()
        for (let i = 0; i < fns.length; i++) { try { fns[i]() } catch (e) { /* ignore */ } }
      },
      set: function (patch) {
        let ch = false
        for (const k in patch) {
          if (this[k] !== patch[k]) { this[k] = patch[k]; ch = true }
        }
        if (ch) this.notify()
      }
    }

    const saveUi = ctx.debounce(function () {
      call('ui.set', { tab: ui.tab, open: ui.open, badgePos: ui.badgePos, badgeW: ui.badgeW, dockH: ui.dockH }).catch(function () { /* 忽略 */ })
    }, 800)

    // 徽章拖拽引用（实例唯一）
    let badgeDrag = null
    let badgeMoved = false

    // 面板高度拖拽引用（实例唯一，避免组件重渲染丢失状态）
    const dockResize = { active: false, startY: 0, startH: 0, h: 0, body: null }

    // ---------- K线蜡烛图（成交量 + 均线 + 十字光标/悬浮详情） ----------
    function KlineChart(props) {
      const rows = props.rows || []
      const [hi, setHi] = React.useState(null)
      if (!rows.length) return el('div', { className: 'xq-muted' }, '暂无K线数据')
      const W = 640, MAIN = 150, VOL = 44, PAD = 6, GAP = 4, LBL = 14
      const H = MAIN + VOL + GAP + PAD + LBL
      let min = Infinity, max = -Infinity
      for (let i = 0; i < rows.length; i++) {
        const rlo = Number(rows[i].low), rhi = Number(rows[i].high)
        if (rlo < min) min = rlo
        if (rhi > max) max = rhi
      }
      if (!isFinite(min) || !isFinite(max) || min === max) { min -= 1; max += 1 }
      const range = max - min
      const n = rows.length
      const step = (W - PAD * 2) / n
      const bw = Math.max(step * 0.66, 1)
      const yOf = function (v) { return PAD + (1 - (v - min) / range) * (MAIN - PAD * 2) }
      const vTop = PAD + MAIN + GAP
      const vBottom = H - PAD - LBL
      const vH = vBottom - vTop
      let vmax = 0
      for (let i = 0; i < rows.length; i++) {
        const v = Number(rows[i].volume) || 0
        if (v > vmax) vmax = v
      }
      if (!vmax) vmax = 1
      function maArr(nn) {
        const out = []
        for (let i = 0; i < rows.length; i++) {
          if (i < nn - 1) { out.push(null); continue }
          let s = 0
          for (let j = i - nn + 1; j <= i; j++) s += Number(rows[j].close)
          out.push(s / nn)
        }
        return out
      }
      const ma5 = maArr(5), ma10 = maArr(10), ma20 = maArr(20)
      function poly(arr, color) {
        const pts = []
        for (let i = 0; i < arr.length; i++) {
          if (arr[i] === null || arr[i] === undefined) continue
          const x = PAD + step * i + step / 2
          const y = yOf(arr[i])
          pts.push(x.toFixed(1) + ',' + y.toFixed(1))
        }
        if (pts.length < 2) return null
        return el('polyline', { key: color, points: pts.join(' '), fill: 'none', stroke: color, strokeWidth: 1 })
      }
      const kids = []
      for (let i = 0; i < n; i++) {
        const r = rows[i]
        const up = Number(r.close) >= Number(r.open)
        const color = upColor(up)
        const x = PAD + step * i + step / 2
        const yh = yOf(Number(r.high)), yl = yOf(Number(r.low))
        const yo = yOf(Number(r.open)), yc = yOf(Number(r.close))
        const top = Math.min(yo, yc)
        const hgt = Math.max(Math.abs(yc - yo), 1)
        kids.push(el('line', { key: 'w' + i, x1: x, y1: yh, x2: x, y2: yl, stroke: color, strokeWidth: 1 }))
        kids.push(el('rect', { key: 'c' + i, x: x - bw / 2, y: top, width: bw, height: hgt, fill: color }))
        const vh = Math.max(vH * (Number(r.volume) || 0) / vmax, 0.5)
        kids.push(el('rect', { key: 'v' + i, x: x - bw / 2, y: vBottom - vh, width: bw, height: vh, fill: color, opacity: 0.45 }))
      }
      const last = rows[n - 1]
      function onMove(e) {
        const rect = e.currentTarget.getBoundingClientRect()
        if (!rect || !rect.width) return
        const px = (e.clientX - rect.left) / rect.width * W
        let i = Math.floor((px - PAD) / step)
        if (i < 0) i = 0
        if (i > n - 1) i = n - 1
        setHi(i)
      }
      let cross = null, tip = null
      if (hi !== null && hi >= 0 && hi < n) {
        const r = rows[hi]
        const cx = PAD + step * hi + step / 2
        const cy = yOf(Number(r.close))
        // 轴标签：光标价位（右侧底色块）+ 日期（底部底色块）
        const priceTxt = fmt(Number(r.close))
        const pLblW = priceTxt.length * 5.6 + 8
        const dateTxt = fmtFullDay(r.timestamp).slice(5)   // MM-DD
        const dLblW = dateTxt.length * 5.6 + 8
        cross = [
          el('line', { key: 'cv', x1: cx, y1: PAD, x2: cx, y2: vBottom, stroke: 'var(--dsw-alias-label-secondary)', strokeWidth: 0.6, strokeDasharray: '3 3', opacity: 0.7 }),
          el('line', { key: 'ch', x1: PAD, y1: cy, x2: W - PAD, y2: cy, stroke: 'var(--dsw-alias-label-secondary)', strokeWidth: 0.6, strokeDasharray: '3 3', opacity: 0.7 }),
          el('rect', { key: 'pbg', x: W - PAD - pLblW, y: cy - 7, width: pLblW, height: 14, rx: 3, fill: 'var(--dsw-alias-bg-layer-2)', stroke: 'var(--dsw-alias-border-l2)', strokeWidth: 0.5 }),
          el('text', { key: 'ptx', x: W - PAD - pLblW / 2, y: cy + 3.5, fontSize: 9, textAnchor: 'middle', fill: 'var(--dsw-alias-label-primary)' }, priceTxt),
          el('rect', { key: 'dbg', x: Math.min(Math.max(PAD, cx - dLblW / 2), W - PAD - dLblW), y: vBottom + 1, width: dLblW, height: 13, rx: 3, fill: 'var(--dsw-alias-bg-layer-2)', stroke: 'var(--dsw-alias-border-l2)', strokeWidth: 0.5 }),
          el('text', { key: 'dtx', x: Math.min(Math.max(PAD, cx - dLblW / 2), W - PAD - dLblW) + dLblW / 2, y: vBottom + 10.5, fontSize: 9, textAnchor: 'middle', fill: 'var(--dsw-alias-label-primary)' }, dateTxt)
        ]
        tip = el('div', {
          key: 'tip', className: 'xq-tip',
          style: { left: (cx / W * 100) + '%', transform: cx > W * 0.55 ? 'translateX(calc(-100% - 10px))' : 'translateX(10px)' }
        }, [
          el('div', { key: 'd', className: 'xq-tip-d' }, fmtFullDay(r.timestamp)),
          el('div', { key: 'r1', className: 'xq-tip-r' }, [
            el('span', { key: 'a' }, [el('span', { key: 'k', className: 'xq-tip-k' }, '开 '), fmt(r.open)]),
            el('span', { key: 'b' }, [el('span', { key: 'k', className: 'xq-tip-k' }, '高 '), fmt(r.high)]),
            el('span', { key: 'c' }, [el('span', { key: 'k', className: 'xq-tip-k' }, '低 '), fmt(r.low)]),
            el('span', { key: 'e', className: colorOf(r.percent) }, [el('span', { key: 'k', className: 'xq-tip-k' }, '收 '), fmt(r.close)])
          ]),
          el('div', { key: 'r2', className: 'xq-tip-r' }, [
            el('span', { key: 'p', className: colorOf(r.percent) }, [el('span', { key: 'k', className: 'xq-tip-k' }, '涨跌 '), fmtPct(r.percent)]),
            el('span', { key: 'v' }, [el('span', { key: 'k', className: 'xq-tip-k' }, '量 '), fmtVol(r.volume)])
          ]),
          el('div', { key: 'r3', className: 'xq-tip-r' }, [
            el('span', { key: 'm5', style: { color: '#f59e0b' } }, 'MA5 ' + (ma5[hi] === null ? '--' : fmt(ma5[hi]))),
            el('span', { key: 'm10', style: { color: '#3b82f6' } }, 'MA10 ' + (ma10[hi] === null ? '--' : fmt(ma10[hi]))),
            el('span', { key: 'm20', style: { color: '#a855f7' } }, 'MA20 ' + (ma20[hi] === null ? '--' : fmt(ma20[hi])))
          ])
        ])
      }
      return el('div', { className: 'xq-chart-wrap' }, [
        tip,
        el('svg', {
          key: 's', className: 'xq-chart', viewBox: '0 0 ' + W + ' ' + H,
          onMouseMove: onMove, onMouseLeave: function () { setHi(null) }
        }, [
          el('line', { key: 'base', x1: PAD, y1: vTop, x2: W - PAD, y2: vTop, stroke: 'var(--dsw-alias-border-l2)', strokeWidth: 1 }),
          poly(ma5, '#f59e0b'),
          poly(ma10, '#3b82f6'),
          poly(ma20, '#a855f7'),
          kids,
          cross,
          el('text', { key: 'hiT', x: PAD, y: 10, fontSize: 9, fill: 'var(--dsw-alias-label-secondary)' }, '高 ' + fmt(max)),
          el('text', { key: 'loT', x: PAD, y: MAIN - 2, fontSize: 9, fill: 'var(--dsw-alias-label-secondary)' }, '低 ' + fmt(min)),
          el('text', { key: 'lastT', x: W - PAD, y: Math.max(yOf(Number(last.close)) - 4, 10), fontSize: 9, fill: upColor(Number(last.close) >= Number(rows[n - 2] ? rows[n - 2].close : last.open)), textAnchor: 'end' }, fmt(last.close))
        ]),
        el('div', { key: 'lb', className: 'xq-chart-labels' }, [
          el('span', { key: 'd' }, fmtDay(rows[0].timestamp) + ' ~ ' + fmtDay(last.timestamp)),
          el('span', { key: 'ma', className: 'xq-ma-legend' }, [
            el('span', { key: 'm5', style: { color: '#f59e0b' } }, 'MA5'),
            el('span', { key: 'm10', style: { color: '#3b82f6' } }, 'MA10'),
            el('span', { key: 'm20', style: { color: '#a855f7' } }, 'MA20'),
            el('span', { key: 'n' }, n + ' 根')
          ])
        ])
      ])
    }

    // ---------- 分时图（十字光标/悬浮详情） ----------
    function MinuteChart(props) {
      const items = props.items || []
      const [hi, setHi] = React.useState(null)
      const lastClose = Number(props.lastClose)
      if (!items.length) return el('div', { className: 'xq-muted' }, '暂无分时数据')
      const W = 640, CH = 170, LBL = 14, H = CH + LBL, PAD = 6   // CH 图区 + LBL 底部时间标签条
      let min = Infinity, max = -Infinity
      for (let i = 0; i < items.length; i++) {
        const c = Number(items[i].current)
        if (c < min) min = c
        if (c > max) max = c
      }
      if (lastClose) { if (lastClose < min) min = lastClose; if (lastClose > max) max = lastClose }
      if (!isFinite(min) || !isFinite(max) || min === max) { min -= 1; max += 1 }
      const range = max - min
      const yOf = function (v) { return PAD + (1 - (v - min) / range) * (CH - PAD * 2) }
      const xOf = function (i) { return PAD + (i / (items.length - 1)) * (W - PAD * 2) }
      const pricePts = []
      const avgPts = []
      for (let i = 0; i < items.length; i++) {
        pricePts.push(xOf(i).toFixed(1) + ',' + yOf(Number(items[i].current)).toFixed(1))
        const avg = Number(items[i].avg_price) || Number(items[i].current)
        avgPts.push(xOf(i).toFixed(1) + ',' + yOf(avg).toFixed(1))
      }
      const last = Number(items[items.length - 1].current)
      const up = lastClose ? (last >= lastClose) : true
      const stroke = upColor(up)
      const yBase = lastClose ? yOf(lastClose) : null
      function onMove(e) {
        if (items.length < 2) return
        const rect = e.currentTarget.getBoundingClientRect()
        if (!rect || !rect.width) return
        const px = (e.clientX - rect.left) / rect.width * W
        let i = Math.round((px - PAD) / (W - PAD * 2) * (items.length - 1))
        if (i < 0) i = 0
        if (i > items.length - 1) i = items.length - 1
        setHi(i)
      }
      let cross = null, tip = null
      if (hi !== null && hi >= 0 && hi < items.length) {
        const it = items[hi]
        const cx = xOf(hi), cy = yOf(Number(it.current))
        const pct = lastClose ? (Number(it.current) - lastClose) / lastClose * 100 : null
        // 轴标签：光标价位（右侧）+ 时间（底部）
        const priceTxt = fmt(Number(it.current))
        const pLblW = priceTxt.length * 5.6 + 8
        const timeTxt = it.timestamp ? fmtTime(it.timestamp) : ''
        const dLblW = timeTxt.length * 5.6 + 8
        cross = [
          el('line', { key: 'cv', x1: cx, y1: PAD, x2: cx, y2: CH - PAD, stroke: 'var(--dsw-alias-label-secondary)', strokeWidth: 0.6, strokeDasharray: '3 3', opacity: 0.7 }),
          el('line', { key: 'ch', x1: PAD, y1: cy, x2: W - PAD, y2: cy, stroke: 'var(--dsw-alias-label-secondary)', strokeWidth: 0.6, strokeDasharray: '3 3', opacity: 0.7 }),
          el('rect', { key: 'pbg', x: W - PAD - pLblW, y: cy - 7, width: pLblW, height: 14, rx: 3, fill: 'var(--dsw-alias-bg-layer-2)', stroke: 'var(--dsw-alias-border-l2)', strokeWidth: 0.5 }),
          el('text', { key: 'ptx', x: W - PAD - pLblW / 2, y: cy + 3.5, fontSize: 9, textAnchor: 'middle', fill: 'var(--dsw-alias-label-primary)' }, priceTxt),
          el('rect', { key: 'dbg', x: Math.min(Math.max(PAD, cx - dLblW / 2), W - PAD - dLblW), y: CH + 1, width: dLblW, height: 13, rx: 3, fill: 'var(--dsw-alias-bg-layer-2)', stroke: 'var(--dsw-alias-border-l2)', strokeWidth: 0.5 }),
          el('text', { key: 'dtx', x: Math.min(Math.max(PAD, cx - dLblW / 2), W - PAD - dLblW) + dLblW / 2, y: CH + 10.5, fontSize: 9, textAnchor: 'middle', fill: 'var(--dsw-alias-label-primary)' }, timeTxt)
        ]
        tip = el('div', {
          key: 'tip', className: 'xq-tip',
          style: { left: (cx / W * 100) + '%', transform: cx > W * 0.55 ? 'translateX(calc(-100% - 10px))' : 'translateX(10px)' }
        }, [
          el('div', { key: 'd', className: 'xq-tip-d' }, fmtDay(it.timestamp) + ' ' + fmtTime(it.timestamp)),
          el('div', { key: 'r1', className: 'xq-tip-r' }, [
            el('span', { key: 'p', className: colorOf(pct) }, [el('span', { key: 'k', className: 'xq-tip-k' }, '价 '), fmt(it.current)]),
            el('span', { key: 'a' }, [el('span', { key: 'k', className: 'xq-tip-k' }, '均价 '), fmt(it.avg_price)]),
            el('span', { key: 'g', className: colorOf(pct) }, [el('span', { key: 'k', className: 'xq-tip-k' }, '涨跌 '), fmtPct(pct)])
          ])
        ])
      }
      const kids = [
        yBase !== null ? el('line', { key: 'base', x1: PAD, y1: yBase, x2: W - PAD, y2: yBase, stroke: 'var(--dsw-alias-border-l2)', strokeWidth: 1, strokeDasharray: '3 3' }) : null,
        el('polyline', { key: 'avg', points: avgPts.join(' '), fill: 'none', stroke: 'var(--dsw-alias-state-warn-primary)', strokeWidth: 1 }),
        el('polyline', { key: 'p', points: pricePts.join(' '), fill: 'none', stroke: stroke, strokeWidth: 1.6 }),
        cross,
        el('text', { key: 'hiT', x: PAD, y: 10, fontSize: 9, fill: 'var(--dsw-alias-label-secondary)' }, '高 ' + fmt(max)),
        el('text', { key: 'loT', x: PAD, y: H - 4, fontSize: 9, fill: 'var(--dsw-alias-label-secondary)' }, '低 ' + fmt(min)),
        el('text', { key: 'lastT', x: W - PAD, y: Math.max(yOf(last) - 4, 10), fontSize: 9, fill: stroke, textAnchor: 'end' }, fmt(last))
      ]
      return el('div', { className: 'xq-chart-wrap' }, [
        tip,
        el('svg', {
          key: 's', className: 'xq-chart', viewBox: '0 0 ' + W + ' ' + H,
          onMouseMove: onMove, onMouseLeave: function () { setHi(null) }
        }, kids),
        el('div', { key: 'lb', className: 'xq-chart-labels' }, [
          el('span', { key: 'd' }, fmtDay(items[0].timestamp) + ' 分时'),
          el('span', { key: 'n' }, items.length + ' 笔')
        ])
      ])
    }

    // ---------- 面板内容（数据 + tabs + 详情） ----------
    function XueqiuPanel() {
      const [watchlist, setWatchlist] = React.useState([])
      const [quotes, setQuotes] = React.useState([])
      // 价格闪烁：记录上一价与变化方向（symbol -> 1|-1），行渲染时挂一次性动画类
      const prevPrices = React.useRef({})
      const [flashDir, setFlashDir] = React.useState({})
      const [indices, setIndices] = React.useState([])
      const [hot, setHot] = React.useState([])
      const [hotMarket, setHotMarket] = React.useState('cn')
      const [news, setNews] = React.useState([])
      const [newsMore, setNewsMore] = React.useState(false)   // 翻页加载中
      const [newsNoMore, setNewsNoMore] = React.useState(false) // 已到最旧
      const [searchQ, setSearchQ] = React.useState('')
      const [searchMode, setSearchMode] = React.useState('stock')
      const [searchRes, setSearchRes] = React.useState([])
      const [searching, setSearching] = React.useState(false)
      const [manualCode, setManualCode] = React.useState('')
      const [view, setView] = React.useState(null)
      const [detail, setDetail] = React.useState(null)
      const [klinePeriod, setKlinePeriod] = React.useState('day')
      const [chartMode, setChartMode] = React.useState('kline')
      const [marketOpen, setMarketOpen] = React.useState(true)
      const [err, setErr] = React.useState('')
      const [loading, setLoading] = React.useState(true)
      const [sortK, setSortK] = React.useState('default')
      const [sortAsc, setSortAsc] = React.useState(false)
      // 可选登录态（粘贴浏览器 Cookie）：null=未知，{loggedIn}=状态
      const [login, setLoginSt] = React.useState(null)
      const [loginOpen, setLoginOpen] = React.useState(false)
      const [cookieInput, setCookieInput] = React.useState('')
      const [loginBusy, setLoginBusy] = React.useState(false)
      const [loginMsg, setLoginMsg] = React.useState(null)   // {ok, text}
      const tab = ui.tab
      function setTab(t) { ui.set({ tab: t }) }

      function refreshMarket() {
        return Promise.all([
          call('watchlist.get', {}),
          call('quote', { symbols: ['SH000001', 'SZ399001', 'SZ399006', 'SH000688'] })
        ]).then(function (res) {
          const wl = (res[0] && res[0].symbols) || []
          const status = res[1] ? res[1].status : null
          setMarketOpen(status === 5 || status === 6)
          setWatchlist(wl)
          setIndices((res[1] && res[1].list) || [])
          setErr('')
          if (!wl.length) return
          return call('quote', { symbols: wl }).then(function (data) {
            const list = (data && data.list) || []
            const dirs = {}
            list.forEach(function (q) {
              const prev = prevPrices.current[q.symbol]
              if (prev !== undefined && q.current !== prev) dirs[q.symbol] = q.current > prev ? 1 : -1
              prevPrices.current[q.symbol] = q.current
            })
            if (Object.keys(dirs).length) setFlashDir(dirs)
            setQuotes(list)
          })
        }).catch(function (e) {
          setErr(String((e && e.message) || e))
        })
      }

      function refreshContent() {
        Promise.all([
          call('hot', { market: hotMarket, size: 10 }),
          call('news', { count: 20 })
        ]).then(function (res) {
          setHot((res[0] && res[0].list) || [])
          setNews((res[1] && res[1].items) || [])
          setNewsMore(false)
          setNewsNoMore(false)
          setErr('')
        }).catch(function (e) {
          setErr(String((e && e.message) || e))
        })
      }

      // 快讯翻页：max_id = 当前最旧一条 id，返回严格更早的记录
      function loadMoreNews() {
        if (newsMore || newsNoMore || !news.length) return
        const maxId = news[news.length - 1].id
        setNewsMore(true)
        call('news', { count: 20, max_id: maxId }).then(function (res) {
          const items = (res && res.items) || []
          const seen = {}
          news.forEach(function (it) { seen[it.id] = true })
          const fresh = items.filter(function (it) { return !seen[it.id] })
          if (!fresh.length) setNewsNoMore(true)
          else setNews(news.concat(fresh))
          setNewsMore(false)
        }).catch(function () {
          setNewsMore(false)
        })
      }

      React.useEffect(function () {
        setLoading(true)
        call('login.status', {}).then(function (d) { setLoginSt(d || { loggedIn: false }) }).catch(function () { setLoginSt({ loggedIn: false }) })
        refreshMarket().then(function () { return refreshContent() })
          .then(function () { setLoading(false) })
          .catch(function () { setLoading(false) })
        return function () { /* 一次性 */ }
      }, [])

      React.useEffect(function () {
        const marketMs = marketOpen ? 20000 : 60000
        const contentMs = marketOpen ? 60000 : 180000
        // 页面隐藏时暂停轮询（省请求、降低风控概率），回到前台立即刷新一次
        const stopA = ctx.interval(function () { if (!pageHidden()) refreshMarket() }, marketMs)
        const stopB = ctx.interval(function () { if (!pageHidden()) refreshContent() }, contentMs)
        function onVis() {
          if (!pageHidden()) { refreshMarket(); refreshContent() }
        }
        try { document.addEventListener('visibilitychange', onVis) } catch (e) { /* ignore */ }
        return function () {
          if (stopA) stopA(); if (stopB) stopB()
          try { document.removeEventListener('visibilitychange', onVis) } catch (e) { /* ignore */ }
        }
      }, [marketOpen])

      React.useEffect(function () {
        if (!view) { setDetail(null); return }
        let alive = true
        setDetail(null)
        function fb(p) { return p.catch(function () { return null }) }
        // 渐进渲染：报价+K线先上屏，分时/财务/KOL 到达后补充，避免等齐才显示
        const pQuote = fb(call('quoteDetail', { symbol: view }))
        const pKline = fb(call('kline', { symbol: view, period: klinePeriod, count: 120 }))
        const pMinute = fb(call('minute', { symbol: view }))
        const pFinance = fb(call('finance', { symbol: view }))
        const pKol = fb(call('kol', { symbol: view, count: 6 }))
        Promise.all([pQuote, pKline]).then(function (res) {
          if (!alive) return
          setDetail({
            quote: (res[0] && res[0].quote) || {},
            kline: res[1] || { rows: [] },
            minute: { items: [], last_close: null },
            finance: { list: [] },
            kol: []
          })
          if (!res[0]) setErr('详情加载失败，数据可能不完整')
          // 其余部分到达后增量合并
          pMinute.then(function (m) { if (alive && m) setDetail(function (d) { return d ? Object.assign({}, d, { minute: m }) : d }) })
          pFinance.then(function (f) { if (alive && f) setDetail(function (d) { return d ? Object.assign({}, d, { finance: f }) : d }) })
          pKol.then(function (k) { if (alive && k) setDetail(function (d) { return d ? Object.assign({}, d, { kol: k.list || [] }) : d }) })
        }).catch(function (e) {
          if (alive) setErr(String((e && e.message) || e))
        })
        return function () { alive = false }
      }, [view, klinePeriod])

      // Esc：先关详情，再收起面板（输入框内不触发）
      React.useEffect(function () {
        if (typeof window === 'undefined' || !window.addEventListener) return function () {}
        function onKey(e) {
          if (e.key !== 'Escape') return
          const t = e.target
          if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return
          if (loginOpen) setLoginOpen(false)
          else if (view) setView(null)
          else ui.set({ open: false })
        }
        window.addEventListener('keydown', onKey)
        return function () { window.removeEventListener('keydown', onKey) }
      }, [view, loginOpen])

      function openDetail(symbol) {
        setChartMode('kline')
        setKlinePeriod('day')
        setView(symbol)
      }

      function addWatch(symbol) {
        call('watchlist.add', { symbol: symbol }).then(function (data) {
          setWatchlist((data && data.symbols) || [])
          refreshMarket()
        }).catch(function (e) { setErr(String((e && e.message) || e)) })
      }

      function removeWatch(symbol) {
        call('watchlist.remove', { symbol: symbol }).then(function (data) {
          setWatchlist((data && data.symbols) || [])
          setQuotes(quotes.filter(function (q) { return q.symbol !== symbol }))
        }).catch(function (e) { setErr(String((e && e.message) || e)) })
      }

      function doSearch() {
        const q = searchQ.trim()
        if (!q) return
        setSearching(true)
        const p = searchMode === 'stock'
          ? call('search', { q: q, count: 8 })
          : call('searchPosts', { q: q, count: 10 })
        p.then(function (data) {
          setSearchRes((data && data.list) || [])
        }).catch(function (e) {
          setErr(String((e && e.message) || e))
          setSearchRes([])
        }).then(function () { setSearching(false) })
      }

      function addManual() {
        const code = manualCode.trim().toUpperCase()
        if (!code) return
        addWatch(code)
        setManualCode('')
      }

      // ---- 可选登录 ----
      function doLogin() {
        const c = cookieInput.trim()
        if (!c) { setLoginMsg({ ok: false, text: '请先粘贴 Cookie' }); return }
        setLoginBusy(true)
        setLoginMsg(null)
        call('login.save', { cookie: c }).then(function (d) {
          setLoginSt({ loggedIn: true, screenName: (d && d.screenName) || '', uid: d ? d.uid : null })
          setLoginMsg({ ok: true, text: '登录成功' + ((d && d.screenName) ? '：' + d.screenName : '') + (d && d.symbols ? '，已同步云端自选 ' + d.symbols.length + ' 只' : '') })
          setCookieInput('')
          setLoginOpen(false)
          refreshMarket()
        }).catch(function (e) {
          setLoginMsg({ ok: false, text: String((e && e.message) || e) })
        }).then(function () { setLoginBusy(false) })
      }

      function doLogout() {
        setLoginBusy(true)
        call('login.logout', {}).then(function () {
          setLoginSt({ loggedIn: false })
          setLoginMsg({ ok: true, text: '已退出登录（本地自选股保留）' })
        }).catch(function (e) {
          setLoginMsg({ ok: false, text: String((e && e.message) || e) })
        }).then(function () { setLoginBusy(false) })
      }

      function doPull() {
        setLoginBusy(true)
        setLoginMsg(null)
        call('watchlist.pull', {}).then(function (d) {
          setLoginMsg({ ok: true, text: '已同步云端自选 ' + (((d && d.symbols) || []).length) + ' 只' })
          refreshMarket()
        }).catch(function (e) {
          setLoginMsg({ ok: false, text: String((e && e.message) || e) })
        }).then(function () { setLoginBusy(false) })
      }

      function LoginBox() {
        const loggedIn = !!(login && login.loggedIn)
        return el('div', { className: 'xq-login' }, [
          el('div', { key: 'hd', className: 'xq-login-hd' }, loggedIn ? '雪球账号 · 已登录' : '登录雪球（可选）'),
          loggedIn
            ? el('div', { key: 'u', className: 'xq-login-user' }, [
                '当前账号：', el('b', { key: 'b' }, login.screenName || ('uid ' + (login.uid || '?'))),
                el('span', { key: 'c', className: 'xq-acc-mark' }, ' · 云端自选股已启用，加/删自选会尽力同步')
              ])
            : el('div', { key: 'tip', className: 'xq-login-tip' }, [
                '不登录也能用（匿名模式，自选股存本地）。登录后可直接使用', el('b', { key: 'b' }, '你在雪球的云端自选股'),
                el('ol', { key: 'ol' }, [
                  el('li', { key: '1' }, ['浏览器打开 ', el('a', { key: 'a', href: 'https://xueqiu.com', target: '_blank', rel: 'noreferrer' }, 'xueqiu.com'), ' 并登录']),
                  el('li', { key: '2' }, 'F12 开发者工具 → Network → 刷新页面，任选一个 xueqiu.com 请求'),
                  el('li', { key: '3' }, 'Request Headers 里找到 Cookie: 一行，整行复制粘贴到下面'),
                  el('li', { key: '4' }, 'Cookie 仅保存在本机插件目录，不上传任何第三方')
                ])
              ]),
          login && login.expired
            ? el('div', { key: 'ex', className: 'xq-login-msg xq-login-bad' }, 'Cookie 已过期，请按上面步骤重新获取')
            : null,
          loggedIn ? null : el('textarea', {
            key: 'ta',
            placeholder: '粘贴 Cookie 整行，例如 xq_a_token=...; xq_id_token=...; u=...; device_id=...',
            value: cookieInput,
            onChange: function (e) { setCookieInput(e.target.value) }
          }),
          loginMsg ? el('div', { key: 'msg', className: 'xq-login-msg ' + (loginMsg.ok ? 'xq-login-ok' : 'xq-login-bad') }, loginMsg.text) : null,
          el('div', { key: 'row', className: 'xq-login-row' }, [
            loggedIn
              ? el('button', { key: 'pull', className: 'xq-btn', disabled: loginBusy, onClick: doPull }, '同步云端自选')
              : el('button', { key: 'ok', className: 'xq-btn xq-acc-on', disabled: loginBusy, onClick: doLogin }, loginBusy ? '校验中…' : '登录'),
            loggedIn
              ? el('button', { key: 'out', className: 'xq-btn', disabled: loginBusy, onClick: doLogout }, '退出登录')
              : null,
            el('button', { key: 'close', className: 'xq-btn-mini', disabled: loginBusy, onClick: function () { setLoginOpen(false); setLoginMsg(null) } }, '关闭')
          ])
        ])
      }

      const tabs = el('div', { className: 'xq-tabs' }, [
        ['market', '行情'], ['hot', '热榜'], ['search', '搜索'], ['news', '快讯']
      ].map(function (t) {
        return el('button', {
          key: t[0], className: 'xq-tab' + (tab === t[0] ? ' xq-tab-active' : ''),
          onClick: function () { setTab(t[0]); if (view) setView(null) }
        }, t[1])
      }).concat([
        el('span', { key: 'sp', className: 'xq-spacer' }),
        el('button', {
          key: 'acc', className: 'xq-btn xq-acc-btn' + (login && login.loggedIn ? ' xq-acc-on' : ''),
          title: login && login.loggedIn ? '已登录：' + (login.screenName || login.uid || '') + '（点击管理）' : '可选：登录雪球后使用云端自选股',
          onClick: function () { setLoginMsg(null); setLoginOpen(true) }
        }, login && login.loggedIn ? '👤 ' + (login.screenName || '已登录') : '👤 登录'),
        el('button', {
          key: 'btn', className: 'xq-btn', disabled: loading, title: '刷新全部数据',
          onClick: function () {
            setLoading(true)
            Promise.all([refreshMarket(), refreshContent()]).then(function () { setLoading(false) }).catch(function () { setLoading(false) })
          }
        }, loading ? [el('span', { key: 's', className: 'xq-refresh-spin' }, '⟳'), ' 刷新中'] : '刷新')
      ]))

      const errBox = err ? el('div', { className: 'xq-err' }, err) : null

      function MarketTab() {
        const sorted = quotes.slice()
        if (sortK !== 'default') {
          sorted.sort(function (a, b) {
            const av = Number(a[sortK]), bv = Number(b[sortK])
            const an = isFinite(av) ? av : -Infinity
            const bn = isFinite(bv) ? bv : -Infinity
            return sortAsc ? an - bn : bn - an
          })
        }
        function sortBy(k) {
          if (sortK === k) setSortAsc(!sortAsc)
          else { setSortK(k); setSortAsc(false) }
        }
        function arrow(k) { return sortK === k ? (sortAsc ? ' ▲' : ' ▼') : '' }
        const idxKids = indices.map(function (q) {
          return el('div', {
            key: q.symbol, className: 'xq-idx-card', title: '查看 ' + (q.name || q.symbol) + ' 详情',
            onClick: function () { openDetail(q.symbol) }
          }, [
            el('div', { key: 'n', className: 'xq-idx-name' }, q.name),
            el('div', { key: 'r', className: 'xq-idx-row' }, [
              el('span', { key: 'c', className: 'xq-idx-cur ' + colorOf(q.percent) }, fmt(q.current)),
              el('span', { key: 'p', className: 'xq-idx-pct xq-pct-chip ' + colorOf(q.percent) }, fmtPct(q.percent))
            ])
          ])
        })
        const rows = sorted.map(function (q) {
          return el('div', { key: q.symbol, className: 'xq-grid-row', onClick: function () { openDetail(q.symbol) } }, [
            el('div', { key: 'n' }, [
              el('div', { key: 'a', className: 'xq-name' }, q.name),
              el('div', { key: 'b', className: 'xq-sub' }, q.symbol)
            ]),
            el('div', { key: 'c', className: colorOf(q.percent) + (flashDir[q.symbol] === 1 ? ' xq-flash-up' : flashDir[q.symbol] === -1 ? ' xq-flash-down' : '') }, fmt(q.current)),
            el('div', { key: 'p' }, el('span', { key: 'pp', className: 'xq-pct-chip ' + colorOf(q.percent) }, fmtPct(q.percent))),
            el('div', { key: 'v', className: 'xq-sub' }, fmtVol(q.volume)),
            el('div', { key: 'a2', className: 'xq-actions' }, [
              el('button', { key: 'd', className: 'xq-btn-mini', onClick: function (e) { e.stopPropagation(); openDetail(q.symbol) } }, '详情'),
              el('button', { key: 'r', className: 'xq-btn-mini', title: '移除自选', onClick: function (e) { e.stopPropagation(); removeWatch(q.symbol) } }, '×')
            ])
          ])
        })
        return el('div', null, [
          el('div', { key: 'idx', className: 'xq-idx' }, idxKids),
          el('div', { key: 'wl', className: 'xq-grid' }, [
            el('div', { key: 'h', className: 'xq-grid-hd' }, [
              el('span', { key: 'c0' }, '名称'),
              el('span', { key: 'c1', className: 'xq-sort-h' + (sortK === 'current' ? ' xq-sort-on' : ''), onClick: function () { sortBy('current') } }, '现价' + arrow('current')),
              el('span', { key: 'c2', className: 'xq-sort-h' + (sortK === 'percent' ? ' xq-sort-on' : ''), onClick: function () { sortBy('percent') } }, '涨跌幅' + arrow('percent')),
              el('span', { key: 'c3' }, '成交量'),
              el('span', { key: 'c4' }, '操作')
            ]),
            rows.length ? rows : el('div', { key: 'empty', className: 'xq-grid-row' }, el('span', { key: 'e', className: 'xq-muted' }, '自选股为空，去「搜索」或下方添加'))
          ]),
          el('div', { key: 'add', className: 'xq-search-row' }, [
            el('input', {
              key: 'i', className: 'xq-input', placeholder: '添加代码，如 SH600519 / 00700 / AAPL',
              value: manualCode,
              onChange: function (e) { setManualCode(e.target.value) },
              onKeyDown: function (e) { if (e.key === 'Enter') addManual() }
            }),
            el('button', { key: 'b', className: 'xq-btn', onClick: addManual }, '添加')
          ])
        ])
      }

      function DetailView() {
        if (!detail) return el('div', { className: 'xq-loading' }, '加载中…')
        const q = detail.quote || {}
        const kl = detail.kline || { rows: [] }
        const mn = detail.minute || { items: [], last_close: null }
        const fin = detail.finance || { list: [] }
        const kol = detail.kol || []
        const firstFin = fin.list && fin.list.length ? fin.list[0] : null
        const stats = [
          ['今开', fmt(q.open)], ['昨收', fmt(q.last_close)], ['最高', fmt(q.high)], ['最低', fmt(q.low)],
          ['成交量', fmtVol(q.volume)], ['成交额', fmtBig(q.amount)], ['换手率', fmt(q.turnover_rate) + '%'], ['振幅', fmt(q.amplitude) + '%'],
          ['总市值', fmtBig(q.market_capital)], ['流通市值', fmtBig(q.float_market_capital)], ['量比', fmt(q.volume_ratio)], ['PE(TTM)', fmt(q.pe_ttm)],
          ['PB', fmt(q.pb)], ['股息率', fmt(q.dividend_yield) + '%'], ['52周高', fmt(q.high52w)], ['52周低', fmt(q.low52w)]
        ]
        const finStats = firstFin ? [
          ['ROE', fmt(firstFin.avg_roe) + '%'], ['EPS', fmt(firstFin.basic_eps)],
          ['毛利率', fmt(firstFin.gross_selling_rate) + '%'], ['净利率', fmt(firstFin.net_selling_rate) + '%'],
          ['营收同比', fmt(firstFin.operating_income_yoy) + '%'], ['净利同比', fmt(firstFin.net_profit_atsopc_yoy) + '%'],
          ['资产负债率', fmt(firstFin.asset_liab_ratio) + '%'], ['每股现金流', fmt(firstFin.operate_cash_flow_ps)]
        ] : []
        const kolKids = kol.map(function (u) {
          return el('span', { key: u.id, className: 'xq-kol-chip' }, [
            u.screen_name || ('用户' + u.id),
            u.verified ? el('span', { key: 'v', className: 'xq-verif' }, '✓') : null,
            ' · ' + fmtBig(u.followers_count) + '粉'
          ])
        })
        return el('div', null, [
          el('div', { key: 'h', className: 'xq-detail-head' }, [
            el('button', { key: 'b', className: 'xq-btn-mini', onClick: function () { setView(null) } }, '← 返回'),
            el('span', { key: 'n', className: 'xq-detail-name' }, q.name || view),
            el('span', { key: 'c', className: 'xq-detail-code' }, view),
            el('span', { key: 'sp', className: 'xq-spacer' }),
            el('span', { key: 'cur', className: 'xq-detail-cur ' + colorOf(q.percent) }, fmt(q.current)),
            el('span', { key: 'pct', className: 'xq-detail-pct ' + colorOf(q.percent) }, fmtPct(q.percent))
          ]),
          el('div', { key: 'st', className: 'xq-stats' }, stats.map(function (s, i) {
            return el('div', { key: i, className: 'xq-stat' }, [
              el('div', { key: 'k', className: 'xq-stat-k' }, s[0]),
              el('div', { key: 'v', className: 'xq-stat-v' }, s[1])
            ])
          })),
          el('div', { key: 'kl', className: 'xq-card' }, [
            el('div', { key: 't', className: 'xq-card-t' }, [
              el('span', { key: 't' }, '走势'),
              el('span', { key: 'modes', className: 'xq-modes' }, [
                el('button', { key: 'k', className: chartMode === 'kline' ? 'xq-on' : '', onClick: function () { setChartMode('kline') } }, 'K线'),
                el('button', { key: 'm', className: chartMode === 'minute' ? 'xq-on' : '', onClick: function () { setChartMode('minute') } }, '分时')
              ]),
              el('span', { key: 'sp', className: 'xq-spacer' }),
              chartMode === 'kline' ? el('span', { key: 'pd', className: 'xq-periods' }, (function () {
                const ps = ['5m', '15m', '30m', '60m', 'day', 'week', 'month']
                const lb = { '5m': '5分', '15m': '15分', '30m': '30分', '60m': '60分', day: '日K', week: '周K', month: '月K' }
                return ps.map(function (p) {
                  return el('button', {
                    key: p, className: klinePeriod === p ? 'xq-on' : '',
                    onClick: function () { setKlinePeriod(p) }
                  }, lb[p] || p)
                })
              })()) : null
            ]),
            chartMode === 'kline'
              ? el(KlineChart, { key: 'c', rows: kl.rows })
              : el(MinuteChart, { key: 'c', items: mn.items, lastClose: mn.last_close })
          ]),
          firstFin ? el('div', { key: 'fin', className: 'xq-card' }, [
            el('div', { key: 't', className: 'xq-card-t' }, '财务指标 · ' + (firstFin.report_name || '')),
            el('div', { key: 'g', className: 'xq-stats' }, finStats.map(function (s, i) {
              return el('div', { key: i, className: 'xq-stat' }, [
                el('div', { key: 'k', className: 'xq-stat-k' }, s[0]),
                el('div', { key: 'v', className: 'xq-stat-v' }, s[1])
              ])
            }))
          ]) : null,
          kolKids.length ? el('div', { key: 'kol', className: 'xq-card' }, [
            el('div', { key: 't', className: 'xq-card-t' }, '热议用户'),
            el('div', { key: 'l', className: 'xq-kol' }, kolKids)
          ]) : null
        ])
      }

      function HotTab() {
        const markets = [['cn', 'A股'], ['us', '美股'], ['hk', '港股'], ['global', '全球']]
        return el('div', null, [
          el('div', { key: 'seg', className: 'xq-seg', style: { marginBottom: 8 } }, markets.map(function (m) {
            return el('button', {
              key: m[0], className: hotMarket === m[0] ? 'xq-seg-on' : '',
              onClick: function () {
                setHotMarket(m[0])
                call('hot', { market: m[0], size: 10 }).then(function (data) {
                  setHot((data && data.list) || [])
                }).catch(function (e) { setErr(String((e && e.message) || e)) })
              }
            }, m[1])
          })),
          el('div', { key: 'list', className: 'xq-grid' }, hot.map(function (it, i) {
            return el('div', { key: it.symbol, className: 'xq-hot-row', onClick: function () { openDetail(it.symbol) } }, [
              el('span', { key: 'r', className: 'xq-rank' }, String(i + 1)),
              el('div', { key: 'n' }, [
                el('div', { key: 'a', className: 'xq-name' }, it.name),
                el('div', { key: 'b', className: 'xq-sub' }, it.symbol)
              ]),
              el('span', { key: 'sp', className: 'xq-spacer' }),
              el('span', { key: 'c', className: colorOf(it.percent) }, fmt(it.current)),
              el('span', { key: 'p', className: colorOf(it.percent) }, fmtPct(it.percent)),
              el('button', { key: 'd', className: 'xq-btn-mini', onClick: function (e) { e.stopPropagation(); openDetail(it.symbol) } }, '详情')
            ])
          }))
        ])
      }

      function SearchTab() {
        const isPost = searchMode === 'post'
        const resKids = searchRes.map(function (r) {
          const title = isPost ? (r.title || '') : r.name
          const sub = isPost ? ((r.user ? r.user.screen_name + ' · ' : '') + fmtBig(r.view_count) + '阅读') : (r.code || '')
          const desc = isPost ? String(r.text || '').slice(0, 60) : sub
          return el('div', { key: String(r.id || r.code), className: 'xq-grid-row' }, [
            el('div', { key: 'n' }, [
              el('div', { key: 'a', className: 'xq-name' }, title || '（无标题）'),
              el('div', { key: 'b', className: 'xq-sub' }, desc)
            ]),
            el('div', { key: 'c', className: 'xq-sub' }, sub),
            el('div', { key: 'p', className: 'xq-sub' }, isPost ? fmtDay(r.created_at) : ''),
            el('div', { key: 'a2', className: 'xq-actions' }, isPost
              ? null
              : [
                el('button', { key: 'd', className: 'xq-btn-mini', onClick: function () { openDetail(r.code) } }, '详情'),
                el('button', { key: 'w', className: 'xq-btn-mini', onClick: function () { addWatch(r.code) } }, '加自选')
              ])
          ])
        })
        return el('div', null, [
          el('div', { key: 'row', className: 'xq-search-row' }, [
            el('input', {
              key: 'i', className: 'xq-input', placeholder: searchMode === 'stock' ? '搜索股票，如「茅台」' : '搜索帖子，如「段永平」',
              value: searchQ,
              onChange: function (e) { setSearchQ(e.target.value) },
              onKeyDown: function (e) { if (e.key === 'Enter') doSearch() }
            }),
            el('button', { key: 'b', className: 'xq-btn', disabled: searching, onClick: doSearch }, searching ? '搜索中…' : '搜索')
          ]),
          el('div', { key: 'seg', className: 'xq-seg', style: { marginBottom: 8 } }, [
            el('button', { key: 's', className: searchMode === 'stock' ? 'xq-seg-on' : '', onClick: function () { setSearchMode('stock'); setSearchRes([]) } }, '股票'),
            el('button', { key: 'p', className: searchMode === 'post' ? 'xq-seg-on' : '', onClick: function () { setSearchMode('post'); setSearchRes([]) } }, '帖子')
          ]),
          searchRes.length ? el('div', { key: 'res', className: 'xq-grid' }, [
            el('div', { key: 'h', className: 'xq-grid-hd' }, ['结果', '', '', ''].map(function (t, i) { return el('span', { key: i }, t) })),
            resKids
          ]) : el('div', { key: 'tip', className: 'xq-muted' }, '输入关键词搜索，回车或点搜索')
        ])
      }

      function NewsTab() {
        // 时间轴：按「今天/昨天/M月D日」分组，每组一个锚点头
        const kids = []
        let lastDay = null
        news.forEach(function (it) {
          const d = new Date(it.created_at)
          const now = new Date()
          const sameDay = function (a, b) { return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate() }
          const yest = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1)
          let label = null
          const dayKey = d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate()
          if (dayKey !== lastDay) {
            lastDay = dayKey
            label = sameDay(d, now) ? '今天' : (sameDay(d, yest) ? '昨天' : (d.getMonth() + 1) + '月' + d.getDate() + '日')
          }
          if (label) kids.push(el('div', { key: 'g' + dayKey, className: 'xq-news-group' }, label))
          kids.push(el('div', { key: String(it.id), className: 'xq-news-item' + (it.mark === 1 ? ' xq-important' : '') }, [
            el('div', { key: 't' }, it.text),
            el('div', { key: 'm', className: 'xq-news-time' }, fmtTime(it.created_at) + (it.mark === 1 ? ' · 重要' : ''))
          ]))
        })
        // 滚动到底自动加载；手动入口兜底（滚轮惯性/触控板场景）
        kids.push(el('div', {
          key: 'more',
          className: 'xq-news-more',
          onClick: function () { loadMoreNews() }
        }, newsMore ? '加载中…' : (newsNoMore ? '没有更早的快讯了' : '加载更早 ↑')))
        return news.length
          ? el('div', {
              className: 'xq-news xq-news-tl',
              onScroll: function (e) {
                const n = e.target
                if (n.scrollTop + n.clientHeight >= n.scrollHeight - 40) loadMoreNews()
              }
            }, kids)
          : el('div', { className: 'xq-muted' }, '暂无快讯')
      }

      let content
      if (loginOpen) {
        content = LoginBox()
      } else if (view) {
        content = DetailView()
      } else if (tab === 'market') {
        content = MarketTab()
      } else if (tab === 'hot') {
        content = HotTab()
      } else if (tab === 'search') {
        content = SearchTab()
      } else {
        content = NewsTab()
      }

      // key 变化触发 xq-fade-in 重放：tab/详情切换有轻微淡入
      return el('div', null, [tabs, errBox, el('div', { key: 'v-' + (loginOpen ? 'login' : (view ? 'd' : tab)), className: 'xq-view' }, content)])
    }

    // ---------- 嵌入式主面板（conversation.input.dock）：输入框上方一整行 ----------
    // DockGate 常驻挂载：负责 hydrate + 订阅 ui，open=false 时渲染 null。
    // 不能把开关写在槽位 render 闭包里——槽位函数不会因 ui 变化而重新执行。
    function DockGate() {
      const [, force] = React.useState(0)
      React.useEffect(function () {
        let alive = true
        call('ui.get', {}).then(function (d) {
          if (!alive) return
          if (d && d.tab) ui.set({ tab: d.tab })
          if (d && typeof d.open === 'boolean') ui.set({ open: d.open })
          if (d && d.badgePos && isFinite(Number(d.badgePos.x)) && isFinite(Number(d.badgePos.y))) {
            // 恢复位置时钳制到当前视口内（视口缩小/分辨率变化后防止徽章落到屏幕外）
            const vp = viewport()
            const maxX = (vp ? vp.w : 1200) - 140
            const maxY = (vp ? vp.h : 800) - 60
            ui.set({ badgePos: {
              x: Math.min(Math.max(4, Number(d.badgePos.x)), Math.max(4, maxX)),
              y: Math.min(Math.max(4, Number(d.badgePos.y)), Math.max(4, maxY))
            } })
          }
          if (d && typeof d.dockH === 'number' && isFinite(d.dockH)) {
            ui.set({ dockH: d.dockH })
          }
          if (d && typeof d.badgeW === 'number' && isFinite(d.badgeW)) {
            ui.set({ badgeW: d.badgeW })
          }
          ui.set({ hydrated: true })
        }).catch(function () { ui.set({ hydrated: true }) })
        const off = ui.subscribe(function () { force(function (x) { return x + 1 }) })
        return function () { alive = false; off() }
      }, [])
      if (!ui.hydrated || !ui.open) return null
      return el(DockPanel, null)
    }

    function DockPanel() {
      const [, force] = React.useState(0)
      const [tick, setTick] = React.useState(0)
      React.useEffect(function () {
        const off = ui.subscribe(function () { if (ui.hydrated) saveUi(); force(function (x) { return x + 1 }) })
        return off
      }, [])
      // 每分钟重算一次交易时段提示
      React.useEffect(function () {
        const stop = ctx.interval(function () { setTick(function (x) { return x + 1 }) }, 60000)
        return function () { if (stop) stop() }
      }, [])
      function onDown(e) {
        if (e.pointerType === 'mouse' && e.button !== 0) return
        dockResize.active = true
        dockResize.startY = e.clientY
        dockResize.startH = ui.dockH || defaultDockH()
        // 拖动期间直改 DOM（不触发 React 重渲染），松手才提交一次状态
        try {
          const dock = e.currentTarget.closest('.xq-dock')
          dockResize.body = dock ? dock.querySelector('.xq-dock-body') : null
          if (dockResize.body) dockResize.body.style.transition = 'none'
          document.body.style.cursor = 'ns-resize'
          document.body.style.userSelect = 'none'
        } catch (err) { /* ignore */ }
        try { e.currentTarget.setPointerCapture(e.pointerId) } catch (err) { /* ignore */ }
      }
      function onMove(e) {
        if (!dockResize.active || !dockResize.body) return
        const vp = viewport()
        const maxH = Math.round((vp ? vp.h : 800) * 0.85)
        let h = dockResize.startH + (e.clientY - dockResize.startY)
        h = Math.min(Math.max(160, h), Math.min(maxH, 1200))
        dockResize.h = h
        dockResize.body.style.height = h + 'px'   // 直接写样式，逐帧零渲染
      }
      function onUp(e) {
        if (dockResize.active && dockResize.body) {
          dockResize.body.style.transition = ''
          dockResize.body.style.height = ''
          document.body.style.cursor = ''
          document.body.style.userSelect = ''
          if (dockResize.h) ui.set({ dockH: dockResize.h })   // 松手一次性提交
        }
        dockResize.active = false
        dockResize.h = 0
        try { if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId) } catch (err) { /* ignore */ }
      }
      function defaultDockH() {
        try { if (typeof window !== 'undefined' && window.innerHeight) return Math.round(window.innerHeight * 0.52) } catch (e) { /* ignore */ }
        return 420
      }
      const bodyStyle = ui.dockH ? { height: ui.dockH + 'px' } : null
      return el('div', { className: 'xq-dock' }, [
        el('div', { key: 'head', className: 'xq-dock-head' }, [
          el('span', { key: 'logo', className: 'xq-logo' }, [el('b', { key: 'b' }, '雪球'), ' mini']),
          el('span', { key: 'st', className: 'xq-status', title: 'A股/港股/美股交易时段（本地时区推算，不含节假日）' }, sessionsText() || '行情面板'),
          el('span', { key: 'hint', className: 'xq-update' }, '已嵌入输入框上方 · Esc 收起'),
          el('span', { key: 'sp', className: 'xq-spacer' }),
          el('button', { key: 'min', className: 'xq-btn-mini', title: '收起（点右下角徽章重新打开）', onClick: function () { ui.set({ open: false }) } }, '收起 —')
        ]),
        el('div', { key: 'body', className: 'xq-dock-body', style: bodyStyle }, [
          el(XueqiuPanel, { key: 'panel' })
        ]),
        el('div', {
          key: 'rs', className: 'xq-dock-resize', title: '拖动调整面板高度（双击复位）',
          onPointerDown: onDown, onPointerMove: onMove, onPointerUp: onUp, onPointerCancel: onUp,
          onDoubleClick: function () { ui.set({ dockH: null }) }
        }, [el('span', { key: 'g' }, null)])
      ])
    }

    // ---------- 迷你悬浮徽章（shell.overlay）：可拖动、右下角手柄调宽度 ----------
    // 形态 C：默认区域模式（320px 宽，前 12 只自选静态平铺换行）；⤡ 手柄可调宽 120–480px，双击复位 320。
    // 悬停弹层已砍掉：速览靠拉宽徽章，完整功能点徽章开面板。
    function MiniBadge() {
      const [idx, setIdx] = React.useState([])
      const [top, setTop] = React.useState([])
      const [mOpen, setMOpen] = React.useState(true)
      const [, force] = React.useState(0)

      React.useEffect(function () {
        let alive = true
        function refresh() {
          if (pageHidden()) return   // 页面隐藏时暂停徽章轮询
          call('quote', { symbols: ['SH000001', 'SZ399001', 'SZ399006', 'SH000688'] }).then(function (data) {
            if (!alive) return
            setIdx((data && data.list) || [])
            const st = data ? data.status : null
            setMOpen(st === 5 || st === 6)
          }).catch(function () { /* 静默失败 */ })
          // 徽章主体：自选前 12 只（轮动素材 / 平铺内容）；自选为空回退指数
          call('watchlist.get', {}).then(function (wl) {
            if (!alive) return
            const symbols = ((wl && wl.symbols) || []).slice(0, 12)
            if (!symbols.length) { setTop([]); return }
            return call('quote', { symbols: symbols }).then(function (data) {
              if (alive) setTop((data && data.list) || [])
            })
          }).catch(function () { /* 静默失败：保留指数 */ })
        }
        function onVis() { if (!pageHidden()) refresh() }
        refresh()
        const stop = ctx.interval(refresh, 30000)
        const off = ui.subscribe(function () { force(function (x) { return x + 1 }) })
        try { document.addEventListener('visibilitychange', onVis) } catch (e) { /* ignore */ }
        return function () {
          alive = false; if (stop) stop(); off()
          try { document.removeEventListener('visibilitychange', onVis) } catch (e) { /* ignore */ }
        }
      }, [])

      function onDown(e) {
        if (e.pointerType === 'mouse' && e.button !== 0) return
        badgeDrag = { x: e.clientX, y: e.clientY }
        badgeMoved = false
        try { e.currentTarget.setPointerCapture(e.pointerId) } catch (err) { /* ignore */ }
      }
      function onMove(e) {
        if (!badgeDrag) return
        const dx = e.clientX - badgeDrag.x, dy = e.clientY - badgeDrag.y
        if (Math.abs(dx) + Math.abs(dy) > 4) badgeMoved = true
        if (!badgeMoved) return
        const vp = viewport()
        const w = e.currentTarget.offsetWidth || 160
        const h = e.currentTarget.offsetHeight || 30
        let x = e.clientX - w / 2
        let y = e.clientY - h / 2
        x = Math.min(Math.max(4, x), (vp ? vp.w : 1200) - w - 4)
        y = Math.min(Math.max(4, y), (vp ? vp.h : 800) - h - 4)
        badgeDrag.x = x + w / 2
        badgeDrag.y = y + h / 2
        badgeDrag.pos = { x: x, y: y }
        e.currentTarget.style.left = x + 'px'
        e.currentTarget.style.top = y + 'px'
        e.currentTarget.style.right = 'auto'
        e.currentTarget.style.bottom = 'auto'
      }
      function onUp(e) {
        const moved = badgeMoved
        const pos = badgeDrag ? badgeDrag.pos : null
        badgeDrag = null
        badgeMoved = false
        try { if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId) } catch (err) { /* ignore */ }
        if (!moved) { ui.set({ open: !ui.open }); return }
        if (pos) ui.set({ badgePos: pos })   // 松手一次性提交
      }

      // ---- 宽度调节手柄：横向拖动改变徽章宽度（120–480px），松手持久化；双击复位为单行条 ----
      const gripDrag = React.useRef(null)
      function onGripDown(e) {
        if (e.pointerType === 'mouse' && e.button !== 0) return
        e.stopPropagation()   // 不触发徽章移动
        try { e.currentTarget.setPointerCapture(e.pointerId) } catch (err) { /* ignore */ }
        const base = ui.badgeW || (e.currentTarget.parentElement ? e.currentTarget.parentElement.offsetWidth : 200)
        gripDrag.current = { startX: e.clientX, baseW: base }
      }
      function onGripMove(e) {
        if (!gripDrag.current) return
        e.stopPropagation()
        const vp = viewport()
        const maxW = Math.min(480, (vp ? vp.w : 1200) - 24)
        const w = Math.min(Math.max(120, gripDrag.current.baseW + (e.clientX - gripDrag.current.startX)), maxW)
        ui.set({ badgeW: w })   // 拖动过程实时反馈（内存态，松手才落盘）
      }
      function onGripUp(e) {
        if (!gripDrag.current) return
        e.stopPropagation()
        gripDrag.current = null
        try { if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId) } catch (err) { /* ignore */ }
        saveUi()   // 落盘（debounce）
      }
      function onGripDblClick(e) {
        e.stopPropagation()
        ui.set({ badgeW: null })   // 复位为默认区域宽度（320px）
        saveUi()
      }


      // 默认区域模式：自选静态平铺（badgeW 未设置时用默认宽 320px；双击手柄回到 320 而非单行）
      const wide = true
      const effW = (ui.badgeW !== null && ui.badgeW !== undefined) ? ui.badgeW : 320
      // 区域模式：前 12 只全部平铺（换行）；单行模式：轮动页（页码指示）
      function wItem(q) {
        return el('span', { key: 'w-' + q.symbol, className: 'xq-witem', title: (q.name || q.symbol) + ' ' + fmt(q.current) + (q.percent !== undefined ? '  ' + fmtPct(q.percent) : '') }, [
          el('span', { key: 'n', className: 'xq-badge-hint' }, (q.name || q.symbol) + ' '),
          el('span', { key: 'p', className: 'xq-badge-val ' + colorOf(q.percent) }, fmtPct(q.percent))
        ])
      }
      // 指数区：4 指数两列（上证 深证 创业 科创50），有自选时作为区域头部，无自选时即主体
      function idxRow(q) {
        return el('span', { key: 'ix-' + q.symbol, className: 'xq-idxrow', title: (q.name || q.symbol) + ' ' + fmt(q.current) }, [
          el('span', { key: 'n', className: 'xq-badge-hint' }, (q.name || q.symbol)),
          el('span', { key: 'p', className: 'xq-badge-val ' + colorOf(q.percent) }, fmtPct(q.percent))
        ])
      }
      const idxEls = el('div', { key: 'idx', className: 'xq-idxgrid' }, idx.map(idxRow))
      const bodyEls = top.length
        ? el('div', { key: 'wg', className: 'xq-wgrid' }, top.map(wItem))
        : null
      let style = ui.badgePos
        ? { left: ui.badgePos.x, top: ui.badgePos.y, right: 'auto', bottom: 'auto' }
        : null
      if (wide) {
        if (!style) { style = {} }
        style.maxWidth = effW + 'px'
        style.width = effW + 'px'
      }

      const badgeEl = el('div', {
        className: 'xq-badge',
        style: style,
        title: '点击开合行情面板 · 拖动调整位置 · 右下角 ⤡ 调宽度（双击复位）',
        onPointerDown: onDown, onPointerMove: onMove, onPointerUp: onUp, onPointerCancel: onUp
      }, [
        el('span', { key: 'logo' }, [el('b', { key: 'b' }, '雪球'), 'mini']),
        el('span', { key: 'st', className: 'xq-status' + (aSession() === '盘中' ? ' xq-live' : ''), title: sessionsText() }, (function () { var s = aSession(); return s === '盘中' ? '● 盘中' : (s || (mOpen ? '● 盘中' : '休市')) })()),
        el('span', { key: 'ct', className: 'xq-caret' }, ui.open ? '▾' : '▴'),
        idxEls,
        bodyEls,
        el('span', {
          key: 'grip', className: 'xq-badge-grip', title: '拖动调宽度 · 双击复位',
          onPointerDown: onGripDown, onPointerMove: onGripMove, onPointerUp: onGripUp, onPointerCancel: onGripUp,
          onDoubleClick: onGripDblClick
        }, '⤡')
      ])
      return el('div', { style: { contents: 'display' } }, [badgeEl])
    }

    // ---------- 底部指数条（会话页，输入框下方氛围行） ----------
    function Ticker() {
      const [indices, setIndices] = React.useState([])
      React.useEffect(function () {
        let alive = true
        function refresh() {
          if (pageHidden()) return   // 页面隐藏时暂停指数条轮询
          call('quote', { symbols: ['SH000001', 'SZ399001', 'SZ399006', 'SH000688'] }).then(function (data) {
            if (alive) setIndices((data && data.list) || [])
          }).catch(function () { /* 静默失败 */ })
        }
        function onVis() { if (!pageHidden()) refresh() }
        refresh()
        const stop = ctx.interval(refresh, 30000)
        try { document.addEventListener('visibilitychange', onVis) } catch (e) { /* ignore */ }
        return function () {
          alive = false; if (stop) stop()
          try { document.removeEventListener('visibilitychange', onVis) } catch (e) { /* ignore */ }
        }
      }, [])
      if (!indices.length) return null
      const kids = indices.map(function (q) {
        return el('span', { key: q.symbol, className: 'xq-tick' }, [
          el('span', { key: 'n', className: 'xq-tick-name' }, q.name),
          el('span', { key: 'c', className: 'xq-tick-cur ' + colorOf(q.percent) }, fmt(q.current)),
          el('span', { key: 'p', className: colorOf(q.percent) }, fmtPct(q.percent))
        ])
      })
      return el('div', { className: 'xq-ticker', onClick: function () { ui.set({ open: true }) } }, kids)
    }

    // ---------- 注册 ----------
    const slots = ctx.get('slots')
    if (slots === undefined) return
    slots.inject('conversation.input.dock', function () {
      return slots.register(
        { name: 'conversation.input.dock', id: 'xueqiu-panel', order: 30 },
        function () { return el(DockGate, null) }
      )
    })
    slots.inject('shell.overlay', function () {
      return slots.register(
        { name: 'shell.overlay', id: 'xueqiu-badge' },
        function () { return el(MiniBadge, null) }
      )
    })
    slots.inject('conversation.composer.dock', function () {
      return slots.register(
        { name: 'conversation.composer.dock', id: 'xueqiu-ticker', order: 1 },
        function () { return el(Ticker, null) }
      )
    })

  }
}
