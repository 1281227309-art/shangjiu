/**
 * 上九·国威知识库 —— 数据层（纯数据 + 类型，无外部依赖）
 *
 * 设计原则（对齐复局论证）：
 *   1. 这是一个"知识中枢"，不是产品。数据才是护城河。
 *   2. 诚实可信度标注（✅已核实 / 🟡待厂方确认 / ⬜待采集）：凡未亲身采集、
 *      未获厂方确认的一律不填、不定价、不编品鉴笔记。这是可信度资产。
 *   3. 品鉴笔记只收"真人来源"，AI 只做整理与放大，不做判断与背书。
 *
 * confidence 取值：verified / pending / unverified（对应 ✅ / 🟡 / ⬜）
 */

export type Confidence = "verified" | "pending" | "unverified";

export interface Product {
  name: string;
  cask: string;          // 桶型
  tier: string;          // 定位（口粮 / 中端 / 高端）
  priceBand?: string;    // 价格带（有真实来源才填）
  confidence: Confidence;
  note?: string;
}

export interface ProcessInfo {
  malt?: string;         // 麦芽
  yeast?: string;        // 酵母
  still?: string;        // 蒸馏器
  cask?: string;         // 桶型体系
  maturation?: string;   // 陈酿时间
}

export interface TerroirInfo {
  climate?: string;      // 气候
  water?: string;        // 水源
  aging?: string;        // 熟成环境
}

export interface FlavorInfo {
  official?: string;     // 官方风味轮
  dominant?: string[];   // 主导/特征风味词（来自真人盲品聚合，非 AI 编造）
  community?: string;    // 社区/盲品来源
}

export interface Distillery {
  id: string;
  name: string;
  region: string;        // 产区 code（见 REGIONS）
  location: string;
  owner?: string;        // 背景（酒业集团 / 独立）
  style: string;         // 定位标签
  story: string;         // 一句话故事
  source: string;        // 数据来源
  confidence: Confidence;
  process?: ProcessInfo;
  terroir?: TerroirInfo;
  flavor?: FlavorInfo;
  products?: Product[];
}

export interface Region {
  id: string;
  name: string;
  province: string;
  note: string;
  distilleryIds: string[];
}

/** 中国威士忌"产区萌芽体系"（官方/团体标准仍在成形，此为行业共识框架） */
export const REGIONS: Region[] = [
  { id: "qionglai", name: "邛崃", province: "四川", note: "川酒重镇，威士忌产能集聚地，崃州所在地。", distilleryIds: ["laizhou"] },
  { id: "emeishan", name: "峨眉山", province: "四川", note: "生态产区，叠川（保乐力加）所在地。", distilleryIds: ["diechuan"] },
  { id: "qiandaohu", name: "千岛湖", province: "浙江", note: "水源型产区，行业团体标准立项地。", distilleryIds: [] },
  { id: "dali", name: "大理", province: "云南", note: "高海拔产区，云拓（帝亚吉欧）所在地。", distilleryIds: ["yuntuo"] },
  { id: "dianxi", name: "滇西（横断山带）", province: "云南", note: "横断山及余脉产区带：无量山（茶桶）、巍山（本土木种）等，东方风味试验最密集的区域。", distilleryIds: ["lunbuka", "lingyun", "yunsuozhi"] },
  { id: "guangdong", name: "广东产区带", province: "广东", note: "大湾区 + 粤东北：源自福建的大芹、广州的中国橡木專線觀橡、梅州的米酿基因太瓏釀。", distilleryIds: ["daqin", "guanxiang", "tailongniang"] },
  { id: "shandong", name: "胶东半岛", province: "山东", note: "环渤海产区带：烟台、蓬莱的酿酒葡萄与烈酒产业带。", distilleryIds: ["jisiboer", "yuzhijin"] },
  { id: "bozhou", name: "亳州", province: "安徽", note: "淮北平原，古井贡所在地，毗邻中华药都的草本资源。", distilleryIds: ["guqi"] },
  { id: "xizang", name: "青藏高原", province: "西藏", note: "极端高海拔产区，青稞等本土谷物原料路线。", distilleryIds: ["alajiaobao"] },
];

