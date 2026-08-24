#!/usr/bin/env bash
# CI 浏览器 E2E 引导：在隔离 DSH_HOME 里合成"已完成引导"的最小状态并启动实例。
# 解决 browser-interact.sh 的前提（需有会话与 composer，全新实例会有 onboarding 遮罩）。
#
# 合成内容：
#   settings.yaml      — welcomeNoticeVersion（跳过 onboarding 遮罩）
#   storages/workspace.json — 已初始化的 workspace 表 + 一个 session 引用
#   sessions/<slug>/<sid>/session.jsonl.zstd — 最小合法会话（zstd 压缩的 jsonl）
#
# 环境变量: DSH_HOME_DIR（必填） WORKSPACE_DIR（必填，会话 cwd） PORT
# 输出: 实例就绪后打印 BASE_URL 退出 0；后台实例由调用方清理（写 PID 到 $DSH_HOME_DIR/e2e.pid）
set -euo pipefail

H=${DSH_HOME_DIR:?need DSH_HOME_DIR}
WS=${WORKSPACE_DIR:?need WORKSPACE_DIR}
PORT=${E2E_PORT:-3210}
DSH_BIN=${DSH_BIN:-dsh}
SID="session-e2e00000-0000-4000-8000-000000000001"
NOW=$(node -e 'console.log(Date.now())')

mkdir -p "$H/sessions" "$H/storages" "$WS"
WS_ABS=$(cd "$WS" && pwd)

# 1. settings：跳过 onboarding（键名对齐本机实测的 settings.yaml）。
#    llm-pi-ai 必须配一个 provider（apiKeyEnv 指向不存在的 env 也可以）——
#    否则页面弹"添加 API Key"遮罩（_mask_），拦截所有真实鼠标事件。
cat > "$H/settings.yaml" <<EOF
ui-onboarding:
  welcomeNoticeVersion: 2026-08-13.1
agent-presets:
  default: cordis
llm-pi-ai:
  providers:
    zai-coding-cn:
      apiKeyEnv: E2E_UNUSED_API_KEY
agent-default-model:
  provider: zai-coding-cn
  model: glm-4.7
EOF

# 2. workspace 表：initialized + 一个 workspace + 挂上会话 id（schema 对齐 dsh-storage-domain：createdAt/updatedAt 必填 string）
NOWISO=$(node -e 'console.log(new Date().toISOString())')
cat > "$H/storages/workspace.json" <<EOF
{
  "unit": {"name": "workspace", "version": 2},
  "global": {"initialized": true, "workspaceIds": ["e2e00000-0000-4000-8000-0000000000ws"], "archivedSessionIds": []},
  "tables": {"workspaces": {"e2e00000-0000-4000-8000-0000000000ws": {
    "path": "$WS_ABS", "title": "e2e", "sessionIds": ["$SID"],
    "createdAt": "$NOWISO", "updatedAt": "$NOWISO"
  }}}
}
EOF

# 3. 会话 jsonl → zstd。模板含完整一轮对话（user/message + assistant/message + turn/end）——
#    只有 session 头没有 turn 的会话不会出现在侧边栏树里，conversation.input.dock 槽不渲染。
#    slug 规则（实测，由 corrupt 错误消息反推验证）：cwd 去掉首部 '/'，其余 '/' → '-'，两端包 '--'。
#    例：/tmp/x/ws → --tmp-x-ws--
SLUG="--$(printf '%s' "$WS_ABS" | sed 's#^/##; s#/#-#g')--"
D="$H/sessions/$SLUG/$SID"
mkdir -p "$D"
TMPL="$(dirname "$0")/e2e-session-template.jsonl"
sed -e "s#SESSION_ID#$SID#g" -e "s#WORKSPACE_DIR#$WS_ABS#g" -e "s#CREATED_AT#$NOW#g" "$TMPL" > "$H/session-tmp.jsonl"
# DSH 逐记录写日志：每个 zstd 帧恰好一行（第一帧必须只是 session 头）——
# CLI 默认把全部行压成一帧会报 "first frame is not exactly one header line"。逐行压缩拼接。
: > "$D/session.jsonl.zstd"
while IFS= read -r line; do printf '%s\n' "$line" | zstd -q -c >> "$D/session.jsonl.zstd"; done < "$H/session-tmp.jsonl"
rm -f "$H/session-tmp.jsonl"

# 4. 安装被测插件并启动（对齐 static-smoke 的启动方式）
(cd "$H" && DSH_HOME="$H" "$DSH_BIN" plugin --profile web add "$E2E_PLUGIN_DIR" >/dev/null 2>&1) || {
  # E2E_PLUGIN_DIR 未提供时跳过安装（假设调用方已装，如复用既有 profile）
  [ -n "${E2E_PLUGIN_DIR:-}" ] && exit 1
}
if command -v setsid >/dev/null 2>&1; then
  setsid sh -c "cd '$WS_ABS' && DSH_HOME='$H' E2E_UNUSED_API_KEY='e2e-dummy-key' '$DSH_BIN' --profile web --port '$PORT' >'$H/e2e-boot.log' 2>&1" &
else
  sh -c "cd '$WS_ABS' && DSH_HOME='$H' E2E_UNUSED_API_KEY='e2e-dummy-key' '$DSH_BIN' --profile web --port '$PORT' >'$H/e2e-boot.log' 2>&1" &
fi
echo $! > "$H/e2e.pid"

for i in $(seq 1 60); do
  [ "$(curl -s -o /dev/null -w '%{http_code}' "http://127.0.0.1:$PORT/" 2>/dev/null || true)" = "200" ] && { echo "BASE_URL=http://127.0.0.1:$PORT"; exit 0; }
  sleep 1
done
echo "实例未启动；日志尾部:" >&2
tail -5 "$H/e2e-boot.log" >&2 || true
exit 1
