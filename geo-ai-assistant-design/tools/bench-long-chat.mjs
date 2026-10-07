#!/usr/bin/env node
/**
 * bench-long-chat.mjs — 长会话性能基准
 *
 * 目的：把「长会话需要虚拟滚动」这个判断建立在实测数字上，而不是感觉。
 * 先量，再决定要不要为它增加复杂度 —— 如果数字可接受，就不该引入
 * 虚拟列表这种容易出错、且会破坏滚动锚点的机制。
 *
 * 三组对照（同一批真实消息内容）：
 *   A. Pretext 高度图   —— 纯计算，不碰 DOM（pretext）
 *   B. DOM 测量高度图   —— 传统做法：逐个建节点再 getBoundingClientRect（会造成重排）
 *   C. 真实渲染 + 紧贴  —— 消息真正进 DOM 并跑完整测量流程
 *
 * 用法：node tools/bench-long-chat.mjs [--url ...]
 */

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(root, 'geo-ai-assistant.html');
const argIdx = process.argv.indexOf('--url');
const URL_TO_TEST = argIdx !== -1 ? process.argv[argIdx + 1] : 'file://' + OUT;

const SIZES = [50, 200, 500, 1000];

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(URL_TO_TEST, { waitUntil: 'load' });
  await page.waitForTimeout(700);

  console.log('长会话性能基准 · Pretext 高度图 vs DOM 测量');
  console.log(`页面：${URL_TO_TEST}\n`);

  const report = await page.evaluate(async (sizes) => {
    const g = window.__geoAssistant;
    const T = g.tokens;

    // 用真实回答内容拼出样本消息（与 seed 用的是同一批文案结构）
    const sampleTexts = [
      '结论先行：千问的缺口不是内容量不足，而是缺少可被抓取的结构化实体页。补齐企业官网的结构化数据，是当前投入产出比最高的一步。',
      '信源缺口已定位到企业官网的结构化数据层。你目前被引用的页面以第三方问答为主，AI 更信任品牌自有的实体页。',
      '纠偏的正确做法不是「让 AI 改口」，而是用更高权重的信源覆盖错误信息，然后复测验证。我按这个原则给出步骤。'
    ];
    const corpus = [];
    const total = Math.max(...sizes);
    for (let i = 0; i < total; i++) corpus.push(sampleTexts[i % sampleTexts.length]);

    const rows = [];

    for (const n of sizes) {
      const msgs = corpus.slice(0, n);
      const width = 640;

      // A. Pretext 高度图：纯算术
      let t0 = performance.now();
      let pretextTotal = 0;
      for (const m of msgs) {
        const r = g.metrics.measure(m, width, T.body, g.font, 'bench:' + m.length);
        pretextTotal += r.height;
      }
      const pretextMs = performance.now() - t0;

      // B. DOM 测量高度图：传统做法，每个都建/删节点并读几何
      t0 = performance.now();
      const probe = document.createElement('div');
      probe.style.cssText = 'position:absolute;top:-99999px;left:-99999px;visibility:hidden;' +
        'overflow-wrap:break-word;';
      probe.style.fontFamily = getComputedStyle(document.body).fontFamily;
      probe.style.fontSize = T.body.size + 'px';
      probe.style.fontWeight = T.body.weight;
      probe.style.lineHeight = T.body.lh + 'px';
      probe.style.width = width + 'px';
      document.body.appendChild(probe);
      let domTotal = 0;
      for (const m of msgs) {
        probe.textContent = m;
        domTotal += probe.getBoundingClientRect().height;   // 每次读取都可能强制重排
      }
      probe.remove();
      const domMs = performance.now() - t0;

      rows.push({
        n,
        pretextMs: +pretextMs.toFixed(2),
        domMs: +domMs.toFixed(2),
        speedup: domMs > 0 && pretextMs > 0 ? +(domMs / pretextMs).toFixed(1) : null,
        perMsgUs: +((pretextMs / n) * 1000).toFixed(1),
        pretextPx: Math.round(pretextTotal),
        domPx: Math.round(domTotal)
      });
    }

    // C. 真实渲染 N 条消息（进 DOM + 完整紧贴流程）
    const domBefore = document.querySelectorAll('#chatInner .msg').length;
    const seedResult = g.seed(sizes[sizes.length - 1]);
    const afterSeed = document.querySelectorAll('#chatInner .msg').length;

    // 滚动性能：连续滚动整段长会话，量每帧耗时。
    // 在「长会话降载开启」与「关闭」两种状态下各滚一遍做对照。
    const scroller = document.querySelector('#chat-log');

    async function measureScroll() {
      const frameTimes = [];
      await new Promise((resolve) => {
        let step = 0;
        const steps = 40;
        function tick() {
          const t = performance.now();
          scroller.scrollTop += Math.round((scroller.scrollHeight - scroller.clientHeight) / steps);
          frameTimes.push(performance.now() - t);
          if (++step >= steps) return resolve();
          requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      });
      frameTimes.sort((a, b) => a - b);
      return {
        median: +frameTimes[Math.floor(frameTimes.length / 2)].toFixed(2),
        p95: +frameTimes[Math.floor(frameTimes.length * 0.95)].toFixed(2),
        max: +frameTimes[frameTimes.length - 1].toFixed(2),
        over16: frameTimes.filter((t) => t > 16.7).length
      };
    }

    // 强制同步布局的代价：先「弄脏」整份列表的布局，再计时。
    // 直接读 offsetHeight 只有在布局已经脏掉时才有意义 ——
    // 否则量到的是 0ms，什么也说明不了（这是个很容易写错的基准）。
    function relayoutCost() {
      const inner = document.querySelector('#chatInner');
      inner.style.gap = '20.5px';                 // 轻微改动即可让全部子项重新布局
      const t = performance.now();
      void document.body.offsetHeight;            // 强制同步布局
      const ms = performance.now() - t;
      inner.style.gap = '';
      void document.body.offsetHeight;
      return +ms.toFixed(2);
    }

    // MutationObserver 是微任务投递的，必须等它跑完再看降载状态
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    const longChatActive = scroller.classList.contains('chat-log--long');

    // 热身：第一轮滚动会一次性承担新建 3 万个节点后的首次布局，
    // 若把它算进某一组，就会得出「优化后更慢」的假结论。
    scroller.classList.add('chat-log--long');
    await measureScroll();
    await measureScroll();

    const optimized = await measureScroll();
    void document.body.offsetHeight;
    const layoutOn = relayoutCost();

    scroller.classList.remove('chat-log--long');
    await measureScroll();                        // 同样先热身
    const unoptimized = await measureScroll();
    void document.body.offsetHeight;
    const layoutOff = relayoutCost();

    // 恢复自动判定
    window.dispatchEvent(new Event('resize'));

    return {
      rows,
      engine: g.engine,
      seed: seedResult,
      messagesBefore: domBefore,
      messagesAfter: afterSeed,
      domNodes: document.querySelectorAll('#chatInner *').length,
      longChatActive,
      scrollOptimized: optimized,
      scrollUnoptimized: unoptimized,
      layoutOn,
      layoutOff,
      stats: JSON.parse(JSON.stringify(g.metrics.stats))
    };
  }, SIZES);

  console.log('■ A/B 对照：高度图计算（同一批消息，宽度 640px）');
  console.log('  ' + '条数'.padEnd(8) + 'Pretext'.padEnd(12) + 'DOM 测量'.padEnd(12) +
    '倍率'.padEnd(9) + '每条(µs)'.padEnd(11) + '高度一致性');
  console.log('  ' + '─'.repeat(76));
  for (const r of report.rows) {
    const same = r.pretextPx === r.domPx ? '一致' : `差 ${r.pretextPx - r.domPx}px`;
    console.log('  ' + String(r.n).padEnd(8) + `${r.pretextMs}ms`.padEnd(12) +
      `${r.domMs}ms`.padEnd(12) + `${r.speedup}×`.padEnd(9) +
      `${r.perMsgUs}`.padEnd(11) + same);
  }

  console.log('\n■ C 真实渲染（进 DOM + 完整紧贴流程）');
  console.log(`  灌入消息 ${report.seed.messages} 条（${report.seed.pairs} 组问答）`);
  console.log(`  渲染耗时 ${report.seed.renderMs}ms ｜ 紧贴测量 ${report.seed.measureMs}ms`);
  console.log(`  DOM 节点总数 ${report.domNodes}`);

  console.log('\n■ 滚动性能（长会话内连续滚动 40 次）');
  console.log('  ' + '状态'.padEnd(18) + '中位'.padEnd(10) + 'p95'.padEnd(10) + '最差'.padEnd(10) + '超 16.7ms 帧数');
  console.log('  ' + '─'.repeat(66));
  const sOn = report.scrollOptimized;
  const sOff = report.scrollUnoptimized;
  console.log('  ' + 'content-visibility'.padEnd(18) + `${sOn.median}ms`.padEnd(10) +
    `${sOn.p95}ms`.padEnd(10) + `${sOn.max}ms`.padEnd(10) + `${sOn.over16}/40`);
  console.log('  ' + '关闭（对照）'.padEnd(18) + `${sOff.median}ms`.padEnd(10) +
    `${sOff.p95}ms`.padEnd(10) + `${sOff.max}ms`.padEnd(10) + `${sOff.over16}/40`);
  console.log(`  长会话降载是否自动启用：${report.longChatActive ? '是' : '否'}`);
  console.log(`  强制同步布局代价：开启 ${report.layoutOn}ms ｜ 关闭 ${report.layoutOff}ms`);

  console.log(`\n■ 测量引擎：${report.engine} ｜ 计数 ${JSON.stringify(report.stats)}`);

  const biggest = report.rows[report.rows.length - 1];
  const perMsg = biggest.pretextMs / biggest.n;
  console.log('\n■ 结论');
  console.log(`  1000 条消息的高度图用 Pretext ${biggest.pretextMs}ms（每条 ${perMsg.toFixed(3)}ms），` +
    `DOM 测量需 ${biggest.domMs}ms（${biggest.speedup}×）；` +
    `两者算出的总高度${biggest.pretextPx === biggest.domPx ? '完全一致' : '相差 ' + (biggest.pretextPx - biggest.domPx) + 'px'}`);

  const needsVirtual = report.seed.measureMs > 300 || report.seed.renderMs > 300;
  console.log(`  真实渲染 ${report.seed.messages} 条的耗时：渲染 ${report.seed.renderMs}ms + 测量 ${report.seed.measureMs}ms ` +
    `→ ${needsVirtual ? '测量/渲染已不再是瓶颈' : '在可接受范围内'}`);
  console.log(`  content-visibility 降载：超 16.7ms 的帧 ${sOff.over16}/40 → ${sOn.over16}/40；` +
    `强制同步布局 ${report.layoutOff}ms → ${report.layoutOn}ms`);

  if (errors.length) console.log(`\n⚠ 页面错误: ${errors.slice(0, 3).join(' | ')}`);

  await writeFile(path.join(root, 'preview', 'bench-long-chat.json'),
    JSON.stringify({ url: URL_TO_TEST, sizes: SIZES, ...report, errors }, null, 2), 'utf8');

  await browser.close();
  console.log('\n报告已写入 preview/bench-long-chat.json');
  process.exit(errors.length ? 1 : 0);
}

main().catch((e) => { console.error('基准脚本异常:', e); process.exit(2); });
