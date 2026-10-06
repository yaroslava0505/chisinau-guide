import React, { useMemo, useState } from 'react';
import { ArrowRight, Calendar, Clock, ImageOff, MapPin, Ticket } from 'lucide-react';
import type { CityEvent, EventType, EventWhen } from '../types';
import { isPastEvent, matchesWhen, occurrenceLabel, sortEvents, whenOptions } from '../utils/events';
import { useT } from '../i18n';
import type { Dictionary } from '../i18n/dictionaries/uk';
import { eventTypeOptions } from '../i18n/labels';
import { ToggleChip } from './ui/Chip';

interface EventsSectionProps {
  events: CityEvent[];
  /** `page` renders the standalone /events view with filters. */
  variant?: 'home' | 'page';
  /** Number of cards shown in the home teaser. */
  limit?: number;
  onOpenAllEvents?: () => void;
}

const EventCard: React.FC<{ event: CityEvent; t: Dictionary }> = ({ event, t }) => {
  const past = isPastEvent(event);

  return (
    <article
      id={`event-card-${event.slug}`}
      className={`group bg-white rounded-3xl border border-zinc-200/80 overflow-hidden hover:shadow-xl hover:shadow-zinc-200/60 transition-all duration-300 flex flex-col ${
        past ? 'opacity-60' : ''
      }`}
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-zinc-100">
        <img
          src={event.image}
          // Every event image is a themed stock illustration (see the note
          // below), never a photo of the event itself — the alt text says so
          // instead of claiming otherwise.
          alt={`${t.common.illustrative}: ${event.category}`}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
        />
        {/* No licensed event photos exist yet — every image here is a themed
            stock illustration, so it must always carry the note (see Place's
            same rule in utils/illustrations.ts). */}
        <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-black/55 backdrop-blur-sm text-white text-[10px] font-semibold">
          <ImageOff className="w-3 h-3" aria-hidden="true" />
          {t.common.illustrative}
        </span>
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/95 text-zinc-900 backdrop-blur-md">
            {occurrenceLabel(event, t)}
          </span>
          {event.is_demo && (
            <span
              className="px-2 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-400 text-zinc-950"
              title={t.common.demoHint}
            >
              {t.common.demo}
            </span>
          )}
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-xs font-bold text-purple-600">{event.category}</span>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-700 bg-zinc-100 px-2 py-0.5 rounded-md">
            <Ticket className="w-3 h-3 text-zinc-400" aria-hidden="true" />
            {event.price}
          </span>
        </div>

        <h3 className="text-lg font-bold text-zinc-900 font-['Outfit',sans-serif] leading-snug">
          {event.title}
        </h3>

        <p className="text-sm text-zinc-600 mt-2 line-clamp-2 leading-relaxed">
          {event.description}
        </p>

        <div className="mt-4 pt-4 border-t border-zinc-100 space-y-2 text-xs text-zinc-500">
          <p className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-zinc-400 shrink-0" aria-hidden="true" />
            <span className="font-semibold text-zinc-800">{event.date}</span>
            <span className="text-zinc-300">·</span>
            <Clock className="w-3.5 h-3.5 text-zinc-400 shrink-0" aria-hidden="true" />
            <span>{event.time}</span>
          </p>

          <p className="flex items-start gap-2">
            <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" aria-hidden="true" />
            <span>
              <span className="font-medium text-zinc-700">{event.location_name}</span>
              <span className="block text-zinc-500">{event.address}</span>
            </span>
          </p>

          {event.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {event.tags.map((tag) => (
                <span key={tag} className="px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-600 text-[11px] font-medium">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

export const EventsSection: React.FC<EventsSectionProps> = ({
  events,
  variant = 'home',
  limit = 2,
  onOpenAllEvents,
}) => {
  const t = useT();
  const [when, setWhen] = useState<EventWhen>('all');
  const [type, setType] = useState<EventType | 'all'>('all');

  const visible = useMemo(() => {
    const sorted = sortEvents(events);
    if (variant === 'home') return sorted.slice(0, limit);

    return sorted.filter(
      (event) => matchesWhen(event, when) && (type === 'all' || event.event_type === type),
    );
  }, [events, variant, limit, when, type]);

  const isPage = variant === 'page';

  return (
    <section className={isPage ? '' : 'space-y-5'}>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-5">
        <div>
          <h2 className={`font-extrabold text-zinc-900 font-['Outfit',sans-serif] ${isPage ? 'text-3xl sm:text-4xl' : 'text-2xl sm:text-3xl'}`}>
            {isPage ? t.events.pageTitle : t.events.homeTitle}
          </h2>
          <p className="text-sm text-zinc-500 mt-1">
            {isPage ? t.events.pageSubtitle : t.events.homeSubtitle}
          </p>
        </div>

        {!isPage && onOpenAllEvents && (
          <button
            type="button"
            onClick={onOpenAllEvents}
            className="inline-flex items-center gap-1.5 py-2 text-sm font-semibold text-zinc-900 hover:gap-2.5 transition-all self-start sm:self-auto"
          >
            {t.events.allEvents}
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        )}
      </div>

      {isPage && (
        <div className="space-y-3 mb-7">
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {whenOptions(t).map((option) => (
              <ToggleChip
                key={option.value}
                active={when === option.value}
                onClick={() => setWhen(option.value)}
              >
                {option.label}
              </ToggleChip>
            ))}
          </div>

          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            <ToggleChip active={type === 'all'} onClick={() => setType('all')}>
              {t.events.allTypes}
            </ToggleChip>
            {eventTypeOptions(t).map((option) => (
              <ToggleChip
                key={option.value}
                active={type === option.value}
                onClick={() => setType(option.value as EventType)}
              >
                {option.label}
              </ToggleChip>
            ))}
          </div>
        </div>
      )}

      {visible.length === 0 ? (
        <div className="py-14 text-center bg-white rounded-3xl border border-zinc-200 px-6">
          <p className="font-bold text-zinc-900">{t.events.emptyTitle}</p>
          <p className="text-sm text-zinc-500 mt-1.5">{t.events.emptyText}</p>
        </div>
      ) : (
        <div className={`grid gap-6 ${isPage ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2'}`}>
          {visible.map((event) => (
            <EventCard key={event.id} event={event} t={t} />
          ))}
        </div>
      )}
    </section>
  );
};
