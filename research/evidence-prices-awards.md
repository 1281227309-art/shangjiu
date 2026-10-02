# E2 线取证：价格与规格自洽性（task-6）

- 取证员：evidence-price
- 取证时间：2026-10-02（Asia/Shanghai）
- 目标：解决库内「价格与规格自洽性」的证据缺口；只写本文件，未改动 `src/data.ts` 及任何其他文件。
- 库内现值（本轮基线，读取自 `src/data.ts:127-132` 崃州 / `:156-160` 叠川）：
  - 崃州甄选 229 元/700ml（40%vol）verified
  - STR 红葡萄酒桶 279 元/700ml（46%vol）verified
  - 菲诺雪莉桶 **279 元/700ml（46%vol）verified**（`:129`）
  - 泥煤波本 **339 元/700ml（46%vol）verified**（`:130`）
  - 阿蒙蒂亚雪莉桶桶强 499 元/700ml（66%vol）verified
  - 叠川（纯麦芽）888 元/700ml verified

## 环境限制（影响可取证范围，如实记录）

| 渠道类型 | 结果 | 说明 |
|---|---|---|
| 官方品牌官网 | 可访问，**但官网不公布价格** | `laizhoudistillery.com` 为 Nuxt SPA + 年龄门；产品页 `/whisky/laizhou` 仅有 5 个 SKU 的图片与品鉴信息，全站无价格字段 |
| 官方公众号 | 可取得原文，**图文卡为图片** | 正文以图片承载，价格若未印在图上即不可得；已用 macOS Vision OCR 提取图卡文字 |
| 官方旗舰店（天猫/京东/有赞） | **未能取到价格** | 见下 |
| 电商页（天猫/京东/逛丢） | **被拦截，不予采信** | 见下 |
| 浏览器自动化 | **不可用** | `browser_session` 报错：bsk CLI 未安装（BrowserSkill 未部署），本机无法做任何 JS 渲染页面取数 |

- 京东：`search.jd.com` / `so.m.jd.com` 对 curl 一律 `302` 空响应；官方旗舰店「店铺简介」页（`mall.jd.com/introduction-*`）可取，但**商品与价格由 JS 加载**，静态页无价格。
- 有赞「崃州会员商城」（官方渠道，链接出自崃州官方公众号）：页面可达，但商品列表经 JS 二次请求渲染；`/wscshop/feature/goods/all` 返回的仍是配置壳，解析不到商品与价格。
- 天猫/逛丢：`b.guangdiu.com`、`guangdiu.com` 明确返回**滑块安全验证页**（“请完成安全验证 检测到当前访问较频繁”），**不作为证据采信**；仅有搜索结果标题可用，已在下文标注为「聚合站标题，未采信」。
- 淘宝/天猫商品页本身需登录，无法取数。

---

### 项 1（最高优先级）崃州官方价格口径：279 元 vs 359 元

- **是否取得官方口径：未取得（价格）。** 规格部分取得（见项 2）。
- 官方来源直链（均为本人实际打开并读取）：
  - 崃州蒸馏厂官网：https://www.laizhoudistillery.com/ （产品页 https://www.laizhoudistillery.com/whisky/laizhou ）
  - 百润股份（崃州母公司，上市公司）官网品牌资讯：https://www.bairun.net/Brand-Activities.html
  - 崃州官方公众号《崃州单一麦芽威士忌新品正式上市！》（由百润官网新闻列表直链指向）：https://mp.weixin.qq.com/s/cRl2KvsnI8cTO5zLjfuSBA
  - 崃州官方公众号《五大官方电商上线，福利惊喜不断！》：https://mp.weixin.qq.com/s/HYTKH8LuHDKpTeD6Njaj9Q
  - 崃州会员商城（官方有赞店）：https://shop150125639.m.youzan.com/v2/showcase/homepage?alias=O4L0BEjdGo
  - 对照：百润官网《崃州雪莉荟萃单一麦芽威士忌上市！》（2025-01-23，含官方售价先例）：http://www.bairun.net/Brand-Activities/22.html
