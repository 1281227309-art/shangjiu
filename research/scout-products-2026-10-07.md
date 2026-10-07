# B 线情报：国产威士忌「新品 / 价格 / 奖项 / 渠道」— 2026-10-07 轮次

- 采集人：scout-products（B 线）
- 采集时间：2026-10-07（Asia/Shanghai）
- 任务：为 2026-10-07 新一轮收录评估做 新品 / 价格 / 赛事奖项 / 渠道 情报侦察
- 时间窗口：重点 2026-10-02 → 2026-10-07；回溯补漏至 2026-09-20；库内缺失的更早重大奖项一并报
- 去重基线（已读）：`src/data.ts` 全部 23 家 `DISTILLERIES`（行号引用见各条）+ `INDUSTRY_MILESTONES`(:833-890) + `docs/最新国产威士忌收录评估-2026-10-02.md` 三/五/九节 + `CONTRIBUTING.md` 第 2 节
- 纪律：只整理事实，AI 不作品鉴结论；无一手来源的价格一律 `pending`；渠道观察价与官方指导价分开标注

## 零、本轮方法与口径声明（先说清可信度边界）

1. **赛事官网取证是本轮最大突破。** `worldwhiskiesawards.com` 的获奖页 URL 形如
   `/winner-whisky/{badge}-{id}-world-whiskies-awards-2026`。该站**没有可用的国家/年份筛选接口**
   （`/search` 为 JS 渲染、`/winner-whisky/whisky/2026/china` 返回 `NO DATA`、`/sitemap.xml` 302 到错误页）。
   本轮改用**ID 区间枚举 + 通道实读**：对 id ∈ [62980, 63110] × badge ∈ {gold, silver, bronze, category-winner}
   共 524 个组合逐个 GET，取回 203 个有效页，再用 `Country: China` 过滤，得到 **39 条中国区获奖记录**。
   → 这些是**一手可点开逐字符核对的赛事官网页面**，故可标 `verified`。
   → **局限必须声明**：区间外的中国获奖页（如 `worlds-best-blended-malt-63850` 觀橡、设计类奖项、部分 best 页）
   未纳入；因此下文中国获奖清单是**「区间内完整、区间外不完整」**，不可当作 WWA 2026 中国获奖全量。
2. **ISC 官网结果数据取得官方 JSON**：`Agile_ISC2026_20260930_cached.json`（ISC 官网 winners 页引用的官方缓存，
   1909 行，字段 Name/Company/Category/Sub-Category/Medal）。→ ISC 各条可标 `verified`（一手赛事数据）。
3. **IWSC 官网不可达**：`iwsc.net` 全部请求返回 **403 Cloudflare 拦截**，故本轮 IWSC 相关一律**无法升级为 verified**。
4. **电商不可达**：京东搜索页返回「京东验证」、淘宝返回 JS 墙、抖音无入口 → 本轮**电商价/销量/榜单零证据**，
   与上一轮（2026-10-02 报告第九节第 1 条）结论一致，**未闭合**。
5. 企业供稿识别：本轮按 CONTRIBUTING 四铁律执行，凡页面自带「来源：<品牌名>」或落在企业专版/「企业资讯」栏目者，
   一律记「企业口径」，**不因发布在党媒/政府站而升级**。

---

## 一、赛事奖项线（WWA 2026 中国区 / ISC 2026 / Icons of Whisky）

### C1 吉斯波尔「Symbol」获 WWA 2026 中国区 Single Malt（12 年及以下）类别冠军 + 金奖
- 类型：奖项（+ 价格线索）
- 关键事实：WWA 2026 官网获奖页显示 **Gisbelle / Symbol**：ABV **55.50%**、Category **Single Malt**、
  Style **12 Years & Under**、Country **China**、Company **Yantai Gisbelle**，徽章为 **Gold**，
  同款另有 **Category Winner** 页（`category-winner-63052`）。同厂另有 **Gisbelle / Shan Yu** 47.00%（Single Malt, 12&Under）**Bronze**。
  企业口径称该款中文名「555」，命名含义为 **55.5 度酒精度 + 555 元定价 + 厂区门牌武五路 555 号**。
  吉斯波尔官网页脚地址确为「烟台市牟平区武五路555号」。
- 来源：
  - https://www.worldwhiskiesawards.com/winner-whisky/gold-62984-world-whiskies-awards-2026 （World Whiskies Awards 官网 · 访问 2026-10-07 · **一手**；已 web_fetch 逐字读）
  - https://www.worldwhiskiesawards.com/winner-whisky/category-winner-63052-world-whiskies-awards-2026 （赛事官网 · **一手**；由 gold-62984 页「Other winning products」链接确认存在）
  - https://www.worldwhiskiesawards.com/winner-whisky/bronze-63028-world-whiskies-awards-2026 （Gisbelle / Shan Yu · Bronze · **一手**）
  - https://dzrb.dzng.com/general/0/NEWS3115662RULHCOOCIEBSA （大众报业·齐鲁壹点 2026-01-31 · **企业口径**：文末明载「（来源：吉斯波尔威士忌）」）
  - https://www.163.com/dy/article/KKP7RL6405564JNC.html （酒虫网 2026-02-02 · 二手独立媒体，独立确认「吉斯波尔"555"…获中国区单一麦芽类别冠军」）
- 引文：
  - 官网：「ABV: 55.50% … Category: Single Malt … Country: China … Style: 12 Years & Under … Company: Yantai Gisbelle」
  - 齐鲁壹点：「三个5分别对应55.5度酒精度、555元定价，以及吉斯波尔厂区门牌地址555号」
  - 吉斯波尔官网页脚：「地址：烟台市牟平区武五路555号」
- 建议 confidence：**奖项 = verified（官网页面逐字核对）**；**中文名「555」↔ 英文款名「Symbol」的对应关系 = pending（映射推断）**；**555 元定价 = pending（企业口径，无官方价目页）**
- 建议挂载位置：`src/data.ts` → `DISTILLERIES.jisiboer.flavor.community`(:309) 与 `jisiboer.products[]`(:311-313)；
  `INDUSTRY_MILESTONES`(:833) 新增一条（量级次于觀橡「世界最佳调和麦芽」与崃州「中国最佳单一麦芽」）
- 重复判定：**库内已有主体、无本条奖项**。`jisiboer` :295-314 现仅 `products` 一条「雕堡桶系列」，
  `flavor.community` 为「待以真人盲品聚合」→ 判**更新**（非新增酒厂）
- **冲突警示（必读）**：企业稿与部分媒体写作「中国区**单一麦芽**类别冠军」，但 WWA 官网中国区
  **Single Malt 主类别**冠军为崃州 Bourbon Cask Peated Malt（`category-winner-63056`，库内 :866 已载其
  「Best Chinese Single Malt」）。吉斯波尔的类别冠军实为 **Single Malt · 12 Years & Under 子类别**。
  入库时必须写全类别层级，**不得写成「中国最佳单一麦芽」或与崃州同层级**，否则制造新的库内矛盾。
