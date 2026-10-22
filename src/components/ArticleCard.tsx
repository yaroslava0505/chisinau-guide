import React from 'react';
import { ArrowRight, ImageOff } from 'lucide-react';
import type { Article } from '../types';
import { getArticleImage } from '../utils/seo';
import { categoryName } from '../i18n/labels';
import { useT } from '../i18n';

interface ArticleCardProps {
  article: Article;
  onSelectArticle: (article: Article) => void;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article, onSelectArticle }) => {
  const t = useT();

  return (
    <article className="group bg-white rounded-3xl border border-zinc-200/80 overflow-hidden hover:shadow-xl hover:shadow-zinc-200/60 transition-all duration-300 flex flex-col">
      <button
        type="button"
        onClick={() => onSelectArticle(article)}
        className="relative aspect-[16/9] overflow-hidden bg-zinc-100 block w-full text-left"
      >
        <img
          src={getArticleImage(article)}
          alt={`${t.common.illustrative}: ${categoryName(t, article.category)}`}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
        />
        <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-black/55 backdrop-blur-sm text-white text-[10px] font-semibold">
          <ImageOff className="w-3 h-3" aria-hidden="true" />
          {t.common.illustrative}
        </span>
        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/95 text-zinc-900 backdrop-blur-md">
          {categoryName(t, article.category)}
        </span>
      </button>

      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-lg font-bold text-zinc-900 font-['Outfit',sans-serif] leading-snug">
          <button
            type="button"
            onClick={() => onSelectArticle(article)}
            className="text-left hover:text-zinc-600 transition-colors"
          >
            {article.title}
          </button>
        </h3>

        <p className="text-sm text-zinc-600 mt-2 line-clamp-2 leading-relaxed flex-1">
          {article.excerpt}
        </p>

        <button
          type="button"
          onClick={() => onSelectArticle(article)}
          className="inline-flex items-center gap-1.5 mt-4 text-sm font-semibold text-zinc-900 hover:gap-2.5 transition-all self-start"
        >
          {t.articles.readMore}
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </article>
  );
};
