return {
  inject: ['timer'],
  apply(ctx) {
    styles.insert('\n' +
      '.xq-dock{background:var(--dsw-alias-bg-layer-1);border:1px solid var(--dsw-alias-border-l1);border-radius:10px;overflow:hidden;font-size:13px;line-height:1.45;color:var(--dsw-alias-label-primary);margin-bottom:6px;}\n' +
      '.xq-dock *{box-sizing:border-box;}\n' +
      '.xq-dock-head{display:flex;align-items:center;gap:8px;padding:7px 12px;border-bottom:1px solid var(--dsw-alias-border-l1);}\n' +
      '.xq-dock-body{max-height:56vh;overflow-y:auto;padding:8px 12px 10px;}\n' +
      '.xq-badge{position:fixed;right:16px;bottom:64px;display:flex;align-items:center;gap:8px;padding:5px 12px;border-radius:999px;background:var(--dsw-alias-bg-layer-1);border:1px solid var(--dsw-alias-border-l2);box-shadow:0 6px 24px rgba(0,0,0,.25);font-size:11.5px;line-height:1.4;color:var(--dsw-alias-label-primary);cursor:grab;user-select:none;pointer-events:auto;z-index:1200;}\n' +
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
      '.xq-loading{font-size:12px;color:var(--dsw-alias-label-secondary);padding:12px 0;text-align:center;}\n'
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

    // ---------- 共享 UI 状态：面板开合 / 当前标签 / 徽章位置 ----------
    const ui = {
      open: false, tab: 'market', badgePos: null, hydrated: false,
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
      call('ui.set', { tab: ui.tab, open: ui.open, badgePos: ui.badgePos }).catch(function () { /* 忽略 */ })
    }, 800)

    // 徽章拖拽引用（实例唯一）
    let badgeDrag = null
    let badgeMoved = false

    // ---------- K线蜡烛图（成交量 + 均线 + 十字光标/悬浮详情） ----------
    function KlineChart(props) {
      const rows = props.rows || []
      const [hi, setHi] = React.useState(null)
      if (!rows.length) return el('div', { className: 'xq-muted' }, '暂无K线数据')
      const W = 640, MAIN = 150, VOL = 44, PAD = 6, GAP = 4
      const H = MAIN + VOL + GAP + PAD
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
      const vBottom = H - PAD
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
        cross = [
          el('line', { key: 'cv', x1: cx, y1: PAD, x2: cx, y2: vBottom, stroke: 'var(--dsw-alias-label-secondary)', strokeWidth: 0.6, strokeDasharray: '3 3', opacity: 0.7 }),
          el('line', { key: 'ch', x1: PAD, y1: cy, x2: W - PAD, y2: cy, stroke: 'var(--dsw-alias-label-secondary)', strokeWidth: 0.6, strokeDasharray: '3 3', opacity: 0.7 })
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
      const W = 640, H = 170, PAD = 6
      let min = Infinity, max = -Infinity
      for (let i = 0; i < items.length; i++) {
        const c = Number(items[i].current)
        if (c < min) min = c
        if (c > max) max = c
      }
      if (lastClose) { if (lastClose < min) min = lastClose; if (lastClose > max) max = lastClose }
      if (!isFinite(min) || !isFinite(max) || min === max) { min -= 1; max += 1 }
      const range = max - min
      const yOf = function (v) { return PAD + (1 - (v - min) / range) * (H - PAD * 2) }
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
        cross = [
          el('line', { key: 'cv', x1: cx, y1: PAD, x2: cx, y2: H - PAD, stroke: 'var(--dsw-alias-label-secondary)', strokeWidth: 0.6, strokeDasharray: '3 3', opacity: 0.7 }),
          el('line', { key: 'ch', x1: PAD, y1: cy, x2: W - PAD, y2: cy, stroke: 'var(--dsw-alias-label-secondary)', strokeWidth: 0.6, strokeDasharray: '3 3', opacity: 0.7 })
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
      const [indices, setIndices] = React.useState([])
      const [hot, setHot] = React.useState([])
      const [hotMarket, setHotMarket] = React.useState('cn')
      const [news, setNews] = React.useState([])
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
      const tab = ui.tab
      function setTab(t) { ui.set({ tab: t }) }

      function refreshMarket() {
        return Promise.all([
          call('watchlist.get', {}),
          call('quote', { symbols: ['SH000001', 'SZ399001', 'SZ399006', 'SH000300'] })
        ]).then(function (res) {
          const wl = (res[0] && res[0].symbols) || []
          const status = res[1] ? res[1].status : null
          setMarketOpen(status === 5 || status === 6)
          setWatchlist(wl)
          setIndices((res[1] && res[1].list) || [])
          setErr('')
          if (!wl.length) return
          return call('quote', { symbols: wl }).then(function (data) {
            setQuotes((data && data.list) || [])
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
          setErr('')
        }).catch(function (e) {
          setErr(String((e && e.message) || e))
        })
      }

      React.useEffect(function () {
        setLoading(true)
        refreshMarket().then(function () { return refreshContent() })
          .then(function () { setLoading(false) })
          .catch(function () { setLoading(false) })
        return function () { /* 一次性 */ }
      }, [])

      React.useEffect(function () {
        const marketMs = marketOpen ? 20000 : 60000
        const contentMs = marketOpen ? 60000 : 180000
        const stopA = ctx.interval(function () { refreshMarket() }, marketMs)
        const stopB = ctx.interval(function () { refreshContent() }, contentMs)
        return function () { if (stopA) stopA(); if (stopB) stopB() }
      }, [marketOpen])

      React.useEffect(function () {
        if (!view) { setDetail(null); return }
        let alive = true
        setDetail(null)
        function fb(p) { return p.catch(function () { return null }) }
        Promise.all([
          fb(call('quoteDetail', { symbol: view })),
          fb(call('kline', { symbol: view, period: klinePeriod, count: 120 })),
          fb(call('minute', { symbol: view })),
          fb(call('finance', { symbol: view })),
          fb(call('kol', { symbol: view, count: 6 }))
        ]).then(function (res) {
          if (!alive) return
          setDetail({
            quote: (res[0] && res[0].quote) || {},
            kline: res[1] || { rows: [] },
            minute: res[2] || { items: [], last_close: null },
            finance: res[3] || { list: [] },
            kol: (res[4] && res[4].list) || []
          })
          if (!res[0]) setErr('详情加载失败，数据可能不完整')
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
          if (view) setView(null)
          else ui.set({ open: false })
        }
        window.addEventListener('keydown', onKey)
        return function () { window.removeEventListener('keydown', onKey) }
      }, [view])

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

      const tabs = el('div', { className: 'xq-tabs' }, [
        ['market', '行情'], ['hot', '热榜'], ['search', '搜索'], ['news', '快讯']
      ].map(function (t) {
        return el('button', {
          key: t[0], className: 'xq-tab' + (tab === t[0] ? ' xq-tab-active' : ''),
          onClick: function () { setTab(t[0]) }
        }, t[1])
      }).concat([
        el('span', { key: 'sp', className: 'xq-spacer' }),
        el('button', {
          key: 'btn', className: 'xq-btn', disabled: loading,
          onClick: function () {
            setLoading(true)
            Promise.all([refreshMarket(), refreshContent()]).then(function () { setLoading(false) }).catch(function () { setLoading(false) })
          }
        }, '刷新')
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
              el('span', { key: 'p', className: 'xq-idx-pct ' + colorOf(q.percent) }, fmtPct(q.percent))
            ])
          ])
        })
        const rows = sorted.map(function (q) {
          return el('div', { key: q.symbol, className: 'xq-grid-row', onClick: function () { openDetail(q.symbol) } }, [
            el('div', { key: 'n' }, [
              el('div', { key: 'a', className: 'xq-name' }, q.name),
              el('div', { key: 'b', className: 'xq-sub' }, q.symbol)
            ]),
            el('div', { key: 'c', className: colorOf(q.percent) }, fmt(q.current)),
            el('div', { key: 'p', className: colorOf(q.percent) }, fmtPct(q.percent)),
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
        const kids = news.map(function (it) {
          return el('div', { key: String(it.id), className: 'xq-news-item' + (it.mark === 1 ? ' xq-important' : '') }, [
            el('div', { key: 't' }, it.text),
            el('div', { key: 'm', className: 'xq-news-time' }, fmtTime(it.created_at) + (it.mark === 1 ? ' · 重要' : ''))
          ])
        })
        return news.length
          ? el('div', { className: 'xq-news' }, kids)
          : el('div', { className: 'xq-muted' }, '暂无快讯')
      }

      let content
      if (view) {
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

      return el('div', null, [tabs, errBox, content])
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
            ui.set({ badgePos: { x: Number(d.badgePos.x), y: Number(d.badgePos.y) } })
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
      React.useEffect(function () {
        const off = ui.subscribe(function () { if (ui.hydrated) saveUi() })
        return off
      }, [])
      return el('div', { className: 'xq-dock' }, [
        el('div', { key: 'head', className: 'xq-dock-head' }, [
          el('span', { key: 'logo', className: 'xq-logo' }, [el('b', { key: 'b' }, '雪球'), ' mini']),
          el('span', { key: 'st', className: 'xq-status' }, '行情面板'),
          el('span', { key: 'hint', className: 'xq-update' }, '已嵌入输入框上方 · Esc 收起'),
          el('span', { key: 'sp', className: 'xq-spacer' }),
          el('button', { key: 'min', className: 'xq-btn-mini', title: '收起（点右下角徽章重新打开）', onClick: function () { ui.set({ open: false }) } }, '收起 —')
        ]),
        el('div', { key: 'body', className: 'xq-dock-body' }, [
          el(XueqiuPanel, { key: 'panel' })
        ])
      ])
    }

    // ---------- 迷你悬浮徽章（shell.overlay）：可拖动，点击开合面板 ----------
    function MiniBadge() {
      const [idx, setIdx] = React.useState([])
      const [mOpen, setMOpen] = React.useState(true)
      const [, force] = React.useState(0)
      React.useEffect(function () {
        let alive = true
        function refresh() {
          call('quote', { symbols: ['SH000001', 'SZ399001'] }).then(function (data) {
            if (!alive) return
            setIdx((data && data.list) || [])
            const st = data ? data.status : null
            setMOpen(st === 5 || st === 6)
          }).catch(function () { /* 静默失败 */ })
        }
        refresh()
        const stop = ctx.interval(refresh, 30000)
        const off = ui.subscribe(function () { force(function (x) { return x + 1 }) })
        return function () { alive = false; if (stop) stop(); off() }
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
        ui.set({ badgePos: { x: x, y: y } })
      }
      function onUp(e) {
        badgeDrag = null
        try { if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId) } catch (err) { /* ignore */ }
        if (!badgeMoved) ui.set({ open: !ui.open })
      }

      const sh = idx[0], sz = idx[1]
      const style = ui.badgePos
        ? { left: ui.badgePos.x, top: ui.badgePos.y, right: 'auto', bottom: 'auto' }
        : null
      return el('div', {
        className: 'xq-badge',
        style: style,
        title: '点击开合行情面板 · 拖动调整位置',
        onPointerDown: onDown, onPointerMove: onMove, onPointerUp: onUp, onPointerCancel: onUp
      }, [
        el('span', { key: 'logo' }, [el('b', { key: 'b' }, '雪球'), 'mini']),
        el('span', { key: 'st', className: 'xq-status' + (mOpen ? ' xq-live' : '') }, mOpen ? '● 盘中' : '休市'),
        sh ? el('span', { key: 'sh' }, [
          el('span', { key: 'n', className: 'xq-badge-hint' }, sh.name + ' '),
          el('span', { key: 'v', className: 'xq-badge-val ' + colorOf(sh.percent) }, fmt(sh.current)),
          el('span', { key: 'p', className: colorOf(sh.percent) }, ' ' + fmtPct(sh.percent))
        ]) : null,
        sz ? el('span', { key: 'sz' }, [
          el('span', { key: 'n', className: 'xq-badge-hint' }, ' 深成指 '),
          el('span', { key: 'p', className: colorOf(sz.percent) }, fmtPct(sz.percent))
        ]) : null,
        el('span', { key: 'ct', className: 'xq-caret' }, ui.open ? '▾' : '▴')
      ])
    }

    // ---------- 底部指数条（会话页，输入框下方氛围行） ----------
    function Ticker() {
      const [indices, setIndices] = React.useState([])
      React.useEffect(function () {
        let alive = true
        function refresh() {
          call('quote', { symbols: ['SH000001', 'SZ399001', 'SZ399006', 'SH000300'] }).then(function (data) {
            if (alive) setIndices((data && data.list) || [])
          }).catch(function () { /* 静默失败 */ })
        }
        refresh()
        const stop = ctx.interval(refresh, 30000)
        return function () { alive = false; if (stop) stop() }
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