- 我没能核实的：555 元的官方价目/商详页；「Symbol」在厂方中文体系中的正式对应；WWA 官网未给出中文名。

### C2 太瓏釀（Grand Talon）获 WWA 2026「Best Chinese Grain」+ Gold + 类别冠军
- 类型：奖项（重大，库内零奖项）
- 关键事实：WWA 2026 官网 **Best Chinese Grain** = **Grand Talon / Rice Whisky**，ABV 43.00%、
  Category **Grain**、Style **12 Years & Under**、Country **China**、Company
  **GDMZH Pearl Red Spirits & Wines Co., Ltd**、官网 `grandtalon.com`；同款另有 **Gold**（gold-62982）
  与 **Category Winner**（category-winner-63050）。同厂 2024 年另有 2 金 + Best New Launch Design。
- 来源：
  - https://www.worldwhiskiesawards.com/winner-whisky/best-63064-world-whiskies-awards-2026 （赛事官网 · **一手** · 已 web_fetch）
  - https://www.worldwhiskiesawards.com/winner-whisky/gold-62982-world-whiskies-awards-2026 （赛事官网 · **一手** · 已 web_fetch）
- 引文：「Best Chinese Grain … Grand Talon / Rice Whisky … ABV: 43.00% … Company: GDMZH Pearl Red Spirits & Wines Co., Ltd」
- 建议 confidence：**verified**
- 建议挂载位置：`DISTILLERIES.tailongniang`(:276-294) → `flavor.community`(:289) 与 `products[]`(:292)；
  `INDUSTRY_MILESTONES` 新增「国产威士忌第二个国家级品类冠军（谷物/米威士忌）」
- 重复判定：库内 `tailongniang` :276-294 仅 1 款产品、`community` 为「待以真人盲品聚合」→ **更新**。
  与库内既有两条「Best」并列构成国产「Best」三连：觀橡（Blended Malt）、崃州（Chinese Single Malt）、**太瓏釀（Chinese Grain）**
- 我没能核实的：GDMZH 与库内「珍珠红」主体的股权/工商对应关系（厂方未公开披露）；「Grand Talon」是否为厂方正式英文名。

### C3 青岛牌（Qindao）获 WWA 2026 中国区谷物威士忌金奖
- 类型：奖项
- 关键事实：官网获奖页：**Qindao / Qindao Grain Whisky**，ABV 40.00%、Category **Grain**、Style **No Age Statement**、
  Country China、Company **Tsingtao Distillery Co.,Ltd**，徽章 **Gold**（id 62996）。
- 来源：https://www.worldwhiskiesawards.com/winner-whisky/gold-62996-world-whiskies-awards-2026 （**一手**；本页经通道实读解析，未再单独 web_fetch，内容与同批 200 页面同构）
- 引文：「Gold … Qindao / Qindao Grain Whisky … ABV 40.00% … Company: Tsingtao Distillery Co.,Ltd」
- 建议 confidence：**verified**
- 建议挂载位置：`DISTILLERIES.qingdao`(:607-627) → `flavor.community`(:622) + `products[]`(:623-626)
- 重复判定：库内 `qingdao` :607-627 无任何奖项记录（`community` :622 为「待聚合」）→ **更新**
- 我没能核实的：该「Qindao Grain Whisky」对应库内哪一款（库内谷物款为「单一谷物 10 年（干邑桶+波本桶）」，
  官网款名无年份、无桶型）→ **款名映射 pending**。

### C4 高朗（Goalong）WWA 2026 1 金 2 银（库内零奖项）
- 类型：奖项
- 关键事实：官网中国区记录：**Gold** — Goalong / Single Malt Single Cask **Sauvignon Blanc Wine Cask**，61.00%，
  Category Single Cask Single Malt，NAS（gold-62983）；**Silver** — Goalong / Single Malt **Oloroso Sherry Cask** 60.00%（silver-62997）、
  Goalong / Single Malt **Peated Cask** 61.00%（silver-62998）；Company 均为 **LIUYANG GOALONG LIQUOR DISTILLERY CO., LTD.**
- 来源：
  - https://www.worldwhiskiesawards.com/winner-whisky/gold-62983-world-whiskies-awards-2026
  - https://www.worldwhiskiesawards.com/winner-whisky/silver-62997-world-whiskies-awards-2026
  - https://www.worldwhiskiesawards.com/winner-whisky/silver-62998-world-whiskies-awards-2026 （均 **一手**，同批实读）
- 引文：「Gold … Goalong / Single Malt Single Cask Sauvignon Blanc Wine Cask … ABV 61.00%」
- 建议 confidence：**verified**
- 建议挂载位置：`DISTILLERIES.gaolang`(:377-409) → `flavor.community`(:401)、`products[]`(:403-408)
- 重复判定：`gaolang` :377-409 的 `community` 仅记 2023 年什么值得买横评，**无任何国际奖项** → **更新**。
  另注：库内 `products` 未含「长相思桶单桶」「Oloroso 桶」「泥煤桶」三款获奖 SKU → **新增产品**
- 我没能核实的：三款获奖 SKU 的中文名与官方定价。

### C5 凌酝（Lingyun，大理）WWA 2026 1 银 2 铜
- 类型：奖项
- 关键事实：官网中国区记录：**Silver** — Lingyun / Single Malt **Sherry Cask** Whisky 43.00%（silver-63022）；
  **Bronze** — Lingyun / Single Malt **Sherry Cask Cask Strength** 57.60%（bronze-63046）、
  Lingyun / Single Malt **Cognac Cask Cask Strength** 58.00%（bronze-63047）；
  Company **Lingyun Liquor Industry (Dali) Co., Ltd.**
- 来源：https://www.worldwhiskiesawards.com/winner-whisky/silver-63022-world-whiskies-awards-2026 ·
  .../bronze-63046-... · .../bronze-63047-... （**一手**，同批实读）
- 引文：「Silver … Lingyun / Single Malt Sherry Cask Whisky … ABV 43.00% … Company: Lingyun Liquor Industry (Dali) Co., Ltd.」
- 建议 confidence：**verified**
- 建议挂载位置：`DISTILLERIES.lingyun`(:217-236) → `flavor.community`(:231)、`products[]`(:233-235)
- 重复判定：库内 :224 只记「2024 年获 WWA 铜奖」→ 本轮为 **2026 赛季新增 1 银 2 铜 + 3 款具体 SKU**，判**更新**
- **附带结构线索**：官网公司名含 **(Dali)**，与库内 `lingyun.region = "dianxi"`(:219) 并存；
  上一轮（2026-10-02）对「凌酝是否归大理」列为未决结构问题 → 本条为**新证据**（赛事官网署 Dali），建议交由 Lead 复裁
- 我没能核实的：三款 SKU 中文名、官方定价、以及「Dali」是注册地还是产区归属。

