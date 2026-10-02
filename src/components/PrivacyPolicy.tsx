import React from 'react';
import { Mail, ShieldCheck } from 'lucide-react';
import { useT } from '../i18n';

const CONTACT_EMAIL = 'myyarosfilm@gmail.com';

/** Today's date, formatted per the current page locale (e.g. `2026-10-02`). */
function updatedDate(): string {
  return new Date().toISOString().slice(0, 10);
}

export const PrivacyPolicy: React.FC = () => {
  const t = useT();

  const sections: { title: string; text: string }[] = [
    { title: t.privacy.noDataTitle, text: t.privacy.noDataText },
    { title: t.privacy.localStorageTitle, text: t.privacy.localStorageText },
    { title: t.privacy.formTitle, text: t.privacy.formText },
    { title: t.privacy.hostingTitle, text: t.privacy.hostingText },
  ];

  return (
    <div className="py-10 sm:py-14 max-w-3xl mx-auto space-y-8">
      <header className="space-y-3">
        <span className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-zinc-900 text-white">
          <ShieldCheck className="w-5 h-5" aria-hidden="true" />
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 font-['Outfit',sans-serif]">
          {t.privacy.title}
        </h1>
        <p className="text-sm text-zinc-500">{t.privacy.intro}</p>
        <p className="text-xs text-zinc-400">{t.privacy.updated(updatedDate())}</p>
      </header>

      <div className="space-y-6">
        {sections.map((section) => (
          <section key={section.title} className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-7">
            <h2 className="font-bold text-zinc-900 font-['Outfit',sans-serif] mb-2">{section.title}</h2>
            <p className="text-sm text-zinc-600 leading-relaxed">{section.text}</p>
          </section>
        ))}

        <section className="bg-zinc-900 text-white rounded-3xl p-6 sm:p-7">
          <h2 className="font-bold font-['Outfit',sans-serif] mb-2">{t.privacy.contactTitle}</h2>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-zinc-200 transition-colors"
          >
            <Mail className="w-4 h-4" aria-hidden="true" />
            {t.privacy.contactText} {CONTACT_EMAIL}
          </a>
        </section>
      </div>
    </div>
  );
};
