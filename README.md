<p align="center"><img src="assets/logo.jpg" width="120" alt="上九 · Shangjiu" /></p>

# 上九 · Shangjiu ｜ 国威知识库 MCP

> **让世界喝懂中国威士忌的开源 AI 插件**

**国威品鉴 · 选酒导购 · 产区图谱 · 内容生成 ｜ 面向国产威士忌的 MCP 工具**

<p align="center">
  <img alt="GitHub stars" src="https://img.shields.io/github/stars/1281227309-art/shangjiu?style=flat-square&logo=github" />
  <img alt="GitHub forks" src="https://img.shields.io/github/forks/1281227309-art/shangjiu?style=flat-square&logo=github" />
  <img alt="License" src="https://img.shields.io/github/license/1281227309-art/shangjiu?style=flat-square" />
  <img alt="npm version" src="https://img.shields.io/npm/v/shangjiu-guowei-knowledge-mcp?style=flat-square&logo=npm" />
  <img alt="GitHub Pages" src="https://img.shields.io/badge/live-在线-2ea44f?style=flat-square" />
</p>

## 🌏 在线体验

> **<https://1281227309-art.github.io/shangjiu/>** —— 一眼看懂「上九 · 国威知识库」是什么、能做什么，以及如何接入你的 AI 宿主。

<!-- Glama 元数据：以下信息供自动化索引（mcp / knowledge-base / license / homepage / code） -->
<table>
  <tr>
    <td><b>类型</b></td>
    <td>MCP Server（stdio · Node.js）</td>
    <td><b>License</b></td>
    <td>MIT</td>
  </tr>
  <tr>
    <td><b>领域</b></td>
    <td>中国威士忌 · 知识库</td>
    <td><b>落地页</b></td>
    <td><a href="https://1281227309-art.github.io/shangjiu/">1281227309-art.github.io/shangjiu</a></td>
  </tr>
  <tr>
    <td><b>关键词</b></td>
    <td colspan="3">`mcp` · `chinese-whisky` · `knowledge-base` · `data-funnel` · `选酒导购` · `品鉴`</td>
  </tr>
</table>

<p align="center">
  <a href="https://github.com/1281227309-art/shangjiu">⭐ GitHub</a> ·
  <a href="https://github.com/1281227309-art/shangjiu#readme">README</a> ·
  <a href="./LICENSE">License</a> ·
  <a href="https://github.com/1281227309-art/shangjiu/fork">Fork</a> ·
  <a href="https://1281227309-art.github.io/shangjiu/">🌏 在线落地页</a> ·
  <a href="./china_whisky_map.html">🗺️ 产区图谱</a>
</p>

---

## 这是什么

「上九蒸馏所」做的一件小事：把**中国威士忌**讲清楚，并让 AI 能讲真话。

它是**国威知识中枢对外的蒸馏出口 + 品鉴数据漏斗**。国威缺的不是酒，是一套"人人能读、人人能引用、经得起核查"的讲法。所以我们做了一个——

- **薄插件**：走标准 **MCP 协议**，接入任意 AI 宿主即用（Trae / Cursor / Claude Desktop…），不做独立 App。
- **诚实数据**：每个字段带可信度标注（✅已核实 / 🟡待厂方确认 / ⬜待采集），**不编造品鉴笔记与价格**。
- **数据漏斗**：`submit_tasting_note` 采集真人品鉴（AI 不判断），经复核后才可能进知识库——这是护城河的原材料。

> 一句话：这个工具的意义不是"更聪明的 AI"，而是**让 AI 在讲中国威士忌时，说的都是真话**。

---

## 功能亮点（四个标签）

| 标签 | 对应工具 | 价值 |
|---|---|---|
| **国威品鉴** | `get_flavor_profile` / `get_distillery` | 查酒厂档案、风味图谱，带可信度 |
| **选酒导购** | `recommend_whisky` / `list_products` | 预算+口味+场景 → 打分推荐 |
| **产区图谱** | `list_regions` / `search_whisky` | 产区萌芽体系 + 全库检索 |
| **内容生成** | `generate_content` / `submit_tasting_note` | 生成内容骨架（选题/长文/小红书/短视频）+ 采集真人品鉴 |

---

## 快速开始

需要 **Node ≥ 22**（可原生剥离类型直接跑 `.ts`，无需构建）。

