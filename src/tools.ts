/**
 * 上九 · 国威知识库 —— 业务逻辑层（纯函数，不含 MCP SDK）
 *
 * 设计：把"查询/检索/品鉴漏斗"的核心逻辑抽成纯模块。
 *   - index.ts（MCP 服务器）只做薄封装，从这层取结果包成 {content:[{type:'text',text}]}。
 *   - scripts/demo.mjs（免 npm 演示）与 scripts/review.mjs（复核管线）直接复用本层。
 *   - 数据中枢独立于协议存在——换任何宿主/协议，这一层不动。
 */

import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  DISTILLERIES,
  REGIONS,
  getDistillery,
  regionName,
  searchWhisky,
  type Distillery,
  type Region,
} from "./data.ts";

export const confidenceZh: Record<string, string> = {
  verified: "✅ 已核实",
  pending: "🟡 待厂方确认",
  unverified: "⬜ 待采集",
};

/** 酒厂列表条目（精简） */
export function summarize(d: Distillery) {
  return {
    id: d.id,
    name: d.name,
    region: regionName(d.region),
    location: d.location,
    owner: d.owner ?? null,
    style: d.style,
    confidence: confidenceZh[d.confidence] ?? "—",
    source: d.source,
  };
}

/** 酒厂完整详情 */
export function detail(d: Distillery) {
  return {
    ...summarize(d),
    story: d.story,
    process: d.process ?? null,
    terroir: d.terroir ?? null,
    flavor: d.flavor ?? null,
    products: d.products ?? [],
    credibility_notice:
      "凡标注🟡/⬜的字段为待确认或待采集，非一手资料，不作权威结论。品鉴笔记仅采信真人来源。",
  };
}

/* ---------------------------- 工具：查询 ---------------------------- */

export function listRegions() {
  return REGIONS;
}

export function listDistilleries(region?: string) {
  const list = region
    ? DISTILLERIES.filter((d) => d.region === region)
    : DISTILLERIES;
  return list.map(summarize);
}

export function getDistilleryTool(id: string) {
  const d = getDistillery(id);
  if (!d)
    return { error: `未找到酒厂：${id}`, available: DISTILLERIES.map((x) => x.id) };
  return detail(d);
}

export function getFlavorProfile(distilleryId: string) {
  const d = getDistillery(distilleryId);
  if (!d) return { error: `未找到酒厂：${distilleryId}` };
  return {
    id: d.id,
    name: d.name,
    region: regionName(d.region),
    flavor: d.flavor ?? null,
    process: d.process ?? null,
    credibility_notice:
      "主导风味词来自真人盲品聚合，AI 只做归并与可视化，不做主观判断。未聚合前标注『待聚合』，不得当作权威结论。",
  };
}

export function listProducts(distilleryId: string) {
  const d = getDistillery(distilleryId);
  if (!d) return { error: `未找到酒厂：${distilleryId}` };
  const products =
    d.products?.map((p) => ({
      name: p.name,
      cask: p.cask,
      tier: p.tier,
      priceBand: p.priceBand ?? "待确认",
      confidence: confidenceZh[p.confidence] ?? "—",
    })) ?? [];
  return {
    distillery: d.name,
    region: regionName(d.region),
    reference_anchor:
      "行业价格锚点：崃州主力 100–400 元（口粮档），叠川 888 元（高端锚点）。",
    products,
  };
}

export function searchWhiskyTool(query: string) {
  const hits = searchWhisky(query);
  return {
    query,
    count: hits.length,
    results: hits.map(summarize),
  };
}

/* ---------------------------- 工具：品鉴漏斗 ---------------------------- */

export interface TastingNoteInput {
  distilleryId: string;
  product?: string;
  score?: number;
  nose?: string;
  palate?: string;
  finish?: string;
  taster?: string;
  source?: string;
}

export interface TastingNoteResult {
  accepted: boolean;
  reference?: string;
  message?: string;
  record?: Record<string, unknown>;
  error?: string;
}

