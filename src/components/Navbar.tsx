import React, { useState } from 'react';
import {
  Calendar,
  Coffee,
  Compass,
  Feather,
  Footprints,
  Grid,
  Heart,
  Laptop,
  MapPin,
  Menu,
  Search,
  Utensils,
  X,
} from 'lucide-react';
import type { CategoryId } from '../types';
import { CATEGORY_META } from '../data/taxonomy';
import { categoryPath, swapLocale } from '../router';
import { LOCALES, LOCALE_META, useLocale, type Locale } from '../i18n';
import { categoryName } from '../i18n/labels';
import { Sheet } from './ui/Sheet';

interface NavbarProps {
  activeCategory: CategoryId;
  onSelectCategory: (category: CategoryId) => void;
  favoritesCount: number;
  onOpenFavorites: () => void;
  onOpenMap: () => void;
  onSearch: (query: string) => void;
  searchQuery: string;
  isMapActive: boolean;
  isFavoritesActive: boolean;
  isAdminActive: boolean;
  /** Privacy policy, contacts — any standalone page with no category of its own. */
  isStaticPageActive?: boolean;
  onResetToHome: () => void;
  onSelectLocale: (locale: Locale) => void;
}

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  all: Grid,
  remote_work: Laptop,
  quiet_places: Feather,
  cafes: Coffee,
  food: Utensils,
  walks: Footprints,
  activities: Compass,
  events: Calendar,
};

export const NAV_ITEMS: { id: CategoryId; icon: React.ElementType }[] = [
  { id: 'all', icon: Grid },
  ...CATEGORY_META.map((category) => ({
    id: category.id as CategoryId,
    icon: CATEGORY_ICONS[category.id] ?? Compass,
  })),
];

/**
 * uk / ru / ro switcher that keeps the visitor on the same page.
 *
 * `compact` fits the desktop header bar, where a pointer is precise;
 * `comfortable` is used in the mobile menu and gives each option a full
 * 44px touch target.
 */
const LanguageSwitcher: React.FC<{
  current: Locale;
  onSelect: (locale: Locale) => void;
  label: string;
  size?: 'compact' | 'comfortable';
  className?: string;
}> = ({ current, onSelect, label, size = 'compact', className = '' }) => (
  <div
    role="group"
    aria-label={label}
    // No display utility here on purpose: the caller owns it. Baking in
    // `inline-flex` would fight a `hidden` passed from outside, and CSS order —
    // not class order — would decide the winner.
    className={`items-center gap-0.5 p-1 rounded-xl bg-zinc-100 ${className}`}
  >
    {LOCALES.map((locale) => {
      const isActive = locale === current;
      return (
        <a
          key={locale}
          href={swapLocale(window.location.pathname, locale)}
          hrefLang={LOCALE_META[locale].htmlLang}
          lang={LOCALE_META[locale].htmlLang}
          title={LOCALE_META[locale].name}
          aria-current={isActive ? 'true' : undefined}
          onClick={(event) => {
            if (event.metaKey || event.ctrlKey || event.shiftKey) return;
            event.preventDefault();
            onSelect(locale);
          }}
          className={`rounded-lg text-xs font-bold transition-colors ${
            size === 'comfortable'
              ? 'flex-1 text-center px-4 min-h-[44px] leading-[44px]'
              : 'px-2.5 py-1.5'
          } ${isActive ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-900'}`}
        >
          {LOCALE_META[locale].short}
        </a>
      );
    })}
  </div>
);

