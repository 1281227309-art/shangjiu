/**
 * 上九 · 国威知识库 —— 免 npm 本机演示 / 自测脚本
 *
 * 直接复用 src/tools.ts（纯业务层，无 MCP SDK 依赖），无需 npm install。
 * 运行：node scripts/demo.mjs
 *
 * 会顺带调用 submit_tasting_note，演示"品鉴数据漏斗"，并写入 data/tasting-input.jsonl。
 */

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
} from "../src/tools.ts";

const show = (label, obj) => {
  console.log(`\n===== ${label} =====`);
  console.log(JSON.stringify(obj, null, 2));
};

show("list_regions", listRegions());
show("list_distilleries（无过滤）", listDistilleries());
show("list_distilleries（region=guangdong）", listDistilleries("guangdong"));
show("get_distillery（daqin）", getDistilleryTool("daqin"));
show("get_flavor_profile（daqin）", getFlavorProfile("daqin"));
show("list_products（daqin）", listProducts("daqin"));
show("search_whisky（波本）", searchWhiskyTool("波本"));

// 品鉴数据漏斗演示（写入本地，状态 pending_review 待复核）
const noteRes = await submitTastingNote({
  distilleryId: "daqin",
  product: "双桶",
  score: 85,
  nose: "果香、花香、微甜",
  palate: "波本甜感、层次顺滑",
  finish: "中等偏长",
  taster: "演示-测试品鉴者",
  source: "demo-mocks",
});
show("submit_tasting_note（漏斗）", noteRes);

// 选酒导购（预算+口味+场景 → 推荐）
show("recommend_whisky（200元·果香·日常口粮）", recommendWhisky({ budget: "200", taste: "果香", occasion: "日常口粮" }));
show("recommend_whisky（高端·茶·送礼）", recommendWhisky({ budget: "高端", taste: "茶", occasion: "送礼" }));

// 内容生成（主题+格式 → 骨架）
show("generate_content（小红书·东方风味）", generateContent({ topic: "东方风味国产威士忌", format: "小红书", focus: "茶" }));
show("generate_content（短视频口播·国产威士忌）", generateContent({ topic: "国产威士忌", format: "短视频" }));

console.log("\n✓ 演示完成。品鉴笔记已写入 data/tasting-input.jsonl（待复核）。");
console.log("  下一步：node scripts/review.mjs list  查看待审记录。");
