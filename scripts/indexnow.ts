/**
 * Notifies IndexNow that the catalogue has changed.
 *
 * IndexNow is a shared endpoint: one submission reaches Bing, Yandex, Seznam
 * and Naver at once. Those engines fetch the submitted URLs within days rather
 * than waiting to crawl the site on their own schedule. Google does not
 * participate — its indexing is driven by the sitemap and nothing here changes
 * that.
 *
 * Ownership is proved by a key file served from the site itself, so the script
 * checks that file is actually live before submitting. Without it the endpoint
 * accepts the request and silently discards it.
 *
 * Usage:  npm run indexnow            (submit every URL in the sitemap)
 *         npm run indexnow -- /ru     (submit selected paths only)
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { SITE_ORIGIN } from '../src/router';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const KEY = '88e8b8106ac6aaccd484380128ba79a8';
const KEY_LOCATION = `${SITE_ORIGIN}/${KEY}.txt`;
const ENDPOINT = 'https://api.indexnow.org/IndexNow';

/** IndexNow caps a single submission at 10 000 URLs. */
const MAX_URLS = 10_000;

function urlsFromSitemap(): string[] {
  const xml = readFileSync(join(root, 'dist', 'sitemap.xml'), 'utf8');
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
}

function urlsFromArgs(paths: string[]): string[] {
  return paths.map((path) => `${SITE_ORIGIN}${path.startsWith('/') ? path : `/${path}`}`);
}

async function main() {
  const args = process.argv.slice(2);
  const urlList = (args.length > 0 ? urlsFromArgs(args) : urlsFromSitemap()).slice(0, MAX_URLS);

  if (urlList.length === 0) {
    console.error('No URLs to submit — is dist/sitemap.xml built?');
    process.exit(1);
  }

  // The key file proves ownership. If it is missing the endpoint still answers
  // 200 and drops the submission, so failing loudly here is the only way to
  // tell the difference between "submitted" and "silently ignored".
  const keyCheck = await fetch(KEY_LOCATION);
  const keyBody = keyCheck.ok ? (await keyCheck.text()).trim() : '';
  if (keyBody !== KEY) {
    console.error(
      `Key file is not live at ${KEY_LOCATION} (HTTP ${keyCheck.status}).\n` +
        'Deploy the current build first — until then every submission is discarded.',
    );
    process.exit(1);
  }

  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({
      host: new URL(SITE_ORIGIN).host,
      key: KEY,
      keyLocation: KEY_LOCATION,
      urlList,
    }),
  });

  const body = await response.text();
  console.log(`IndexNow → HTTP ${response.status} ${response.statusText}`);
  console.log(`Submitted ${urlList.length} URLs for ${new URL(SITE_ORIGIN).host}`);
  if (body.trim()) console.log(body.trim());

  // 200 = accepted, 202 = accepted, key validation pending.
  if (![200, 202].includes(response.status)) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
