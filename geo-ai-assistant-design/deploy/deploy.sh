#!/usr/bin/env bash
# ════════════════════════════════════════════════════════════════════════════
# deploy.sh — 把 AI 助手设计稿以「预览页」形式发布到 geo.shangjiudistillery.cn
#
# 设计原则（都是为了让这次发布不可能伤到线上产品）：
#   1. **不覆盖 index.html**。线上是 React 平台，本文件是设计稿；
#      这里只发布到一个独立文件名 design-preview.html。
#   2. **先备份**。目标文件若已存在，先存成带时间戳的副本。
#   3. **原子发布**。先传到临时文件再 mv，避免用户拿到半个文件。
#   4. **发布后校验**。核对线上 SHA-256 与本地一致，不一致即报错退出。
#   5. **打印回滚命令**。出事时一行就能退回去。
#
# 用法：
#   ./deploy.sh <user@host> <remote-dir> [--dry-run]
#
# 例：
#   ./deploy.sh ubuntu@47.238.154.62 /var/www/geo --dry-run
#   ./deploy.sh ubuntu@47.238.154.62 /var/www/geo
# ════════════════════════════════════════════════════════════════════════════
set -euo pipefail

TARGET="${1:-}"
REMOTE_DIR="${2:-}"
DRY_RUN="${3:-}"

LOCAL_FILE="design-preview.html"
REMOTE_NAME="design-preview.html"
STAMP="$(date +%Y%m%d-%H%M%S)"

die() { echo "✗ $*" >&2; exit 1; }

[ -n "$TARGET" ]     || die "缺少目标主机。用法: ./deploy.sh <user@host> <remote-dir> [--dry-run]"
[ -n "$REMOTE_DIR" ] || die "缺少远端目录。用法: ./deploy.sh <user@host> <remote-dir> [--dry-run]"
[ -f "$LOCAL_FILE" ] || die "找不到 $LOCAL_FILE（请在 deploy/ 目录下运行）"

LOCAL_SHA="$(shasum -a256 "$LOCAL_FILE" | awk '{print $1}')"
echo "本地文件 : $LOCAL_FILE ($(wc -c < "$LOCAL_FILE" | tr -d ' ') 字节)"
echo "本地 SHA : $LOCAL_SHA"
echo "目标     : $TARGET:$REMOTE_DIR/$REMOTE_NAME"
echo

# ── 安全性自检：绝不能把设计稿传成 index.html ──────────────────────────────
case "$REMOTE_NAME" in
  index.html) die "拒绝执行：本脚本只允许发布预览文件名，不允许覆盖线上首页" ;;
esac

if [ "$DRY_RUN" = "--dry-run" ]; then
  echo "（dry-run）将要执行："
  echo "  1) ssh $TARGET 检查目录并备份已存在的 $REMOTE_NAME"
  echo "  2) scp $LOCAL_FILE → $TARGET:$REMOTE_DIR/.$REMOTE_NAME.tmp"
  echo "  3) ssh $TARGET mv .$REMOTE_NAME.tmp → $REMOTE_NAME（原子替换）"
  echo "  4) curl 校验线上内容 SHA-256 与本地一致"
  exit 0
fi

# ── 1. 远端准备与备份 ──────────────────────────────────────────────────────
echo "── 1/4 远端检查与备份 ──"
ssh "$TARGET" "
  set -e
  cd '$REMOTE_DIR' || { echo '远端目录不存在'; exit 1; }
  if [ -f '$REMOTE_NAME' ]; then
    cp -p '$REMOTE_NAME' '$REMOTE_NAME.bak-$STAMP'
    echo '已备份: $REMOTE_DIR/$REMOTE_NAME.bak-$STAMP'
  else
    echo '目标文件不存在，属首次发布（无需备份）'
  fi
  # 记录一下首页指纹，便于确认我们没碰到它
  if [ -f index.html ]; then
    echo \"index.html 指纹(未改动): \$(sha256sum index.html | awk '{print \\\$1}')\"
  fi
"

# ── 2. 上传到临时名 ────────────────────────────────────────────────────────
echo "── 2/4 上传到临时文件（避免半文件被访问）──"
scp -q "$LOCAL_FILE" "$TARGET:$REMOTE_DIR/.$REMOTE_NAME.tmp"

# ── 3. 原子替换 ────────────────────────────────────────────────────────────
echo "── 3/4 原子替换 ──"
ssh "$TARGET" "cd '$REMOTE_DIR' && mv -f '.$REMOTE_NAME.tmp' '$REMOTE_NAME' && echo 已就位"

# ── 4. 线上校验 ────────────────────────────────────────────────────────────
echo "── 4/4 线上校验 ──"
HOST="$(echo "$TARGET" | sed 's/.*@//')"
URL="https://geo.shangjiudistillery.cn/$REMOTE_NAME"
ONLINE_SHA="$(curl -sS --max-time 25 "$URL" | shasum -a256 | awk '{print $1}')"
HTTP_CODE="$(curl -sS -o /dev/null -w '%{http_code}' --max-time 25 "$URL")"

echo "HTTP     : $HTTP_CODE"
echo "线上 SHA : $ONLINE_SHA"
echo "本地 SHA : $LOCAL_SHA"

if [ "$ONLINE_SHA" = "$LOCAL_SHA" ]; then
  echo
  echo "✓ 发布成功且内容逐字节一致：$URL"
else
  echo
  echo "⚠️ 线上内容与本地不一致 —— 可能被 CDN/nginx 缓存，或路径不对。"
  echo "   请先确认：curl -sS -I $URL"
  exit 1
fi

echo
echo "── 回滚方式（需要时执行）──"
echo "  ssh $TARGET \"cd $REMOTE_DIR && mv -f $REMOTE_NAME.bak-$STAMP $REMOTE_NAME\""
echo "  若为首次发布：ssh $TARGET \"rm -f $REMOTE_DIR/$REMOTE_NAME\""
