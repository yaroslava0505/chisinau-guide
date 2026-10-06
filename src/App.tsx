import React, { Suspense, lazy, useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowRight, Compass, Flame, MapPin, Sparkles } from 'lucide-react';
import type { CategoryId, CityEvent, FilterState, Place, ScenarioId } from './types';
import {
  clearLegacyStorage,
  clearStoredFavorites,
  getStoredEvents,
  getStoredFavorites,
  getStoredPlaces,
  rememberDeletedId,
  rememberEditedId,
  resetStoredEvents,
  resetStoredPlaces,
  saveStoredEvents,
  saveStoredPlaces,
  toggleStoredFavorite,
} from './utils/storage';
import { eventJsonLd, itemListJsonLd, placeJsonLd, updateSEO, websiteJsonLd } from './utils/seo';
import { getPlaceImage } from './utils/illustrations';
import { INITIAL_FILTERS, countActiveFilters, filterPlaces } from './utils/filters';
import { analyzeQuery } from './utils/search';
import { localizeEvents, localizePlaces } from './utils/localize';
import { CATEGORY_META, SCENARIOS } from './data/taxonomy';
import { DISTRICT_IDS } from './data/chisinauPlaces';
import {
  ADMIN_ENABLED,
  absoluteUrl,
  buildPath,
  categoryPath,
  migrateLegacyHash,
  navigate,
  swapLocale,
  useRoute,
  withLocale,
} from './router';
import {
  LocaleProvider,
  getRememberedLocale,
  rememberLocale,
  useLocale,
  type Locale,
} from './i18n';
import { categoryCopy, categoryName, districtLabel } from './i18n/labels';
import { Navbar } from './components/Navbar';
import { HeroSearch } from './components/HeroSearch';
import { TodaySection } from './components/TodaySection';
import { CategoryFilters } from './components/CategoryFilters';
import { PlaceCard } from './components/PlaceCard';
import { PlaceDetailModal } from './components/PlaceDetailModal';
import { EventsSection } from './components/EventsSection';
import { FavoritesView } from './components/FavoritesView';
import { AddPlaceForm } from './components/AddPlaceForm';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { ContactsPage } from './components/ContactsPage';
/**
 * The admin panel is loaded on demand and only when it is enabled, so a public
 * build never ships its code — not merely hides its route.
 */
const AdminPanel = lazy(async () => ({
  default: (await import('./components/AdminPanel')).AdminPanel,
}));

/**
 * `InteractiveMap` itself (marker clustering, the district sidebar, its own
 * filter UI) is only needed on the /map route, so it is code-split rather
 * than shipped in the main bundle for every visitor. Note that the Leaflet
 * *library* stays eager regardless — `PlaceDetailModal` renders a mini-map on
 * every place page and isn't itself lazy — so this saves this component's
 * own weight, not Leaflet's.
 */
const InteractiveMap = lazy(async () => ({
  default: (await import('./components/InteractiveMap')).InteractiveMap,
}));

export default function App() {
  const { locale } = useRoute();

  return (
    <LocaleProvider locale={locale}>
      <Guide />
    </LocaleProvider>
  );
}

