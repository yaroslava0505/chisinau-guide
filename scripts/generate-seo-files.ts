/**
 * Writes public/sitemap.xml and public/robots.txt from the catalogue so the
 * files shipped in `dist/` always match the data. Run automatically by
 * `npm run build`, or on demand via `npm run seo:files`.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { INITIAL_PLACES } from '../src/data/chisinauPlaces';
import { generateRobotsTxt, generateSitemapXml } from '../src/utils/seo';
import { SITE_ORIGIN } from '../src/router';

const here = dirname(fileURLToPath(import.meta.url));
const publicDir = resolve(here, '..', 'public');

mkdirSync(publicDir, { recursive: true });

writeFileSync(resolve(publicDir, 'sitemap.xml'), generateSitemapXml(INITIAL_PLACES), 'utf8');
writeFileSync(resolve(publicDir, 'robots.txt'), generateRobotsTxt(), 'utf8');

console.log(`SEO files written for ${INITIAL_PLACES.length} places → public/ (origin: ${SITE_ORIGIN})`);

if (SITE_ORIGIN.includes('chisinau.guide')) {
  console.warn(
    '\n  ⚠ SITE_URL is not set, so the sitemap points at the default domain.\n' +
    '    A sitemap may only list URLs on its own host — set SITE_URL before building.\n',
  );
}
