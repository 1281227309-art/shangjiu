/**
 * 上九 · 国威知识库 —— MCP 探针（端到端自测）
 *
 * 真实 spawn 起 MCP 服务器（stdio），走完整协议：
 *   initialize → notifications/initialized → tools/list → tools/call
 * 用于在没有 GUI 宿主时，验证服务器确实"走通"。
 *
 * 运行：node scripts/mcp-probe.mjs
 *
 * 注意：本探针用 child_process spawn 服务器。在 DSH 沙箱里，node 内再次 spawn
 * 子进程会被沙箱拦截（报 ENOENT）。因此沙箱内的走通验证请用"管道喂请求"方式：
 *
 *   cat data/probe-requests.jsonl | node src/index.ts
 *
 * 在正常机器（有标准 node/npm）上，本探针可直接运行。
 */

import { spawn } from "node:child_process";
import { createInterface } from "node:readline";

const child = spawn(process.env.NODE || "node", ["src/index.ts"], {
  cwd: new URL("..", import.meta.url).pathname,
  stdio: ["pipe", "pipe", "inherit"], // stdout 走协议，stderr 转发到终端
});

const rl = createInterface({ input: child.stdout });
let seq = 0;
const pending = new Map();

rl.on("line", (line) => {
  try {
    const msg = JSON.parse(line);
    if (msg.id !== undefined && pending.has(msg.id)) {
      pending.get(msg.id)(msg);
      pending.delete(msg.id);
    }
  } catch {
    /* 忽略非 JSON 行 */
  }
});

function call(method, params) {
  const id = ++seq;
  child.stdin.write(JSON.stringify({ jsonrpc: "2.0", id, method, params }) + "\n");
  return new Promise((res) => pending.set(id, res));
}
function notify(method, params) {
  child.stdin.write(JSON.stringify({ jsonrpc: "2.0", method, params }) + "\n");
}

function guard(res) {
  if (res.error) throw new Error(`RPC 错误: ${JSON.stringify(res.error)}`);
  return res.result;
}
const firstLine = (text) => (typeof text === "string" ? text.slice(0, 160) : "");

/* 1. initialize */
const init = guard(await call("initialize", {
  protocolVersion: "2025-06-18",
  capabilities: {},
  clientInfo: { name: "shangjiu-probe", version: "0.0.1" },
}));
console.log("✔ initialize 成功  protocolVersion =", init.protocolVersion);

notify("notifications/initialized", {});

/* 2. tools/list */
const tools = guard(await call("tools/list", {}));
console.log("✔ tools/list 成功  ->", tools.tools.map((t) => t.name).join(", "));

/* 3. tools/call：逐项调用 */
const registries = [
  ["list_regions", {}],
  ["list_distilleries", { region: "guangdong" }],
  ["get_distillery", { id: "daqin" }],
  ["get_flavor_profile", { distilleryId: "daqin" }],
  ["list_products", { distilleryId: "daqin" }],
  ["search_whisky", { query: "波本" }],
];
for (const [name, args] of registries) {
  const r = guard(await call("tools/call", { name, arguments: args }));
  const text = r.content?.[0]?.text ?? "";
  console.log(`✔ tools/call ${name}  -> ${firstLine(text)}`);
}

/* 4. 品鉴漏斗（写入本地，状态 pending_review） */
const note = guard(await call("tools/call", {
  name: "submit_tasting_note",
  arguments: {
    distilleryId: "daqin",
    product: "双桶",
    score: 88,
    nose: "深度果香、橡木",
    palate: "波本甜感，圆润",
    finish: "悠长",
    taster: "probe-端到端测试",
    source: "mcp-probe",
  },
}));
console.log("✔ tools/call submit_tasting_note ->", firstLine(note.content?.[0]?.text ?? ""));

child.stdin.end();
setTimeout(() => process.exit(0), 300);