- 逐字摘录：
  - 百润官网《崃州雪莉荟萃》（**这是唯一取到的官方「官方售价」字样**）：
    > “容量：700ML/瓶　ABV：53%　官方售价：CNY799元　即日起仅限上海崃州吧、广州崃州吧、崃州烈酒文化体验中心线下销售，限量5,699瓶，售完即止”
  - 崃州官方公众号 2025-06-19 新品文章（OCR 图卡正文）：
    > “2025年6月19日，“以至繁 致风味”崃州新品发布会直播圆满落幕……此次发布共五款新品”
    > “即日起，崃州单一麦芽威士忌全新系列，同步上线天猫、京东、小红书、抖音、有赞、快手六大官方店铺，上海与广州崃州吧、体验中心及全国多城市线下经销渠道”
  - 该文五张产品图卡 OCR 出的规格（原文）：
    > “容量：700ML/瓶　酒精度：40%vol”
    > “容量：700ML/瓶　酒精度：46%vol”
    > “容量：700ML/瓶　酒精度：46% vol”
    > “容量：700ML/瓶　酒精度：50% vol”
    > “容量：700ML/瓶　酒精度：66%vol”
  - 该文**全程没有任何价格数字**（OCR 全文 + 正文文本节点均无）。
  - 每经原文（项 4 引用）称菲诺雪莉桶 359 元/瓶。
- 结论（279/359 如何处理）：
  1. **两数不是同一口径，也不能确认为「官方指导价 vs 到手价」的对应关系**——因为**崃州官方渠道（官网/公众号/有赞商城）在本轮完全未披露价格**，我无法拿到官方指导价的直链。唯一取到的「官方售价」字样来自 2025-01 的限量款雪莉荟萃（799 元），不能外推到菲诺雪莉桶。
  2. 现有可归因情况：
     - **279 元**：库内来源为兴业证券研报（2025-06）+ CWS 盘点，属**首发期（2025-06-19 上市）定价口径**，无官方直链。
     - **359 元**：来自 **2026-09-30 每日经济新闻「记者线上调查」**（见项 4）与电商聚合站标题，属**平台/终端标价口径**，非官方指导价；另有天猫渠道「百亿补贴标价 423 元、领券后到手 355 元/件（700ml×1）」的第三方好价记录（smzdm，2026-09-11）。
     - 另一处易混：2026-08-31 崃州上架**新品「雪莉醇境」（四种初填雪莉桶，40 度，359 元）**，其 359 元是官方旗舰店上架价；与菲诺雪莉桶（46 度）并非同一 SKU，公开报道明确把两者并列对照。
  3. **建议（明确）**：
     - **`src/data.ts:129` 的 `priceBand` 改为双字段/拆分表述**，并**把该条价格部分降为 `pending`**：
       - `官方指导价（首发期，2025-06 上市，研报口径）：279 元 / 700ml`
       - `2026-09 主流电商到手价：355–359 元 / 700ml（天猫等平台价，非官方指导价）`
     - 理由：同一 SKU 存在两个相差 80 元、且分属不同时点/口径的数字，官方口径未取得 → 不具备维持无条件 `verified` 的条件；规格部分（46%vol、700ml）可维持 verified（见项 2）。
     - 若 Lead 决定只用单值：**保留 279 元并强制加 note**（“首发期定价；2026-09 平台到手价 355–359 元，非官方指导价”），同时把 confidence 降为 `pending`。**不建议**把 359 当官方指导价写入。
- 已尝试渠道 + 失败原因（价格）：
  - 崃州官网：可达；产品页与首页均无价格字段（Nuxt SPA，数据接口 `baseURL=/laizhou-owbs`，仅 `/app/business/showNewsPage`、`/app/business/detailNews/` 两个业务接口，无商品/价格接口）。
  - 崃州官方公众号：原文可达；内容为图片，OCR 后无价格数字。
  - 崃州会员商城（有赞官方店，官方公众号直接给出）：页面可达；商品列表 JS 渲染，`feature/goods/all` 与 `showcase-api` 端点均取不到商品与价格。
  - 天猫/京东官方旗舰店：京东对 curl 返回 302；天猫需登录；浏览器工具在本机不可用（bsk 未安装）。
  - 百润股份投资者关系页（同花顺 basic.10jqka.com.cn/002568，含 2026-05-15、2026-08-05、2026-09-15、2026-09-16 调研与问答记录）：页面 JS 渲染 + 需登录，未能取到可引用的官方定价表述。
  - cninfo（巨潮）百润股份公告检索：接口返回 `totalAnnouncement:0`（参数/接口不可用），未取到调研记录表。

