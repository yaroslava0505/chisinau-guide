import { useCallback, useSyncExternalStore } from 'react';
import type { CategoryId, PlaceCategoryId } from './types';
import { CATEGORY_META, categoryById, categoryBySlug } from './data/taxonomy';
import { DEFAULT_LOCALE, LOCALE_META, isLocale, type Locale } from './i18n/types';

/* ------------------------------------------------------------------ */
/* Route model                                                         */
/* ------------------------------------------------------------------ */

export type Route =
  | { view: 'home' }
  | { view: 'category'; category: PlaceCategoryId }
  | { view: 'place'; category: PlaceCategoryId; slug: string }
  | { view: 'events' }
  | { view: 'map' }
  | { view: 'favorites' }
  | { view: 'privacy' }
  | { view: 'contacts' }
  | { view: 'admin' }
  | { view: 'notfound'; path: string };

/**
 * The admin panel has no authentication, and cannot have real authentication
 * without a backend — a login form on the client would only look like a lock.
 * So it is not part of a public build at all: set `VITE_ENABLE_ADMIN=true`
 * locally to work with the catalogue, and leave it unset when deploying.
 */
function readAdminFlag(): boolean {
  try {
    // `import.meta.env` only exists in a Vite bundle; tests import this module
    // through plain Node, where touching it would throw.
    return import.meta.env?.VITE_ENABLE_ADMIN === 'true';
  } catch {
    return false;
  }
}

export const ADMIN_ENABLED = readAdminFlag();

const STATIC_ROUTES: Record<string, Route> = {
  '': { view: 'home' },
  events: { view: 'events' },
  map: { view: 'map' },
  favorites: { view: 'favorites' },
  privacy: { view: 'privacy' },
  contacts: { view: 'contacts' },
  ...(ADMIN_ENABLED ? { admin: { view: 'admin' as const } } : {}),
};

const PLACE_CATEGORY_SLUGS = CATEGORY_META.filter((c) => c.id !== 'events');

/**
 * Splits a leading locale segment off a path.
 * Ukrainian is served from the root, so `/cafes` and `/ru/cafes` are the same
 * page in two languages.
 */
export function splitLocale(pathname: string): { locale: Locale; rest: string } {
  const segments = pathname.replace(/^\/+|\/+$/g, '').split('/').filter(Boolean);
  const [first, ...others] = segments;

  if (first && isLocale(first) && first !== DEFAULT_LOCALE) {
    return { locale: first, rest: `/${others.join('/')}` };
  }

  // `/uk/...` is a valid alias for the root locale; treat it as such.
  if (first === DEFAULT_LOCALE) {
    return { locale: DEFAULT_LOCALE, rest: `/${others.join('/')}` };
  }

  return { locale: DEFAULT_LOCALE, rest: pathname };
}

/** `/ru/remote-work/tucano` → { view: 'place', category: 'remote_work', slug: 'tucano' } */
export function parsePath(pathname: string): Route {
  const { rest } = splitLocale(pathname);
  const segments = rest.replace(/^\/+|\/+$/g, '').split('/').filter(Boolean);

  if (segments.length === 0) return { view: 'home' };

  const [first, second] = segments;

  if (segments.length === 1 && first in STATIC_ROUTES) {
    return STATIC_ROUTES[first];
  }

  const meta = categoryBySlug(first);
  if (meta && meta.id !== 'events') {
    const category = meta.id as PlaceCategoryId;
    if (segments.length === 1) return { view: 'category', category };
    if (segments.length === 2) return { view: 'place', category, slug: second };
  }

  return { view: 'notfound', path: pathname };
}

export function localeFromPath(pathname: string): Locale {
  return splitLocale(pathname).locale;
}

/** Prefixes a locale-less path, e.g. `/cafes` + `ru` → `/ru/cafes`. */
export function withLocale(path: string, locale: Locale): string {
  const prefix = LOCALE_META[locale].prefix;
  if (!prefix) return path;
  return path === '/' ? prefix : `${prefix}${path}`;
}

/** Same page, different language — used by the language switcher. */
export function swapLocale(pathname: string, locale: Locale): string {
  return withLocale(splitLocale(pathname).rest || '/', locale);
}

export function buildPath(route: Route, locale: Locale = DEFAULT_LOCALE): string {
  const base = (() => {
    switch (route.view) {
      case 'home':
        return '/';
      case 'category':
        return `/${categoryById(route.category)?.slug ?? ''}`;
      case 'place':
        return `/${categoryById(route.category)?.slug ?? ''}/${route.slug}`;
      case 'events':
        return '/events';
      case 'map':
        return '/map';
      case 'favorites':
        return '/favorites';
      case 'privacy':
        return '/privacy';
      case 'contacts':
        return '/contacts';
      case 'admin':
        return '/admin';
      default:
        return route.path;
    }
  })();

  return withLocale(base, locale);
}

