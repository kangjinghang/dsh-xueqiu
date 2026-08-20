#!/usr/bin/env bash
# 静态安装冒烟关卡：完全模拟用户路径，在隔离的 DSH_HOME 里安装并启动。
# 发布前必须通过。任何 FAIL 都意味着用户 `dsh plugin add` 后会得到坏插件。
#
# 用法: bash scripts/static-smoke.sh [插件目录，默认当前仓库]
#
# 关卡（全部无浏览器，CI 可跑）:
#   1. dsh plugin --profile web add <dir>   — 安装不报错
#   2. dsh --profile web --dump-config      — 组合树含插件行
#   3. dsh --profile web --port <p> 启动     — 退出码 0、日志无 error
#   4. GET / 的 __DSH_BOOT__ 清单           — 含插件 client 行（bundle 被发现）
#   5. GET /plugins/dsh-xueqiu/client.js    — 200 且是 __ModuleLoader__ 工厂格式
#   6. POST /xq-rpc quote                   — 真实行情返回 ok
#   7. 栅栏: 恶意 Origin 得 403
# 可选: 环境变量 SMOKE_BROWSER=1 且装有 agent-browser 时，追加浏览器徽章检查。
set -uo pipefail

PLUGIN_DIR=${1:-$(cd "$(dirname "$0")/.." && pwd)}
PLUGIN_DIR=$(cd "$PLUGIN_DIR" && pwd)
PORT=${SMOKE_PORT:-3199}
DSH_BIN=${DSH_BIN:-dsh}
TMP=$(mktemp -d /tmp/xq-smoke.XXXXXX)
BOOT_LOG="$TMP/boot.log"
FAIL=0

say()  { printf '%s\n' "$*"; }
pass() { say "  ✅ $*"; }
fail() { say "  ❌ $*"; FAIL=1; }

cleanup() {
  # 杀整个进程组（只杀子 shell 不够——dsh 是孙进程，会变孤儿占着端口污染下一次运行）
  if [ -n "${SERVER_PID:-}" ]; then
    kill -- "-$SERVER_PID" 2>/dev/null || kill "$SERVER_PID" 2>/dev/null
    sleep 1
    lsof -ti ":$PORT" 2>/dev/null | xargs kill -9 2>/dev/null
  fi
  wait 2>/dev/null
  rm -rf "$TMP"
}
trap cleanup EXIT

say "==> 静态冒烟: PLUGIN_DIR=$PLUGIN_DIR  DSH_HOME=$TMP  PORT=$PORT"

# 端口预检：被占用直接拒绝运行（残留监听会伪造“启动成功”）
if lsof -ti ":$PORT" >/dev/null 2>&1; then
  say "❌ 端口 $PORT 已被占用（上一次运行的残留？）— 先清理再跑，否则结果不可信"
  exit 1
fi

# ---- 1. 安装 ----
say "-- 1/7 安装 (dsh plugin add)"
if (cd "$TMP" && DSH_HOME="$TMP" "$DSH_BIN" plugin --profile web add "$PLUGIN_DIR" >"$TMP/install.log" 2>&1); then
  pass "安装成功"
else
  fail "安装失败 — 用户第一步就走不通"
  tail -8 "$TMP/install.log" 2>/dev/null | sed 's/^/     /'
  exit 1
fi

# ---- 2. 组合树 ----
say "-- 2/7 组合树 (--dump-config)"
if (cd "$TMP" && DSH_HOME="$TMP" timeout 120 "$DSH_BIN" --profile web --dump-config 2>&1 | grep -q '^# == dsh-xueqiu'); then
  pass "组合树含 dsh-xueqiu"
else
  fail "组合树缺插件行（loader 侧拒绝或崩溃）"
fi

# ---- 3. 启动 ----
say "-- 3/7 启动 (dsh web)"
# setsid 建独立进程组，保证 cleanup 能整组回收
if command -v setsid >/dev/null 2>&1; then
  setsid sh -c "cd '$TMP' && DSH_HOME='$TMP' '$DSH_BIN' --profile web --port '$PORT' >'$BOOT_LOG' 2>&1" &
  SERVER_PID=$!
else
  (cd "$TMP" && DSH_HOME="$TMP" "$DSH_BIN" --profile web --port "$PORT" >"$BOOT_LOG" 2>&1) &
  SERVER_PID=$!