---

### 项 2 崃州 SKU 与 WWA 2026 获奖款对应关系；50%vol 与 46%vol 之分

- **是否取得官方口径：取得（世界威士忌大赛 WWA 官方获奖库，Company 标注为 Laizhou distillery）+ 取得（崃州官方公众号图卡 ABV）**，且两者逐项吻合。
- 官方来源直链（WWA 官方获奖页，全部本人实际打开）：
  - Best Chinese Single Malt（Laizhou / Bourbon Cask Peated Malt，50.00%）：https://www.worldwhiskiesawards.com/winner-whisky/best-63068-world-whiskies-awards-2026
  - Category Winner（同款，50.00%）：https://www.worldwhiskiesawards.com/winner-whisky/category-winner-63056-world-whiskies-awards-2026
  - Gold（同款，50.00%）：https://www.worldwhiskiesawards.com/winner-whisky/gold-62989-world-whiskies-awards-2026
  - Gold：Laizhou / American Bourbon Cask Peated Malt（**63.80%**，类别 New Make & Young Spirit）：https://www.worldwhiskiesawards.com/winner-whisky/gold-62987-world-whiskies-awards-2026
  - Silver：Laizhou / Laizhou Fino Sherry Cask（**46.00%**）：https://www.worldwhiskiesawards.com/winner-whisky/silver-63005-world-whiskies-awards-2026
  - Silver：Laizhou / STR Red Wine Cask（**46.00%**）：https://www.worldwhiskiesawards.com/winner-whisky/silver-63006-world-whiskies-awards-2026
  - Silver：Laizhou / Laizhou Finest Select（**40.00%**）：https://www.worldwhiskiesawards.com/winner-whisky/silver-63004-world-whiskies-awards-2026
  - Bronze：Laizhou / Amontillado Sherry Cask（**66.00%**）：https://www.worldwhiskiesawards.com/winner-whisky/bronze-63034-world-whiskies-awards-2026
- 逐字摘录（官方页原文）：
  - → “### Laizhou ／ #### Bourbon Cask Peated Malt … ABV: **50.00%** … Category: Single Malt … Style: No Age Statement … Company: Laizhou distillery … Website: https://laizhoudistillery.com”
  - → “### Laizhou ／ #### Laizhou Fino Sherry Cask … ABV: **46.00%** … Category: Single Malt … Company: Laizhou distillery”
  - → “### Laizhou ／ #### STR Red Wine Cask … ABV: **46.00%**”
  - → “### Laizhou ／ #### Laizhou Finest Select … ABV: **40.00%**”
  - → “### Laizhou ／ #### Amontillado Sherry Cask … ABV: **66.00%**”
  - → “### Laizhou ／ #### American Bourbon Cask Peated Malt … ABV: **63.80%** … Category: New Make & Young Spirit … Style: Young Spirit”
  - 崃州官方公众号 2025-06-19 图卡：`40%vol / 46%vol / 46% vol / 50% vol / 66%vol`（五款，700ML/瓶）。
  - 零售端佐证（**非官方，仅作旁证**）：HKTVmall 商品标题「崍州 泥煤波本單一麥芽威士忌 Laizhou Single Malt Whisky **Peated Bourbon Cask 50%abv**（700ml）」（该商品页现已下架，404；仅搜索结果标题可见，未作为 verified 依据）。
- 结论：
  1. **WWA 官方 5 个获奖款的 ABV 与崃州官方公众号 5 张图卡的 ABV 完全一一对应**（40 / 46 / 46 / 50 / 66），与库内 5 个 SKU 的桶型也一一对应：
     - 甄选 Finest Select = **40%**（库内 40% ✅）
     - STR 红葡萄酒桶 = **46%**（库内 46% ✅）
     - 菲诺雪莉桶 = **46%**（库内 46% ✅）
     - **泥煤波本 = Bourbon Cask Peated Malt = 50.00%（库内 46% ❌ 应修正为 50%vol）**
     - 阿蒙蒂亚雪莉桶桶强 = **66%**（库内 66% ✅）
  2. **不存在「50%vol 桶强版 + 46%vol 常规版」的双版本**。WWA 官方页对 Bourbon Cask Peated Malt 标注的类别是 **Single Malt / No Age Statement**（即流通常规款），ABV 就是 50.00%。另有一个「American Bourbon Cask Peated Malt 63.80%」属下 **New Make & Young Spirit（新酒/年轻酒）** 类别，是参赛的新酒样品，**不是流通 SKU**，不可当作「桶强版泥煤波本」。
  3. **库内 `:130` 的「46%vol」极可能是把同批次另两款 46%vol 的规格误复制**（该批次确有 2 款 46%vol）。
  4. 修正建议：`:130` priceBand 规格改为 **`50%vol`**（可标 verified，依据 = WWA 官方获奖页 + 崃州官方公众号图卡，双官方源）；价格 339 元口径另见项 1 的「平台价 vs 指导价」处理原则（本次未取到 339 的官方指导价直链，同为研报/电商口径）。