/** Path for a category id, including the `all` pseudo-category (the home feed). */
export function categoryPath(category: CategoryId, locale: Locale = DEFAULT_LOCALE): string {
  if (category === 'all') return withLocale('/', locale);
  if (category === 'events') return withLocale('/events', locale);
  return withLocale(`/${categoryById(category)?.slug ?? ''}`, locale);
}

/**
 * Origin used for canonical URLs, hreflang and the sitemap.
 *
 * Reads `VITE_SITE_URL` when the site is built for a known domain; otherwise
 * falls back to wherever the page is actually served from. Hard-coding a
 * domain the deployment does not use would point canonical at another site.
 */
/** Used when neither VITE_SITE_URL nor SITE_URL is set. */
const DEFAULT_SITE_ORIGIN = 'https://chisinau-guide.com';

function readSiteOrigin(): string {
  try {
    const fromEnv = import.meta.env?.VITE_SITE_URL;
    if (fromEnv) return fromEnv.replace(/\/+$/, '');
  } catch {
    // Not a Vite bundle (the sitemap script runs in plain Node).
  }
  if (typeof process !== 'undefined' && process.env?.SITE_URL) {
    return process.env.SITE_URL.replace(/\/+$/, '');
  }
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin;
  }
  return DEFAULT_SITE_ORIGIN;
}

export const SITE_ORIGIN = readSiteOrigin();

export function absoluteUrl(path: string): string {
  return `${SITE_ORIGIN}${path === '/' ? '/' : path}`;
}

/* ------------------------------------------------------------------ */
/* Store                                                               */
/* ------------------------------------------------------------------ */

type Listener = () => void;
const listeners = new Set<Listener>();

/** Cached snapshot so useSyncExternalStore stays referentially stable. */
let snapshot = {
  pathname: typeof window === 'undefined' ? '/' : window.location.pathname,
  search: typeof window === 'undefined' ? '' : window.location.search,
};

function readLocation() {
  const pathname = window.location.pathname;
  const search = window.location.search;
  if (pathname !== snapshot.pathname || search !== snapshot.search) {
    snapshot = { pathname, search };
  }
  return snapshot;
}

function emit() {
  readLocation();
  listeners.forEach((l) => l());
}

function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

if (typeof window !== 'undefined') {
  window.addEventListener('popstate', emit);
}

export interface NavigateOptions {
  replace?: boolean;
  /** Keep the current scroll position instead of jumping to the top. */
  keepScroll?: boolean;
  /** Query string params to attach, e.g. `{ q: 'кава' }`. Empty values are dropped. */
  query?: Record<string, string | undefined>;
}

export function navigate(path: string, options: NavigateOptions = {}) {
  const { replace = false, keepScroll = false, query } = options;

  let url = path;
  if (query) {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    const qs = params.toString();
    if (qs) url += `?${qs}`;
  }

  if (url === window.location.pathname + window.location.search) return;

  if (replace) window.history.replaceState(null, '', url);
  else window.history.pushState(null, '', url);

  emit();

  if (!keepScroll) window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ------------------------------------------------------------------ */
/* Hooks                                                               */
/* ------------------------------------------------------------------ */

export function useLocationSnapshot() {
  return useSyncExternalStore(
    subscribe,
    readLocation,
    () => snapshot,
  );
}

export function useRoute(): {
  route: Route;
  locale: Locale;
  query: URLSearchParams;
  path: string;
} {
  const location = useLocationSnapshot();
  const route = parsePath(location.pathname);
  const locale = localeFromPath(location.pathname);
  const query = new URLSearchParams(location.search);
  return { route, locale, query, path: location.pathname };
}

/** Returns a stable navigate function for use inside components. */
export function useNavigate() {
  return useCallback((path: string, options?: NavigateOptions) => navigate(path, options), []);
}

/* ------------------------------------------------------------------ */
/* Legacy hash-URL migration                                           */
/* ------------------------------------------------------------------ */

/**
 * Old links used `#category=cafes`, `#place=slug`, `#map`, `#favorites`, `#admin`.
 * They are rewritten to the new path structure once, on boot, via replaceState
 * so bookmarks and previously shared links keep working.
 */
export function migrateLegacyHash(
  resolvePlace: (slug: string) => { category: PlaceCategoryId; slug: string } | undefined,
  locale: Locale = DEFAULT_LOCALE,
): boolean {
  if (typeof window === 'undefined') return false;
  const hash = window.location.hash.replace(/^#/, '');
  if (!hash) return false;

  let target: string | null = null;

  if (hash.startsWith('place=')) {
    const found = resolvePlace(hash.slice('place='.length));
    if (found) target = buildPath({ view: 'place', ...found }, locale);
  } else if (hash.startsWith('category=')) {
    const id = hash.slice('category='.length) as CategoryId;
    if (categoryById(id)) target = categoryPath(id, locale);
  } else if (hash === 'map' || hash === 'favorites' || hash === 'admin') {
    target = withLocale(`/${hash}`, locale);
  }

  if (!target) return false;

  window.history.replaceState(null, '', target);
  emit();
  return true;
}

export const PLACE_CATEGORY_META = PLACE_CATEGORY_SLUGS;
