/**
 * 上九 · 国威知识库 —— MCP 服务器（薄插件 / stdio）
 *
 * 本文件只做"MCP 协议 <-> 业务逻辑"的薄封装：
 *   真正的查询/检索/品鉴漏斗逻辑在 src/tools.ts（纯函数，无 SDK）。
 *   - 换任何宿主/协议，tools.ts 与 data.ts 不动。
 *   - scripts/demo.mjs 与 scripts/review.mjs 直接复用 tools.ts。
 *
 * 运行：npm run dev   （tsx）
 *       npm run build && npm start
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import {
  listRegions,
  listDistilleries,
  getDistilleryTool,
  getFlavorProfile,
  listProducts,
  searchWhiskyTool,
  submitTastingNote,
  recommendWhisky,
  generateContent,
} from "./tools.ts";

const server = new McpServer({
  name: "上九 · 国威知识库",
  version: "0.2.0",
});

/** 统一返回：MCP text 内容（带 indentation 便于宿主读取） */
const text = (v: unknown) => ({
  content: [{ type: "text" as const, text: JSON.stringify(v, null, 2) }],
});

/* ---------------------------- 工具注册 ---------------------------- */

server.tool("list_regions", "列出中国威士忌主要产区萌芽体系", {}, async () =>
  text(listRegions()),
);

server.tool(
  "list_distilleries",
  "列出国产威士忌酒厂，可按产区过滤（region 用产业区 code）",
  { region: z.string().optional().describe("产业区 code，如 qionglai") },
  async ({ region }) => text(listDistilleries(region)),
);

server.tool(
  "get_distillery",
  "查某家国产威士忌酒厂的完整档案（产区/工艺/风土/产品/可信度）",
  { id: z.string().describe("酒厂 id，如 daqin / laizhou") },
  async ({ id }) => text(getDistilleryTool(id)),
);

server.tool(
  "get_flavor_profile",
  "查某家酒厂的风味图谱（主导风味词 + 官方/社区来源），含待采集诚实标注",
  { distilleryId: z.string().describe("酒厂 id") },
  async ({ distilleryId }) => text(getFlavorProfile(distilleryId)),
);

server.tool(
  "list_products",
  "查某家酒厂的产品线与价格带",
  { distilleryId: z.string().describe("酒厂 id") },
  async ({ distilleryId }) => text(listProducts(distilleryId)),
);

server.tool(
  "search_whisky",
  "在国威知识库中检索（匹配酒厂名/产区/风格/主导风味词/故事）",
  { query: z.string().describe("检索词") },
  async ({ query }) => text(searchWhiskyTool(query)),
);

server.tool(
  "submit_tasting_note",
  "提交一条品鉴笔记（数据漏斗）。仅采信真人来源；AI 不据此给任何权威结论。",
  {
    distilleryId: z.string().describe("酒厂 id"),
    product: z.string().optional().describe("产品名"),
    score: z.number().min(0).max(100).optional().describe("个人评分 0-100"),
    nose: z.string().optional().describe("闻香"),
    palate: z.string().optional().describe("口感"),
    finish: z.string().optional().describe("余韵"),
    taster: z.string().optional().describe("品鉴者/来源"),
    source: z.string().optional().describe("来源：盲品会/社群/个人"),
  },
  async (args) => text(await submitTastingNote(args)),
);

server.tool(
  "recommend_whisky",
  "选酒导购：按预算+口味+场景，从国威知识库推荐酒款（含可信度与诚实声明）",
  {
    budget: z.string().optional().describe("价格偏好，如 '100-300'、'口粮'、'高端'、'500 以内'"),
    taste: z.string().optional().describe("风味偏好，如 '果香'、'茶韵'、'甜'、'烟熏'、'清爽'"),
    occasion: z.string().optional().describe("场景，如 '日常口粮'、'送礼'、'品鉴/尝东方特色'"),
  },
  async (args) => text(recommendWhisky(args)),
);

server.tool(
  "generate_content",
  "内容生成：从国威知识库取真实数据，按格式生成内容骨架（选题/长文/小红书/短视频口播），待核实项会标出",
  {
    topic: z.string().describe("主题，如 '东方风味国产威士忌'"),
    format: z.enum(["长文", "小红书", "短视频", "选题"]).describe("输出格式"),
    focus: z.string().optional().describe("可选：酒厂/产区/风味关键词"),
  },
  async (args) => text(generateContent(args)),
);

/* ---------------------------- 启动 ---------------------------- */

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  // MCP 走 stdio，日志一律打到 stderr（避免污染协议通道）
  console.error("上九 · 国威知识库 MCP 服务器已启动 (v0.2.0, stdio)");
}

main().catch((err) => {
  console.error("上九·国威知识库 MCP 启动失败：", err);
  process.exit(1);
});
