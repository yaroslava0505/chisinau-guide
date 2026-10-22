import type { CategoryId, CityEvent, Place } from '../types';
import { SITE_ORIGIN, absoluteUrl, withLocale } from '../router';
import { nextOccurrence, toIsoDate } from './events';
import { DEFAULT_LOCALE, LOCALES, LOCALE_META, type Locale } from '../i18n/types';
import { getDictionary } from '../i18n';
import { categoryCopy } from '../i18n/labels';
import { getPlaceImage } from './illustrations';

const SCHEMA_SCRIPT_ID = 'schema-structured-data';
/** Must match the id `scripts/prerender.ts` gives the breadcrumb script. */
const BREADCRUMB_SCRIPT_ID = 'schema-breadcrumb-data';
const HREFLANG_CLASS = 'hreflang-alternate';

function upsertMeta(selector: string, attr: 'name' | 'property', key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attr, key);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

/**
 * Re-crops an Unsplash URL to the exact 1200×630 the `og:image:width`/
 * `og:image:height` tags claim. Without this, a page-specific image (served
 * at a different size for its in-app card/detail use) would contradict the
 * dimensions those tags advertise.
 */
export function socialImageUrl(url: string): string {
  const [base] = url.split('?');
  return `${base}?q=80&w=1200&h=630&fit=crop`;
}

function upsertCanonical(href: string) {
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
}

/**
 * Publishes `<link rel="alternate" hreflang>` for every language of the page,
 * plus an x-default pointing at the Ukrainian version served from the root.
 */
function upsertHreflang(basePath: string) {
  // Removes the static tags shipped in index.html as well as the ones from a
  // previous route, so a page never advertises two conflicting alternate sets.
  document.head
    .querySelectorAll('link[rel="alternate"][hreflang]')
    .forEach((node) => node.remove());

  const add = (hreflang: string, href: string) => {
    const link = document.createElement('link');
    link.className = HREFLANG_CLASS;
    link.setAttribute('rel', 'alternate');
    link.setAttribute('hreflang', hreflang);
    link.setAttribute('href', href);
    document.head.appendChild(link);
  };

  LOCALES.forEach((locale) => {
    add(LOCALE_META[locale].htmlLang, absoluteUrl(withLocale(basePath, locale)));
  });
  add('x-default', absoluteUrl(withLocale(basePath, DEFAULT_LOCALE)));
}

function upsertScriptJsonLd(id: string, data: unknown) {
  let script = document.getElementById(id);
  if (!script) {
    script = document.createElement('script');
    script.id = id;
    script.setAttribute('type', 'application/ld+json');
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data);
}

/**
 * Picks the most specific Schema.org type the catalogue can justify.
 * Nothing here is inferred beyond `venue_type` / `activity_type`, which are
 * explicit fields on the record.
 */
export function schemaTypeForPlace(place: Place): string {
  if (place.activity_type === 'museum') return 'Museum';
  switch (place.venue_type) {
    case 'cafe':
    case 'bakery':
      return 'CafeOrCoffeeShop';
    case 'restaurant':
    case 'bistro':
      return 'Restaurant';
    case 'park':
    case 'nature':
      return 'Park';
    case 'library':
      return 'Library';
    case 'culture':
      return 'TouristAttraction';
    case 'coworking':
    default:
      return 'LocalBusiness';
  }
}

export function placeJsonLd(place: Place, canonical: string, locale: Locale = DEFAULT_LOCALE) {
  const type = schemaTypeForPlace(place);
  const isBusiness = !['Park', 'TouristAttraction'].includes(type);

  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': type,
    name: place.name,
    description: place.description,
    url: canonical,
    inLanguage: LOCALE_META[locale].htmlLang,
    image: [getPlaceImage(place)],
    address: {
      '@type': 'PostalAddress',
      streetAddress: place.address,
      addressLocality: 'Chișinău',
      addressRegion: place.district,
      addressCountry: 'MD',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: place.latitude,
      longitude: place.longitude,
    },
  };

  // Only emit contact and price data that actually exists on the record.
  if (place.phone) data.telephone = place.phone;
  if (place.website) data.sameAs = [place.website];
  if (place.opening_hours) data.openingHours = place.opening_hours;
  if (isBusiness && place.price_level) data.priceRange = '$'.repeat(place.price_level);

  // NOTE: no aggregateRating is emitted. The catalogue has no user reviews,
  // and publishing invented ratings would be both wrong and a policy breach.
  return data;
}

