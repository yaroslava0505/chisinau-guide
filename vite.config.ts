import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

/**
 * Public origin used for canonical URLs, hreflang and the sitemap.
 *
 * index.html carries `%VITE_SITE_URL%` placeholders, which Vite substitutes at
 * build time — so a crawler reading the raw HTML sees the real domain rather
 * than a hard-coded one the deployment does not use. A default is set here so
 * the placeholder is never left unresolved.
 */
const SITE_URL =
  process.env.VITE_SITE_URL ?? process.env.SITE_URL ?? 'https://chisinau-guide.com';
process.env.VITE_SITE_URL = SITE_URL;
process.env.SITE_URL = SITE_URL;

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // Honour a port assigned by the environment; 3000 is only the default
      // for a plain `npm run dev`.
      port: Number(process.env.PORT) || 3000,
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