export const Navbar: React.FC<NavbarProps> = ({
  activeCategory,
  onSelectCategory,
  favoritesCount,
  onOpenFavorites,
  onOpenMap,
  onSearch,
  searchQuery,
  isMapActive,
  isFavoritesActive,
  isAdminActive,
  isStaticPageActive,
  onResetToHome,
  onSelectLocale,
}) => {
  const { locale, t } = useLocale();
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [draftQuery, setDraftQuery] = useState(searchQuery);

  const isBrowsing = !isMapActive && !isFavoritesActive && !isAdminActive && !isStaticPageActive;

  const handleNavClick = (event: React.MouseEvent, category: CategoryId) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey) return;
    event.preventDefault();
    onSelectCategory(category);
    setMenuOpen(false);
  };

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    onSearch(draftQuery);
    setSearchOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-18 gap-4">
            <a
              href="/"
              onClick={(event) => {
                if (event.metaKey || event.ctrlKey || event.shiftKey) return;
                event.preventDefault();
                onResetToHome();
              }}
              id="navbar-brand-logo"
              className="group flex items-center gap-3 shrink-0 py-1 min-h-[44px]"
            >
              <span className="w-10 h-10 rounded-xl bg-zinc-900 text-white flex items-center justify-center font-black text-lg tracking-tight group-hover:scale-105 transition-transform">
                CH
              </span>
              <span className="hidden sm:block">
                <span className="block font-extrabold text-lg tracking-tight text-zinc-900 font-['Outfit',sans-serif] leading-tight">
                  {t.common.siteName}
                </span>
                <span className="block text-xs text-zinc-500">{t.common.tagline}</span>
              </span>
            </a>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setDraftQuery(searchQuery);
                  setSearchOpen(true);
                }}
                className="lg:hidden p-3 rounded-xl text-zinc-700 hover:bg-zinc-100 transition-colors"
                aria-label={t.nav.search}
              >
                <Search className="w-5 h-5" aria-hidden="true" />
              </button>

              <a
                href={`${LOCALE_META[locale].prefix}/map`}
                onClick={(event) => {
                  if (event.metaKey || event.ctrlKey || event.shiftKey) return;
                  event.preventDefault();
                  onOpenMap();
                }}
                id="navbar-map-toggle-btn"
                className={`hidden lg:inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  isMapActive ? 'bg-zinc-900 text-white' : 'text-zinc-700 hover:bg-zinc-100'
                }`}
              >
                <MapPin className="w-4 h-4 text-rose-500" aria-hidden="true" />
                {t.nav.map}
              </a>

              <a
                href={`${LOCALE_META[locale].prefix}/favorites`}
                onClick={(event) => {
                  if (event.metaKey || event.ctrlKey || event.shiftKey) return;
                  event.preventDefault();
                  onOpenFavorites();
                }}
                id="navbar-favorites-btn"
                className={`hidden lg:inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  isFavoritesActive ? 'bg-rose-500 text-white' : 'text-zinc-700 hover:bg-zinc-100'
                }`}
              >
                <Heart
                  className={`w-4 h-4 ${favoritesCount > 0 && !isFavoritesActive ? 'fill-rose-500 text-rose-500' : ''}`}
                  aria-hidden="true"
                />
                {t.nav.favorites}
                {favoritesCount > 0 && (
                  <span
                    className={`px-1.5 rounded-full text-[11px] font-bold ${
                      isFavoritesActive ? 'bg-white text-rose-600' : 'bg-rose-500 text-white'
                    }`}
                  >
                    {favoritesCount}
                  </span>
                )}
              </a>

              <LanguageSwitcher
                current={locale}
                onSelect={onSelectLocale}
                label={t.nav.language}
                className="hidden lg:inline-flex"
              />

              <button
                type="button"
                onClick={() => setMenuOpen((open) => !open)}
                id="navbar-mobile-toggle"
                className="lg:hidden p-3 rounded-xl text-zinc-700 hover:bg-zinc-100 transition-colors"
                aria-label={t.nav.menu}
                aria-expanded={isMenuOpen}
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          <nav aria-label={t.nav.categories} className="hidden lg:flex items-center gap-1 py-2 border-t border-zinc-100 overflow-x-auto no-scrollbar">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = isBrowsing && activeCategory === item.id;
              return (
                <a
                  key={item.id}
                  href={categoryPath(item.id, locale)}
                  id={`nav-item-${item.id}`}
                  onClick={(event) => handleNavClick(event, item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    isActive
                      ? 'bg-zinc-900 text-white font-semibold'
                      : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-zinc-400'}`} aria-hidden="true" />
                  {item.id === 'all' ? t.nav.all : categoryName(t, item.id)}
                </a>
              );
            })}
          </nav>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden border-t border-zinc-200 bg-white px-4 pt-3 pb-6 space-y-1">
            <p className="text-xs font-bold uppercase tracking-wider text-zinc-400 px-3 mb-2">
              {t.nav.categories}
            </p>
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = isBrowsing && activeCategory === item.id;
              return (
                <a
                  key={item.id}
                  href={categoryPath(item.id, locale)}
                  id={`mobile-nav-${item.id}`}
                  onClick={(event) => handleNavClick(event, item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium min-h-[48px] ${
                    isActive ? 'bg-zinc-900 text-white font-semibold' : 'text-zinc-700 hover:bg-zinc-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-zinc-400'}`} aria-hidden="true" />
                  {item.id === 'all' ? t.nav.all : categoryName(t, item.id)}
                </a>
              );
            })}

            <div className="pt-3 mt-2 border-t border-zinc-100">
              <p className="text-xs font-bold uppercase tracking-wider text-zinc-400 px-3 mb-2">
                {t.nav.language}
              </p>
              <LanguageSwitcher
                current={locale}
                onSelect={(next) => {
                  onSelectLocale(next);
                  setMenuOpen(false);
                }}
                label={t.nav.language}
                size="comfortable"
                className="mx-3 flex"
              />
            </div>
          </div>
        )}
      </header>

      {/* Mobile category strip — horizontal scroll, always reachable */}
      {isBrowsing && (
        <div className="lg:hidden sticky top-16 z-30 bg-white/95 backdrop-blur-md border-b border-zinc-200">
          <div className="flex gap-2 overflow-x-auto no-scrollbar px-4 py-2.5">
            {NAV_ITEMS.map((item) => {
              const isActive = activeCategory === item.id;
              return (
                <a
                  key={item.id}
                  href={categoryPath(item.id, locale)}
                  onClick={(event) => handleNavClick(event, item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap border transition-colors min-h-[44px] flex items-center ${
                    isActive
                      ? 'bg-zinc-900 text-white border-zinc-900'
                      : 'bg-white text-zinc-700 border-zinc-200'
                  }`}
                >
                  {item.id === 'all' ? t.nav.all : categoryName(t, item.id)}
                </a>
              );
            })}
          </div>
        </div>
      )}

      {/* Sticky bottom navigation (mobile) */}
      <nav
        aria-label={t.nav.categories}
        className="fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur-lg border-t border-zinc-200 lg:hidden pb-[env(safe-area-inset-bottom)]"
      >
        <div className="grid grid-cols-4">
          <a
            href={categoryPath('all', locale)}
            onClick={(event) => handleNavClick(event, 'all')}
            className={`flex flex-col items-center justify-center gap-0.5 py-2.5 min-h-[56px] text-[11px] font-semibold ${
              isBrowsing ? 'text-zinc-900' : 'text-zinc-500'
            }`}
          >
            <Compass className="w-5 h-5" aria-hidden="true" />
            {t.nav.guide}
          </a>

          <button
            type="button"
            onClick={() => {
              setDraftQuery(searchQuery);
              setSearchOpen(true);
            }}
            className="flex flex-col items-center justify-center gap-0.5 py-2.5 min-h-[56px] text-[11px] font-semibold text-zinc-500"
          >
            <Search className="w-5 h-5" aria-hidden="true" />
            {t.nav.search}
          </button>

          <a
            href={`${LOCALE_META[locale].prefix}/map`}
            onClick={(event) => {
              if (event.metaKey || event.ctrlKey || event.shiftKey) return;
              event.preventDefault();
              onOpenMap();
            }}
            className={`flex flex-col items-center justify-center gap-0.5 py-2.5 min-h-[56px] text-[11px] font-semibold ${
              isMapActive ? 'text-zinc-900' : 'text-zinc-500'
            }`}
          >
            <MapPin className="w-5 h-5 text-rose-500" aria-hidden="true" />
            {t.nav.map}
          </a>

          <a
            href={`${LOCALE_META[locale].prefix}/favorites`}
            onClick={(event) => {
              if (event.metaKey || event.ctrlKey || event.shiftKey) return;
              event.preventDefault();
              onOpenFavorites();
            }}
            className={`relative flex flex-col items-center justify-center gap-0.5 py-2.5 min-h-[56px] text-[11px] font-semibold ${
              isFavoritesActive ? 'text-rose-600' : 'text-zinc-500'
            }`}
          >
            <Heart
              className={`w-5 h-5 ${favoritesCount > 0 ? 'fill-rose-500 text-rose-500' : ''}`}
              aria-hidden="true"
            />
            {t.nav.favorites}
            {favoritesCount > 0 && (
              <span className="absolute top-1.5 right-[22%] min-w-[18px] h-[18px] px-1 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                {favoritesCount}
              </span>
            )}
          </a>
        </div>
      </nav>

      {isSearchOpen && (
        <Sheet title={t.nav.searchTitle} onClose={() => setSearchOpen(false)}>
          <form onSubmit={submitSearch} role="search" className="space-y-4">
            <div className="flex items-center gap-2 border border-zinc-300 rounded-2xl px-3 focus-within:border-zinc-900">
              <Search className="w-5 h-5 text-zinc-400 shrink-0" aria-hidden="true" />
              <input
                type="search"
                autoFocus
                value={draftQuery}
                onChange={(event) => setDraftQuery(event.target.value)}
                placeholder={t.hero.placeholder}
                aria-label={t.nav.search}
                className="flex-1 min-w-0 py-3.5 bg-transparent text-base focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-zinc-900 text-white font-bold text-sm min-h-[52px]"
            >
              {t.common.find}
            </button>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                {t.nav.quickQueries}
              </p>
              <div className="flex flex-wrap gap-2">
                {t.nav.suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => {
                      onSearch(suggestion);
                      setSearchOpen(false);
                    }}
                    className="px-3.5 py-2 rounded-full border border-zinc-200 text-sm font-medium text-zinc-700 min-h-[40px]"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </form>
        </Sheet>
      )}
    </>
  );
};