fi
up=0
for i in $(seq 1 60); do
  code=$(curl -s -o /dev/null -w '%{http_code}' "http://127.0.0.1:$PORT/" 2>/dev/null)
  [ "$code" = "200" ] && { up=1; break; }
  sleep 1
done
if [ "$up" = 1 ]; then
  pass "实例启动且首页 200"
else
  fail "实例未启动（v1.7.0 同款崩溃？）— 启动日志尾部:"
  tail -5 "$BOOT_LOG" | sed 's/^/     /'
  exit 1
fi
if grep -qi 'error' "$BOOT_LOG"; then
  fail "启动日志含 error:"
  grep -i error "$BOOT_LOG" | head -3 | sed 's/^/     /'
else
  pass "启动日志无 error"
fi

# ---- 4. boot 清单 ----
say "-- 4/7 __DSH_BOOT__ 清单"
BOOT=$(curl -s "http://127.0.0.1:$PORT/")
if echo "$BOOT" | grep -q '"id":"dsh-xueqiu"'; then
  pass "boot 清单含 dsh-xueqiu client 行"
else
  fail "boot 清单缺插件 — client 半没被发现（dsh.client/exports 声明问题）"
fi

# ---- 5. client bundle ----
say "-- 5/7 client bundle 格式"
BUNDLE=$(curl -s "http://127.0.0.1:$PORT/plugins/dsh-xueqiu/client.js")
# 注意：不要用 echo|head|grep（pipefail 下 SIGPIPE 会误报），用 bash 字符串匹配
if [[ "$BUNDLE" == *__ModuleLoader__* ]]; then
  pass "bundle 是 __ModuleLoader__ 工厂格式"
else
  fail "bundle 缺 __ModuleLoader__.load — 浏览器端会 SyntaxError（裸函数体）"
fi
if [[ "$BUNDLE" == *"host.call"* ]]; then
  fail "bundle 残留 host.call — 静态模式下会 plugin-not-running"
else
  pass "bundle 无 host.call 残留"
fi

# ---- 6. RPC 真实数据 ----
say "-- 6/7 /xq-rpc 行情"
QUOTE=$(curl -s -m 30 -X POST "http://127.0.0.1:$PORT/xq-rpc" -H 'Content-Type: application/json' -d '{"action":"quote","args":{"symbols":"SH600519"}}')
if [[ "$QUOTE" == *'"ok":true'* ]]; then
  pass "RPC 返回真实行情"
elif [ -n "${SMOKE_CI:-}" ] && [[ "$QUOTE" == *'cookie'* || "$QUOTE" == *'network'* || "$QUOTE" == *'风控'* ]]; then
  # CI 数据中心 IP 常被雪球风控拦截：通道本身已验证（返回了结构化 JSON），上游数据只在本地强制
  pass "RPC 通道正常（CI 出口 IP 被雪球风控拦截，跳过数据断言）"
else
  fail "RPC 失败: $(echo "$QUOTE" | head -c 120)"
fi

# ---- 7. 栅栏 ----
say "-- 7/7 同源栅栏"
if [ "$(curl -s -o /dev/null -w '%{http_code}' -X POST "http://127.0.0.1:$PORT/xq-rpc" -H 'Origin: http://evil.example' -d '{}')" = "403" ]; then
  pass "恶意 Origin 被 403"
else
  fail "栅栏未拦截跨源请求"
fi

# ---- 可选浏览器层 ----
if [ "${SMOKE_BROWSER:-0}" = "1" ] && command -v agent-browser >/dev/null 2>&1; then
  say "-- 附: 浏览器徽章"
  agent-browser open "http://127.0.0.1:$PORT/" >/dev/null 2>&1
  sleep 6
  RES=$(timeout 25 agent-browser eval 'document.querySelector(".xq-badge") ? "BADGE_OK" : "NO_BADGE"' 2>/dev/null)
  agent-browser close >/dev/null 2>&1
  [ "$RES" = '"BADGE_OK"' ] && pass "浏览器徽章挂载" || fail "浏览器徽章未挂载 ($RES)"
fi

say ""
if [ "$FAIL" = 0 ]; then
  say "✅ 静态冒烟全部通过 — 可发布"
  exit 0
else
  say "❌ 静态冒烟有失败项 — 禁止发布"
  exit 1
fi