/**
 * 品鉴数据漏斗：校验 + 本地落盘（data/tasting-input.jsonl）。
 * 仅采信真人来源；AI 不据此给任何权威结论，状态一律 pending_review 待复核。
 */
export async function submitTastingNote(
  args: TastingNoteInput,
): Promise<TastingNoteResult> {
  const d = getDistillery(args.distilleryId);
  if (!d) {
    return { accepted: false, error: `未找到酒厂：${args.distilleryId}` };
  }

  const id = `note_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
  const record = {
    id,
    distilleryId: args.distilleryId,
    distillery: d.name,
    receivedAt: new Date().toISOString(),
    taster: args.taster ?? null,
    source: args.source ?? null,
    product: args.product ?? null,
    score: args.score ?? null,
    nose: args.nose ?? null,
    palate: args.palate ?? null,
    finish: args.finish ?? null,
    status: "pending_review", // v0.2 复核管线据此过滤
  };

  try {
    const here = path.dirname(fileURLToPath(import.meta.url));
    const outDir = path.join(here, "..", "data");
    const outFile = path.join(outDir, "tasting-input.jsonl");
    await mkdir(outDir, { recursive: true });
    await appendFile(outFile, JSON.stringify(record) + "\n", "utf8");
  } catch (err) {
    return {
      accepted: false,
      message: "资料已校验，但本地落盘失败（不影响知识库本身）。",
      error: String(err),
    };
  }

  return {
    accepted: true,
    reference: id,
    message:
      "已收录进「上九·国威品鉴数据池」待审。本工具不据此给出任何权威评分或结论；可信数据经真人复核后，才可能进入知识库。",
    record,
  };
}

/* ---------------------------- 工具：选酒导购 ---------------------------- */

export interface RecommendInput {
  budget?: string;   // 价格偏好：如 "100-300"、"口粮"、"高端"、"500 以内"
  taste?: string;    // 风味偏好：如 "果香"、"茶韵"、"甜"、"烟熏"、"清爽"
  occasion?: string; // 场景：如 "日常口粮"、"送礼"、"品鉴/尝东方特色"
}

export interface RecommendResult {
  input: RecommendInput;
  summary: string;
  recommendations: Array<{
    rank: number;
    distillery: string;
    product: string;
    region: string;
    tier: string;
    priceBand: string;
    confidence: string;
    flavor: string;
    reasons: string[];
    score: number;
  }>;
  honesty_notice: string;
}

/** 风味词分组：把"用户偏好的词"匹配到知识库里的风味表述 */
const TASTE_GROUPS: Record<string, string[]> = {
  果香: ["果香", "热带水果", "荔枝", "金桔", "树莓", "梅子", "樱桃", "水果", "果"],
  甜: ["甜", "蜂蜜", "香草", "米酿", "糖", "果干"],
  茶: ["茶", "白茶", "茶韵", "茶桶", "茶威"],
  烟: ["烟", "泥煤", "烟熏"],
  木: ["橡木", "蒙古栎", "麻栎", "中国橡木", "木质", "木桶", "沉香"],
  花香: ["花", "花香"],
  草本: ["草本", "药", "药材", "药香"],
  黄酒: ["黄酒", "酒曲", "米酿"],
  风味桶: ["润桶", "风味桶", "实验", "过桶", "白兰地", "葡萄酒桶", "红酒桶"],
  清爽: ["清爽", "轻盈", "清淡", "易饮"],
  浓郁: ["浓郁", "厚重", "馥郁", "强度", "原桶", "饱满"],
  高海拔: ["高海拔", "高原", "海拔", "雪山", "风土", "极端", "青稞"],
};

function buildCorpus(d: Distillery): string {
  return [
    d.name, d.style, d.story, d.location, regionName(d.region),
    d.owner ?? "",
    d.process?.cask ?? "", d.process?.malt ?? "", d.process?.maturation ?? "",
    d.terroir?.climate ?? "", d.terroir?.water ?? "",
    d.flavor?.official ?? "", ...(d.flavor?.dominant ?? []),
    ...(d.products ?? []).flatMap((p) => [p.name, p.cask, p.tier]),
  ].join(" ").toLowerCase();
}

function budgetTarget(budget?: string): { band: "口粮" | "中端" | "高端" | "any"; max?: number } {
  if (!budget) return { band: "any" };
  const b = budget.toLowerCase();
  const nums = (b.match(/\d+/g) ?? []).map(Number);
  const max = nums.length ? Math.max(...nums) : undefined;
  if (b.includes("高端") || b.includes("送礼") || (max !== undefined && max >= 800)) return { band: "高端", max };
  if (b.includes("口粮") || b.includes("百元") || b.includes("实惠") || b.includes("入门") || (max !== undefined && max <= 400)) return { band: "口粮", max };
  if (b.includes("中端") || (max !== undefined && max > 400 && max < 800)) return { band: "中端", max };
  return { band: "any", max };
}

function tierBand(tier: string): "口粮" | "中端" | "高端" | "unknown" {
  const t = tier.toLowerCase();
  if (t.includes("口粮") || t.includes("入门")) return "口粮";
  if (t.includes("高端") || t.includes("中高端")) return "高端";
  if (t.includes("中端")) return "中端";
  return "unknown";
}

function budgetScore(tier: string, priceBand: string | undefined, target: ReturnType<typeof budgetTarget>): number {
  const pnums = priceBand ? (priceBand.match(/\d+/g) ?? []).map(Number) : [];
  if (target.max !== undefined && pnums.length) {
    const low = Math.min(...pnums);
    if (low <= target.max) return 3;          // 预算覆盖得到
    if (low <= target.max + 150) return 2;    // 略超预算
    return 1;
  }
  if (target.band === "any") return 2;
  const tb = tierBand(tier);
  if (tb === target.band) return 3;
  if (tb === "unknown") return 1;             // 价格/档位待确认
  return 1;
}

function tasteScore(corpus: string, taste?: string): { score: number; reasons: string[] } {
  if (!taste) return { score: 2, reasons: ["未指定风味偏好"] };
  const t = taste.toLowerCase();
  let score = 0;
  const reasons: string[] = [];
  for (const [group, kws] of Object.entries(TASTE_GROUPS)) {
    if (t.includes(group) || kws.some((k) => k.length >= 2 && t.includes(k))) {
      if (kws.some((k) => corpus.includes(k))) {
        score += 3;
        reasons.push(`符合「${group}」方向`);
      }
    }
  }
  if (score === 0 && t.length >= 2 && corpus.includes(t)) {
    score = 2;
    reasons.push(`提到了「${taste}」相关表述`);
  }
  return { score: score || 1, reasons };
}

function occasionScore(d: Distillery, tier: string, occasion?: string): number {
  if (!occasion) return 1;
  const o = occasion.toLowerCase();
  let s = 0;
  if (o.includes("送礼") || o.includes("招待") || o.includes("宴")) {
    s += tierBand(tier) === "高端" ? 3 : 1;
    s += d.confidence === "verified" ? 1 : 0;
  }
  if (o.includes("品鉴") || o.includes("尝") || o.includes("特色") || o.includes("东方")) {
    s += (d.flavor?.dominant ?? []).some((x) => /桶|茶|橡|黄酒|米酿|青稞|药/.test(x)) ? 3 : 1;
  }
  if (o.includes("日常") || o.includes("口粮") || o.includes("自己喝")) {
    s += tierBand(tier) === "口粮" ? 3 : 1;
    s += d.confidence === "verified" ? 1 : 0;
  }
  return s;
}

export function recommendWhisky(input: RecommendInput): RecommendResult {
  const target = budgetTarget(input.budget);
  const items: Array<{
    distillery: string; product: string; region: string; tier: string;
    priceBand: string; confidence: string; flavor: string; reasons: string[];
    total: number;
  }> = [];

  for (const d of DISTILLERIES) {
    const corpus = buildCorpus(d);
    const occ = occasionScore(d, d.products?.[0]?.tier ?? "", input.occasion);
    for (const p of d.products ?? []) {
      const bs = budgetScore(p.tier, p.priceBand, target);
      const ts = tasteScore(corpus, input.taste);
      const total = bs * 2 + ts.score + occ;
      items.push({
        distillery: d.name,
        product: p.name,
        region: regionName(d.region),
        tier: p.tier,
        priceBand: p.priceBand ?? "待确认",
        confidence: confidenceZh[p.confidence] ?? "—",
        flavor: (d.flavor?.dominant ?? []).join("、") || d.style,
        reasons: [...ts.reasons, p.priceBand ? `价格带 ${p.priceBand}` : "价格带待确认"],
        total,
      });
    }
  }

  items.sort((a, b) => b.total - a.total);
  const recs = items.slice(0, 5).map((it, i) => ({
    rank: i + 1,
    distillery: it.distillery,
    product: it.product,
    region: it.region,
    tier: it.tier,
    priceBand: it.priceBand,
    confidence: it.confidence,
    flavor: it.flavor,
    reasons: it.reasons,
    score: it.total,
  }));

  return {
    input,
    summary: `基于「上九·国威知识库」，按【预算 ${input.budget ?? "不限"}】【口味 ${input.taste ?? "不限"}】【场景 ${input.occasion ?? "不限"}】为 ${recs.length} 个候选打分排序（分数=预算×2 + 口味 + 场景）。`,
    recommendations: recs,
    honesty_notice:
      "本推荐基于公开口径的产区/风味/价格锚点，属方向性参考；标注「待确认/待聚合/待厂方确认」的价格与风味为待采集项，具体以官方渠道或厂方为准。",
  };
}

/* ---------------------------- 工具：内容生成 ---------------------------- */

export interface GenerateContentInput {
  topic: string;                          // 主题，如 "东方风味国产威士忌"
  format: "长文" | "小红书" | "短视频" | "选题";
  focus?: string;                         // 可选：酒厂/产区/风味关键词
}

export interface GenerateContentResult {
  input: GenerateContentInput;
  knowledge: { distilleries: string[]; regions: string[] };
  title: string;
  content: string;
  cta: string;
  facts_used: string[];
  todo: string[];        // 待核 / 待采集清单
  honesty_notice: string;
}

function contentFacts(d: Distillery): string {
  const flavor = (d.flavor?.dominant ?? []).join("、") || d.style;
  const cask = d.process?.cask ? `｜${d.process.cask}` : "";
  return `${d.name}（${regionName(d.region)}）· ${d.style}${cask}｜风味：${flavor}`;
}

function renderIdeas(topic: string, ds: Distillery[], regions: Region[]): string {
  const regionList = regions.length ? regions.map((r) => r.name).join("、") : "多产区";
  const first = regions[0]?.name ?? "国产威士忌";
  return [
    `1. 《${topic}：${first}的产区正在说话》`,
    `2. 《${topic}，一张地图看懂国产威士忌》`,
    `3. 《别再问国产威士忌好不好喝：${topic}的讲法》`,
    regions.length ? `4. 《${topic}：${regionList}谁最可喝？》` : `4. 《${topic}的 3 个真相》`,
    `5. 《我用 AI 讲了讲${topic}（附知识库工具）》`,
  ].join("\n");
}

function renderLong(topic: string, ds: Distillery[], regions: Region[]): string {
  const lines: string[] = [];
  lines.push(`# ${topic}：一篇讲清楚的国威内容`);
  lines.push("");
  lines.push("> 开头钩子：国产威士忌总被「营销号」和「情怀」裹挟，很少有人把「它是什么、从哪来、什么味」讲清楚。");
  lines.push("");
  if (regions.length) {
    lines.push("## 产区速览");
    lines.push(...regions.map((r) => `- **${r.name}**：${r.note}`));
    lines.push("");
  }
  if (ds.length) {
    lines.push("## 值得关注");
    lines.push(...ds.map((d, i) => `${i + 1}. ${contentFacts(d)}`));
    lines.push("");
  }
  lines.push("## 怎么选");
  lines.push("- 优先看已核实（✅）的厂与价格；标注 🟡/⬜ 的为待确认，购买前以官方为准。");
  lines.push("");
  lines.push("> 说明：以上为内容骨架，已用「上九·国威知识库」的真实信息填充；未核实的项见文末清单。");
  return lines.join("\n");
}

