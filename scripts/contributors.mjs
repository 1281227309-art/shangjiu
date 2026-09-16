/**
 * 上九 · 国威知识库 —— 贡献者统计脚本
 *
 * 汇总三类贡献：
 *   1. 代码贡献：git commit 作者
 *   2. 数据贡献：src/data.ts 中各条目的 contributedBy 字段
 *   3. 品鉴贡献：data/tasting-approved.json 中已复核通过的品鉴者
 *
 * 输出 contributors.json，供 contributors.html 榜单页读取。
 * 由 .github/workflows/contributors.yml 在 push / 每日定时时自动运行并提交。
 *
 * 运行：node scripts/contributors.mjs
 */

import { execSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { DISTILLERIES } from "../src/data.ts";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, "..");

const people = new Map();

function bump(name, type, pts, count = 1) {
  if (!name) return;
  const key = name.trim();
  if (!people.has(key)) people.set(key, { name: key, types: {}, points: 0 });
  const p = people.get(key);
  p.types[type] = (p.types[type] || 0) + count;
  p.points += pts * count;
}

/* 1) 代码贡献（git shortlog：每位作者的提交数） */
try {
  const out = execSync("git shortlog -sn --all", { cwd: root, encoding: "utf8" });
  for (const line of out.split("\n")) {
    const m = line.match(/^\s*(\d+)\s+(.+)$/);
    if (m) bump(m[2], "code", 1, parseInt(m[1], 10));
  }
} catch (e) {
  console.warn("⚠️ 无法读取 git 历史（", e.message, "）");
}

/* 2) 数据贡献（data.ts 的 contributedBy） */
for (const d of DISTILLERIES) {
  if (d.contributedBy) bump(d.contributedBy, "data", 5);
  for (const p of d.products ?? []) {
    if (p.contributedBy) bump(p.contributedBy, "data", 2);
  }
}

/* 3) 品鉴贡献（已复核通过的品鉴者） */
try {
  const raw = readFileSync(path.join(root, "data", "tasting-approved.json"), "utf8");
  const approved = JSON.parse(raw);
  const arr = Array.isArray(approved) ? approved : approved.records ?? [];
  for (const n of arr) {
    if (n.taster) bump(n.taster, "tasting", 1);
  }
} catch {
  /* 尚无通过记录，忽略 */
}

function level(p) {
  if (p >= 200) return { name: "元老", badge: "🏆" };
  if (p >= 50) return { name: "老饕", badge: "🥃🥃🥃" };
  if (p >= 10) return { name: "熟客", badge: "🥃🥃" };
  return { name: "起步", badge: "🥃" };
}

const list = [...people.values()]
  .sort((a, b) => b.points - a.points)
  .map((p, i) => ({
    rank: i + 1,
    name: p.name,
    points: p.points,
    level: level(p.points).name,
    badge: level(p.points).badge,
    contributions: p.types,
  }));

const out = {
  generatedAt: new Date().toISOString(),
  total: list.length,
  contributors: list,
};

writeFileSync(path.join(root, "contributors.json"), JSON.stringify(out, null, 2), "utf8");
console.log(`✅ 已生成 contributors.json：${list.length} 位贡献者`);
for (const c of list.slice(0, 10)) {
  console.log(`   ${String(c.rank).padStart(2)}. ${c.badge} ${c.name} · ${c.points} 分 · ${c.level}`);
}
