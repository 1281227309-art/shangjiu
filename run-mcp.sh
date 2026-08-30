#!/bin/sh
# 上九·国威知识库 MCP 启动脚本
# 用途：作为 Cherry Studio / 其他 MCP 客户的 stdio 命令入口，用 PATH 上的 node 启动本插件。
# 若宿主找不到 node，请把 node 加入 PATH，或把下面 exec 的 node 换成你的 node 绝对路径（机器个性化，勿提交）。
DIR="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
exec node "$DIR/src/index.ts"
