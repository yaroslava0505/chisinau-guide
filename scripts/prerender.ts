/**
 * Static pre-rendering for the SPA.
 *
 * A client-rendered app ships `<div id="root"></div>` and nothing else, so a
 * crawler that does not execute JavaScript sees a blank page — no headings, no
 * place names, no addresses. Google renders JS eventually, but on a second,
 * slower pass; most other crawlers (Bing, Yandex, social previews, LLM
 * fetchers) never do.
 *
 * This script writes one real HTML file per indexable URL: correct <title>,
 * description, canonical, hreflang set, Open Graph and JSON-LD in the head, and
 * the page's actual content inside #root. React replaces that content when it
 * mounts, so what a crawler reads and what a visitor sees are the same page —
 * progressive enhancement, not cloaking.
 *
 * Only facts already present on a record are rendered. Nothing is inferred.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { INITIAL_EVENTS, INITIAL_PLACES } from '../src/data/chisinauPlaces';
import { INITIAL_ARTICLES } from '../src/data/articles';
import { getDictionary } from '../src/i18n';
import { DEFAULT_LOCALE, LOCALES, LOCALE_META, type Locale } from '../src/i18n/types';
import { categoryCopy, districtLabel } from '../src/i18n/labels';
import { absoluteUrl, withLocale } from '../src/router';
import { localizeArticles, localizeEvents, localizePlaces } from '../src/utils/localize';
import {
  articleJsonLd,
  articlesIndexJsonLd,
  breadcrumbJsonLd,
  contactsJsonLd,
  eventJsonLd,
  getArticleImage,
  itemListJsonLd,
  placeJsonLd,
  privacyPolicyJsonLd,
  socialImageUrl,
  websiteJsonLd,
} from '../src/utils/seo';
import { formatOpeningHours } from '../src/utils/openingHours';
import { getPlaceImage } from '../src/utils/illustrations';
import type { Article, CategoryId, CityEvent, Place } from '../src/types';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const distDir = join(root, 'dist');

const esc = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/** `</script>` inside JSON would close the tag it lives in. */
const jsonLdScript = (data: unknown, id?: string): string =>
  `<script${id ? ` id="${id}"` : ''} type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;

/**
 * Must match `SCHEMA_SCRIPT_ID`/`BREADCRUMB_SCRIPT_ID` in src/utils/seo.ts:
 * on client-side route changes `updateSEO` looks up these ids to replace the
 * page schema in place. Without them, SPA navigation finds no match and
 * appends duplicate scripts instead — leaving the previous page's schema
 * stale in the DOM alongside the new one.
 */
const SCHEMA_SCRIPT_ID = 'schema-structured-data';
const BREADCRUMB_SCRIPT_ID = 'schema-breadcrumb-data';

const CATEGORIES: CategoryId[] = [
  'remote_work',
  'quiet_places',
  'cafes',
  'food',
  'walks',
  'activities',
  'shopping_centers',
];

const placePath = (place: Place): string =>
  `/${place.category.replace('_', '-')}/${place.slug}`;

interface PageContent {
  path: string;
  title: string;
  description: string;
  heading: string;
  subtitle?: string;
  /** Rendered inside #root, below the heading. */
  body: string;
  jsonLd: unknown;
  /** Falls back to the site-wide default (set in index.html) when absent. */
  image?: string;
  /** Default is `index, follow` (the value already in the template). */
  noindex?: boolean;
}

/* ------------------------------------------------------------------ */
/* Content blocks                                                      */
/* ------------------------------------------------------------------ */

/**
 * One catalogue entry as a crawlable block: a linked name plus the facts the
 * record actually carries. Absent fields are omitted rather than filled in.
 */
function placeItem(place: Place, locale: Locale): string {
  const t = getDictionary(locale);
  const href = withLocale(placePath(place), locale);

  const facts = [
    place.subcategory,
    districtLabel(t, place.district),
    place.address,
    place.opening_hours ? formatOpeningHours(place.opening_hours, t.common) : null,
  ].filter((value): value is string => Boolean(value));

  return `<li>
        <h3><a href="${esc(href)}">${esc(place.name)}</a></h3>
        <p>${esc(facts.join(' · '))}</p>
        <p>${esc(place.description)}</p>
      </li>`;
}

function placeList(places: Place[], locale: Locale): string {
  if (places.length === 0) return '';
  return `<ul>\n      ${places.map((place) => placeItem(place, locale)).join('\n      ')}\n    </ul>`;
}

function articleItem(article: Article, locale: Locale): string {
  const href = withLocale(`/articles/${article.slug}`, locale);
  return `<li>
        <h3><a href="${esc(href)}">${esc(article.title)}</a></h3>
        <p>${esc(article.excerpt)}</p>
      </li>`;
}

function articleList(articles: Article[], locale: Locale): string {
  if (articles.length === 0) return '';
  return `<ul>\n      ${articles.map((article) => articleItem(article, locale)).join('\n      ')}\n    </ul>`;
}

/** The detail page's own paragraphs, plus the real places it links out to. */
function articleDetail(article: Article, locale: Locale): string {
  const t = getDictionary(locale);
  const paragraphs = article.body.map((paragraph) => `<p>${esc(paragraph)}</p>`).join('\n    ');

  const related = INITIAL_PLACES.filter((place) => article.placeSlugs.includes(place.slug));
  const localizedRelated = localizePlaces(related, locale);

  return `${paragraphs}
    ${
      localizedRelated.length > 0
        ? `<h2>${esc(t.articles.relatedPlacesTitle)}</h2>\n    ${placeList(localizedRelated, locale)}`
        : ''
    }`;
}

function eventItem(event: CityEvent, locale: Locale): string {
  const facts = [event.date, event.location_name, event.address, event.price].filter(Boolean);
  return `<li>
        <h3>${esc(event.title)}</h3>
        <p>${esc(facts.join(' · '))}</p>
        <p>${esc(event.description)}</p>
      </li>`;
}

/** The detail page's own facts, as a definition list. */
function placeDetail(place: Place, locale: Locale): string {
  const t = getDictionary(locale);
  const rows: [string, string][] = [];

  // Field labels are reused from the editor's dictionary: they are the same
  // nouns ("Address", "Opening hours") and are already translated everywhere.
  rows.push([t.filters.district, districtLabel(t, place.district)]);
  if (place.address) rows.push([t.admin.fields.address, place.address]);
  if (place.opening_hours) {
    rows.push([t.admin.fields.openingHours, formatOpeningHours(place.opening_hours, t.common)]);
  }
  if (place.website) rows.push([t.detail.website, place.website]);
  if (place.source?.name) rows.push([t.detail.source, place.source.name]);

  const definitions = rows
    .map(([term, value]) => `      <dt>${esc(term)}</dt><dd>${esc(value)}</dd>`)
    .join('\n');

  const nearby = INITIAL_PLACES.filter(
    (item) => item.category === place.category && item.id !== place.id,
  ).slice(0, 6);

  const localizedNearby = localizePlaces(nearby, locale);
  const copy = categoryCopy(getDictionary(locale), place.category);

  return `<p>${esc(place.description)}</p>
    <dl>
