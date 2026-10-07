#!/usr/bin/env node
/**
 * check-contrast.mjs — WCAG 2.1 对比度回归门禁（GeoRecall 知荐 · AI 助手）
 *
 * 把「颜色可访问性」从主观判断变成可执行断言。
 *
 * 用法：
 *   node tools/check-contrast.mjs                    # 检查内置令牌表
 *   node tools/check-contrast.mjs --from-html x.html # 解析产出物里的 :root 令牌再检查
 *
 * 三类断言：
 *   require    必须达标。不达标 → 退出码 1（可接 CI）
 *   constraint 已知约束：断言「该组合确实不达标」。若它某天达标了，
 *              说明令牌被改动，需要重新评审设计文档 → 也退出码 1
 *   info       仅记录（装饰性元素，SC 1.4.11 不适用），不影响退出码
 *
 * 判定标准（WCAG 2.1）：
 *   正文文本 AA 4.5:1 ｜ 大号文本(≥18.66px粗体 / ≥24px常规) AA 3:1 ｜ 非文本(SC 1.4.11) 3:1
 */

const AA_TEXT = 4.5;
const AA_NONTEXT = 3.0;

/* ---------------- WCAG 数学 ---------------- */

function parseHex(hex) {
  let h = String(hex).trim().replace(/^#/, '');
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  if (h.length === 8) h = h.slice(0, 6);
  if (!/^[0-9a-fA-F]{6}$/.test(h)) throw new Error(`无法解析颜色: ${hex}`);
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
}

function relativeLuminance(hex) {
  const [r, g, b] = parseHex(hex).map((c) =>
    c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  );
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrast(fg, bg) {
  const l1 = relativeLuminance(fg);
  const l2 = relativeLuminance(bg);
  const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (hi + 0.05) / (lo + 0.05);
}

/* ---------------- 设计令牌 ---------------- */

export const TOKENS = {
  /* 品牌蓝 */
  'blue-50': '#EFF5FF',
  'blue-100': '#DCE9FF',
  'blue-200': '#BED6FF',
  'blue-300': '#93BAFF',
  'blue-400': '#6096FF',
  'blue-500': '#3B76F6',
  'blue-600': '#2559E0',
  'blue-700': '#1C46B8',
  'blue-800': '#193A91',
  'blue-900': '#17316F',
  'blue-950': '#0E1F46',

  /* 品牌橙 */
  'orange-50': '#FFF6ED',
  'orange-100': '#FFE8D2',
  'orange-200': '#FFCFA6',
  'orange-300': '#FFAE6E',
  'orange-400': '#FF8836',
  'orange-500': '#F76B0C',
  'orange-600': '#DC5204',
  'orange-700': '#B53E08',
  'orange-800': '#8F330E',

  /* 中性（冷调，与蓝同源） */
  'slate-50': '#F8FAFC',
  'slate-100': '#F1F5F9',
  'slate-200': '#E2E8F0',
  'slate-300': '#CBD5E1',
  'slate-400': '#94A3B8',
  'slate-500': '#64748B',
  'slate-550': '#5A6A80',
  'slate-600': '#475569',
  'slate-700': '#334155',
  'slate-800': '#1E293B',
  'slate-900': '#111A2E',
  'slate-950': '#0B1220',
  'border-strong': '#7E8FA6',
  white: '#FFFFFF',

  /* 状态色 */
  success: '#15803D',
  warning: '#B45309',
  danger: '#C02626',
  'success-soft': '#F0FDF4',
  'warning-soft': '#FFFBEB',
  'danger-soft': '#FEF2F2',

  /* 浅色主题语义层 */
  'bg-page': '#F5F8FD',
  'bg-card': '#FFFFFF',
  'bg-subtle': '#F1F5F9',
  'bg-primary-soft': '#EFF5FF',
  'bg-accent-soft': '#FFF6ED',
  'text-primary': '#111A2E',
  'text-secondary': '#475569',
  'text-muted': '#5A6A80',
  'text-placeholder': '#5A6A80',
  primary: '#2559E0',
  'primary-hover': '#1C46B8',
  accent: '#DC5204',
  'accent-decor': '#F76B0C',
  'accent-text': '#B53E08',
  focus: '#3B76F6',
  border: '#E2E8F0',

  /* 深色主题语义层 */
  'd-bg-page': '#0B1220',
  'd-bg-card': '#111A2E',
  'd-bg-subtle': '#1E293B',
  'd-text-primary': '#E8EEF9',
  'd-text-secondary': '#A9B8D0',
  'd-text-muted': '#A9B8D0',
  'd-primary': '#6096FF',
  'd-accent': '#FFAE6E',
  'd-focus': '#6096FF',
  'd-success': '#4ADE80',
  'd-warning': '#FBBF24',
  'd-danger': '#F87171',
  'd-border': '#2B3956',
};

/* ---------------- 断言清单 ---------------- */
// [前景, 背景, 门槛, 说明, 类别]
const LIGHT = [
  // —— 文本 ——
  ['text-primary', 'bg-card', AA_TEXT, '正文主色 / 卡片', 'require'],
  ['text-primary', 'bg-page', AA_TEXT, '正文主色 / 页面底', 'require'],
  ['text-secondary', 'bg-card', AA_TEXT, '次级正文 / 卡片', 'require'],
  ['text-secondary', 'bg-page', AA_TEXT, '次级正文 / 页面底', 'require'],
  ['text-muted', 'bg-card', AA_TEXT, '辅助文字（时间戳/说明）', 'require'],
  ['text-muted', 'bg-page', AA_TEXT, '辅助文字 / 页面底 ← 已修正项', 'require'],
  ['text-placeholder', 'bg-card', AA_TEXT, '占位符文字 / 卡片 ← 已修正项', 'require'],
  ['primary', 'bg-card', AA_TEXT, '主色链接文字 / 卡片', 'require'],
  ['primary', 'bg-page', AA_TEXT, '主色链接文字 / 页面底', 'require'],
  ['primary-hover', 'bg-card', AA_TEXT, '主色 hover 文字', 'require'],
  ['white', 'primary', AA_TEXT, '主按钮文字 / 主色底', 'require'],
  ['white', 'primary-hover', AA_TEXT, '主按钮文字 / hover 底', 'require'],
  ['primary-hover', 'bg-primary-soft', AA_TEXT, '蓝色标签文字 / 蓝浅底', 'require'],
  ['accent-text', 'bg-card', AA_TEXT, '橙色强调文字 / 卡片', 'require'],
  ['accent-text', 'bg-accent-soft', AA_TEXT, '橙色标签文字 / 橙浅底', 'require'],
  ['slate-950', 'accent-decor', AA_TEXT, '深色字压亮橙底（橙底推荐方案）', 'require'],
  ['slate-950', 'orange-300', AA_TEXT, '深色字压浅橙底', 'require'],
  ['success', 'bg-card', AA_TEXT, '成功态文字', 'require'],
  ['success', 'success-soft', AA_TEXT, '成功态文字 / 浅绿底', 'require'],
  ['warning', 'bg-card', AA_TEXT, '警告态文字', 'require'],
  ['warning', 'warning-soft', AA_TEXT, '警告态文字 / 浅黄底', 'require'],
  ['danger', 'bg-card', AA_TEXT, '错误态文字', 'require'],
  ['danger', 'danger-soft', AA_TEXT, '错误态文字 / 浅红底 ← 已修正项', 'require'],

  // —— 非文本（SC 1.4.11）——
  ['focus', 'bg-card', AA_NONTEXT, '焦点环 / 卡片', 'require'],
  ['focus', 'bg-page', AA_NONTEXT, '焦点环 / 页面底', 'require'],
  ['primary', 'bg-card', AA_NONTEXT, '主按钮底色可辨识度', 'require'],
  ['border-strong', 'bg-card', AA_NONTEXT, '输入框边框 / 卡片 ← 已修正项', 'require'],
  ['border-strong', 'bg-page', AA_NONTEXT, '输入框边框 / 页面底', 'require'],
  ['accent', 'bg-card', AA_NONTEXT, '橙色功能性图形（图标/指示条）', 'require'],

  // —— 已知约束：断言其「不达标」 ——
  ['accent-decor', 'bg-card', AA_TEXT, '橙色500当正文：禁止，仅限大面积装饰', 'constraint'],
  ['white', 'accent-decor', AA_TEXT, '白字压橙色500：禁止组合', 'constraint'],
  ['slate-400', 'bg-card', AA_TEXT, 'slate-400 作占位符：禁止（历史缺陷）', 'constraint'],
  ['slate-400', 'bg-card', AA_NONTEXT, 'slate-400 作输入框边框：禁止（历史缺陷）', 'constraint'],

  // —— 装饰性 ——
  ['border', 'bg-card', AA_NONTEXT, '分隔线（装饰性，豁免）', 'info'],
  ['slate-300', 'bg-card', AA_NONTEXT, '更强分隔线（装饰性，豁免）', 'info'],
];

const DARK = [
  ['d-text-primary', 'd-bg-page', AA_TEXT, '正文主色 / 深色页底', 'require'],
  ['d-text-primary', 'd-bg-card', AA_TEXT, '正文主色 / 深色卡片', 'require'],
  ['d-text-secondary', 'd-bg-page', AA_TEXT, '次级正文 / 深色页底', 'require'],
  ['d-text-secondary', 'd-bg-card', AA_TEXT, '次级正文 / 深色卡片', 'require'],
  ['d-text-secondary', 'd-bg-subtle', AA_TEXT, '次级正文 / 深色浮层', 'require'],
  ['d-primary', 'd-bg-page', AA_TEXT, '主色文字 / 深色页底', 'require'],
  ['d-primary', 'd-bg-card', AA_TEXT, '主色文字 / 深色卡片', 'require'],
  ['d-accent', 'd-bg-page', AA_TEXT, '橙色强调文字 / 深色页底', 'require'],
  ['d-accent', 'd-bg-card', AA_TEXT, '橙色强调文字 / 深色卡片', 'require'],
  ['slate-950', 'd-primary', AA_TEXT, '深色字压浅蓝底（深色主按钮）', 'require'],
  ['slate-950', 'd-accent', AA_TEXT, '深色字压浅橙底（深色橙按钮）', 'require'],
  ['d-success', 'd-bg-card', AA_TEXT, '成功态 / 深色卡片', 'require'],
  ['d-warning', 'd-bg-card', AA_TEXT, '警告态 / 深色卡片', 'require'],
  ['d-danger', 'd-bg-card', AA_TEXT, '错误态 / 深色卡片', 'require'],
  ['d-focus', 'd-bg-page', AA_NONTEXT, '焦点环 / 深色页底', 'require'],
  ['d-border', 'd-bg-card', AA_NONTEXT, '深色边框可见性', 'info'],
];

/* ---------------- 解析 HTML 令牌 ---------------- */

async function tokensFromHtml(file) {
  const fs = await import('node:fs/promises');
  const css = await fs.readFile(file, 'utf8');
  const found = {};
  const re = /(--[A-Za-z0-9-]+)\s*:\s*(#[0-9a-fA-F]{3,8})\s*;/g;
  let m;
  while ((m = re.exec(css))) {
    const key = m[1].replace(/^--/, '');
    if (!(key in found)) found[key] = m[2];
  }
  return found;
}

/* ---------------- 执行 ---------------- */

function run(checks, tokens, title) {
  const rows = [];
  let requireFail = 0;
  let constraintUnexpected = 0;

  for (const [fgKey, bgKey, min, desc, kind] of checks) {
    const fg = tokens[fgKey];
    const bg = tokens[bgKey];
    if (!fg || !bg) {
      rows.push({ desc, kind, missing: !fg ? fgKey : bgKey });
      requireFail++;
      continue;
    }
    const ratio = contrast(fg, bg);
    const passes = ratio + 1e-9 >= min;
    let verdict;
    if (kind === 'require') {
      verdict = passes ? 'PASS' : 'FAIL';
      if (!passes) requireFail++;
    } else if (kind === 'constraint') {
      verdict = passes ? 'REVIEW' : 'ok';
      if (passes) constraintUnexpected++;
    } else {
      verdict = passes ? 'info-ok' : 'info';
    }
    rows.push({ desc, kind, ratio, min, verdict, fg, bg });
  }

  console.log(`\n══ ${title} ══`);
  console.log(
    '  ' + '对比度'.padEnd(10) + '门槛'.padEnd(6) + '判定'.padEnd(9) + '前景 / 背景'.padEnd(24) + '用途'
  );
  console.log('  ' + '─'.repeat(100));
  for (const r of rows) {
    if (r.ratio === undefined) {
      console.log(
        `  ${'—'.padEnd(10)}${'—'.padEnd(6)}${'MISSING'.padEnd(9)}${r.desc}  (缺 ${r.missing})`
      );
      continue;
    }
    console.log(
      `  ${`${r.ratio.toFixed(2)}:1`.padEnd(10)}${String(r.min).padEnd(6)}${r.verdict.padEnd(9)}` +
        `${`${r.fg} / ${r.bg}`.padEnd(24)}${r.desc}`
    );
  }
  return { requireFail, constraintUnexpected };
}

async function main() {
  const args = process.argv.slice(2);
  const i = args.indexOf('--from-html');
  let tokens = TOKENS;
  let label = '内置令牌表（设计稿）';

  if (i !== -1) {
    const p = args[i + 1];
    if (!p) {
      console.error('用法: check-contrast.mjs --from-html <file.html>');
      process.exit(2);
    }
    const parsed = await tokensFromHtml(p);
    tokens = { ...TOKENS, ...parsed };
    label = `产出物实测 → ${p}（解析到 ${Object.keys(parsed).length} 个颜色令牌）`;
  }

  console.log('WCAG 2.1 对比度门禁 · GeoRecall 知荐 AI 助手');
  console.log(`令牌来源: ${label}`);

  const a = run(LIGHT, tokens, '浅色主题｜蓝 + 白 + 橙');
  const b = run(DARK, tokens, '深色主题｜深蓝 + 橙');

  const total = LIGHT.length + DARK.length;
  const fails = a.requireFail + b.requireFail;
  const review = a.constraintUnexpected + b.constraintUnexpected;

  console.log(
    `\n合计断言 ${total} 项 ｜ require 未达标 ${fails} 项 ｜ constraint 需复查 ${review} 项`
  );

  if (fails === 0 && review === 0) {
    console.log('结果：全部通过 ✓');
  } else {
    if (fails) console.log('结果：存在不达标项 ✗');
    if (review) console.log('结果：存在「已知约束被推翻」的项，请重新评审设计文档 ⚠');
  }

  process.exit(fails === 0 && review === 0 ? 0 : 1);
}

// 仅在「被当作脚本直接执行」时跑 main（供其它模块 import 复用 contrast()）
const isMain = await (async () => {
  const { pathToFileURL } = await import('node:url');
  const entry = process.argv[1];
  if (!entry) return false;
  try {
    return import.meta.url === pathToFileURL(entry).href;
  } catch {
    return false;
  }
})();

if (isMain) {
  main().catch((e) => {
    console.error('检查器异常:', e);
    process.exit(2);
  });
}
