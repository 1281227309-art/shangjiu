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
  contributedBy?: string; // 贡献者（GitHub 用户名 / 署名），仅在被复核进库后填
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
  contributedBy?: string; // 贡献者（GitHub 用户名 / 署名），仅在被复核进库后填
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
  { id: "qiandaohu", name: "千岛湖", province: "浙江", note: "水源型产区：2026-09 发布国内首个产区级威士忌团体标准与产区 Logo（森林覆盖率 77.8%），已集聚酒厂 6 家、设计产能 2.03 万吨/年，主打「酒+文旅」。", distilleryIds: ["chunan"] },
  { id: "dali", name: "大理", province: "云南", note: "高海拔产区，云拓（帝亚吉欧）所在地。", distilleryIds: ["yuntuo"] },
  { id: "dianxi", name: "滇西（横断山带）", province: "云南", note: "横断山及余脉产区带：无量山（茶桶）、巍山（本土木种）等，东方风味试验最密集的区域。", distilleryIds: ["lunbuka", "lingyun", "yunsuozhi"] },
  { id: "guangdong", name: "广东产区带", province: "广东", note: "大湾区 + 粤东北：源自福建的大芹、广州的中国橡木專線觀橡、梅州的米酿基因太瓏釀。", distilleryIds: ["daqin", "guanxiang", "tailongniang"] },
  { id: "shandong", name: "胶东半岛", province: "山东", note: "环渤海产区带：烟台、蓬莱的酿酒葡萄与烈酒产业带。", distilleryIds: ["jisiboer", "yuzhijin"] },
  { id: "bozhou", name: "亳州", province: "安徽", note: "淮北平原，古井贡所在地，毗邻中华药都的草本资源。", distilleryIds: ["guqi"] },
  { id: "xizang", name: "青藏高原", province: "西藏", note: "极端高海拔产区，青稞等本土谷物原料路线。", distilleryIds: ["alajiaobao"] },
  { id: "liuyang", name: "浏阳（湘东）", province: "湖南", note: "湘东产区：大围山（罗霄山脉，海拔 1608m）第四纪冰川高山湖泊群水源，花炮庆典文化加持，高朗所在地。", distilleryIds: ["gaolang"] },
  { id: "minxi", name: "闽西（龙岩）", province: "福建", note: "武夷山脉南段生态产区：龙岩新罗区小池镇培斜村（国家森林乡村）为德熙所在地；福建亦是大芹品牌的起家地。", distilleryIds: ["dexi"] },
];