### C6 古奇（Guqi / Anhui Gugi）WWA 2026 1 金 2 银（均为新酒/年轻酒）
- 类型：奖项
- 关键事实：官网中国区记录：**Gold** — Guqi Distillery / **YL**，60.50%，Category **New Make & Young Spirit**，
  Style Speciality（gold-62993）；**Silver** — Guqi Distillery / **YH** 60.50%（Style Young Spirit，silver-63013）、
  Guqi Distillery / **YR** 52.50%（Style Speciality，silver-63018）；Company **Anhui Gugi Liquor Industry co., Ltd**
- 来源：https://www.worldwhiskiesawards.com/winner-whisky/gold-62993-world-whiskies-awards-2026 ·
  .../silver-63013-... · .../silver-63018-... （**一手**，同批实读）
- 引文：「Gold … Guqi Distillery / YL … ABV 60.50% … Category: New Make & Young Spirit … Company: Anhui Gugi Liquor Industry co., Ltd」
- 建议 confidence：**verified**
- 建议挂载位置：`DISTILLERIES.guqi`(:315-334) → `flavor.community`(:328)、`products[]`(:331-332)
- 重复判定：`guqi` :315-334 无任何奖项（仅 80 万元拍卖事实）→ **更新**
- 我没能核实的：YL/YH/YR 三个代号对应的中文品名；是否即「古奇植萃草本威士忌」系列（库内 :331）。

### C7 叠川（The Chuan）WWA 2026 1 银 1 铜（含新 SKU「Distillery Exclusive PX Finish」）
- 类型：奖项 + 新品
- 关键事实：官网中国区记录：**Silver** — The Chuan / **Distillery Exclusive PX Finish**，46.80%，
  Category Blended Malt，NAS（silver-63021）；**Bronze** — The Chuan / **Pure Malt**，40.00%（bronze-63045）；
  Company **Pernod Ricard**。
- 来源：https://www.worldwhiskiesawards.com/winner-whisky/silver-63021-world-whiskies-awards-2026 ·
  .../bronze-63045-... （**一手**，同批实读）
- 引文：「Silver … The Chuan / Distillery Exclusive PX Finish … ABV 46.80% … Category: Blended Malt … Company: Pernod Ricard」
- 建议 confidence：**verified**
- 建议挂载位置：`DISTILLERIES.diechuan`(:136-162) → `flavor.community`(:155)、`products[]`(:157-161)
- 重复判定：库内 :155 只记 ISC 2024/2025 → 本轮为 **WWA 2026 新增 1 银 1 铜**，判**更新**；
  「Distillery Exclusive PX Finish」为库内**新产品**（库内 PX 款标 :160「官方称 2027-04 上市」）
- 我没能核实的：Distillery Exclusive 款是否为免税/酒厂限定专属渠道（与 ISC 的 Travel Retail Exclusive 款并列）。

### C8 大芹（Daiking Louis）WWA 2026 2 铜 + ISC 2026 5 银 1 铜
- 类型：奖项
- 关键事实：
  - WWA 2026：**Bronze** — Daiking / The Reserva **Triple Cask（Sherry, Port & Bourbon）** Single Malt，51.00%（bronze-63037）；
    Daiking / **Amontillado Cask Strength** 53.40%（bronze-63038，Small Batch Single Malt）；Company **Daiking Louis Distillery**
  - ISC 2026（官方 JSON）：**SILVER** — Daiking The Reserva Bourbon Cask；Daiking PX Sherry Cask Strength「Sunrise Red」；
    Daiking Green Brand；Daiking Gold Brand；Daiking Amontillado Cask Strength「Sky Blue」；**BRONZE** — Daiking The Reserva Double Cask（6–10 年）
- 来源：
  - https://www.worldwhiskiesawards.com/winner-whisky/bronze-63037-world-whiskies-awards-2026 · .../bronze-63038-... （**一手**）
  - https://evessio.s3.eu-west-1.amazonaws.com/customer/38fdd951-ed5d-49f2-82f3-ed13e29bcfce/results/Agile_ISC2026_20260930_cached.json （ISC 官网结果官方 JSON · **一手** · 已下载解析）
- 引文（ISC JSON 行）：「Daiking Amontillado Cask Strength Single Malt Chinese Whisky "Sky Blue" || DAIKING Whisky Distillery || Worldwide Whisky / Single Malt Cask Strength || SILVER」
- 建议 confidence：**verified**
- 建议挂载位置：`DISTILLERIES.daqin`(:86-110) → `story`(:93 现称「累计斩获 138 项国际烈酒竞赛奖项」)、`products[]`(:102-108)
- 重复判定：库内 :93 只有笼统「138 项」总数、`products` 无上述获奖 SKU → **更新（补具名奖项 + 补 SKU）**
- 我没能核实的：库内「138 项」的口径与时点（企业方累计口径，未见奖项清单）；Sky Blue/Sunrise Red 的中文名。

### C9 淳之谷 / 白猿（The Entellus）WWA 2026 4 银 1 铜（具名补全）
- 类型：奖项 + 更新
- 关键事实：官网中国区记录（Company **HANGZHOU QIANDAO LAKE WHISKY INDUSTRY CO., LTD.**）：
  **Silver** — Mellow Valley **7 Years Old Sherry Cask Strength** 58.50%（Small Batch Single Malt，silver-63000）；
  The Entellus **7 Years Old Sherry Cask Strength** 57.80%（Single Malt，silver-63001）；
  The Entellus Single Malt Chinese Whisky 46.00%（silver-63002）；
  **Bronze** — The Entellus **7 Years Old Marsala Cask Strength** 59.70%（Single Malt，bronze-63029）
- 来源：https://www.worldwhiskiesawards.com/winner-whisky/silver-63000-world-whiskies-awards-2026 ·
  .../silver-63001-... · .../silver-63002-... · .../bronze-63029-... （**一手**，同批实读）
- 引文：「Bronze … The Entellus / 7 Years Old Marsala Cask Strength Single Malt Chinese Whisky … ABV 59.70%」
- 建议 confidence：**verified**
- 建议挂载位置：`DISTILLERIES.chunzhigu`(:466-495) → `flavor.community`(:485)、`products[]`(:488-493)
- 重复判定：库内 :485 已概述「另获 WWA 金/银奖」，但**无具名 SKU、无英文名 The Entellus** →
  判**更新**（具名补全），不得当作全新
- **重要映射线索**：官网把「白猿」系产品记为 **The Entellus**（entellus = 长尾叶猴/白猿类），
  与库内 :492「白猿标准版 / 兔年限定版」可对表；建议由 E 线或厂方确认后落库
- 我没能核实的：Mellow Valley 与 The Entellus 的品牌-产品归属关系；7 年 Marsala 桶强是否已在售。

