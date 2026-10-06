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
    <section className="bg-zinc-900 rounded-3xl p-6 sm:p-8 text-white">
      <div className="flex items-center gap-2.5 mb-4">
        <span className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
          <Sparkles className="w-4 h-4" aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold font-['Outfit',sans-serif]">
            {t.aiPlanner.title}
          </h2>
          <p className="text-xs text-zinc-400">{t.aiPlanner.subtitle}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <textarea
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t.aiPlanner.placeholder}
          rows={2}
          maxLength={MAX_QUERY_LENGTH}
          className="flex-1 bg-white/10 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-white/40 resize-none"
        />
        <button
          type="submit"
          disabled={status === 'loading' || !query.trim()}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white text-zinc-900 text-sm font-bold hover:bg-zinc-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0 min-h-[48px]"
        >
          <Send className="w-4 h-4" aria-hidden="true" />
          {status === 'loading' ? t.aiPlanner.loading : t.aiPlanner.submit}
        </button>
      </form>

      {status === 'error' && (
        <p className="mt-4 text-sm text-rose-300">{t.aiPlanner.errorText}</p>
      )}

      {status === 'done' && (
        <div className="mt-5 space-y-4">
          {intro && <p className="text-sm text-zinc-200">{intro}</p>}
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
            <p className="text-sm text-zinc-400">{t.aiPlanner.emptyText}</p>
          )}
        </div>
      )}
    </section>
  );
};