---

### 项 3 叠川 ISC 金奖年份（2024）

- **是否取得官方口径：取得（ISC 官方历史获奖数据库）。**
- 官方来源直链：
  - ISC 官方历史获奖查询页：https://internationalspiritschallenge.com/internationalspiritschallenge2026/en/page/all-results
  - 该页实际加载的官方结果数据（ISC 官方 S3，`dataUrl` 原文可从页面源码读出）：https://evessio.s3.amazonaws.com/customer/38fdd951-ed5d-49f2-82f3-ed13e29bcfce/results/Agile_ISC_all_20251014_cached.json
  - 佐证（央媒，报道 ISC 2024-05-29 放榜）：新华网《叠川纯麦芽威士忌荣获国际烈酒挑战赛金奖》 http://www.xinhuanet.com/fashion/20240529/3480f83a454c44a9a81e8f73ee0922ed/c.html
  - 保乐力加中国官网新闻页（JS 未渲染，正文不可读）：https://www.pernod-ricard-china.com/media-content.html?id=1716972308845
- 逐字摘录：
  - ISC 官方 2024 Results（字段顺序：Awards / Category / Sub-Category / Name / Company Name / Design Agency / Medal）：
    > `["Tasting Awards", "World Whisky", "Blended Malt Whisky", "The Chuan Pure Malt Whisky", "Pernod Ricard", "", "GOLD"]`
    > `["Tasting Awards", "World Whisky", "Blended Malt Whisky", "The Chuan Distillery Exclusive PX Finish", "Pernod Ricard", "", "SILVER"]`
    > `["Design & Packaging Awards", "Design & Packaging", "New Brand Launch", "叠川The Chuan Pure Malt Whisky", "Pernod Ricard", "Nude Brand Creation", "GOLD"]`
  - ISC 官方 2025 Results（补充发现）：
    > `["Tasting Awards", "Worldwide Whisky", "Single Malt No Age Statement", "The Chuan Pure Malt Whisky PX Finish", "Pernod Ricard", "", "GOLD"]`
    > `["Tasting Awards", "Worldwide Whisky", "Single Malt No Age Statement", "The Chuan Pure Malt Whisky non chill filtered", "Pernod Ricard", "", "SILVER"]`
  - 新华网原文（2024-05-29）：
    > “2024年5月29日，当今最具影响力的国际烈酒竞赛之一国际烈酒挑战赛ISC（International Spirits Challenge）公布榜单，叠川纯麦芽威士忌荣获世界威士忌组别金奖”
- 结论：
  1. **华夏酒报「叠川 2024 年斩获 ISC 世界威士忌组别金奖」成立**，可在 ISC 官方库逐字复核到（年份 2024、组别 World Whisky、Medal GOLD）。
  2. **重要细节（建议一并写入）**：ISC 官方把该获奖款的子类别记为 **Blended Malt Whisky（混合麦芽）**，而非 Single Malt。这与库内 `:157` note「官方标注 Pure Malt（纯麦芽）」以及 `:143` 来源口径「whisky pur malt 纯麦芽」是**自洽的正面佐证**，而不是冲突；同日还另获 Design & Packaging / New Brand Launch 金奖。
  3. 顺带发现：2025 年 ISC 叠川另有 PX Finish **GOLD**、non chill filtered **SILVER**。若库内想补叠川获奖，这两条同样是 ISC 官方直链可核的。
  4. 建议：把「2024 ISC 世界威士忌组别金奖（子类别：Blended Malt Whisky）」升级为 **verified**，并附 ISC 官方页直链。

---

