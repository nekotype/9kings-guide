// ビルド済みHTMLの内部リンクと画像・CSS・favicon、ページ内アンカーを確認します。
import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve('dist');
const base = `/${(process.env.BASE_PATH || '').replace(/^\/+|\/+$/g, '')}`.replace(/\/$/, '');
const origin = process.env.SITE_URL ? new URL(process.env.SITE_URL).origin : 'http://localhost:4321';
const files = [];
async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(file);
    else if (file.endsWith('.html')) files.push(file);
  }
}
await walk(root);
const errors = [];
let checked = 0;
for (const file of files) {
  const relative = path.relative(root, file).split(path.sep).join('/');
  const pagePath = `${base}/${relative.replace(/index\.html$/, '')}`;
  const html = await readFile(file, 'utf8');
  for (const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    const raw = match[1].replaceAll('&amp;', '&');
    const url = new URL(raw, `${origin}${pagePath}`);
    if (!['http:', 'https:'].includes(url.protocol) || url.origin !== origin) continue;
    checked++;
    const pathname = decodeURIComponent(url.pathname);
    if (base && pathname !== base && !pathname.startsWith(`${base}/`)) {
      errors.push(`${relative}: base path外のリンク ${raw}`);
      continue;
    }
    let target = path.join(root, pathname.slice(base.length));
    try {
      if ((await stat(target)).isDirectory()) target = path.join(target, 'index.html');
      await stat(target);
      if (url.hash && target.endsWith('.html')) {
        const contents = await readFile(target, 'utf8');
        const anchor = decodeURIComponent(url.hash.slice(1));
        if (!contents.includes(`id="${anchor}"`)) throw new Error(`アンカーなし: ${anchor}`);
      }
    } catch (error) {
      errors.push(`${relative}: ${raw} (${error.message})`);
    }
  }
}
if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`内部リンク検証成功: ${files.length} HTML / ${checked} リンク・画像等 (base: ${base || '/'})`);
}
