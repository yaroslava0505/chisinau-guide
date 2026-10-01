import React, { useState } from 'react';
import {
  Accessibility,
  Clock,
  Coffee,
  Compass,
  DollarSign,
  Footprints,
  MapPin,
  RotateCcw,
  SlidersHorizontal,
  Ticket,
  Trees,
  Utensils,
  Wifi,
  Wind,
} from 'lucide-react';
import type { CategoryId, District, FilterState } from '../types';
import { DISTRICT_IDS } from '../data/chisinauPlaces';
import { countActiveFilters } from '../utils/filters';
import { useT } from '../i18n';
import type { Dictionary } from '../i18n/dictionaries/uk';
import {
  activityTypeOptions,
  categoryName,
  cuisineOptions,
  districtLabel,
  priceLevelOptions,
  quietTypeOptions,
  walkTypeOptions,
} from '../i18n/labels';
import { SelectField, ToggleChip } from './ui/Chip';
import { Sheet } from './ui/Sheet';

interface CategoryFiltersProps {
  activeCategory: CategoryId;
  filters: FilterState;
  onUpdateFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  onResetFilters: () => void;
  totalFilteredCount: number;
}

type ControlsProps = Omit<CategoryFiltersProps, 'totalFilteredCount' | 'onResetFilters'> & {
  t: Dictionary;
};

/**
 * Only filters a confirmed field can answer.
 *
 * Everything that used to sit here and filter by an invented 1-5 rating
 * (Wi-Fi 4+, outlets, quiet, comfort, calls) is gone: the catalogue no longer
 * stores those numbers, so offering the control would return nothing and imply
 * knowledge the guide does not have.
 */
const FilterControls: React.FC<ControlsProps> = ({ activeCategory, filters, onUpdateFilter, t }) => {
  const f = t.filters;
  const chip = f.chips;

  const district = (
    <SelectField
      label={f.district}
      icon={MapPin}
      anyLabel={f.anyDistrict}
      value={filters.district}
      options={DISTRICT_IDS.map((id) => ({ value: id, label: districtLabel(t, id) }))}
      onChange={(value) => onUpdateFilter('district', value as District | 'all')}
    />
  );

  const price = (
    <SelectField
      label={f.price}
      icon={DollarSign}
      anyLabel={f.anyPrice}
      value={filters.priceLevel}
      options={priceLevelOptions(t)}
      onChange={(value) => onUpdateFilter('priceLevel', value === 'all' ? 'all' : Number(value))}
    />
  );

  const amenityChips = (
    <div className="flex flex-wrap gap-2 pt-1">
      <ToggleChip
        active={filters.openNowOnly}
        onClick={() => onUpdateFilter('openNowOnly', !filters.openNowOnly)}
        icon={Clock}
        tone="positive"
      >
        {chip.openNow}
      </ToggleChip>
      <ToggleChip
        active={filters.hasWifi}
        onClick={() => onUpdateFilter('hasWifi', !filters.hasWifi)}
        icon={Wifi}
      >
        {chip.wifi}
      </ToggleChip>
      <ToggleChip
        active={filters.hasTerrace}
        onClick={() => onUpdateFilter('hasTerrace', !filters.hasTerrace)}
        icon={Trees}
      >
        {chip.terrace}
      </ToggleChip>
      <ToggleChip
        active={filters.hasAirConditioning}
        onClick={() => onUpdateFilter('hasAirConditioning', !filters.hasAirConditioning)}
        icon={Wind}
      >
        {chip.airConditioning}
      </ToggleChip>
      <ToggleChip
        active={filters.wheelchair}
        onClick={() => onUpdateFilter('wheelchair', !filters.wheelchair)}
        icon={Accessibility}
      >
        {chip.wheelchair}
      </ToggleChip>
      <ToggleChip
        active={filters.freeOnly}
        onClick={() => onUpdateFilter('freeOnly', !filters.freeOnly)}
        icon={Ticket}
      >
        {chip.free}
      </ToggleChip>
    </div>
  );

  const categorySelect = (() => {
    switch (activeCategory) {
      case 'remote_work':
        return (
          <SelectField
            label={f.workVenue}
            icon={Wifi}
            anyLabel={f.anyWorkVenue}
            value={filters.workVenue}
            options={[
              { value: 'coworking', label: f.coworking },
              { value: 'cafe', label: f.cafe },
            ]}
            onChange={(value) => onUpdateFilter('workVenue', value as FilterState['workVenue'])}
          />
        );
      case 'quiet_places':
        return (
          <SelectField
            label={f.quietType}
            icon={Trees}
            anyLabel={f.anyQuietType}
            value={filters.quietType}
            options={quietTypeOptions(t)}
            onChange={(value) => onUpdateFilter('quietType', value as FilterState['quietType'])}
          />
        );
      case 'cafes':
        return (
          <SelectField
            label={f.cafeType}
            icon={Coffee}
            anyLabel={f.anyCafeType}
            value={filters.cafeType}
            options={[
              { value: 'specialty', label: t.options.cafeType.specialty },
              { value: 'bakery', label: t.options.cafeType.bakery },
              { value: 'bistro', label: t.options.cafeType.bistro },
            ]}
            onChange={(value) => onUpdateFilter('cafeType', value as FilterState['cafeType'])}
          />
        );
      case 'food':
        return (
          <SelectField
            label={f.cuisine}
            icon={Utensils}
            anyLabel={f.anyCuisine}
            value={filters.cuisine}
            options={cuisineOptions(t)}
            onChange={(value) => onUpdateFilter('cuisine', value)}
          />
        );
      case 'walks':
        return (
          <SelectField
            label={f.walkType}
            icon={Footprints}
            anyLabel={f.anyWalkType}
            value={filters.walkType}
            options={walkTypeOptions(t)}
            onChange={(value) => onUpdateFilter('walkType', value)}
          />
        );
      case 'activities':
        return (
          <SelectField
            label={f.activityType}
            icon={Compass}
            anyLabel={f.anyActivityType}
            value={filters.activityType}
            options={activityTypeOptions(t)}
            onChange={(value) => onUpdateFilter('activityType', value)}
          />
        );
      default:
        return null;
    }
  })();

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {district}
        {categorySelect}
        {price}
      </div>
      {amenityChips}
    </div>
  );
};

