import React, { useState } from 'react';
import { Check, MapPinPlus, Send } from 'lucide-react';
import { useT } from '../i18n';
import { categoryName } from '../i18n/labels';
import { CATEGORY_META } from '../data/taxonomy';

/**
 * "Add your favourite place" — a suggestion form for readers.
 *
 * There is no backend, so submissions go straight to Formspree
 * (https://formspree.io) — a hosted form endpoint that emails the site owner
 * and needs no server of our own. `VITE_FORMSPREE_ENDPOINT` (see .env.example)
 * holds the form's public submit URL; it is not a secret, so it's fine to bake
 * into the client bundle. Nothing is stored in the browser, and nothing
 * pretends to have been received when it has not — a failed request, or a
 * missing endpoint, says so instead of a fake success screen.
 */

type Status = 'idle' | 'sending' | 'sent' | 'error';

export const AddPlaceForm: React.FC = () => {
  const t = useT();
  const [status, setStatus] = useState<Status>('idle');
  const [isOpen, setOpen] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const endpoint = import.meta.env.VITE_FORMSPREE_ENDPOINT;
    if (!endpoint) {
      // No point sending a request that has nowhere to go — and this way the
      // error path is honest about *why* it failed (checked in the console).
      console.error('VITE_FORMSPREE_ENDPOINT is not set — see .env.example.');
      setStatus('error');
      return;
    }

    setStatus('sending');

    const data = new FormData(event.currentTarget);
    // Formspree's own conventions: `_replyto` sets the Reply-To header on the
    // notification email, so replying to a suggestion reaches its author.
    data.set('_replyto', String(data.get('contact-email') ?? ''));

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: data,
      });
      setStatus(response.ok ? 'sent' : 'error');
    } catch {
      setStatus('error');
    }
  };

  const field =
    'w-full bg-white border border-zinc-200 rounded-xl px-3.5 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900 min-h-[46px]';

  if (status === 'sent') {
    return (
      <section className="bg-emerald-50 border border-emerald-200 rounded-3xl p-7 sm:p-10 text-center">
        <span className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4">
          <Check className="w-6 h-6" aria-hidden="true" />
        </span>
        <h2 className="text-xl font-extrabold text-zinc-900 font-['Outfit',sans-serif]">
          {t.addPlace.successTitle}
        </h2>
        <p className="text-sm text-zinc-600 mt-2">{t.addPlace.successText}</p>
      </section>
    );
  }

  return (
    <section className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="max-w-xl">
          <h2 className="flex items-center gap-2.5 text-xl sm:text-2xl font-extrabold text-zinc-900 font-['Outfit',sans-serif]">
            <MapPinPlus className="w-5 h-5 text-rose-500 shrink-0" aria-hidden="true" />
            {t.addPlace.title}
          </h2>
          <p className="text-sm text-zinc-500 mt-1.5">{t.addPlace.subtitle}</p>
        </div>

        {!isOpen && (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="px-5 py-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-bold transition-colors shrink-0 min-h-[48px]"
          >
            {t.addPlace.open}
          </button>
        )}
      </div>

      {isOpen && (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* Formspree's honeypot convention: a hidden field named `_gotcha`
              that only a bot would fill in — a submission with it set is
              silently dropped as spam. */}
          <p className="hidden">
            <label>
              <input name="_gotcha" tabIndex={-1} autoComplete="off" />
            </label>
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="block text-xs font-bold text-zinc-700 mb-1.5">
                {t.addPlace.name} *
              </span>
              <input
                name="place-name"
                required
                placeholder={t.addPlace.namePlaceholder}
                className={field}
              />
            </label>

            <label className="block">
              <span className="block text-xs font-bold text-zinc-700 mb-1.5">
                {t.addPlace.address}
              </span>
              <input
                name="place-address"
                placeholder={t.addPlace.addressPlaceholder}
                className={field}
              />
            </label>
          </div>

          <label className="block">
            <span className="block text-xs font-bold text-zinc-700 mb-1.5">
              {t.addPlace.category}
            </span>
            <select name="place-category" className={field} defaultValue="">
              <option value="">—</option>
              {CATEGORY_META.filter((c) => c.id !== 'events').map((c) => (
                <option key={c.id} value={c.id}>
                  {categoryName(t, c.id)}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="block text-xs font-bold text-zinc-700 mb-1.5">
              {t.addPlace.why} *
            </span>
            <textarea
              name="place-why"
              required
              rows={4}
              maxLength={800}
              placeholder={t.addPlace.whyPlaceholder}
              className={`${field} resize-y`}
            />
          </label>

          <label className="block">
            <span className="block text-xs font-bold text-zinc-700 mb-1.5">
              {t.addPlace.contact}
            </span>
            <input type="email" name="contact-email" className={field} />
            <span className="block text-[11px] text-zinc-400 mt-1.5">
              {t.addPlace.contactHint}
            </span>
          </label>

          {status === 'error' && (
            <p className="text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-3.5 py-3">
              {t.addPlace.errorText}
              <span className="block text-xs text-rose-600/80 mt-1">{t.addPlace.devNotice}</span>
            </p>
          )}

          <button
            type="submit"
            disabled={status === 'sending'}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-300 text-white text-sm font-bold transition-colors min-h-[52px]"
          >
            <Send className="w-4 h-4" aria-hidden="true" />
            {status === 'sending' ? t.addPlace.sending : t.addPlace.submit}
          </button>
        </form>
      )}
    </section>
  );
};
