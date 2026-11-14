import React from 'react';
import { ChevronRight } from 'lucide-react';
import { navigate, withLocale } from '../../router';
import { useLocale } from '../../i18n';

export interface Crumb {
  label: string;
  /** Locale-less path; the last crumb has none and renders as plain text. */
  path?: string;
}

/**
 * The same trail that already ships as BreadcrumbList JSON-LD, made visible.
 * A visitor who arrived from search needs a way up a level that isn't the
 * browser's back button into the results page.
 */
export const Breadcrumbs: React.FC<{ items: Crumb[] }> = ({ items }) => {
  const { locale } = useLocale();

  return (
    <nav aria-label="breadcrumb" className="text-xs text-zinc-500">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1.5 min-w-0">
              {item.path && !isLast ? (
                <a
                  href={withLocale(item.path, locale)}
                  onClick={(event) => {
                    if (event.metaKey || event.ctrlKey || event.shiftKey) return;
                    event.preventDefault();
                    navigate(withLocale(item.path!, locale));
                  }}
                  className="hover:text-zinc-900 transition-colors"
                >
                  {item.label}
                </a>
              ) : (
                <span className="text-zinc-400 truncate max-w-[18ch] sm:max-w-[40ch]" aria-current="page">
                  {item.label}
                </span>
              )}
              {!isLast && <ChevronRight className="w-3 h-3 text-zinc-300 shrink-0" aria-hidden="true" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
