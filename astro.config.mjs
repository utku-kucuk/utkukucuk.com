// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://utkukucuk.com',
  trailingSlash: 'ignore',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'tr'],
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    mdx(),
    sitemap({
      i18n: { defaultLocale: 'en', locales: { en: 'en', tr: 'tr' } },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
