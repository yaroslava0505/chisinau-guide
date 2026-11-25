import React, { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { navigate, withLocale } from '../../router';
import { useLocale } from '../../i18n';

/**
 * The single ad slot on the site.
 *
 * With `VITE_ADSENSE_CLIENT` (and a slot id) set, it renders a Google AdSense
 * unit. Without them — which is the case until AdSense approves the site — it
 * renders the guide's own "this space is for rent" card pointing at /business,
 * so the slot is never an empty hole and never a third-party script we don't
 * need. Either way the block is labelled, and its height is reserved up front
 * so nothing below it jumps when the ad loads.
 */
const CLIENT = import.meta.env?.VITE_ADSENSE_CLIENT as string | undefined;

interface AdSlotProps {
  /** AdSense slot id for this placement; falls back to the in-house card. */
  slot?: string;
  className?: string;
}

export const AdSlot: React.FC<AdSlotProps> = ({ slot, className = '' }) => {
  const { locale, t } = useLocale();
  const insRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);
  const useAdsense = Boolean(CLIENT && slot);

  useEffect(() => {
    if (!useAdsense || pushed.current || !insRef.current) return;

    // The library is only fetched when an ad is actually configured.
    const SRC = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${CLIENT}`;
    if (!document.querySelector(`script[src^="https://pagead2.googlesyndication.com"]`)) {
      const script = document.createElement('script');
      script.src = SRC;
      script.async = true;
      script.crossOrigin = 'anonymous';
      document.head.appendChild(script);
    }

    try {
      ((window as unknown as { adsbygoogle?: unknown[] }).adsbygoogle ||= []).push({});
      pushed.current = true;
    } catch {
      // A blocked or failed ad must never break the page around it.
    }
  }, [useAdsense]);

  return (
    <aside className={`space-y-2 ${className}`} aria-label={t.ads.label}>
      <p className="text-[11px] uppercase tracking-wider text-zinc-400">{t.ads.label}</p>

      {useAdsense ? (
        <ins
          ref={insRef}
          className="adsbygoogle block min-h-[280px] w-full"
          data-ad-client={CLIENT}
          data-ad-slot={slot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      ) : (
        <div className="min-h-[180px] rounded-3xl border border-dashed border-zinc-300 bg-white p-6 flex flex-col justify-center gap-3">
          <p className="text-lg font-bold text-zinc-900 font-['Outfit',sans-serif]">{t.ads.ownTitle}</p>
          <p className="text-sm text-zinc-600 leading-relaxed max-w-prose">{t.ads.ownText}</p>
          <a
            href={withLocale('/business', locale)}
            onClick={(event) => {
              if (event.metaKey || event.ctrlKey || event.shiftKey) return;
              event.preventDefault();
              navigate(withLocale('/business', locale));
            }}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-900 hover:gap-2.5 transition-all self-start"
          >
            {t.ads.ownCta}
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </a>
        </div>
      )}
    </aside>
  );
};