### 项 4 大芹金牌波本桶 399 元、青岛 10 年雪莉桶 380 元

- **是否取得官方口径：未取得（厂方官方渠道价）。** 仅取得媒体口径与官方规格旁证。
- 来源直链：
  - 每日经济新闻原文（2026-09-30，记者杨建；经和讯网转载全文）：https://m.hexun.com/consume/2026-09-30/225079489.html
  - 大芹京东官方旗舰店（官方渠道，存在性确认）：https://mall.jd.com/introduction-10337062.html
  - 大芹官网（仅 JS 空页）：http://www.cndaiking.com
  - 台北市酒类商业同业公会 美酒網·大芹金牌單一麥芽威士忌：https://finewine.org.tw/products_detail.php?no=20240307004
  - 台北市酒类商业同业公会 美酒網·大芹珍藏系列波本桶：https://finewine.org.tw/products_detail.php?no=20250227002
  - 华东葡萄酒京东官方旗舰店（青岛威士忌生产方「青岛华东葡萄酿酒有限公司」体系，官方渠道，存在性确认）：https://mall.jd.com/introduction-174577.html
  - 青岛饮料集团官网品牌页（**连接失败**）：https://www.yinliaojituan.com/portal/strategic/brand_detail.html?id=76
  - 青岛啤酒布局威士忌（财中社/东方财富，说明「青岛」威士忌归属）：https://finance.eastmoney.com/a/202608283858109435.html
- 逐字摘录：
  - 每经原文：
    > “记者线上调查发现，国产威士忌畅销款均在这一价格带有所布局：崃州单一麦芽菲诺雪莉桶售价359元/瓶；大芹单一麦芽金牌波本桶售价399元/瓶；青岛威士忌单一麦芽10年雪莉桶售价380元/瓶。”
  - 东方财富/财中社（2026-08-28）说明品牌归属：
    > “2025年，青岛啤酒通过收购青岛饮料集团有限公司……饮料集团旗下的青岛华东葡萄酿酒有限公司不仅拥有相关烈酒酿造资质，近年来还推出了青岛单一麦芽威士忌、青岛珍藏白兰地、青岛传承VSOP白兰地等产品。”
  - 美酒網·大芹金牌（台湾经销体系）：
    > “大芹金牌單一麥芽威士忌 / DAIKING GOLD BRAND Single Malt Whisky … 原價 $1280 … 陳釀於甄選的初填波本桶 … 容量:700ML　酒精度:43%vol”
    > 附获奖记录（该页自述）：“2023 WWA世界威士忌大賽金獎／2023 WWA世界威士忌大賽類別冠軍／2023 TWSC銅獎／2022 ISC國際烈酒挑戰賽銅獎／2021 WWA銀獎”
  - 美酒網·大芹珍藏系列波本桶：
    > “原價 $2180 … 以 53%高酒精度裝瓶 … 容量:700ML　酒精度:53%vol”
- 结论：
  1. **399 元（大芹金牌波本桶）与 380 元（青岛 10 年雪莉桶）只能作为「媒体线上调查所得的平台/终端价」，不能作为厂方官方指导价入库。** 建议在库内标为 `pending`，note 明确写「来源：每日经济新闻 2026-09-30 线上调查（平台价），非厂方官方口径」。
  2. **规格一致性提醒（重要）**：台湾官方经销体系页面对「大芹金牌单一麦芽威士忌」标注的是 **700ML / 43%vol / 初填波本桶**，原价 NT$1,280（约合人民币不足 300 元）。每经所称「金牌波本桶 399 元」是否与台湾 43%vol「金牌」同为一款、抑或是大陆专供/不同酒精度版本，**官方渠道未证实**。若库内要写「大芹金牌波本桶 399 元」，必须同时注明规格未确认。
  3. 「青岛」威士忌的厂方主体可确认是 **青岛饮料集团 → 青岛华东葡萄酿酒有限公司**（现随青岛啤酒收购并入），故官方渠道应为青岛饮料集团/华东葡萄酒，而非青岛啤酒股份本部；这一归属关系可升级为 **verified**（依据：上市公司+媒体，另已确认其京东官方旗舰店存在）。
