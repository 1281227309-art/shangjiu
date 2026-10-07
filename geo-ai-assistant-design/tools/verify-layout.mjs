#!/usr/bin/env node
/**
 * verify-layout.mjs — 几何/响应式/渲染后对比度审计
 *
 * 为什么需要它：截图能看出「好不好看」，但看不出「在 320px 下有没有横向溢出」、
 * 「某个 muted 文字落在浅橙卡片上之后对比度掉到 3.8」这类问题。
 * 这里用真实渲染后的几何与计算样式做断言。
 *
 * 检查项：
 *   1. 10 个视口下均无横向溢出、无元素越界、无文字被裁切
 *   2. 断点行为符合设计（3 栏 / 2 栏 / 单栏 + 抽屉）
 *   3. 渲染后「有效对比度」审计 —— 沿着祖先链求真实背景色，
 *      而不是只信令牌表（能抓出「令牌没错、但用错了地方」）
 *   4. 触控目标尺寸
 *
 * 用法：node tools/verify-layout.mjs [--url http://127.0.0.1:8000/geo-ai-assistant.html]
 */

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(root, 'geo-ai-assistant.html');
const SHOTS = path.join(root, 'preview');
const argIdx = process.argv.indexOf('--url');
const URL_TO_TEST = argIdx !== -1 ? process.argv[argIdx + 1] : 'file://' + OUT;

const results = [];
function check(name, pass, detail) {
  results.push({ name, pass, detail });
  console.log(`  ${pass ? '✓' : '✗'} ${name}${detail ? ' — ' + detail : ''}`);
}

