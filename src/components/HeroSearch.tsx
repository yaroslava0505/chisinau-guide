import React from 'react';
import { SCENARIOS } from '../data/taxonomy';
import type { ScenarioId } from '../types';
import { useT } from '../i18n';

interface HeroSearchProps {
  onScenarioSelect: (id: ScenarioId) => void;
  activeScenario: ScenarioId | null;
}

export const HeroSearch: React.FC<HeroSearchProps> = ({ onScenarioSelect, activeScenario }) => {
  const t = useT();

  return (
  <section className="relative overflow-hidden bg-white border-b border-zinc-200/70">
    <div className="absolute -top-32 right-0 w-[32rem] h-[32rem] rounded-full bg-amber-100/40 blur-3xl pointer-events-none" />
    <div className="absolute -bottom-40 -left-24 w-[28rem] h-[28rem] rounded-full bg-rose-100/30 blur-3xl pointer-events-none" />

    <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-10 sm:pt-20 sm:pb-14 text-center">
      <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-zinc-900 font-['Outfit',sans-serif] leading-[1.05]">
        {t.hero.h1}
      </h1>

      <p className="mt-4 sm:mt-5 text-base sm:text-xl text-zinc-600 max-w-2xl mx-auto leading-relaxed">
        {t.hero.subtitle}
      </p>

      <div className="mt-8 sm:mt-10">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 sm:flex-wrap sm:justify-center sm:overflow-visible -mx-4 px-4 sm:mx-0 sm:px-0">
          {SCENARIOS.map((scenario) => {
            const isActive = activeScenario === scenario.id;
            return (
              <button
                key={scenario.id}
                type="button"
                onClick={() => onScenarioSelect(scenario.id)}
                title={t.scenarios[scenario.id].hint}
                aria-pressed={isActive}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap border transition-all min-h-[44px] ${
                  isActive
                    ? 'bg-zinc-900 text-white border-zinc-900 shadow-sm'
                    : 'bg-white text-zinc-800 border-zinc-200 hover:border-zinc-400'
                }`}
              >
                <span aria-hidden="true">{scenario.emoji}</span>
                {t.scenarios[scenario.id].label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  </section>
  );
};