- 已尝试渠道 + 失败原因：
  - 大芹京东官方旗舰店：店铺简介页可取（确认其为官方旗舰店，简介含「中国大陆第一家使用进口大型苏格兰威士忌蒸馏设备（Forsyths）的酒厂」），但**商品价格由 JS 加载**，静态页无价格。
  - 大芹官网 `cndaiking.com`：返回纯 JS 空页（“访问本页面，您的浏览器需要支持JavaScript”），无内容。
  - 青岛饮料集团官网：`https://www.yinliaojituan.com/...` 连接失败（curl 返回 000；http 返回 301 后不可达）。
  - 华东葡萄酒京东官方旗舰店：店铺简介页可取，静态导航中**未见「威士忌」类目**（价格与二级类目由 JS 加载）。
  - 青岛啤酒官网 `tsingtao.com.cn`：可取，但首页未检索到威士忌零售页或价格。
  - 天猫/京东商品页、逛丢聚合页：滑块/302 拦截，**不予采信**。

---

### 项 5 崃州「筹备广东新厂」

- **是否取得官方口径：未取得任何「崃州」广东新厂的证据；反而取得「广东新厂 = 大芹（惠州龙门）」的地方官媒一手证据。**
- 来源直链（地方官媒）：
  - 今日惠州网 / 惠州日报《有望全球规模领先！广东大芹威士忌蒸馏厂试投产》（2026-04-29，记者黄宇翔，通讯员龙门宣）：http://www.huizhou.cn/news/newsc_counties/newsc_clm/202604/t20260429_1650346.htm
- 逐字摘录：
  > “原标题：大芹威士忌蒸馏厂项目试投产　总投资16亿，将融合温泉康养资源打造综合性文旅地标”
  > “惠州日报讯（记者黄宇翔 通讯员龙门宣）日前，位于龙门县永汉镇锦城村的广东大芹威士忌蒸馏厂项目正式投料试产，这一总投资16亿元的产业项目进入实质性生产阶段。项目建成达产后，有望成为全球规模领先的单体单一麦芽威士忌酒厂……”
  > “广东大芹威士忌蒸馏厂项目相关负责人向记者介绍，大芹威士忌品牌自2007年在福建建成中国大陆首家引进苏格兰大型蒸馏设备的酒厂以来……自2020年产品投入市场以来，该品牌已在国际各大烈酒竞赛中累计荣获138项奖项。”
  > “记者了解到，该项目占地375亩……待后续全部建成达产后，预计年产威士忌可达2万千升……”
- 结论：
  1. **「崃州筹备广东新厂」在本轮多角度检索中完全未取得任何佐证**（无政府招商稿、无上市公司公告、无地方官媒、无官方表述）。
  2. 已取得官方地方媒体证明的广东新厂是 **大芹**（广东惠州龙门县永汉镇锦城村，总投资 16 亿元、375 亩、年产 2 万千升），与库内 `src/data.ts:90` 对大芹的表述一致（该处表述可据此升级为 **verified**，直链即惠州日报）。
  3. **建议：不要把「广东新厂」记到崃州名下**；若下游稿件或库内存在该表述，应按「单源、无官方佐证」删除或降级，避免张冠李戴（疑似把大芹的广东项目误挂到崃州）。
- 已尝试渠道 + 失败原因：地方官媒（惠州日报，取得，但对象是大芹）；百润股份公告/cninfo（接口不可用）；政府招商稿（未检索到与崃州相关者）；行业媒体（仅“酒业家”一源，未能在本轮复核到原文）。

---

## 本次可升级为 verified 的字段清单

