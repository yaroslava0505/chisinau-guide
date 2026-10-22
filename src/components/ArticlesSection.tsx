import React from 'react';
import { ArrowRight } from 'lucide-react';
import type { Article } from '../types';
import { ArticleCard } from './ArticleCard';
import { useT } from '../i18n';

interface ArticlesSectionProps {
  articles: Article[];
  onSelectArticle: (article: Article) => void;
  /** `page` renders the standalone /articles view, with no teaser limit. */
  variant?: 'home' | 'page';
  /** Number of cards shown in the home teaser. */
  limit?: number;
  onOpenAllArticles?: () => void;
}

export const ArticlesSection: React.FC<ArticlesSectionProps> = ({
  articles,
  onSelectArticle,
  variant = 'home',
  limit = 3,
  onOpenAllArticles,
}) => {
  const t = useT();
  const isPage = variant === 'page';
  const visible = isPage ? articles : articles.slice(0, limit);

  if (visible.length === 0) return null;

  return (
    <section className={isPage ? '' : 'space-y-5'}>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-5">
        <div>
          <h2
            className={`font-extrabold text-zinc-900 font-['Outfit',sans-serif] ${
              isPage ? 'text-3xl sm:text-4xl' : 'text-2xl sm:text-3xl'
            }`}
          >
            {isPage ? t.articles.indexTitle : t.articles.homeTitle}
          </h2>
          <p className="text-sm text-zinc-500 mt-1">
            {isPage ? t.articles.indexSubtitle : t.articles.homeSubtitle}
          </p>
        </div>

        {!isPage && onOpenAllArticles && (
          <button
            type="button"
            onClick={onOpenAllArticles}
            className="inline-flex items-center gap-1.5 py-2 text-sm font-semibold text-zinc-900 hover:gap-2.5 transition-all self-start sm:self-auto"
          >
            {t.articles.allArticles}
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        )}
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((article) => (
          <ArticleCard key={article.id} article={article} onSelectArticle={onSelectArticle} />
        ))}
      </div>
    </section>
  );
};