```bash
cd 上九国威知识库-mcp
npm install          # 或 pnpm install（本项目含 pnpm-lock.yaml）

npm start            # 启动 MCP 服务器（Node 原生直跑 src/index.ts）
npm run dev          # --watch 开发模式

# 免 npm 也能直接用（纯业务层，不依赖 MCP SDK）：
npm run demo         # 演示全部工具输出（含品鉴漏斗落盘）
npm run review       # 品鉴数据复核管线
```

服务器走 **stdio**，启动后无界面，等 MCP 宿主调用。日志输出到 stderr，不污染协议通道。

> 结构：`src/data.ts`（知识数据）与 `src/tools.ts`（业务逻辑）均为**无依赖纯模块**，可脱离 MCP 单独复用——即"知识资产独立于协议"。`src/index.ts` 只做 MCP 薄封装。

---

## MCP 宿主配置

### 通用 stdio 配置（任何支持 MCP 的客户端）

```json
{
  "mcpServers": {
    "shangjiu-guowei": {
      "command": "node",
      "args": ["<项目绝对路径>/src/index.ts"]
    }
  }
}
```

> 若在某些宿主里"裸 `node` 找不到或路径出问题"，用项目自带的启动脚本：把 `command` 换成 `<项目绝对路径>/run-mcp.sh`，`args` 留空。

### Trae（推荐，国内可直接用）

Trae → 设置 → MCP → 添加，填：类型 `stdio`、命令 `<项目绝对路径>/run-mcp.sh`（或 node + src/index.ts）、参数留空。Trae 的模型支持工具调用，能真正调用本插件。

### Cursor

`~/.cursor/mcp.json`（或项目 `.mcp.json`）：

```json
{
  "mcpServers": {
    "shangjiu-guowei": {
      "command": "<项目绝对路径>/run-mcp.sh",
      "args": []
    }
  }
}
```

### Claude Desktop（一键接入）

```bash
bash scripts/install-claude-config.sh
```

脚本会把 `mcpServers.shangjiu-guowei` 合并进 `~/Library/Application Support/Claude/claude_desktop_config.json` 并填入项目绝对路径，之后**完全退出并重启 Claude Desktop** 即可调用。

---

## 对话示例

> 下面是无 GUI 的 stdio 管道验证命令（等价于宿主内部的调用序列）。

```bash
cat data/host-scenario.jsonl | node src/index.ts
```

真实宿主里的提问 → 工具调用效果：

| 你的提问 | 工具被调用 |
|---|---|
| "查一下国产威士忌有哪些东方风味的厂" | `search_whisky("东方")` |
| "帮我挑一支 200 元内、果香、日常喝的国产威士忌" | `recommend_whisky(budget:200, taste:果香, occasion:日常口粮)` |
| "写一篇**东方风味**主题的小红书" | `generate_content(topic:东方风味, format:小红书)` |
| "我喝了大芹双桶，记一条品鉴：果香浓郁、余韵悠长、90 分" | `submit_tasting_note(...)` → 落盘 `pending_review` |

**已验证的返回效果**（Trae 实测）：模型会先调用工具、返回知识库的真实数据，并诚实标注——
> "数据来源：上九国威知识库 …价格带整体处于待采集状态，知识库目前的行业锚点是——崃州主力 100–400 元（口粮档）、叠川 888 元（高端锚点）。"

---

## MCP 工具列表（9 个）

| 工具 | 作用 |
|---|---|
| `list_regions` | 中国威士忌产区萌芽体系（邛崃/峨眉山/千岛湖/大理/滇西/胶东/亳州/青藏/大湾区） |
| `list_distilleries` | 酒厂列表（可按产区 code 过滤） |
| `get_distillery` | 酒厂完整档案（产区/工艺/风土/产品/可信度） |
| `get_flavor_profile` | 风味图谱（主导词 + 官方/社区来源） |
| `list_products` | 产品线与价格带（含行业价格锚点） |
| `search_whisky` | 全库检索（酒厂名/产区/风格/风味词/故事） |
| `recommend_whisky` | **选酒导购**：预算+口味+场景 → 打分推荐（含可信度与诚实声明） |
| `generate_content` | **内容生成**：选题/长文/小红书/短视频骨架（基于知识库真实信息 + 待核标注） |
| `submit_tasting_note` | **品鉴笔记漏斗**：采集真人数据，写入 `data/tasting-input.jsonl` |

---

## 数据层（社区共建）

知识库的数据模型：`产区(Region) → 酒厂(Distillery) → 产品(Product)`，每个字段带 `source`（来源）与 `confidence`（可信度）。

**可信度三档**：`✅ verified 已核实` / `🟡 pending 待厂方确认` / `⬜ unverified 待采集`。

