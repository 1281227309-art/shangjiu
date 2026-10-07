#!/usr/bin/env node
/**
 * verify-a11y.mjs — 用 axe-core 做自动化无障碍审计
 *
 * 为什么单独一个脚本：
 *   verify-page.mjs 里的规则是「我们想到要检查的」，而 axe-core 是
 *   一套成熟的 WCAG 规则引擎，能抓到我们没想到的（重复 landmark、
 *   aria 属性组合非法、可访问名称计算、表格语义等等）。
 *   两者互补：前者验行为，后者验规则。
 *
 * 覆盖 4 个状态 —— 单靠一个状态过不了关不代表界面可用：
 *   1. 桌面浅色（默认）
 *   2. 桌面深色
 *   3. 移动端（诊断面板收起）
 *   4. 移动端 + 诊断面板展开
 *
 * 用法：node tools/verify-a11y.mjs [--url ...]
 * 退出码：存在 serious / critical 违规 → 1
 */

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(root, 'geo-ai-assistant.html');
const AXE = path.join(root, 'tools', 'vendor', 'axe.min.js');
const argIdx = process.argv.indexOf('--url');
const URL_TO_TEST = argIdx !== -1 ? process.argv[argIdx + 1] : 'file://' + OUT;

const results = [];
function check(name, pass, detail) {
  results.push({ name, pass, detail });
  console.log(`  ${pass ? '✓' : '✗'} ${name}${detail ? ' — ' + detail : ''}`);
}

async function runAxe(page, label) {
  // 把 axe 注入页面并执行；只关心违规项
  await page.addScriptTag({ path: AXE });
  const res = await page.evaluate(async () => {
    // 关掉 axe 自己的动画等待逻辑，避免与流式动画互相等待
    return await window.axe.run(document, {
      resultTypes: ['violations'],
      rules: {
        // 单文件原型没有 <html> 之外的站点级配置；这些规则对本页无意义
        'region': { enabled: true }
      }
    });
  });
  return { label, violations: res.violations, passes: res.passes ? res.passes.length : 0 };
}

function summarise(violations) {
  return violations.map((v) => `${v.id}(${v.impact})×${v.nodes.length}`).join(' · ');
}

