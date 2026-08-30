/**
 * 上九 · 国威知识库 —— 真实 MCP 宿主演示（用官方 SDK Client）
 *
 * 模拟"用户提问 → 宿主选工具 → 调用 → 得答案"的真实流程。
 * 运行（需已 npm/pnpm install）：
 *   node scripts/host-demo.mjs
 *
 * 注意：需标准 node/npm 环境（会 spawn 服务器子进程）；DSH 沙箱内会拦截 spawn，
 * 沙箱内的"真实调用演示"请用：
 *   cat data/probe-requests.jsonl | node src/index.ts
 */

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const transport = new StdioClientTransport({
  command: process.env.NODE || "node",
  args: ["src/index.ts"],
});
const client = new Client({ name: "shangjiu-host-demo", version: "0.0.1" });

await client.connect(transport);

const toolText = (res) =>
  (res?.content ?? [])
    .map((c) => (c.type === "text" ? c.text : ""))
    .join("\n");

/* 1. 握手 + 列工具 */
const tools = await client.listTools();
console.log("✔ 已连接宿主，工具数：", tools.tools.length);
console.log("  工具：", tools.tools.map((t) => t.name).join(", "));

/* 2. 场景一：用户想了解国产威士忌里"有东方风味叙事"的厂 */
console.log("\n〔用户〕我想看看国产威士忌里，有哪些主打东方风味、值得关注的小众厂？");
const r1 = await client.callTool({ name: "search_whisky", arguments: { query: "东方" } });
console.log("〔宿主→〕", toolText(r1));

/* 3. 场景二：用户想喝中等价位、口粮档的，问哪家 */
console.log("\n〔用户〕那我想喝中等价位、能当口粮的，有什么推荐？");
const r2 = await client.callTool({ name: "list_products", arguments: { distilleryId: "daqin" } });
console.log("〔宿主→〕", toolText(r2));

/* 4. 场景三：用户提交一条自己的品鉴笔记（数据漏斗） */
console.log("\n〔用户〕我昨晚喝了大芹双桶，记一条品鉴：果香浓郁、波本甜感、余韵悠长，打分 90。");
const r3 = await client.callTool({
  name: "submit_tasting_note",
  arguments: {
    distilleryId: "daqin",
    product: "双桶",
    score: 90,
    nose: "果香浓郁、橡木",
    palate: "波本甜感、圆润",
    finish: "余韵悠长",
    taster: "上九-用户",
    source: "社群",
  },
});
console.log("〔宿主→〕", toolText(r3));

await client.close();
console.log("\n✔ 演示完成（可用 node scripts/review.mjs list 查看刚刚录的待审笔记）");
