import React from 'react';
import { Check, Mail } from 'lucide-react';
import { useT } from '../i18n';

const CONTACT_EMAIL = 'myyarosfilm@gmail.com';

const Checklist: React.FC<{ items: string[] }> = ({ items }) => (
  <ul className="space-y-2.5">
    {items.map((item) => (
      <li key={item} className="flex items-start gap-2.5 text-sm text-zinc-700 leading-relaxed">
        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-1" aria-hidden="true" />
        <span>{item}</span>
      </li>
    ))}
  </ul>
);

export const BusinessPage: React.FC = () => {
  const t = useT();
  const b = t.business;

  return (
    <div className="py-10 sm:py-14 max-w-3xl mx-auto space-y-10">
      <header className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 font-['Outfit',sans-serif]">
          {b.title}
        </h1>
        <p className="text-base text-zinc-600 leading-relaxed">{b.intro}</p>
      </header>

      <div className="grid sm:grid-cols-2 gap-5">
        <section className="bg-white border border-zinc-200 rounded-3xl p-6 space-y-4">
          <h2 className="text-lg font-extrabold text-zinc-900 font-['Outfit',sans-serif]">{b.forVenuesTitle}</h2>
          <Checklist items={b.forVenuesItems} />
        </section>
        <section className="bg-white border border-zinc-200 rounded-3xl p-6 space-y-4">
          <h2 className="text-lg font-extrabold text-zinc-900 font-['Outfit',sans-serif]">{b.forOrganizersTitle}</h2>
          <Checklist items={b.forOrganizersItems} />
        </section>
      </div>

      <section className="space-y-4">
        <h2 className="text-xl font-extrabold text-zinc-900 font-['Outfit',sans-serif]">{b.formatsTitle}</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {b.formats.map((format) => (
            <div key={format.name} className="bg-white border border-zinc-200 rounded-3xl p-5 space-y-2">
              <h3 className="font-bold text-zinc-900">{format.name}</h3>
              <p className="text-sm text-zinc-600 leading-relaxed">{format.text}</p>
            </div>
          ))}
        </div>
        <p className="text-sm text-zinc-500 leading-relaxed">{b.formatsNote}</p>
      </section>

      <section className="border-l-4 border-zinc-900 pl-5 space-y-2">
        <h2 className="text-base font-extrabold text-zinc-900 font-['Outfit',sans-serif]">{b.honestTitle}</h2>
        <p className="text-sm text-zinc-700 leading-relaxed">{b.honestText}</p>
      </section>

      <section className="bg-zinc-900 text-white rounded-3xl p-6 sm:p-8 space-y-4">
        <h2 className="text-xl font-extrabold font-['Outfit',sans-serif]">{b.ctaTitle}</h2>
        <p className="text-sm text-zinc-300 leading-relaxed">{b.ctaText}</p>
        <div className="flex flex-wrap items-center gap-4">
          <a
            href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(b.title)}`}
            className="inline-flex items-center gap-2 bg-white text-zinc-900 font-bold px-5 py-3 rounded-2xl hover:bg-zinc-100 transition-colors"
          >
            <Mail className="w-4 h-4" aria-hidden="true" />
            {b.ctaButton}
          </a>
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-sm font-semibold text-zinc-300 hover:text-white transition-colors">
            {CONTACT_EMAIL}
          </a>
        </div>
      </section>
    </div>
  );
};
