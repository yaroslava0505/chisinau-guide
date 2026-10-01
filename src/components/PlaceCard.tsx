import React from 'react';
import { Heart, MapPin } from 'lucide-react';
import type { Place } from '../types';
import { getCardChips } from '../utils/placeMetrics';
import { getOpenState, getOpenUntil } from '../utils/openingHours';
import { buildPath } from '../router';
import { PlacePhoto } from './ui/PlacePhoto';
import { useLocale } from '../i18n';
import { districtShortLabel } from '../i18n/labels';

interface PlaceCardProps {
  place: Place;
  isFavorite: boolean;
  onToggleFavorite: (id: string, event: React.MouseEvent) => void;
  onSelectPlace: (place: Place) => void;
  /** `compact` is used inside dense lists such as the map sidebar. */
  variant?: 'default' | 'compact';
}

export const PlaceCard: React.FC<PlaceCardProps> = ({
  place,
  isFavorite,
  onToggleFavorite,
  onSelectPlace,
  variant = 'default',
}) => {
  const { locale, t } = useLocale();
  const chips = getCardChips(place, t);
  const openState = getOpenState(place.opening_hours);
  const openUntil = getOpenUntil(place.opening_hours);
  const href = buildPath({ view: 'place', category: place.category, slug: place.slug }, locale);

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    // Let the browser handle new-tab / new-window gestures.
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
    event.preventDefault();
    onSelectPlace(place);
  };

  return (
    <article className="group relative h-full">
      <a
        href={href}
        onClick={handleClick}
        id={`place-card-${place.slug}`}
        className="flex h-full flex-col bg-white rounded-3xl border border-zinc-200/80 overflow-hidden hover:border-zinc-300 hover:shadow-xl hover:shadow-zinc-200/60 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2"
      >
        <div className={`relative w-full overflow-hidden bg-zinc-100 ${variant === 'compact' ? 'aspect-[16/9]' : 'aspect-[4/3]'}`}>
          <PlacePhoto
            place={place}
            alt={place.name}
            withNote
            noteClassName="bottom-10 left-3"
            className="w-full h-full group-hover:scale-[1.04] transition-transform duration-500 ease-out"
          />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/55 to-transparent pointer-events-none" />

          <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5">
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/95 text-zinc-900 backdrop-blur-md">
              {place.subcategory}
            </span>
            {place.is_demo && (
              <span
                className="px-2 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-400 text-zinc-950"
                title={t.common.demoHint}
              >
                {t.common.demo}
              </span>
            )}
          </div>

          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-medium">
            <span className="flex items-center gap-1 drop-shadow">
              <MapPin className="w-3.5 h-3.5 text-rose-300 shrink-0" aria-hidden="true" />
              <span className="truncate">{districtShortLabel(t, place.district)}</span>
            </span>
            <span className="px-2 py-0.5 rounded-md bg-black/45 backdrop-blur-md text-amber-200 font-bold tracking-widest text-[11px]">
              {'$'.repeat(place.price_level)}
            </span>
          </div>
        </div>

        <div className="p-5 flex-1 flex flex-col">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-bold text-lg text-zinc-900 leading-snug line-clamp-2 font-['Outfit',sans-serif]">
              {place.name}
            </h3>
          </div>

          <p className="mt-2 text-sm text-zinc-500 line-clamp-2 leading-relaxed">
            {place.description}
          </p>

          <div className="mt-auto pt-4 flex flex-wrap items-center gap-1.5">
            {chips.map((chip) => (
              <span
                key={chip.id}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-50 border border-zinc-200/80 text-[11px] font-semibold text-zinc-700"
              >
                <chip.icon className="w-3 h-3 text-zinc-400" aria-hidden="true" />
                {chip.label}
              </span>
            ))}

            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold ${
                openState === 'open'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : openState === 'closed'
                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                    : 'bg-zinc-100 text-zinc-500 border border-zinc-200'
              }`}
            >
              {openState === 'open'
                ? (openUntil ? t.common.openUntil(openUntil) : t.common.openNow)
                : openState === 'closed'
                  ? t.common.closedNow
                  : t.common.hoursUnknown}
            </span>
          </div>
        </div>
      </a>

      <button
        type="button"
        id={`btn-fav-${place.id}`}
        onClick={(event) => onToggleFavorite(place.id, event)}
        className={`absolute top-2 right-2 p-3 rounded-full backdrop-blur-md transition-transform active:scale-90 ${
          isFavorite
            ? 'bg-rose-500 text-white shadow-md'
            : 'bg-white/90 text-zinc-700 hover:text-rose-500 shadow-sm'
        }`}
        aria-pressed={isFavorite}
        aria-label={
          isFavorite
            ? t.detail.removeFromFavorites(place.name)
            : t.detail.addToFavorites(place.name)
        }
      >
        <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} aria-hidden="true" />
      </button>
    </article>
  );
};
