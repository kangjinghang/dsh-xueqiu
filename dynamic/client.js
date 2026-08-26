return {
  inject: ['timer'],
  apply(ctx) {
    styles.insert('\n' +
      '.xq-tv-shell{border:1px solid var(--dsw-alias-border-l1);border-radius:10px;padding:8px 10px;margin:4px 0;font-size:13px;line-height:1.5;color:var(--dsw-alias-label-primary);background:var(--dsw-alias-bg-layer-1);min-width:0;}\n' +
      '.xq-tv-head{display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:6px;}\n' +
      '.xq-tv-title{font-weight:700;}\n' +
      '.xq-tv-pill{font-size:11px;padding:1px 7px;border-radius:8px;background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-secondary);white-space:nowrap;}\n' +
      '.xq-tv-table{display:flex;flex-direction:column;gap:2px;}\n' +
      '.xq-tv-row{display:flex;align-items:baseline;gap:10px;padding:2px 4px;border-radius:6px;}\n' +
      '.xq-tv-row:hover{background:var(--dsw-alias-bg-layer-2);}\n' +
      '.xq-tv-name{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}\n' +
      '.xq-tv-code{color:var(--dsw-alias-label-tertiary);font-size:11px;}\n' +
      '.xq-tv-price{font-weight:700;font-variant-numeric:tabular-nums;}\n' +
      '.xq-tv-pct{font-variant-numeric:tabular-nums;font-weight:600;white-space:nowrap;}\n' +
      '.xq-tv-shell svg{max-width:100%;height:auto;display:block;}\n' +
      '.xq-tv-rank{width:22px;flex:none;text-align:right;font-variant-numeric:tabular-nums;color:var(--dsw-alias-label-tertiary);font-size:12px;}\n' +
      '.xq-tv-rankup{color:var(--dsw-alias-state-error-primary);font-size:11px;flex:none;font-variant-numeric:tabular-nums;}\n' +
      '.xq-tv-rankdn{color:var(--dsw-alias-state-success-primary);font-size:11px;flex:none;font-variant-numeric:tabular-nums;}\n' +
      '.xq-tv-news{display:flex;flex-direction:column;gap:1px;max-height:300px;overflow-y:auto;}\n' +
      '.xq-tv-item{display:flex;gap:8px;align-items:baseline;padding:2px 4px;border-radius:6px;}\n' +
      '.xq-tv-item:hover{background:var(--dsw-alias-bg-layer-2);}\n' +
      '.xq-tv-mark{background:var(--dsw-alias-bg-layer-2);}\n' +
      '.xq-tv-time{flex:none;font-size:11px;color:var(--dsw-alias-label-tertiary);font-variant-numeric:tabular-nums;}\n' +
      '.xq-tv-text{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}\n' +
      '.xq-tv-flag{color:var(--dsw-alias-state-error-primary);font-weight:700;}\n' +
      '.xq-up{color:var(--dsw-alias-state-error-primary);}\n' +
      '.xq-down{color:var(--dsw-alias-state-success-primary);}\n' +
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
      '.xq-badge-grip{position:absolute;right:2px;bottom:2px;width:16px;height:16px;cursor:ew-resize;display:flex;align-items:flex-end;justify-content:flex-end;color:var(--dsw-alias-label-secondary);font-size:9px;line-height:1;opacity:0;transition:opacity .15s;}\n' +
      '.xq-badge:hover .xq-badge-grip{opacity:.85;}\n' +
      '.xq-badge-hd{display:flex;align-items:center;gap:8px;}\n' +
      '.xq-wgrid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:3px 12px;padding:1px 8px 1px 0;}\n' +
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
      '.xq-detail-head{display:flex;align-items:center;gap:10px;margin-bottom:12px;flex-wrap:wrap;}\n' +
      '.xq-detail-name{font-size:16px;font-weight:700;letter-spacing:.2px;}\n' +
      '.xq-detail-code{font-size:11px;color:var(--dsw-alias-label-tertiary);letter-spacing:.3px;}\n' +
      '.xq-detail-price{display:flex;align-items:baseline;gap:10px;}\n' +
      '.xq-detail-delta{display:flex;align-items:baseline;gap:6px;}\n' +
      '.xq-detail-cur{font-size:27px;font-weight:800;line-height:1;font-variant-numeric:tabular-nums;}\n' +
      '.xq-detail-chg{font-size:13px;font-weight:700;font-variant-numeric:tabular-nums;}\n' +
      '.xq-detail-pct{font-size:14px;font-weight:700;font-variant-numeric:tabular-nums;}\n' +
      '.xq-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-bottom:12px;}\n' +
      '.xq-stat{background:color-mix(in srgb, var(--dsw-alias-bg-layer-2) 55%, transparent);border:1px solid var(--dsw-alias-border-l1);border-radius:8px;padding:6px 8px;min-width:0;}\n' +
      '.xq-stat-k{font-size:10px;color:var(--dsw-alias-label-tertiary);margin-bottom:3px;letter-spacing:.2px;}\n' +
      '.xq-stat-v{font-size:13px;font-weight:700;font-variant-numeric:tabular-nums;line-height:1.3;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}\n' +
      '.xq-card{background:var(--dsw-alias-bg-layer-1);border:1px solid var(--dsw-alias-border-l1);border-radius:10px;padding:10px 12px;margin-bottom:12px;}\n' +
      '.xq-card-t{font-size:12.5px;font-weight:700;margin-bottom:8px;display:flex;align-items:center;gap:8px;flex-wrap:wrap;}\n' +
      '.xq-card-t::before{content:"";width:3px;height:12px;border-radius:2px;background:var(--dsw-alias-brand-primary);flex:none;}\n' +
      '.xq-periods{display:inline-flex;flex-wrap:wrap;gap:2px;border:1px solid var(--dsw-alias-border-l2);border-radius:7px;padding:2px;background:var(--dsw-alias-bg-layer-2);}\n' +
      '.xq-periods button,.xq-modes button{font-size:11.5px;border:none;background:none;color:var(--dsw-alias-label-secondary);padding:3px 9px;border-radius:6px;cursor:pointer;transition:color .12s,background .12s;}\n' +
      '.xq-periods button:hover,.xq-modes button:hover{color:var(--dsw-alias-label-primary);}\n' +
      '.xq-periods button.xq-on,.xq-modes button.xq-on{background:color-mix(in srgb, var(--dsw-alias-brand-primary) 16%, transparent);color:var(--dsw-alias-brand-primary);font-weight:700;}\n' +
      '.xq-chart{width:100%;height:auto;display:block;}\n' +
      '.xq-chart-pan{cursor:crosshair;touch-action:none;}\n' +
      '.xq-chart-pan:active{cursor:grabbing;}\n' +
      '.xq-chart-wrap{position:relative;}\n' +
      '.xq-tip{position:absolute;top:4px;z-index:5;pointer-events:none;background:var(--dsw-alias-bg-overlay);border:1px solid var(--dsw-alias-border-l2);border-radius:6px;padding:4px 8px;font-size:10.5px;line-height:1.6;color:var(--dsw-alias-label-primary);box-shadow:0 4px 14px rgba(0,0,0,.28);white-space:nowrap;}\n' +
      '.xq-tip-d{font-weight:700;}\n' +
      '.xq-tip-r{display:flex;gap:8px;}\n' +
      '.xq-tip-k{color:var(--dsw-alias-label-secondary);}\n' +
      '.xq-chart-labels{display:flex;justify-content:space-between;font-size:10.5px;color:var(--dsw-alias-label-tertiary);margin-top:3px;}\n' +
      '.xq-ma-legend{display:flex;gap:10px;font-size:10.5px;color:var(--dsw-alias-label-secondary);}\n' +
      '.xq-klc{height:300px;width:100%;min-width:0;cursor:grab;}\n' +
      '.xq-klc.xq-dragging{cursor:grabbing;}\n' +
      '.xq-klc-min{height:230px;}\n' +
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
      return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate())
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
          // 水合前用户已交互过的字段不做回滚（页面刚加载就点开面板/切标签，不被迟到的旧持久化打回）
          if (k === 'open') this.openTouched = true
          if (k === 'tab') this.tabTouched = true
        }
        if (ch) {
          this.notify()
          // 打开面板的 set 发生在面板组件订阅建立之前（订阅在挂载后才生效）——
          // 若无人续触发 ui.set，open=true 永远不落盘，刷新后面板关着。open 翻转直接触发落盘。
          if ('open' in patch) { try { saveUi() } catch (e) { /* 初始化前忽略 */ } }
        }
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

    // ---------- 图表引擎：KLineChart v10（canvas；UMD 由 gen-static.py 注入静态形态，动态会话无库时降级提示） ----------
    // 选型对比（2026-08，实测 gzip 体积）：KLineChart 10.0.2 59.8KB vs lightweight-charts 5.2.1 62.3KB vs ECharts ~330KB。
    // 胜出理由：零依赖、A股原生观感（红涨绿跌）、内置 MA/VOL 指标与十字光标 legend、dataLoader 反向加载直接对接右拖拉历史。
    function klcLib() {
      try { return (typeof window !== 'undefined' && window.klinecharts) || null } catch (e) { return null }
    }

    function cssVarColor(name, fallback) {
      try {
        // 主题令牌定义在 <body>（GUI 主题层），<html> 上读不到——曾因此永远拿不到令牌、
        // 双主题都渲染硬编码回退色（浅色下图例 #8a8f98 对白底对比度仅 ~1.8:1）
        let v = getComputedStyle(document.body).getPropertyValue(name).trim()
        if (!v) v = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
        return v || fallback
      } catch (e) { return fallback }
    }

    // canvas 不能用 CSS 变量，主题色在 init/主题变化时解析为具体色值
    function klcPalette() {
      return {
        up: cssVarColor('--dsw-alias-state-error-primary', '#ef4444'),
        down: cssVarColor('--dsw-alias-state-success-primary', '#22c55e'),
        grid: cssVarColor('--dsw-alias-border-l2', 'rgba(128,128,128,0.25)'),
        text: cssVarColor('--dsw-alias-label-secondary', '#8a8f98'),
        warn: cssVarColor('--dsw-alias-state-warn-primary', '#f59e0b')
      }
    }

    function klcStyles(kind, pal) {
      const s = {
        grid: { horizontal: { color: pal.grid }, vertical: { show: false } },
        candle: {
          bar: {
            upColor: pal.up, downColor: pal.down, noChangeColor: pal.text,
            upBorderColor: pal.up, downBorderColor: pal.down, noChangeBorderColor: pal.text,
            upWickColor: pal.up, downWickColor: pal.down, noChangeWickColor: pal.text
          },
          // OHLC 图例：K线常显最新一根（v1.22.5 起紧凑中文单行、字号 10，不再压蜡烛）；
          // 悬停十字光标时跟随显示对应根；分时在下方 minute 分支整体关闭。
          // 默认英文 time/open/... 标题太长会折成两行——已换中文单行
          tooltip: {
            showRule: 'always',
            title: { show: false },
            legend: {
              size: 10, color: pal.text,
              template: [
                { title: '开', value: '{open}' }, { title: '高', value: '{high}' },
                { title: '低', value: '{low}' }, { title: '收', value: '{close}' },
                { title: '量', value: '{volume}' }
              ]
            }
          },
          priceMark: {
            // 关闭最高/最低点重复标注（窄图时易与坐标轴重叠成杂乱数字），保留最新价标
            high: { show: false }, low: { show: false },
            last: { upColor: pal.up, downColor: pal.down, noChangeColor: pal.text, text: { color: pal.text } }
          }
        },
        indicator: {
          bars: [{ upColor: pal.up, downColor: pal.down, noChangeColor: pal.text }],
          // 和谐 MA 配色：蓝/橙/紫/青，多均线更易区分（对齐雪球观感）
          lines: [{ color: '#3b82f6' }, { color: '#f59e0b' }, { color: '#8b5cf6' }, { color: '#06b6d4' }],
          // MA 数值悬停显示（蜡烛图例一行 + MA 图例一行，同雪球）；常驻关闭避免压图
          tooltip: { showRule: 'follow_cross' }
        },
        xAxis: { axisLine: { color: pal.grid }, tickLine: { color: pal.grid }, tickText: { color: pal.text } },
        yAxis: { axisLine: { color: pal.grid }, tickLine: { color: pal.grid }, tickText: { color: pal.text } },
        separator: { color: pal.grid },
        crosshair: {
          horizontal: { line: { color: pal.text }, text: { backgroundColor: pal.text } },
          vertical: { line: { color: pal.text }, text: { backgroundColor: pal.text } }
        }
      }
      if (kind === 'minute') {
        // 分时：面积图 + 昨收虚线 + 均价线（xq-minute 指标），涨跌色由调用方按收盘定
        s.candle.type = 'area'
        s.candle.area = { lineSize: 1.4, lineColor: pal.up, backgroundColor: 'rgba(239,68,68,0.10)', value: 'close', smooth: false }
        s.candle.priceMark = { high: { color: pal.text }, low: { color: pal.text }, last: { upColor: pal.up, downColor: pal.down, noChangeColor: pal.text, text: { color: pal.text } } }
        // 分时悬停信息已由自定义 .xq-tip（价/均价/涨跌）承担；面积图开=高=低=收同值，
        // canvas OHLC 图例纯冗余且与 .xq-tip 双份叠加 → 蜡烛与指标图例整体关闭
        s.candle.tooltip = { showRule: 'none' }
        s.indicator = { tooltip: { showRule: 'none' } }
      }
      return s
    }

    // 通用图表生命周期：init + 主题监听 + 尺寸自适应，返回清理函数
    function klcSetup(K, boxRef, kind) {
      const chart = K.init(boxRef.current, { styles: klcStyles(kind, klcPalette()) })
      if (!chart) return null
      // 卸载清理时 boxRef.current 已被 React 置 null，dispose 须用闭包捕获的节点
      const box = boxRef.current
      let ro = null
      try {
        ro = new ResizeObserver(function () { chart.resize() })
        ro.observe(boxRef.current)
      } catch (e) { /* 旧环境无 RO */ }
      let mo = null
      try {
        mo = new MutationObserver(function () { chart.setStyles(klcStyles(kind, klcPalette())) })
        mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-theme'] })
      } catch (e) { /* 忽略 */ }
      // GUI 跟随系统配色时 DOM 属性不变（上面的 MutationObserver 永不触发），
      // 主题翻转唯一可靠信号是 matchMedia change
      let mqOff = null
      try {
        const mq = window.matchMedia('(prefers-color-scheme: dark)')
        const onScheme = function () { try { chart.setStyles(klcStyles(kind, klcPalette())) } catch (e) { /* ignore */ } }
        if (mq.addEventListener) { mq.addEventListener('change', onScheme); mqOff = function () { mq.removeEventListener('change', onScheme) } }
        else if (mq.addListener) { mq.addListener(onScheme); mqOff = function () { mq.removeListener(onScheme) } }
      } catch (e) { /* ignore */ }
      return {
        chart: chart,
        dispose: function () {
          if (ro) ro.disconnect()
          if (mo) mo.disconnect()
          if (mqOff) mqOff()
          // 卸载清理时 boxRef.current 已被 React 置 null（与 dblclick 监听同类坑），须闭包捕获节点
          try { K.dispose(box) } catch (e) { /* 忽略 */ }
        }
      }
    }

    function klcNoLib() {
      return el('div', { className: 'xq-muted', style: { padding: '24px 0', textAlign: 'center' } },
        '图表引擎（KLineChart）未加载：静态安装形态自带，动态调试会话不含 vendored 库')
    }

    // rows 归一化：面板行为 {timestamp(ms),open,high,low,close,volume}；卡片行为 {time(ISO),...} → 补 timestamp
    function klcNormRows(rows) {
      return (rows || []).map(function (r) {
        if (r.timestamp) return r
        const t = r.time ? Date.parse(r.time) : NaN
        return Object.assign({}, r, { timestamp: isNaN(t) ? 0 : t })
      }).filter(function (r) { return r.timestamp > 0 })
    }

    function klcPrecision(rows, hint) {
      if (hint != null) return hint
      try {
        const s = String(rows.length ? rows[rows.length - 1].close : '')
        const d = (s.split('.')[1] || '').length
        return Math.max(0, Math.min(4, d || 2))
      } catch (e) { return 2 }
    }

    // ---------- K线蜡烛图（KLineChart：内置 MA/VOL、滚轮缩放、拖拽平移、右拖自动加载更早历史） ----------
    function KlineChart(props) {
      const rows = props.rows || []
      const onNeedEarlier = props.onNeedEarlier || null
      const boxRef = React.useRef(null)
      const [noLib, setNoLib] = React.useState(false)
      const propsRef = React.useRef(null)
      propsRef.current = { rows: rows, onNeedEarlier: onNeedEarlier }

      // v1.22.10 起周期切换只清 kline 数据不重建详情骨架，图表可能先以空 rows 挂载、
      // 数据后到——与 MinuteChart 的 hasData 同款门控：空数据不建图，rows 到达时重建
      const hasRows = rows.length > 0
      React.useEffect(function () {
        const K = klcLib()
        if (!K || !boxRef.current) { setNoLib(true); return undefined }
        if (!hasRows) return undefined
        const h = klcSetup(K, boxRef, 'kline')
        if (!h) { setNoLib(true); return undefined }
        const chart = h.chart
        let busy = false
        // 顺序要求（实测 v10）：setPeriod → setSymbol → setDataLoader。若 setSymbol 在 setPeriod 之前，
        // 两者各触发一次 init 导致数据重复叠加；setPeriod 必须设置，否则 crosshair 不触发。
        const pm = { '5m': { type: 'minute', span: 5 }, '15m': { type: 'minute', span: 15 }, '30m': { type: 'minute', span: 30 }, '60m': { type: 'hour', span: 1 }, day: { type: 'day', span: 1 }, week: { type: 'week', span: 1 }, month: { type: 'month', span: 1 } }
        chart.setPeriod(pm[props.period] || { type: 'day', span: 1 })
        chart.setSymbol({ ticker: props.symbol || 'xq', pricePrecision: klcPrecision(rows, props.precision), volumePrecision: 2 })
        chart.setDataLoader({
          getBars: function (params) {
            const done = params.callback
            if (params.type === 'init') {
              done(klcNormRows(propsRef.current.rows), { forward: true, backward: false })
              return
            }
            // v10 语义（源码 _processDataLoad/_addData）：'backward'=锚定最后一根、concat 到尾部，即拉"更新"数据
            // （盘中右缘新K线）；'forward'=锚定第一根、前插，即拉"更早"历史（右拖触底）。A股场景无实时增量，backward 恒空。
            if (params.type !== 'forward' || busy) { done([], { forward: false, backward: false }); return }
            const fetch = propsRef.current.onNeedEarlier
            if (!fetch) { done([], { forward: false, backward: false }); return }
            busy = true
            Promise.resolve(fetch(params.timestamp)).then(function (fresh) {
              busy = false
              const add = (fresh || []).filter(function (r) { return r.timestamp < params.timestamp })
              done(add, { forward: add.length > 0, backward: false })
            }, function () { busy = false; done([], { forward: false, backward: false }) })
          }
        })
        // 均线叠加到主图蜡烛 pane（paneId 指定已有主图，不传则默认新开附图 pane）——与雪球一致
        chart.createIndicator({ name: 'MA', paneId: 'candle_pane' })
        chart.createIndicator('VOL')
        chart.setOffsetRightDistance(16)
        // 双击回最新（标签文案承诺过；kline v10 自带 dblclick 仅做空十字，需手动 scrollToRealTime）
        const box = boxRef.current
        const onDbl = function () { try { chart.scrollToRealTime() } catch (e) { /* 忽略 */ } }
        box.addEventListener('dblclick', onDbl)
        // 拖拽光标反馈：悬停小手、按住变抓手（松手点可能在图外，需 window 级兜底复位）
        const onCurDown = function () { try { box.classList.add('xq-dragging') } catch (e) { /* 忽略 */ } }
        const onCurUp = function () { try { box.classList.remove('xq-dragging') } catch (e) { /* 忽略 */ } }
        box.addEventListener('mousedown', onCurDown)
        box.addEventListener('mouseup', onCurUp)
        box.addEventListener('mouseleave', onCurUp)
        window.addEventListener('mouseup', onCurUp)
        return function () {
          // 卸载清理时 boxRef.current 已被 React 置 null（切 tab 触发，曾致槽位整体崩溃），须闭包捕获节点
          try { box.removeEventListener('dblclick', onDbl) } catch (e) { /* 忽略 */ }
          try { box.removeEventListener('mousedown', onCurDown) } catch (e) { /* 忽略 */ }
          try { box.removeEventListener('mouseup', onCurUp) } catch (e) { /* 忽略 */ }
          try { box.removeEventListener('mouseleave', onCurUp) } catch (e) { /* 忽略 */ }
          try { window.removeEventListener('mouseup', onCurUp) } catch (e) { /* 忽略 */ }
          h.dispose()
        }
      }, [hasRows])

      if (noLib) return klcNoLib()
      const norm = rows.length && !rows[0].timestamp ? klcNormRows(rows) : rows
      return el('div', { className: 'xq-chart-wrap' }, [
        el('div', { key: 'c', ref: boxRef, className: 'xq-klc' }),
        el('div', { key: 'lb', className: 'xq-chart-labels' }, [
          el('span', { key: 'd' }, norm.length ? fmtDay(norm[0].timestamp) + ' ~ ' + fmtDay(norm[norm.length - 1].timestamp) : ''),
          el('span', { key: 'n' }, norm.length + ' 根 · 滚轮缩放 · 右拖加载更早 · 双击回最新')
        ])
      ])
    }

    // ---------- 分时图（面积价线 + 昨收虚线 + 均价线 + 十字光标 tooltip） ----------
    function MinuteChart(props) {
      const items = props.items || []
      const lastClose = Number(props.lastClose) || 0
      const boxRef = React.useRef(null)
      const wrapRef = React.useRef(null)
      const [noLib, setNoLib] = React.useState(false)
      const [hi, setHi] = React.useState(null)
      const baseRef = React.useRef({ lastClose: lastClose })
      baseRef.current = { lastClose: lastClose }
      // 分时数据是详情页渐进渲染晚到的一块（quote+kline 先上屏、minute 随后 merge）：
      // effect 依赖 [] 曾导致空 items 挂载后数据到达永不刷新（空白图）。改为「空数据不挂图表，
      // 数据到达（hasData 变 true）时重建」，彻底消除竞态窗口。
      const hasData = items.length > 0

      React.useEffect(function () {
        const K = klcLib()
        if (!K || !boxRef.current) { setNoLib(true); return undefined }
        if (!hasData) return undefined   // 数据未到：不建图表（等 hasData 变 true 重建）
        // 自定义指标：昨收虚线 + 均价线（series normal → 单独附图，避免干扰价格轴刻度）
        // 注意：registerIndicator 全局只注册一次，calc 闭包捕获的是首次挂载实例的 baseRef——
        // 切换股票后旧 calc 仍读旧实例的昨收（宁德分时曾因此挂上茅台昨收 1304，y 轴被撑爆成直线）。
        // 因此每次挂载都 overrideIndicator 换成绑定当前 baseRef 的新 calc。
        if (K.getSupportedIndicators().indexOf('xq-minute') < 0) {
          K.registerIndicator({
            name: 'xq-minute', shortName: '分时', series: 'normal',
            calc: function (dataList) {
              const base = baseRef.current.lastClose
              return dataList.map(function (d) {
                return { avg: Number(d.avg_price != null ? d.avg_price : d.close), base: base }
              })
            },
            figures: [
              { key: 'base', title: '昨收: ', type: 'line', styles: function () { return { style: 'dashed', size: 1, color: cssVarColor('--dsw-alias-label-secondary', '#8a8f98') } } },
              { key: 'avg', title: '均价: ', type: 'line', styles: function () { return { style: 'solid', size: 1, color: cssVarColor('--dsw-alias-state-warn-primary', '#f59e0b') } } }
            ]
          })
        }
        const h = klcSetup(K, boxRef, 'minute')
        if (!h) { setNoLib(true); return undefined }
        const chart = h.chart
        // 数据映射：分时 items → KLineData（current 充当 o/h/l/c；avg_price/pct 挂扩展字段供指标与 tooltip 用）
        const toBars = function (list, lclose) {
          return (list || []).map(function (it) {
            const c = Number(it.current)
            const pct = lclose ? (c - lclose) / lclose * 100 : (it.percent != null ? Number(it.percent) : null)
            return {
              timestamp: Number(it.timestamp), open: c, high: Number(it.high) || c, low: Number(it.low) || c, close: c,
              volume: Number(it.volume) || 0, avg_price: it.avg_price, pct: pct
            }
          }).filter(function (d) { return d.timestamp > 0 })
        }
        const barsRef = { v: toBars(items, lastClose) }
        // 顺序要求（实测 v10）：setPeriod → setSymbol → setDataLoader（挂载 loader 触发唯一一次 init；
        // 不 setPeriod 则 crosshair 不触发，setSymbol 先于 setPeriod 会双 init 重复叠加数据）
        chart.setPeriod({ type: 'minute', span: 1 })
        chart.setSymbol({ ticker: props.symbol || 'xq', pricePrecision: klcPrecision(barsRef.v, props.precision), volumePrecision: 2 })
        chart.setDataLoader({
          getBars: function (params) {
            if (params.type === 'init') params.callback(barsRef.v, { backward: false, forward: false })
            else params.callback([], { backward: false, forward: false })
          }
        })
        const last = items.length ? Number(items[items.length - 1].current) : 0
        const up = lastClose ? last >= lastClose : true
        // 涨跌色改面积线色（palette up 色对A股即"涨"）
        chart.setStyles({ candle: { type: 'area', area: { lineColor: up ? klcPalette().up : klcPalette().down, backgroundColor: up ? 'rgba(239,68,68,0.10)' : 'rgba(34,197,94,0.10)' } } })
        chart.createIndicator({ name: 'xq-minute', paneId: 'candle_pane' })   // 均价/昨收叠加到主图分时曲线（与雪球一致）
        // 绑定当前实例 baseRef 的 calc（防跨股票串昨收，见上方注释）
        chart.overrideIndicator({ name: 'xq-minute', calc: function (dataList) {
          const base = baseRef.current.lastClose
          return dataList.map(function (d) {
            return { avg: Number(d.avg_price != null ? d.avg_price : d.close), base: base }
          })
        } })
        // 分时固定视角：禁缩放拖拽，全部笔数铺满宽度
        chart.setZoomEnabled(false)
        chart.setScrollEnabled(false)
        chart.setOffsetRightDistance(4)
        if (items.length > 1 && boxRef.current.clientWidth) {
          chart.setBarSpace(Math.max(boxRef.current.clientWidth / (items.length + 6), 0.1))
        }
        // v10.0.2 的 onCrosshairChange 事件只带 {x,y,paneId}（文档声称的 kLineData 字段实际未填），
        // 用 convertFromPixel 反查 dataIndex，再从自有 bars 取明细
        chart.subscribeAction('onCrosshairChange', function (d) {
          if (!d || typeof d.x !== 'number') { setHi(null); return }
          let p = null
          try { const r = chart.convertFromPixel([{ x: d.x, y: d.y }]); p = r && r[0] } catch (e) { /* 忽略 */ }
          const di = p && typeof p.dataIndex === 'number' ? p.dataIndex : -1
          if (di >= 0 && di < barsRef.v.length) setHi({ r: barsRef.v[di], x: d.x })
          else setHi(null)
        })
        return function () {
          try { chart.unsubscribeAction('onCrosshairChange') } catch (e) { /* 忽略 */ }
          h.dispose()
        }
      }, [hasData, props.symbol])

      if (noLib) return klcNoLib()
      if (!hasData) return el('div', { className: 'xq-chart-wrap', style: { display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--dsw-alias-label-secondary)', fontSize: 12 } }, '分时数据加载中…')
      // 十字光标 tooltip（沿用 .xq-tip 卡片）
      let tip = null
      if (hi && hi.r) {
        const r = hi.r
        const pct = r.pct != null ? Number(r.pct) : null
        const wrapW = (wrapRef.current && wrapRef.current.offsetWidth) || 640
        const x = typeof hi.x === 'number' ? hi.x : 0
        tip = el('div', {
          key: 'tip', className: 'xq-tip',
          style: { left: x + 'px', transform: x > wrapW * 0.55 ? 'translateX(calc(-100% - 10px))' : 'translateX(10px)' }
        }, [
          el('div', { key: 'd', className: 'xq-tip-d' }, fmtTime(r.timestamp)),
          el('div', { key: 'r1', className: 'xq-tip-r' }, [
            el('span', { key: 'p', className: colorOf(pct) }, [el('span', { key: 'k', className: 'xq-tip-k' }, '价 '), fmt(r.close)]),
            el('span', { key: 'a' }, [el('span', { key: 'k', className: 'xq-tip-k' }, '均价 '), fmt(r.avg_price)]),
            el('span', { key: 'g', className: colorOf(pct) }, [el('span', { key: 'k', className: 'xq-tip-k' }, '涨跌 '), fmtPct(pct)])
          ])
        ])
      }
      return el('div', { className: 'xq-chart-wrap', ref: wrapRef }, [
        tip,
        el('div', { key: 'c', ref: boxRef, className: 'xq-klc xq-klc-min' }),
        el('div', { key: 'lb', className: 'xq-chart-labels' }, [
          el('span', { key: 'd' }, items.length ? fmtDay(items[0].timestamp) + ' 分时' : ''),
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
      // 竞态防护：热榜/搜索的响应序号（旧响应到达时序号已过期则丢弃，防慢请求覆盖新结果）
      const hotSeq = React.useRef(0)
      const searchSeq = React.useRef(0)
      // 轮询闭包读当前市场（interval 闭包不随状态更新，直接捕获 state 会拿到 stale 值）
      const hotMarketRef = React.useRef(hotMarket)
      hotMarketRef.current = hotMarket
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
      // K线到达早于详情骨架时的暂存（view 与 period 两个 effect 并行取数，避免丢数据）
      const klineStash = React.useRef(null)
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
        const my = ++hotSeq.current
        const market = hotMarketRef.current   // 读当前市场（轮询闭包防 stale）
        Promise.all([
          call('hot', { market: market, size: 10 }),
          call('news', { count: 20 })
        ]).then(function (res) {
          if (hotSeq.current !== my) return   // 期间用户切了市场/触发过手动刷新：丢弃旧响应
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

      // K线历史获取（纯函数，不碰 React 状态）：图表右拖触底时拉更早的 500 根，返回原始行；
      // 图表内部自行前插持有全部历史，React 缓冲始终只是初始窗口（避免双数据源互相反馈）。
      function fetchEarlierKline(earliestTs) {
        if (!view || !detail || !detail.kline) return []
        const cur = detail.kline.rows || []
        const begin = earliestTs || (cur.length ? cur[0].timestamp : 0)
        if (!begin) return []
        // 以当前最早一根为 begin 的近似：多拉 500 根（count 负值=含 begin 往前），host 侧 type:'before' 返回区间
        return call('kline', { symbol: view, period: klinePeriod, count: 500, begin: begin }).then(function (res) {
          return (res && res.rows) || []
        }).catch(function () { return [] /* 追加失败静默：图表仍可看已有缓冲 */ })
      }

      // 详情骨架（报价/分时/财务/KOL）：只在换标的时整体重建；
      // v1.22.10 前 klinePeriod 也在依赖里，切周期会把整个详情清空重拉 5 个接口——
      // 表现为切周期时报价/图例/周期丸闪灭 100-300ms，快速连点会丢按钮
      React.useEffect(function () {
        if (!view) { setDetail(null); return }
        let alive = true
        klineStash.current = null
        setDetail(null)
        function fb(p) { return p.catch(function () { return null }) }
        // 渐进渲染：报价先上屏（K线由下方周期 effect 并行供给，到达早于骨架时走 stash），分时/财务/KOL 到达后补充
        const pQuote = fb(call('quoteDetail', { symbol: view }))
        const pMinute = fb(call('minute', { symbol: view }))
        const pFinance = fb(call('finance', { symbol: view }))
        const pKol = fb(call('kol', { symbol: view, count: 6 }))
        pQuote.then(function (res) {
          if (!alive) return
          setDetail({
            quote: (res && res.quote) || {},
            kline: klineStash.current || { rows: [] },
            minute: { items: [], last_close: null },
            finance: { list: [] },
            kol: []
          })
          if (!res) setErr('详情加载失败，数据可能不完整')
          // 其余部分到达后增量合并
          pMinute.then(function (m) { if (alive && m) setDetail(function (d) { return d ? Object.assign({}, d, { minute: m }) : d }) })
          pFinance.then(function (f) { if (alive && f) setDetail(function (d) { return d ? Object.assign({}, d, { finance: f }) : d }) })
          pKol.then(function (k) { if (alive && k) setDetail(function (d) { return d ? Object.assign({}, d, { kol: k.list || [] }) : d }) })
        }).catch(function (e) {
          if (alive) setErr(String((e && e.message) || e))
        })
        return function () { alive = false }
      }, [view])

      // K线按周期独立拉取：切周期只清图表数据、只发 1 个请求，报价与周期丸全程保持可点
      React.useEffect(function () {
        if (!view) return
        let alive = true
        setDetail(function (d) { return d ? Object.assign({}, d, { kline: { rows: [] } }) : d })
        call('kline', { symbol: view, period: klinePeriod, count: 500 }).then(function (res) {
          if (!alive || !res) return
          klineStash.current = res
          setDetail(function (d) { return d ? Object.assign({}, d, { kline: res }) : d })
        }).catch(function () { /* 周期拉取失败：保持空图，不推翻已有详情 */ })
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
        const my = ++searchSeq.current
        const p = searchMode === 'stock'
          ? call('search', { q: q, count: 8 })
          : call('searchPosts', { q: q, count: 10 })
        p.then(function (data) {
          if (searchSeq.current !== my) return   // 快速连搜：只认最后一次
          setSearchRes((data && data.list) || [])
        }).catch(function (e) {
          if (searchSeq.current !== my) return
          setErr(String((e && e.message) || e))
          setSearchRes([])
        }).then(function () { if (searchSeq.current === my) setSearching(false) })
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
                el('span', { key: 'c', className: 'xq-acc-mark' }, ' · 云端自选股已启用，加/删自选双端同步（云端为准）')
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
        // 行情主标题：现价 + 涨跌额 + 涨跌幅（参考雪球 ¥18.23 +0.14 +0.77% 层级）
        // 精度取现价自身小数位（港交所 1 位等），涨跌额同精度
        const qDigits = (function () {
          const m = String(q.current == null ? '' : q.current).split('.')
          const d = m[1] ? m[1].length : 0
          return Math.max(2, Math.min(4, d))
        })()
        const chgRaw = (q.current != null && q.last_close != null) ? (Number(q.current) - Number(q.last_close)) : null
        const chgStr = (chgRaw != null && isFinite(chgRaw)) ? (chgRaw > 0 ? '+' + fmt(chgRaw, qDigits) : (chgRaw < 0 ? '-' + fmt(Math.abs(chgRaw), qDigits) : fmt(0, qDigits))) : ''
        const priceCls = colorOf(q.percent)
        return el('div', null, [
          el('div', { key: 'h', className: 'xq-detail-head' }, [
            el('button', { key: 'b', className: 'xq-btn-mini', onClick: function () { setView(null) } }, '← 返回'),
            el('span', { key: 'n', className: 'xq-detail-name' }, q.name || view),
            el('span', { key: 'c', className: 'xq-detail-code' }, view),
            el('span', { key: 'sp', className: 'xq-spacer' }),
            el('div', { key: 'px', className: 'xq-detail-price' }, [
              el('span', { key: 'cur', className: 'xq-detail-cur ' + priceCls }, fmt(q.current, qDigits)),
              el('span', { key: 'dl', className: 'xq-detail-delta' }, [
                chgStr ? el('span', { key: 'chg', className: 'xq-detail-chg ' + priceCls }, chgStr) : null,
                el('span', { key: 'pct', className: 'xq-detail-pct ' + priceCls }, fmtPct(q.percent))
              ])
            ])
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
              ? el(KlineChart, { key: 'k' + view + klinePeriod, symbol: view, period: klinePeriod, rows: kl.rows, onNeedEarlier: fetchEarlierKline })
              : el(MinuteChart, { key: 'm' + view, symbol: view, items: mn.items, lastClose: mn.last_close })
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
                const my = ++hotSeq.current
                call('hot', { market: m[0], size: 10 }).then(function (data) {
                  if (hotSeq.current !== my) return   // 快速连点：只认最后一次
                  setHot((data && data.list) || [])
                }).catch(function (e) {
                  if (hotSeq.current !== my) return
                  setErr(String((e && e.message) || e))
                })
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
          if (isNaN(d.getTime())) {   // 脏/缺失时间：跳过分组头（否则渲染 "NaN月NaN日"）
            kids.push(el('div', { key: String(it.id), className: 'xq-news-item' + (it.mark === 1 ? ' xq-important' : '') }, [
              el('div', { key: 't' }, it.text),
              el('div', { key: 'm', className: 'xq-news-time' }, fmtTime(it.created_at) + (it.mark === 1 ? ' · 重要' : ''))
            ]))
            return
          }
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
          if (d && d.tab && !ui.tabTouched) ui.set({ tab: d.tab })
          if (d && typeof d.open === 'boolean' && !ui.openTouched) ui.set({ open: d.open })
          if (d && d.badgePos && isFinite(Number(d.badgePos.x)) && isFinite(Number(d.badgePos.y))) {
            // 恢复位置时钳制到当前视口内（视口缩小/分辨率变化后防止徽章落到屏幕外）
            // maxX 必须按徽章实际宽度算：区域模式宽达 480px，固定 -140 会让宽徽章右缘出屏
            const vp = viewport()
            const effW = (typeof d.badgeW === 'number' && isFinite(d.badgeW) && d.badgeW >= 120)
              ? Math.min(d.badgeW, 480) : 320
            const maxX = (vp ? vp.w : 1200) - effW - 4
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

      // 挂载后与视口变化时按真实渲染尺寸钳制徽标位置：
      // DockGate 恢复时只能按 badgeW 估算宽度（不含边框/极限情况），且窗口缩小后
      // 旧坐标可能落到屏幕外——这里用 offsetWidth 实测值兜底，保证徽标永远可见
      const badgeRef = React.useRef(null)
      function clampBadge() {
        const node = badgeRef.current
        if (!node || !ui.badgePos) return
        const w = node.offsetWidth || 0
        const h = node.offsetHeight || 0
        if (!w) return
        const vp = viewport()
        if (!vp) return
        const x = Math.min(Math.max(4, Number(ui.badgePos.x)), Math.max(4, vp.w - w - 4))
        const y = Math.min(Math.max(4, Number(ui.badgePos.y)), Math.max(4, vp.h - h - 4))
        if (x !== ui.badgePos.x || y !== ui.badgePos.y) ui.set({ badgePos: { x: x, y: y } })
      }
      // 每次渲染后钳制：数据异步到达→徽章长高→重渲染，逐渲染钳制无时序死角
      // （仅依赖挂载一次/ResizeObserver 的方案在慢环境漏过"渲染后才长高"的场景，CI 实测踩坑）。
      // ui.set 仅在有变更时触发下一次渲染，收敛后不再循环。
      React.useLayoutEffect(clampBadge)
      React.useEffect(function () {
        window.addEventListener('resize', clampBadge)
        let ro = null
        try {
          const node = badgeRef.current
          ro = new ResizeObserver(function () { clampBadge() })
          if (node) ro.observe(node)
        } catch (e) { /* 无 ResizeObserver 时退化为 resize 事件 + 每渲染钳制 */ }
        return function () {
          try { window.removeEventListener('resize', clampBadge) } catch (e) { /* ignore */ }
          try { if (ro) ro.disconnect() } catch (e) { /* ignore */ }
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
        ref: badgeRef,
        className: 'xq-badge',
        style: style,
        title: '点击开合行情面板 · 拖动调整位置 · 右下角 ⤡ 调宽度（双击复位）',
        onPointerDown: onDown, onPointerMove: onMove, onPointerUp: onUp, onPointerCancel: onUp
      }, [
        el('div', { key: 'hd', className: 'xq-badge-hd' }, [
          el('span', { key: 'logo' }, [el('b', { key: 'b' }, '雪球'), 'mini']),
          el('span', { key: 'st', className: 'xq-status' + (aSession() === '盘中' ? ' xq-live' : ''), title: sessionsText() }, (function () { var s = aSession(); return s === '盘中' ? '● 盘中' : (s || (mOpen ? '● 盘中' : '休市')) })()),
          el('span', { key: 'sp', className: 'xq-spacer' }),
          el('span', { key: 'ct', className: 'xq-caret' }, ui.open ? '▾' : '▴')
        ]),
        idxEls,
        bodyEls,
        el('span', {
          key: 'grip', className: 'xq-badge-grip', title: '拖动调宽度 · 双击复位',
          onPointerDown: onGripDown, onPointerMove: onGripMove, onPointerUp: onGripUp, onPointerCancel: onGripUp,
          onDoubleClick: onGripDblClick
        }, '⤡')
      ])
      return el('div', { style: { display: 'contents' } }, [badgeEl])
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

    // ---------- Agent 工具调用卡片（tool.call.toolview）：xueqiu_quote / xueqiu_kline ----------
    // execute 返回 JSON 字符串；从 tool-result block 的 content 里递归找 text 再 parse（us-stocks 同款防御）。
    function xqToolText(content, depth) {
      depth = depth || 0
      if (depth > 3 || !Array.isArray(content)) return undefined
      for (let i = 0; i < content.length; i++) {
        const b = content[i]
        if (!b || typeof b !== 'object') continue
        if (b.type === 'text' && typeof b.text === 'string') return b.text
        const nested = xqToolText(b.content, depth + 1)
        if (nested !== undefined) return nested
      }
      return undefined
    }
    function xqParseResult(block) {
      // block 可能是运行中（无 kind）或已完成（kind=tool-result）
      if (!block || typeof block !== 'object') return null
      const text = xqToolText(block.content)
      if (text === undefined) return null
      try {
        const v = JSON.parse(text)
        return (v && typeof v === 'object') ? v : null
      } catch (e) { return null }
    }

    function QuoteCard(props) {
      const block = props.block
      const r = xqParseResult(block)
      if (!r) return el('div', { className: 'xq-tv-shell' }, block && block.kind ? '结果不可读' : '查询中…')
      const list = Array.isArray(r.list) ? r.list : []
      if (!list.length) return el('div', { className: 'xq-tv-shell' }, '无行情数据（检查代码，或先用 xueqiu_search 查代码）')
      return el('div', { className: 'xq-tv-shell' }, [
        el('div', { key: 'h', className: 'xq-tv-head' }, [
          el('span', { key: 't', className: 'xq-tv-title' }, '雪球行情'),
          el('span', { key: 'n', className: 'xq-tv-pill' }, list.length + ' 只'),
          r.status ? el('span', { key: 's', className: 'xq-tv-pill' }, r.status) : null
        ]),
        el('div', { key: 'b', className: 'xq-tv-table' }, list.map(function (q) {
          const up = Number(q.percent) > 0, dn = Number(q.percent) < 0
          return el('div', { key: q.symbol, className: 'xq-tv-row' }, [
            el('span', { key: 'n', className: 'xq-tv-name' }, [
              String(q.name || ''),
              el('span', { key: 'c', className: 'xq-tv-code' }, ' ' + String(q.symbol || ''))
            ]),
            el('span', { key: 'p', className: 'xq-tv-price ' + (up ? 'xq-up' : dn ? 'xq-down' : '') }, fmt(q.current)),
            el('span', { key: 'g', className: 'xq-tv-pct ' + (up ? 'xq-up' : dn ? 'xq-down' : '') },
              fmtPct(q.percent))
          ])
        }))
      ])
    }

    function KlineCard(props) {
      const block = props.block
      const r = xqParseResult(block)
      if (!r) return el('div', { className: 'xq-tv-shell' }, block && block.kind ? '结果不可读' : '查询中…')
      if (r.error) return el('div', { className: 'xq-tv-shell' }, String(r.error))
      const rows = Array.isArray(r.rows) ? r.rows : []
      if (!rows.length) return el('div', { className: 'xq-tv-shell' }, '无K线数据')
      const first = rows[0], last = rows[rows.length - 1]
      const chgPct = Number(first.close) ? (Number(last.close) - Number(first.close)) / Number(first.close) * 100 : 0
      const lb = { '1m': '1分', '5m': '5分', '15m': '15分', '30m': '30分', '60m': '60分', day: '日K', week: '周K', month: '月K' }
      // 复用面板蜡烛图（rows 字段兼容：卡片 rows 已含 open/high/low/close/volume）
      return el('div', { className: 'xq-tv-shell' }, [
        el('div', { key: 'h', className: 'xq-tv-head' }, [
          el('span', { key: 't', className: 'xq-tv-title' }, String(r.symbol || '')),
          el('span', { key: 'p', className: 'xq-tv-pill' }, lb[r.period] || r.period || '日K'),
          el('span', { key: 'n', className: 'xq-tv-pill' }, rows.length + ' 根'),
          rows.length > 1 ? el('span', { key: 'd', className: 'xq-tv-pill' },
            String(first.time || '').slice(0, 10) + ' → ' + String(last.time || '').slice(0, 10)) : null,
          el('span', { key: 'g', className: 'xq-tv-pct ' + (chgPct > 0 ? 'xq-up' : chgPct < 0 ? 'xq-down' : ''), style: { marginLeft: 'auto' } },
            fmt(last.close) + '  ' + (chgPct >= 0 ? '+' : '') + chgPct.toFixed(2) + '%')
        ]),
        el(KlineChart, { key: 'c' + rows.length, symbol: String(r.symbol || ''), rows: rows })
      ])
    }

    function HotCard(props) {
      const block = props.block
      const r = xqParseResult(block)
      if (!r) return el('div', { className: 'xq-tv-shell' }, block && block.kind ? '结果不可读' : '查询中…')
      const list = Array.isArray(r.list) ? r.list : []
      if (!list.length) return el('div', { className: 'xq-tv-shell' }, '无热榜数据')
      const mk = { cn: 'A股', hk: '港股', us: '美股', global: '全球' }
      return el('div', { className: 'xq-tv-shell' }, [
        el('div', { key: 'h', className: 'xq-tv-head' }, [
          el('span', { key: 't', className: 'xq-tv-title' }, '雪球热榜'),
          el('span', { key: 'm', className: 'xq-tv-pill' }, mk[r.market] || r.market || 'A股'),
          el('span', { key: 'n', className: 'xq-tv-pill' }, list.length + ' 只')
        ]),
        el('div', { key: 'b', className: 'xq-tv-table' }, list.map(function (h, i) {
          const up = Number(h.percent) > 0, dn = Number(h.percent) < 0
          const rc = Number(h.rank_change)
          return el('div', { key: h.symbol || i, className: 'xq-tv-row' }, [
            el('span', { key: 'r', className: 'xq-tv-rank' }, String(i + 1)),
            el('span', { key: 'n', className: 'xq-tv-name' }, [
              String(h.name || ''),
              el('span', { key: 'c', className: 'xq-tv-code' }, ' ' + String(h.symbol || ''))
            ]),
            rc > 0 ? el('span', { key: 'rc', className: 'xq-tv-rankup', title: '热度排名上升' }, '↑' + rc) :
              rc < 0 ? el('span', { key: 'rc', className: 'xq-tv-rankdn', title: '热度排名下降' }, '↓' + (-rc)) : null,
            el('span', { key: 'p', className: 'xq-tv-price ' + (up ? 'xq-up' : dn ? 'xq-down' : '') }, fmt(h.current)),
            el('span', { key: 'g', className: 'xq-tv-pct ' + (up ? 'xq-up' : dn ? 'xq-down' : '') },
              fmtPct(h.percent))
          ])
        }))
      ])
    }

    function NewsCard(props) {
      const block = props.block
      const r = xqParseResult(block)
      if (!r) return el('div', { className: 'xq-tv-shell' }, block && block.kind ? '结果不可读' : '查询中…')
      const items = Array.isArray(r.items) ? r.items : []
      if (!items.length) return el('div', { className: 'xq-tv-shell' }, '无快讯')
      return el('div', { className: 'xq-tv-shell' }, [
        el('div', { key: 'h', className: 'xq-tv-head' }, [
          el('span', { key: 't', className: 'xq-tv-title' }, '雪球快讯'),
          el('span', { key: 'n', className: 'xq-tv-pill' }, items.length + ' 条')
        ]),
        el('div', { key: 'b', className: 'xq-tv-news' }, items.map(function (n, i) {
          const t = String(n.time || '')
          return el('div', { key: n.id || i, className: 'xq-tv-item' + (n.mark === 1 ? ' xq-tv-mark' : '') }, [
            el('span', { key: 'tm', className: 'xq-tv-time' }, t.slice(11, 16) || t.slice(5, 16)),
            el('span', { key: 'tx', className: 'xq-tv-text' }, [
              n.mark === 1 ? el('b', { key: 'm', className: 'xq-tv-flag' }, '重要 ') : null,
              String(n.text || '')
            ])
          ])
        }))
      ])
    }

    // ---------- 注册 ----------
    const slots = ctx.get('slots')
    if (slots === undefined) return
    slots.inject('tool.call.toolview', function () {
      return slots.register(
        { name: 'tool.call.toolview', key: 'xueqiu_quote' },
        function (props) { return el(QuoteCard, props) }
      )
    })
    slots.inject('tool.call.toolview', function () {
      return slots.register(
        { name: 'tool.call.toolview', key: 'xueqiu_kline' },
        function (props) { return el(KlineCard, props) }
      )
    })
    slots.inject('tool.call.toolview', function () {
      return slots.register(
        { name: 'tool.call.toolview', key: 'xueqiu_hot' },
        function (props) { return el(HotCard, props) }
      )
    })
    slots.inject('tool.call.toolview', function () {
      return slots.register(
        { name: 'tool.call.toolview', key: 'xueqiu_news' },
        function (props) { return el(NewsCard, props) }
      )
    })
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
