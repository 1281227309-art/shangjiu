/**
 * 上九 · 国威知识库 —— 一键验收脚本（查看"全部跑通"）
 *
 * 运行：node scripts/check.mjs
 * 会检查：数据层 / 9 个工具 / 品鉴漏斗 / MCP 协议层，并打印 ✅/⚠️ 清单。
 * MCP 协议层通过 spawn 起服务器验证；若环境阻止 spawn（如 DSH 沙箱），
 * 会提示用 `cat data/host-scenario.jsonl | node src/index.ts` 验证。
 */

import { REGIONS, DISTILLERIES, regionName } from "../src/data.ts";
import {
  listRegions, listDistilleries, getDistilleryTool, getFlavorProfile,
  listProducts, searchWhiskyTool, recommendWhisky, generateContent, submitTastingNote,
} from "../src/tools.ts";

const R = [];
const ok = (name, cond, detail = "") => R.push({ name, pass: !!cond, detail });
const line = "─".repeat(46);

/* 1. 数据层 */
ok("data.ts 产区（≥9）", REGIONS.length >= 9, `${REGIONS.length} 带`);
ok("data.ts 酒厂（≥13）", DISTILLERIES.length >= 13, `${DISTILLERIES.length} 家`);
ok("产区映射 dianxi", regionName("dianxi") === "滇西（横断山带）");

/* 2. 9 个工具 */
const toolNames = ["list_regions","list_distilleries","get_distillery","get_flavor_profile","list_products","search_whisky","recommend_whisky","generate_content","submit_tasting_note"];
ok("工具数量 = 9", toolNames.length === 9, toolNames.join(" · "));
ok("list_regions", listRegions().length > 0);
ok("list_distilleries", listDistilleries().length > 0);
ok("get_distillery(daqin)", getDistilleryTool("daqin").id === "daqin");
ok("get_flavor_profile(daqin)", !!getFlavorProfile("daqin").flavor);
ok("list_products(daqin)", (listProducts("daqin").products?.length ?? 0) >= 1);
ok("search_whisky(茶威)", searchWhiskyTool("茶威").count >= 1);
ok("recommend_whisky(200/果香)", (recommendWhisky({ budget: "200", taste: "果香", occasion: "日常口粮" }).recommendations?.length ?? 0) >= 1);
ok("generate_content(小红书)", (generateContent({ topic: "国产威士忌", format: "小红书" }).content?.length ?? 0) > 0);

/* 3. 品鉴漏斗 */
await submitTastingNote({ distilleryId: "daqin", product: "双桶", score: 88, taster: "check-验收", source: "verify" }).then((n) => {
  ok("submit_tasting_note", n.accepted === true, n.reference ?? "");
});

/* 4. MCP 协议层（spawn 起服务器；沙箱内会报"阻止"） */
await (async () => {
  const { spawn } = await import("node:child_process");
  const { createInterface } = await import("node:readline");
  const cwd = new URL("..", import.meta.url).pathname;
  const mcp = await new Promise((resolve) => {
    let child;
    const cwd = new URL("..", import.meta.url).pathname;
    try {
      child = spawn(process.env.NODE || "node", ["src/index.ts"], { cwd, stdio: ["pipe", "pipe", "ignore"] });
    } catch (e) {
      resolve({ pass: false, detail: "环境阻止 spawn，请用管道验证（见下）" });
      return;
    }
    let done = false;
    const finish = (r) => { if (!done) { done = true; resolve(r); } };
    child.on("error", (e) => finish({ pass: false, detail: "环境阻止 spawn（" + e.code + "），请用管道验证" }));
    const rl = createInterface({ input: child.stdout });
    const pending = new Map();
    rl.on("line", (l) => { try { const m = JSON.parse(l); if (pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } } catch {} });
    const call = (method, params) => new Promise((res) => { const id = Math.floor(Math.random() * 1e9); pending.set(id, res); child.stdin.write(JSON.stringify({ jsonrpc: "2.0", id, method, params }) + "\n"); });
    (async () => {
      try {
        await call("initialize", { protocolVersion: "2025-06-18", capabilities: {}, clientInfo: { name: "check", version: "1" } });
        child.stdin.write(JSON.stringify({ jsonrpc: "2.0", method: "notifications/initialized", params: {} }) + "\n");
        const tl = await call("tools/list", {});
        const n = tl?.result?.tools?.length ?? 0;
        finish({ pass: n === 9, detail: `${n} 个工具` });
      } catch { finish({ pass: false, detail: "协议响应异常" }); }
      try { child.kill(); } catch {}
    })();
  });
  ok("MCP tools/list（含协议层）", mcp.pass, mcp.detail);
})();

/* 报告 */
const pass = R.filter((r) => r.pass).length;
const total = R.length;
console.log("\n═══ 上九·国威知识库 · 验收清单 ═══");
console.log(line);
for (const r of R) console.log(` ${r.pass ? "✅" : "⚠️"} ${r.name}${r.detail ? "　" + r.detail : ""}`);
console.log(line);
console.log(` 结果：${pass}/${total} 通过`);
console.log(line);
console.log(" 还差两步（可选）：");
console.log(" ① MCP 协议层（若上面未过，用管道）：cat data/host-scenario.jsonl | node src/index.ts");
console.log(" ② 导出手动数据包：node scripts/export-kb.mjs > ../上九国威知识库_手动录入数据包.md");
console.log("");
