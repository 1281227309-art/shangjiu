/**
 * 上九 · 国威知识库 —— v0.2 品鉴数据复核管线
 *
 * 原则（对齐复局论证）：条目只在"真人复核通过"后才可能进入知识库，AI/未复核数据
 * 绝不充当权威结论。本脚本提供复核闭环：
 *
 *   node scripts/review.mjs list                    列出待审记录
 *   node scripts/review.mjs approve <id> [reviewer] 通过（标记 approved）
 *   node scripts/review.mjs reject  <id> [reason]   驳回（标记 rejected）
 *   node scripts/review.mjs report                  汇总已通过条目 → 按酒厂聚合
 *
 * 数据源：data/tasting-input.jsonl（由 submit_tasting_note 写入）。
 * 通过条目会追加到 data/tasting-approved.json（curated，供知识库筛选）。
 */

import { readFile, writeFile, appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(here, "..", "data");
const INPUT_FILE = path.join(DATA_DIR, "tasting-input.jsonl");
const APPROVED_FILE = path.join(DATA_DIR, "tasting-approved.json");

async function readRecords() {
  await mkdir(DATA_DIR, { recursive: true });
  try {
    const raw = await readFile(INPUT_FILE, "utf8");
    return raw
      .split("\n")
      .filter(Boolean)
      .map((line, i) => {
        let r;
        try {
          r = JSON.parse(line);
        } catch {
          r = { id: `line_${i}`, parse_error: true, raw: line };
        }
        return r;
      });
  } catch {
    return []; // 文件不存在 → 空
  }
}

async function writeRecords(records) {
  const data = records
    .filter((r) => !r.parse_error)
    .map((r) => JSON.stringify(r))
    .filter(Boolean)
    .join("\n");
  await writeFile(INPUT_FILE, data ? data + "\n" : "", "utf8");
}

async function listPending() {
  const records = await readRecords();
  const pending = records.filter((r) => r.status === "pending_review");
  if (pending.length === 0) {
    console.log("（无待审记录）");
    return;
  }
  console.log(`待审 ${pending.length} 条:\n`);
  for (const r of pending) {
    console.log(
      `- ${r.id} | ${r.distillery ?? r.distilleryId} | 产品:${r.product ?? "—"} | 评分:${r.score ?? "—"} | 来源:${r.source ?? "—"} | 品鉴者:${r.taster ?? "—"}`,
    );
    console.log(`    闻香:${r.nose ?? "—"} 口感:${r.palate ?? "—"} 余韵:${r.finish ?? "—"}`);
  }
}

async function updateStatus(id, action, extra) {
  const records = await readRecords();
  const rec = records.find((r) => r.id === id);
  if (!rec) {
    console.log(`✘ 未找到记录：${id}`);
    process.exit(1);
  }
  if (rec.status !== "pending_review") {
    console.log(`✘ 记录 ${id} 当前状态为 ${rec.status}，不可重复 ${action}`);
    process.exit(1);
  }
  rec.status = action === "approve" ? "approved" : "rejected";
  rec.reviewedAt = new Date().toISOString();
  if (action === "approve" && extra) rec.reviewer = extra;
  if (action === "reject" && extra) rec.rejectReason = extra;

  await writeRecords(records);

  if (action === "approve") {
    // 通过条目追加到 curated 集（供知识库/报告筛选）
    const { status, reviewedAt, reviewer, ...curated } = rec;
    curated.approvedAt = reviewedAt;
    curated.reviewer = reviewer ?? null;
    await appendFile(APPROVED_FILE, JSON.stringify(curated) + "\n", "utf8");
  }

  console.log(`✓ ${action === "approve" ? "已通过" : "已驳回"}：${id}（${rec.distillery}）`);
}

async function report() {
  const records = await readRecords();
  const approved = records.filter((r) => r.status === "approved");
  const rejected = records.filter((r) => r.status === "rejected");
  const pending = records.filter((r) => r.status === "pending_review");

  console.log(
    `共 ${records.length} 条：通过 ${approved.length} / 驳回 ${rejected.length} / 待审 ${pending.length}\n`,
  );

  if (approved.length === 0) {
    console.log("（暂无已通过条目，无法聚合报告）");
    return;
  }

  // 按酒厂聚合
  const byDistillery = {};
  for (const r of approved) {
    const key = `${r.distillery ?? r.distilleryId}`;
    byDistillery[key] ??= { total: 0, scores: [], products: new Set(), words: [] };
    const b = byDistillery[key];
    b.total += 1;
    if (typeof r.score === "number") b.scores.push(r.score);
    if (r.product) b.products.add(r.product);
    for (const field of ["nose", "palate", "finish"]) {
      if (r[field]) b.words.push(...r[field].split(/[,，、;；\s]+/).filter(Boolean));
    }
  }

  for (const [key, b] of Object.entries(byDistillery)) {
    const avg =
      b.scores.length > 0
        ? (b.scores.reduce((a, x) => a + x, 0) / b.scores.length).toFixed(1)
        : "—";
    const freq = {};
    for (const w of b.words) freq[w] = (freq[w] ?? 0) + 1;
    const top = Object.entries(freq)
      .sort((a, c) => c[1] - a[1])
      .slice(0, 6)
      .map(([w, n]) => `${w}(${n})`);
    console.log(`■ ${key}`);
    console.log(`  样本数:${b.total} | 平均分:${avg} | 涉及产品:${[...b.products].join("、") || "—"}`);
    if (top.length) console.log(`  高频风味词:${top.join(" ")}`);
    console.log("");
  }
  console.log("注：以上仅为真人已复核样本的客观聚合，不构成任何权威评分或结论；进入知识库前仍须人工判断。");
}

const [cmd, arg1, arg2] = process.argv.slice(2);

switch (cmd) {
  case "list":
    await listPending();
    break;
  case "approve":
    if (!arg1) {
      console.log("用法：approve <id> [reviewer]\n提示：先 list 查看 id");
      process.exit(1);
    }
    await updateStatus(arg1, "approve", arg2);
    break;
  case "reject":
    if (!arg1) {
      console.log("用法：reject <id> [reason]\n提示：先 list 查看 id");
      process.exit(1);
    }
    await updateStatus(arg1, "reject", arg2);
    break;
  case "report":
    await report();
    break;
  default:
    console.log(`上九 · 国威知识库 v0.2 复核管线
用法：
  node scripts/review.mjs list                     列出待审记录
  node scripts/review.mjs approve <id> [reviewer]  通过
  node scripts/review.mjs reject  <id> [reason]    驳回
  node scripts/review.mjs report                   汇总已通过条目`);
}
