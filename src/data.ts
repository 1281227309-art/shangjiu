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
  { id: "emeishan", name: "峨眉山", province: "四川", note: "中国威士忌四大产区之一，锚定「中国高端威士忌产区」：叠川（保乐力加）与高桥威士忌酒庄（郎酒，年产能 1 万吨）所在地。", distilleryIds: ["diechuan", "gaoqiao"] },
  { id: "qiandaohu", name: "千岛湖", province: "浙江", note: "水源型产区：2026-09-19 发布国内首个以「产区」命名的威士忌团体标准（T/HZAS 118—2026，2026-10-19 实施）与产区 Logo（森林覆盖率 77.8%），据地方官媒与政府门户已集聚酒厂 6 家（投产家数待核）、设计产能 2.03 万吨/年，主打「酒+文旅」；含英国奥歌诗丹迪旗下淳岸、隐象、万季等。", distilleryIds: ["chunan", "chunzhigu", "qdhjinjiu", "yinxiang", "wanji"] },
  { id: "dali", name: "大理", province: "云南", note: "高海拔产区，云拓（帝亚吉欧）所在地。2025-12-08 大理州威士忌行业协会揭牌（报道称国内首个地方威士忌行业协会），同步推进「大理威士忌」团体商标与《大理威士忌团体标准》，聘爱尔兰酿酒师 Noel Sweeney 任产业国际首席顾问。", distilleryIds: ["yuntuo"] },
  { id: "dianxi", name: "滇西（横断山带）", province: "云南", note: "横断山及余脉产区带：无量山（茶桶）、巍山（本土木种）等，东方风味试验最密集的区域。", distilleryIds: ["lunbuka", "lingyun", "yunsuozhi"] },
  { id: "guangdong", name: "广东产区带", province: "广东", note: "大湾区 + 粤东北：源自福建的大芹（广东基地=惠州龙门新厂，勿与其他品牌广东项目混淆）、广州的中国橡木專線觀橡、梅州的米酿基因太瓏釀。", distilleryIds: ["daqin", "guanxiang", "tailongniang"] },
  { id: "shandong", name: "胶东半岛", province: "山东", note: "环渤海产区带：烟台、蓬莱的酿酒葡萄与烈酒产业带；青岛为青岛啤酒体系旗下「青岛牌威士忌」所在地。", distilleryIds: ["jisiboer", "yuzhijin", "qingdao"] },
  { id: "bozhou", name: "亳州", province: "安徽", note: "淮北平原，古井贡所在地，毗邻中华药都的草本资源。", distilleryIds: ["guqi"] },
  { id: "xizang", name: "青藏高原", province: "西藏", note: "极端高海拔产区，青稞等本土谷物原料路线。", distilleryIds: ["alajiaobao"] },
  { id: "liuyang", name: "浏阳（湘东）", province: "湖南", note: "湘东产区：大围山（罗霄山脉，海拔 1608m）第四纪冰川高山湖泊群水源，花炮庆典文化加持，高朗所在地。", distilleryIds: ["gaolang"] },
  { id: "minxi", name: "闽西（龙岩）", province: "福建", note: "武夷山脉南段生态产区：龙岩新罗区小池镇培斜村（国家森林乡村）为德熙所在地，新罗区龙池工业园区为久溪所在地；福建亦是大芹品牌的起家地。", distilleryIds: ["dexi", "jiuxi"] },
];

