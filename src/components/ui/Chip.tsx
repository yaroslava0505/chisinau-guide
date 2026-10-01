import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface ToggleChipProps {
  active: boolean;
  onClick: () => void;
  icon?: LucideIcon;
  children: React.ReactNode;
  /** Renders a green active state, used for the "open now" filter. */
  tone?: 'default' | 'positive';
}

/** Pill-shaped toggle used across every filter group. */
export const ToggleChip: React.FC<ToggleChipProps> = ({
  active,
  onClick,
  icon: Icon,
  children,
  tone = 'default',
}) => {
  const activeClasses =
    tone === 'positive'
      ? 'bg-emerald-600 text-white border-emerald-600'
      : 'bg-zinc-900 text-white border-zinc-900';

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold border transition-all min-h-[38px] ${
        active ? activeClasses : 'bg-white text-zinc-700 border-zinc-200 hover:border-zinc-400'
      }`}
    >
      {Icon && <Icon className="w-3.5 h-3.5" />}
      {children}
    </button>
  );
};

interface SelectFieldProps {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  options: { value: string | number; label: string }[];
  icon?: LucideIcon;
  /** Label for the "no filter" option. */
  anyLabel: string;
}

export const SelectField: React.FC<SelectFieldProps> = ({
  label,
  value,
  onChange,
  options,
  icon: Icon,
  anyLabel,
}) => (
  <label className="block">
    <span className="flex items-center gap-1.5 text-xs font-bold text-zinc-600 mb-1.5">
      {Icon && <Icon className="w-3.5 h-3.5" />}
      {label}
    </span>
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="w-full text-sm font-medium bg-white border border-zinc-200 rounded-xl px-3 py-2.5 text-zinc-800 focus:outline-none focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
    >
      <option value="all">{anyLabel}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </label>
);
