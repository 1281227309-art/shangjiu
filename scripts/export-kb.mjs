/**
 * 上九 · 国威知识库 —— 生成"手动录入数据包"（供无 MCP 的私有知识库使用）
 *
 * 从 src/data.ts 实时导出成 Markdown（产区总览 + 酒厂档案 + 产品价格 + 可信度说明），
 * 保证与知识库一致、并随知识库更新。
 * 运行：node scripts/export-kb.mjs > ../上九国威知识库_手动录入数据包.md
 */

import { REGIONS, DISTILLERIES, regionName } from "../src/data.ts";

const C = { verified: "✅已核实", pending: "🟡待厂方确认", unverified: "⬜待采集" };
const L = [];

L.push("# 上九·国威知识库 —— 手动录入数据包");
L.push("");
L.push("> 供**无 MCP 的私有知识库（乐享等）**手动录入。数据源：上九·国威知识库。");
L.push("> 可信度：✅ 已核实 / 🟡 待厂方确认 / ⬜ 待采集（每条可独立核验来源）。");
L.push("");

L.push("## 一、产区总览（9 大产区带）");
L.push("");
L.push("| 产区 | 省份 | 一句话 | 代表厂 |");
L.push("|---|---|---|---|");
for (const r of REGIONS) {
  const names = (r.distilleryIds ?? [])
    .map((id) => DISTILLERIES.find((d) => d.id === id)?.name ?? id)
    .join("、") || "—";
  L.push(`| ${r.name} | ${r.province} | ${r.note} | ${names} |`);
}
L.push("");

L.push("## 二、酒厂档案");
L.push("");
L.push("| 酒厂 | 产区 | 背景 | 定位 | 工艺/桶型 | 风味方向 | 可信度 |");
L.push("|---|---|---|---|---|---|---|");
for (const d of DISTILLERIES) {
  const process = d.process
    ? [d.process.still, d.process.cask, d.process.malt, d.process.maturation].filter(Boolean).join("；")
    : "—";
  const flavor = (d.flavor?.dominant ?? []).join("、") || d.style;
  const community = d.flavor?.community ? `（${d.flavor.community}）` : "";
  L.push(`| ${d.name} | ${regionName(d.region)} | ${d.owner ?? "—"} | ${d.style} | ${process} | ${flavor}${community} | ${C[d.confidence]} |`);
}
L.push("");

L.push("## 三、产品与价格（含行业锚点）");
L.push("");
L.push("| 酒厂 · 产品 | 桶型 | 档位 | 价格带 | 可信度 |");
L.push("|---|---|---|---|---|");
for (const d of DISTILLERIES) {
  for (const p of d.products ?? []) {
    L.push(`| ${d.name}·${p.name} | ${p.cask} | ${p.tier} | ${p.priceBand ?? "待确认"} | ${C[p.confidence]} |`);
  }
}
L.push("");

L.push("## 四、可信度说明");
L.push("");
L.push("- ✅ **已核实**：有公开/可靠来源。");
L.push("- 🟡 **待厂方确认**：基于报道/行业共识，未获厂方一手确认。");
L.push("- ⬜ **待采集**：尚缺一手信息。");
L.push("- 品鉴笔记与价格凡无一手来源一律标注，**不作权威结论**。");
L.push("");
L.push(`> 生成时间：${new Date().toISOString()}`);

process.stdout.write(L.join("\n"));
