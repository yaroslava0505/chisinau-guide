import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import type { Place } from '../types';
import { collectSitemapPaths, generateRobotsTxt, generateSitemapXml } from '../utils/seo';
import { useT } from '../i18n';
import { Sheet } from './ui/Sheet';

interface SeoModalProps {
  places: Place[];
  onClose: () => void;
}

type Tab = 'overview' | 'schema' | 'sitemap' | 'robots';

const TAB_IDS: Tab[] = ['overview', 'schema', 'sitemap', 'robots'];

/** Admin-only inspector for the metadata the app emits. Not part of the public UI. */
export const SeoModal: React.FC<SeoModalProps> = ({ places, onClose }) => {
  const t = useT();
  const [tab, setTab] = useState<Tab>('overview');
  const [copied, setCopied] = useState(false);

  const sitemapXml = generateSitemapXml(places);
  const robotsTxt = generateRobotsTxt();
  const urlCount = collectSitemapPaths(places).length;

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt(t.seoModal.copyPrompt, text);
    }
  };

  const CopyButton: React.FC<{ text: string }> = ({ text }) => (
    <button
      type="button"
      onClick={() => copy(text)}
      className="inline-flex items-center gap-1 text-xs font-bold text-zinc-700 hover:text-zinc-950"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
      {t.seoModal.copy}
    </button>
  );

  const metaContent = (selector: string) =>
    document.head.querySelector(selector)?.getAttribute('content') ??
    document.head.querySelector(selector)?.getAttribute('href') ??
    '—';

  return (
    <Sheet title={t.seoModal.title} onClose={onClose} variant="dialog" maxWidth="max-w-3xl">
      <div className="flex gap-4 border-b border-zinc-100 mb-5 text-xs font-bold overflow-x-auto no-scrollbar">
        {TAB_IDS.map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`py-2.5 border-b-2 whitespace-nowrap transition-colors ${
              tab === id ? 'border-zinc-900 text-zinc-900' : 'border-transparent text-zinc-500 hover:text-zinc-800'
            }`}
          >
            {t.seoModal.tabs[id]}
          </button>
        ))}
      </div>

      <div className="space-y-4 text-sm">
        {tab === 'overview' && (
          <div className="space-y-3">
            {[
              ['Title', document.title],
              ['Description', metaContent('meta[name="description"]')],
              ['Canonical', document.head.querySelector('link[rel="canonical"]')?.getAttribute('href') ?? '—'],
              ['og:url', metaContent('meta[property="og:url"]')],
              ['robots', metaContent('meta[name="robots"]')],
            ].map(([label, value]) => (
              <div key={label} className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200">
                <span className="font-bold text-zinc-700 block mb-1 text-xs">{label}</span>
                <code className="text-xs bg-white px-2 py-1.5 rounded border border-zinc-200 block text-zinc-800 break-all">
                  {value}
                </code>
              </div>
            ))}

            <p className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs leading-relaxed">
              {t.seoModal.explanation}
            </p>
          </div>
        )}

        {tab === 'schema' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-zinc-600 text-xs">{t.seoModal.currentJsonLd}</span>
              <CopyButton text={document.getElementById('schema-structured-data')?.textContent ?? ''} />
            </div>
            <pre className="p-4 rounded-2xl bg-zinc-900 text-zinc-100 font-mono text-xs overflow-x-auto max-h-80">
              {document.getElementById('schema-structured-data')?.textContent ?? t.seoModal.noData}
            </pre>
          </div>
        )}

        {tab === 'sitemap' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-zinc-600 text-xs">{t.seoModal.sitemapCount(urlCount)}</span>
              <CopyButton text={sitemapXml} />
            </div>
            <pre className="p-4 rounded-2xl bg-zinc-900 text-zinc-100 font-mono text-xs overflow-x-auto max-h-80">
              {sitemapXml}
            </pre>
          </div>
        )}

        {tab === 'robots' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-zinc-600 text-xs">robots.txt</span>
              <CopyButton text={robotsTxt} />
            </div>
            <pre className="p-4 rounded-2xl bg-zinc-900 text-zinc-100 font-mono text-xs overflow-x-auto max-h-80">
              {robotsTxt}
            </pre>
          </div>
        )}
      </div>
    </Sheet>
  );
};
