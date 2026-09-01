# 贡献者发布指南（CONTRIBUTING）

> 上九 · 国威知识库 MCP —— 欢迎任何形式的共建。本文给出**具体路径**：改哪个文件、走哪条管线、用什么命令。

---

## 1. 你能贡献什么 & 改哪（具体路径）

| 类型 | 改动位置 | 路径 |
|---|---|---|
| **新增酒厂 / 产区 / 产品数据** | `src/data.ts` | 在 `REGIONS` / `DISTILLERIES` 数组加条目 |
| **修正 / 补实数据** | `src/data.ts` | 改对应条目（字段、价格、风土） |
| **品鉴笔记** | 数据池 + 复核管线 | `submit_tasting_note`（MCP）→ `data/tasting-input.jsonl` → `scripts/review.mjs` |
| **新增 / 修改业务逻辑** | `src/tools.ts` | 在业务层加函数（纯函数，无 MCP SDK） |
| **新增 / 修改 MCP 工具** | `src/index.ts` | 注册 `server.tool(...)`（薄封装） |
| **内容生成** | `src/tools.ts` 的 `generateContent` | 加渲染格式；或用它产出平台文案 |
| **文档 / 品牌** | `README.md` · `landing.html` · `landing-single.html` · `assets/logo.jpg` | 直接改对应文件 |

---

## 2. 数据贡献规范（重点）

一条酒厂数据的基本结构（参考 `src/data.ts` 现有条目）：

```ts
{
  id: "xxid",              // 唯一小写 id
  name: "酒厂名",
  region: "产区code",       // 见 REGIONS 的 id
  location: "地点",
  owner: "背景（可选）",
  style: "定位标签",
  story: "一句话故事",
  source: "数据来源（链接/报道），必填",
  confidence: "verified | pending | unverified",  // ✅ | 🟡 | ⬜
  process: { cask, malt, maturation },   // 工艺（可选）
  terroir: { climate, water, aging },    // 风土（可选）
  flavor: { dominant: [...], official, community }, // 风味（可选）
  products: [{ name, cask, tier, priceBand, confidence }],
}
```

**四条铁律：**
1. **不编造**：品鉴笔记、价格、工艺，凡无一手来源一律留空标注。
2. **AI 只整理不判断**：风味词标"待聚合"，不作主观结论。
3. **出处可查**：每条带 `source`；数据类 PR 请附来源链接。
4. **待采即待采**：标 `⬜` 的不当事实。

---

## 3. 提交流程（具体命令）

```bash
# 1. Fork → 克隆 → 建分支
git clone https://github.com/1281227309-art/shangjiu.git
cd shangjiu
git checkout -b feat/your-change

# 2. 改数据/代码（见上方"改哪"）

# 3. 本地校验（业务层 + 类型）
node scripts/demo.mjs        # 跑业务层，看 9 工具输出是否正常
npm run typecheck            # tsc --noEmit，必须通过

# 4. 品鉴数据走复核（若有）
node scripts/review.mjs list
node scripts/review.mjs approve <id> <reviewer>   # 真人复核通过才进 curated

# 5. 提交 & 推送 & 提 PR
git add -A
git commit -m "data: 新增 xx 酒厂（附来源）"
git push origin feat/your-change
# → 到 GitHub 提 Pull Request
```

> 数据类 PR 会人工核对 `source` 与 `confidence`；`tsc --noEmit` 不过者合不了。

---

## 4. 发布（Release / GitHub Pages）具体路径

- **版本号**：改 `package.json` 的 `version` + `README.md` 的「路线图」。
- **GitHub Pages 主页**：把 `landing.html`（或 `landing-single.html`）作为仓库主页 / `index.html`；`assets/logo.jpg` 需与 `landing.html` 同目录。
- **npm 发布**（可选，让 AI 宿主 `npx` 拉取）：如需，配置好 npm 账号后 `npm publish`（先 `npm run typecheck`）。
- **MIT License**：`LICENSE`，已生成；改名/改许可请同步 README 的 License 段。

---

## 5. 目录关键路径速查

```
src/data.ts            ← 国威知识库（数据）
src/tools.ts           ← 业务逻辑（纯函数）
src/index.ts           ← MCP 服务器（薄封装）
scripts/review.mjs     ← 品鉴数据复核管线
scripts/demo.mjs       ← 免 npm 演示 / 自测
scripts/host-demo.mjs  ← 真实宿主演示（SDK Client）
landing.html           ← 落地产页（依赖 assets/logo.jpg）
landing-single.html    ← 落地产页（单文件，logo 内嵌）
assets/logo.jpg        ← 品牌 logo
README.md / LICENSE    ← 文档 / 许可
```

---

**提交前自查：** `node scripts/demo.mjs` 跑通 · `npm run typecheck` 过 · 数据带 `source` + `confidence` · 品鉴走 `review.mjs` 复核 · 无机器绝对路径泄漏。