| # | 字段/对象 | 目标值 | 官方依据（直链） |
|---|---|---|---|
| 1 | 崃州 **泥煤波本 酒精度：46%vol → 50%vol**（`src/data.ts:130`） | 50%vol / 700ml | WWA 官方获奖页 `best-63068` / `category-winner-63056` / `gold-62989`（ABV 50.00%，Laizhou distillery）+ 崃州官方公众号《崃州单一麦芽威士忌新品正式上市！》图卡“酒精度：50% vol” |
| 2 | 崃州 菲诺雪莉桶 规格 46%vol / 700ml | 维持 | WWA 官方 `silver-63005`（Laizhou Fino Sherry Cask ABV 46.00%）+ 官方公众号图卡 46%vol |
| 3 | 崃州 STR 红葡萄酒桶 规格 46%vol | 维持 | WWA 官方 `silver-63006`（STR Red Wine Cask 46.00%） |
| 4 | 崃州 甄选 规格 40%vol | 维持 | WWA 官方 `silver-63004`（Laizhou Finest Select 40.00%） |
| 5 | 崃州 阿蒙蒂亚雪莉桶桶强 规格 66%vol | 维持 | WWA 官方 `bronze-63034`（Amontillado Sherry Cask 66.00%） |
| 6 | 叠川 **2024 ISC 世界威士忌组别金奖**（子类别：Blended Malt Whisky） | 2024 / GOLD | ISC 官方历史结果 JSON（2024 Results 行）+ 新华网 2024-05-29 |
| 7 | （可选补充）叠川 2025 ISC：PX Finish GOLD、non chill filtered SILVER | 2025 | 同上 ISC 官方 JSON（2025 Results 行） |
| 8 | （可选补充）崃州 2026 WWA 获奖：Bourbon Cask Peated Malt 获 Best Chinese Single Malt（Chinese Single Malt 类别冠军） | 2026 | WWA 官方 `best-63068` / `category-winner-63056`（注：公众号称“13 项大奖”，官方页可逐条核） |
| 9 | 大芹 **广东惠州龙门新厂**（总投资 16 亿 / 375 亩 / 年产 2 万千升 / 2026-04 投料试产） | verified | 惠州日报·今日惠州网 2026-04-29 |
| 10 | 「青岛」威士忌厂方主体 = 青岛饮料集团 → 青岛华东葡萄酿酒有限公司（已并入青岛啤酒体系） | verified | 东方财富/财中社 2026-08-28 + 京东「华东葡萄酒官方旗舰店」 |

## 仍只能 pending 的清单

| # | 事项 | 原因 |
|---|---|---|
| 1 | 崃州 菲诺雪莉桶**官方指导价**（279 元 vs 359 元） | 官方渠道（官网/公众号/有赞商城）本轮均未披露价格；279 为研报口径、359 为媒体线上调查/平台价；**价格部分建议降 pending 并拆双字段** |
| 2 | 崃州 泥煤波本 339 元 的价格口径 | 与项 1 同理，未取得官方指导价直链（规格已可改 50%vol） |
| 3 | 大芹 金牌波本桶 **399 元** | 仅每经「记者线上调查」；厂方官方店/官网价格不可取；且台湾官方经销体系同名牌为 43%vol/700ml，SKU 对应关系未证实 |
| 4 | 青岛 10 年雪莉桶 **380 元** | 仅每经「记者线上调查」；青岛饮料集团官网不可达、官方旗舰店商品价需 JS |
| 5 | 青岛威士忌（10 年雪莉桶）官方规格（容量/酒精度） | 未取得任何官方页面 |
| 6 | 崃州「筹备广东新厂」 | **不予采信/建议删除**：全渠道未见崃州相关佐证；已核实广东新厂属大芹 |
| 7 | 崃州新品「雪莉醇境」359 元（若考虑入库） | 目前仅第三方好价/聚合文（smzdm AI 聚合、小红书），官方旗舰店页面不可取数；规格 40 度/700ml/四种初填雪莉桶亦仅媒体口径 |
| 8 | 崃州 2026-09 电商到手价 355 元（天猫） | 来源为 smzdm 好价（平台到手价，含券/补贴），只能作 note，不能作价格锚点 |

## 未采信 / 被拦截记录（硬性要求）

- `b.guangdiu.com/detail.php?id=28103778`（天猫 菲诺雪莉桶 359 元）：返回**滑块安全验证页**，未采信。
- `guangdiu.com/detail.php?id=25945279`（京东 泥煤波本桶 339 元）：搜索标题可见，页面同样为聚合站，未采信为官方口径。
- 天猫、京东商品页：需登录 / 302 拦截，未采信。
- HKTVmall 崃州泥煤波本 50%abv 商品页：现已 404（返回“没有找到”），仅搜索结果标题可用，**未作为 verified 依据**（50%vol 以 WWA 官方页 + 官方公众号图卡为准）。
- 浏览器自动化整体不可用：`browser_session` 报 `the bsk CLI ("bsk") was not found`，BrowserSkill 未安装在本机 → E2 线无法完成任何 JS 渲染页面（旗舰店价格、有赞商城商品列表、ISC 动态检索）的取数；这部分需由具备浏览器能力的通道补做。