function Guide() {
  // Source records stay in the default language; localized copies are derived.
  const [sourcePlaces, setSourcePlaces] = useState<Place[]>(getStoredPlaces);
  const [sourceEvents, setSourceEvents] = useState<CityEvent[]>(getStoredEvents);
  const [favorites, setFavorites] = useState<string[]>(getStoredFavorites);
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [activeScenario, setActiveScenario] = useState<ScenarioId | null>(null);

  const { route, locale, query } = useRoute();
  const { t } = useLocale();

  const places = useMemo(() => localizePlaces(sourcePlaces, locale), [sourcePlaces, locale]);
  const events = useMemo(() => localizeEvents(sourceEvents, locale), [sourceEvents, locale]);

  // Rewrite old `#category=` / `#place=` links, and honour a previously
  // chosen language when the visitor opens the bare root path.
  useEffect(() => {
    clearLegacyStorage();

    const migrated = migrateLegacyHash((slug) => {
      const found = sourcePlaces.find((place) => place.slug === slug);
      return found ? { category: found.category, slug: found.slug } : undefined;
    }, locale);

    if (!migrated && window.location.pathname === '/') {
      const remembered = getRememberedLocale();
      if (remembered && remembered !== locale) {
        window.history.replaceState(null, '', withLocale('/', remembered));
        window.dispatchEvent(new PopStateEvent('popstate'));
      }
    }
    // Runs once: it only adjusts the URL the app was opened with.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep the search box in sync with the `?q=` parameter (shareable searches).
  const urlQuery = query.get('q') ?? '';
  useEffect(() => {
    setFilters((current) =>
      current.searchQuery === urlQuery ? current : { ...current, searchQuery: urlQuery },
    );
  }, [urlQuery]);

  // A place URL (/cafes/molka) also selects its category, so the feed behind
  // the detail view is the right one when the link is opened directly.
  const activeCategory: CategoryId =
    route.view === 'category' || route.view === 'place'
      ? route.category
      : route.view === 'events'
        ? 'events'
        : 'all';

  const selectedPlace = useMemo(
    () => (route.view === 'place' ? places.find((place) => place.slug === route.slug) ?? null : null),
    [route, places],
  );

  const copy = categoryCopy(t, activeCategory);

  const filteredPlaces = useMemo(
    () => filterPlaces(places, activeCategory, filters),
    [places, activeCategory, filters],
  );

  const featuredPlaces = useMemo(() => places.filter((place) => place.is_featured), [places]);
  const popularPlaces = useMemo(() => places.filter((place) => place.is_popular), [places]);
  const favoritePlaces = useMemo(
    () => places.filter((place) => favorites.includes(place.id)),
    [places, favorites],
  );

  /* ----------------------------- SEO per route ----------------------------- */

  useEffect(() => {
    // `path` is locale-less; updateSEO adds the prefix and the hreflang set.
    const path = buildPath(route);

    if (route.view === 'place') {
      if (!selectedPlace) return;
      const canonical = absoluteUrl(withLocale(path, locale));
      updateSEO({
        title: `${selectedPlace.name} — ${selectedPlace.subcategory}`,
        description: selectedPlace.description.slice(0, 300),
        path,
        locale,
        image: getPlaceImage(selectedPlace),
        jsonLd: placeJsonLd(selectedPlace, canonical, locale),
      });
      return;
    }

    if (route.view === 'category' || route.view === 'events') {
      if (!copy) return;
      const canonical = absoluteUrl(withLocale(path, locale));
      updateSEO({
        title: copy.seoTitle,
        description: copy.seoDescription,
        path,
        locale,
        jsonLd:
          route.view === 'events'
            ? events.map((event) => eventJsonLd(event, canonical, locale))
            : itemListJsonLd(filteredPlaces, canonical, copy.h1, locale),
      });
      return;
    }

    if (route.view === 'map') {
      updateSEO({
        title: t.seo.mapTitle,
        description: t.seo.mapDescription,
        path,
        locale,
      });
      return;
    }

    if (route.view === 'favorites') {
      updateSEO({
        title: t.seo.favoritesTitle,
        description: t.seo.favoritesDescription,
        path,
        locale,
        noindex: true,
      });
      return;
    }

    if (route.view === 'privacy') {
      updateSEO({
        title: t.privacy.title,
        description: t.privacy.seoDescription,
        path,
        locale,
      });
      return;
    }

    if (route.view === 'contacts') {
      updateSEO({
        title: t.contacts.title,
        description: t.contacts.seoDescription,
        path,
        locale,
      });
      return;
    }

    if (route.view === 'admin') {
      updateSEO({
        title: t.seo.adminTitle,
        description: t.seo.adminDescription,
        path,
        locale,
        noindex: true,
      });
      return;
    }

    if (route.view === 'notfound') {
      updateSEO({
        title: t.seo.notFoundTitle,
        description: t.seo.notFoundDescription,
        path,
        locale,
        noindex: true,
      });
      return;
    }

    updateSEO({
      title: t.seo.homeTitle,
      description: t.seo.homeDescription,
      path: '/',
      locale,
      jsonLd: websiteJsonLd(locale),
    });
  }, [route, selectedPlace, locale, t, copy, events, filteredPlaces]);

  /* ------------------------------- Handlers -------------------------------- */

  const updateFilter = useCallback(
    <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
      setFilters((current) => ({ ...current, [key]: value }));
      if (key !== 'searchQuery') setActiveScenario(null);
    },
    [],
  );

  const resetFilters = useCallback(() => {
    setFilters((current) => ({ ...INITIAL_FILTERS, searchQuery: current.searchQuery }));
    setActiveScenario(null);
  }, []);

  const selectCategory = useCallback(
    (category: CategoryId) => {
      setActiveScenario(null);
      setFilters(INITIAL_FILTERS);
      navigate(categoryPath(category, locale));
    },
    [locale],
  );

  const selectPlace = useCallback(
    (place: Place) => {
      navigate(buildPath({ view: 'place', category: place.category, slug: place.slug }, locale), {
        keepScroll: true,
      });
    },
    [locale],
  );

  const closeDetail = useCallback(() => {
    if (window.history.length > 1) window.history.back();
    else navigate(withLocale('/', locale), { keepScroll: true });
  }, [locale]);

  const toggleFavorite = useCallback((placeId: string) => {
    setFavorites(toggleStoredFavorite(placeId));
  }, []);

  const toggleFavoriteFromCard = useCallback(
    (placeId: string, event: React.MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
      toggleFavorite(placeId);
    },
    [toggleFavorite],
  );

  /**
   * A free-text search is also an intent: "кава" should land on the cafés
   * feed, "laptop" on remote work. The detected filters are applied too.
   */
  const runSearch = useCallback(
    (rawQuery: string) => {
      const trimmed = rawQuery.trim();
      const intent = analyzeQuery(trimmed);

      setActiveScenario(null);
      setFilters({ ...INITIAL_FILTERS, ...intent.filters, searchQuery: trimmed });

      navigate(categoryPath(intent.category ?? 'all', locale), {
        query: { q: trimmed || undefined },
      });
    },
    [locale],
  );

  const selectScenario = useCallback(
    (id: ScenarioId) => {
      const scenario = SCENARIOS.find((item) => item.id === id);
      if (!scenario) return;

      setActiveScenario(id);
      setFilters({ ...INITIAL_FILTERS, ...scenario.filters });
      navigate(categoryPath(scenario.category, locale));
    },
    [locale],
  );

  /** Same page, other language — remembered for the visitor's next visit. */
  const selectLocale = useCallback((next: Locale) => {
    rememberLocale(next);
    navigate(swapLocale(window.location.pathname, next) + window.location.search, {
      keepScroll: true,
    });
  }, []);

  /* --------------------------- Admin data actions -------------------------- */

  const persistPlaces = (next: Place[]) => {
    setSourcePlaces(next);
    saveStoredPlaces(next);
  };

  const persistEvents = (next: CityEvent[]) => {
    setSourceEvents(next);
    saveStoredEvents(next);
  };

  /* -------------------------------- Render --------------------------------- */

  const isMapActive = route.view === 'map';
  const isFavoritesActive = route.view === 'favorites';
  const isPrivacyActive = route.view === 'privacy';
  const isContactsActive = route.view === 'contacts';
  const isAdminActive = ADMIN_ENABLED && route.view === 'admin';
  const isHome = route.view === 'home';

  const activeFilterCount = countActiveFilters(filters);
  // With a search or filters active the results should dominate the page, so
  // the editorial blocks step aside instead of pushing them down.
  const isBrowsingHome = isHome && !filters.searchQuery && activeFilterCount === 0;

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] text-zinc-900 pb-16 lg:pb-0">
      <Navbar
        activeCategory={activeCategory}
        onSelectCategory={selectCategory}
        favoritesCount={favorites.length}
        onOpenFavorites={() => navigate(withLocale('/favorites', locale))}
        onOpenMap={() => navigate(withLocale('/map', locale))}
        onSearch={runSearch}
        searchQuery={filters.searchQuery}
        isMapActive={isMapActive}
        isFavoritesActive={isFavoritesActive}
        isAdminActive={isAdminActive}
        isStaticPageActive={isPrivacyActive || isContactsActive}
        onResetToHome={() => selectCategory('all')}
        onSelectLocale={selectLocale}
      />

      {isAdminActive ? (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1">
          <Suspense fallback={<p className="py-16 text-center text-sm text-zinc-500">…</p>}>
          <AdminPanel
            places={sourcePlaces}
            events={sourceEvents}
            onAddPlace={(place) => persistPlaces([place, ...sourcePlaces])}
            onUpdatePlace={(updated) => {
              // Marked as hand-edited so the catalogue merge stops overwriting it.
              rememberEditedId(updated.id);
              persistPlaces(sourcePlaces.map((place) => (place.id === updated.id ? updated : place)));
            }}
            onDeletePlace={(id) => {
              // Recorded so the catalogue merge does not re-add it on reload.
              rememberDeletedId(id);
              persistPlaces(sourcePlaces.filter((place) => place.id !== id));
            }}
            onResetDefaultData={() => {
              setSourcePlaces(resetStoredPlaces());
              setSourceEvents(resetStoredEvents());
            }}
            onAddEvent={(event) => persistEvents([event, ...sourceEvents])}
            onUpdateEvent={(updated) => {
              rememberEditedId(updated.id);
              persistEvents(sourceEvents.map((event) => (event.id === updated.id ? updated : event)));
            }}
            onDeleteEvent={(id) => {
              rememberDeletedId(id);
              persistEvents(sourceEvents.filter((event) => event.id !== id));
            }}
            onClose={() => navigate(withLocale('/', locale))}
          />
          </Suspense>
        </main>
      ) : isFavoritesActive ? (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1">
          <FavoritesView
            favoritesPlaces={favoritePlaces}
            onSelectPlace={selectPlace}
            onToggleFavorite={toggleFavorite}
            onClearAll={() => {
              clearStoredFavorites();
              setFavorites([]);
            }}
            onBackToExplore={() => navigate(withLocale('/', locale))}
          />
        </main>
      ) : isMapActive ? (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-6 flex-1">
          <Suspense fallback={<p className="py-16 text-center text-sm text-zinc-500">…</p>}>
            <InteractiveMap
              places={places}
              onSelectPlace={selectPlace}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
            />
          </Suspense>
        </main>
      ) : isPrivacyActive ? (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1">
          <PrivacyPolicy />
        </main>
      ) : isContactsActive ? (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1">
          <ContactsPage />
        </main>
      ) : route.view === 'events' ? (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-8 flex-1">
          <EventsSection events={events} variant="page" />
        </main>
      ) : route.view === 'notfound' ? (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 py-20 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 font-['Outfit',sans-serif]">
            {t.seo.notFoundTitle}
          </h1>
          <p className="mt-3 text-sm sm:text-base text-zinc-500 max-w-md mx-auto">
            {t.seo.notFoundText}
          </p>
          <a
            href={withLocale('/', locale)}
            onClick={(event) => {
              if (event.metaKey || event.ctrlKey || event.shiftKey) return;
              event.preventDefault();
              navigate(withLocale('/', locale));
            }}
            className="inline-flex items-center gap-1.5 mt-6 px-5 py-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-bold transition-colors"
          >
            {t.seo.notFoundBackHome}
          </a>
        </main>
      ) : (
        <main className="flex-1 w-full">
          {isHome && (
            <HeroSearch
              searchQuery={filters.searchQuery}
              onSearchChange={(value) => updateFilter('searchQuery', value)}
              onSubmitSearch={() => runSearch(filters.searchQuery)}
              onScenarioSelect={selectScenario}
              activeScenario={activeScenario}
            />
          )}

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 sm:space-y-14">
            {isBrowsingHome && (
              <TodaySection
                places={places}
                events={events}
                favorites={favorites}
                onSelectPlace={selectPlace}
                onToggleFavorite={toggleFavoriteFromCard}
                onOpenEvents={() => navigate(withLocale('/events', locale))}
                onPickForMe={() => {
                  // "Pick one for me" = everything open right now, across categories.
                  setActiveScenario(null);
                  setFilters({ ...INITIAL_FILTERS, openNowOnly: true });
                  navigate(categoryPath('all', locale));
                }}
              />
            )}

            {!isHome && copy && (
              <header className="max-w-3xl">
                <h1 className="text-3xl sm:text-5xl font-extrabold text-zinc-900 font-['Outfit',sans-serif] leading-tight">
                  {copy.h1}
                </h1>
                <p className="mt-3 text-base sm:text-lg text-zinc-600 leading-relaxed">
                  {copy.subtitle}
                </p>
              </header>
            )}

            <CategoryFilters
              activeCategory={activeCategory}
              filters={filters}
              onUpdateFilter={updateFilter}
              onResetFilters={resetFilters}
              totalFilteredCount={filteredPlaces.length}
            />

            {isBrowsingHome && featuredPlaces.length > 0 && (
              <section className="space-y-5">
                <div className="flex items-center gap-2.5">
                  <span className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4" aria-hidden="true" />
                  </span>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-900 font-['Outfit',sans-serif]">
                      {t.home.featuredTitle}
                    </h2>
                    <p className="text-xs text-zinc-500">{t.home.featuredSubtitle}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredPlaces.slice(0, 3).map((place) => (
                    <PlaceCard
                      key={place.id}
                      place={place}
                      isFavorite={favorites.includes(place.id)}
                      onToggleFavorite={toggleFavoriteFromCard}
                      onSelectPlace={selectPlace}
                    />
                  ))}
                </div>
              </section>
            )}

            {isBrowsingHome && popularPlaces.length > 0 && (
              <section className="space-y-5">
                <div className="flex items-center gap-2.5">
                  <span className="w-9 h-9 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center shrink-0">
                    <Flame className="w-4 h-4" aria-hidden="true" />
                  </span>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-900 font-['Outfit',sans-serif]">
                      {t.home.popularTitle}
                    </h2>
                    <p className="text-xs text-zinc-500">{t.home.popularSubtitle}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {popularPlaces.slice(0, 3).map((place) => (
                    <PlaceCard
                      key={place.id}
                      place={place}
                      isFavorite={favorites.includes(place.id)}
                      onToggleFavorite={toggleFavoriteFromCard}
                      onSelectPlace={selectPlace}
                    />
                  ))}
                </div>
              </section>
            )}

            <section className="space-y-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-900 font-['Outfit',sans-serif]">
                  {filters.searchQuery
                    ? t.home.searchResults(filters.searchQuery)
                    : isHome
                      ? t.home.allPlaces
                      : categoryName(t, activeCategory)}
                </h2>
                <p className="text-xs text-zinc-500">
                  {t.common.showingOf(filteredPlaces.length, places.length)}
                </p>
              </div>

              {filteredPlaces.length === 0 ? (
                <div className="py-14 text-center bg-white rounded-3xl border border-zinc-200 px-6 max-w-md mx-auto space-y-4">
                  <span className="w-14 h-14 rounded-2xl bg-zinc-100 text-zinc-400 flex items-center justify-center mx-auto">
                    <Compass className="w-7 h-7" aria-hidden="true" />
                  </span>
                  <h3 className="font-bold text-zinc-900">{t.common.notFoundTitle}</h3>
                  <p className="text-sm text-zinc-500">{t.common.notFoundText}</p>
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="px-5 py-3 rounded-2xl bg-zinc-900 text-white text-sm font-semibold hover:bg-zinc-800 min-h-[48px]"
                  >
                    {t.common.resetFilters}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPlaces.map((place) => (
                    <PlaceCard
                      key={place.id}
                      place={place}
                      isFavorite={favorites.includes(place.id)}
                      onToggleFavorite={toggleFavoriteFromCard}
                      onSelectPlace={selectPlace}
                    />
                  ))}
                </div>
              )}
            </section>

            {isBrowsingHome && (
              <>
                <section className="bg-zinc-900 text-white rounded-3xl p-7 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="space-y-2.5 max-w-xl text-center md:text-left">
                    <h2 className="text-2xl sm:text-3xl font-extrabold font-['Outfit',sans-serif]">
                      {t.home.mapTeaserTitle}
                    </h2>
                    <p className="text-sm text-zinc-300 leading-relaxed">{t.home.mapTeaserText}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate(withLocale('/map', locale))}
                    className="px-6 py-3.5 rounded-2xl bg-white hover:bg-zinc-100 text-zinc-900 font-bold text-sm flex items-center gap-2 shrink-0 transition-colors min-h-[52px]"
                  >
                    <MapPin className="w-4 h-4 text-rose-500" aria-hidden="true" />
                    {t.home.openMap}
                  </button>
                </section>

                <EventsSection
                  events={events}
                  variant="home"
                  limit={2}
                  onOpenAllEvents={() => navigate(withLocale('/events', locale))}
                />

                <AddPlaceForm />
              </>
            )}
          </div>
        </main>
      )}

      {selectedPlace && (
        <PlaceDetailModal
          place={selectedPlace}
          onClose={closeDetail}
          isFavorite={favorites.includes(selectedPlace.id)}
          onToggleFavorite={toggleFavorite}
        />
      )}

      <footer className="bg-white border-t border-zinc-200 mt-auto pt-12 pb-8 text-sm text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <span className="w-9 h-9 rounded-xl bg-zinc-900 text-white flex items-center justify-center font-black text-sm">
                  CH
                </span>
                <span className="font-extrabold text-base text-zinc-900 font-['Outfit',sans-serif]">
                  {t.common.siteName}
                </span>
              </div>
              <p className="text-xs leading-relaxed">{t.footer.about}</p>
            </div>

            <nav aria-label={t.footer.categories}>
              <h2 className="font-bold text-zinc-900 uppercase text-[11px] tracking-wider mb-3">
                {t.footer.categories}
              </h2>
              <ul className="space-y-2 text-xs">
                {CATEGORY_META.map((category) => (
                  <li key={category.id}>
                    <a
                      href={categoryPath(category.id, locale)}
                      onClick={(event) => {
                        if (event.metaKey || event.ctrlKey || event.shiftKey) return;
                        event.preventDefault();
                        selectCategory(category.id);
                      }}
                      className="inline-block py-2 hover:text-zinc-900 transition-colors"
                    >
                      {categoryName(t, category.id)}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div>
              <h2 className="font-bold text-zinc-900 uppercase text-[11px] tracking-wider mb-3">
                {t.footer.districts}
              </h2>
              <ul className="space-y-2 text-xs">
                {DISTRICT_IDS.map((district) => (
                  <li key={district}>{districtLabel(t, district)}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <h2 className="font-bold text-zinc-900 uppercase text-[11px] tracking-wider">
                {t.footer.business}
              </h2>
              <p className="text-xs leading-relaxed">{t.footer.businessText}</p>
              <a
                href={withLocale('/map', locale)}
                onClick={(event) => {
                  event.preventDefault();
                  navigate(withLocale('/map', locale));
                }}
                className="inline-flex items-center gap-1.5 py-2.5 text-xs font-semibold text-zinc-900 hover:gap-2.5 transition-all"
              >
                {t.footer.viewMap}
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </a>
            </div>
          </div>

          <div className="pt-6 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
            <div className="flex items-center gap-2 order-2 sm:order-1">
              <p>{t.footer.copyright(new Date().getFullYear())}</p>
              <span className="text-zinc-300">·</span>
              <a
                href={withLocale('/privacy', locale)}
                onClick={(event) => {
                  if (event.metaKey || event.ctrlKey || event.shiftKey) return;
                  event.preventDefault();
                  navigate(withLocale('/privacy', locale));
                }}
                className="hover:text-zinc-900 transition-colors"
              >
                {t.footer.privacy}
              </a>
              <span className="text-zinc-300">·</span>
              <a
                href={withLocale('/contacts', locale)}
                onClick={(event) => {
                  if (event.metaKey || event.ctrlKey || event.shiftKey) return;
                  event.preventDefault();
                  navigate(withLocale('/contacts', locale));
                }}
                className="hover:text-zinc-900 transition-colors"
              >
                {t.footer.contacts}
              </a>
            </div>
            <p className="text-zinc-400 order-1 sm:order-2">{t.footer.dataNote}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