export const DISTILLERIES: Distillery[] = [
  {
    id: "daqin",
    name: "大芹",
    region: "guangdong",
    location: "源自福建 · 扎根大湾区（广东）",
    owner: "独立（区域新势力）",
    style: "单一麦芽 · 东方风味",
    story: "从福建走向广东的中国单一麦芽代表，主打“东方风味”差异化，与苏格兰 / 台湾威士忌形成区隔。",
    source: "公开产品页（台湾酒商 / 酒展收录）+ 行业报道",
    confidence: "verified",
    process: { cask: "波本桶为主 · 含双桶", malt: "国产 / 进口大麦麦芽（待核）" },
    flavor: {
      dominant: ["东方果香（待聚合）", "波本甜感（待聚合）"],
      community: "待以真人盲品聚合，AI 不做判断",
    },
    products: [
      { name: "经典", cask: "待核", tier: "入门", confidence: "pending" },
      { name: "金牌", cask: "待核", tier: "入门-中端", confidence: "pending" },
      { name: "蓝牌", cask: "待核", tier: "中端", confidence: "pending" },
      { name: "珍藏", cask: "波本桶", tier: "中端", confidence: "verified" },
      { name: "优选B", cask: "波本桶", tier: "中端", confidence: "verified" },
      { name: "双桶", cask: "双桶", tier: "中高端", confidence: "verified" },
    ],
  },
  {
    id: "laizhou",
    name: "崃州",
    region: "qionglai",
    location: "四川邛崃",
    owner: "百润股份",
    style: "主流 · 本土风味突围",
    story: "国产威士忌绝对主力，大桶容 + 高市占（约六成），主打 100-400 元口粮档。",
    source: "行业盘点（CWS / 兴业证券）",
    confidence: "verified",
    process: { cask: "多桶型体系（含中国加强酒桶 / STR红酒桶 / 波本）", maturation: "中国法律规定威士忌须≥3年陈酿" },
    flavor: {
      dominant: ["红苹果-乌龙茶（待聚合）", "李-香草-木烟（待聚合）", "蜂蜜-杏（待聚合）"],
      community: "Whisky Scribe — https://thewhiskyscribe.com/laizhou-distillery-chinese-single-malt-whisky/",
    },
    products: [
      { name: "崃州系列", cask: "多桶", tier: "口粮-中端", priceBand: "100–400 元", confidence: "verified" },
      { name: "Finest Select", cask: "多桶·中国加强酒桶", tier: "口粮", confidence: "pending" },
      { name: "STR Red Wine Cask", cask: "STR红酒·泥煤", tier: "中端", confidence: "pending" },
      { name: "Bourbon Cask", cask: "波本·泥煤", tier: "中端", confidence: "pending" },
    ],
  },
  {
    id: "diechuan",
    name: "叠川",
    region: "emeishan",
    location: "四川峨眉山",
    owner: "保乐力加",
    style: "高端 · 生态产区",
    story: "国际烈酒集团在华高端布局，行业高端价格锚点。",
    source: "行业盘点（CWS）",
    confidence: "verified",
    process: {
      still: "双 Forsyth 壶式蒸馏器（20000L 洗酒器 + 14000L 烈酒器）",
      cask: "波本 + 雪莉 + 中国丹宁橡木（蒙古栎）",
      maturation: "发酵可达 100h",
    },
    flavor: {
      dominant: ["糖浆-棉花糖甜感（待聚合）", "柚木-雪松-薄荷柑橘（待聚合）"],
      community: "Words of Whisky（Thijs 8.3/10）— https://wordsofwhisky.com/the-chuan-pure-malt-whisky-review/",
    },
    products: [
      { name: "叠川", cask: "待核", tier: "高端", priceBand: "888 元（锚点）", confidence: "verified" },
    ],
  },
  {
    id: "yuntuo",
    name: "云拓",
    region: "dali",
    location: "云南大理",
    owner: "帝亚吉欧",
    style: "高端 · 高海拔",
    story: "帝亚吉欧在华布局，2026 Icons of Whisky China 斩获多项大奖。",
    source: "行业报道 + 2026 Icons of Whisky China",
    confidence: "verified",
    flavor: { dominant: ["高海拔 / 风土（行业共识，待聚合）"] },
    products: [
      { name: "云拓", cask: "待核", tier: "高端", confidence: "pending" },
    ],
  },

  /* ---------- 东方风味专题批次（2026-08-29 补录，均来自公开报道，待厂方确认） ---------- */

  {
    id: "lunbuka",
    name: "伦布卡（无量川）",
    region: "dianxi",
    location: "云南南涧 · 无量山",
    owner: "独立",
    style: "单一麦芽 · 东方风味 · 茶威士忌路线",
    story: "最纯粹的「茶威士忌」：以高山白茶润桶、以茶代焦糖着色，茶香参与桶陈而非后期勾兑，2024 年香港盲选金奖。",
    source: "威士忌杂志中国编辑部 / 行业报道（2026 年中）",
    confidence: "pending",
    process: { cask: "高山白茶润桶 · 以茶代糖着色" },
    terroir: { water: "无量山高山水源（待核）" },
    flavor: {
      official: "茶韵主导（厂方与报道口径，待厂方确认）",
      dominant: ["白茶 / 茶韵（报道口径，待聚合）"],
      community: "待以真人盲品聚合，AI 不做判断",
    },
    products: [
      { name: "无量川单一麦芽", cask: "白茶润桶", tier: "待核", confidence: "pending", note: "2024 香港盲选金奖（报道口径）" },
    ],
  },
  {
    id: "lingyun",
    name: "凌酝",
    region: "dianxi",
    location: "云南巍山",
    owner: "独立",
    style: "单一麦芽 · 东方风味 · 本土木种试验",
    story: "本地大麦 + 100% 地板发芽，云南麻栎、滇合欢木桶——本土木种试验走得最远的一家。",
    source: "威士忌杂志中国编辑部 / 行业报道（2026 年中）",
    confidence: "pending",
    process: { malt: "云南本地大麦 · 100% 地板发芽", cask: "云南麻栎桶 · 滇合欢木桶" },
    terroir: { climate: "滇西高原气候（待核）" },
    flavor: {
      dominant: ["本土木种风味（报道口径，待聚合）"],
      community: "待以真人盲品聚合，AI 不做判断",
    },
    products: [
      { name: "本土木种系列", cask: "云南麻栎 / 滇合欢", tier: "待核", confidence: "pending" },
    ],
  },
  {
    id: "yunsuozhi",
    name: "云之所",
    region: "dianxi",
    location: "云南",
    owner: "独立",
    style: "单一麦芽 · 东方风味 · 本地酒桶",
    story: "以云南本地葡萄酒桶做润桶/过桶试验的滇系新玩家。",
    source: "行业报道（2026 年中）",
    confidence: "pending",
    process: { cask: "云南葡萄酒桶" },
    flavor: {
      dominant: ["葡萄酒桶果香（报道口径，待聚合）"],
      community: "待以真人盲品聚合，AI 不做判断",
    },
    products: [
      { name: "待采集", cask: "云南葡萄酒桶", tier: "待核", confidence: "unverified" },
    ],
  },
  {
    id: "guanxiang",
    name: "觀橡（顺昌源）",
    region: "guangdong",
    location: "广东广州",
    owner: "顺昌源",
    style: "单一麦芽 · 东方风味 · 100% 中国橡木桶",
    story: "以「100% 中国橡木桶陈酿」为核心定位：长白山蒙古栎 + 荔枝白兰地、金桔白兰地润桶，岭南水果白兰地基因。",
    source: "威士忌杂志中国编辑部 / 行业报道（2026 年中）",
    confidence: "pending",
    process: { cask: "长白山蒙古栎 + 辽东栎（本土木种）· 荔枝酒/金桔白兰地润桶 + 泥煤蒙古栎桶" },
    flavor: {
      dominant: ["水楢-杜松-柚子（待聚合）", "木桶树脂（待聚合）"],
      community: "WhiskyNotes（Ruben 2026-07）— https://www.whiskynotes.be/2026/world/kwun-cheung-chinese-single-malt-whisky/",
    },
    products: [
      { name: "荔枝酒调味蒙古栎桶 #047", cask: "荔枝酒润桶·蒙古栎", tier: "待核", confidence: "pending" },
      { name: "泥煤蒙古栎桶 #037", cask: "泥煤·蒙古栎", tier: "待核", confidence: "pending", note: "三款最佳(85)" },
    ],
  },
  {
    id: "tailongniang",
    name: "太瓏釀（珍珠红）",
    region: "guangdong",
    location: "广东梅州",
    owner: "珍珠红（老字号）",
    style: "东方风味 · 米酿基因 · 东方工艺嫁接",
    story: "老字号米酿基因做威士忌：大米 + 酒曲发酵，陶缸老熟 + 黄酒桶后熟。",
    source: "威士忌杂志中国编辑部 / 行业报道（2026 年中）",
    confidence: "pending",
    process: { malt: "大米 + 酒曲发酵（非全麦芽路线）", cask: "陶缸老熟 + 黄酒桶后熟", maturation: "陶缸 + 桶陈交替（待核）" },
    flavor: {
      dominant: ["米酿甜感 / 黄酒韵（报道口径，待聚合）"],
      community: "待以真人盲品聚合，AI 不做判断",
    },
    products: [
      { name: "太瓏釀", cask: "黄酒桶后熟", tier: "待核", confidence: "pending" },
    ],
  },
  {
    id: "jisiboer",
    name: "吉斯波尔",
    region: "shandong",
    location: "山东烟台",
    owner: "吉斯集团",
    style: "单一麦芽 · 东方风味 · 东方香型体系",
    story: "东北蒙古栎自创「雕堡桶」，宣称沉香、茶韵风味，提出「六种东方香型」工艺体系。",
    source: "威士忌杂志中国编辑部 / 行业报道（2026 年中）",
    confidence: "pending",
    process: { cask: "蒙古栎「雕堡桶」（自创桶型）" },
    flavor: {
      official: "「六种东方香型」体系（厂方口径，待厂方确认）",
      dominant: ["沉香 / 茶韵（厂方口径，待聚合）"],
      community: "待以真人盲品聚合，AI 不做判断",
    },
    products: [
      { name: "雕堡桶系列", cask: "雕堡桶", tier: "待核", confidence: "pending" },
    ],
  },
  {
    id: "guqi",
    name: "古奇（古井贡 × 卡慕）",
    region: "bozhou",
    location: "安徽亳州",
    owner: "古井贡 × 卡慕（Camus）合资",
    style: "东方风味 · 草本威士忌",
    story: "以《九酝酒法》为灵感，依托中华药都（亳州）草本资源做草本威士忌。",
    source: "威士忌杂志中国编辑部 / 行业报道（2026 年中）",
    confidence: "pending",
    process: { cask: "待核", yeast: "待核", malt: "待核" },
    flavor: {
      dominant: ["草本 / 药香（报道口径，待聚合）"],
      community: "待以真人盲品聚合，AI 不做判断",
    },
    products: [
      { name: "草本威士忌", cask: "待核", tier: "待核", confidence: "pending" },
    ],
  },
  {
    id: "yuzhijin",
    name: "钰之锦",
    region: "shandong",
    location: "山东蓬莱",
    owner: "独立",
    style: "单一麦芽 · 东方风味 · 风味桶实验",
    story: "做过中国茶桶、树莓桶、霞多丽桶润桶实验，胶东半岛的风味桶试验型玩家。",
    source: "威士忌杂志中国编辑部 / 行业报道（2026 年中）",
    confidence: "pending",
    process: { cask: "中国茶桶 / 树莓桶 / 霞多丽桶（实验体系）" },
    flavor: {
      dominant: ["茶 / 树莓果香（报道口径，待聚合）"],
      community: "待以真人盲品聚合，AI 不做判断",
    },
    products: [
      { name: "风味桶实验系列", cask: "茶桶 / 树莓桶 / 霞多丽桶", tier: "待核", confidence: "pending" },
    ],
  },
  {
    id: "alajiaobao",
    name: "阿拉嘉宝 / 香格里拉",
    region: "xizang",
    location: "西藏",
    owner: "独立",
    style: "东方风味 · 青稞威士忌 · 极端风土",
    story: "以青稞为原料的本土谷物路线，青藏高原极端高海拔风土。",
    source: "威士忌杂志中国编辑部 / 行业报道（2026 年中）",
    confidence: "pending",
    process: { malt: "青稞（本土谷物，非大麦路线）" },
    terroir: { climate: "极端高海拔 / 强紫外（待核）" },
    flavor: {
      dominant: ["青稞谷物感（报道口径，待聚合）"],
      community: "待以真人盲品聚合，AI 不做判断",
    },
    products: [
      { name: "青稞威士忌", cask: "待核", tier: "待核", confidence: "pending" },
    ],
  },
];

/** 按 id 取酒厂 */
export function getDistillery(id: string): Distillery | undefined {
  return DISTILLERIES.find((d) => d.id === id);
}

/** 产区码 → 名称 */
export function regionName(regionId: string): string {
  return REGIONS.find((r) => r.id === regionId)?.name ?? regionId;
}

/** 搜索：匹配 名称 / 产区 / 主导风味词 / 定位 */
export function searchWhisky(query: string): Distillery[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return DISTILLERIES.filter((d) => {
    const haystack = [
      d.name,
      d.style,
      regionName(d.region),
      d.location,
      ...(d.flavor?.dominant ?? []),
      ...(d.story ? [d.story] : []),
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });
}