export const DISTILLERIES: Distillery[] = [
  {
    id: "daqin",
    name: "大芹",
    region: "guangdong",
    location: "福建起家 · 广东惠州龙门（永汉镇锦城村）新厂",
    owner: "独立（区域新势力）",
    style: "单一麦芽 · 东方风味 · 酒旅/康养融合",
    story: "中国大陆首家引进苏格兰大型蒸馏设备的酒厂（2007 年建于福建）。2026 年 4 月广东惠州龙门新厂投料试产：总投资 16 亿元、占地 375 亩，达产后年产可达 2 万千升（品牌方口径称有望成为全球规模领先的单体单一麦芽威士忌酒厂）。广东惠州龙门新厂即大芹品牌的第二产区基地，勿与其他品牌的广东项目混淆；2020 年产品上市以来累计斩获 138 项国际烈酒竞赛奖项。",
    source: "惠州日报（今日惠州网，2026-04-29，http://www.huizhou.cn/news/newsc_counties/newsc_clm/202604/t20260429_1650346.htm）+ 公开产品页（台湾酒商 / 酒展收录）+ 行业报道",
    confidence: "verified",
    process: { cask: "波本桶为主 · 含双桶", malt: "国产 / 进口大麦麦芽（待核）", still: "龙门新厂引进先进酿造设备（含大型糖化与自动化控制系统）" },
    terroir: { climate: "惠州龙门 · 环南昆山—罗浮山带", aging: "龙门新厂（宣称融合温泉康养，打造「美酒+康养」文旅地标）" },
    flavor: {
      dominant: ["东方果香（待聚合）", "波本甜感（待聚合）"],
      community: "待以真人盲品聚合，AI 不做判断",
    },
    products: [
      { name: "经典", cask: "待核", tier: "入门", confidence: "pending" },
      { name: "金牌", cask: "待核", tier: "入门-中端", priceBand: "399 元 / 700ml", confidence: "pending", note: "价格为每日经济新闻 2026-09-30 线上调查所得平台价，非厂方官方口径；台湾经销体系同名牌为 43%vol/700ml，SKU 对应关系待核" },
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
    story: "国产威士忌绝对主力（高市占、大桶容）；2025-06-19 发布 5 款单一麦芽新品，全面覆盖 200–500 元价格带。桶陈规模已达 60 万桶并称以每年 10 万桶向 120 万桶迈进（媒体报道口径）。2026 年世界威士忌大赛（WWA）中，其 Bourbon Cask Peated Malt 获「中国最佳单一麦芽威士忌」（Best Chinese Single Malt）。同集团另有调和品牌「百利得」（22 / 66 流通版，99 / 219 元）。",
    source: "兴业证券《百润股份》研报（2025-06 / 2026-08）+ 行业盘点（CWS）+ WWA 2026 官方获奖页 + 华夏酒报 / 第一财经（2026）",
    confidence: "verified",
    process: { cask: "多桶型体系（中式桶为差异化卖点：黄酒桶 / 蒙古栎桶 + STR 红酒桶 / 波本 / 加强酒桶）", maturation: "中国法律规定威士忌须≥3年陈酿" },
    flavor: {
      dominant: ["红苹果-乌龙茶（待聚合）", "李-香草-木烟（待聚合）", "蜂蜜-杏（待聚合）"],
      community: "Whisky Scribe — https://thewhiskyscribe.com/laizhou-distillery-chinese-single-malt-whisky/；WWA 2026 官方获奖页：Best Chinese Single Malt — Laizhou / Bourbon Cask Peated Malt（ABV 50.00%，https://www.worldwhiskiesawards.com/winner-whisky/best-63068-world-whiskies-awards-2026）。同届官网可核牌数为 5 金（含 Blender 22）、4 银、≥6 铜，Blender 22 与 Sherry Harmony No 2 另获 Best（F 线亲验 WWA 官网列表）",
    },
    products: [
      { name: "崃州甄选（多桶融合）", cask: "多桶融合", tier: "中端口粮", priceBand: "229 元 / 700ml（40%vol）", confidence: "verified" },
      { name: "STR 红葡萄酒桶", cask: "STR 红葡萄酒桶", tier: "中端", priceBand: "279 元 / 700ml（46%vol）", confidence: "verified" },
      { name: "菲诺雪莉桶", cask: "菲诺雪莉桶", tier: "中端", priceBand: "279 元 / 700ml（46%vol，首发期口径）", confidence: "pending", note: "价格两说并存，勿单取一值：279 元为 2025-06 首发期研报口径；359 元/瓶为每日经济新闻 2026-09-30 线上调查（配图为崃州蒸馏厂公众号截图，属平台/终端观察价）。崃州官网 / 公众号 / 有赞商城均不披露价格，官方指导价未取得，故价格为 pending；规格 46%vol / 700ml 维持 verified（WWA silver-63005 菲诺 46.00%）" },
      { name: "泥煤波本", cask: "泥煤波本桶", tier: "中端", priceBand: "339 元 / 700ml（50%vol）", confidence: "pending", note: "规格由 46%vol 更正为 50%vol：WWA 2026 官方页「Bourbon Cask Peated Malt」ABV 50.00%（F 线亲验）；崃州官方公众号图卡作 50%vol（OCR 取证，未经二次复核）。原 46%vol 疑为同批另两款 46%vol 规格误复制；中文别名与英文款名属映射推断，故 pending。339 元为平台价口径" },
      { name: "PX 雪莉桶桶强单一麦芽威士忌（2026-02 上新）", cask: "PX 雪莉桶（桶强）", tier: "中高端", confidence: "pending", note: "每日经济新闻 2026-09-30 报道 2026 年 2 月上新；公司口径原文页为 JS 渲染未取到，无公开定价" },
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
    source: "保乐力加集团官方发布（2023-12-12，法文稿，口径为「whisky pur malt 纯麦芽」）+ 新华网（2023-12-13）+ 香港文汇报（2026-06）+ 行业盘点（CWS）",
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
      community: "Words of Whisky（Thijs 8.3/10）— https://wordsofwhisky.com/the-chuan-pure-malt-whisky-review/；ISC 官方历史成绩库：2024 年 World Whisky / Blended Malt Whisky 组别 GOLD（The Chuan Pure Malt Whisky，Pernod Ricard），同期另获 Design & Packaging、New Brand Launch GOLD；2025 年 PX Finish GOLD、non chill filtered SILVER（F 线亲验 ISC 官方结果 JSON）",
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
    story: "帝亚吉欧在中国设立的首座威士忌酒厂（2024-11 落成），依托集团逾 200 年苏格兰酿造经验；2026-08 首闯国际赛事即凭新酒（New Make）摘得 2026 世界威士忌大师赛金奖；设计年产 230 万升，游客中心日均接待上限 750 人；首批成品预计 2027 年发布。",
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
      community: "2026 世界威士忌大师赛（The World Whisky Masters 2026）New Make 类别金奖；Icons of Whisky China 2026「年度可持续酒厂」（Sustainable Distillery of the Year，2026-03-15 于大理颁奖，主办方 Whisky Magazine）",
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
    story: "本地大麦 + 100% 地板发芽，云南麻栎、滇合欢木桶——本土木种试验走得最远的一家。年产 2 万—5 万升（云南日报口径）；拥有 16 项专利的双壶数控蒸馏系统；2023 年获（国际烈酒）大奖赛大金奖，2024 年获 WWA 铜奖，并连续两年获艾威奖「年度手工蒸馏厂」。",
    source: "云南日报（2026-05-26，云南网转载 https://m.yunnan.cn/system/2026/05/26/034022953.shtml）+ 威士忌杂志中国编辑部 / 行业报道（2026 年中）",
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
      community: "WhiskyNotes（Ruben 2026-07）— https://www.whiskynotes.be/2026/world/kwun-cheung-chinese-single-malt-whisky/；WWA 2026「世界最佳调和麦芽威士忌」（World's Best Blended Malt）— Kwun Cheung / Blended Malt Whisky Aged in Changbai Mountains Mongolian Oak，ABV 48.00%，Company: Guangzhou Shunchangyuan Wine&Spirit Co.,Ltd（F 线亲验 https://www.worldwhiskiesawards.com/winner-whisky/worlds-best-blended-malt-63850-world-whiskies-awards-2026）。注意：该获奖款类别为 Blended Malt（调和麦芽），与本条目 style 所标「单一麦芽」不同，两者口径待厂方确认",
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
    story: "以《九酝酒法》为灵感，依托中华药都（亳州）草本资源做草本威士忌。2026-09-19 第十三届古井贡酒秋酿仪式现场发布「古奇植萃草本威士忌」，「古奇草本威士忌蒸馏坊体验中心」同步落成揭幕；同场「古奇蒙古栎桶草本威士忌」以 80 万元拍卖成交（另一坛取自明代国保窖池的 2026 秋酿头酒以 190 万元成交）。",
    source: "亳州晚报（2026-09-24，第 09 版·古井企业专版，现场报道）+ 新华网（2026-09-21）+ 每日经济新闻（2026-09-30）",
    confidence: "pending",
    process: { cask: "蒙古栎桶（草本威士忌）", yeast: "待核", malt: "待核" },
    flavor: {
      dominant: ["草本 / 药香（报道口径，待聚合）"],
      community: "待以真人盲品聚合，AI 不做判断",
    },
    products: [
      { name: "古奇植萃草本威士忌", cask: "待核", tier: "待核", confidence: "pending", note: "2026-09-19 秋酿现场发布；官方未公布售价与产量" },
      { name: "古奇蒙古栎桶草本威士忌", cask: "蒙古栎桶", tier: "限量/收藏", confidence: "pending", note: "2026-09-19 拍卖成交 80 万元；成交价见于亳州晚报现场报道（企业专版）与每日经济新闻转述，**非两个独立来源**，且新华网同事件稿未提成交价" },
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
    story: "福建龙岩首家高端威士忌酒厂（2017 立项 / 2018 动工 / 2023 竣工投产）：占地约 3.8 万㎡、设计年产威士忌 3000 吨，依托「国家森林乡村」培斜村的生态禀赋；首批三年陈酿已通过检测，计划 2026 年下半年投市；其「德熙波本桶威士忌」已斩获世界威士忌大师赛最高等级「大师奖章」，实现龙岩本土威士忌国际最高荣誉突破。",
    source: "闽西日报（2026-09-12）+ 中国网海峡频道 / 龙岩市融媒体中心（2026-04）",
    confidence: "pending",
    process: {
      cask: "双桶体系（核心产品「融萃双桶」）；另有波本桶产品线",
      maturation: "首批三年陈酿（2026 年满三年达上市标准）",
    },
    terroir: { climate: "闽西 · 武夷山脉南段", water: "培斜村「国家森林乡村」生态禀赋（待核）" },
    flavor: {
      dominant: ["待采集"],
      community: "「德熙波本桶威士忌」获世界威士忌大师赛（World Whisky Masters）最高等级大师奖章（Master）",
    },
    products: [
      { name: "德熙波本桶威士忌", cask: "波本桶", tier: "待核", confidence: "pending", note: "世界威士忌大师赛最高等级大师奖章（Master）" },
      { name: "德熙融萃双桶单一麦芽威士忌", cask: "双桶", tier: "待核", confidence: "pending", note: "2026-05-15 北京威士忌节全国首秀" },
    ],
  },

  /* ---------- 千岛湖批次（来源：杭州日报 / 杭州市政府门户 2026-09-21） ---------- */

  {
    id: "chunan",
    name: "淳岸",
    region: "qiandaohu",
    location: "浙江杭州淳安 · 千岛湖",
    owner: "英国奥歌诗丹迪集团（Angus Dundee Distillers Plc）全资",
    style: "单一麦芽 · 外资 · 工旅融合",
    story: "英国奥歌诗丹迪集团在海外最大规模的实业投资（总投资 7 亿元）：该集团在英国本土以外唯一的单一麦芽威士忌酒厂，也是千岛湖首个外资工旅融合项目。2023-12 奠基、2024-04 动工，2025 年底试生产、2026 年 5 月全面开放。",
    source: "千岛湖新闻网（2025-11-04）+ 杭州日报 / 杭州市政府门户（2026-09-21）",
    confidence: "pending",
    process: { cask: "待采集", still: "待采集" },
    terroir: {
      climate: "千岛湖水源型产区（产区森林覆盖率 77.8%）",
      water: "千岛湖优质水资源（官方称纯净水质赋予更纯净酒体）",
      aging: "酒库可洞藏 10 万桶橡木桶；酒厂年产能力 4500 吨",
    },
    flavor: {
      dominant: ["待采集"],
      community: "待以真人盲品聚合，AI 不做判断",
    },
    products: [
      { name: "待采集", cask: "待采集", tier: "待核", confidence: "unverified" },
    ],
  },

  /* ---------- 千岛湖本土批次（来源：凤凰网浙江/淳安发布 2025-04、千岛湖新闻网 2026-07） ---------- */

  {
    id: "chunzhigu",
    name: "淳之谷（白猿）",
    region: "qiandaohu",
    location: "浙江杭州淳安 · 文昌镇高铁生态产业园康美大道 999 号",
    owner: "杭州千岛湖威士忌酒业有限公司",
    style: "单一麦芽 · 中国威士忌 · 双品牌并行 · 浙江首家规模化酒厂",
    story: "浙江首家规模化威士忌酒厂，坚持「淳之谷」「白猿」双品牌并行：创始人徐昊 2015 年赴美国肯塔基州期间确立做中国本土威士忌的愿景，2021 年公司在淳安文昌高铁新区签约成立，2022-11 一期开工（列入浙江省「152」重点项目），2024-06 一期试运行、首批麦芽威士忌试水成功；上市一周年即在国际赛事斩获多金，明确「拒绝做海外平替」。",
    source: "公司官网 qdhwhisky.com（品牌故事 / 产品页 / 新闻）+ 千岛湖新闻网（2026-07-22）+ 凤凰网浙江 / 淳安发布（2025-04-22）",
    confidence: "pending",
    process: {
      cask: "波本桶 + 雪莉桶（双桶混桶）；生肖限定款雪莉桶 + 马尔萨拉桶；另有全新美国橡木桶 Virgin Oak 四级炙烤试验款",
      maturation: "已有 7 年（7yo）雪利桶强产品；单麦现年产约 900 吨 → 一期峰值 2100 吨 → 二期达产峰值 5000 吨（二期含橡木桶修整厂与智能仓储）",
    },
    terroir: { water: "千岛湖核心湖区弱碱活水" },
    flavor: {
      official: "清爽奶油果香 + 蜜饯、肉桂交织；乌龙茶香（生肖款）；蜜饯与乌龙茶交织的东方风味（58.5% 款）",
      dominant: ["奶油果香-蜜饯肉桂（官方口径，待聚合）", "乌龙茶香（官方口径，待聚合）"],
      community: "2025 IWSC 首届中国区（邛崃）烈性酒大赛：淳之谷 46% 单麦金奖 95 分（称中国威士忌排名前三）、白猿 46% 单麦银奖 82 分、淳之谷 57.8% 7yo 雪利桶强银奖 82 分、白猿 57.8% 7yo 雪利桶强银奖 81 分；另获 WWA 金/银奖、2026 IWSC 金奖、2026 SFWSC 金奖、2026 ISC 银奖",
    },
    products: [
      { name: "淳之谷金奖单一麦芽中国威士忌（46%vol）", cask: "波本桶 + 雪莉桶", tier: "待核", confidence: "pending", note: "官网明示：来自昆明酒液、在千岛湖二次熟成（非全程千岛湖蒸馏）" },
      { name: "淳之谷 58.5% 麦芽烈酒中国威士忌", cask: "雪莉桶", tier: "待核", confidence: "pending", note: "IWSC + WWA 双项国际奖项；蜜饯与乌龙茶风味" },
      { name: "淳之谷 67.8% 麦芽烈酒中国威士忌", cask: "全新美国橡木桶 Virgin Oak 四级炙烤", tier: "待核", confidence: "pending", note: "仅 1 年陈酿；产品名用「麦芽烈酒」而非「威士忌」" },
      { name: "丙午年「一马当先」马年生肖限定款", cask: "雪莉桶 + 马尔萨拉桶", tier: "限量/收藏", confidence: "pending", note: "全球限量 500 瓶；东方乌龙茶香" },
      { name: "白猿标准版 / 兔年限定版", cask: "待采集", tier: "待核", confidence: "pending", note: "2025 WWA 银奖 / 金奖" },
      { name: "淳之谷新酒样品 New Make", cask: "未入桶", tier: "样品", confidence: "pending", note: "2024-06-30 起试生产" },
    ],
  },
  {
    id: "qdhjinjiu",
    name: "九龙淳（千岛金久）",
    region: "qiandaohu",
    location: "浙江杭州淳安 · 文昌镇",
    owner: "杭州千岛金久酒业有限公司",
    style: "调和威士忌 · 金酒 · 酒旅配套",
    story: "落户千岛湖文昌镇的金酒及威士忌项目，规划建设用地约 34 亩，配套建设主题式酒店提供完整旅游体验；旗下调和威士忌「九龙淳」获 2025 年 WWA 国际威士忌竞赛金奖。",
    source: "凤凰网浙江 / 淳安发布（2025-04-22）",
    confidence: "pending",
    process: { cask: "待采集" },
    flavor: {
      dominant: ["待采集"],
      community: "2025 WWA 国际威士忌竞赛金奖（调和威士忌「九龙淳」）",
    },
    products: [
      { name: "九龙淳 调和威士忌", cask: "待采集", tier: "待核", confidence: "pending", note: "2025 WWA 金奖" },
    ],
  },

  /* ---------- 峨眉山·高桥批次（来源：新浪财经/新闻天天报 2026-04-02、中国酒业新闻网） ---------- */

  {
    id: "gaoqiao",
    name: "高桥威士忌酒庄（郎酒）",
    region: "emeishan",
    location: "四川乐山峨眉山市高桥镇福田村（峨眉山南麓）",
    owner: "郎酒集团（注册资本增至 10 亿元）",
    style: "麦芽威士忌 · 世界级酒庄 · 工业+文旅",
    story: "郎酒集团多元化战略的重要布局、其精心打造的第三座世界级酒庄：项目涵盖麦芽威士忌蒸馏厂、酒店群、会议中心等业态，以「工业+文旅」融合为核心。2026-04 一期接近尾声、两栋陈酿库已建成，预计 2026 年 5 月进入试生产并产出首批试酿酒；首期 2026 年建成后一次性年产能可达 1 万吨原酒，直接创造超 500 个就业岗位。",
    source: "新浪财经 / 新闻天天报（2026-04-02）+ 中国酒业新闻网（2026-01 / 2026-06）",
    confidence: "pending",
    process: {
      cask: "待采集",
      maturation: "万吨级陈酿库（两栋已建成）；首期年产能 1 万吨原酒",
    },
    terroir: { climate: "峨眉山南麓 · 北纬 30 度", water: "待采集" },
    flavor: {
      dominant: ["待采集"],
      community: "待以真人盲品聚合，AI 不做判断",
    },
    products: [
      { name: "待采集（2026-05 首批试酿酒）", cask: "待采集", tier: "待核", confidence: "pending" },
    ],
  },

  /* ---------- 千岛湖扩建批次（来源：淳安县融媒体中心 / 千岛湖新闻网 2025-12、2026-03） ---------- */

  {
    id: "yinxiang",
    name: "隐象威士忌庄园",
    region: "qiandaohu",
    location: "浙江杭州淳安 · 文昌镇",
    owner: "独立（「工业+旅游」融合项目）",
    style: "单一麦芽 · 工旅融合",
    story: "千岛湖在建「工业+旅游」融合项目：2025-12-02 报道时项目整体进度 98%、建筑基本完工，目标 12 月底启动正式生产；2026-03-09 正式复工，在前期已生产 300 多桶产品的基础上，2026 年产能预计达 40 万升，并推进游客中心、餐饮、停车场配套。",
    source: "淳安县融媒体中心 / 千岛湖新闻网（2025-12-02、2026-03-13）+ 华夏酒报（2026-09-29）",
    confidence: "verified",
    process: {
      malt: "瑞士 Buhler 粮食处理 + 英国 Briggs 糖化锅",
      still: "苏格兰 Forsyths 定制手工蒸馏系统",
      cask: "瑞典 AlfaLaval 全自动阀阵（配套）",
    },
    terroir: { climate: "千岛湖文昌镇", aging: "配套游客中心 / 餐饮 / 停车场（工旅融合）" },
    flavor: { dominant: ["待采集"], community: "待以真人盲品聚合，AI 不做判断" },
    products: [
      { name: "待采集", cask: "待采集", tier: "待核", confidence: "unverified" },
    ],
  },
  {
    id: "wanji",
    name: "万季威士忌庄园",
    region: "qiandaohu",
    location: "浙江杭州淳安 · 威坪镇东方桥区块",
    owner: "万季（杭州千岛湖）威士忌酒业有限公司",
    style: "单一麦芽 · 福赛斯全套设备 · 工旅融合",
    story: "计划总投资 5.5 亿元；2025 年 5 月正式开工，2025-12-23 报道时工业一期发酵、蒸馏及动力厂房已建成，福赛斯（Forsyths）全套酿酒设备进场安装，计划 2026 年 1 月完成验收、3 月启动试生产；报道称其为淳安唯一引进福赛斯全套酿酒设备的企业。规划威士忌体验、展销、文创中心及橡木桶陈酿厂库。",
    source: "淳安县融媒体中心 / 千岛湖新闻网（2025-12-23）+ 华夏酒报（2026-09-29）",
    confidence: "verified",
    process: { still: "福赛斯（Forsyths）全套酿酒设备" },
    terroir: { climate: "千岛湖威坪镇" },
    flavor: { dominant: ["待采集"], community: "待以真人盲品聚合，AI 不做判断" },
    products: [
      { name: "待采集", cask: "待采集", tier: "待核", confidence: "unverified" },
    ],
  },

  /* ---------- 闽西扩建批次（来源：龙岩市新罗区人民政府 2025-07-23） ---------- */

  {
    id: "jiuxi",
    name: "久溪",
    region: "minxi",
    location: "福建龙岩新罗区龙池工业园区",
    owner: "久溪（福建龙岩）酒业有限公司（由英国、美国、丹麦等国威士忌爱好者共同投资组建）",
    style: "单一麦芽（规划）· 福建省重点项目",
    story: "福建省重点项目，一期占地 25.8 亩、总投资 2 亿元；蒸馏车间 1500 ㎡，配置 2 座精馏器（5450 升、5740 升）与 1 座 1.5 万升初馏器，蒸馏室可容纳 10 座蒸馏设备、6 条生产线。2025-07-30 已投入生产运行，首批试投料产酒 2500 升（政府稿另载首批成功灌装 58 升橡木桶）。",
    source: "龙岩市新罗区人民政府（2025-07-23，http://www.fjxinluo.gov.cn/xlyw/szyw/202507/t20250723_2231554.htm，需用 www 前缀）+ 东南网·福建日报（2025-07-31）",
    confidence: "pending",
    process: {
      still: "2 座精馏器（5450 / 5740 升）+ 1 座 1.5 万升初馏器；蒸馏室可容纳 10 座蒸馏设备",
    },
    terroir: { climate: "闽西 · 新罗区龙池工业园区" },
    flavor: { dominant: ["待采集"], community: "待以真人盲品聚合，AI 不做判断" },
    products: [
      { name: "待采集", cask: "待采集", tier: "待核", confidence: "unverified", note: "项目方预期：年产高档威士忌 300 万瓶，全面达产后年产能超 1800 万瓶、年产值可突破 60 亿元（为项目方预期口径，非已实现数据）" },
    ],
  },

  /* ---------- 胶东批次（来源：每日经济新闻 2026-09-30 / 界面新闻 2026-08-13 / 韩媒 2026-09-29） ---------- */

  {
    id: "qingdao",
    name: "青岛威士忌（青岛牌）",
    region: "shandong",
    location: "山东青岛",
    owner: "青岛饮料集团（2025-04 整体划入青岛啤酒集团）；相关主体青岛华东葡萄酿酒有限公司",
    style: "单一麦芽 / 单一谷物 · 老品牌重启 · 免税出海",
    story: "品牌称 1912 年起在青岛生产，2022 年（110 周年）重整品牌体系。2026 年 7 月底青岛啤酒与爱尔兰大北方蒸馏厂（Great Northern Distillery）签署长期合作协议：对方供应 3 年至 21 年全系列陈年威士忌、依托青啤全国渠道分销，双方计划在中国自建威士忌蒸馏厂（该合作目前仅界面新闻单一来源，未见公告类一手文本）。2026-09-21 其 5 款产品（单一麦芽 4 款 + 10 年单一谷物 1 款）进入韩国免税流通渠道。",
    source: "每日经济新闻（2026-09-30）+ 界面新闻（2026-08-13）+ 韩媒 로이슈 / LawIssue（2026-09-29）",
    confidence: "pending",
    process: {
      malt: "单一麦芽 4 款：蒙古栎 / 波本桶 / Oloroso 雪莉桶 / 赤霞珠葡萄酒桶（40%vol 或 43%vol，700ml）；取酒心约 18%",
      cask: "单一谷物款：干邑桶 + 波本桶 10 年陈",
    },
    terroir: { climate: "山东青岛" },
    flavor: { dominant: ["待采集"], community: "待以真人盲品聚合，AI 不做判断" },
    products: [
      { name: "青岛威士忌单一麦芽 10 年雪莉桶", cask: "Oloroso 雪莉桶", tier: "中端", priceBand: "380 元 / 700ml", confidence: "pending", note: "价格为每日经济新闻 2026-09-30 线上调查所得平台价，非厂方官方口径" },
      { name: "单一谷物 10 年（干邑桶 + 波本桶）", cask: "干邑桶 + 波本桶", tier: "中端", confidence: "pending", note: "2026-09-21 与 4 款单一麦芽同时进入韩国免税渠道" },
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
    { label: "生产厂家", value: "64 个（含已投产与在建）", note: "同比增加 9 家。口径为「酒厂及项目」合计，非「已投产 64 家」：其中 51 家已投产、2 家试生产，其余在建。媒体措辞不一（新华网作「在建及投产威士忌酒厂及项目达 64 个」；每日经济新闻 / 新京报作「生产厂家 64 家」）。中酒协报告原文未取得，属媒体转述，故为待核口径" },
    { label: "实际蒸馏能力", value: "约 7 万千升/年", note: "设计产能 13 万千升；远期规划 30 万千升" },
    { label: "已投产产值", value: "约 158.5 亿元", note: "远期市场空间超过 200 亿元" },
    { label: "进口份额", value: "85%", note: "媒体转述中酒协报告口径（新京报 / 东方财富 2026-09-19；每日经济新闻 2026-09-30 另作「市场占有率达到 85%」），属市场份额口径。同源另称「英国 65% + 国产 15% + 其他进口 30%」，三项和为 110%，自相矛盾，故本库不采用该拆分（旧版曾据 85%−65% 推算「其他进口 20%」，该推算无来源，已删除）。报告原文未取得" },
    { label: "国产份额", value: "15%", note: "市场份额口径，媒体转述；与「国产威士忌产量已超越进口量」（中酒协秘书长何勇 2026-09-19 致辞，新华网 2026-09-23）分属不同口径：后者指蒸馏 / 产量，非上市销量，二者不矛盾" },
    { label: "消费者体验率", value: "85% 体验过国产威士忌", note: "购买转化率 60%（中酒协调研口径，每日经济新闻 2026-09-30 转述；报告原文未取得）。注意与「居家独酌场景占比 85%」含义不同，勿混用" },
    { label: "核心价格带", value: "300–500 元", note: "占市场份额 55%" },
    { label: "消费城市", value: "一二线合计近八成", note: "北京 / 上海 / 广州 / 苏州 / 深圳等" },
    { label: "品类结构", value: "麦芽 59% / 谷物 17% / 调和 24%" },
    { label: "2025 进口", value: "3584 万升（同比 +22.8%）", note: "进口均价 -13.73% → 15.46 美元，呈“量增价跌”" },
    { label: "2025 出口", value: "1324 万升（同比 +50.8%）", note: "出口均价 7.4 美元（同比 -6%）" },
    { label: "东方特色桶型", value: "黄酒桶 / 蒙古栎桶 / 烟熏·茶叶润桶" },
    { label: "中国威士忌四大产区", value: "浙江千岛湖 / 四川邛崃 / 四川峨眉山 / 云南大理", note: "中酒协《中国威士忌产业发展报告》口径" },
    { label: "千岛湖产区现状", value: "6 家酒厂（投产家数待核）", note: "设计总产能约 2.03 万吨/年；2022 年落地首个威士忌项目。原「4 家获证投产」与「浙江超八成威士忌项目集中于此」均未能找到一手依据，已删（淳安县政府 2025 年答复函口径为「已投产 2 个、在建 3 个」）" },
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
  source: "国家市场监督管理总局（国家标准化管理委员会）发布；国家标准全文公开系统著录页（发布 2025-01-24 / 实施 2026-02-01）；中国消费者报 / 新浪财经 解读。注：条款判断依据为国标委公开的「报批稿」全文，正式发布版正文未取得，条款号为报批稿对应条款，引用时请以正式文本复核",
  points: [
    { topic: "定义", requirement: "以谷物为原料，经糖化、发酵、蒸馏、陈酿，经或不经调配而成的蒸馏酒——调配被明确为非必要工艺。" },
    { topic: "分类（按原料）（解读性拆分）", requirement: "麦芽威士忌（大麦麦芽为唯一谷物原料，橡木桶陈酿）/ 谷物威士忌。（报批稿第 4 章为一维四类，本库拆为「按原料 / 按工艺」两轴以便检索）" },
    { topic: "分类（按工艺）（解读性拆分）", requirement: "调配威士忌 / 风味威士忌（本次新增类别）。" },
    { topic: "单一麦芽威士忌", requirement: "同一工厂至少完成糖化、发酵、蒸馏；不得使用外源性酶；应采用铜制壶式蒸馏器进行 2~3 次蒸馏（报批稿，正式文本未取得）；橡木桶陈酿不少于 3 年。" },
    { topic: "单一谷物威士忌", requirement: "在同一工厂至少完成糖化、发酵、蒸馏的谷物威士忌。" },
    { topic: "陈酿下限", requirement: "原酒陈酿时间不应少于 2 年。" },
    { topic: "新酒酒精度", requirement: "蒸馏所得威士忌新酒的最高酒精度应小于 95%vol。" },
    { topic: "禁用物质", requirement: "不得使用食用酒精、呈色物质（焦糖色除外）、呈香呈味物质（风味威士忌除外）。" },
    { topic: "风味威士忌标识", requirement: "风味威士忌应按第 4 章标示产品类型（系依据 9.1.1 的解读，属间接推论，正式文本未取得）；甜味物质超过 5g/L 须标示总糖含量。" },
    { topic: "橡木片陈酿", requirement: "使用橡木片仍须满足木桶陈酿至少 2 年，且标签须明示使用了橡木片。**单一麦芽威士忌不应使用橡木片、橡木屑等橡木制品**（仅谷物威士忌可使用，报批稿 5.3，正式文本未取得）。" },
    { topic: "谷物命名", requirement: "某一种谷物占比超过 51%（质量分数）可标示为「XX 谷物威士忌」（如高粱谷物威士忌）。" },
    { topic: "酒龄标示", requirement: "建议标示；酒龄 = 该产品所用原酒的最小酒龄（最短 5 年则标 5 年）。" },
  ],
};

/* ============ 团体标准：固态酿造谷物威士忌（中式路线） ============ */

export interface GroupStandard {
  name: string;
  code?: string;            // 标准编号（有官方著录才填）
  announcementNo?: string;  // 发布公告号
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
  code: "T/CNLIC 0246-2026",
  announcementNo: "中轻联标准〔2026〕89 号",
  issuedBy: "中国轻工业联合会组织，贵州国台数智酒业集团、中国食品发酵工业研究院等共同研制；中国工程院院士孙宝国领衔 9 位专家审查通过",
  issuedAt: "2026-06-16（发布即实施；落款日期另有 2026-06-18 一说，团标平台发布日为 2026-06-18，待核）",
  source: "中国轻工业联合会公告（中轻联标准〔2026〕89 号，全国团体标准信息平台 ttbz.org.cn）+ 食品伙伴网标准库 + 新华财经（2026-09-16，中国轻工业联合会质量标准部主任刘晶晶致辞）",
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

/* ============ 产区级团体标准：中国威士忌千岛湖产区 ============ */

export interface RegionalStandard {
  name: string;
  code?: string;           // 标准编号（有官方著录才填）
  effectiveFrom?: string;  // 实施日期
  issuer: string;
  drafter: string;
  processNote: string;
  publishedAt: string;
  source: string;
  significance: string;
  coreContent?: string[];
}

/**
 * 《中国威士忌千岛湖产区》团体标准（国内首个风土型威士忌产区团体标准）
 * 注：2026-08-11 公开征求意见（杭标学〔2026〕60 号），2026-09-19 正式发布。
 */
export const REGIONAL_STANDARD_QIANDAOHU: RegionalStandard = {
  name: "《中国威士忌千岛湖产区》团体标准",
  code: "T/HZAS 118—2026",
  effectiveFrom: "2026-10-19",
  issuer: "杭州市标准化学会",
  drafter: "淳安县千岛湖酒业协会等单位研究起草（共 9 家起草单位）",
  processNote:
    "2026 年 8 月获批立项（立项文号 杭标学〔2026〕58 号；国内首份以威士忌「产区」命名的标准文件）；2026-08-11 发布公开征求意见通知（杭标学〔2026〕60 号），反馈截止 2026-09-11。",
  publishedAt: "2026-09-19 发布（与产区 Logo、千岛湖威士忌产业学院同步发布，三张「首创牌」）；实施日期 2026-10-19",
  source:
    "全国团体标准信息平台著录（T/HZAS 118—2026，ttbz.org.cn）+ 杭州市标准化学会（杭标学〔2026〕60 号通知原文）+ 中国新闻网（2026-09-19）+ 杭州日报（2026-09-21）。标准全文未开放（平台 standardPdfUrl 为空）",
  significance:
    "国内首个风土型威士忌产区团体标准，填补国内产区级威士忌标准空白；中酒协秘书长何勇称其为「在国家标准基础上进行的探索」。以是否具备「千岛湖风味」为评价目标，实行「产区成熟度评价 + 企业符合性判定」双重认证。",
  coreContent: [
    "【风土硬门槛】将产区自然风土条件列为硬性准入门槛，明确专属参数：海拔 108–500 米、年均气温 17.5–18.5℃、年均湿度 70%–80%、年降雨量 1500–1700 毫米。",
    "【生态底线】对空气质量、生态系统质量设定底线约束，规避环境杂味干扰。",
    "【单一麦芽属地要求】单一麦芽威士忌的糖化、发酵、蒸馏等核心工序必须在淳安辖区同一工厂完成（淳安县投资促进局局长汪辉表述）。",
    "【全链条管控】从原料、生产、人员、仓储、成品到产业配套闭环管理：规范酿酒谷物/酵母/焦糖色等原辅材料；固化生产工艺流程并细化不同品类蒸馏、陈酿时长要求；设置生产与检验技术人员资质配比门槛；对仓储、物流、体验基地提出硬性配套指标。",
    "【产业集群准入】明确入驻中小企业、专属仓储设施、产业体验中心、专业物流集散中心等数量门槛。",
    "【标识与溯源】建立产区标识管控体系，通过「产区成熟度评价 + 企业符合性判定」双重认证规范品牌管理。",
    "【严于国标】相较国家标准，新增生态环境、产业集群、人才配置、产业链配套、产区成熟度、标识溯源监管等维度，是适用于淳安县域的地域进阶型标准。",
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
    name: "国务院关税税则委员会关于调整威士忌酒进口关税的公告（税委会公告 2026 年第 1 号）",
    issuedAt: "2026-01-30 发布 · 2026-02-02 起实施",
    detail:
      "自 2026-02-02 起对威士忌酒实施 5% 的进口暂定税率，该商品归在《中华人民共和国进出口税则（2026）》税则号列 22083000 项下（财政部关税司公告原文，2026-01-30）。媒体普遍表述为「关税由 10% 降至 5% / 关税减半」，但公告原文未载明原税率，故「减半」仅为媒体表述；中苏双方在 2026-05 联合声明会谈中对减税积极效应给予高度评价。",
  },
  {
    name: "中酒协「中威计划」（中国特色威士忌技术体系科研项目）",
    issuedAt: "2025-05 规划公布 · 2026-09-19 重申推进",
    detail:
      "中国酒业协会威士忌专业委员会推动的中国特色威士忌技术体系科研项目，整合产学研协资源，攻关原料、酿造、陈酿、品评等共性技术，目标形成中国特色威士忌全产业链技术规范；2026-09-19 千岛湖威士忌文化交流大会上宣布启动「中国特色威士忌技术体系科研项目」。其预算、参与单位数等具体数字未见官方原文，暂不收录。",
  },
  {
    name: "酒类产业定位调整",
    issuedAt: "近年",
    detail: "酒类从过去的「限制性行业」转为国家重点扶持的「历史经典产业」（中酒协口径）。",
  },
];

/* ============ 国际行业协作：中酒协 × 苏格兰威士忌协会 ============ */

export interface IndustryMilestone {
  name: string;
  date: string;
  detail: string;
  source: string;
}

export const INDUSTRY_MILESTONES: IndustryMilestone[] = [
  {
    name: "中国酒业协会与苏格兰威士忌协会发表联合声明",
    date: "2026-05-07",
    detail:
      "中国酒业协会代表团（理事长宋书玉）到访爱丁堡苏格兰威士忌协会总部，双方就产业政策、市场准入、标准对接及可持续发展会谈并发表联合声明，中国驻爱丁堡总领事张飙出席。五项要点：① 相互学习与支持；② 共享价值观与优先事项（无障碍进入主要出口市场、打击非法酒精、保护原产地地理标志）；③ 产业标准与可持续性；④ 创新与可持续性；⑤ 支持贸易环境建设。被视为全球蒸馏酒产业多边合作的重要里程碑。",
    source: "糖酒网（2026-05-08）",
  },
  {
    name: "中国威士忌千岛湖产区三项成果发布",
    date: "2026-09-19",
    detail:
      "淳安发布「中国威士忌千岛湖产区团体标准」（T/HZAS 118—2026，2026-10-19 实施）+ 产区 Logo + 千岛湖威士忌产业学院——填补国内产区级威士忌标准空白；产业学院为全国首个以威士忌文化为核心，推动酿酒师、品酒师纳入紧缺职业目录。",
    source: "全国团体标准信息平台著录 + 杭州日报 / 杭州市政府门户（2026-09-21）+ 中国新闻网（2026-09-19）",
  },
  {
    name: "国产威士忌出海与国际赛事突破",
    date: "2025–2026",
    detail:
      "千岛湖淳之谷上市一周年累计 3 个国际金奖（2025 IWSC、2026 IWSC、2026 SFWSC）；九龙淳获 2025 WWA 金奖；白猿获 2025 WWA 金/银奖；云拓获 2026 世界威士忌大师赛 New Make 金奖；叠川于 2026-06-11 在香港举行「由成都出发，走向世界」记者会，明确以香港作为走向国际市场的平台（保乐力加港澳营运总监林翠华）。",
    source: "千岛湖新闻网 / 凤凰网浙江 / 周末画报 / 香港商报（2026-06-11）",
  },
  {
    name: "觀橡（顺昌源）获 WWA 2026「世界最佳调和麦芽威士忌」",
    date: "2026（World Whiskies Awards 2026）",
    detail:
      "World Whiskies Awards 2026 授予 Kwun Cheung「Blended Malt Whisky Aged in Changbai Mountains Mongolian Oak」世界最佳调和麦芽威士忌（World's Best Blended Malt）：ABV 48.00%，类别 Blended Malt，公司 Guangzhou Shunchangyuan Wine&Spirit Co.,Ltd。为 2026 赛季国产威士忌最高量级奖项。注：该获奖款类别为调和麦芽，与库内觀橡条目标注的「单一麦芽」不同，口径待厂方确认。",
    source: "WWA 官网获奖页 https://www.worldwhiskiesawards.com/winner-whisky/worlds-best-blended-malt-63850-world-whiskies-awards-2026（Lead 与核验线均逐字复核）",
  },
  {
    name: "崃州获 WWA 2026「中国最佳单一麦芽威士忌」",
    date: "2026（World Whiskies Awards 2026）",
    detail:
      "WWA 2026 授予 Laizhou / Bourbon Cask Peated Malt「Best Chinese Single Malt」（ABV 50.00%，Company: Laizhou distillery）。同届官网可核牌数为 5 金（含 Blender 22）、4 银、≥6 铜，Blender 22 与 Sherry Harmony No 2 另获 Best。",
    source: "WWA 官网获奖页 https://www.worldwhiskiesawards.com/winner-whisky/best-63068-world-whiskies-awards-2026 等（核验线亲验官网列表）",
  },
  {
    name: "叠川获 ISC 世界威士忌组别金奖（2024）",
    date: "2024",
    detail:
      "国际烈酒挑战赛（ISC）官方历史成绩库：2024 年「World Whisky / Blended Malt Whisky」组别 GOLD 授予 The Chuan Pure Malt Whisky（Pernod Ricard）；同期另获 Design & Packaging、New Brand Launch GOLD。2025 年另获 PX Finish GOLD 与 non chill filtered SILVER。官方子类别为 Blended Malt Whisky（混合麦芽），与官方「Pure Malt 纯麦芽」口径自洽。",
    source: "ISC 官方历史结果库（核验线解析官方 JSON 逐字确认）",
  },
  {
    name: "古奇蒙古栎桶草本威士忌 80 万元拍卖成交",
    date: "2026-09-19",
    detail:
      "第十三届古井贡酒秋酿仪式现场，「古奇蒙古栎桶草本威士忌」以 80 万元落槌；同场取自明代国保窖池的 2026 秋酿头酒以 190 万元成交。同期发布「古奇植萃草本威士忌」，「古奇草本威士忌蒸馏坊体验中心」落成揭幕。该成交价见于亳州晚报现场报道（第 09 版·古井企业专版）与每日经济新闻转述，新华网同事件报道未提成交价，故不宜表述为「多方证实」。",
    source: "亳州晚报（2026-09-24，第 09 版·古井）+ 每日经济新闻（2026-09-30）+ 新华网（2026-09-21）",
  },
  {
    name: "百润股份定增募资不超 13.05 亿元加码威士忌桶陈扩能",
    date: "2026-06-17 公告 / 2026-06-18 披露",
    detail:
      "百润股份（002568）《2026 年度向特定对象发行股票预案》：拟募资不超过 130,500 万元；其中「麦芽威士忌桶陈扩能项目」总投资 136,009.69 万元、拟投入募资 114,000 万元，实施主体为巴克斯酒业（成都）有限公司，地点四川邛崃，建设周期 36 个月，核心为购置 20 万只橡木桶（橡木桶购置费 100,000 万元，占项目总投资 73.52%），税后内部收益率 9.06%、静态投资回收期 11.99 年。注：第一财经曾作「13.1 亿元」，以巨潮公告原文 13.05 亿元为准。",
    source: "巨潮资讯网公告 PDF（公告 ID 1225376287，http://static.cninfo.com.cn/finalpage/2026-06-18/1225376287.PDF）",
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