${definitions}
    </dl>
    ${
      localizedNearby.length > 0
        ? `<h2>${esc(copy?.h1 ?? '')}</h2>\n    ${placeList(localizedNearby, locale)}`
        : ''
    }`;
}

/* ------------------------------------------------------------------ */
/* Page definitions                                                    */
/* ------------------------------------------------------------------ */

function pagesForLocale(locale: Locale): PageContent[] {
  const t = getDictionary(locale);
  const places = localizePlaces(INITIAL_PLACES, locale);
  const events = localizeEvents(INITIAL_EVENTS, locale);
  const articles = localizeArticles(INITIAL_ARTICLES, locale);
  const pages: PageContent[] = [];

  // Home — the whole catalogue is reachable from here in one hop.
  pages.push({
    path: '/',
    title: t.seo.homeTitle,
    description: t.seo.homeDescription,
    heading: t.hero.h1,
    subtitle: t.hero.subtitle,
    body: `<nav><ul>${CATEGORIES.map((id) => {
      const copy = categoryCopy(t, id)!;
      return `<li><a href="${esc(withLocale(`/${id.replace('_', '-')}`, locale))}">${esc(copy.h1)}</a></li>`;
    }).join('')}<li><a href="${esc(withLocale('/events', locale))}">${esc(
      categoryCopy(t, 'events')!.h1,
    )}</a></li><li><a href="${esc(withLocale('/map', locale))}">${esc(t.seo.mapTitle)}</a></li></ul></nav>
    ${
      articles.length > 0
        ? `<h2>${esc(t.articles.homeTitle)}</h2>\n    ${articleList(articles, locale)}`
        : ''
    }
    ${placeList(places, locale)}`,
    jsonLd: websiteJsonLd(locale),
  });

  // One page per category.
  CATEGORIES.forEach((id) => {
    const copy = categoryCopy(t, id)!;
    const path = `/${id.replace('_', '-')}`;
    const inCategory = places.filter((place) => place.category === id);
    pages.push({
      path,
      title: copy.seoTitle,
      description: copy.seoDescription,
      heading: copy.h1,
      subtitle: copy.subtitle,
      body: placeList(inCategory, locale),
      jsonLd: itemListJsonLd(inCategory, absoluteUrl(withLocale(path, locale)), copy.h1, locale),
      image: inCategory[0] ? getPlaceImage(inCategory[0]) : undefined,
    });
  });

  const eventsCopy = categoryCopy(t, 'events')!;
  pages.push({
    path: '/events',
    title: eventsCopy.seoTitle,
    description: eventsCopy.seoDescription,
    heading: eventsCopy.h1,
    subtitle: eventsCopy.subtitle,
    // An empty catalogue renders the same "nothing scheduled" line the app
    // shows. Inventing an afisha to fill the page is not an option.
    body:
      events.length > 0
        ? `<ul>\n      ${events.map((event) => eventItem(event, locale)).join('\n      ')}\n    </ul>`
        : `<p>${esc(t.events.emptyTitle)}. ${esc(t.events.emptyText)}</p>`,
    jsonLd: events.map((event) =>
      eventJsonLd(event, absoluteUrl(withLocale('/events', locale)), locale),
    ),
    image: events[0]?.image,
  });

  pages.push({
    path: '/map',
    title: t.seo.mapTitle,
    description: t.seo.mapDescription,
    heading: t.seo.mapTitle,
    subtitle: t.seo.mapDescription,
    body: placeList(places, locale),
    jsonLd: itemListJsonLd(places, absoluteUrl(withLocale('/map', locale)), t.seo.mapTitle, locale),
    image: places[0] ? getPlaceImage(places[0]) : undefined,
  });

  pages.push({
    path: '/privacy',
    title: t.privacy.title,
    description: t.privacy.seoDescription,
    heading: t.privacy.title,
    subtitle: t.privacy.intro,
    body: `<p>${esc(t.privacy.updated(new Date().toISOString().slice(0, 10)))}</p>
    <h2>${esc(t.privacy.noDataTitle)}</h2>
    <p>${esc(t.privacy.noDataText)}</p>
    <h2>${esc(t.privacy.localStorageTitle)}</h2>
    <p>${esc(t.privacy.localStorageText)}</p>
    <h2>${esc(t.privacy.formTitle)}</h2>
    <p>${esc(t.privacy.formText)}</p>
    <h2>${esc(t.privacy.hostingTitle)}</h2>
    <p>${esc(t.privacy.hostingText)}</p>
    <h2>${esc(t.privacy.contactTitle)}</h2>
    <p>${esc(t.privacy.contactText)} myyarosfilm@gmail.com</p>`,
    jsonLd: privacyPolicyJsonLd(locale),
  });

  pages.push({
    path: '/contacts',
    title: t.contacts.title,
    description: t.contacts.seoDescription,
    heading: t.contacts.title,
    subtitle: t.contacts.intro,
    body: `<p>${esc(t.contacts.emailLabel)}: <a href="mailto:myyarosfilm@gmail.com">myyarosfilm@gmail.com</a></p>
    <h2>${esc(t.contacts.formTitle)}</h2>
    <p>${esc(t.contacts.formSubtitle)}</p>`,
    jsonLd: contactsJsonLd(locale),
  });

  pages.push({
    path: '/articles',
    title: t.articles.indexTitle,
    description: t.articles.seoIndexDescription,
    heading: t.articles.indexTitle,
    subtitle: t.articles.indexSubtitle,
    body: articleList(articles, locale),
    jsonLd: articlesIndexJsonLd(articles, absoluteUrl(withLocale('/articles', locale)), locale),
  });

  // One page per article.
  articles.forEach((article) => {
    const path = `/articles/${article.slug}`;
    pages.push({
      path,
      title: article.title,
      description: article.excerpt,
      heading: article.title,
      subtitle: article.excerpt,
      body: articleDetail(article, locale),
      jsonLd: articleJsonLd(article, absoluteUrl(withLocale(path, locale)), locale),
      image: getArticleImage(article),
    });
  });

  // One page per place.
  places.forEach((place) => {
    const path = placePath(place);
    pages.push({
      path,
      title: `${place.name} — ${place.subcategory}`,
      description: place.description.slice(0, 300),
      heading: place.name,
      subtitle: `${place.subcategory} · ${districtLabel(t, place.district)}`,
      body: placeDetail(place, locale),
      jsonLd: placeJsonLd(place, absoluteUrl(withLocale(path, locale)), locale),
      image: getPlaceImage(place),
    });
  });

  return pages;
}

/* ------------------------------------------------------------------ */
/* HTML assembly                                                       */
/* ------------------------------------------------------------------ */

const template = readFileSync(join(distDir, 'index.html'), 'utf8');

function render(page: PageContent, locale: Locale): string {
  const t = getDictionary(locale);
  const meta = LOCALE_META[locale];
  const siteName = t.common.siteName;
  const fullTitle = page.title.includes(siteName) ? page.title : `${page.title} | ${siteName}`;
  const canonical = absoluteUrl(withLocale(page.path, locale));

  const hreflang = [
    ...LOCALES.map(
      (other) =>
        `<link rel="alternate" hreflang="${LOCALE_META[other].htmlLang}" href="${esc(
          absoluteUrl(withLocale(page.path, other)),
        )}" />`,
    ),
    `<link rel="alternate" hreflang="x-default" href="${esc(
      absoluteUrl(withLocale(page.path, DEFAULT_LOCALE)),
    )}" />`,
  ].join('\n    ');

  let html = template;

  html = html.replace('<html lang="uk"', `<html lang="${meta.htmlLang}"`);
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(fullTitle)}</title>`);
  html = html.replace(
    /<link rel="canonical"[^>]*>/,
    `<link rel="canonical" href="${esc(canonical)}" />`,
  );
  html = html.replace(/\s*<link rel="alternate" hreflang="[^"]*"[^>]*>/g, '');
  html = html.replace('<link rel="canonical"', `${hreflang}\n    <link rel="canonical"`);

  const replaceMeta = (attr: string, key: string, value: string) => {
    const pattern = new RegExp(`<meta ${attr}="${key}"[^>]*>`);
    const tag = `<meta ${attr}="${key}" content="${esc(value)}" />`;
    html = pattern.test(html) ? html.replace(pattern, tag) : html.replace('</head>', `  ${tag}\n</head>`);
  };

  replaceMeta('name', 'description', page.description);
  replaceMeta('name', 'robots', page.noindex ? 'noindex, follow' : 'index, follow');
  replaceMeta('property', 'og:title', fullTitle);
  replaceMeta('property', 'og:description', page.description);
  replaceMeta('property', 'og:url', canonical);
  replaceMeta('property', 'og:locale', meta.ogLocale);
  replaceMeta('property', 'og:site_name', siteName);
  replaceMeta('name', 'twitter:title', fullTitle);
  replaceMeta('name', 'twitter:description', page.description);
  // Without its own image, a page keeps the site-wide default already in the
  // template rather than this tag being removed or left empty.
  if (page.image) {
    const social = socialImageUrl(page.image);
    replaceMeta('property', 'og:image', social);
    replaceMeta('name', 'twitter:image', social);
    replaceMeta('property', 'og:image:width', '1200');
    replaceMeta('property', 'og:image:height', '630');
  }

  // Replace the site-wide City block with this page's own structured data.
  html = html.replace(
    /<script type="application\/ld\+json">[\s\S]*?<\/script>/,
    `${jsonLdScript(page.jsonLd, SCHEMA_SCRIPT_ID)}\n    ${jsonLdScript(breadcrumbJsonLd(page.path, locale, page.heading), BREADCRUMB_SCRIPT_ID)}`,
  );

  const content = `<main>
    <h1>${esc(page.heading)}</h1>
    ${page.subtitle ? `<p>${esc(page.subtitle)}</p>` : ''}
    ${page.body}
  </main>`;

  return html.replace('<div id="root"></div>', `<div id="root">${content}</div>`);
}

/* ------------------------------------------------------------------ */

let written = 0;

LOCALES.forEach((locale) => {
  pagesForLocale(locale).forEach((page) => {
    const urlPath = withLocale(page.path, locale);
    const html = render(page, locale);

    // Two files per URL, because a host may resolve an extensionless path
    // either way:
    //
    //   /ru        → ru.html          (sibling file — what canonical points at)
    //   /ru/       → ru/index.html    (directory index)
    //
    // Only the directory form was shipped first, and Netlify's catch-all SPA
    // rewrite claimed `/ru` before its directory lookup ran — so the exact URL
    // in every canonical tag and in the sitemap served the empty SPA shell.
    // A real file always wins over a redirect rule, so the sibling file is the
    // one that fixes it; the directory index keeps trailing-slash links working.
    const targets =
      urlPath === '/'
        ? [join(distDir, 'index.html')]
        : [join(distDir, `${urlPath}.html`), join(distDir, urlPath, 'index.html')];

    targets.forEach((target) => {
      mkdirSync(dirname(target), { recursive: true });
      writeFileSync(target, html, 'utf8');
    });
    written += 1;
  });
});

// A real 404 for any path that isn't one of the pages above (see
// `public/_redirects`, which points unmatched requests here with HTTP 404 —
// without that, every bad URL served the home page with status 200, a
// textbook soft-404). The SPA still mounts: `parsePath` classifies whatever
// the visitor actually typed as `notfound` client-side and renders the same
// message, regardless of what generic URL this static file was built for.
const notFoundT = getDictionary(DEFAULT_LOCALE);
const notFoundPage: PageContent = {
  path: '/404',
  title: notFoundT.seo.notFoundTitle,
  description: notFoundT.seo.notFoundDescription,
  heading: notFoundT.seo.notFoundTitle,
  subtitle: notFoundT.seo.notFoundText,
  body: `<p><a href="/">${esc(notFoundT.seo.notFoundBackHome)}</a></p>`,
  jsonLd: {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: notFoundT.seo.notFoundTitle,
  },
  noindex: true,
};
writeFileSync(join(distDir, '404.html'), render(notFoundPage, DEFAULT_LOCALE), 'utf8');

console.log(`Prerendered ${written} pages → dist/ (+ 404.html)`);
