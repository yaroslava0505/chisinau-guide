import React, { useMemo } from 'react';
import { ArrowLeft, Compass, Heart, Trash2 } from 'lucide-react';
import type { Place, PlaceCategoryId } from '../types';
import { PlaceCard } from './PlaceCard';
import { CATEGORY_META } from '../data/taxonomy';
import { useT } from '../i18n';
import { categoryName } from '../i18n/labels';

interface FavoritesViewProps {
  favoritesPlaces: Place[];
  onSelectPlace: (place: Place) => void;
  onToggleFavorite: (id: string) => void;
  onClearAll: () => void;
  onBackToExplore: () => void;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({
  favoritesPlaces,
  onSelectPlace,
  onToggleFavorite,
  onClearAll,
  onBackToExplore,
}) => {
  const t = useT();

  // Favourites are grouped by category so the page reads as sections
  // (місця, кафе, прогулянки, активності) rather than one flat grid.
  const groups = useMemo(() => {
    return CATEGORY_META.filter((category) => category.id !== 'events')
      .map((category) => ({
        category,
        places: favoritesPlaces.filter((place) => place.category === (category.id as PlaceCategoryId)),
      }))
      .filter((group) => group.places.length > 0);
  }, [favoritesPlaces]);

  return (
    <div className="py-6 sm:py-10 space-y-8">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200">
        <div>
          <button
            type="button"
            onClick={onBackToExplore}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-500 hover:text-zinc-900 mb-3 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            {t.favorites.backToGuide}
          </button>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 font-['Outfit',sans-serif]">
            {t.favorites.title}
          </h1>
          <p className="text-sm text-zinc-500 mt-1.5">
            {favoritesPlaces.length > 0
              ? t.favorites.subtitle(favoritesPlaces.length)
              : t.favorites.subtitleEmpty}
          </p>
        </div>

        {favoritesPlaces.length > 0 && (
          <button
            type="button"
            onClick={onClearAll}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors self-start min-h-[44px]"
          >
            <Trash2 className="w-4 h-4" aria-hidden="true" />
            {t.favorites.clearAll}
          </button>
        )}
      </header>

      {favoritesPlaces.length === 0 ? (
        <div className="py-16 text-center max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-zinc-100 text-zinc-400 flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8" aria-hidden="true" />
          </div>
          <h2 className="text-lg font-bold text-zinc-900">
            {t.favorites.emptyTitle}
          </h2>
          <p className="text-sm text-zinc-500 leading-relaxed">{t.favorites.emptyText}</p>
          <button
            type="button"
            onClick={onBackToExplore}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-zinc-900 text-white text-sm font-semibold hover:bg-zinc-800 transition-colors min-h-[48px]"
          >
            <Compass className="w-4 h-4" aria-hidden="true" />
            {t.favorites.explore}
          </button>
        </div>
      ) : (
        groups.map(({ category, places }) => (
          <section key={category.id} className="space-y-4">
            <h2 className="text-xl font-extrabold text-zinc-900 font-['Outfit',sans-serif]">
              {categoryName(t, category.id)}
              <span className="ml-2 text-sm font-semibold text-zinc-400">{places.length}</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {places.map((place) => (
                <PlaceCard
                  key={place.id}
                  place={place}
                  isFavorite
                  onToggleFavorite={(id, event) => {
                    event.stopPropagation();
                    event.preventDefault();
                    onToggleFavorite(id);
                  }}
                  onSelectPlace={onSelectPlace}
                />
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
};
