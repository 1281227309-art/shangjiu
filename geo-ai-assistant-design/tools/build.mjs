#!/usr/bin/env node
/**
 * build.mjs — 把 src/app.template.html + Pretext IIFE 打包产物 → 单文件交付 HTML
 *
 * 为什么需要打包而不是直接 <script type="module"> 引入 vendor/dist？
 *   ES module 在 file:// 协议下会被 CORS 拦截（origin 为 null），
 *   客户双击打开就白屏。<script src> 是经典脚本，file:// 下可正常执行，
 *   因此这里把 Pretext 预先打成 IIFE 并内联进 HTML —— 最终产物：
 *     · 零外部依赖、零 CDN、零服务器
 *     · 双击可开（file://）、也可放任意 HTTP 静态站
 *     · 离线可用（对国内客户尤其重要：esm.sh / jsdelivr 并不总是可达）
 *
 * 重建 Pretext IIFE 产物（仅在升级 Pretext 版本时需要）：
 *   npx esbuild vendor/pretext/entry.js --bundle --format=iife \
 *     --global-name=Pretext --minify --target=es2020 --legal-comments=none \
 *     --outfile=vendor/pretext/pretext.iife.js
 *
 * 用法：node tools/build.mjs
 */

import { readFile, writeFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TEMPLATE = path.join(root, 'src', 'app.template.html');
const BUNDLE = path.join(root, 'vendor', 'pretext', 'pretext.iife.js');
const OUT = path.join(root, 'geo-ai-assistant.html');
const PLACEHOLDER = '/*__PRETEXT_BUNDLE__*/';

async function main() {
  const [template, bundle] = await Promise.all([
    readFile(TEMPLATE, 'utf8'),
    readFile(BUNDLE, 'utf8'),
  ]);

  if (!template.includes(PLACEHOLDER)) {
    throw new Error(`模板缺少占位符 ${PLACEHOLDER}`);
  }
  // 内联脚本里若出现 </script> 会提前闭合标签，必须转义
  const safe = bundle.replace(/<\/script/gi, '<\\/script');

  // ⚠ 必须用「函数」形式的替换。压缩后的 JS 里含 $&、$`、$' 等序列，
  // 若直接以字符串作为替换值传给 replace()，JS 会把它们当成替换模式展开，
  // 把占位符之后（以及之前）的模板内容注入脚本中间 —— 其中就包含 </script>，
  // 结果是内联脚本被 HTML 解析器从中间截断，页面静默退化且报 "Invalid or unexpected token"。
  const out = template.replace(PLACEHOLDER, () => safe);

  // 构建自检：这三条断言正是上面那个坑的回归防护
  const scriptCloseCount = out.split('</script>').length - 1;
  const expectClose = template.split('</script>').length - 1;
  const problems = [];
  if (out.includes(PLACEHOLDER)) problems.push('占位符未被替换');
  if (scriptCloseCount !== expectClose) {
    problems.push(`</script> 数量 ${scriptCloseCount} ≠ 模板 ${expectClose}，脚本已被截断`);
  }
  if (!out.includes(safe.slice(-120))) problems.push('内联内容尾部缺失，bundle 未完整写入');
  if (/<script[^>]+src=["']https?:/i.test(out)) problems.push('产物仍含外部脚本依赖');
  if (problems.length) throw new Error('构建自检未通过: ' + problems.join('; '));

  await writeFile(OUT, out, 'utf8');

  const [t, o] = await Promise.all([stat(TEMPLATE), stat(OUT)]);
  const kb = (n) => (n / 1024).toFixed(1) + ' KB';
  console.log('构建完成');
  console.log(`  模板    ${kb(t.size)}  ${path.relative(root, TEMPLATE)}`);
  console.log(`  Pretext ${kb(bundle.length)}  ${path.relative(root, BUNDLE)}`);
  console.log(`  产物    ${kb(o.size)}  ${path.relative(root, OUT)}`);
  console.log(`  自检    </script> ${scriptCloseCount}/${expectClose} · 无外部依赖 · bundle 完整`);
}

main().catch((e) => {
  console.error('构建失败:', e.message);
  process.exit(1);
});
