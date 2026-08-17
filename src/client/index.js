export default {

  inject: ['timer', 'connection'],
  apply(ctx) {
    styles.insert('\n' +
      '.xq-float{position:fixed;right:16px;bottom:16px;width:720px;max-width:92vw;max-height:82vh;display:flex;flex-direction:column;background:var(--dsw-alias-bg-layer-1);border:1px solid var(--dsw-alias-border-l2);border-radius:12px;box-shadow:0 10px 40px rgba(0,0,0,.28);z-index:1200;pointer-events:auto;overflow:hidden;font-size:13px;line-height:1.45;color:var(--dsw-alias-label-primary);}\n' +
      '.xq-float *{box-sizing:border-box;}\n' +
      '.xq-title{display:flex;align-items:center;gap:8px;padding:8px 12px;border-bottom:1px solid var(--dsw-alias-border-l1);cursor:grab;user-select:none;flex-shrink:0;}\n' +
      '.xq-title:active{cursor:grabbing;}\n' +
      '.xq-min{cursor:pointer;width:auto;max-width:520px;flex-direction:row;align-items:center;gap:10px;padding:7px 12px;}\n' +
      '.xq-body{overflow-y:auto;flex:1;padding:0 12px 10px;}\n' +
      '.xq-entry{display:flex;align-items:center;gap:10px;cursor:pointer;width:100%;max-width:760px;background:var(--dsw-alias-bg-layer-1);border:1px solid var(--dsw-alias-border-l1);border-radius:10px;padding:7px 12px;}\n' +
      '.xq-entry:hover{border-color:var(--dsw-alias-brand-primary);}\n' +
      '.xq-entry *{box-sizing:border-box;}\n' +
      '.xq-head{display:flex;align-items:center;gap:8px;margin-bottom:8px;}\n' +
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
      '.xq-card-t{font-size:12px;font-weight:700;margin-bottom:6px;display:flex;align-items:center;gap:8px;}\n' +
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
      '.xq-sum{font-size:11.5px;color:var(--dsw-alias-label-secondary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}\n' +
      '.xq-caret{font-size:11px;color:var(--dsw-alias-label-secondary);flex-shrink:0;}\n' +
      '.xq-loading{font-size:12px;color:var(--dsw-alias-label-secondary);padding:12px 0;text-align:center;}\n'
    )

    function el(type, props, children) { return React.createElement(type, props, children) }

    async function call(action, args) {
      const res = await ctx.connection.rpc.call('/xueqiu', 'call', { action: action, args: args || {} })
      if (!res || !res.ok) throw new Error((res && (res.error && (res.error.message || res.error.code) || res.error)) || '调用失败')
      return res.value
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

    // 组件间事件总线（Panel / Entry / Ticker 共享）
    const bus = {
      fns: [],
      on: function (fn) {
        this.fns.push(fn)
        const self = this
        return function () {
          const i = self.fns.indexOf(fn)
          if (i !== -1) self.fns.splice(i, 1)
        }
      },
      emit: function (ev) {
        const fns = this.fns.slice()
        for (let i = 0; i < fns.length; i++) {
          try { fns[i](ev) } catch (e) { /* ignore */ }
        }
      }
    }

    // （saveUi / dragRef / ui 共享状态见下方新块）

    // ---------- K线蜡烛图（含成交量与均线 + 十字光标/悬浮详情） ----------
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
      // 十字光标 + 悬浮详情
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

    // ---------- 分时图（含十字光标/悬浮详情） ----------
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

    // ---------- 共享 UI 状态（悬浮/嵌入/位置/尺寸/标签页） ----------
    const ui = {
      mode: 'floating', pos: null, size: { w: 720, h: 640 }, dockW: 720,
      snap: null, snapEdge: null, snapW: 380, max: false,
      minimized: false, tab: 'market', closed: false, hydrated: false,
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

    function viewport() {
      try { if (typeof window !== 'undefined' && window.innerWidth) return { w: window.innerWidth, h: window.innerHeight } } catch (e) { /* ignore */ }
      try { if (typeof document !== 'undefined' && document.documentElement && document.documentElement.clientWidth) return { w: document.documentElement.clientWidth, h: document.documentElement.clientHeight } } catch (e) { /* ignore */ }
      return null
    }

    // 保存 UI 状态（防抖）
    const saveUi = ctx.debounce(function () {
      call('ui.set', {
        mode: ui.mode, pos: ui.pos, size: ui.size, dockW: ui.dockW,
        snap: ui.snap, snapEdge: ui.snapEdge, snapW: ui.snapW,
        tab: ui.tab, minimized: ui.minimized
      }).catch(function () { /* 忽略 */ })
    }, 800)

    // 拖拽 / 缩放用可变引用（实例唯一）
    let dragRef = null
    let resizeRef = null
    let dragStart = null
    let suppressSnap = false

    // ---------- 面板内容（数据 + tabs + 详情），由悬浮/嵌入外壳共用 ----------
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
      const [updatedAt, setUpdatedAt] = React.useState(null)
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
          setUpdatedAt(Date.now())
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

      // 初始加载
      React.useEffect(function () {
        setLoading(true)
        refreshMarket().then(function () { return refreshContent() })
          .then(function () { setLoading(false) })
          .catch(function () { setLoading(false) })
        return function () { /* 一次性 */ }
      }, [])

      // 智能刷新：盘中 20s/60s，收盘 60s/180s
      React.useEffect(function () {
        const marketMs = marketOpen ? 20000 : 60000
        const contentMs = marketOpen ? 60000 : 180000
        const stopA = ctx.interval(function () { refreshMarket() }, marketMs)
        const stopB = ctx.interval(function () { refreshContent() }, contentMs)
        return function () { if (stopA) stopA(); if (stopB) stopB() }
      }, [marketOpen])

      // 个股详情（指数等无财务/热议数据的标的逐项容错，不整单失败）
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

      // Esc 逐级返回：先关详情，再通知外壳收起（输入框内不触发）
      React.useEffect(function () {
        if (typeof window === 'undefined' || !window.addEventListener) return function () {}
        function onKey(e) {
          if (e.key !== 'Escape') return
          const t = e.target
          if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return
          if (view) setView(null)
          else bus.emit('esc')
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

      // 行情 tab
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
            el('div', { key: 'v', className: 'xq-sub xq-vol-col' }, fmtVol(q.volume)),
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

      // 个股详情
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

      // 热榜 tab
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

      // 搜索 tab
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

      // 快讯 tab
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

    // ---------- 悬浮外壳（shell.overlay）：自由拖拽 + 左右边缘贴靠 + 四角磁吸 + 缩放 ----------
    function FloatingShell() {
      const [, force] = React.useState(0)
      const [fIdx, setFIdx] = React.useState([])
      const [fOpen, setFOpen] = React.useState(true)
      const [dragTarget, setDragTarget] = React.useState(null)
      React.useEffect(function () {
        let alive = true
        function refresh() {
          call('quote', { symbols: ['SH000001', 'SZ399001', 'SZ399006', 'SH000300'] }).then(function (data) {
            if (!alive) return
            setFIdx((data && data.list) || [])
            const st = data ? data.status : null
            setFOpen(st === 5 || st === 6)
          }).catch(function () { /* 静默失败 */ })
        }
        refresh()
        const stop = ctx.interval(refresh, 60000)
        return function () { alive = false; if (stop) stop() }
      }, [])
      React.useEffect(function () {
        let alive = true
        call('ui.get', {}).then(function (d) {
          if (!alive) return
          if (d && d.mode) ui.set({ mode: d.mode })
          if (d && d.pos) ui.set({ pos: { x: Number(d.pos.x), y: Number(d.pos.y) } })
          if (d && d.size) ui.set({ size: { w: Number(d.size.w), h: Number(d.size.h) } })
          if (d && d.dockW) ui.set({ dockW: Number(d.dockW) })
          if (d && d.snap) ui.set({ snap: d.snap })
          if (d && (d.snapEdge === 'left' || d.snapEdge === 'right')) ui.set({ snapEdge: d.snapEdge })
          if (d && d.snapW) ui.set({ snapW: Number(d.snapW) })
          if (d && d.tab) ui.set({ tab: d.tab })
          ui.set({ minimized: !!(d && d.minimized), hydrated: true })
        }).catch(function () { ui.set({ hydrated: true }) })
        const offUi = ui.subscribe(function () {
          force(function (x) { return x + 1 })
          if (ui.hydrated) saveUi()
        })
        const offBus = bus.on(function (ev) {
          if (ev === 'open') { ui.set({ closed: false, minimized: false, mode: 'floating' }) }
          else if (ev === 'esc') { if (!ui.minimized && !ui.closed) ui.set({ minimized: true }) }
        })
        return function () { alive = false; offUi(); offBus() }
      }, [])

      if (ui.mode !== 'floating' || ui.closed || !ui.hydrated) return null
      const s = ui.size

      // 拖拽（贴靠/最大化状态下按下标题栏 → 解除并回到自由）
      function onTitleDown(e) {
        if (e.pointerType === 'mouse' && e.button !== 0) return
        dragStart = { x: e.clientX, y: e.clientY }
        if (ui.max) {
          // 最大化被拖动 → 还原到光标下方，本次松手不磁吸
          ui.set({ max: false, snapEdge: null, snap: null, pos: { x: e.clientX - 30, y: e.clientY - 16 } })
          suppressSnap = true
        } else if (ui.snapEdge) {
          // 解除贴靠：面板从按下位置转为自由，本次松手不再磁吸
          ui.set({ snapEdge: null, snap: null, pos: { x: e.clientX - 30, y: e.clientY - 16 } })
          suppressSnap = true
        }
        const baseX = ui.pos ? ui.pos.x : e.clientX
        const baseY = ui.pos ? ui.pos.y : e.clientY
        dragRef = { dx: e.clientX - baseX, dy: e.clientY - baseY }
        ui.set({ snap: null })
        setDragTarget(null)
        try { e.currentTarget.setPointerCapture(e.pointerId) } catch (err) { /* ignore */ }
      }
      function onTitleMove(e) {
        if (!dragRef) return
        ui.set({ pos: { x: Math.max(4, e.clientX - dragRef.dx), y: Math.max(4, e.clientY - dragRef.dy) } })
        const vp = viewport()
        if (vp) {
          if (e.clientX >= vp.w - 70) setDragTarget('right')
          else if (e.clientX <= 70) setDragTarget('left')
          else setDragTarget(null)
        }
      }
      function onTitleUp(e) {
        const moved = dragStart ? Math.sqrt(Math.pow(e.clientX - dragStart.x, 2) + Math.pow(e.clientY - dragStart.y, 2)) : 0
        dragRef = null
        dragStart = null
        try { if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId) } catch (err) { /* ignore */ }
        if (suppressSnap) { suppressSnap = false; setDragTarget(null); return }
        if (dragTarget) {
          ui.set({ snapEdge: dragTarget, pos: null, snap: null, snapW: ui.snapW || 380 })
          setDragTarget(null)
          return
        }
        setDragTarget(null)
        if (moved >= 6) snapCheck()
      }
      // 四角磁吸：拖放终点靠近任一屏幕角 → 吸附
      function snapCheck() {
        const vp = viewport()
        const p = ui.pos
        if (!vp || !p) return
        const corners = [
          { key: 'tl', x: 8, y: 8 },
          { key: 'tr', x: vp.w - s.w - 8, y: 8 },
          { key: 'bl', x: 8, y: vp.h - s.h - 8 },
          { key: 'br', x: vp.w - s.w - 8, y: vp.h - s.h - 8 }
        ]
        let best = null, bestD = 110
        for (let i = 0; i < corners.length; i++) {
          const c = corners[i]
          const d = Math.sqrt(Math.pow(p.x - c.x, 2) + Math.pow(p.y - c.y, 2))
          if (d < bestD) { bestD = d; best = c }
        }
        ui.set({ pos: best ? { x: Math.max(0, best.x), y: Math.max(0, best.y) } : p, snap: best ? best.key : null })
      }
      // 📌 循环：右下角 → 右侧窄栏贴靠 → 解除
      function toggleSnap() {
        const vp = viewport()
        if (ui.snapEdge === 'right') { ui.set({ snapEdge: null }); return }
        if (ui.snap === 'br') {
          ui.set({ snap: null })
          if (vp) ui.set({ snapEdge: 'right', pos: null, snapW: ui.snapW || 380 })
          return
        }
        if (vp) { ui.set({ snap: 'br', pos: { x: Math.max(0, vp.w - s.w - 8), y: Math.max(0, vp.h - s.h - 8) } }) }
        else { ui.set({ snap: 'br', pos: null }) }
      }
      // 最大化 / 还原（双击标题栏或点按钮）
      function toggleMax() {
        ui.set({ max: !ui.max })
      }
      // 缩放（右下角手柄；贴靠时只调宽度；最大化时从视口有效尺寸起算）
      function onRsDown(e) {
        if (e.pointerType === 'mouse' && e.button !== 0) return
        let baseW = s.w, baseH = s.h
        if (ui.max) {
          const vp = viewport()
          if (vp) { baseW = vp.w - 16; baseH = vp.h - 16 }
        }
        resizeRef = ui.snapEdge
          ? { w: ui.snapW, h: 0, x: e.clientX, y: e.clientY }
          : { w: baseW, h: baseH, x: e.clientX, y: e.clientY }
        try { e.currentTarget.setPointerCapture(e.pointerId) } catch (err) { /* ignore */ }
      }
      function onRsMove(e) {
        if (!resizeRef) return
        if (ui.snapEdge) {
          const w = Math.min(Math.max(300, resizeRef.w + (e.clientX - resizeRef.x)), 560)
          ui.set({ snapW: w })
        } else {
          const w = Math.min(Math.max(460, resizeRef.w + (e.clientX - resizeRef.x)), 1100)
          const h = Math.min(Math.max(380, resizeRef.h + (e.clientY - resizeRef.y)), 1000)
          ui.set({ size: { w: w, h: h }, snap: null, max: false })
        }
      }
      function onRsUp(e) {
        resizeRef = null
        try { if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId) } catch (err) { /* ignore */ }
      }

      const dragProps = { onPointerDown: onTitleDown, onPointerMove: onTitleMove, onPointerUp: onTitleUp, onPointerCancel: onTitleUp }
      const rsProps = { onPointerDown: onRsDown, onPointerMove: onRsMove, onPointerUp: onRsUp, onPointerCancel: onRsUp }

      // 贴靠助手预览（拖动中靠近边缘时显示）
      let snapPreview = null
      if (dragTarget) {
        snapPreview = el('div', {
          key: 'prev', className: 'xq-snap-preview xq-snap-' + dragTarget,
          style: { width: ui.snapW || 380 }
        })
      }

      // 最小化条
      if (ui.minimized) {
        const idxLine = fIdx.map(function (q) {
          return q.name + ' ' + fmt(q.current) + ' ' + fmtPct(q.percent)
        }).join(' · ')
        let minStyle = null
        if (ui.snapEdge === 'right') minStyle = { right: 0, top: 0, bottom: 0, width: ui.snapW, height: 'auto' }
        else if (ui.snapEdge === 'left') minStyle = { left: 0, top: 0, bottom: 0, width: ui.snapW, height: 'auto' }
        else if (ui.pos) minStyle = { left: ui.pos.x, top: ui.pos.y, right: 'auto', bottom: 'auto' }
        return el('div', { className: 'xq-wrap' }, [
          el('div', { key: 'min', className: 'xq-float xq-min' + (ui.snapEdge ? ' xq-snapped' : ''), style: minStyle, onClick: function () { ui.set({ minimized: false }) } }, [
            el('span', { key: 'logo', className: 'xq-logo' }, [el('b', { key: 'b' }, '雪球'), ' mini']),
            el('span', { key: 'sum', className: 'xq-sum' }, idxLine || '点击展开行情面板'),
            el('span', { key: 'sp', className: 'xq-spacer' }),
            el('button', { key: 'x', className: 'xq-btn-mini', onClick: function (e) { e.stopPropagation(); ui.set({ closed: true }) } }, '✕'),
            el('span', { key: 'caret', className: 'xq-caret' }, '展开 ▾')
          ]),
          snapPreview
        ])
      }

      const snapped = ui.snapEdge ? ' xq-snapped xq-narrow' : (ui.snap ? ' xq-snapped' : '')
      const titleBar = el('div', {
        className: 'xq-title', ...dragProps,
        onDoubleClick: function (e) { e.stopPropagation(); toggleMax() }
      }, [
        el('span', { key: 'logo', className: 'xq-logo' }, [el('b', { key: 'b' }, '雪球'), ' mini']),
        el('span', { key: 'st', className: 'xq-status' + (fOpen ? ' xq-live' : '') }, fOpen ? '● 盘中' : '已收盘'),
        el('span', { key: 'upd', className: 'xq-update' }, ui.max ? '已最大化 · 拖动标题栏还原' : ui.snapEdge === 'right' ? '已贴右 · 拖走解除' : ui.snapEdge === 'left' ? '已贴左 · 拖走解除' : '拖到左/右边缘贴靠 · 双击最大化'),
        el('span', { key: 'sp', className: 'xq-spacer' }),
        el('button', { key: 'snap', className: 'xq-btn-mini', title: '循环：右下角 → 右侧窄栏 → 解除', onPointerDown: function (e) { e.stopPropagation() }, onClick: function (e) { e.stopPropagation(); toggleSnap() } }, ui.snapEdge === 'right' ? '◫' : ui.snap === 'br' ? '📌' : '📍'),
        el('button', { key: 'max', className: 'xq-btn-mini', title: ui.max ? '还原（双击标题栏同效）' : '最大化（双击标题栏同效）', onPointerDown: function (e) { e.stopPropagation() }, onClick: function (e) { e.stopPropagation(); toggleMax() } }, ui.max ? '⤡' : '⤢'),
        el('button', { key: 'dock', className: 'xq-btn-mini', title: '嵌入到输入框上方（不遮挡对话）', onPointerDown: function (e) { e.stopPropagation() }, onClick: function (e) { e.stopPropagation(); ui.set({ mode: 'docked', minimized: false }) } }, '嵌入'),
        el('button', { key: 'min', className: 'xq-btn-mini', title: '收起', onPointerDown: function (e) { e.stopPropagation() }, onClick: function (e) { e.stopPropagation(); ui.set({ minimized: true }) } }, '—'),
        el('button', { key: 'cls', className: 'xq-btn-mini', title: '关闭（点底部指数条重新打开）', onPointerDown: function (e) { e.stopPropagation() }, onClick: function (e) { e.stopPropagation(); ui.set({ closed: true }) } }, '✕')
      ])

      return el('div', { className: 'xq-wrap' }, [
        el('div', { key: 'f', className: 'xq-float' + snapped, style: posStyle() }, [
          titleBar,
          el('div', { key: 'body', className: 'xq-body' }, [
            el(XueqiuPanel, null)
          ]),
          el('div', { key: 'rs', className: 'xq-resize', ...rsProps })
        ]),
        snapPreview
      ])
    }

    function posStyle() {
      if (ui.max) return { left: 8, top: 8, right: 8, bottom: 8, width: 'auto', height: 'auto' }
      if (ui.snapEdge === 'right') return { right: 0, top: 0, bottom: 0, left: 'auto', width: ui.snapW }
      if (ui.snapEdge === 'left') return { left: 0, top: 0, bottom: 0, right: 'auto', width: ui.snapW }
      if (ui.pos) return { left: ui.pos.x, top: ui.pos.y, right: 'auto', bottom: 'auto', width: ui.size.w, height: ui.size.h }
      return { width: ui.size.w, height: ui.size.h }
    }

    // ---------- 嵌入外壳（conversation.input.dock）：输入框上方，不遮挡对话 ----------
    function DockedShell() {
      const [, force] = React.useState(0)
      React.useEffect(function () {
        const off = ui.subscribe(function () { force(function (x) { return x + 1 }) })
        const offBus = bus.on(function (ev) {
          if (ev === 'esc') { if (!ui.minimized) ui.set({ minimized: true }) }
        })
        return function () { off(); offBus() }
      }, [])
      if (ui.mode !== 'docked' || !ui.hydrated) return null

      function onDwDown(e) {
        if (e.pointerType === 'mouse' && e.button !== 0) return
        resizeRef = { w: ui.dockW, h: 0, x: e.clientX, y: e.clientY }
        try { e.currentTarget.setPointerCapture(e.pointerId) } catch (err) { /* ignore */ }
      }
      function onDwMove(e) {
        if (!resizeRef) return
        ui.set({ dockW: Math.min(Math.max(480, resizeRef.w + (e.clientX - resizeRef.x)), 1100) })
      }
      function onDwUp(e) {
        resizeRef = null
        try { if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId) } catch (err) { /* ignore */ }
      }

      if (ui.minimized) {
        return el('div', { className: 'xq-docked xq-docked-min', style: { width: ui.dockW }, onClick: function () { ui.set({ minimized: false }) } }, [
          el('span', { key: 'logo', className: 'xq-logo' }, [el('b', { key: 'b' }, '雪球'), ' mini']),
          el('span', { key: 'sum', className: 'xq-sum' }, '点击展开行情面板'),
          el('span', { key: 'sp', className: 'xq-spacer' }),
          el('span', { key: 'caret', className: 'xq-caret' }, '展开 ▾')
        ])
      }

      return el('div', { className: 'xq-docked', style: { width: ui.dockW } }, [
        el('div', { key: 'title', className: 'xq-title' }, [
          el('span', { key: 'logo', className: 'xq-logo' }, [el('b', { key: 'b' }, '雪球'), ' mini']),
          el('span', { key: 'hint', className: 'xq-update' }, '已嵌入 · 不遮挡对话'),
          el('span', { key: 'sp', className: 'xq-spacer' }),
          el('button', { key: 'float', className: 'xq-btn-mini', title: '切换回悬浮模式', onClick: function () { ui.set({ mode: 'floating', minimized: false }) } }, '悬浮'),
          el('button', { key: 'min', className: 'xq-btn-mini', title: '收起', onClick: function () { ui.set({ minimized: true }) } }, '—')
        ]),
        el('div', { key: 'body', className: 'xq-body' }, [
          el(XueqiuPanel, null)
        ]),
        el('div', { key: 'rs', className: 'xq-resize xq-resize-w', onPointerDown: onDwDown, onPointerMove: onDwMove, onPointerUp: onDwUp, onPointerCancel: onDwUp })
      ])
    }

    // ---------- 输入框上方入口条（仅悬浮模式下显示） ----------
    function Entry() {
      const [indices, setIndices] = React.useState([])
      const [, force] = React.useState(0)
      React.useEffect(function () {
        let alive = true
        function refresh() {
          call('quote', { symbols: ['SH000001', 'SZ399001', 'SZ399006', 'SH000300'] }).then(function (data) {
            if (alive) setIndices((data && data.list) || [])
          }).catch(function () { /* 静默失败 */ })
        }
        refresh()
        const off = ui.subscribe(function () { force(function (x) { return x + 1 }) })
        const stop = ctx.interval(refresh, 60000)
        return function () { alive = false; off(); if (stop) stop() }
      }, [])
      if (ui.mode === 'docked') return null
      const line = indices.map(function (q) {
        return q.name + ' ' + fmt(q.current) + ' ' + fmtPct(q.percent)
      }).join(' · ')
      return el('div', { className: 'xq-entry', onClick: function () { bus.emit('open') } }, [
        el('span', { key: 'logo', className: 'xq-logo' }, [el('b', { key: 'b' }, '雪球'), ' mini']),
        el('span', { key: 'sum', className: 'xq-sum' }, line || '点击打开行情面板'),
        el('span', { key: 'caret', className: 'xq-caret' }, '打开 ▾')
      ])
    }

    // ---------- 底部指数条 ----------
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
      return el('div', { className: 'xq-ticker', onClick: function () { bus.emit('open') } }, kids)
    }

    // 追加样式：嵌入外壳 / 缩放手柄 / 磁吸动画
    styles.insert(
      '.xq-docked{background:var(--dsw-alias-bg-layer-1);border:1px solid var(--dsw-alias-border-l1);border-radius:10px;overflow:hidden;position:relative;font-size:13px;line-height:1.45;color:var(--dsw-alias-label-primary);margin-bottom:2px;}\n' +
      '.xq-docked *{box-sizing:border-box;}\n' +
      '.xq-docked-min{display:flex;align-items:center;gap:10px;cursor:pointer;padding:6px 12px;}\n' +
      '.xq-docked .xq-title{cursor:default;}\n' +
      '.xq-resize{position:absolute;right:2px;bottom:2px;width:18px;height:18px;cursor:nwse-resize;z-index:6;}\n' +
      '.xq-resize::after{content:"";position:absolute;right:4px;bottom:4px;width:8px;height:8px;border-right:2px solid var(--dsw-alias-label-secondary);border-bottom:2px solid var(--dsw-alias-label-secondary);opacity:.55;}\n' +
      '.xq-resize-w{position:absolute;right:0;top:0;bottom:0;width:10px;cursor:ew-resize;z-index:6;}\n' +
      '.xq-resize-w::after{display:none;}\n' +
      '.xq-snapped{transition:left .16s ease, top .16s ease;}\n' +
      '.xq-wrap{pointer-events:none;position:fixed;inset:0;z-index:1200;}\n' +
      '.xq-wrap .xq-float{pointer-events:auto;}\n' +
      '.xq-snap-preview{position:fixed;top:8px;bottom:8px;border:2px solid var(--dsw-alias-brand-primary);border-radius:10px;background:var(--dsw-alias-brand-primary);opacity:.13;pointer-events:none;z-index:1199;}\n' +
      '.xq-snap-right{right:8px;}\n' +
      '.xq-snap-left{left:8px;}\n' +
      '.xq-float.xq-narrow .xq-grid-hd,.xq-float.xq-narrow .xq-grid-row{grid-template-columns:1.5fr 1fr 1fr 62px;}\n' +
      '.xq-float.xq-narrow .xq-vol-col{display:none;}\n' +
      '.xq-float.xq-narrow .xq-idx-card{min-width:88px;padding:5px 6px;}\n' +
      '.xq-float.xq-narrow .xq-idx-cur{font-size:12px;}\n' +
      '.xq-float.xq-narrow .xq-stats{grid-template-columns:repeat(2,1fr);}\n' +
      '.xq-float.xq-narrow .xq-detail-cur{font-size:16px;}\n' +
      '.xq-float.xq-narrow .xq-periods button,.xq-float.xq-narrow .xq-modes button{padding:2px 6px;}\n'
    )

    // ---------- 注册 ----------
    const slots = ctx.get('slots')
    if (slots === undefined) return
    slots.inject('shell.overlay', function () {
      return slots.register(
        { name: 'shell.overlay', id: 'xueqiu-panel' },
        function () { return el(FloatingShell, null) }
      )
    })
    slots.inject('conversation.input.dock', function () {
      return slots.register(
        { name: 'conversation.input.dock', id: 'xueqiu-panel-entry', order: 30 },
        function () { return el(Entry, null) }
      )
    })
    slots.inject('conversation.input.dock', function () {
      return slots.register(
        { name: 'conversation.input.dock', id: 'xueqiu-docked', order: 31 },
        function () { return el(DockedShell, null) }
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