/* 在页面里注入的审计函数（返回结构化数据，判定放在 Node 侧） */
const AUDIT = `() => {
  /* —— 有效背景色：向上找第一个不透明背景 —— */
  function effectiveBg(el) {
    let node = el;
    while (node && node !== document.documentElement.parentNode) {
      const cs = getComputedStyle(node);
      if (cs.backgroundImage && cs.backgroundImage !== 'none') return { bg: null, reason: 'gradient' };
      const bg = cs.backgroundColor;
      const m = bg.match(/rgba?\\(([^)]+)\\)/);
      if (m) {
        const parts = m[1].split(',').map(s => parseFloat(s));
        const a = parts.length === 4 ? parts[3] : 1;
        if (a >= 0.999) return { bg: '#' + parts.slice(0,3).map(v =>
          Math.round(v).toString(16).padStart(2,'0')).join(''), reason: 'opaque' };
      }
      node = node.parentElement;
    }
    return { bg: '#FFFFFF', reason: 'root' };
  }

  function lum(hex) {
    const h = hex.replace('#','');
    const [r,g,b] = [0,2,4].map(i => parseInt(h.slice(i,i+2),16)/255)
      .map(c => c <= 0.04045 ? c/12.92 : Math.pow((c+0.055)/1.055,2.4));
    return 0.2126*r + 0.7152*g + 0.0722*b;
  }
  function ratio(fg, bg) {
    const a = lum(fg), b = lum(bg);
    const [hi, lo] = a > b ? [a,b] : [b,a];
    return (hi + 0.05) / (lo + 0.05);
  }

  /* —— 1. 横向溢出 / 越界 —— */
  const vw = window.innerWidth;
  const overflowers = [];
  document.querySelectorAll('body *').forEach(el => {
    const cs = getComputedStyle(el);
    if (cs.position === 'fixed' && cs.visibility === 'hidden') return; // 抽屉关闭态
    if (cs.display === 'none') return;
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return;
    // 允许「本身就是横向滚动容器」的子元素越界
    if (el.closest('.suggest, .insights, .rail__scroll, .snapshot')) return;
    if (r.right > vw + 1) {
      overflowers.push({
        sel: el.tagName.toLowerCase() + '.' + String(el.className || '').split(' ').slice(0,2).join('.'),
        right: Math.round(r.right)
      });
    }
  });

  /* —— 2. 文字被裁切（scrollWidth 明显大于 clientWidth 且不是有意滚动） —— */
  const clipped = [];
  document.querySelectorAll('p, span, h1, h2, h3, li, div, kbd, b, strong, small, time').forEach(el => {
    if (!el.textContent.trim()) return;
    // 屏幕阅读器专用文本用的就是「裁切」手法，属于有意为之
    if (el.closest('.sr-only')) return;
    const cs = getComputedStyle(el);
    const scrollable = /auto|scroll/.test(cs.overflowX);
    const ellipsis = cs.textOverflow === 'ellipsis';
    if (scrollable || ellipsis) return;
    if (el.children.length > 0) return;             // 只看叶子文本节点
    if (el.scrollWidth > el.clientWidth + 2) {
      clipped.push({
        text: el.textContent.trim().slice(0, 24),
        scrollW: el.scrollWidth, clientW: el.clientWidth
      });
    }
  });

  /* —— 3. 布局模式 —— */
  const shell = document.querySelector('.shell');
  const shellCs = getComputedStyle(shell);
  const rail = document.querySelector('#rail');
  const railCs = getComputedStyle(rail);
  const insights = document.querySelector('.insights');
  const insightsBody = document.querySelector('#insightsBody');
  const insightsBodyCs = getComputedStyle(insightsBody);
  const insightsToggle = document.querySelector('#insightsToggle');
  const insightsToggleCs = getComputedStyle(insightsToggle);
  const topbar = document.querySelector('.topbar').getBoundingClientRect();
  const composer = document.querySelector('.composer').getBoundingClientRect();
  const logRect = document.querySelector('#chat-log').getBoundingClientRect();

  /* —— 4. 有效对比度审计 —— */
  const contrastRows = [];
  const seen = new Set();
  document.querySelectorAll('.bubble__lead, .bubble__body p, .bullets li, .msg__who, .msg__who strong, .time, .metric__name, .metric__val, .metric__hint, .card__title, .card__more, .session__title, .session__meta, .thread__title, .thread__meta, .rail__group-title, .composer__hint, .metrics-badge, .scope__label, .engine, .engine__state, .cite, .kv__item, .snapshot__body, .todo__title, .todo__desc, .score__note, .score__num span, .brand__name, .brand__sub, .suggest__chip, .act, .rank__name, .rank__pct')
    .forEach(el => {
      const txt = el.textContent.trim();
      if (!txt) return;
      const cs = getComputedStyle(el);
      if (cs.visibility === 'hidden' || cs.display === 'none') return;
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return;
      const eb = effectiveBg(el);
      if (!eb.bg) return; // 渐变/图片背景，无法可靠计算
      const fgMatch = cs.color.match(/rgba?\\(([^)]+)\\)/);
      if (!fgMatch) return;
      const p = fgMatch[1].split(',').map(Number);
      const fg = '#' + p.slice(0,3).map(v => Math.round(v).toString(16).padStart(2,'0')).join('');
      const size = parseFloat(cs.fontSize);
      const weight = parseInt(cs.fontWeight, 10) || 400;
      const large = size >= 24 || (size >= 18.66 && weight >= 700);
      const need = large ? 3.0 : 4.5;
      const cr = ratio(fg, eb.bg);
      const key = el.className + '|' + fg + '|' + eb.bg + '|' + Math.round(size);
      if (seen.has(key)) return;
      seen.add(key);
      contrastRows.push({
        sel: String(el.className || el.tagName).split(' ')[0],
        sample: txt.slice(0, 16),
        fg, bg: eb.bg, size: Math.round(size), weight, large, need,
        ratio: Math.round(cr * 100) / 100,
        pass: cr + 1e-9 >= need
      });
    });

  /* —— 5. 触控目标（只针对「可交互」元素；WCAG 2.5.8 不适用于 progressbar 这类非交互元素） —— */
  const tiny = [];
  document.querySelectorAll('button, a[href], textarea, input, select, [tabindex]:not([tabindex="-1"])').forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return;
    if (r.height < 24 || r.width < 24) {
      tiny.push({ sel: String(el.className || el.tagName).split(' ')[0],
        w: Math.round(r.width), h: Math.round(r.height) });
    }
  });
  const controls = [];
  document.querySelectorAll('button, a[href]').forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return;
    controls.push(Math.round(r.height));
  });

  return {
    vw,
    docScrollW: document.documentElement.scrollWidth,
    overflowers: overflowers.slice(0, 6),
    overflowCount: overflowers.length,
    clipped: clipped.slice(0, 6),
    clippedCount: clipped.length,
    gridCols: shellCs.gridTemplateColumns.split(' ').length,
    gridAreas: shellCs.gridTemplateAreas,
    railVisibility: railCs.visibility,
    railPosition: railCs.position,
    insightsDirection: insightsBodyCs.flexDirection,
    insightsHidden: insightsBody.hidden,
    insightsToggleVisible: insightsToggleCs.display !== 'none',
    insightsExpanded: insightsToggle.getAttribute('aria-expanded'),
    topbarTop: Math.round(topbar.top), topbarH: Math.round(topbar.height),
    composerBottom: Math.round(composer.bottom), composerH: Math.round(composer.height),
    logBottom: Math.round(logRect.bottom),
    innerH: window.innerHeight,
    contrastRows,
    tiny, tinyCount: tiny.length,
    minControlH: controls.length ? Math.min(...controls) : null,
    controlCount: controls.length
  };
}`;