### C10 觀橡（顺昌源）ISC 2026 银奖（另一品类口径）
- 类型：奖项 + 口径冲突
- 关键事实：ISC 2026 官方 JSON：**SILVER** — `KWUN CHEUNG SINGLE GRAIN WHISKY AGED IN CHANGBAI MOUNTAINS MONGOLIAN OAK`，
  Company **Guangzhou Shunchangyuan Wine&Spirit Co.,Ltd**，Category **Worldwide Whisky / Single Grain**。
  另 WWA 2026 官网有 Gold（gold-62991，Kwun Cheung Blended Malt Whisky Aged in Changbai Mountains Mongolian Oak，48.00%，Blended Malt）。
- 来源：
  - ISC 官方 JSON（同上 URL）· **一手**
  - https://www.worldwhiskiesawards.com/winner-whisky/gold-62991-world-whiskies-awards-2026 （**一手**，同批实读）
- 引文：「KWUN CHEUNG SINGLE GRAIN WHISKY AGED IN CHANGBAI MOUNTAINS MONGOLIAN OAK || Guangzhou Shunchangyuan Wine&Spirit Co.,Ltd || Worldwide Whisky / Single Grain || SILVER」
- 建议 confidence：**verified（奖项事实）**
- 建议挂载位置：`DISTILLERIES.guanxiang`(:256-275) → `flavor.community`(:269)
- 重复判定：库内 :269 仅记 WWA「世界最佳调和麦芽」→ ISC 银奖为**新增**；WWA Gold 为同赛事既有事实的补全 → **更新**
- **口径冲突（须裁决）**：同一支长白山蒙古栎桶酒，WWA 记为 **Blended Malt**、ISC 记为 **Single Grain**、
  库内 :262 酒厂 `style` 记 **单一麦芽** → **三种口径并存**。建议库内采用「按赛事分记」写法，
  并把「单一麦芽」定位降为 pending 待厂方确认（不得覆盖已核实的赛事口径）
- 我没能核实的：厂方对该款产品类型的正式定义（单一麦芽 / 调和麦芽 / 单一谷物）。

### C11 崃州 ISC 2026：1 金 7 银（威士忌）+ 金酒/伏特加各 1 银
- 类型：奖项（大批量具名）
- 关键事实：ISC 2026 官方 JSON，Company **Laizhou Distillery**：
  **GOLD** — Blender 66（Blended）；**SILVER** — Blender 22（Blended）、Laizhou Amontillado Sherry Cask（Cask Strength）、
  Laizhou Bourbon Cask (Peated Malt)（Single Malt NAS）、Laizhou Finest Select、Laizhou Fino Sherry Cask、
  Laizhou Sherry Harmony、Laizhou STR Red Wine Cask；另有 **Jiao-Yu Dry Gin** SILVER、**Ling-Lie Vodka** SILVER。
- 来源：ISC 官方 JSON（同上 URL）· **一手**
- 引文：「GOLD] Blender 66 || Laizhou Distillery || Worldwide Whisky / Blended」；「SILVER] Laizhou STR Red Wine Cask || Laizhou Distillery || Worldwide Whisky / Single Malt No Age Statement」
- 建议 confidence：**verified**
- 建议挂载位置：`DISTILLERIES.laizhou`(:111-135) → `flavor.community`(:124)、`products[]`(:127-133)
- 重复判定：库内 :124 只列 WWA 2026 牌数 → ISC 2026 为**新增**；且 **ISC 把 Blender 66 判金**，与库内 `products`
  无 Blender 款（:118 story 提及调和品牌「百利得」22/66）形成互补 → 判**更新**
- 我没能核实的：ISC 未给 ABV/年份，故不能与库内规格互校。

### C12 Icons of Whisky China 2026：叠川「年度创新品牌」+「年度蒸馏厂」；郭斌臣入名人堂
- 类型：奖项
- 关键事实：新华网 2026-03-16 稿：保乐力加旗下叠川（The Chuan）获艾威奖（Icons of Whisky）**中国奖区「年度创新品牌」与「年度蒸馏厂」**；
  保乐力加中国 CEO **郭斌臣（Jerome Cottin-Bizonne）荣登 Whisky Magazine 名人堂**。同稿载叠川「**2025 年**纯麦芽威士忌免税限定版上市，
  成为**首款进入全球免税渠道的中国威士忌**」，以及「**2026 年 1 月**推出烟熏中国单岭橡木桶过桶熟成新品」。
- 来源：http://www.news.cn/fashion/20260316/713d1f63f6844f3f829681a3e7a0a8f3/c.html （新华网 2026-03-16 · **官媒发布、内容为企业通稿结构** → 记「企业口径/官媒转载」）
- 引文：「叠川（The Chuan）凭借其卓越表现，斩获艾威奖（Icons of Whisky）中国奖区"年度创新品牌"与"年度蒸馏厂"两大奖项」
- 建议 confidence：**pending**（发布主体为官媒，但通篇为企业口径、无独立第三方核实；Icons 官网中国区列表为 JS postback，本轮无法直读）
- 建议挂载位置：`DISTILLERIES.diechuan.flavor.community`(:155) + `INDUSTRY_MILESTONES`(:833)
- 重复判定：库内 :170/:187 有云拓同赛事记录，叠川无 → **更新**
- **时点冲突**：新华网称「2026 年 1 月推出烟熏中国单岭桶新品」，库内 :159 记「官方称 **2027-04** 上市（香港文汇报）」；
  同时 NBD（C21）亦称「1 月，叠川推出纯麦芽威士忌烟熏新品（中国单岭桶过桶熟成），**限量发售**」。
  → 建议裁定为**两个批次**（2026-01 限量/免税版 vs 2027-04 正式上市版），库内须分记，**不得覆盖 2027-04**
- 我没能核实的：Icons of Whisky 中国区完整名单（30 个奖项仅见 2 家中国酒厂条目）；颁奖地点（whiskymag 称 3/15 大理，
  新华网称 3/16 上海）。

### C13 云拓 Icons of Whisky China 2026 三项大奖（库内仅 1 项）
- 类型：奖项（更新）
- 关键事实：新京报「企业资讯」2026-03-20 稿：云拓在 2026 艾威奖中国区评选获**三项**——酒厂获
  **「年度可持续发展蒸馏厂」与「年度生产团队」**，酒厂经理**焦长毅**获评**「年度蒸馏厂经理」**。
  同稿载：云拓取洱海源头「三爷泉」水源、慢速糖化 + **120 小时超长酵酿**、云南橡木新桶/云南葡萄酒桶试验、
  首席顾问 **Jim Beveridge OBE**、调配大师 Craig Wallace、蒸馏大师 Andrew Millsopp、2025 年 **LEED 金级认证**。
- 来源：https://www.bjnews.com.cn/detail/1773988018129784.html （新京报 2026-03-20 · 栏目「企业资讯」→ **企业口径**）
- 引文：「其中，酒厂荣获"年度可持续发展蒸馏厂"与"年度生产团队"两项重磅荣誉，酒厂经理焦长毅则获评"年度蒸馏厂经理"」
- 建议 confidence：**pending**
- 建议挂载位置：`DISTILLERIES.yuntuo`(:163-192) → `flavor.community`(:187)、`story`(:170)、`process`(:173-177)
- 重复判定：库内 :187 仅记「年度可持续酒厂」1 项 → **更新（+2 项）**；工艺/团队字段为**新增**
- 我没能核实的：三项奖项的官方名单页（Icons 官网中国区需 postback）；「焦长毅」姓名与库内未载。