export function eventJsonLd(event: CityEvent, canonical: string, locale: Locale = DEFAULT_LOCALE) {
  const occurrence = nextOccurrence(event) ?? new Date();
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    description: event.description,
    inLanguage: LOCALE_META[locale].htmlLang,
    startDate: toIsoDate(occurrence),
    endDate: event.end_date_iso ?? toIsoDate(occurrence),
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    image: event.image,
    url: canonical,
    location: {
      '@type': 'Place',
      name: event.location_name,
      address: {
        '@type': 'PostalAddress',
        streetAddress: event.address,
        addressLocality: 'Chișinău',
        addressCountry: 'MD',
      },
    },
    ...(event.free_entry ? { isAccessibleForFree: true } : {}),
  };
}

export function websiteJsonLd(locale: Locale = DEFAULT_LOCALE) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: getDictionary(locale).common.siteName,
    url: absoluteUrl(withLocale('/', locale)),
    inLanguage: LOCALE_META[locale].htmlLang,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_ORIGIN}/?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * Shared by the client (`updateSEO` on SPA navigation) and `scripts/prerender.ts`
 * (the static HTML a non-JS crawler sees) so both describe the same page as the
 * same entity — without this, a client-side route change to /privacy or
 * /contacts fell back to `websiteJsonLd`, asserting the *homepage's* URL as
 * structured data on a different page.
 */
export function privacyPolicyJsonLd(locale: Locale = DEFAULT_LOCALE) {
  const t = getDictionary(locale);
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: t.privacy.title,
    description: t.privacy.seoDescription,
    url: absoluteUrl(withLocale('/privacy', locale)),
    inLanguage: LOCALE_META[locale].htmlLang,
  };
}

export function contactsJsonLd(locale: Locale = DEFAULT_LOCALE) {
  const t = getDictionary(locale);
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: t.contacts.title,
    description: t.contacts.seoDescription,
    url: absoluteUrl(withLocale('/contacts', locale)),
    inLanguage: LOCALE_META[locale].htmlLang,
    mainEntity: {
      '@type': 'Organization',
      name: t.common.siteName,
      email: 'myyarosfilm@gmail.com',
    },
  };
}

/**
 * Mirrors `breadcrumbJsonLd` in `scripts/prerender.ts` exactly, so the trail
 * a crawler sees on first load matches what a real visitor's browser shows
 * after SPA navigation. `leafName` is only used for two-segment paths (place
 * detail pages); other routes' own name already comes from the category
 * segment.
 */
export function breadcrumbJsonLd(path: string, locale: Locale = DEFAULT_LOCALE, leafName?: string) {
  const t = getDictionary(locale);
  const segments = path.split('/').filter(Boolean);
  const items = [{ name: t.common.siteName, path: '/' }];

  if (segments.length >= 1) {
    const copy = categoryCopy(t, segments[0].replace('-', '_') as CategoryId);
    if (copy) items.push({ name: copy.name, path: `/${segments[0]}` });
  }
  if (segments.length === 2 && leafName) items.push({ name: leafName, path });

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(withLocale(item.path, locale)),
    })),
  };
}

export function itemListJsonLd(
  places: Place[],
  canonical: string,
  name: string,
  locale: Locale = DEFAULT_LOCALE,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    url: canonical,
    inLanguage: LOCALE_META[locale].htmlLang,
    numberOfItems: places.length,
    itemListElement: places.slice(0, 20).map((place, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: place.name,
      url: absoluteUrl(withLocale(`/${place.category.replace('_', '-')}/${place.slug}`, locale)),
    })),
  };
}

export interface SeoOptions {
  title: string;
  description: string;
  /** Locale-less path of the current route, e.g. `/cafes/molka`. */
  path: string;
  locale: Locale;
  image?: string;
  /** Pre-built structured data for this page. */
  jsonLd?: unknown;
  /** Place/page name for the breadcrumb's leaf item, e.g. a place's own name. */
  breadcrumbLeaf?: string;
  /** Set for pages that must not be indexed (admin, favourites, unknown paths). */
  noindex?: boolean;
}

