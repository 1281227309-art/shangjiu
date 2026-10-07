#!/usr/bin/env node
/**
 * verify-page.mjs — 用真实 Chromium 验证交付物
 *
 * 重点不是「页面能打开」，而是这三件事：
 *   1. Pretext 是否真的启用（data-metrics="pretext"），字体是否解析成具名字体
 *   2. Pretext 的测量值是否与浏览器真实排版一致 —— 这是整套方案成立的前提。
 *      字体没和 canvas 对齐时，它给出的高度就是错的，而且错得很隐蔽。
 *   3. file:// 与 http:// 两种打开方式均可运行
 *
 * 用法：node tools/verify-page.mjs [--url file:///... | http://...]
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
  console.log(`${pass ? '  ✓' : '  ✗'} ${name}${detail ? ' — ' + detail : ''}`);
}

async function main() {
  await mkdir(SHOTS, { recursive: true });
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();

  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));

  console.log(`\n加载 ${URL_TO_TEST}`);
  const resp = await page.goto(URL_TO_TEST, { waitUntil: 'load' });
  if (URL_TO_TEST.startsWith('http')) {
    check('HTTP 状态 200', resp && resp.status() === 200, resp && String(resp.status()));
  }
  await page.waitForTimeout(700);

  console.log('\n[1] 运行环境');
  const env = await page.evaluate(() => {
    const g = window.__geoAssistant;
    return {
      metrics: document.documentElement.getAttribute('data-metrics'),
      engine: g && g.engine,
      font: g && g.font,
      mono: g && g.mono,
      hasPretext: typeof window.Pretext !== 'undefined',
      pretextVersionExports: window.Pretext ? Object.keys(window.Pretext).length : 0,
      tokenBody: g && g.tokens && g.tokens.body,
      stats: g && g.metrics && g.metrics.stats,
      seg: typeof Intl !== 'undefined' && !!Intl.Segmenter
    };
  });
  check('Pretext 脚本已加载', env.hasPretext, `${env.pretextVersionExports} 个导出`);
  check('测量引擎 = pretext', env.metrics === 'pretext' && env.engine === 'pretext', `data-metrics=${env.metrics}`);
  check('字体解析为具名字体（非 system-ui/sans-serif 泛型）',
    !!env.font && !/^(sans-serif|system-ui)$/.test(env.font), `font = ${env.font}`);
  check('等宽字体已解析', !!env.mono && env.mono !== 'monospace', `mono = ${env.mono}`);
  check('Intl.Segmenter 可用', env.seg === true);
  check('排版令牌已从 CSS 读入', !!(env.tokenBody && env.tokenBody.size === 15 && env.tokenBody.lh === 24),
    JSON.stringify(env.tokenBody));

  console.log('\n[2] Pretext 测量精度 vs 浏览器真实排版（核心正确性）');
  const accuracy = await page.evaluate(() => {
    const g = window.__geoAssistant;
    const samples = [
      '帮我看下上九蒸馏所在豆包和千问里被提到了吗？',
      '豆包已主动推荐，千问尚未进入候选池。我复核了 4 个引擎、24 条高意图问句。',
      'Organization: brand name, founded year, region, official site. 与知识库事实严格一致。',
      '短',
      'AI 说错了法定产区的描述，帮我走一遍纠偏流程：先取证，再定位污染源，然后用更高权重的信源覆盖，最后复测验证。'
    ];
    const widths = [180, 240, 320, 420, 560];

    // 造一个与 .bubble__body 完全同构的隐藏元素，作为「浏览器真实排版」的基准
    const probe = document.createElement('div');
    probe.style.cssText = 'position:absolute;top:-99999px;left:-99999px;visibility:hidden;' +
      'overflow-wrap:break-word;';
    const cs = getComputedStyle(document.querySelector('.bubble__body'));
    probe.style.fontFamily = cs.fontFamily;
    probe.style.fontSize = cs.fontSize;
    probe.style.fontWeight = cs.fontWeight;
    probe.style.lineHeight = cs.lineHeight;
    document.body.appendChild(probe);

    const rows = [];
    for (const text of samples) {
      for (const w of widths) {
        const m = g.metrics.measure(text, w, g.tokens.body, g.font, 'verify:' + text.length + w);
        probe.style.width = w + 'px';
        probe.textContent = text;
        const domH = probe.getBoundingClientRect().height;
        rows.push({
          text: text.slice(0, 14),
          w,
          pretextH: m.height,
          domH: Math.round(domH),
          diff: Math.round(domH) - m.height,
          linesP: m.lineCount
        });
      }
    }
    probe.remove();
    return rows;
  });

  const maxAbsDiff = Math.max(...accuracy.map((r) => Math.abs(r.diff)));
  const mismatched = accuracy.filter((r) => Math.abs(r.diff) > 1);
  const total = accuracy.length;
  check(`Pretext 高度误差 ≤1px（${total - mismatched.length}/${total} 组合）`,
    mismatched.length === 0, `最大偏差 ${maxAbsDiff}px`);
  if (mismatched.length) {
    console.log('    偏差明细:');
    mismatched.slice(0, 8).forEach((r) =>
      console.log(`      「${r.text}…」 width=${r.w} pretext=${r.pretextH} dom=${r.domH} diff=${r.diff}`));
  }

  console.log('\n[2b] 段内加粗（rich-inline 逐片段测量）精度');
  const richAcc = await page.evaluate(() => {
    const g = window.__geoAssistant;
    // 探针直接复用生产类 .bubble__body —— 这样测的是「真实 CSS 渲染的加粗字重」
    // 与「JS 用令牌拼出的 canvas 字重」是否一致，而不只是自洽。
    const probe = document.createElement('div');
    probe.className = 'bubble__body';
    probe.style.cssText = 'position:absolute;top:-99999px;left:-99999px;visibility:hidden;';
    document.body.appendChild(probe);

    const escape = (s) => s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
    const cases = [
      '结论先行：千问的缺口不是内容量不足，而是**缺少可被抓取的结构化实体页**。补齐企业官网的结构化数据，是当前投入产出比最高的一步。',
      '**豆包**已主动推荐，**千问**尚未进入候选池。',
      'Organization：品牌名、成立时间、产区 —— 与知识库事实**严格一致**。',
      '**A**b**C**d**E**f 混排 **粗体** 与常规字重交替出现，用来暴露字重估算误差。'
    ];
    const widths = [200, 260, 340, 460];
    const rows = [];
    for (const md of cases) {
      for (const w of widths) {
        probe.style.width = w + 'px';
        probe.innerHTML = escape(md).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        const domH = Math.round(probe.getBoundingClientRect().height);
        const rich = g.metrics.measureRich(md, w, g.tokens.body, g.tokens.bodyBold);
        const naive = g.metrics.measure(md.replace(/\*\*/g, ''), w, g.tokens.body, g.font, 'naive:' + w);
        rows.push({
          w, domH, richH: rich.height, naiveH: naive.height,
          richDiff: Math.abs(domH - rich.height), naiveDiff: Math.abs(domH - naive.height)
        });
      }
    }
    probe.remove();
    return rows;
  });
  const richMax = Math.max(...richAcc.map((r) => r.richDiff));
  const naiveMax = Math.max(...richAcc.map((r) => r.naiveDiff));
  const richWorse = richAcc.filter((r) => r.richDiff > r.naiveDiff);
  check(`rich-inline 高度误差 ≤1px（${richAcc.length} 组）`, richMax <= 1, `最大偏差 ${richMax}px`);
  check('rich-inline 不劣于纯文本估算（含字重混排）', richWorse.length === 0,
    `rich 最大 ${richMax}px ｜ 纯文本估算最大 ${naiveMax}px`);
  if (naiveMax > 0) {
    console.log(`    说明：同一批样本下，忽略字重的纯文本估算最大偏差 ${naiveMax}px，` +
      `rich-inline 为 ${richMax}px`);
  }

  console.log('\n[3] 紧贴宽度（shrink-wrap）生效');
  const wrap = await page.evaluate(() => {
    const out = [];
    document.querySelectorAll('.bubble[data-text]').forEach((b) => {
      // 可用宽度取整行，而不是收缩到内容宽度的 .msg__col
      const row = b.closest('.msg');
      const av = row && row.querySelector('.msg__avatar');
      const gap = row ? (parseFloat(getComputedStyle(row).columnGap) || 0) : 0;
      const available = row ? row.clientWidth - (av ? av.offsetWidth : 0) - gap : 0;
      const col = b.parentElement.clientWidth;
      out.push({
        w: Math.round(b.getBoundingClientRect().width),
        colW: Math.round(available),
        text: (b.getAttribute('data-text') || '').slice(0, 12),
        lines: b.getAttribute('data-measured-lines'),
        simple: !b.querySelector('.bullets, .kv, .snapshot, .cites, ul, ol, figure')
      });
    });
    return out;
  });
  const simple = wrap.filter((w) => w.simple);
  const structured = wrap.filter((w) => !w.simple);
  simple.forEach((w) => {
    check(`纯文本气泡紧贴内容「${w.text}…」`, w.w < w.colW,
      `气泡 ${w.w}px < 可用 ${w.colW}px（${w.lines} 行）`);
  });
  check('存在被真正收窄的气泡（shrink-wrap 生效）', simple.some((w) => w.w < w.colW - 20),
    simple.map((w) => `${w.w}/${w.colW}`).join(' · ') || '无纯文本气泡');
  structured.forEach((w) => {
    check(`结构化气泡保持满宽（设计规则）「${w.text}…」`, w.w >= w.colW - 2,
      `气泡 ${w.w}px ≈ 可用 ${w.colW}px`);
  });

  console.log('\n[4] 无障碍静态检查');
  const a11y = await page.evaluate(() => {
    const noName = [];
    document.querySelectorAll('button, a[href]').forEach((el) => {
      const name = (el.getAttribute('aria-label') || el.textContent || '').trim();
      if (!name) noName.push(el.outerHTML.slice(0, 70));
    });
    const ids = {};
    const dupIds = [];
    document.querySelectorAll('[id]').forEach((el) => {
      if (ids[el.id]) dupIds.push(el.id);
      ids[el.id] = true;
    });
    const imgsNoAlt = document.querySelectorAll('img:not([alt])').length;
    const svgNoHidden = document.querySelectorAll('svg:not([aria-hidden]):not([role])').length;
    return {
      lang: document.documentElement.lang,
      noName, dupIds, imgsNoAlt, svgNoHidden,
      hasSkip: !!document.querySelector('.skip-link'),
      main: !!document.querySelector('main'),
      landmarks: document.querySelectorAll('header, nav, main, aside').length,
      liveRegion: document.querySelector('[role="log"][aria-live]') ? 'log+live' : 'none',
      srOnly: document.querySelectorAll('.sr-only').length,
      tabbable: document.querySelectorAll('button:not([disabled]), a[href], textarea, [tabindex]:not([tabindex="-1"])').length,
      textareaLabel: !!document.querySelector('label[for="composerInput"]'),
      progressbars: document.querySelectorAll('[role="progressbar"]').length
    };
  });
  check('html lang 已声明', a11y.lang === 'zh-CN', a11y.lang);
  check('所有按钮/链接均有可访问名称', a11y.noName.length === 0,
    a11y.noName.length ? a11y.noName.join(' | ') : '全部通过');
  check('无重复 id', a11y.dupIds.length === 0, a11y.dupIds.join(', ') || '无');
  check('img 均有 alt', a11y.imgsNoAlt === 0);
  check('装饰性 svg 均 aria-hidden', a11y.svgNoHidden === 0, `漏标 ${a11y.svgNoHidden} 个`);
  check('存在跳转链接', a11y.hasSkip);
  check('地标结构完整（≥4）', a11y.landmarks >= 4, `${a11y.landmarks} 个`);
  check('对话流为 role=log + aria-live', a11y.liveRegion === 'log+live');
  check('textarea 有关联 label', a11y.textareaLabel);
  check('指标使用 role=progressbar', a11y.progressbars >= 6, `${a11y.progressbars} 个`);
  check('键盘可达元素充足', a11y.tabbable >= 15, `${a11y.tabbable} 个`);

  console.log('\n[5] 交互');
  // 推荐问句 → 提交 → 流式 → 完成
  await page.click('[data-suggest]');
  const filled = await page.inputValue('#composerInput');
  check('点击推荐问句可填入输入框', filled.length > 0, filled.slice(0, 16) + '…');

  const before = await page.locator('#chatInner .msg').count();
  await page.click('#sendBtn');
  await page.waitForTimeout(300);
  const duringStream = await page.locator('#chatInner .msg').count();
  check('发送后立即新增消息', duringStream > before, `${before} → ${duringStream}`);

  await page.waitForFunction(
    () => window.__geoAssistant && !window.__geoAssistant.isStreaming(),
    null, { timeout: 20000 }
  );
  const after = await page.evaluate(() => {
    const msgs = document.querySelectorAll('#chatInner .msg');
    const last = msgs[msgs.length - 1];
    return {
      count: msgs.length,
      hasActions: !!last.querySelector('.msg__actions'),
      hasBullets: !!last.querySelector('.bullets'),
      hasText: ((last.querySelector('.bubble') || last).getAttribute('data-text') || '').length > 20,
      ariaHidden: !!last.querySelector('.bubble [aria-hidden="true"]'),
      stats: window.__geoAssistant.metrics.stats
    };
  });
  check('流式结束后保留完整回答', after.hasText && after.hasBullets,
    `共 ${after.count} 条消息 · data-text=${after.hasText} · bullets=${after.hasBullets}`);
  check('操作条已赋予新消息', after.hasActions);
  check('流式期间 aria-hidden 已撤销（避免逐字播报）', !after.ariaHidden);
  check('Pretext 调用计数在增长', after.stats.compute > 0, JSON.stringify(after.stats));

  // 主题切换
  await page.click('#themeToggle');
  const dark = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
  check('主题切换 → dark', dark === 'dark', dark);
  await page.screenshot({ path: path.join(SHOTS, 'desktop-dark.png'), fullPage: false });
  await page.click('#themeToggle');
  const light = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
  check('主题切回 → light', light === 'light', light);

  // 会话切换
  await page.click('.session[data-thread="correction"]');
  const title = await page.textContent('.thread__title');
  check('会话切换更新标题', title.includes('纠偏'), title);

  // 复制
  await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.hover('#chatInner .msg');
  await page.click('#chatInner .msg [data-act="copy"]');
  await page.waitForTimeout(300);
  const copied = await page.evaluate(() => navigator.clipboard.readText());
  check('复制回答可用', copied.length > 10, `${copied.length} 字符`);

  await page.screenshot({ path: path.join(SHOTS, 'desktop-light.png') });

  console.log('\n[5b] 停止生成 / 继续生成');
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.fill('#composerInput', '帮我看看信源缺口在哪里');
  await page.click('#sendBtn');
  await page.waitForTimeout(450);
  const streamingState = await page.evaluate(() => {
    const b = document.querySelector('#sendBtn');
    return {
      label: b.getAttribute('aria-label'),
      isStopClass: b.classList.contains('send--stop'),
      stopIconVisible: !document.querySelector('#stopIcon').hidden,
      sendIconHidden: document.querySelector('#sendIcon').hidden,
      disabled: b.disabled,
      streaming: window.__geoAssistant.isStreaming()
    };
  });
  check('流式中发送键变为「停止生成」',
    streamingState.label === '停止生成' && streamingState.isStopClass &&
    streamingState.stopIconVisible && streamingState.sendIconHidden && !streamingState.disabled,
    JSON.stringify(streamingState));

  await page.click('#sendBtn');                       // 同一按钮 = 停止
  await page.waitForTimeout(400);
  const stoppedState = await page.evaluate(() => {
    const msgs = document.querySelectorAll('#chatInner .msg');
    const last = msgs[msgs.length - 1];
    const cont = last.querySelector('[data-act="continue"]');
    return {
      streaming: window.__geoAssistant.isStreaming(),
      stoppedClass: !!last.querySelector('.bubble--stopped'),
      hint: (last.querySelector('.bubble__hint') || {}).textContent || '',
      hasContinue: !!cont,
      hasBullets: !!last.querySelector('.bullets'),
      textLen: ((last.querySelector('.bubble') || last).getAttribute('data-text') || '').length,
      label: document.querySelector('#sendBtn').getAttribute('aria-label'),
      focusOnContinue: document.activeElement === cont
    };
  });
  check('停止后流式结束并只保留已生成内容',
    stoppedState.streaming === false && stoppedState.stoppedClass && stoppedState.textLen > 0,
    `停止时保留了 ${stoppedState.textLen} 字（与下文「完成后的完整字数」对比可验证并非全文）`);
  check('停止态给出「已停止生成」与「继续生成」',
    stoppedState.hasContinue && stoppedState.hint.includes('已停止'),
    `hint="${stoppedState.hint}"`);
  check('停止态不渲染未生成完的列表（避免半截结构）', stoppedState.hasBullets === false);
  check('停止后按钮恢复为「发送」且焦点落在「继续生成」',
    stoppedState.label === '发送' && stoppedState.focusOnContinue,
    `label=${stoppedState.label} focus=${stoppedState.focusOnContinue}`);

  await page.click('[data-act="continue"]');
  await page.waitForTimeout(400);
  const resumed = await page.evaluate(() => ({
    streaming: window.__geoAssistant.isStreaming(),
    hasContinue: !!document.querySelector('[data-act="continue"]'),
    label: document.querySelector('#sendBtn').getAttribute('aria-label')
  }));
  check('「继续生成」可恢复流式',
    resumed.streaming === true && resumed.label === '停止生成' && !resumed.hasContinue,
    JSON.stringify(resumed));
  await page.waitForFunction(() => !window.__geoAssistant.isStreaming(), null, { timeout: 20000 });
  const resumedDone = await page.evaluate(() => {
    const msgs = document.querySelectorAll('#chatInner .msg');
    const last = msgs[msgs.length - 1];
    return {
      hasBullets: !!last.querySelector('.bullets'),
      stoppedClass: !!last.querySelector('.bubble--stopped'),
      textLen: ((last.querySelector('.bubble') || last).getAttribute('data-text') || '').length
    };
  });
  check('续写完成后补全结构与完整正文',
    resumedDone.hasBullets && !resumedDone.stoppedClass &&
    resumedDone.textLen > stoppedState.textLen,
    `停止时 ${stoppedState.textLen} 字 → 完成 ${resumedDone.textLen} 字`);

  console.log('\n[5c] Esc 停止 + 离线失败态');
  await page.fill('#composerInput', '再给一版纠偏步骤');
  await page.click('#sendBtn');
  await page.waitForTimeout(450);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(350);
  const escStopped = await page.evaluate(() => ({
    streaming: window.__geoAssistant.isStreaming(),
    hasContinue: !!document.querySelector('[data-act="continue"]')
  }));
  check('Esc 可中断生成', escStopped.streaming === false && escStopped.hasContinue,
    JSON.stringify(escStopped));

  // 真实离线：Playwright 切断网络，页面通过 navigator.onLine 感知
  await ctx.setOffline(true);
  await page.waitForTimeout(250);
  const offlineFlag = await page.evaluate(() => ({
    online: navigator.onLine,
    bodyAttr: document.body.getAttribute('data-online'),
    noteVisible: getComputedStyle(document.querySelector('#offlineNote')).display !== 'none'
  }));
  check('离线时显示断网提示', offlineFlag.online === false && offlineFlag.bodyAttr === 'false' &&
    offlineFlag.noteVisible, JSON.stringify(offlineFlag));

  await page.fill('#composerInput', '离线状态下再问一次');
  await page.click('#sendBtn');
  await page.waitForTimeout(450);
  const errState = await page.evaluate(() => {
    const msgs = document.querySelectorAll('#chatInner .msg');
    const last = msgs[msgs.length - 1];
    return {
      isError: !!last.querySelector('.bubble--error'),
      lead: (last.querySelector('.bubble__lead--error') || {}).textContent || '',
      hasRetry: !!last.querySelector('[data-act="retry"]'),
      streaming: window.__geoAssistant.isStreaming(),
      role: last.getAttribute('class')
    };
  });
  check('离线发送进入失败态并给出「重试」',
    errState.isError && errState.hasRetry && errState.streaming === false &&
    errState.lead.includes('未能生成'), JSON.stringify({ lead: errState.lead, retry: errState.hasRetry }));

  await page.click('[data-act="retry"]');
  await page.waitForTimeout(400);
  const retryOffline = await page.evaluate(() => {
    const msgs = document.querySelectorAll('#chatInner .msg');
    const last = msgs[msgs.length - 1];
    return { isError: !!last.querySelector('.bubble--error'), hasRetry: !!last.querySelector('[data-act="retry"]') };
  });
  check('离线重试仍给出可操作的失败态（不静默失败）',
    retryOffline.isError && retryOffline.hasRetry, JSON.stringify(retryOffline));

  // 恢复网络 → 重试成功
  await ctx.setOffline(false);
  await page.waitForTimeout(300);
  const backOnline = await page.evaluate(() => ({
    online: navigator.onLine,
    bodyAttr: document.body.getAttribute('data-online')
  }));
  check('恢复网络后提示消失', backOnline.online === true && backOnline.bodyAttr === 'true',
    JSON.stringify(backOnline));
  await page.click('[data-act="retry"]');
  await page.waitForFunction(() => window.__geoAssistant.isStreaming(), null, { timeout: 8000 });
  await page.waitForFunction(() => !window.__geoAssistant.isStreaming(), null, { timeout: 20000 });
  const recovered = await page.evaluate(() => {
    const msgs = document.querySelectorAll('#chatInner .msg');
    const last = msgs[msgs.length - 1];
    return {
      isError: !!last.querySelector('.bubble--error'),
      hasBullets: !!last.querySelector('.bullets')
    };
  });
  check('恢复网络后重试成功生成回答', !recovered.isError && recovered.hasBullets, JSON.stringify(recovered));

  console.log('\n[6] 键盘与命中区域');
  // Enter 发送 / Shift+Enter 换行
  await page.fill('#composerInput', '');
  await page.focus('#composerInput');
  await page.keyboard.type('第一行');
  await page.keyboard.down('Shift');
  await page.keyboard.press('Enter');
  await page.keyboard.up('Shift');
  await page.keyboard.type('第二行');
  const multiline = await page.inputValue('#composerInput');
  check('Shift+Enter 插入换行而不发送', multiline.includes('\n'), JSON.stringify(multiline));
  await page.keyboard.press('Enter');
  await page.waitForTimeout(400);
  const afterEnter = await page.locator('#chatInner .msg').count();
  check('Enter 直接发送', afterEnter > after.count, `${after.count} → ${afterEnter}`);
  await page.waitForFunction(
    () => window.__geoAssistant && !window.__geoAssistant.isStreaming(),
    null, { timeout: 20000 }
  );

  // 触控目标尺寸
  const small = await page.evaluate(() => {
    const bad = [];
    document.querySelectorAll('button, a[href], textarea').forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return;
      if (r.height < 24 || r.width < 24) bad.push(`${el.tagName}.${el.className || ''} ${Math.round(r.width)}x${Math.round(r.height)}`);
    });
    return bad;
  });
  check('无过小交互目标（≥24px）', small.length === 0, small.slice(0, 4).join(' | ') || '全部达标');

  // Esc / 焦点：必须在新加载的页面上测首次 Tab，否则焦点停在上一处、Tab 从那里往后走
  const fresh = await ctx.newPage();
  await fresh.goto(URL_TO_TEST, { waitUntil: 'load' });
  await fresh.waitForTimeout(400);
  await fresh.keyboard.press('Tab');
  const skipFocused = await fresh.evaluate(() => ({
    isSkip: document.activeElement.classList.contains('skip-link'),
    tag: document.activeElement.tagName,
    cls: document.activeElement.className
  }));
  check('首次 Tab 命中跳转链接', skipFocused.isSkip, JSON.stringify(skipFocused));
  // 焦点环可见性：键盘聚焦后应产生 3px 轮廓
  const focusRing = await fresh.evaluate(() => {
    const el = document.activeElement;
    const cs = getComputedStyle(el);
    return { width: cs.outlineWidth, style: cs.outlineStyle, color: cs.outlineColor };
  });
  check('焦点环样式可见（3px solid）', focusRing.width === '3px' && focusRing.style === 'solid',
    JSON.stringify(focusRing));
  await fresh.close();

  console.log('\n[7] 移动端 375px');
  await page.setViewportSize({ width: 375, height: 812 });
  await page.waitForTimeout(500);
  const mobile = await page.evaluate(() => {
    const rail = document.querySelector('#rail');
    const cs = getComputedStyle(rail);
    return {
      visibility: cs.visibility,
      open: rail.getAttribute('data-open'),
      toggleVisible: getComputedStyle(document.querySelector('#railToggle')).display !== 'none',
      horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth + 1,
      scrollW: document.documentElement.scrollWidth,
      innerW: window.innerWidth
    };
  });
  check('会话栏在移动端默认隐藏', mobile.visibility === 'hidden', `visibility=${mobile.visibility}`);
  check('抽屉开关按钮可见', mobile.toggleVisible);
  check('无横向溢出', !mobile.horizontalOverflow, `scrollW=${mobile.scrollW} innerW=${mobile.innerW}`);

  await page.click('#railToggle');
  await page.waitForTimeout(400);
  const opened = await page.evaluate(() => ({
    open: document.querySelector('#rail').getAttribute('data-open'),
    expanded: document.querySelector('#railToggle').getAttribute('aria-expanded'),
    backdrop: !document.querySelector('#railBackdrop').hidden
  }));
  check('点击可打开抽屉', opened.open === 'true' && opened.expanded === 'true', JSON.stringify(opened));
  await page.screenshot({ path: path.join(SHOTS, 'mobile-drawer.png') });

  await page.keyboard.press('Escape');
  await page.waitForTimeout(400);
  const closed = await page.evaluate(() => ({
    open: document.querySelector('#rail').getAttribute('data-open'),
    focusOnToggle: document.activeElement.id
  }));
  check('Esc 关闭抽屉并归还焦点', closed.open === 'false' && closed.focusOnToggle === 'railToggle',
    JSON.stringify(closed));

  await page.screenshot({ path: path.join(SHOTS, 'mobile.png') });

  console.log('\n[8] 控制台');
  check('无未捕获错误', errors.length === 0, errors.slice(0, 3).join(' | ') || '干净');

  await browser.close();

  const failed = results.filter((r) => !r.pass);
  console.log(`\n${'═'.repeat(64)}`);
  console.log(`合计 ${results.length} 项 ｜ 通过 ${results.length - failed.length} ｜ 失败 ${failed.length}`);
  if (failed.length) {
    console.log('\n失败项:');
    failed.forEach((f) => console.log(`  ✗ ${f.name}${f.detail ? ' — ' + f.detail : ''}`));
  }
  await writeFile(path.join(root, 'preview', 'verify-report.json'),
    JSON.stringify({ url: URL_TO_TEST, results, accuracy }, null, 2), 'utf8');

  process.exit(failed.length ? 1 : 0);
}

main().catch((e) => { console.error('验证脚本异常:', e); process.exit(2); });