function renderXhs(topic: string, ds: Distillery[], regions: Region[]): string {
  const pick = ds.slice(0, 3);
  const lines: string[] = [];
  lines.push(`🍶 ${topic}｜国产威士忌快速入门`);
  lines.push("");
  lines.push("别再被营销号带节奏！一张图讲清楚：");
  if (regions.length) lines.push(`📍 产区：${regions.map((r) => r.name).join("、")}`);
  lines.push("");
  if (pick.length) lines.push(...pick.map((d) => `• ${d.name}：${d.style}${d.process?.cask ? "｜" + d.process.cask : ""}`));
  lines.push("");
  lines.push("✅ 我只讲知识库里有依据的，价格待确认的会标出来，不瞎吹。");
  lines.push("");
  lines.push("#国产威士忌 #威士忌 #东方风味 #上九");
  return lines.join("\n");
}

function renderVideo(topic: string, ds: Distillery[]): string {
  const a = ds[0], b = ds[1], c = ds[2];
  return [
    `【口播脚本：${topic}】(约 1 分钟)`,
    `0:00 钩子：${a ? `你知道${a.name}吗？` : "国产威士忌，你喝明白了吗？"}`,
    `0:10 第 1 段：先说产区——${b ? `${a?.name ?? ""}、${b.name}这些地方在讲什么风土` : "国产威士忌的产区到底怎么分"}`,
    `0:40 第 2 段：再看风味——${c ? `${b?.name ?? ""}、${c.name}主打什么（${(c.flavor?.dominant ?? [c.style]).join("、")}）` : "各家风味方向有什么不同"}`,
    `1:10 第 3 段：怎么选——预算+口味+场景，别只听广告。`,
    `1:40 结尾：想被讲清楚？新国威小厂可以和我们共建。`,
  ].join("\n");
}

