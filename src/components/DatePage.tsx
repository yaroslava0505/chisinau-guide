import React from 'react';
import { ArrowRight, CalendarHeart, Palette, Trees, UtensilsCrossed } from 'lucide-react';
import type { CityEvent, Place } from '../types';
import { PlaceCard } from './PlaceCard';
import { EventCard } from './EventsSection';
import { dateActivities, dateEvents, dateFood, dateWalks } from '../utils/datePlan';
import { useT } from '../i18n';

interface DatePageProps {
  places: Place[];
  events: CityEvent[];
  favorites: string[];
  onSelectPlace: (place: Place) => void;
  onToggleFavorite: (id: string, event: React.MouseEvent) => void;
  onSelectEvent: (event: CityEvent) => void;
  onOpenEvents: () => void;
}

const Section: React.FC<{
  icon: React.ElementType;
  title: string;
  hint: string;
  children: React.ReactNode;
}> = ({ icon: Icon, title, hint, children }) => (
  <section className="space-y-4">
    <header className="space-y-1">
      <h2 className="flex items-center gap-2 text-xl font-extrabold text-zinc-900 font-['Outfit',sans-serif]">
        <Icon className="w-5 h-5 text-rose-500" aria-hidden="true" />
        {title}
      </h2>
      <p className="text-sm text-zinc-500 leading-relaxed">{hint}</p>
    </header>
    {children}
  </section>
);

export const DatePage: React.FC<DatePageProps> = ({
  places,
  events,
  favorites,
  onSelectPlace,
  onToggleFavorite,
  onSelectEvent,
  onOpenEvents,
}) => {
  const t = useT();
  const food = dateFood(places);
  const walks = dateWalks(places);
  const activities = dateActivities(places);
  const upcoming = dateEvents(events);

  const grid = (items: Place[]) => (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {items.map((place) => (
        <PlaceCard
          key={place.id}
          place={place}
          isFavorite={favorites.includes(place.id)}
          onToggleFavorite={onToggleFavorite}
          onSelectPlace={onSelectPlace}
        />
      ))}
    </div>
  );

  return (
    <div className="py-10 sm:py-14 space-y-12">
      <header className="max-w-2xl space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 font-['Outfit',sans-serif]">
          {t.date.title}
        </h1>
        <p className="text-base text-zinc-600 leading-relaxed">{t.date.intro}</p>
      </header>

      {food.length > 0 && (
        <Section icon={UtensilsCrossed} title={t.date.foodTitle} hint={t.date.foodHint}>
          {grid(food)}
        </Section>
      )}

      {upcoming.length > 0 && (
        <Section icon={CalendarHeart} title={t.date.eventsTitle} hint={t.date.eventsHint}>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {upcoming.map((event) => (
              <EventCard key={event.id} event={event} t={t} onSelectEvent={onSelectEvent} />
            ))}
          </div>
          <button
            type="button"
            onClick={onOpenEvents}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-900 hover:gap-2.5 transition-all"
          >
            {t.events.allEvents}
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </Section>
      )}

      {walks.length > 0 && (
        <Section icon={Trees} title={t.date.walksTitle} hint={t.date.walksHint}>
          {grid(walks)}
        </Section>
      )}

      {activities.length > 0 && (
        <Section icon={Palette} title={t.date.activitiesTitle} hint={t.date.activitiesHint}>
          {grid(activities)}
        </Section>
      )}

      <p className="text-xs text-zinc-400 max-w-2xl leading-relaxed">{t.date.selectionNote}</p>
    </div>
  );
};
