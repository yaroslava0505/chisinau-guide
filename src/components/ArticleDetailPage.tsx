import React from 'react';
import { ArrowLeft, ArrowRight, Calendar, ImageOff, Ticket } from 'lucide-react';
import type { Article, CityEvent, Place } from '../types';
import { getArticleImage } from '../utils/seo';
import { categoryName } from '../i18n/labels';
import { useT } from '../i18n';
import { PlaceCard } from './PlaceCard';
import { ArticleCard } from './ArticleCard';
import { Breadcrumbs } from './ui/Breadcrumbs';
import { occurrenceLabel } from '../utils/events';

interface ArticleDetailPageProps {
  article: Article;
  places: Place[];
  events: CityEvent[];
  favorites: string[];
  onToggleFavorite: (id: string, event: React.MouseEvent) => void;
  onSelectPlace: (place: Place) => void;
  onSelectEvent: (event: CityEvent) => void;
  onBackToArticles: () => void;
  onOpenCategory: () => void;
  /** Other guides to read next — keeps a search visitor on the site. */
  moreArticles: Article[];
  onSelectArticle: (article: Article) => void;
}

export const ArticleDetailPage: React.FC<ArticleDetailPageProps> = ({
  article,
  places,
  events,
  favorites,
  onToggleFavorite,
  onSelectPlace,
  onSelectEvent,
  onBackToArticles,
  onOpenCategory,
  moreArticles,
  onSelectArticle,
}) => {
  const t = useT();

  const relatedPlaces = article.placeSlugs
    .map((slug) => places.find((place) => place.slug === slug))
    .filter((place): place is Place => Boolean(place));

  const relatedEvent = article.eventSlug
    ? events.find((event) => event.slug === article.eventSlug)
    : undefined;

  return (
    <div className="py-8 sm:py-10 max-w-3xl mx-auto space-y-8">
      <Breadcrumbs
        items={[
          { label: t.common.home, path: '/' },
          { label: t.articles.indexTitle, path: '/articles' },
          { label: article.title },
        ]}
      />

      <button
        type="button"
        onClick={onBackToArticles}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-500 hover:text-zinc-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        {t.articles.backToArticles}
      </button>

      <header className="space-y-3">
        <span className="inline-block px-2.5 py-1 rounded-full text-[11px] font-bold bg-zinc-100 text-zinc-700">
          {categoryName(t, article.category)}
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 font-['Outfit',sans-serif] leading-tight">
          {article.title}
        </h1>
        <p className="text-base text-zinc-600 leading-relaxed">{article.excerpt}</p>
        <p className="flex items-center gap-1.5 text-xs text-zinc-400">
          <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
          {t.articles.publishedOn(article.publishedAt)}
        </p>
      </header>

      <div className="relative aspect-[16/9] rounded-3xl overflow-hidden bg-zinc-100">
        <img
          src={getArticleImage(article)}
          alt={article.image ? article.title : `${t.common.illustrative}: ${categoryName(t, article.category)}`}
          loading="lazy"
          className="w-full h-full object-cover"
        />
        {article.imageCredit ? (
          <a
            href={article.imageCredit.url}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-3 left-3 inline-flex items-center px-2 py-1 rounded-lg bg-black/55 backdrop-blur-sm text-white text-[10px] font-semibold hover:bg-black/70"
          >
            {t.common.photo}: {article.imageCredit.author} · {article.imageCredit.license}
          </a>
        ) : (
          <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-black/55 backdrop-blur-sm text-white text-[10px] font-semibold">
            <ImageOff className="w-3 h-3" aria-hidden="true" />
            {t.common.illustrative}
          </span>
        )}
      </div>

      {relatedEvent && (
        <section className="bg-zinc-900 text-white rounded-3xl p-5 sm:p-6 space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            {t.events.whenWhere}
          </h2>
          <dl className="grid sm:grid-cols-3 gap-3 text-sm">
            <div>
              <dt className="text-zinc-400 text-xs">{t.admin.columns.date}</dt>
              <dd className="font-bold">{occurrenceLabel(relatedEvent, t)} · {relatedEvent.time}</dd>
            </div>
            <div>
              <dt className="text-zinc-400 text-xs">{t.admin.columns.place}</dt>
              <dd className="font-bold">{relatedEvent.location_name}</dd>
            </div>
            <div>
              <dt className="text-zinc-400 text-xs">{t.admin.columns.price}</dt>
              <dd className="font-bold">{relatedEvent.price}</dd>
            </div>
          </dl>
          <div className="flex flex-wrap items-center gap-3 pt-1">
            {relatedEvent.ticket_url && (
              <a
                href={relatedEvent.ticket_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white text-zinc-900 font-bold text-sm px-5 py-3 rounded-2xl hover:bg-zinc-100 transition-colors"
              >
                <Ticket className="w-4 h-4" aria-hidden="true" />
                {t.events.tickets}
              </a>
            )}
            <button
              type="button"
              onClick={() => onSelectEvent(relatedEvent)}
              className="text-sm font-semibold text-zinc-300 hover:text-white transition-colors"
            >
              {t.common.details}
            </button>
          </div>
        </section>
      )}

      <div className="space-y-4 text-base text-zinc-700 leading-relaxed">
        {article.body.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>

      {relatedPlaces.length > 0 && (
        <section className="space-y-5 pt-2">
          <h2 className="text-xl font-extrabold text-zinc-900 font-['Outfit',sans-serif]">
            {t.articles.relatedPlacesTitle}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {relatedPlaces.map((place) => (
              <PlaceCard
                key={place.id}
                place={place}
                isFavorite={favorites.includes(place.id)}
                onToggleFavorite={onToggleFavorite}
                onSelectPlace={onSelectPlace}
              />
            ))}
          </div>
        </section>
      )}

      {moreArticles.length > 0 && (
        <section className="space-y-5 pt-2">
          <h2 className="text-xl font-extrabold text-zinc-900 font-['Outfit',sans-serif]">
            {t.articles.readAlso}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {moreArticles.map((item) => (
              <ArticleCard key={item.id} article={item} onSelectArticle={onSelectArticle} />
            ))}
          </div>
        </section>
      )}

      <button
        type="button"
        onClick={onOpenCategory}
        className="inline-flex items-center gap-1.5 px-5 py-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-bold transition-colors"
      >
        {categoryName(t, article.category)}
        <ArrowRight className="w-4 h-4" aria-hidden="true" />
      </button>
    </div>
  );
};
