import React, { useMemo, useState } from 'react';
import { ArrowRight, Calendar, Clock, Coffee, Flame } from 'lucide-react';
import type { CityEvent, Place } from '../types';
import { PlaceCard } from './PlaceCard';
import { isOpenNow } from '../utils/openingHours';
import { matchesWhen, occurrenceLabel, sortEvents } from '../utils/events';
import { useT } from '../i18n';

type TabId = 'open' | 'coffee' | 'popular' | 'events';

interface TodaySectionProps {
  places: Place[];
  events: CityEvent[];
  favorites: string[];
  onSelectPlace: (place: Place) => void;
  onToggleFavorite: (id: string, event: React.MouseEvent) => void;
  onOpenEvents: () => void;
  /** Sends the visitor to the feed filtered to what is open right now. */
  onPickForMe: () => void;
}

const TABS: { id: TabId; icon: React.ElementType }[] = [
  { id: 'open', icon: Clock },
  { id: 'coffee', icon: Coffee },
  { id: 'popular', icon: Flame },
  { id: 'events', icon: Calendar },
];

/**
 * The "куди піти сьогодні" band: a fast answer built only from data that is
 * genuinely time-aware (opening hours, event dates) plus editorial flags.
 */
export const TodaySection: React.FC<TodaySectionProps> = ({
  places,
  events,
  favorites,
  onSelectPlace,
  onToggleFavorite,
  onOpenEvents,
  onPickForMe,
}) => {
  const t = useT();
  const [tab, setTab] = useState<TabId>('open');

  // Counts are computed from the catalogue, never hard-coded.
  const openNowAll = useMemo(
    () => places.filter((place) => isOpenNow(place.opening_hours)),
    [places],
  );
  const openNow = useMemo(() => openNowAll.slice(0, 3), [openNowAll]);

  const coffee = useMemo(
    () => places.filter((place) => place.category === 'cafes' || place.venue_type === 'cafe').slice(0, 3),
    [places],
  );

  const popular = useMemo(
    () => places.filter((place) => place.is_popular || place.is_featured).slice(0, 3),
    [places],
  );

  const todayEvents = useMemo(() => {
    const upcoming = sortEvents(events);
    const today = upcoming.filter((event) => matchesWhen(event, 'today'));
    return (today.length > 0 ? today : upcoming).slice(0, 3);
  }, [events]);

  const shownPlaces = tab === 'open' ? openNow : tab === 'coffee' ? coffee : tab === 'popular' ? popular : [];

  const emptyMessage = tab === 'open' ? t.today.emptyOpen : t.today.emptyGeneric;

  return (
    <section className="bg-white rounded-3xl border border-zinc-200 p-5 sm:p-7">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-5">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 font-['Outfit',sans-serif]">
            {t.today.heading}
          </h2>
          <p className="text-sm text-zinc-500 mt-1">{t.today.subtitle}</p>

          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-3 text-xs font-semibold text-zinc-700">
            {openNowAll.length > 0 ? (
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" aria-hidden="true" />
                {t.today.openNowCount(openNowAll.length)}
              </span>
            ) : (
              <span className="text-zinc-400">{t.today.noData}</span>
            )}
            {todayEvents.length > 0 && (
              <span className="text-zinc-500">{t.today.eventsToday(todayEvents.length)}</span>
            )}
          </p>
        </div>


      </div>

      <button
        type="button"
        onClick={onPickForMe}
        className="w-full sm:w-auto mb-6 px-6 py-3.5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-bold transition-colors min-h-[52px]"
      >
        {t.today.cta}
      </button>

      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 mb-6 -mx-1 px-1">
        {TABS.map(({ id, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            aria-pressed={tab === id}
            className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap border transition-all min-h-[44px] ${
              tab === id
                ? 'bg-zinc-900 text-white border-zinc-900'
                : 'bg-white text-zinc-700 border-zinc-200 hover:border-zinc-400'
            }`}
          >
            <Icon className="w-4 h-4" aria-hidden="true" />
            {t.today.tabs[id]}
          </button>
        ))}
      </div>

      {tab === 'events' ? (
        <div className="space-y-3">
          {todayEvents.length === 0 ? (
            <p className="text-sm text-zinc-500 py-6 text-center">{t.today.noEvents}</p>
          ) : (
            todayEvents.map((event) => (
              <button
                key={event.id}
                type="button"
                onClick={onOpenEvents}
                className="w-full text-left flex items-center gap-4 p-3 rounded-2xl border border-zinc-200 hover:border-zinc-400 transition-colors"
              >
                <img
                  src={event.image}
                  alt=""
                  loading="lazy"
                  className="w-20 h-16 rounded-xl object-cover shrink-0"
                />
                <span className="min-w-0 flex-1">
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-purple-600">
                    {occurrenceLabel(event, t)} · {event.time}
                  </span>
                  <span className="block font-bold text-zinc-900 truncate">{event.title}</span>
                  <span className="block text-xs text-zinc-500 truncate">
                    {event.location_name} · {event.price}
                  </span>
                </span>
                <ArrowRight className="w-4 h-4 text-zinc-300 shrink-0" aria-hidden="true" />
              </button>
            ))
          )}

          <button
            type="button"
            onClick={onOpenEvents}
            className="inline-flex items-center gap-1.5 py-2.5 text-sm font-semibold text-zinc-900 hover:gap-2.5 transition-all"
          >
            {t.today.allEvents}
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      ) : shownPlaces.length === 0 ? (
        <p className="text-sm text-zinc-500 py-6 text-center">{emptyMessage}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {shownPlaces.map((place) => (
            <PlaceCard
              key={place.id}
              place={place}
              variant="compact"
              isFavorite={favorites.includes(place.id)}
              onToggleFavorite={onToggleFavorite}
              onSelectPlace={onSelectPlace}
            />
          ))}
        </div>
      )}
    </section>
  );
};
