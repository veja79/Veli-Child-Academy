import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

/** Used when VITE_SITE_URL is not set (for example if a host ignores .env files). */
const DEFAULT_SITE_URL = 'https://veli-child-academy-website.sphesihle7910.workers.dev';

/** Public pages listed in sitemap.xml, with their priority. */
const PAGES: [path: string, priority: string][] = [
  ['/', '1.0'],
  ['/register', '0.9'],
  ['/contact', '0.9'],
  ['/about', '0.8'],
  ['/announcements', '0.8'],
  ['/gallery', '0.6'],
  ['/privacy', '0.3'],
];

/** Writes sitemap.xml and robots.txt using VITE_SITE_URL, so the site address lives in one place. */
function seoFiles(siteUrl: string): Plugin {
  const base = siteUrl.replace(/\/$/, '');
  return {
    name: 'veli-seo-files',
    apply: 'build',
    // Fill in %VITE_SITE_URL% ourselves, so it is never left as a placeholder in the built page.
    transformIndexHtml: {
      order: 'pre',
      handler: (html) => html.replaceAll('%VITE_SITE_URL%', base),
    },
    generateBundle() {
      const today = new Date().toISOString().slice(0, 10);
      const urls = PAGES.map(
        ([path, priority]) => `  <url><loc>${base}${path}</loc><lastmod>${today}</lastmod><priority>${priority}</priority></url>`,
      ).join('\n');
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
      });
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: `User-agent: *\nAllow: /\nDisallow: /admin\n\nSitemap: ${base}/sitemap.xml\n`,
      });
    },
  };
}

// During development, /api calls are forwarded to the Spring Boot backend.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', 'VITE_');
  const siteUrl = env.VITE_SITE_URL || (mode === 'development' ? 'http://localhost:5173' : DEFAULT_SITE_URL);
  return {
    plugins: [react(), seoFiles(siteUrl)],
    server: {
      port: 5173,
      proxy: {
        '/api': 'http://localhost:8080',
      },
    },
  };
});