export function updateSEO({
  title,
  description,
  path,
  locale,
  image,
  jsonLd,
  breadcrumbLeaf,
  noindex,
}: SeoOptions) {
  const siteName = getDictionary(locale).common.siteName;
  const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`;
  const canonical = absoluteUrl(withLocale(path, locale));

  document.documentElement.lang = LOCALE_META[locale].htmlLang;
  document.title = fullTitle;

  upsertMeta('meta[name="description"]', 'name', 'description', description);
  upsertMeta('meta[property="og:title"]', 'property', 'og:title', fullTitle);
  upsertMeta('meta[property="og:description"]', 'property', 'og:description', description);
  upsertMeta('meta[property="og:url"]', 'property', 'og:url', canonical);
  upsertMeta('meta[property="og:type"]', 'property', 'og:type', 'website');
  upsertMeta('meta[property="og:site_name"]', 'property', 'og:site_name', siteName);
  upsertMeta('meta[property="og:locale"]', 'property', 'og:locale', LOCALE_META[locale].ogLocale);
  upsertMeta('meta[name="twitter:title"]', 'name', 'twitter:title', fullTitle);
  upsertMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description);

  if (image) {
    const social = socialImageUrl(image);
    upsertMeta('meta[property="og:image"]', 'property', 'og:image', social);
    upsertMeta('meta[name="twitter:image"]', 'name', 'twitter:image', social);
    upsertMeta('meta[property="og:image:width"]', 'property', 'og:image:width', '1200');
    upsertMeta('meta[property="og:image:height"]', 'property', 'og:image:height', '630');
  }

  upsertMeta(
    'meta[name="robots"]',
    'name',
    'robots',
    noindex ? 'noindex, nofollow' : 'index, follow',
  );

  upsertCanonical(canonical);
  upsertHreflang(path);
  upsertScriptJsonLd(SCHEMA_SCRIPT_ID, jsonLd ?? websiteJsonLd(locale));
  upsertScriptJsonLd(BREADCRUMB_SCRIPT_ID, breadcrumbJsonLd(path, locale, breadcrumbLeaf));
}

/* ------------------------------------------------------------------ */
/* Sitemap & robots                                                    */
/* ------------------------------------------------------------------ */

/**
 * Indexable pages only.
 *
 * `/favorites` and `/admin` are deliberately absent: both are served with
 * `noindex`, and listing a noindex page in the sitemap tells a crawler two
 * contradictory things about the same URL.
 */
const STATIC_PATHS = [
  '/',
  '/remote-work',
  '/quiet-places',
  '/cafes',
  '/food',
  '/walks',
  '/activities',
  '/events',
  '/map',
  '/privacy',
  '/contacts',
];

/** Locale-less paths of every indexable page. */
export function collectSitemapPaths(places: Place[]): string[] {
  return [
    ...STATIC_PATHS,
    ...places.map((place) => `/${place.category.replace('_', '-')}/${place.slug}`),
  ];
}

export function generateSitemapXml(places: Place[], lastmod = new Date()): string {
  const stamp = toIsoDate(lastmod);
  const placeByPath = new Map(
    places.map((place) => [`/${place.category.replace('_', '-')}/${place.slug}`, place]),
  );

  const entries = collectSitemapPaths(places).flatMap((path) => {
    const place = placeByPath.get(path);
    const alternates = LOCALES.map(
      (locale) =>
        `    <xhtml:link rel="alternate" hreflang="${LOCALE_META[locale].htmlLang}" href="${absoluteUrl(withLocale(path, locale))}"/>`,
    ).join('\n');
    // Lets Google Images attribute the illustration (or real photo, once one
    // exists) shown on the page back to this URL.
    const image = place
      ? `\n    <image:image><image:loc>${socialImageUrl(getPlaceImage(place))}</image:loc></image:image>`
      : '';

    // Every language of a page is its own URL, each declaring the full set.
    return LOCALES.map(
      (locale) => `  <url>
    <loc>${absoluteUrl(withLocale(path, locale))}</loc>
${alternates}${image}
    <lastmod>${stamp}</lastmod>
    <changefreq>${place ? 'weekly' : 'daily'}</changefreq>
    <priority>${path === '/' ? '1.0' : place ? '0.7' : '0.9'}</priority>
  </url>`,
    );
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${entries.join('\n')}
</urlset>
`;
}

export function generateRobotsTxt(): string {
  const adminPaths = LOCALES.map((locale) => `Disallow: ${withLocale('/admin', locale)}`).join('\n');
  const favoritePaths = LOCALES.map((locale) => `Disallow: ${withLocale('/favorites', locale)}`).join('\n');

  return `User-agent: *
Allow: /
${adminPaths}
${favoritePaths}

Sitemap: ${SITE_ORIGIN}/sitemap.xml
`;
}