const VIEWPORTS = [
  { w: 1920, h: 1080, label: '1920 桌面', expect: 'three' },
  { w: 1440, h: 900, label: '1440 桌面', expect: 'three' },
  { w: 1280, h: 800, label: '1280 桌面', expect: 'three' },
  { w: 1200, h: 900, label: '1200 断点', expect: 'three' },
  { w: 1199, h: 900, label: '1199 断点', expect: 'two' },
  { w: 1024, h: 768, label: '1024 平板', expect: 'two' },
  { w: 900, h: 900, label: '900 断点', expect: 'two' },
  { w: 899, h: 900, label: '899 断点', expect: 'one' },
  { w: 768, h: 1024, label: '768 平板竖', expect: 'one' },
  { w: 414, h: 896, label: '414 手机', expect: 'one' },
  { w: 375, h: 812, label: '375 手机', expect: 'one' },
  { w: 320, h: 700, label: '320 极窄', expect: 'one' },
];

async function main() {
  await mkdir(SHOTS, { recursive: true });
  const browser = await chromium.launch();
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });

  await page.goto(URL_TO_TEST, { waitUntil: 'load' });
  await page.waitForTimeout(500);

  let allContrast = [];

  for (const vp of VIEWPORTS) {
    console.log(`\n── ${vp.label} (${vp.w}×${vp.h}) ──`);
    await page.setViewportSize({ width: vp.w, height: vp.h });
    await page.waitForTimeout(320);
    const a = await page.evaluate(new Function('return (' + AUDIT + ')()'));

    check('无横向溢出', a.docScrollW <= a.vw + 1, `scrollWidth=${a.docScrollW} viewport=${a.vw}`);
    check('无元素越出右边界', a.overflowCount === 0,
      a.overflowCount ? JSON.stringify(a.overflowers) : '全部在界内');
    check('无文字被裁切', a.clippedCount === 0,
      a.clippedCount ? JSON.stringify(a.clipped) : '无裁切');

    const want = vp.expect === 'three' ? 3 : vp.expect === 'two' ? 2 : 1;
    check(`栅格列数 = ${want}`, a.gridCols === want, `实际 ${a.gridCols}`);

    if (vp.expect === 'three') {
      check('会话栏为常驻栏（非抽屉）', a.railPosition === 'static' && a.railVisibility === 'visible',
        `${a.railPosition}/${a.railVisibility}`);
    } else {
      check('会话栏收为抽屉', a.railPosition === 'fixed', a.railPosition);
    }
    if (vp.expect === 'one') {
      check('诊断面板转为横向卡片条', a.insightsDirection === 'row', a.insightsDirection);
      check('移动端默认收起且开关可见', a.insightsHidden === true && a.insightsToggleVisible === true,
        `hidden=${a.insightsHidden} toggle=${a.insightsToggleVisible}`);
    } else {
      check('桌面/平板端诊断面板常驻展开',
        a.insightsHidden === false && a.insightsToggleVisible === false,
        `hidden=${a.insightsHidden} toggle=${a.insightsToggleVisible}`);
    }

    check('顶栏贴顶且不重叠', a.topbarTop === 0 && a.topbarH >= 40, `${a.topbarTop}/${a.topbarH}`);
    check('输入区在视口内可见', a.composerBottom <= a.innerH + 1 && a.composerH >= 80,
      `bottom=${a.composerBottom} vh=${a.innerH} h=${a.composerH}`);
    check('对话区与输入区不重叠', a.logBottom <= a.composerBottom - 60 + 1,
      `log.bottom=${a.logBottom} composer.bottom=${a.composerBottom}`);

    check('无过小触控目标（≥24px）', a.tinyCount === 0,
      a.tinyCount ? JSON.stringify(a.tiny) : `${a.controlCount} 个控件，最小高 ${a.minControlH}px`);

    const bad = a.contrastRows.filter((r) => !r.pass);
    check(`渲染后有效对比度全部达标（${a.contrastRows.length} 处文本）`, bad.length === 0,
      bad.length ? bad.map((r) => `${r.sel} ${r.ratio}:1(需${r.need})`).join(' · ')
                 : `最低 ${Math.min(...a.contrastRows.map((r) => r.ratio)).toFixed(2)}:1`);

    if (vp.expect === 'three') allContrast = a.contrastRows;
  }

  console.log('\n[移动端诊断面板折叠 / 展开]');
  for (const [w, h] of [[375, 812], [320, 700]]) {
    await page.setViewportSize({ width: w, height: h });
    await page.waitForTimeout(340);
    const collapsed = await page.evaluate(() => {
      const composer = document.querySelector('.composer').getBoundingClientRect();
      const body = document.querySelector('#insightsBody');
      const sum = document.querySelector('#summaryScore');
      return {
        hidden: body.hidden,
        expanded: document.querySelector('#insightsToggle').getAttribute('aria-expanded'),
        summaryScore: sum ? sum.textContent.trim() : null,
        composerBottom: Math.round(composer.bottom),
        vh: window.innerHeight,
        scrollW: document.documentElement.scrollWidth,
        vw: window.innerWidth
      };
    });
    check(`${w}px 收起态：面板隐藏、摘要可见、输入区在视口内`,
      collapsed.hidden === true && collapsed.expanded === 'false' &&
      collapsed.summaryScore === '65' && collapsed.composerBottom <= collapsed.vh + 1 &&
      collapsed.scrollW <= collapsed.vw + 1,
      JSON.stringify(collapsed));

    await page.click('#insightsToggle');
    await page.waitForTimeout(420);
    const expanded = await page.evaluate(() => {
      const composer = document.querySelector('.composer').getBoundingClientRect();
      const body = document.querySelector('#insightsBody');
      const cs = getComputedStyle(body);
      const cards = [...body.querySelectorAll('.card')].map((c) => {
        const r = c.getBoundingClientRect();
        return { w: Math.round(r.width), h: Math.round(r.height) };
      });
      return {
        hidden: body.hidden,
        expanded: document.querySelector('#insightsToggle').getAttribute('aria-expanded'),
        direction: cs.flexDirection,
        overflowX: cs.overflowX,
        cards: cards.length,
        cardWidth: cards[0] ? cards[0].w : 0,
        composerBottom: Math.round(composer.bottom),
        vh: window.innerHeight,
        scrollW: document.documentElement.scrollWidth,
        vw: window.innerWidth,
        // 展开后卡片条不得把输入区顶出视口
        stripBottom: Math.round(body.getBoundingClientRect().bottom)
      };
    });
    check(`${w}px 展开态：面板显示为横向卡片条`,
      expanded.hidden === false && expanded.expanded === 'true' &&
      expanded.direction === 'row' && expanded.cards === 4,
      JSON.stringify({ dir: expanded.direction, cards: expanded.cards, cardW: expanded.cardWidth }));
    check(`${w}px 展开态：输入区仍完全可见、无横向溢出`,
      expanded.composerBottom <= expanded.vh + 1 && expanded.scrollW <= expanded.vw + 1,
      `composer.bottom=${expanded.composerBottom} vh=${expanded.vh} strip.bottom=${expanded.stripBottom}`);

    if (w === 375) await page.screenshot({ path: path.join(SHOTS, 'mobile-insights-expanded.png') });

    // 收起，恢复后续检查所需的默认态
    await page.click('#insightsToggle');
    await page.waitForTimeout(300);
  }

  console.log('\n[打印版式（诊断报告）]');
  // 关键场景：在移动端把诊断面板「收起」后再打印 —— 报告不能因此丢掉结论数据
  await page.setViewportSize({ width: 375, height: 812 });
  await page.waitForTimeout(300);
  const collapsedBefore = await page.evaluate(() => document.querySelector('#insightsBody').hidden);
  await page.emulateMedia({ media: 'print' });
  await page.waitForTimeout(400);
  const printState = await page.evaluate(() => {
    const vis = (sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const cs = getComputedStyle(el);
      return cs.display !== 'none' && cs.visibility !== 'hidden';
    };
    const body = document.querySelector('#insightsBody');
    const cards = [...document.querySelectorAll('#insightsBody > .card')]
      .filter((c) => getComputedStyle(c).display !== 'none' && c.getBoundingClientRect().height > 0);
    return {
      collapsedBefore: body.hidden,
      printHead: vis('.print-head'),
      printDate: (document.querySelector('#printDate') || {}).textContent || '',
      topic: (document.querySelector('.print-head__topic') || {}).textContent || '',
      composer: vis('.composer-wrap'),
      topbar: vis('.topbar'),
      rail: vis('.rail'),
      insightsVisible: vis('.insights'),
      insightsBodyVisible: vis('.insights__body'),
      cardsRendered: cards.length,
      docScrollW: document.documentElement.scrollWidth,
      vw: window.innerWidth,
      // 气泡必须改为自适应宽度（屏幕上被 Pretext 写死了 px 宽）
      bubbleWidthAuto: (() => {
        const b = document.querySelector('.bubble[data-text]');
        if (!b) return null;
        return Math.round(b.getBoundingClientRect().width) >=
               Math.round(b.parentElement.getBoundingClientRect().width) - 2;
      })()
    };
  });
  check('打印时诊断面板强制展开（收起态也不例外）',
    printState.collapsedBefore === true && printState.insightsBodyVisible === true &&
    printState.cardsRendered === 4,
    `打印前 hidden=${printState.collapsedBefore}，打印时渲染出 ${printState.cardsRendered} 张卡片`);
  check('打印抬头可见且含主题与时间',
    printState.printHead && printState.topic.length > 0 && printState.printDate !== '—',
    `题=${printState.topic} 时间=${printState.printDate}`);
  check('打印时隐藏顶栏/会话栏/输入区',
    printState.composer === false && printState.topbar === false && printState.rail === false,
    JSON.stringify({ composer: printState.composer, topbar: printState.topbar, rail: printState.rail }));
  check('打印时气泡恢复自适应宽度（不被屏上 px 宽锁死）',
    printState.bubbleWidthAuto === true, `auto=${printState.bubbleWidthAuto}`);
  check('打印版式无横向溢出',
    printState.docScrollW <= printState.vw + 1,
    `scrollW=${printState.docScrollW} vw=${printState.vw}`);
  await page.screenshot({ path: path.join(SHOTS, 'print-report.png'), fullPage: false });
  await page.emulateMedia({ media: 'screen' });
  await page.waitForTimeout(300);

  console.log('\n[深色主题]');
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.click('#themeToggle');
  await page.waitForTimeout(420);
  const dark = await page.evaluate(new Function('return (' + AUDIT + ')()'));
  const darkBad = dark.contrastRows.filter((r) => !r.pass);
  check(`深色主题有效对比度达标（${dark.contrastRows.length} 处文本）`, darkBad.length === 0,
    darkBad.length ? darkBad.map((r) => `${r.sel} ${r.ratio}:1(需${r.need})`).join(' · ')
                   : `最低 ${Math.min(...dark.contrastRows.map((r) => r.ratio)).toFixed(2)}:1`);
  check('深色主题无横向溢出', dark.docScrollW <= dark.vw + 1);
  await page.click('#themeToggle');

  // 关键视口截图留档
  console.log('\n[截图留档]');
  for (const [name, w, h] of [['layout-1440', 1440, 900], ['layout-1024', 1024, 768], ['layout-375', 375, 812]]) {
    await page.setViewportSize({ width: w, height: h });
    await page.waitForTimeout(320);
    await page.screenshot({ path: path.join(SHOTS, name + '.png') });
    console.log(`  ✓ preview/${name}.png`);
  }

  console.log('\n[控制台]');
  check('无未捕获错误', errors.length === 0, errors.slice(0, 3).join(' | ') || '干净');

  await browser.close();

  const failed = results.filter((r) => !r.pass);
  console.log('\n' + '═'.repeat(66));
  console.log(`合计 ${results.length} 项 ｜ 通过 ${results.length - failed.length} ｜ 失败 ${failed.length}`);
  if (failed.length) {
    console.log('\n失败项:');
    failed.forEach((f) => console.log(`  ✗ ${f.name}${f.detail ? ' — ' + f.detail : ''}`));
  }

  await writeFile(path.join(SHOTS, 'layout-report.json'),
    JSON.stringify({ url: URL_TO_TEST, results, lightContrast: allContrast }, null, 2), 'utf8');

  process.exit(failed.length ? 1 : 0);
}

main().catch((e) => { console.error('布局验证异常:', e); process.exit(2); });