### C14 Icons of Whisky 2026 **全球**冠军中的中国实体（青岛/崃州/大芹）
- 类型：奖项（全球级，库内全缺）
- 关键事实：Whisky Magazine 2026-03-25 全球结果稿「Icons of Whisky 2026 — Global Winners」中：
  **SALES TEAM** = 「The Team, **Laizhou Distillery**」；**SUSTAINABILITY OFFICER** = 「**Tian Lei**, Fujian Daiking Louis Distillery」；
  **COMMUNICATIONS TEAM** = 「**Whisky Century (Qingdao)**」。（同稿另载 2026 WWA 世界最佳同期在伦敦揭晓、名人堂 2 人入选）
- 来源：https://www.whiskymag.com/articles/global-results-revealed-in-icons-of-whisky-2026 （Whisky Magazine 官网 2026-03-25 · **一手（赛事主办方自有媒体）** · 已 web_fetch）
- 引文：「SALES TEAM — The Team, Laizhou Distillery」「SUSTAINABILITY OFFICER — Tian Lei, Fujian Daiking Louis Distillery」
- 建议 confidence：**verified**（主办方官网逐字）
- 建议挂载位置：`INDUSTRY_MILESTONES`(:833) 新增「国产威士忌首次进入 Icons of Whisky 全球冠军名单」；
  `laizhou`(:124)、`daqin`(:93) 各补一条
- 重复判定：库内无任何 Icons of Whisky 全球级记录（:187 仅云拓中国区）→ **新增**
- 我没能核实的：「Whisky Century (Qingdao)」的主体性质（是否为青岛牌威士忌的传播代理/关联公司）；
  Tian Lei 的中文姓名与职务；大芹官网英文名 Daiking Louis 与库内「大芹」的工商对应。

### C15 ISC 2026 金奖：福建庄臣 Johnason's 双雪莉桶单一麦芽（库内无此主体）
- 类型：奖项 + **新主体**
- 关键事实：ISC 2026 官方 JSON：**GOLD** — `Johnason's Single Malt Whisky (Double Sherry Casks)`，
  Company **Jackson's Winery (Fujian) Co., Ltd.**，Category Worldwide Whisky / **Single Malt No Age Statement**。
  福州新闻网 2026-06-14 报道：位于福州的**福建庄臣酒业**（庄臣酿酒（福建）有限公司）旗下 Johnason's 双雪莉桶单一麦芽威士忌
  获 2026 ISC 金奖，酿造者/董事长为国家级烈酒评委**林灼华**，企业为「中华老字号/国家级高新技术企业/专精特新」。
- 来源：
  - ISC 官方 JSON · **一手**
  - https://m.fznews.com.cn/node/24361/20260614/3V328AD34C.shtml （福州新闻网 2026-06-14 · **官媒现场稿** · 已 web_fetch）
- 引文：「Johnason's Single Malt Whisky (Double Sherry Casks) || Jackson's Winery (Fujian) Co., Ltd. || Worldwide Whisky / Single Malt No Age Statement || GOLD」
- 建议 confidence：**奖项 verified**；**主体（厂名映射：福建庄臣 = Jackson's Winery?）pending**
- 建议挂载位置：`REGIONS` 新增候选（福州/闽东，或在 `minxi` 下加注）；`DISTILLERIES` 新增 `zhuangchen` 条目 —— **建议移交 A 线**；
  `INDUSTRY_MILESTONES` 可先记奖项
- 重复判定：库内 23 家**无此主体**（`minxi` :82 仅德熙、久溪）→ **新增主体 + 新增奖项**
- 我没能核实的：ISC 署名的「Jackson's Winery (Fujian)」与中文「福建庄臣酒业/庄臣酿酒（福建）有限公司」是否为同一法人
  （**英文名与中文名不一致，是本条最需核验处**）；产品定价；是否已量产上市。