export function generateContent(input: GenerateContentInput): GenerateContentResult {
  const { topic, format, focus } = input;
  const tokens = [topic, focus].filter((x): x is string => Boolean(x)).map((x) => x.toLowerCase());
  const matrix = tokens.length ? tokens : ["国产威士忌"];

  const matched = DISTILLERIES.filter((d) => {
    const c = buildCorpus(d);
    return matrix.some((t) => c.includes(t));
  });
  const matchedRegions = REGIONS.filter((r) => {
    const c = `${r.name} ${r.note} ${r.province}`.toLowerCase();
    return matrix.some((t) => c.includes(t));
  });

  const facts_used = [
    ...matched.map((d) => `${d.name}（${regionName(d.region)}）· ${d.style}`),
    ...matchedRegions.map((r) => `${r.name}产区`),
  ];
  const todo = [
    ...matched.filter((d) => d.confidence !== "verified").map((d) => `待厂方确认：${d.name}`),
    ...matched.flatMap((d) => (d.flavor?.dominant ?? []).filter((x) => x.includes("待聚合")).map((x) => `待聚合：${d.name}「${x}」`)),
  ];

  let content: string;
  switch (format) {
    case "小红书": content = renderXhs(topic, matched, matchedRegions); break;
    case "短视频": content = renderVideo(topic, matched); break;
    case "选题": content = renderIdeas(topic, matched, matchedRegions); break;
    default: content = renderLong(topic, matched, matchedRegions);
  }

  return {
    input,
    knowledge: { distilleries: matched.map((d) => d.name), regions: matchedRegions.map((r) => r.name) },
    title: `让世界喝懂中国威士忌：${topic}`,
    content,
    cta: "想被正确地讲清楚？新国威小厂可以和我们共建；想一起讲中国威士忌？欢迎提交你的真实品鉴。",
    facts_used,
    todo,
    honesty_notice:
      "本初稿仅基于「上九·国威知识库」的公开口径知识生成，用于内容骨架；凡标注待核/待聚合的，未经核实不得当作事实。",
  };
}
