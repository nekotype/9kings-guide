import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Actionsではconfigure-pagesの出力を使用。ローカルではルートURLで動作します。
const site = process.env.SITE_URL || undefined;
const base = process.env.BASE_PATH || '/';

export default defineConfig({
  site,
  base,
  output: 'static',
  trailingSlash: 'always',
  integrations: site ? [sitemap()] : [],
});