export const DISTILLERIES: Distillery[] = [
  {
    id: "daqin",
    name: "大芹",
    region: "guangdong",
    location: "福建起家 · 广东惠州龙门（永汉镇锦城村）新厂",
    owner: "独立（区域新势力）",
    style: "单一麦芽 · 东方风味 · 酒旅/康养融合",
    story: "中国大陆首家引进苏格兰大型蒸馏设备的酒厂（2007 年建于福建）。2026 年 4 月广东惠州龙门新厂投料试产：总投资 16 亿元、占地 375 亩，达产后年产可达 2 万千升，有望成为全球规模领先的单体单一麦芽威士忌酒厂；2020 年产品上市以来累计斩获 138 项国际烈酒竞赛奖项。",
    source: "惠州市政府门户 / 惠州日报（2026-04）+ 公开产品页（台湾酒商 / 酒展收录）+ 行业报道",
    confidence: "verified",
    process: { cask: "波本桶为主 · 含双桶", malt: "国产 / 进口大麦麦芽（待核）", still: "龙门新厂引进先进酿造设备（含大型糖化与自动化控制系统）" },
    terroir: { climate: "惠州龙门 · 环南昆山—罗浮山带", aging: "龙门新厂（宣称融合温泉康养，打造「美酒+康养」文旅地标）" },
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
    story: "国产威士忌绝对主力（高市占、大桶容）；2025-06-19 发布 5 款单一麦芽新品，全面覆盖 200–500 元价格带。同集团另有调和品牌「百利得」（22 / 66 流通版，99 / 219 元）。",
    source: "兴业证券《百润股份》研报（2025-06 / 2026-08）+ 行业盘点（CWS）",
    confidence: "verified",
    process: { cask: "多桶型体系（中式桶为差异化卖点：黄酒桶 / 蒙古栎桶 + STR 红酒桶 / 波本 / 加强酒桶）", maturation: "中国法律规定威士忌须≥3年陈酿" },
    flavor: {
      dominant: ["红苹果-乌龙茶（待聚合）", "李-香草-木烟（待聚合）", "蜂蜜-杏（待聚合）"],
      community: "Whisky Scribe — https://thewhiskyscribe.com/laizhou-distillery-chinese-single-malt-whisky/",
    },
    products: [
      { name: "崃州甄选（多桶融合）", cask: "多桶融合", tier: "中端口粮", priceBand: "229 元 / 700ml（40%vol）", confidence: "verified" },
      { name: "STR 红葡萄酒桶", cask: "STR 红葡萄酒桶", tier: "中端", priceBand: "279 元 / 700ml（46%vol）", confidence: "verified" },
      { name: "菲诺雪莉桶", cask: "菲诺雪莉桶", tier: "中端", priceBand: "279 元 / 700ml（46%vol）", confidence: "verified" },
      { name: "泥煤波本", cask: "泥煤波本桶", tier: "中端", priceBand: "339 元 / 700ml（46%vol）", confidence: "verified" },
      { name: "阿蒙蒂亚雪莉桶桶强", cask: "阿蒙蒂亚雪莉桶（桶强）", tier: "高端", priceBand: "499 元 / 700ml（66%vol）", confidence: "verified" },
      { name: "创世版（2024-11 限量）", cask: "多桶", tier: "限量", confidence: "verified", note: "试水限量款，已售罄" },
    ],
  },
  {
    id: "diechuan",
    name: "叠川",
    region: "emeishan",
    location: "四川峨眉山",
    owner: "保乐力加",
    style: "高端 · 生态产区",
    story: "保乐力加在华首款中国原产威士忌（2023-12 首发），累计投入逾 10 亿元建峨眉山酒厂与体验中心（如恩设计 Neri&Hu 操刀，含「叠宴」餐厅）；行业高端价格锚点。",
    source: "新华网（2023-12-13）+ 香港文汇报（2026-06）+ 行业盘点（CWS）",
    confidence: "verified",
    process: {
      still: "双 Forsyth 壶式蒸馏器（20000L 洗酒器 + 14000L 烈酒器）",
      cask: "三大洲橡木桶：美国波本桶 + 西班牙雪莉桶 + 中国长白山「单岭」橡木桶（叠川独有）",
      malt: "同时使用来自欧洲与中国的大麦",
      maturation: "发酵可达 100h；采用「叠式调配法」（官方口径）",
    },
    flavor: {
      official: "波本桶香草花果香 · 雪莉桶蜜饯甜香 · 单岭桶檀香与陈皮交织的东方尾韵（官方口径）",
      dominant: ["糖浆-棉花糖甜感（待聚合）", "柚木-雪松-薄荷柑橘（待聚合）"],
      community: "Words of Whisky（Thijs 8.3/10）— https://wordsofwhisky.com/the-chuan-pure-malt-whisky-review/",
    },
    products: [
      { name: "叠川（纯麦芽）", cask: "三大洲橡木桶", tier: "高端", priceBand: "888 元 / 700ml", confidence: "verified", note: "官方标注 Pure Malt（纯麦芽）；官方未披露是否使用集团旗下其他酒厂原酒" },
      { name: "烟熏中国单岭桶（麦芽威士忌）", cask: "中国单岭橡木桶（烟熏）", tier: "高端", confidence: "pending", note: "官方称 2027-04 上市（香港文汇报）" },
      { name: "PX 雪莉桶（麦芽威士忌）", cask: "PX 雪莉桶", tier: "高端", confidence: "pending", note: "官方称 2027-04 上市（香港文汇报）" },
    ],
  },
  {
    id: "yuntuo",
    name: "云拓",
    region: "dali",
    location: "云南大理洱源县（海拔约 2100m）",
    owner: "帝亚吉欧",
    style: "高端 · 高海拔 · 单一麦芽",
    story: "帝亚吉欧在中国设立的首座威士忌酒厂（2024-11 落成），依托集团逾 200 年苏格兰酿造经验；2026-08 首闯国际赛事即凭新酒（New Make）摘得 2026 世界威士忌大师赛金奖；首批成品预计 2027 年发布。",
    source: "周末画报官方稿（2026-08-05）+ 2026 Icons of Whisky China + 行业报道",
    confidence: "verified",
    process: {
      still: "Abercrombie 铜质壶式蒸馏器（慢速蒸馏，回流设计保留轻盈花果香）",
      malt: "慢速糖化；120 小时超长酵酿",
      cask: "多种桶型桶陈实验中（具体桶型待采集）",
      maturation: "首批成品预计 2027 年发布",
    },
    terroir: {
      climate: "滇西高原 · 气候温和、昼夜温差显著",
      water: "大理洱海源头水系天然泉水「三爷泉」",
      aging: "洱源县海拔约 2100m 酒厂",
    },
    flavor: {
      official: "新酒以「果香带动花香」为风格骨架（官方口径）",
      dominant: ["花果香（官方新酒口径，待聚合）"],
      community: "2026 世界威士忌大师赛（The World Whisky Masters 2026）New Make 类别金奖",
    },
    products: [
      { name: "云拓单一麦芽威士忌（首批成品）", cask: "待采集", tier: "高端", confidence: "pending", note: "预计 2027 年发布" },
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

  /* ---------- 湘东批次（来源：湖南日报·新湖南 + 酒厂分享瓶横评 + 海外在售档案） ---------- */

  {
    id: "gaolang",
    name: "高朗（Goalong）",
    region: "liuyang",
    location: "湖南浏阳 · 大围山下（浏阳河畔）",
    owner: "浏阳高朗烈酒酿造有限公司（高朗烈酒集团）",
    style: "单一麦芽 · 多桶型试验 · 酒旅融合",
    story: "湘东大围山下的多桶型玩家：2011 年起步、2018–2021 在浏阳建成蒸馏厂并量产，酒窖达 28 种桶型，主打中式雪莉与中国白兰地桶；国产威士忌进入英国市场的先行者，2025 年 11 月威士忌游客中心揭幕。",
    source: "湖南日报·新湖南（2024-10 / 2025-11）+ 什么值得买酒厂分享瓶横评（2023-01）+ 海外酒商在售档案",
    confidence: "verified",
    process: {
      still: "3×5 吨初馏釜（初馏 6h / 约 26%）+ 2×5 吨精馏釜（精馏 10h / 70%，酒心收得率 18%）+ 塔式蒸馏器（4 吨发酵液/小时）；导热油加热，控温可达 140℃ 以上（强化美拉德反应，新酒带烤面包焦香）",
      cask: "酒窖 28 种桶型：波本 / 中式雪莉 / 中国白兰地 / 水楢 / 泥煤 + 多种红酒桶（长相思、霞多丽、波特、波尔多、勃艮第、STR 等）",
      malt: "单一麦芽 200 万升 + 糯米威士忌 200 万升（设计年产能；产能释放约 50%）",
      maturation: "设计年产麦芽 / 谷物蒸馏原酒各 2000 千升，年产量可过万桶（工艺参数为 2023 年口径，待核）",
    },
    terroir: {
      climate: "亚热带季风气候 · 四季分明（大围山）",
      water: "浏阳河源头：罗霄山脉大围山（海拔 1608m）第四纪冰川高山湖泊群（1300m 以上 13 个湖泊，呈高山湿地）",
      aging: "浏阳河畔酒窖 · 蒸馏厂占地 80 亩、规划建筑面积 6 万㎡",
    },
    flavor: {
      official: "麦芽香气馥郁 · 玫瑰花香 + 青苹果果香（媒体 / 厂方口径）",
      dominant: ["麦芽-柑橘青苹果（待聚合）", "奶油甜感 / 烤面包焦香（待聚合）"],
      community: "什么值得买·酒厂分享瓶横评（2023-01，8 款桶型 + New Make）— https://post.smzdm.com/p/aevq00pz/",
    },
    products: [
      { name: "高朗 5 年", cask: "波本桶", tier: "口粮-中端", confidence: "pending" },
      { name: "Goalong Bourbon Cask 5 Years", cask: "波本桶", tier: "出口款", confidence: "pending", note: "海外酒商在售（含英国市场）" },
      { name: "2026 生肖款（Year of the Horse）", cask: "待核", tier: "限量/收藏", confidence: "pending" },
      { name: "分享瓶 / 多桶型试验系列", cask: "波本 / 雪莉 / 白兰地 / 波特 / 霞多丽 / 长相思 / STR 等", tier: "待核", confidence: "pending" },
    ],
  },

  /* ---------- 闽西批次（来源：中国网海峡频道 / 龙岩市融媒体中心 2026-04） ---------- */

  {
    id: "dexi",
    name: "德熙",
    region: "minxi",
    location: "福建龙岩新罗区小池镇培斜村",
    owner: "怡园酒业（港股上市）旗下烈酒项目",
    style: "单一麦芽 · 双桶 · 生态产区",
    story: "福建龙岩首家高端威士忌酒厂：占地约 3.8 万㎡、设计年产威士忌 3000 吨，依托「国家森林乡村」培斜村的生态禀赋；首批三年陈酿已通过专业检测、符合上市标准，计划 2026 年下半年投市，填补龙岩高端威士忌酿造产业空白、补强「福酒」品牌矩阵。",
    source: "中国网海峡频道 / 龙岩市融媒体中心（2026-04）",
    confidence: "pending",
    process: {
      cask: "双桶体系（核心产品「融萃双桶」）",
      maturation: "首批三年陈酿（2026 年满三年达上市标准）",
    },
    terroir: { climate: "闽西 · 武夷山脉南段", water: "培斜村「国家森林乡村」生态禀赋（待核）" },
    flavor: {
      dominant: ["待采集"],
      community: "待以真人盲品聚合，AI 不做判断",
    },
    products: [
      { name: "德熙融萃双桶单一麦芽威士忌", cask: "双桶", tier: "待核", confidence: "pending", note: "2026-05-15 北京威士忌节全国首秀" },
    ],
  },

  /* ---------- 千岛湖批次（来源：杭州日报 / 杭州市政府门户 2026-09-21） ---------- */

  {
    id: "chunan",
    name: "淳岸",
    region: "qiandaohu",
    location: "浙江杭州淳安 · 千岛湖",
    owner: "英国奥歌诗丹迪集团（Angus Dundee Distillers）全资",
    style: "单一麦芽 · 外资 · 工旅融合",
    story: "英国奥歌诗丹迪集团全资打造，是该集团在英国本土以外唯一的单一麦芽威士忌酒厂，也是千岛湖首个外资工旅融合项目；2026 年 7 月体验中心对外开放，提供沉浸式导览、3D 光影秀与全流程车间参观。",
    source: "杭州日报 / 杭州市政府门户（2026-09-21）",
    confidence: "pending",
    process: { cask: "待采集", still: "待采集" },
    terroir: { climate: "千岛湖水源型产区（产区森林覆盖率 77.8%）", water: "千岛湖水系（待核）" },
    flavor: {
      dominant: ["待采集"],
      community: "待以真人盲品聚合，AI 不做判断",
    },
    products: [
      { name: "待采集", cask: "待采集", tier: "待核", confidence: "unverified" },
    ],
  },
];

/* ============================ 产业大盘数据 ============================ */

export interface IndustryMetric {
  label: string;
  value: string;
  note?: string;
}

export interface IndustrySnapshot {
  asOf: string;
  source: string;
  metrics: IndustryMetric[];
}

/**
 * 中国威士忌产业大盘（中国酒业协会 2026-09-19 于千岛湖威士忌嘉年华发布）
 * 口径说明：属行业协会调研/统计数据，非审计数据；引用时须标注来源与时间。
 */
export const INDUSTRY_SNAPSHOT: IndustrySnapshot = {
  asOf: "2026-09-19",
  source: "中国酒业协会《中国威士忌产业发展报告》（2026 威士忌文化交流大会暨第三届千岛湖威士忌嘉年华）",
  metrics: [
    { label: "生产厂家", value: "64 家", note: "同比增加 9 家" },
    { label: "实际蒸馏能力", value: "约 7 万千升/年", note: "设计产能 13 万千升；远期规划 30 万千升" },
    { label: "已投产产值", value: "约 158.5 亿元", note: "远期市场空间超过 200 亿元" },
    { label: "进口份额", value: "85%", note: "其中英国威士忌 65%，其他进口 20%" },
    { label: "国产份额", value: "15%", note: "以高增速成为市场不可忽视的变量" },
    { label: "消费者体验率", value: "85% 体验过国产威士忌", note: "购买转化率 60%（协会调研口径）" },
    { label: "核心价格带", value: "300–500 元", note: "占市场份额 55%" },
    { label: "消费城市", value: "一二线合计近八成", note: "北京 / 上海 / 广州 / 苏州 / 深圳等" },
    { label: "品类结构", value: "麦芽 59% / 谷物 17% / 调和 24%" },
    { label: "2025 进口", value: "3584 万升（同比 +22.8%）", note: "进口均价 -13.73% → 15.46 美元，呈“量增价跌”" },
    { label: "2025 出口", value: "1324 万升（同比 +50.8%）", note: "出口均价 7.4 美元（同比 -6%）" },
    { label: "东方特色桶型", value: "黄酒桶 / 蒙古栎桶 / 烟熏·茶叶润桶" },
    { label: "行业时间锚点", value: "2026–2027 产品集中上市", note: "中酒协：市场将首次全面检验国产威士忌品质成色" },
  ],
};

/* ======================= 威士忌新国标（合规判据） ======================= */

export interface StandardPoint {
  topic: string;
  requirement: string;
}

export interface WhiskyStandard {
  code: string;
  name: string;
  effectiveFrom: string;
  source: string;
  points: StandardPoint[];
}

/**
 * 威士忌新国标要点（GB/T 11856.1-2025，2026-02-01 实施）
 * 用途：判断一款产品“是不是威士忌、是哪一类威士忌”的合规判据。
 */
export const WHISKY_STANDARD: WhiskyStandard = {
  code: "GB/T 11856.1-2025",
  name: "《烈性酒质量要求 第1部分：威士忌》",
  effectiveFrom: "2026-02-01",
  source: "国家市场监督管理总局（国家标准化管理委员会）发布；中国消费者报 / 新浪财经 解读",
  points: [
    { topic: "定义", requirement: "以谷物为原料，经糖化、发酵、蒸馏、陈酿，经或不经调配而成的蒸馏酒——调配被明确为非必要工艺。" },
    { topic: "分类（按原料）", requirement: "麦芽威士忌（大麦麦芽为唯一谷物原料，橡木桶陈酿）/ 谷物威士忌。" },
    { topic: "分类（按工艺）", requirement: "调配威士忌 / 风味威士忌（本次新增类别）。" },
    { topic: "单一麦芽威士忌", requirement: "同一工厂至少完成糖化、发酵、蒸馏；不得使用外源性酶；橡木桶陈酿不少于 3 年。" },
    { topic: "单一谷物威士忌", requirement: "在同一工厂至少完成糖化、发酵、蒸馏的谷物威士忌。" },
    { topic: "陈酿下限", requirement: "原酒陈酿时间不应少于 2 年。" },
    { topic: "新酒酒精度", requirement: "蒸馏所得威士忌新酒的最高酒精度应小于 95%vol。" },
    { topic: "禁用物质", requirement: "不得使用食用酒精、呈色物质（焦糖色除外）、呈香呈味物质（风味威士忌除外）。" },
    { topic: "风味威士忌标识", requirement: "必须在标签明确标示为「风味威士忌」，不得只标「威士忌」；甜味物质超过 5g/L 须标示总糖含量。" },
    { topic: "橡木片陈酿", requirement: "使用橡木片仍须满足木桶陈酿至少 2 年，且标签须明示使用了橡木片。" },
    { topic: "谷物命名", requirement: "某一种谷物占比超过 51%（质量分数）可标示为「XX 谷物威士忌」（如高粱谷物威士忌）。" },
    { topic: "酒龄标示", requirement: "建议标示；酒龄 = 该产品所用原酒的最小酒龄（最短 5 年则标 5 年）。" },
  ],
};

/* ============ 团体标准：固态酿造谷物威士忌（中式路线） ============ */

export interface GroupStandard {
  name: string;
  issuedBy: string;
  issuedAt: string;
  source: string;
  definition: string;
  keyPoints: string[];
}

/**
 * 《固态酿造谷物威士忌》团体标准（2026-06 发布）
 * 用途：与苏格兰路线并列的「中式威士忌」技术体系，判断酱香型/固态发酵威士忌的依据。
 */
export const GROUP_STANDARD_SOLID: GroupStandard = {
  name: "《固态酿造谷物威士忌》团体标准",
  issuedBy: "中国轻工业联合会组织，贵州国台数智酒业集团、中国食品发酵工业研究院等共同研制；中国工程院院士孙宝国领衔 9 位专家审查通过",
  issuedAt: "2026-06",
  source: "新华财经（2026-09-16，中国轻工业联合会质量标准部主任刘晶晶致辞）",
  definition:
    "以高粱、小麦为主要原料，以大曲作为糖化发酵剂，经固态糖化、固态发酵、固态蒸馏、陶坛陈酿、再次蒸馏、木桶陈酿后，经或不经调配，具有独特风格的谷物威士忌。",
  keyPoints: [
    "填补我国固态酿造谷物威士忌标准的技术空白，经专家组认定整体达到国际先进水平。",
    "感官体系引入「粮香」「陈香」「发酵香」等中国烈酒特色词汇，与焦糖香、奶油香、香草香、橡木香结合。",
    "在 GB/T 11856.1-2025 基础上增设 3 项指标：乙酸乙酯／乳酸乙酯、威士忌内酯、香兰素。",
    "乙酸乙酯与乳酸乙酯比值设定为不高于 4.0，用以体现固态酿造工艺形成的风味指纹。",
    "威士忌内酯与香兰素纳入指标，量化橡木桶陈酿带来的橡木香与甜香。",
    "优级产品高级醇含量不高于每升 5.0 克，严于相关国家标准要求。",
    "实践范本：国台·尚牌威士忌 —— 天士力大健康产业投资集团与美国 Maritine Brands INC. 联合出品，贵州国台数智酒业技术监制；原酒产自贵州茅台镇，陶坛陈酿后运往美国肯塔基州谢尔比维尔入波本橡木桶熟成。",
  ],
};

/* ==================== 产业政策（利好依据） ==================== */

export interface PolicyItem {
  name: string;
  issuedAt: string;
  detail: string;
}

export const INDUSTRY_POLICIES: PolicyItem[] = [
  {
    name: "《酿酒产业提质升级指导意见（2026—2030年）》",
    issuedAt: "2026-02",
    detail:
      "工业和信息化部、人力资源社会保障部、市场监管总局联合印发；明确支持威士忌、白兰地、伏特加等产品本土化发展，鼓励各地挖掘自然风土、历史文化、产品风格等资源禀赋，塑造核心竞争力。",
  },
  {
    name: "威士忌进口税率下调",
    issuedAt: "近年",
    detail: "降低进口成本，同时为国产与进口的公平竞争提供环境（中酒协口径）。",
  },
  {
    name: "酒类产业定位调整",
    issuedAt: "近年",
    detail: "酒类从过去的「限制性行业」转为国家重点扶持的「历史经典产业」（中酒协口径）。",
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
