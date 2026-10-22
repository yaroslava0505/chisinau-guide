import React, { useState } from 'react';
import { Send, Sparkles } from 'lucide-react';
import type { Place } from '../types';
import { PlaceCard } from './PlaceCard';
import { useT } from '../i18n';

interface AiPlannerProps {
  /** Localized places — results are looked up here by slug. */
  places: Place[];
  favorites: string[];
  onToggleFavorite: (id: string, event: React.MouseEvent) => void;
  onSelectPlace: (place: Place) => void;
}

type Status = 'idle' | 'loading' | 'done' | 'error';

const MAX_QUERY_LENGTH = 300;

export const AiPlanner: React.FC<AiPlannerProps> = ({
  places,
  favorites,
  onToggleFavorite,
  onSelectPlace,
}) => {
  const t = useT();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [intro, setIntro] = useState('');
  const [resultSlugs, setResultSlugs] = useState<string[]>([]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed || status === 'loading') return;

    setStatus('loading');
    try {
      const response = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: trimmed }),
      });
      if (!response.ok) throw new Error(`status ${response.status}`);
      const data: { intro?: string; slugs?: string[] } = await response.json();
      setIntro(data.intro ?? '');
      setResultSlugs(Array.isArray(data.slugs) ? data.slugs : []);
      setStatus('done');
    } catch {
      // The dev server has no /api/recommend handler, so this is expected
      // locally — same honesty rule as the other form in this app: a failed
      // request says so, it never pretends to have worked.
      setStatus('error');
    }
  };

  const results = resultSlugs
    .map((slug) => places.find((place) => place.slug === slug))
    .filter((place): place is Place => Boolean(place));

  return (
    <section className="bg-white rounded-3xl border border-zinc-200 shadow-sm shadow-zinc-200/60 p-6 sm:p-10">
      <div className="flex items-center gap-3 mb-3">
        <span className="w-11 h-11 rounded-2xl bg-zinc-900 text-white flex items-center justify-center shrink-0">
          <Sparkles className="w-5 h-5" aria-hidden="true" />
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 font-['Outfit',sans-serif]">
          {t.aiPlanner.title}
        </h2>
      </div>
      <p className="text-sm sm:text-base text-zinc-600 mb-6 max-w-2xl">{t.aiPlanner.subtitle}</p>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <textarea
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t.aiPlanner.placeholder}
          rows={2}
          maxLength={MAX_QUERY_LENGTH}
          className="flex-1 bg-zinc-50 border border-zinc-200 rounded-2xl px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/5 resize-none transition-all"
        />
        <button
          type="submit"
          disabled={status === 'loading' || !query.trim()}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-zinc-900 text-white text-sm font-bold hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0 min-h-[48px]"
        >
          <Send className="w-4 h-4" aria-hidden="true" />
          {status === 'loading' ? t.aiPlanner.loading : t.aiPlanner.submit}
        </button>
      </form>

      {status === 'error' && (
        <p className="mt-4 text-sm text-rose-600">{t.aiPlanner.errorText}</p>
      )}

      {status === 'done' && (
        <div className="mt-5 space-y-4">
          {intro && <p className="text-sm text-zinc-700">{intro}</p>}
          {results.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.map((place) => (
                <PlaceCard
                  key={place.id}
                  place={place}
                  isFavorite={favorites.includes(place.id)}
                  onToggleFavorite={onToggleFavorite}
                  onSelectPlace={onSelectPlace}
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-zinc-500">{t.aiPlanner.emptyText}</p>
          )}
        </div>
      )}
    </section>
  );
};