export const CategoryFilters: React.FC<CategoryFiltersProps> = (props) => {
  const { activeCategory, filters, onUpdateFilter, onResetFilters, totalFilteredCount } = props;
  const t = useT();
  const [isSheetOpen, setSheetOpen] = useState(false);

  const activeCount = countActiveFilters(filters);
  const label = activeCategory === 'all' ? t.filters.allCategories : categoryName(t, activeCategory);
  const resultsLabel = t.common.places(totalFilteredCount);
  const title = `${t.filters.title} · ${label}`;
  const controls = { activeCategory, filters, onUpdateFilter, t };

  return (
    <>
      {/* Mobile: one trigger, filters live in a bottom sheet */}
      <div className="lg:hidden flex items-center gap-3">
        <button
          type="button"
          onClick={() => setSheetOpen(true)}
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-white border border-zinc-200 text-sm font-semibold text-zinc-900 shadow-sm min-h-[48px]"
        >
          <SlidersHorizontal className="w-4 h-4" aria-hidden="true" />
          {t.filters.title}
          {activeCount > 0 && (
            <span className="ml-1 px-2 py-0.5 rounded-full bg-zinc-900 text-white text-[11px] font-bold">
              {activeCount}
            </span>
          )}
        </button>
        <span className="text-sm text-zinc-500 font-medium shrink-0">{resultsLabel}</span>
      </div>

      {/* Desktop: inline panel */}
      <div className="hidden lg:block bg-white rounded-3xl border border-zinc-200 p-6">
        <div className="flex items-center justify-between gap-4 pb-4 mb-5 border-b border-zinc-100">
          <div>
            <h2 className="text-sm font-bold text-zinc-900">{title}</h2>
            <p className="text-xs text-zinc-500 mt-0.5">{t.filters.found(resultsLabel)}</p>
          </div>

          {activeCount > 0 && (
            <button
              type="button"
              onClick={onResetFilters}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900 py-1.5 px-2.5 rounded-lg hover:bg-zinc-100 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              {t.filters.resetWithCount(activeCount)}
            </button>
          )}
        </div>

        <FilterControls {...controls} />
      </div>

      {isSheetOpen && (
        <Sheet
          title={title}
          onClose={() => setSheetOpen(false)}
          footer={
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onResetFilters}
                className="px-4 py-3 rounded-2xl border border-zinc-200 text-sm font-semibold text-zinc-700 min-h-[48px]"
              >
                {t.common.reset}
              </button>
              <button
                type="button"
                onClick={() => setSheetOpen(false)}
                className="flex-1 px-4 py-3 rounded-2xl bg-zinc-900 text-white text-sm font-bold min-h-[48px]"
              >
                {t.filters.showResults(resultsLabel)}
              </button>
            </div>
          }
        >
          <FilterControls {...controls} />
        </Sheet>
      )}
    </>
  );
};