### C16 WWA 2026 另 5 家库内未收录的中国主体（建议移交 A 线）
- 类型：新主体 / 奖项
- 关键事实（均在 id 区间 62980–63110 内，Country: China）：
  1. **Shanhe Liuxin (Pu'er) Co., Ltd.**（云南普洱）—— Gold：Xinliu Heshan / **Single Cask Single Grain Whisky** 54.50%（gold-62995，**Category Winner** 页 category-winner-63051）+ Bronze：Xinliu Heshan / New Make 64.00%（bronze-63044）
  2. **Faerieferry Distillery** —— Gold：New Make 63.50%（gold-62985）
  3. **Distillery Miracle** —— Gold：**Bordeaux Cask Finished** 65.00%（Small Batch Single Malt，gold-62992）
  4. **Penglai Wolin Xiangmu Co., Ltd.**（山东蓬莱）—— Gold：Wolin / **Oak Mate** 42.00%（Blended Limited Release，gold-62994）
  5. **Dalian Good Luck Enterprise Management Co., Ltd.**（独立装瓶商）—— Silver：**Shidu Whisky**，Bourbon/STR/white wine casks，43.00%（silver-63009）
- 来源：上列 5 组官网获奖页（`https://www.worldwhiskiesawards.com/winner-whisky/{badge}-{id}-world-whiskies-awards-2026`）· **一手**（同批实读）
- 引文：「Gold … Xinliu Heshan / Single Cask Single Grain Whisky … ABV 54.50% … Company: Shanhe Liuxin (Pu'er) Co., Ltd.」
- 建议 confidence：**verified（获奖事实）**；主体信息（产能、地址、投产时点）**unverified**
- 建议挂载位置：`REGIONS`（普洱→滇西/云南；蓬莱→`shandong`）+ `DISTILLERIES` 新增 5 条（字段可先小）—— **移交 A 线**
- 重复判定：库内 23 家均无 → **新增**
- 我没能核实的：5 家的中文注册名、投产状态、是否有产品在售（仅有赛事名录，无厂方页）。

---

## 二、新品与价格线

### C17 崃州「雪莉醇境」单一麦芽威士忌（四种初填雪莉桶，300 元价格带）
- 类型：新品 + 价格（价格带，非定价）
- 关键事实：WBO《葡萄酒商业观察》2026-09-09：崃州「正式对外发布旗下单一麦芽威士忌品牌「崃州」的全新单品：崃州「雪莉醇境」单一麦芽威士忌」，
  以 **Moscatel、PX、Fino、Oloroso 四种初填雪莉风味桶**融合，「以 **300 元价格带**切入雪莉桶威士忌市场」；
  并称「目前福建市场的部分终端已经能见到该产品」、崃州存酒「超 60 万桶」、与《一饭封神 2》主厨张嘉裕合作餐酒场景。
- 来源：http://wbo529.com/info/5041 （WBO 葡萄酒商业观察 2026-09-09 · **行业媒体（含企业口径与经销商口径）** → pending；已 web_fetch）
- 引文：「该产品采用崃州标志性的多桶融合工艺，以Moscatel、PX、Fino、Oloroso四种初填雪莉风味桶融合而成，以300元价格带切入雪莉桶威士忌市场」
- 建议 confidence：**pending**（产品存在 = 可信；**官方指导价未取得**，300 元是「价格带」表述）
- 建议挂载位置：`DISTILLERIES.laizhou.products[]`(:127-133) 新增一款
- 重复判定：**库内无「雪莉醇境」**（:127-133 六款均不同名）。上一轮（2026-10-02 报告第 11 节第 3 条）
  明确「没有写入」雪莉醇境，理由是「唯一依据页自标 AI 生成」→ 本轮**新增了可用的行媒来源**，判**可收录（pending）**
- **证据陷阱留档**：本轮实访了上一轮所指的那篇依据页
  `https://post.smzdm.com/p/a950e8o0/` —— 页面明标 **「AIGC文章详情」** 与 **「内容由AI生成」**，
  给出「359 元、40 度、8 月 31 日上架」→ **按纪律整页作废，不得作为价格来源**。
  因此 **300 元（行媒价格带）与 359 元（AI 页）并存，官方价未取得** → 建议价格字段维持 pending，并在 note 写明两值来源性质
- 我没能核实的：崃州官方指导价与规格（官方渠道仍不披露价格，与上一轮结论一致）；上市确切日期；销量。

### C18 吉斯波尔「昆全十二年」单一麦芽（2026-04-22 发布，12 年，限量 1226 瓶）
- 类型：新品 + 拍卖
- 关键事实：中国双创（naddc）2026-04-25 稿：2026-04-22 于烟台龙湖葡醍礼堂举行「吉斯波尔酒业十五周年庆典暨"昆全十二年"威士忌新品发布会」，
  称为「**中国大陆首款十二年陈酿单一麦芽威士忌**」，「**全球限量 1226 瓶**」；酒液盛于「**长白山百年蒙古栎雕琢而成的雕堡橡木桶**」，
  「以烟台特色苹果酒 **18 个月润桶**，再经 **12 年桶陈**」；发布会现场同步举办「昆全十二年」**专属拍卖专场**；
  同稿载「65432」体系（六大东方香型/五种桶型/四年最低陈酿/三重壶式蒸馏/双酵母）。创始人**孙杰**（吉斯集团董事长）。
- 来源：https://www.naddc.com.cn/shanxi/article/detail-386043.html （中国双创 2026-04-25 · 地方资讯平台转载企业通稿 → **企业口径**；已 web_fetch）
- 引文：「全球限量1226瓶的稀缺属性」「共同见证中国大陆首款十二年陈酿单一麦芽威士忌的正式面世」
- 建议 confidence：**pending**（企业口径；「中国大陆首款 12 年」属企业自我主张，**不可作事实断言**）
- 建议挂载位置：`DISTILLERIES.jisiboer`(:295-314) → `story`(:302)、`process`(:305)、`products[]`(:311-313)
- 重复判定：库内 `jisiboer` **无昆全十二年**（:311-313 仅「雕堡桶系列」）→ **新增产品**；
  与 C1 的「Symbol/555」为同厂不同款，**勿合并**
- 我没能核实的：官方指导价；拍卖落槌价（稿中只写「远超市场预期」）；「中国大陆首款 12 年」是否有反向证据。

### C19 吉斯波尔 SFWSC 2026：昆真金 / 555 与昆全 11 年银
- 类型：奖项
- 关键事实：烟台市牟平区人民政府网「媒体之声」2026-07-20（**来源：烟台吉斯波尔酒业**）：
  「2026年旧金山世界烈酒大赛评选结果公布，吉斯波尔选送的三款单一麦芽威士忌全部获奖。其中，**昆真**单一麦芽威士忌摘得**金奖**，
  **555** 单一麦芽威士忌、**昆全11年**单一麦芽威士忌收获**银奖**」；同稿引销售总经理**孙勐**称出口俄罗斯、泰国、越南、马来西亚、
  新加坡、蒙古、西班牙等，「今年啤酒和威士忌总销售额已经突破了5000万元」。
- 来源：https://www.muping.gov.cn/col/col13059/art/2026/art_8cb5ae84cd7945c4b1ea87f0febe2132.html （牟平区政府门户 2026-07-20 · **企业稿经政府站转载** → 企业口径 · 已 web_fetch）
- 引文：「昆真单一麦芽威士忌摘得金奖，555单一麦芽威士忌、昆全11年单一麦芽威士忌收获银奖」
- 建议 confidence：**pending**（政府站不等于赛事官网；SFWSC 官网结果页本轮未取得）
- 建议挂载位置：`jisiboer.flavor.community`(:309)、`products[]`；`INDUSTRY_MILESTONES`（可选）
- 重复判定：库内 `jisiboer` 无任何赛事奖项 → **更新**
- 我没能核实的：SFWSC 官网获奖页（本轮未检索到可直读结果页）；555 与 Symbol 的关系（与 C1 同一疑问）；
  「5000 万元销售额」为企业口径，且为**啤酒+威士忌合计**，不可当威士忌单品数据。

### C20 荣帝威士忌（青岛骊龙葡萄酒业）：IWSC 2026 铜 + SFWSC 2026 1 金 2 银
- 类型：奖项 + **新主体**
- 关键事实：搜狐号「极目新闻」2026-06-24 软文式稿件：荣帝威士忌在 **IWSC 2026** 与 **SFWSC 2026** 获「1 金、2 银、1 铜」：
  **SFWSC 金奖** = 荣帝卓选 1 号单一麦芽；**SFWSC 银奖** = 荣帝单一谷物威士忌、荣帝天成雪梨三桶单一麦芽；
  **IWSC 铜奖** = 荣帝帕洛科塔多雪莉桶强单一麦芽（**88 分**）。文末载「荣帝蒸馏厂隶属于**青岛骊龙葡萄酒业有限公司**」，
  骊龙酒业集团成立于 1998 年。
- 来源：https://www.sohu.com/a/1041097293_121284943 （搜狐号·极目新闻 2026-06-24 · 版面为品牌软文 → **企业口径**；已 web_fetch）
- 引文：「荣帝帕洛科塔多雪莉桶强单一麦芽威士忌获得 2026 IWSC 铜奖，评分88分」「荣帝蒸馏厂隶属于青岛骊龙葡萄酒业有限公司」
- 建议 confidence：**unverified**（依纪律「无法核验不入库」）：IWSC 官网 `iwsc.net` 全站 **403 Cloudflare**，SFWSC 未检索到官方页，
  稿件为营销文风且通篇无独立第三方 → **建议暂缓**，不入库；若 Lead 要留痕，只可作 `INDUSTRY_MILESTONES` 的 pending 备注
- 建议挂载位置：（暂缓）若收录 → `REGIONS.shandong` + 新 `DISTILLERIES.rongdi` —— **移交 A 线判断**
- 重复判定：库内无「荣帝」「骊龙」任何记录 → 属**新主体候选**
- 我没能核实的：IWSC/SFWSC 官方获奖页（IWSC 被 Cloudflare 拦截，属**本轮环境限制**）；产品定价与上市状态；工商主体。

### C21 叠川新品时间线（NBD 侧）：烟熏单岭桶 1 月限量、免税限定版 2025 上市
- 类型：更新 + 时点冲突
- 关键事实：每日经济新闻 2026-09-30（记者杨建）：「**1 月，叠川推出纯麦芽威士忌烟熏新品（中国单岭桶过桶熟成），限量发售**；
  2 月，崃州推出小批量 PX 雪莉桶桶强单一麦芽威士忌；3 月，观橡长白山蒙古栎桶调和麦芽威士忌上市；
  4 月，吉斯波尔"昆全12"单一麦芽威士忌问世」。同稿另载：**郎酒峨眉山高桥威士忌项目一期「有望年内出酒」**；
  崃州「累计灌桶已超过 60 万桶，储酒规模在国内遥遥领先，产能超过其余国产酒厂的总和」；
  「全国 64 家威士忌生产厂家中，51 家已投产」；新国标起草单位含郎酒、古井贡酒、泸州老窖、天佑德酒、青岛啤酒、古越龙山。
- 来源：https://www.mrjjxw.com/articles/2026-09-30/4596116.html （每日经济新闻 2026-09-30 · **行媒原创** · 已 web_fetch）
  —— 与库内 :615 所引 `nbd.com.cn` 同稿
- 引文：「1月，叠川推出纯麦芽威士忌烟熏新品（中国单岭桶过桶熟成），限量发售」「4月，吉斯波尔"昆全12"单一麦芽威士忌问世」
- 建议 confidence：**pending**（行媒记载；企业原始公告未见）
- 建议挂载位置：`diechuan.products[]`(:159)、`gaoqiao`(:518-540)、`laizhou`(:118)、`INDUSTRY_SNAPSHOT`
- 重复判定：库内已有该稿的多数结论（:615）→ 本条价值在**两个未落库细节**：
  ① 觀橡長白山蒙古栎桶**调和麦芽 3 月上市**（库内 :269 只有获奖，无上市时点）；
  ② 吉斯波尔「昆全 12」**4 月问世**（与 C18 的 4-22 发布会互证）
- **时点冲突（同 C12）**：叠川烟熏单岭桶「2026-01 限量发售」vs 库内 :159「2027-04 上市」→ 建议**分两批记**，不得覆盖
- 我没能核实的：叠川 2026-01 那批的渠道（是否即 ISC 名录中的 Travel Retail Exclusive / Distillery Exclusive）。

### C22 郎酒高桥威士忌项目：中国酒业协会口径「预计 6 月试生产」，年产能 1 万吨
- 类型：更新（时点）
- 关键事实：食品伙伴网转载**中国酒业协会 CADA 微信号**「十点播报」（2026-06-09）：
  「据微峨眉消息…峨眉山高桥威士忌酿酒有限公司**生产经理康均**透露，生产车间、万吨级陈酿库、污水处理厂等核心建筑主体已基本完工，
  该项目**预计今年 6 月正式进入试生产阶段**，投产后威士忌原酒**年产能将达到 1 万吨**」。
- 来源：http://jiu.foodmate.net/gonggao/show.php?itemid=19257 （食品伙伴网转载中酒协 CADA 2026-06-09 · 二手转载协会稿；已 web_fetch）
- 引文：「该项目预计今年6月正式进入试生产阶段，投产后威士忌原酒年产能将达到1万吨」
- 建议 confidence：**pending**（转发链条：微峨眉→中酒协公众号→食品伙伴网，属**同一稿多级转载**，非多源）
- 建议挂载位置：`DISTILLERIES.gaoqiao`(:518-540) → `story`(:525)、`process.maturation`(:530)
- 重复判定：库内 :525 记「预计 **2026 年 5 月**进入试生产」→ 本条为**时点口径差异（5 月 vs 6 月）**，判**更新+待裁决**
- 我没能核实的：厂方是否已于 6 月实际试产（无 7–10 月的确认稿）；「一期年内出酒」（NBD）与「6 月试产」是否同一事件。

---

## 三、渠道线（含电商未闭合说明）

### C23 酒业家调研：国产威士忌「铺货率上升、白酒商入局、主销 100–300 元」
- 类型：渠道
- 关键事实：酒业家（2026-08-04，经新浪财经头条转载）调研：以崃州为代表的国产威士忌**铺货率明显增加**，
  「越来越多的洋酒经销商开始布局国产威士忌，甚至已有白酒商相继入局」；
  价格维度「目前国产威士忌的**主销价格带集中在 100-300 元区间**」；崃州甄选（200 元左右）销量占比最高；
  崃州蒸馏厂方面透露：**2026 年以来累计开展市场推广活动超 200 场**，其中「寻威之旅」**上半年约 190 场、接待超 7500 人**，
  已与**泰山名饮、购酒网、福建海晟、安徽久酌**战略合作，**经销商数量有望 3 年内突破 1000 家、终端网点突破 20 万家**；
  渠道侧判断「进口威士忌倒挂、国产仍顺价」。
- 来源：https://cj.sina.com.cn/articles/view/2661447863/9ea278b700101f2o8 （酒业家 2026-08-04 via 新浪财经 · **行业媒体调研（含企业口径数字）** → pending；已 web_fetch）
- 引文：「目前国产威士忌的主销价格带集中在100-300元区间」「经销商数量有望在3年内突破1000家，终端网点数突破20万家」
- 建议 confidence：**pending**（行媒调研 + 经销商匿名化名；1000 家/20 万家为企业方目标口径，**不得当既成事实**）
- 建议挂载位置：`INDUSTRY_SNAPSHOT`(:648-668) 增「渠道动销价格带」metric，并**与既有「核心价格带 300–500 元 占 55%」并存标注**
- 重复判定：库内 :658「核心价格带 300–500 元（占市场份额 55%）」为中酒协口径 → 本条**不是替换，而是另一口径**：
  **中酒协 = 市场份额分布；酒业家 = 终端动销主力区间**。建议在 note 明写两种口径，避免读者以为数据互相矛盾
- 我没能核实的：调研样本量与方法；「超 200 场」「190 场」「7500 人」无厂方公示文件，仅媒体转述。

### C24 电商渠道（京东 / 天猫 / 抖音）：本轮**零可用证据**（未闭合）
- 类型：渠道（负面结论）
- 关键事实：本轮实访——京东搜索页返回「京东验证」页（正文 2.7KB，无商品）；淘宝 `s.taobao.com` 返回
  「请不要禁用JS」提示页（34KB，无价签，`¥` 正则零命中）；抖音无可用检索入口。
  → **未取得任何可核验的国产威士忌电商价、销量、榜单、评价数**。
- 来源：https://search.jd.com/Search?keyword=崃州威士忌 · https://s.taobao.com/search?q=崃州 （2026-10-07 实访 · 均为**拦截页**）
- 引文：「京东验证」「请不要禁用JS」
- 建议 confidence：**unverified**（不入库）
- 建议挂载位置：不收录；建议写入下一轮缺口清单
- 重复判定：与 2026-10-02 报告第九节第 1 条（电商销量信号缺失）**结论一致，缺口未闭合**
- 我没能核实的：京东/天猫/抖音一切价格与销量；「N 人付款」类页面本轮亦未取得，**若后续取得亦不得当月销量**。

---

## 四、冲突与裁决建议（交给 Lead）

| # | 冲突项 | A 说法 | B 说法 | 建议 |
|---|---|---|---|---|
| T1 | 吉斯波尔「中国区单一麦芽类别冠军」 | 企业稿/部分媒体（C1） | WWA 官网：中国区 **Single Malt 主类别**冠军 = 崃州 Bourbon Cask Peated Malt；吉斯波尔实为 **Single Malt·12 Years & Under** 类别冠军 | **写全类别层级**，不得与崃州同层级；`jisiboer` 记 CW(12&Under)+Gold |
| T2 | 觀橡获奖品类 | WWA = Blended Malt；库内 style = 单一麦芽（:262） | ISC 2026 = **Single Grain**（C10） | 库内**按赛事分记**；`style` 的「单一麦芽」降 pending 待厂方确认 |
| T3 | 叠川烟熏中国单岭桶上市时点 | 库内 :159 = 官方称 **2027-04** | 新华网 + NBD = **2026-01 限量发售**（C12/C21） | **分两批记**（2026-01 限量/免税版；2027-04 正式版），不得覆盖 |
| T4 | 高桥试生产时点 | 库内 :525 = 预计 **2026-05** | 中酒协 CADA 转发微峨眉 = 预计 **2026-06**（C22） | 保留两说 + 注明**同稿多级转载非多源**；待厂方口径 |
| T5 | 崃州「雪莉醇境」价格 | 行媒 = **300 元价格带**（C17） | AI 生成页 = 359 元（**作废**） | 官方指导价未取得 → 价格留 pending，note 记录两值及来源性质 |
| T6 | 主销价格带 | 中酒协 = **300–500 元占 55%**（库内 :658） | 酒业家渠道调研 = 动销主力 **100–300 元**（C23） | 二者**口径不同可并存**，须各自标明来源，勿判定其一错误 |
| T7 | 吉斯波尔「555」价格 | 企业稿 = **555 元**（C1） | 无官方价目页；酒排名（聚合）称全品牌 160–1700 元 | 555 元标 pending + 注「企业口径，命名含义之一」 |

---

## 五、文末三项

### A. 本线最有价值的 3 条
1. **C1 吉斯波尔「Symbol/555」WWA 2026 中国区 Single Malt（12 年及以下）类别冠军 + Gold** —— 一手赛事官网逐字核对；
   同时**核出企业稿的类别层级夸大**（T1），是「奖项 + 反证」双价值。
2. **C2 太瓏釀（Grand Talon）WWA 2026「Best Chinese Grain」+ Gold + 类别冠军** —— 库内 `tailongniang` 此前**零奖项**，
   本轮补上国产第三个国家级品类冠军，且级别为 **Best**（与觀橡、崃州并列）。
3. **C11 + C16 + C15 + C14 的「批量一手奖项」** —— ISC 官方 JSON（1909 行）一次性落实崃州 1 金 7 银、叠川 5 银 1 铜、
   大芹 5 银 1 铜、高朗 5 银、觀橡 1 银、淳之谷 4 银等；WWA ID 区间枚举另补出 **吉斯波尔/青岛牌/凌酝/古奇/太瓏釀/高朗**
   及 **5 家库外中国主体**（普洱 Shanhe Liuxin、Faerieferry、Distillery Miracle、蓬莱沃林香木、大连 Good Luck）。
   这是把「赛事奖项」线从媒体转述升级为**官网数据源**的一轮。

### B. 最可疑 / 最需核验的 3 条
1. **C20 荣帝威士忌（青岛骊龙）1 金 2 银 1 铜** —— 唯一依据是搜狐号软文（极目新闻账号、营销文风），
   **IWSC 官网 403 拦截、SFWSC 官网页未取得** → 建议**暂缓不入库**（unverified）。
2. **C15 福建庄臣 / Johnason's** —— 奖项本身有 ISC 官方 JSON 一手支撑，但 **ISC 署名「Jackson's Winery (Fujian)」与中文
   「福建庄臣酒业/庄臣酿酒（福建）有限公司」英文名不一致**，主体映射未闭合 → 建议先只记奖项、主体进 A 线复核。
3. **C18 吉斯波尔「昆全十二年」** —— 「**中国大陆首款十二年陈酿单一麦芽**」与「全球限量 1226 瓶」均出自
   地方资讯平台转载的企业通稿（企业口径），且**官方价、拍卖价均未披露** → 只能 pending，且不得引用「首款」为事实。

### C. 实访 URL 统计（真实计数）
- `web_fetch` 通道：**成功读取唯一 URL 33 个**；另有 4 次尝试未成并已留档：`cj.sina.cn`（跨域重定向，改用 `cj.sina.com.cn` 成功）、
  `www.hai-seas.com`（跨域重定向，改用 `hai-seas.com` 成功）、`worldwhiskiesawards.com/winner-whisky/whisky/2026`（30s 超时）、`winetbt.cn`（DNS 失败）
  - 其中赛事/机构一手页：WWA 官网 7 个具名页 + ISC 官网 2 个页面 + Icons 官网 1 个（NO DATA）
  - 官媒/政府/厂方：新华网、牟平区政府、福州新闻网、吉斯波尔官网 2 页、hai-seas.com
  - 行业/财经媒体：每日经济新闻（原站 + 网易转载）、WBO、酒业家（新浪财经）、财中社（东方财富）、whiskymag 2 篇、中国双创、食品伙伴网、搜狐（极目新闻）、新京报、酒排名 3 页、大众报业·齐鲁壹点
  - 反面样本：什么值得买 AI 生成页 1 个（已作废）
- `curl` 通道（同法实读原文，用于批量与结构化）：**WWA 官网获奖页 203 个**（id ∈ [62980,63110] × 4 badge，共 524 次请求）
  + **ISC 官方结果 JSON 1 个**（1909 行）+ 新华网/新京报 2 个 + 京东/淘宝拦截页 2 个 + WWA sitemap/搜索探测 3 个
- 合计唯一 URL 实访（含批量）：**约 240 个**；其中可用于证据引用的**一手赛事官网页面 208 个 + ISC 官方 JSON 1 个**。
- 未闭合：IWSC 官网（403）、京东/淘宝/抖音（拦截）、WWA 中国区完整列表（无筛选接口，ID 区间外不完整）。
