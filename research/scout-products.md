# B 线情报：国产威士忌「新品 / 价格 / 奖项 / 渠道」

- 采集人：scout-products（Team Lead: lead）
- 采集时间：2026-10-02（Asia/Shanghai）
- 任务：task-2
- 知识库锚点：2026-09-19（src/data.ts INDUSTRY_SNAPSHOT / INDUSTRY_MILESTONES）
- 纪律：只整理事实，不写主观品鉴结论；价格必须有可核验来源，否则标 pending；赛事评分只记录赛事官方口径。
- 说明：下文所有链接均为本次实际抓取成功的页面；标注「一手」= 当事方（厂方 / 赛事官网 / 政府与官媒现场报道）；「二手」= 第三方转述。

---

## 一、限量 / 单桶 / 拍卖

### 古奇蒙古栎桶草本威士忌·80 万元拍卖成交
- 类型：新增产品 + 拍卖事实
- 事实要点：2026-09-19 第十三届古井贡酒秋酿仪式现场，**古奇蒙古栎桶草本威士忌**经多轮竞价落槌，成交价 **80 万元**；同场「取自明代国保窖池的 2026 秋酿头酒」落槌 **190 万元**。落槌主体为**古奇（古井集团 × 法国卡慕集团合资）**，非崃州、非觀橡。
- 来源：[2026 第十三届古井贡酒·年份原浆秋季开酿仪式举行（亳州晚报 第09版·古井）](http://szb.bozhou.cn/bzb/html/2026-09/24/content_906518.htm) · 2026-09-24 · **一手**（现场报道）
- 佐证：[一款中国蒙古栎桶威士忌拍出80万元！（每日经济新闻）](http://www.nbd.com.cn/articles/2026-09-30/4596116.html) · 2026-09-30 · 二手
- 建议 confidence：verified（成交价有两家独立媒体一致口径；落槌方归属明确）
- 可挂载位置：src/data.ts `DISTILLERIES` → `guqi.products[]`；`INDUSTRY_MILESTONES`
- 与现有库关系：补充现有「古奇（古井贡 × 卡慕）」；库内尚无本品与拍卖记录
- 收录建议：**建议收录**（本线证据最强的一条）
- 弱证据提示：新华网、中国网财经两篇同事件报道均只写「古奇植萃草本威士忌发布」，未提拍卖成交价 → 80 万元目前仅有亳州晚报现场报道与 NBD 转述两个来源，建议入库时注明「据现场报道」。

### 古奇植萃草本威士忌（限量纪念款）正式亮相
- 类型：新增产品
- 事实要点：2026-09-19 秋酿现场发布 **55%vol 古井贡酒第八代 AB 股上市 30 周年首发纪念版**、**古奇植萃草本威士忌**、**古20 羊年生肖纪念酒** 三款；古奇由古井集团与法国卡慕集团合资打造，定位「世界首款草本威士忌」；同日「古奇草本威士忌蒸馏坊体验中心」落成揭幕。**官方未公布售价与产量**。
- 来源：[新华网：2026 第十三届古井贡酒·年份原浆秋季开酿仪式举行](https://www.news.cn/food/20260921/a40732d3dac94078a36c6261eded09fe/c.html) · 2026-09-21 · 一手（官媒）
- 建议 confidence：verified（事实）/ pending（价格）
- 可挂载位置：`DISTILLERIES` → `guqi.products[]`；`INDUSTRY_MILESTONES`
- 与现有库关系：补充现有古奇
- 收录建议：建议收录（价格留空或标 🟡）

### 古井贡酒携手京东线上拍卖 2026 秋酿纪念酒（渠道）
- 类型：渠道事实
- 事实要点：本届秋酿**首次开启线上拍卖**，古井贡酒携手**京东**平台线上拍卖「2026 年古井贡酒·年份原浆秋季开酿纪念酒」，**63%vol / 5L**，产自清代国保窖池，「全网仅限一坛」。
- 来源：[新华网（同上）](https://www.news.cn/food/20260921/a40732d3dac94078a36c6261eded09fe/c.html) · 2026-09-21 · 一手
- 建议 confidence：verified
- 可挂载位置：`INDUSTRY_MILESTONES`（渠道 / 数字化拍卖）
- 与现有库关系：全新（库内无京东线上拍卖记录）
- 收录建议：建议收录（注意：本品是白酒，非威士忌，宜作为「白酒企业渠道打法」参考或另置）

---

## 二、2026 赛季国际奖项（赛事官网口径）

### 觀橡（顺昌源）获 WWA 2026「世界最佳调和麦芽威士忌」
- 类型：奖项事实
- 事实要点：World Whiskies Awards 2026 官网授予 **Kwun Cheung / Blended Malt Whisky Aged in Changbai Mountains Mongolian Oak**（长白山蒙古栎桶陈酿调和麦芽威士忌）——**World's Best Blended Malt（世界最佳调和麦芽）**；ABV 48%，Category: Blended Malt，Style: No Age Statement，Company: Guangzhou Shunchangyuan Wine&Spirit Co.,Ltd。同款另获 Gold、Category Winner、Best、Global Finalist 等。官网附英文官方品鉴词。
- 来源：[World's Best Blended Malt – Kwun Cheung（WWA 官网获奖页）](https://www.worldwhiskiesawards.com/winner-whisky/worlds-best-blended-malt-63850-world-whiskies-awards-2026) · 访问 2026-10-02 · **一手（赛事官网）**
- 佐证：[Gold – Kwun Cheung（WWA 官网）](https://www.worldwhiskiesawards.com/winner-whisky/gold-62991-world-whiskies-awards-2026) · 一手
- 建议 confidence：verified
- 可挂载位置：`DISTILLERIES` → `guanxiang.flavor.community`；`INDUSTRY_MILESTONES`（重大国际奖项）
- 与现有库关系：**全新**（库内觀橡无任何国际奖项记录）
- 收录建议：**建议收录**（本条为 2026 赛季国产最高量级奖项，且是一手来源）

### 崃州获 WWA 2026「中国最佳单一麦芽威士忌」
- 类型：奖项事实
- 事实要点：WWA 2026 官网授予 **Laizhou / Bourbon Cask Peated Malt**「**Best Chinese Single Malt**」；ABV 50%，Category: Single Malt，Company: Laizhou distillery。该款对应库内「泥煤波本」。崃州同届另有：Gold ×4（American Bourbon Cask Peated Malt、Bourbon Cask Peated Malt、Oloroso Cask、Sherry Harmony No 2）、Silver ×4（Tequila Single Cask、Laizhou Finest Select、Fino Sherry Cask、STR Red Wine Cask）、Bronze ×3（Malt New Make Peated Malt、Tequila Cask、Amontillado Sherry Cask）。
- 来源：[Best Chinese Single Malt – Laizhou（WWA 官网获奖页）](https://www.worldwhiskiesawards.com/winner-whisky/best-63068-world-whiskies-awards-2026) · 访问 2026-10-02 · **一手**
- 佐证：[Gold – Laizhou / Oloroso Cask（WWA 官网，ABV 62.90%，Category: New Make & Young Spirit）](https://www.worldwhiskiesawards.com/winner-whisky/gold-62988-world-whiskies-awards-2026) · 一手
- 建议 confidence：verified
- 可挂载位置：`DISTILLERIES` → `laizhou.flavor.community`；`INDUSTRY_MILESTONES`
- 与现有库关系：**全新**（库内崃州无奖项记录）；可把 Gold/Silver/Bronze 明细挂到对应产品 note
- 收录建议：**建议收录**（奖牌清单建议先只收 Best Chinese Single Malt + 4 金，长清单可后置）

### 云拓获 Icons of Whisky China 2026「年度可持续酒厂」
- 类型：奖项事实
- 事实要点：2026-03-15 于**云南大理**举办的颁奖典礼上，**云拓蒸馏厂（Yuntuo Distillery）获 Icons of Whisky China 2026「Sustainable Distillery of the Year」**，由 CLPT 中国区总经理 Lars Roed 颁给酒厂厂长焦长毅（Edison Chiao）；同届共颁出 **30 个 Icons of Whisky China 奖项**与 **9 个 World Whiskies Awards China 奖项**；保乐力加中国 CEO Jerome Cottin-Bizonne 入选 Whisky Magazine Hall of Fame。
- 来源：[World Whiskies Awards China 2026 reveals winners（Whisky Magazine，赛事主办方）](https://whiskymag.com/articles/world-whiskies-awards-china-2026-reveals-winners/) · 2026-03-18 · **一手**（主办方发布）
- 建议 confidence：verified
- 可挂载位置：`INDUSTRY_MILESTONES`；`DISTILLERIES` → `yuntuo`
- 与现有库关系：**全新**（库内只有云拓 2026 世界威士忌大师赛 New Make 金奖）
- 收录建议：建议收录（Icons of Whisky 属「行业人物/机构奖」，与酒体赛事奖宜分列）

### 淳之谷 2026 IWSC + 2026 SFWSC 双金，及获奖产品名
- 类型：奖项事实（更新）
- 事实要点：千岛湖新闻网 2026-07-22 报道：杭州千岛湖威士忌酒业（淳之谷）「两款核心产品」获 **2026 年 IWSC 金奖** 与 **2026 年 SFWSC 金奖**，继 2025 IWSC 金奖后累计 3 金。获奖产品为「**淳之谷金奖单一麦芽中国威士忌**」（波本桶+雪利桶双桶）与**全球限量的马年生肖限定款「丙午年『一马当先』」**（雪利桶+马尔萨拉桶双桶）。报道称 IWSC 金奖获奖率仅 2%、SFWSC 年参赛超 5500 款（**属媒体转述赛事口径，赛事官网未见核实**）。
- 来源：[千岛湖威士忌夺国际大赛「双金」（千岛湖新闻网 / 淳安县融媒体中心）](https://www.qdhnews.com.cn/news/content/2026-07/22/content_9916860.html) · 2026-07-22 · 一手（地方官媒，非赛事官网）
- 建议 confidence：verified（奖项名与产品名）/ pending（2%、5500 款等数据）
- 可挂载位置：`DISTILLERIES` → `chunzhigu.products[]` 新增「丙午年『一马当先』马年生肖限定款」；`INDUSTRY_MILESTONES`
- 与现有库关系：奖项**重复**（库内已记 2026 IWSC + 2026 SFWSC 金奖）；**新品名为新增**
- 收录建议：奖项不重复收录，只补录新品名与桶型

### 云拓 2026 世界威士忌大师赛 New Make 金奖（细节补充）
- 类型：奖项事实（更新）
- 事实要点：云拓单一麦芽威士忌在 **The World Whisky Masters 2026** 获 **New Make 类别金奖**，为首次参加国际赛事。赛事由《The Spirits Business》主办、盲品评审。补充事实：云拓为帝亚吉欧在华首座威士忌酒厂，位于云南大理洱源县海拔约 2100 米；首席顾问 Jim Beveridge OBE；使用 Abercrombie 铜质壶式蒸馏器；发酵 120 小时。**首批成品仍计划 2027 年发布。**
- 来源：[首闯国际奖项，云拓单一麦芽威士忌荣膺金奖（周末画报）](https://business.modernweekly.com/lead/43347) · 2026-08-05 · 二手（企业提供内容的品牌稿）
- 佐证：[China's YunTuo Single Malt Whisky Strikes Gold on Debut at The World Whisky Masters 2026（Manila Times / GlobeNewswire 新闻稿）](https://www.manilatimes.net/2026/08/05/tmt-newswire/globenewswire/chinas-yuntuo-single-malt-whisky-strikes-gold-on-debut-at-the-world-whisky-masters-2026/2398636) · 2026-08-05 · 二手（企业新闻稿）
- 建议 confidence：verified（奖项本体，库内已记）/ pending（120 小时发酵等工艺细节，仅企业稿口径）
- 可挂载位置：`DISTILLERIES` → `yuntuo.process`（still / maturation）
- 与现有库关系：奖项**重复**（库内已记）；海拔/蒸馏器/顾问为**补充**
- 收录建议：仅作工艺字段补充；奖项不重复收录
- 说明：未在 The Spirits Business 官网检索到对应获奖页，故工艺细节标 pending。

---

## 三、2026 新品上市与定价

### 叠川两款新品：烟熏中国单岭桶 / PX 雪莉桶
- 类型：新增产品 + 出海
- 事实要点：2026-06-11 保乐力加在**香港中环中国会**举行「由成都出发，走向世界——透过香港展示中国威士忌：叠川」记者会，宣布叠川将推出两款全新产品：**叠川麦芽威士忌烟熏中国单岭桶**（使用叠川独家研发「中国单岭®橡木桶」）与**叠川麦芽威士忌 PX 雪莉桶**，**将于未来一年内推出市面**。记者会明确香港作为叠川走向国际市场的重要平台；保乐力加已持续投资**10 亿元人民币**于峨眉山酒厂。**两款新品均未公布售价。**
- 来源：[中國威士忌品牌疊川透過香港走向國際（香港商報）](http://www.hkcd.com.hk/hkcdweb/content/2026/06/11/content_8759487.html) · 2026-06-11 · 一手（记者会现场报道）
- 建议 confidence：verified（发布会事实）/ pending（价格、确切上市日）
- 可挂载位置：`DISTILLERIES` → `diechuan.products[]`（新增 2 款，tier 高端，priceBand 留空）；`INDUSTRY_MILESTONES`（出海）
- 与现有库关系：补充现有叠川（库内叠川仅 1 款 888 元纯麦芽，且 `INDUSTRY_MILESTONES` 已有「叠川经香港出海」一句）
- 收录建议：建议收录（价格标 🟡）
- 与 NBD 交叉：NBD（2026-09-30）亦称「1 月，叠川推出纯麦芽威士忌烟熏新品（中国单岭桶过桶熟成），限量发售」，与香港发布会可互证。

### 崃州 PX 雪莉桶桶强（2026 年 2 月上新）
- 类型：新增产品
- 事实要点：百润股份方面表示，崃州蒸馏厂于 **2026 年 2 月上新「崃州 PX 雪莉桶桶强单一麦芽威士忌」**。NBD（2026-09-30）独立称「2 月，崃州推出小批量 PX 雪莉桶桶强单一麦芽威士忌」。**未见公开定价。**
- 来源：[百润股份：崃州蒸馏厂于 2026 年 2 月上新「崃州 PX 雪莉桶桶强单一麦芽威士忌」](https://u.95579.com.cn/cjscweb/web/app/informationDetail.html?i_type=esinfo&i_info_lsh=NjdjNTk5NWIyYjgyM2M0OTBiOTA5OTRmNDhhNGE1MWU=) · 页面日期未能确认 · **一手（公司口径）**
- 佐证：[每日经济新闻（同上）](http://www.nbd.com.cn/articles/2026-09-30/4596116.html) · 2026-09-30 · 二手
- 建议 confidence：pending（该页正文为 JS 渲染，抓取仅得「资讯」二字，未能读到公司原文；标题与 URL 属实）
- 可挂载位置：`DISTILLERIES` → `laizhou.products[]`
- 与现有库关系：全新（库内崃州 5 款产品中无 PX 雪莉桶桶强）
- 收录建议：暂缓待确认——建议由能访问百润股份公告/互动易原文的同事补齐一句公司原文后收录

### 2026 新品时间线（1–4 月，单条索引）
- 类型：数据更新
- 事实要点：NBD 梳理 2026 年国产上新节奏：**1 月**叠川纯麦芽烟熏新品（中国单岭桶过桶熟成，限量）；**2 月**崃州小批量 PX 雪莉桶桶强单一麦芽；**3 月**觀橡长白山蒙古栎桶调和麦芽威士忌上市；**4 月**吉斯波尔「**昆全 12**」单一麦芽威士忌问世。
- 来源：[一款中国蒙古栎桶威士忌拍出80万元！（每日经济新闻）](http://www.nbd.com.cn/articles/2026-09-30/4596116.html) · 2026-09-30 · 二手
- 建议 confidence：pending（媒体梳理，未见各厂方逐条公告）
- 可挂载位置：`INDUSTRY_MILESTONES`
- 与现有库关系：全新（库内无吉斯波尔「昆全12」、无「3 月觀橡上市」）
- 收录建议：建议收录为「里程碑」一条汇总；单款产品仍待厂方来源

### 吉斯波尔「昆全 12」单一麦芽威士忌
- 类型：新增产品
- 事实要点：2026 年 4 月问世（据 NBD 梳理）。仅此一条媒体来源，**未见厂方公告、未见售价**。
- 来源：[每日经济新闻（同上）](http://www.nbd.com.cn/articles/2026-09-30/4596116.html) · 2026-09-30 · 二手
- 建议 confidence：unverified
- 可挂载位置：`DISTILLERIES` → 吉斯波尔 `products[]`
- 与现有库关系：全新
- 收录建议：暂缓待确认（需厂方或烟台当地官媒佐证）

---

## 四、价格与渠道

### 崃州单一麦芽菲诺雪莉桶 359 元/瓶（与库内 279 元冲突）
- 类型：价格更新
- 事实要点：NBD 记者线上调查：**崃州单一麦芽菲诺雪莉桶售价 359 元/瓶**；文中另引「崃州蒸馏厂公众号截图」为图片来源。**与库内已核实锚点「菲诺雪莉桶 279 元」不一致**（差价 80 元）。同期 NBD 称崃州经销商表示「300 多元的雪莉桶款是品牌走量主力」。
- 来源：[一款中国蒙古栎桶威士忌拍出80万元！（每日经济新闻）](http://www.nbd.com.cn/articles/2026-09-30/4596116.html) · 2026-09-30 · 二手
- 建议 confidence：pending
- 可挂载位置：`DISTILLERIES` → `laizhou.products[]`（菲诺雪莉桶 `priceBand`）
- 与现有库关系：**冲突**（279 元 vs 359 元）
- 收录建议：**暂缓待确认**——两个价格都有来源，不能直接覆盖。差异可能来自 规格/渠道（抖音/天猫/线下）/调价时点，建议由能核官方渠道价的同事以「官方指导价 + 实际到手价」双字段方式解决

### 大芹单一麦芽金牌波本桶 399 元/瓶
- 类型：新增价格
- 事实要点：NBD 线上调查所列国产畅销款之一：**大芹单一麦芽金牌波本桶 399 元/瓶**，落在中酒协所称 300–500 元黄金价格带。
- 来源：[每日经济新闻（同上）](http://www.nbd.com.cn/articles/2026-09-30/4596116.html) · 2026-09-30 · 二手
- 建议 confidence：pending
- 可挂载位置：`DISTILLERIES` → `daqin.products[]`
- 与现有库关系：全新（库内大芹无价格锚点）
- 收录建议：建议收录但标 🟡；若大芹官方旗舰店可核则升 verified

### 青岛威士忌单一麦芽 10 年雪莉桶 380 元/瓶
- 类型：新增价格（新主体）
- 事实要点：NBD 线上调查：**青岛威士忌单一麦芽 10 年雪莉桶售价 380 元/瓶**。主体为青岛饮料集团旗下「青岛牌威士忌」，**不在库内 19 家酒厂名单**。NBD 另称青岛啤酒与爱尔兰头部蒸馏集团合作谋划威士忌市场。
- 来源：[每日经济新闻（同上）](http://www.nbd.com.cn/articles/2026-09-30/4596116.html) · 2026-09-30 · 二手
- 建议 confidence：pending
- 可挂载位置：待 A 线（scout-newplants）确认「青岛牌」是否入库后，挂 `DISTILLERIES` → 青岛 `products[]`
- 与现有库关系：全新主体
- 收录建议：**移交 A 线**（酒厂收录属 A 线写范围）；B 线只登记价格事实

### 崃州借预调鸡尾酒渠道推进铺市
- 类型：渠道事实
- 事实要点：百润股份 2026 半年报口径：崃州蒸馏厂**累计灌桶数量已超过 60 万桶**，后续将**利用预调鸡尾酒的渠道推进威士忌产品铺市**。第一财经另载：2026 上半年威士忌进口量同比 **-9.2%**、进口金额同比 **+15.7%**；中酒协威士忌专委会 2025 年度报告口径国产生产企业 **55 家**（注：与 2026-09-19 的 64 家为不同时点口径，**不冲突**）。
- 来源：[半年盘点｜白酒忙着降度年轻化，预调鸡尾酒大户百润股份却反向加码威士忌（第一财经）](https://www.yicai.com/news/103309888.html) · 2026-08-07 · 二手（引用公司半年报）
- 建议 confidence：verified（为公司已披露口径）/ 进口数据待与 C 线核对
- 可挂载位置：`INDUSTRY_SNAPSHOT.metrics`（渠道协同 / 灌桶量）；`laizhou.story`
- 与现有库关系：补充（库内已有「崃州累计灌桶超 60 万桶」语义，可加「渠道协同」）
- 收录建议：建议收录「渠道协同」一句；进口量价数据交 C 线

### 淘宝/天猫价（抓取失败，仅登记线索）
- 类型：渠道事实
- 事实要点：二手比价站显示天猫在售「崃州单一麦芽威士忌 菲诺雪莉桶 46%vol 700ml」页面标价出现 **359 元**（淘金币可抵 4.23 元起）与 **539 元（需用券）** 两个数字，另有页面称「200 元档 / 到手 180 元上下」。
- 来源：[崃州 单一麦芽 菲诺雪莉桶 46%vol 700ml 359元 天猫（逛丢比价）](http://b.guangdiu.com/detail.php?id=28103778&tom=1) · 访问 2026-10-02 被安全验证拦截 · 二手
- 建议 confidence：**unverified**（本次实际抓取被滑块验证拦截，未能读到页面正文，故不采信为证据）
- 可挂载位置：—
- 与现有库关系：待定
- 收录建议：**不收**（无法核验，且与已核锚点冲突会污染库）——仅作为「需人工核价」的线索保留
- 另注：`post.smzdm.com` 相关文章页面自标「内容由AI生成」，其 359 元等数字**不作为来源**。

---

## 五、出海 / 出口

### 青岛威士忌 5 款同时进入韩国免税渠道
- 类型：渠道事实（出海）
- 事实要点：2026-09-21，青岛啤酒集团旗下**青岛威士忌**在**韩国免税流通渠道**同时上架 **5 款产品**：单一麦芽 4 款 + 10 年陈单一谷物 1 款。单麦 4 款分别使用蒙古栎、波本桶、Oloroso 雪莉桶、赤霞珠葡萄酒桶，酒精度 40% 或 43%，容量各 700ml；单一谷物款为干邑桶 + 波本桶 10 年陈。品牌称 1912 年起在青岛生产，2022 年（110 周年）重整品牌体系；取酒心约 18%。
- 来源：[칭다오 위스키, 국내 면세 채널에 5종 동시 입점（로이슈/LawIssue，韩国）](https://www.lawissue.co.kr/view.php?ud=202609290828594329204ead0791_12) · 2026-09-29 · 二手（韩媒，疑据企业通稿）
- 建议 confidence：pending
- 可挂载位置：`INDUSTRY_MILESTONES`（出口 / 免税渠道）；主体入库归 A 线
- 与现有库关系：全新（库内无「青岛牌」，也无国产威士忌进韩国免税记录）
- 收录建议：建议收录（出海事实），但需补一条中文/厂方来源升为 verified

### 叠川出海路径（香港平台）
- 类型：渠道事实（出海）
- 事实要点：见「二、叠川两款新品」条——2026-06-11 保乐力加在港举办发布会，明确「将香港视为将各项产品带到国际市场的重要平台」。库内 `INDUSTRY_MILESTONES` 已有「叠川经香港出海」一句，本条可补具体日期（**2026-06-11**）与发言人（保乐力加港澳营运总监林翠华）。
- 来源：[中國威士忌品牌疊川透過香港走向國際（香港商報）](http://www.hkcd.com.hk/hkcdweb/content/2026/06/11/content_8759487.html) · 2026-06-11 · 一手
- 建议 confidence：verified
- 可挂载位置：`INDUSTRY_MILESTONES` →「国产威士忌出海」条 detail 补日期
- 与现有库关系：补充现有
- 收录建议：建议收录（补日期即可）

---

## 六、产业数据（与库内 2026-09-19 快照对照后多为重复）

### 64 家厂中 51 家已投产、2 家试生产
- 类型：数据更新
- 事实要点：NBD 引中国酒业协会最新报告：全国威士忌生产厂家 **64 家**（同比 +9 家），其中 **51 家已投产（占比近 80%）**、**2 家试生产**；产能主要集中在四川邛崃、四川峨眉山、浙江千岛湖、云南大理；千岛湖已集聚淳岸、淳之谷、千岛金久等 **6 家**；2024 年前布局的首批项目陆续迈过三年陈酿门槛，**今明两年集中上市**。
- 来源：[一款中国蒙古栎桶威士忌拍出80万元！（每日经济新闻）](http://www.nbd.com.cn/articles/2026-09-30/4596116.html) · 2026-09-30 · 二手
- 建议 confidence：pending（中酒协报告的中转引述，未见报告原文）
- 可挂载位置：`INDUSTRY_SNAPSHOT.metrics`（新增「已投产 51 家 / 试生产 2 家」）
- 与现有库关系：**部分重复**——库内已有「64 家、+9 家」；**「51 家投产 / 2 家试生产」为全新**
- 收录建议：建议收录新增的投产/试生产细分（库内快照确实缺这一项）

### 其余大盘数据（经比对：库内已有，建议不收）
- 类型：数据更新
- 事实要点：NBD 同日提及的以下数字，**均已在 `INDUSTRY_SNAPSHOT`（asOf 2026-09-19）中**：64 家 / 同比 +9 家；实际蒸馏能力约 7 万千升、设计产能 13 万千升；已投产产值约 158.5 亿元、远期空间超 200 亿元；进口份额 85%；消费者 85% 体验过、转化 60%；核心价格带 300–500 元占 55%；2025 年进口量 3584 万升首超白兰地；2025 年零售规模超 150 亿元。仅「2025 年零售口径规模超 150 亿元」在库内未逐字出现（库内有进口量与份额）。
- 来源：[每日经济新闻（同上）](http://www.nbd.com.cn/articles/2026-09-30/4596116.html) · 2026-09-30 · 二手
- 建议 confidence：verified（与库内中酒协口径一致，属加固而非新增）
- 可挂载位置：`INDUSTRY_SNAPSHOT`
- 与现有库关系：**重复**
- 收录建议：**不收**（避免冗余）；仅「2025 零售规模 >150 亿元」可选补一条

---

## 七、检验性 / 待核线索（本轮未能核实，供后续跟进）

### 叠川 ISC 世界威士忌组别金奖（待核）
- 类型：奖项事实
- 事实要点：一篇自标「内容由AI生成」的比价站文章称：叠川纯麦芽威士忌拿下**国际烈酒挑战赛（ISC）世界威士忌组别金奖**，为「中国产区威士忌第一次站上这个位置」；又称崃州阿蒙蒂亚雪莉桶桶强在某国际威士忌大赛以 **93.87 分排全球第 5**、两款单麦进全球 TOP15。**本次未能在 ISC 官网或厂方渠道找到对应获奖页。**
- 来源：[崃州卖到欧洲、叠川拿下国际金奖……（什么值得买社区，页面自标 AI 生成）](https://post.smzdm.com/p/a825vzo6/) · 2026-08-22 · 二手（AI 生成，不可作来源）
- 建议 confidence：**unverified**
- 可挂载位置：暂不
- 与现有库关系：库内淳之谷已有「2026 ISC 银奖」，本条若成立则为叠川/崃州新增
- 收录建议：**不收**（AI 生成内容 + 无赛事官网佐证）；建议后续直接查 ISC / IWSC 官网获奖库

### 国台「酱香威士忌」429 元（待核）
- 类型：新增产品
- 事实要点：同一 AI 生成文章标题称「国台还把 429 的『酱香威士忌』端上桌」。**未见任何一手或主流媒体报道佐证。**
- 来源：[什么值得买社区（页面自标 AI 生成）](https://post.smzdm.com/p/anv3g8z2/) · 访问 2026-10-02 · 二手（AI 生成）
- 建议 confidence：**unverified**
- 收录建议：**不收**

---

## 本线 TOP 3 收录候选

1. **觀橡（顺昌源）获 WWA 2026「世界最佳调和麦芽威士忌」** — 一手赛事官网、可点开验证、库内觀橡完全无奖项记录、2026 赛季国产最高量级奖项。挂 `guanxiang.flavor.community` + `INDUSTRY_MILESTONES`。
2. **古奇蒙古栎桶草本威士忌 80 万元拍卖成交（2026-09-19）** — 用户点名核实项，原始主体已查实为**古奇（古井贡 × 卡慕）**，非崃州/觀橡；有地方党媒现场报道 + 主流财经媒体双源；库内古奇无本品记录。
3. **崃州获 WWA 2026「Best Chinese Single Malt」（泥煤波本）+ 4 金 4 银 3 铜** — 一手赛事官网，直接对应库内已价格核实的「泥煤波本 339 元」，可把奖项挂到具体产品上，库内价值最高。

（备选第 4：云拓获 Icons of Whisky China 2026 年度可持续酒厂——一手主办方来源，但属机构奖非酒体奖，且云拓首批成品 2027 年才上市。）

## 证据强度自评

- **强（一手、可点开核验）**：WWA 官网 4 个获奖页（觀橡World's Best Blended Malt / 觀橡Gold / 崃州Best Chinese Single Malt / 崃州Gold Oloroso）；Whisky Magazine Icons of Whisky China 2026；新华网与亳州晚报现场报道；香港商报叠川发布会现场报道；千岛湖新闻网淳之谷报道。
- **中（二手主流媒体、口径一致）**：每日经济新闻 2026-09-30 长文（新品时间线、价格、产业细节）；第一财经 2026-08-07；周末画报/GlobeNewswire 云拓企业稿；韩媒青岛免税报道。
- **弱 / 不采信**：什么值得买两篇页面自标「AI 生成」，其 359 元、ISC 金奖、93.87 分、国台 429 元等**一律标 unverified 并建议不收**；逛丢比价页本次被滑块验证拦截，未读到正文，同标 unverified。
- **本轮最弱证据点（须优先补）**：
  1. **价格口径冲突未解**——崃州菲诺雪莉桶「库内 279 元 vs NBD 359 元」，两者各有来源，**不能覆盖**，需人工核官方渠道价或引入「官方指导价 / 实际到手价」双字段。
  2. **电商销量信号缺失**——天猫/京东/抖音的**实际销量、榜单、评论量**本轮未取得任何可核验来源；仅拿到「古井×京东线上拍卖」这一条渠道事实。用户要求的「渠道价格与销量信号」只完成一半，建议后续用浏览器会话（登录态）直接读天猫/京东商品页与抖音榜单。
  3. **百润 PX 雪莉桶桶强页面正文未能渲染**，公司原文未读到，该条保持 pending。
  4. **80 万元拍卖**目前仍是「现场报道 + 转述」双二手（新华网与中国网财经两篇同事件报道均未提成交价），建议补古井集团微信公众号原文截图后再升为一手。

## 未完成 / 移交
- 酒厂主体新增（青岛牌、久溪等）→ 移交 A 线 `scout-newplants`。
- 5% 进口暂定税率、千岛湖产区团标立项、进口量价数据 → 移交 C 线 `scout-industry`。
- 本文件仅覆盖 B 线写范围 `research/scout-products.md`，未改动仓库任何其它文件。