### 共建机制（真实数据 → 才进知识库）

```
真人品鉴 / 厂方一手信息
        │  submit_tasting_note（AI 只收集，不判断）
        ▼
   品鉴数据池  data/tasting-input.jsonl   （状态: pending_review）
        │  scripts/review.mjs：list / approve / reject / report
        ▼
   curated  data/tasting-approved.json    （真人复核通过）
        │  人工判断
        ▼
   进入知识库  src/data.ts                 （带 source + confidence）
```

**社区怎样共建：**
1. **提交品鉴**：在宿主里调 `submit_tasting_note`，或直接用 `node scripts/review.mjs` 走复核。
2. **补充/更正数据**：给 `src/data.ts` 提 PR —— 新增酒厂/产区/产品、补核实价格、更正错误。**每条必须带来源**，`confidence` 如实标注。
3. **厂方共建**：面向新国威小厂——我们帮它们"把'你是谁'定义成标准 + 给声量"，换回它们的**一手数据与内容授权**（见策略定位）。

### 诚实守则（社区必须遵守）
- **不编造**：品鉴笔记、价格、工艺细节，凡无一手来源一律留空标注。
- **AI 只整理不判断**：AI 做归并、可视化、追踪；不做主观品鉴结论。
- **出处可查**：每个字段带 `source` 与 `confidence`。
- **待采即待采**：标注 `⬜ 待采集` 的，不等厂方确认不作结论。

---

## 贡献 (Contributing)

> **完整发布指南见 [`CONTRIBUTING.md`](./CONTRIBUTING.md)**（含改哪个文件、走哪条管线、具体命令与数据规范）。

欢迎一切形式的共建：

| 贡献类型 | 怎么做 |
|---|---|
| **数据** | 给 `src/data.ts` 提 PR（酒厂/产区/产品/价格，带 `source` + `confidence`） |
| **品鉴** | 调用 `submit_tasting_note` 提交；走 `scripts/review.mjs` 复核 |
| **代码** | 改进 `src/tools.ts` / `src/index.ts`，提 PR |
| **内容** | 用 `generate_content` 生成平台内容，可回传修正 |
| **bug / 建议** | 开 Issue，说明复现步骤 |

**流程建议**：Fork → 修改 → 提 PR；数据类 PR 请附来源链接，并如实标 `confidence`。我们会用 `scripts/review.mjs` 对品鉴数据做复核；`tsc --noEmit` 通过后方可合入。

---

## 项目结构

```
上九国威知识库-mcp/
├── package.json
├── tsconfig.json
├── .gitignore
├── LICENSE
├── README.md
├── CONTRIBUTING.md               # 贡献者发布指南（具体路径/命令/规范）
├── run-mcp.sh                      # 一键启动脚本（规避命令路径问题）
├── claude_desktop_config.example.json
├── src/
│   ├── data.ts        # 国威知识库（纯数据 + 类型，无外部依赖）
│   ├── tools.ts       # 业务逻辑层（纯函数，无 MCP SDK）
│   └── index.ts       # MCP 服务器（薄封装，stdio）
├── scripts/
│   ├── demo.mjs        # 免 npm 演示所有工具
│   ├── review.mjs      # 品鉴数据复核管线
│   ├── host-demo.mjs   # 真实宿主演示（官方 SDK Client）
│   ├── install-claude-config.sh  # 一键接入 Claude Desktop
│   └── mcp-probe.mjs   # 端到端协议探针（标准机器）
└── data/
    ├── host-scenario.jsonl   # 管道演示会话
    └── probe-requests.jsonl  # 探针会话
```

---

## 路线图

- **v0.1**：骨架 + 可信度标注；品鉴漏斗本地落盘。
- **v0.2**：品鉴数据**复核管线**（真人复核→才进知识库）；业务层抽成 `tools.ts`；免 npm 演示。
- **v0.3**：真实接入 —— Claude Desktop 一键配置、SDK 宿主演示、管道演示。
- **v0.4（当前）**：**选酒导购** `recommend_whisky`；**内容生成** `generate_content`；扩充产区/酒厂档案（滇西茶威、胶东、亳州草本、西藏青稞等）。
- **v0.5**：盲品会数据接入；面向小厂的"品牌定制风味库"接口；内容生成流程产品化。
- **v0.6**：社区共建引擎（贡献者激励 / 数据审核面板）；跨语言 SDK。

---

## License

MIT —— 见 [LICENSE](./LICENSE)。欢迎自由使用、修改、再分发；引用数据时请保持出处标注。
