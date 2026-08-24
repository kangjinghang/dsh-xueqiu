#!/usr/bin/env bash
# 浏览器交互回归（真实鼠标事件，非合成 dispatch）：
#   徽章结构、拖拽+持久化、⤡ 调宽+持久化、双击复位(null 落盘)、
#   面板开关、四 tab 数据渲染、越屏位置恢复钳制。
#
# 用法:
#   bash scripts/browser-interact.sh                                  # 默认 http://127.0.0.1:3080
#   BASE_URL=http://h:p bash scripts/browser-interact.sh              # 指定实例
# 前提: 目标实例已完成引导(有会话与 composer)，agent-browser 已安装。
#       隔离的全新实例不适用——onboarding 遮罩会拦截命中，且无会话则无 dock 槽位。
# 测试自动保存并在退出时恢复原 UI 状态（badgePos/badgeW/dockH/tab/open）。
set -uo pipefail
cd "$(dirname "$0")/.."
BASE_URL=${BASE_URL:-http://127.0.0.1:3080}
PORT=$(echo "$BASE_URL" | grep -o '[0-9]*$')
O="Origin: $BASE_URL"

FAIL=0
pass() { printf '  ✅ %s\n' "$*"; }
fail() { printf '  ❌ %s\n' "$*"; FAIL=1; }
rpc() { curl -s -m 20 -X POST "$BASE_URL/xq-rpc" -H "$O" -H 'Content-Type: application/json' -d "$1"; }
ev() { agent-browser eval "$1" 2>/dev/null; }

# ---- 状态保存/恢复 ----
SAVED=$(rpc '{"action":"ui.get","args":{}}')
spos=$(echo "$SAVED" | grep -o '"badgePos":{[^}]*}' | sed 's/"badgePos"://' || true)
sbw=$(echo "$SAVED" | grep -o '"badgeW":[0-9]*' | grep -o '[0-9]*$' || true)
sdh=$(echo "$SAVED" | grep -o '"dockH":[0-9]*' | grep -o '[0-9]*$' || true)
stab=$(echo "$SAVED" | grep -o '"tab":"[^"]*"' | cut -d'"' -f4 || true)
sopen=$(echo "$SAVED" | grep -o '"open":[a-z]*' | grep -o 'true\|false' || true)
restore() {
  local args=()
  [ -n "$stab" ] && args+=("\"tab\":\"$stab\"")
  [ -n "$sopen" ] && args+=("\"open\":$sopen")
  [ -n "$spos" ] && args+=("\"badgePos\":$spos")
  [ -n "$sbw" ] && args+=("\"badgeW\":$sbw")
  [ -n "$sdh" ] && args+=("\"dockH\":$sdh")
  [ ${#args[@]} -gt 0 ] && rpc "{\"action\":\"ui.set\",\"args\":{$(IFS=,; echo "${args[*]}")}}" >/dev/null
  return 0
}
trap 'agent-browser close >/dev/null 2>&1; restore >/dev/null 2>&1' EXIT

echo "==> 浏览器交互回归  base=$BASE_URL"
command -v agent-browser >/dev/null 2>&1 || { echo "❌ 需要 agent-browser"; exit 1; }

agent-browser open "$BASE_URL/" >/dev/null 2>&1
sleep 8

# ---- 1. 结构 ----
echo "-- 徽章结构与挂载"
R=$(ev 'document.querySelector(".xq-badge") ? "OK" : "NO"')
[ "$R" = '"OK"' ] && pass "徽章挂载" || { fail "徽章未挂载 ($R)"; exit 1; }
R=$(ev '(function(){var h=document.querySelector(".xq-badge-hd");return h?getComputedStyle(h).flexDirection:"NO_HD"})()')
[ "$R" = '"row"' ] && pass "头部行水平排列" || fail "头部行排列异常 ($R)"
R=$(ev 'document.querySelectorAll(".xq-idxgrid .xq-idxrow").length')
[ "$R" -ge 4 ] 2>/dev/null && pass "指数网格 4 行 (实际 $R)" || fail "指数网格行数异常 ($R)"
R=$(ev '(function(){var rows=document.querySelectorAll(".xq-idxgrid .xq-idxrow");for(var i=0;i<rows.length;i++){if(!/[+-]?\d/.test(rows[i].textContent))return "EMPTY_"+i}return "OK"})()')
[ "$R" = '"OK"' ] && pass "指数行有数字报价" || fail "有指数行无数据 ($R)"
R=$(ev 'document.querySelectorAll(".xq-wgrid > *").length')
[ "$R" -ge 1 ] 2>/dev/null && pass "自选网格有数据 ($R 项)" || fail "自选网格为空 ($R)"
R=$(ev '(function(){var g=document.querySelector(".xq-badge-grip");if(!g)return "NO";var r=g.getBoundingClientRect();return (r.width<=20&&r.height<=20)?"OK":"SIZE_"+Math.round(r.width)+"x"+Math.round(r.height)})()')
[ "$R" = '"OK"' ] && pass "⤡ 手柄 16×16" || fail "手柄异常 ($R)"

# ---- 2. 拖拽（真实鼠标）----
echo "-- 徽章拖拽"
# 确定性起点：徽章遗留位置可能在视口边缘，让真实鼠标的拖拽/点击目标不可靠。
# 先 rpc 固定到中部安全区再刷新页面，后续每步的目标坐标就不再依赖上一轮遗留状态。
rpc '{"action":"ui.set","args":{"badgePos":{"x":420,"y":160},"badgeW":null}}' >/dev/null
agent-browser open "$BASE_URL/" >/dev/null 2>&1; sleep 8
C=$(ev '(function(){var b=document.querySelector(".xq-badge").getBoundingClientRect();return Math.round(b.left+b.width/2)+","+Math.round(b.top+b.height/2)})()' | tr -d '"')
X=${C%,*}; Y=${C#*,}
agent-browser mouse move "$X" "$Y" >/dev/null && agent-browser mouse down >/dev/null \
  && agent-browser mouse move $((X-100)) $((Y+80)) >/dev/null && agent-browser mouse move $((X-105)) $((Y+85)) >/dev/null \
  && agent-browser mouse up >/dev/null
sleep 2
R=$(ev '(function(){var b=document.querySelector(".xq-badge");return b.style.left&&b.style.left!==""?"MOVED":"NOT"})()')
[ "$R" = '"MOVED"' ] && pass "拖拽位置样式生效" || fail "拖拽未生效 ($R)"
R=$(rpc '{"action":"ui.get","args":{}}' | grep -o '"badgePos":{"x":[0-9]')
[ -n "$R" ] && pass "位置已持久化到 host" || fail "位置未持久化"

# ---- 3. ⤡ 调宽 + 双击复位 ----
echo "-- 手柄调宽/复位"
BASE_W=$(ev 'Math.round(document.querySelector(".xq-badge").getBoundingClientRect().width)' | tr -d '"')
C=$(ev '(function(){var g=document.querySelector(".xq-badge-grip").getBoundingClientRect();return Math.round(g.left+g.width/2)+","+Math.round(g.top+g.height/2)})()' | tr -d '"')
X=${C%,*}; Y=${C#*,}
agent-browser mouse move "$X" "$Y" >/dev/null && agent-browser mouse down >/dev/null \
  && agent-browser mouse move $((X+100)) "$Y" >/dev/null && agent-browser mouse move $((X+101)) "$Y" >/dev/null \
  && agent-browser mouse up >/dev/null
sleep 2
W=$(ev 'Math.round(document.querySelector(".xq-badge").getBoundingClientRect().width)' | tr -d '"')
BW=$(rpc '{"action":"ui.get","args":{}}' | grep -o '"badgeW":[0-9]*' | grep -o '[0-9]*$' || true)
[ -n "$BW" ] && [ "$W" -gt $((BASE_W+40)) ] 2>/dev/null && [ "$BW" -gt $((BASE_W+20)) ] 2>/dev/null \
  && pass "拖 ⤡ 变宽并持久化 (${BASE_W}→${W}, badgeW=${BW})" || fail "调宽异常 (基准 ${BASE_W} / 渲染 $W / 持久 $BW)"
# 双击复位：agent-browser dblclick 的两次点击间隔超出系统双击判定阈值，产生不了
# 真 dblclick DOM 事件（实测页面监听计数为 0）——改为直接派发 dblclick（React 合成监听同一路径）。
ev 'document.querySelector(".xq-badge-grip").dispatchEvent(new MouseEvent("dblclick",{bubbles:true}))' >/dev/null
sleep 2   # saveUi 是 800ms debounce，等落盘后再读
BW=$(rpc '{"action":"ui.get","args":{}}' | grep -o '"badgeW":[0-9]*' | grep -o '[0-9]*$' || true)
[ -z "${BW}" ] && pass "双击复位 → badgeW=null（回归：曾落盘为下限120）" || fail "复位后 badgeW=${BW}（null 复位仍被钳制！）"

# ---- 4. 面板开关 + 四 tab ----
echo "-- 面板与 tab"
agent-browser click ".xq-badge" >/dev/null 2>&1; sleep 3
R=$(ev '(function(){var d=document.querySelector(".xq-dock");if(!d)return "NO_DOCK";return Array.prototype.map.call(document.querySelectorAll(".xq-tab"),function(x){return x.textContent}).join(",")})()')
[ "$R" = '"行情,热榜,搜索,快讯"' ] && pass "面板打开 + 四 tab 齐全" || fail "面板/tab 异常 ($R)"
agent-browser eval '(function(){var t=document.querySelectorAll(".xq-tab");for(var i=0;i<t.length;i++)if(t[i].textContent==="热榜")t[i].click()})()' >/dev/null; sleep 5
R=$(ev 'document.querySelectorAll(".xq-hot-row").length' | tr -d '"')
[ "$R" -ge 1 ] 2>/dev/null && pass "热榜渲染数据 ($R 行)" || fail "热榜无数据 ($R)"
agent-browser eval '(function(){var t=document.querySelectorAll(".xq-tab");for(var i=0;i<t.length;i++)if(t[i].textContent==="快讯")t[i].click()})()' >/dev/null; sleep 5
R=$(ev '(function(){var d=document.querySelector(".xq-dock");return (d.textContent.match(/小时|分钟|今天|昨天|\d{1,2}月/g)||[]).length})()' | tr -d '"')
[ "$R" -ge 1 ] 2>/dev/null && pass "快讯有时间线 ($R 处)" || fail "快讯无内容 ($R)"
agent-browser eval '(function(){var t=document.querySelectorAll(".xq-tab");for(var i=0;i<t.length;i++)if(t[i].textContent==="搜索")t[i].click()})()' >/dev/null; sleep 3
R=$(ev '(function(){var d=document.querySelector(".xq-dock");return d&&d.querySelector("input")?"OK":"NO"})()')
[ "$R" = '"OK"' ] && pass "搜索 tab 有输入框" || fail "搜索输入框缺失 ($R)"
agent-browser click ".xq-badge" >/dev/null 2>&1; sleep 2
R=$(ev 'document.querySelector(".xq-dock")?"OPEN":"CLOSED"')
[ "$R" = '"CLOSED"' ] && pass "再点徽章关闭面板" || fail "面板未关闭 ($R)"

# ---- 5. 越屏恢复钳制 ----
echo "-- 越屏恢复钳制"
rpc '{"action":"ui.set","args":{"badgePos":{"x":99999,"y":99999}}}' >/dev/null
agent-browser open "$BASE_URL/" >/dev/null 2>&1; sleep 8
R=$(ev '(function(){var b=document.querySelector(".xq-badge");if(!b)return "NO_BADGE";var r=b.getBoundingClientRect();return (r.left>=0&&r.top>=0&&r.right<=window.innerWidth+1&&r.bottom<=window.innerHeight+1)?"IN_VIEW":"OUT_"+Math.round(r.left)+","+Math.round(r.top)})()')
[ "$R" = '"IN_VIEW"' ] && pass "越屏位置恢复时钳制回视口" || fail "徽章越屏 ($R)"

echo ""
[ "$FAIL" = 0 ] && { echo "✅ 浏览器交互回归全部通过"; exit 0; } || { echo "❌ 浏览器交互回归有失败项"; exit 1; }
