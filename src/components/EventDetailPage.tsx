import React from 'react';
import { ArrowLeft, Calendar, Clock, ImageOff, MapPin, Ticket } from 'lucide-react';
import type { CityEvent } from '../types';
import { isPastEvent, occurrenceLabel } from '../utils/events';
import { useT } from '../i18n';

interface EventDetailPageProps {
  event: CityEvent;
  onBackToEvents: () => void;
}

export const EventDetailPage: React.FC<EventDetailPageProps> = ({ event, onBackToEvents }) => {
  const t = useT();
  const past = isPastEvent(event);

  return (
    <div className="py-8 sm:py-10 max-w-2xl mx-auto space-y-8">
      <button
        type="button"
        onClick={onBackToEvents}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-500 hover:text-zinc-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        {t.events.allEvents}
      </button>

      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-block px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700">
            {event.category}
          </span>
          {past && (
            <span className="inline-block px-2.5 py-1 rounded-full text-[11px] font-bold bg-zinc-100 text-zinc-500">
              {t.events.pastEventNote}
            </span>
          )}
          {event.is_demo && (
            <span
              className="px-2 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-400 text-zinc-950"
              title={t.common.demoHint}
            >
              {t.common.demo}
            </span>
          )}
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 font-['Outfit',sans-serif] leading-tight">
          {event.title}
        </h1>
        <p className="text-base text-zinc-600 leading-relaxed">{event.description}</p>
      </header>

      <div className={`relative aspect-[16/9] rounded-3xl overflow-hidden bg-zinc-100 ${past ? 'opacity-60' : ''}`}>
        <img
          src={event.image}
          alt={`${t.common.illustrative}: ${event.category}`}
          loading="lazy"
          className="w-full h-full object-cover"
        />
        <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-black/55 backdrop-blur-sm text-white text-[10px] font-semibold">
          <ImageOff className="w-3 h-3" aria-hidden="true" />
          {t.common.illustrative}
        </span>
      </div>

      <div className="bg-white rounded-3xl border border-zinc-200 p-6 space-y-4">
        <p className="flex items-center gap-2.5 text-sm">
          <Calendar className="w-4 h-4 text-zinc-400 shrink-0" aria-hidden="true" />
          <span className="font-semibold text-zinc-900">{occurrenceLabel(event, t)}</span>
          <span className="text-zinc-300">·</span>
          <Clock className="w-4 h-4 text-zinc-400 shrink-0" aria-hidden="true" />
          <span className="text-zinc-700">{event.time}</span>
        </p>

        <p className="flex items-start gap-2.5 text-sm">
          <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" aria-hidden="true" />
          <span>
            <span className="block font-semibold text-zinc-900">{event.location_name}</span>
            <span className="block text-zinc-500">{event.address}</span>
          </span>
        </p>

        <p className="flex items-center gap-2.5 text-sm">
          <Ticket className="w-4 h-4 text-zinc-400 shrink-0" aria-hidden="true" />
          <span className="text-zinc-700">{event.price}</span>
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
  );
};
