#!/usr/bin/env bash
# 上九·国威知识库 —— 一键接入 Claude Desktop
# 把本插件的 mcpServers 合并进 Claude Desktop 配置，并自动填充项目绝对路径。
# 用法：bash scripts/install-claude-config.sh
set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

# Claude Desktop 配置路径（macOS）
CONFIG="${CLAUDE_CONFIG:-$HOME/Library/Application Support/Claude/claude_desktop_config.json}"

echo "项目目录：$PROJECT_DIR"
echo "目标配置：$CONFIG"

# 用 node 做 JSON 合并（避免依赖 jq）
export PROJECT_DIR
node -e 'const fs=require("fs");const p=process.env.CONFIG||process.env.HOME+"/Library/Application Support/Claude/claude_desktop_config.json";let j={};try{j=JSON.parse(fs.readFileSync(p,"utf8"))}catch{}j.mcpServers=j.mcpServers||{};j.mcpServers["shangjiu-guowei"]={command:"node",args:[process.env.PROJECT_DIR+"/src/index.ts"],env:{}};const d=require("path").dirname(p);fs.mkdirSync(d,{recursive:true});fs.writeFileSync(p,JSON.stringify(j,null,2)+"\n");console.log("✔ 已写入",p);console.log("✔ mcpServers.shangjiu-guowei:",JSON.stringify(j.mcpServers["shangjiu-guowei"]));'

echo ""
echo "下一步："
echo "  1. 完全退出并重启 Claude Desktop"
echo "  2. 在 Claude 里发起任意对话，即可调用「上九·国威知识库」的工具"
echo ""
echo "若你的配置在别的路径，设置环境变量 CLAUDE_CONFIG=<路径> 后重跑本脚本。"