async function main() {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));

  console.log(`\naxe-core 无障碍审计 · ${URL_TO_TEST}`);
  await page.goto(URL_TO_TEST, { waitUntil: 'load' });
  await page.waitForTimeout(700);

  /* —— 1. 桌面浅色 —— */
  console.log('\n[1] 桌面 · 浅色主题');
  const light = await runAxe(page, 'desktop-light');
  const lightBlocking = light.violations.filter((v) => ['serious', 'critical'].includes(v.impact));
  check('无 serious / critical 违规', lightBlocking.length === 0,
    light.violations.length ? summarise(light.violations) : '零违规');
  if (light.violations.length) {
    console.log('    违规明细:');
    light.violations.forEach((v) => {
      console.log(`      · ${v.id} [${v.impact}] ${v.help}（${v.nodes.length} 处）`);
      v.nodes.slice(0, 2).forEach((n) => console.log(`          ${n.target.join(' ')}`));
    });
  }

  /* —— 2. 桌面深色 —— */
  console.log('\n[2] 桌面 · 深色主题');
  await page.click('#themeToggle');
  await page.waitForTimeout(420);
  const dark = await runAxe(page, 'desktop-dark');
  const darkBlocking = dark.violations.filter((v) => ['serious', 'critical'].includes(v.impact));
  check('无 serious / critical 违规', darkBlocking.length === 0,
    dark.violations.length ? summarise(dark.violations) : '零违规');

  /* —— 3. 移动端 · 面板收起 —— */
  console.log('\n[3] 移动端 375px · 诊断面板收起');
  await page.click('#themeToggle');                 // 回浅色
  await page.setViewportSize({ width: 375, height: 812 });
  await page.waitForTimeout(500);
  const mobile = await runAxe(page, 'mobile-collapsed');
  const mobileBlocking = mobile.violations.filter((v) => ['serious', 'critical'].includes(v.impact));
  check('无 serious / critical 违规', mobileBlocking.length === 0,
    mobile.violations.length ? summarise(mobile.violations) : '零违规');
  if (mobile.violations.length) {
    mobile.violations.forEach((v) => {
      console.log(`      · ${v.id} [${v.impact}] ${v.help}（${v.nodes.length} 处）`);
      v.nodes.slice(0, 3).forEach((n) => console.log(`          ${n.target.join(' ')}`));
    });
  }

  /* —— 4. 移动端 · 面板展开（此前隐藏的内容也要合规） —— */
  console.log('\n[4] 移动端 375px · 诊断面板展开');
  await page.click('#insightsToggle');
  await page.waitForTimeout(500);
  const expanded = await runAxe(page, 'mobile-expanded');
  const expandedBlocking = expanded.violations.filter((v) => ['serious', 'critical'].includes(v.impact));
  check('无 serious / critical 违规', expandedBlocking.length === 0,
    expanded.violations.length ? summarise(expanded.violations) : '零违规');

  /* —— 5. 失败态与停止态（新交互也要过规则） —— */
  console.log('\n[5] 失败态 + 停止态');
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.waitForTimeout(300);
  await ctx.setOffline(true);
  await page.fill('#composerInput', '离线路径的规则检查');
  await page.click('#sendBtn');
  await page.waitForTimeout(400);
  const errAxe = await runAxe(page, 'error-state');
  const errBlocking = errAxe.violations.filter((v) => ['serious', 'critical'].includes(v.impact));
  check('失败态无 serious / critical 违规', errBlocking.length === 0,
    errAxe.violations.length ? summarise(errAxe.violations) : '零违规');
  await ctx.setOffline(false);
  await page.waitForTimeout(200);

  /* —— 6. 关键规则单独确认 —— */
  console.log('\n[6] 重点规则确认');
  const audits = await page.evaluate(async () => {
    const r = await window.axe.run(document, {
      runOnly: {
        type: 'rule',
        values: ['color-contrast', 'aria-allowed-attr', 'aria-valid-attr-value',
                 'button-name', 'link-name', 'label', 'landmark-unique',
                 'aria-hidden-focus', 'nested-interactive', 'focus-order-semantics']
      }
    });
    const out = {};
    [...r.passes, ...r.violations, ...r.incomplete].forEach((v) => {
      out[v.id] = (out[v.id] || '') + (v.violations && v.violations.length ? 'violation' : 'pass');
    });
    return {
      passIds: r.passes.map((v) => v.id),
      violationIds: r.violations.map((v) => v.id),
      incompleteIds: r.incomplete.map((v) => v.id)
    };
  });
  check('color-contrast 规则通过（axe 未发现对比度问题）',
    audits.passIds.includes('color-contrast'), `通过规则 ${audits.passIds.length} 条`);
  check('不存在 aria 属性/名称类违规',
    !audits.violationIds.some((id) => /^aria-|name$|^label$/.test(id)),
    audits.violationIds.length ? audits.violationIds.join(',') : '无');
  check('无 aria-hidden 焦点 / 嵌套交互等结构性违规',
    !audits.violationIds.includes('aria-hidden-focus') &&
    !audits.violationIds.includes('nested-interactive'),
    audits.violationIds.length ? audits.violationIds.join(',') : '无');
  if (audits.incompleteIds.length) {
    console.log(`    需人工确认（axe 无法自动判定）：${audits.incompleteIds.join(', ')}`);
  }

  console.log('\n[7] 控制台');
  check('无未捕获错误', errors.length === 0, errors.slice(0, 2).join(' | ') || '干净');

  await browser.close();

  const failed = results.filter((r) => !r.pass);
  console.log('\n' + '═'.repeat(66));
  console.log(`合计 ${results.length} 项 ｜ 通过 ${results.length - failed.length} ｜ 失败 ${failed.length}`);
  if (failed.length) {
    console.log('\n失败项:');
    failed.forEach((f) => console.log(`  ✗ ${f.name}${f.detail ? ' — ' + f.detail : ''}`));
  }

  await writeFile(path.join(root, 'preview', 'a11y-report.json'),
    JSON.stringify({
      url: URL_TO_TEST,
      axeVersion: await page.evaluate(() => window.axe ? window.axe.version : null).catch(() => null),
      results,
      violations: {
        light: light.violations.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.length, help: v.help })),
        dark: dark.violations.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.length, help: v.help })),
        mobileCollapsed: mobile.violations.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.length, help: v.help })),
        mobileExpanded: expanded.violations.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.length, help: v.help })),
        errorState: errAxe.violations.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.length, help: v.help }))
      }
    }, null, 2), 'utf8');

  process.exit(failed.length ? 1 : 0);
}

main().catch((e) => { console.error('axe 审计异常:', e); process.exit(2); });
