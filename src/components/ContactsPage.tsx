import React from 'react';
import { Mail } from 'lucide-react';
import { useT } from '../i18n';
import { AddPlaceForm } from './AddPlaceForm';

const CONTACT_EMAIL = 'myyarosfilm@gmail.com';

export const ContactsPage: React.FC = () => {
  const t = useT();

  return (
    <div className="py-10 sm:py-14 max-w-3xl mx-auto space-y-8">
      <header className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 font-['Outfit',sans-serif]">
          {t.contacts.title}
        </h1>
        <p className="text-sm text-zinc-500">{t.contacts.intro}</p>
      </header>

      <section className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-7">
        <h2 className="text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">
          {t.contacts.emailLabel}
        </h2>
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="inline-flex items-center gap-2 text-lg font-bold text-zinc-900 hover:text-zinc-600 transition-colors font-['Outfit',sans-serif]"
        >
          <Mail className="w-5 h-5 text-zinc-400" aria-hidden="true" />
          {CONTACT_EMAIL}
        </a>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-extrabold text-zinc-900 font-['Outfit',sans-serif]">
          {t.contacts.formTitle}
        </h2>
        <p className="text-sm text-zinc-500">{t.contacts.formSubtitle}</p>
      </section>

      <AddPlaceForm />
    </div>
  );
};
