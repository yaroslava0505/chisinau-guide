import React, { useState } from 'react';
import {
  ArrowLeft,
  Check,
  Download,
  Edit3,
  FileCode2,
  ImageOff,
  Plus,
  RotateCcw,
  Save,
  Trash2,
  X,
} from 'lucide-react';
import type {
  Atmosphere,
  CityEvent,
  District,
  EventTranslation,
  EventType,
  Place,
  PlaceCategoryId,
  PlaceTranslation,
  VenueType,
} from '../types';
import { DISTRICT_IDS } from '../data/chisinauPlaces';
import { CATEGORY_META, VENUE_TYPE_VALUES } from '../data/taxonomy';
import { LOCALES, LOCALE_META, useT, type Locale } from '../i18n';
import {
  activityTypeOptions,
  atmosphereOptions,
  categoryName,
  cuisineOptions,
  districtLabel,
  eventTypeOptions,
  walkTypeOptions,
} from '../i18n/labels';
import { SeoModal } from './SeoModal';
import { downloadCatalogue } from '../utils/exportCatalogue';

interface AdminPanelProps {
  places: Place[];
  events: CityEvent[];
  onAddPlace: (place: Place) => void;
  onUpdatePlace: (place: Place) => void;
  onDeletePlace: (id: string) => void;
  onAddEvent: (event: CityEvent) => void;
  onUpdateEvent: (event: CityEvent) => void;
  onDeleteEvent: (id: string) => void;
  onResetDefaultData: () => void;
  onClose: () => void;
}

const PLACEHOLDER_PHOTO =
  'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1000&auto=format&fit=crop';

const EMPTY_PLACE: Omit<Place, 'id'> = {
  name: '',
  slug: '',
  description: '',
  category: 'cafes',
  subcategory: '',
  district: 'Центр',
  address: '',
  latitude: 47.0245,
  longitude: 28.8322,
  phone: '',
  website: '',
  instagram: '',
  opening_hours: '08:00 – 22:00',
  price_level: 2,
  photos: [PLACEHOLDER_PHOTO],
  wifi_rating: 3,
  quiet_rating: 3,
  outlet_rating: 3,
  comfort_rating: 3,
  work_rating: 3,
  calls_rating: 3,
  kids_friendly: false,
  pet_friendly: false,
  terrace: false,
  parking: false,
  air_conditioning: false,
  free_entry: false,
  low_crowd: false,
  good_for_reading: false,
  long_stay_ok: false,
  solo_friendly: false,
  breakfast: false,
  good_for_date: false,
  big_table: false,
  atmosphere: 'cozy',
  venue_type: 'cafe',
  tags: [],
  is_demo: true,
  is_featured: false,
  is_popular: false,
};

const EMPTY_EVENT: Omit<CityEvent, 'id'> = {
  title: '',
  slug: '',
  date: '',
  date_iso: new Date().toISOString().slice(0, 10),
  time: '19:00',
  location_name: '',
  address: '',
  category: '',
  event_type: 'concert',
  price: '',
  free_entry: false,
  description: '',
  image: PLACEHOLDER_PHOTO,
  tags: [],
  is_demo: true,
};

const inputClass =
  'w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5 text-zinc-900 focus:outline-none focus:border-zinc-900';

const Field: React.FC<{ label: string; children: React.ReactNode; className?: string }> = ({
  label,
  children,
  className = '',
}) => (
  <label className={`block ${className}`}>
    <span className="block font-bold text-zinc-700 mb-1.5 text-xs">{label}</span>
    {children}
  </label>
);

const Toggle: React.FC<{ label: string; checked: boolean; onChange: (value: boolean) => void }> = ({
  label,
  checked,
  onChange,
}) => (
  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-zinc-700">
    <input
      type="checkbox"
      checked={checked}
      onChange={(event) => onChange(event.target.checked)}
      className="w-4 h-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
    />
    {label}
  </label>
);


/** Locales that need translating — everything except the default one. */
const TRANSLATABLE_LOCALES = LOCALES.filter((locale) => locale !== 'uk') as Exclude<Locale, 'uk'>[];

const splitTags = (value: string): string[] =>
  value.split(',').map((tag) => tag.trim()).filter(Boolean);

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9а-яїієґ]+/gi, '-')
    .replace(/^-+|-+$/g, '');

export const AdminPanel: React.FC<AdminPanelProps> = ({
  places,
  events,
  onAddPlace,
  onUpdatePlace,
  onDeletePlace,
  onAddEvent,
  onUpdateEvent,
  onDeleteEvent,
  onResetDefaultData,
  onClose,
}) => {
  const t = useT();
  const [tab, setTab] = useState<'places' | 'events'>('places');
  const [status, setStatus] = useState<string | null>(null);
  const [isSeoOpen, setSeoOpen] = useState(false);

  const [placeForm, setPlaceForm] = useState<Omit<Place, 'id'> | null>(null);
  const [editingPlaceId, setEditingPlaceId] = useState<string | null>(null);
  const [photosInput, setPhotosInput] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  const [eventForm, setEventForm] = useState<Omit<CityEvent, 'id'> | null>(null);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [eventTagsInput, setEventTagsInput] = useState('');

  const flash = (message: string) => {
    setStatus(message);
    setTimeout(() => setStatus(null), 3000);
  };

  const patchPlace = (patch: Partial<Place>) =>
    setPlaceForm((current) => (current ? { ...current, ...patch } : current));

  const patchEvent = (patch: Partial<CityEvent>) =>
    setEventForm((current) => (current ? { ...current, ...patch } : current));

  /* ------------------------------ Place form ------------------------------ */

  const startCreatePlace = () => {
    setEditingPlaceId(null);
    setPlaceForm(EMPTY_PLACE);
    setPhotosInput(EMPTY_PLACE.photos.join('\n'));
    setTagsInput('');
  };

  const startEditPlace = (place: Place) => {
    const { id, ...rest } = place;
    setEditingPlaceId(id);
    setPlaceForm(rest);
    setPhotosInput(place.photos.join('\n'));
    setTagsInput((place.tags ?? []).join(', '));
  };

  const submitPlace = (event: React.FormEvent) => {
    event.preventDefault();
    if (!placeForm) return;

    const photos = photosInput
      .split('\n')
      .map((url) => url.trim())
      .filter(Boolean);

    const tags = tagsInput
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);

    const payload: Place = {
      ...placeForm,
      id: editingPlaceId ?? `place-${Date.now()}`,
      slug: placeForm.slug.trim() || slugify(placeForm.name),
      photos: photos.length > 0 ? photos : [PLACEHOLDER_PHOTO],
      tags,
    };

    if (editingPlaceId) {
      onUpdatePlace(payload);
      flash(t.admin.updated(payload.name));
    } else {
      onAddPlace(payload);
      flash(t.admin.added(payload.name));
    }

    setPlaceForm(null);
    setEditingPlaceId(null);
  };

  /* ------------------------------ Event form ------------------------------ */

  const startCreateEvent = () => {
    setEditingEventId(null);
    setEventForm(EMPTY_EVENT);
    setEventTagsInput('');
  };

  const startEditEvent = (cityEvent: CityEvent) => {
    const { id, ...rest } = cityEvent;
    setEditingEventId(id);
    setEventForm(rest);
    setEventTagsInput(cityEvent.tags.join(', '));
  };

  const submitEvent = (formEvent: React.FormEvent) => {
    formEvent.preventDefault();
    if (!eventForm) return;

    const payload: CityEvent = {
      ...eventForm,
      id: editingEventId ?? `event-${Date.now()}`,
      slug: eventForm.slug.trim() || slugify(eventForm.title),
      date: eventForm.date.trim() || eventForm.date_iso,
      tags: eventTagsInput
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
    };

    if (editingEventId) {
      onUpdateEvent(payload);
      flash(t.admin.updated(payload.title));
    } else {
      onAddEvent(payload);
      flash(t.admin.added(payload.title));
    }

    setEventForm(null);
    setEditingEventId(null);
  };

  const photoPreviews = photosInput.split('\n').map((url) => url.trim()).filter(Boolean);

  return (
    <div className="py-6 sm:py-10 space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200">
        <div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-500 hover:text-zinc-900 mb-2"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            {t.admin.backToGuide}
          </button>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 font-['Outfit',sans-serif]">
            {t.admin.title}
          </h1>
          <p className="text-sm text-zinc-500">{t.admin.subtitle}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={tab === 'places' ? startCreatePlace : startCreateEvent}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 text-white text-sm font-semibold hover:bg-zinc-800 min-h-[44px]"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            {tab === 'places' ? t.admin.addPlace : t.admin.addEvent}
          </button>

          <button
            type="button"
            onClick={() => {
              if (confirm(t.admin.restoreConfirm)) {
                onResetDefaultData();
                flash(t.admin.restored);
              }
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-zinc-200 text-zinc-600 hover:bg-zinc-100 text-sm font-semibold min-h-[44px]"
          >
            <RotateCcw className="w-4 h-4" aria-hidden="true" />
            {t.admin.restoreDemo}
          </button>

          <button
            type="button"
            onClick={() => setSeoOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-zinc-200 text-zinc-600 hover:bg-zinc-100 text-sm font-semibold min-h-[44px]"
          >
            <FileCode2 className="w-4 h-4" aria-hidden="true" />
            {t.admin.seoInspector}
          </button>
        </div>
      </header>

      <section className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
        <h2 className="text-sm font-bold text-zinc-900">{t.admin.exportTitle}</h2>
        <p className="text-xs text-zinc-600 mt-1.5 max-w-2xl leading-relaxed">
          {t.admin.exportText}
        </p>
        <button
          type="button"
          onClick={() => {
            downloadCatalogue(places, events);
            flash(t.admin.exportDone);
          }}
          className="inline-flex items-center gap-2 mt-3 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-semibold min-h-[44px]"
        >
          <Download className="w-4 h-4" aria-hidden="true" />
          {t.admin.exportButton}
        </button>
      </section>

      <div className="flex gap-2">
        {(['places', 'events'] as const).map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            aria-pressed={tab === id}
            className={`px-4 py-2.5 rounded-xl text-sm font-semibold border transition-colors ${
              tab === id ? 'bg-zinc-900 text-white border-zinc-900' : 'bg-white text-zinc-700 border-zinc-200'
            }`}
          >
            {id === 'places' ? t.admin.tabPlaces(places.length) : t.admin.tabEvents(events.length)}
          </button>
        ))}
      </div>

      {status && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" aria-hidden="true" />
          {status}
        </div>
      )}

      {/* ------------------------------ Place form ------------------------------ */}
      {tab === 'places' && placeForm && (
        <div className="bg-white rounded-3xl border border-zinc-200 p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
            <h2 className="text-lg font-bold text-zinc-900">
              {editingPlaceId ? t.admin.editPlace : t.admin.newPlace}
            </h2>
            <button
              type="button"
              onClick={() => setPlaceForm(null)}
              className="p-2 text-zinc-400 hover:text-zinc-700"
              aria-label={t.admin.closeForm}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={submitPlace} className="space-y-5 text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Field label={`${t.admin.fields.name} *`}>
                <input
                  required
                  value={placeForm.name}
                  onChange={(e) => patchPlace({ name: e.target.value })}
                  className={inputClass}
                />
              </Field>

              <Field label={t.admin.fields.slug}>
                <input
                  value={placeForm.slug}
                  onChange={(e) => patchPlace({ slug: e.target.value })}
                  placeholder={slugify(placeForm.name) || 'tucano-coffee'}
                  className={inputClass}
                />
              </Field>

              <Field label={`${t.admin.fields.category} *`}>
                <select
                  value={placeForm.category}
                  onChange={(e) => patchPlace({ category: e.target.value as PlaceCategoryId })}
                  className={inputClass}
                >
                  {CATEGORY_META.filter((c) => c.id !== 'events').map((category) => (
                    <option key={category.id} value={category.id}>
                      {categoryName(t, category.id)}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label={`${t.admin.fields.subcategory} *`}>
                <input
                  required
                  value={placeForm.subcategory}
                  onChange={(e) => patchPlace({ subcategory: e.target.value })}
                  className={inputClass}
                />
              </Field>

              <Field label={`${t.admin.fields.district} *`}>
                <select
                  value={placeForm.district}
                  onChange={(e) => patchPlace({ district: e.target.value as District })}
                  className={inputClass}
                >
                  {DISTRICT_IDS.map((district) => (
                    <option key={district} value={district}>
                      {districtLabel(t, district)}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label={t.admin.fields.priceLevel}>
                <select
                  value={placeForm.price_level}
                  onChange={(e) => patchPlace({ price_level: Number(e.target.value) as 1 | 2 | 3 })}
                  className={inputClass}
                >
                  <option value={1}>{t.options.priceLevel[1]}</option>
                  <option value={2}>{t.options.priceLevel[2]}</option>
                  <option value={3}>{t.options.priceLevel[3]}</option>
                </select>
              </Field>

              <Field label={t.admin.fields.venueType}>
                <select
                  value={placeForm.venue_type ?? ''}
                  onChange={(e) => patchPlace({ venue_type: (e.target.value || undefined) as VenueType })}
                  className={inputClass}
                >
                  <option value="">{t.common.anyOption}</option>
                  {VENUE_TYPE_VALUES.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </Field>

              <Field label={t.admin.fields.atmosphere}>
                <select
                  value={placeForm.atmosphere ?? ''}
                  onChange={(e) => patchPlace({ atmosphere: (e.target.value || undefined) as Atmosphere })}
                  className={inputClass}
                >
                  <option value="">{t.common.anyOption}</option>
                  {atmosphereOptions(t).map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </Field>

              <Field label={t.admin.fields.typeByCategory}>
                <select
                  value={
                    placeForm.category === 'food'
                      ? placeForm.cuisine ?? ''
                      : placeForm.category === 'walks'
                        ? placeForm.walk_type ?? ''
                        : placeForm.category === 'activities'
                          ? placeForm.activity_type ?? ''
                          : ''
                  }
                  onChange={(e) => {
                    const value = e.target.value || undefined;
                    if (placeForm.category === 'food') patchPlace({ cuisine: value });
                    else if (placeForm.category === 'walks') patchPlace({ walk_type: value });
                    else if (placeForm.category === 'activities') patchPlace({ activity_type: value });
                  }}
                  disabled={!['food', 'walks', 'activities'].includes(placeForm.category)}
                  className={`${inputClass} disabled:opacity-50`}
                >
                  <option value="">{t.common.anyOption}</option>
                  {(placeForm.category === 'food'
                    ? cuisineOptions(t)
                    : placeForm.category === 'walks'
                      ? walkTypeOptions(t)
                      : placeForm.category === 'activities'
                        ? activityTypeOptions(t)
                        : []
                  ).map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label={`${t.admin.fields.address} *`}>
                <input
                  required
                  value={placeForm.address}
                  onChange={(e) => patchPlace({ address: e.target.value })}
                  className={inputClass}
                />
              </Field>
              <Field label={t.admin.fields.latitude}>
                <input
                  type="number"
                  step="0.0001"
                  value={placeForm.latitude}
                  onChange={(e) => patchPlace({ latitude: parseFloat(e.target.value) || 47.0245 })}
                  className={inputClass}
                />
              </Field>
              <Field label={t.admin.fields.longitude}>
                <input
                  type="number"
                  step="0.0001"
                  value={placeForm.longitude}
                  onChange={(e) => patchPlace({ longitude: parseFloat(e.target.value) || 28.8322 })}
                  className={inputClass}
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <Field label={t.admin.fields.openingHours}>
                <input
                  value={placeForm.opening_hours}
                  onChange={(e) => patchPlace({ opening_hours: e.target.value })}
                  placeholder="08:00 – 22:00"
                  className={inputClass}
                />
              </Field>
              <Field label={t.admin.fields.phone}>
                <input
                  value={placeForm.phone}
                  onChange={(e) => patchPlace({ phone: e.target.value })}
                  className={inputClass}
                />
              </Field>
              <Field label={t.admin.fields.instagram}>
                <input
                  value={placeForm.instagram}
                  onChange={(e) => patchPlace({ instagram: e.target.value })}
                  placeholder="@cafe_chisinau"
                  className={inputClass}
                />
              </Field>
              <Field label={t.admin.fields.website}>
                <input
                  value={placeForm.website}
                  onChange={(e) => patchPlace({ website: e.target.value })}
                  placeholder="https://"
                  className={inputClass}
                />
              </Field>
            </div>

            <Field label={`${t.admin.fields.description} *`}>
              <textarea
                required
                rows={3}
                value={placeForm.description}
                onChange={(e) => patchPlace({ description: e.target.value })}
                className={inputClass}
              />
            </Field>

            <Field label={t.admin.fields.tags}>
              <input
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="wi-fi, laptop, coffee"
                className={inputClass}
              />
            </Field>

            <div>
              <Field label={t.admin.fields.photos}>
                <textarea
                  rows={3}
                  value={photosInput}
                  onChange={(e) => setPhotosInput(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className={`${inputClass} font-mono text-xs`}
                />
              </Field>

              {photoPreviews.length > 0 && (
                <div className="flex gap-2 mt-2 overflow-x-auto no-scrollbar">
                  {photoPreviews.map((url, index) => (
                    <img
                      key={`${url}-${index}`}
                      src={url}
                      alt=""
                      className="w-20 h-14 rounded-lg object-cover border border-zinc-200 shrink-0 bg-zinc-100"
                    />
                  ))}
                </div>
              )}
            </div>

            <fieldset className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200/70">
              <legend className="font-bold text-zinc-800 text-xs px-1">{t.admin.ratings}</legend>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-2">
                {([
                  ['wifi_rating', t.metrics.wifi],
                  ['outlet_rating', t.metrics.outlets],
                  ['quiet_rating', t.metrics.quiet],
                  ['comfort_rating', t.metrics.comfort],
                  ['work_rating', t.metrics.work],
                  ['calls_rating', t.metrics.calls],
                ] as const).map(([key, label]) => (
                  <Field key={key} label={label}>
                    <input
                      type="number"
                      min={1}
                      max={5}
                      value={placeForm[key]}
                      onChange={(e) => patchPlace({ [key]: Number(e.target.value) } as Partial<Place>)}
                      className="w-full bg-white border border-zinc-200 rounded-lg p-2 text-center font-bold"
                    />
                  </Field>
                ))}
              </div>
            </fieldset>

            <fieldset className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200/70">
              <legend className="font-bold text-zinc-800 text-xs px-1">{t.admin.features}</legend>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mt-2">
                <Toggle label={t.admin.features_labels.pet} checked={placeForm.pet_friendly} onChange={(v) => patchPlace({ pet_friendly: v })} />
                <Toggle label={t.admin.features_labels.terrace} checked={placeForm.terrace} onChange={(v) => patchPlace({ terrace: v })} />
                <Toggle label={t.admin.features_labels.parking} checked={placeForm.parking} onChange={(v) => patchPlace({ parking: v })} />
                <Toggle label={t.admin.features_labels.airConditioning} checked={placeForm.air_conditioning} onChange={(v) => patchPlace({ air_conditioning: v })} />
                <Toggle label={t.admin.features_labels.breakfast} checked={placeForm.breakfast} onChange={(v) => patchPlace({ breakfast: v })} />
                <Toggle label={t.admin.features_labels.kids} checked={placeForm.kids_friendly} onChange={(v) => patchPlace({ kids_friendly: v })} />
                <Toggle label={t.admin.features_labels.freeEntry} checked={placeForm.free_entry} onChange={(v) => patchPlace({ free_entry: v })} />
                <Toggle label={t.admin.features_labels.lowCrowd} checked={placeForm.low_crowd} onChange={(v) => patchPlace({ low_crowd: v })} />
                <Toggle label={t.admin.features_labels.reading} checked={placeForm.good_for_reading} onChange={(v) => patchPlace({ good_for_reading: v })} />
                <Toggle label={t.admin.features_labels.longStay} checked={placeForm.long_stay_ok} onChange={(v) => patchPlace({ long_stay_ok: v })} />
                <Toggle label={t.admin.features_labels.solo} checked={placeForm.solo_friendly} onChange={(v) => patchPlace({ solo_friendly: v })} />
                <Toggle label={t.admin.features_labels.bigTable} checked={placeForm.big_table ?? false} onChange={(v) => patchPlace({ big_table: v })} />
                <Toggle label={t.admin.features_labels.forDate} checked={placeForm.good_for_date ?? false} onChange={(v) => patchPlace({ good_for_date: v })} />
              </div>
            </fieldset>

            <fieldset className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200/70 space-y-4">
              <legend className="font-bold text-zinc-800 text-xs px-1">{t.admin.translations}</legend>
              <p className="text-[11px] text-zinc-500">{t.admin.translationsHint}</p>

              {TRANSLATABLE_LOCALES.map((code) => {
                const translation: PlaceTranslation = placeForm.i18n?.[code] ?? {};
                const patchTranslation = (patch: PlaceTranslation) =>
                  patchPlace({
                    i18n: {
                      ...placeForm.i18n,
                      [code]: { ...translation, ...patch },
                    },
                  });

                return (
                  <div key={code} className="space-y-3 pt-3 border-t border-zinc-200 first:border-0 first:pt-0">
                    <p className="text-xs font-bold text-zinc-700">{LOCALE_META[code].name}</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Field label={t.admin.fields.name}>
                        <input
                          lang={LOCALE_META[code].htmlLang}
                          value={translation.name ?? ''}
                          onChange={(e) => patchTranslation({ name: e.target.value })}
                          className={inputClass}
                        />
                      </Field>
                      <Field label={t.admin.fields.subcategory}>
                        <input
                          lang={LOCALE_META[code].htmlLang}
                          value={translation.subcategory ?? ''}
                          onChange={(e) => patchTranslation({ subcategory: e.target.value })}
                          className={inputClass}
                        />
                      </Field>
                    </div>

                    <Field label={t.admin.fields.description}>
                      <textarea
                        rows={3}
                        lang={LOCALE_META[code].htmlLang}
                        value={translation.description ?? ''}
                        onChange={(e) => patchTranslation({ description: e.target.value })}
                        className={inputClass}
                      />
                    </Field>

                    <Field label={t.admin.fields.tags}>
                      <input
                        lang={LOCALE_META[code].htmlLang}
                        value={(translation.tags ?? []).join(', ')}
                        onChange={(e) => patchTranslation({ tags: splitTags(e.target.value) })}
                        className={inputClass}
                      />
                    </Field>
                  </div>
                );
              })}
            </fieldset>

            <fieldset className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200/70">
              <legend className="font-bold text-zinc-800 text-xs px-1">{t.admin.publishing}</legend>
              <div className="flex flex-wrap gap-5 mt-2">
                <Toggle label={t.admin.featured} checked={placeForm.is_featured ?? false} onChange={(v) => patchPlace({ is_featured: v })} />
                <Toggle label={t.admin.popular} checked={placeForm.is_popular ?? false} onChange={(v) => patchPlace({ is_popular: v })} />
                <Toggle label={t.admin.isDemo} checked={placeForm.is_demo} onChange={(v) => patchPlace({ is_demo: v })} />
              </div>
              <p className="text-[11px] text-zinc-500 mt-3">
                {t.admin.demoWarning}
              </p>
            </fieldset>

            <div className="pt-4 border-t border-zinc-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setPlaceForm(null)}
                className="px-4 py-2.5 rounded-xl border border-zinc-200 text-zinc-700 hover:bg-zinc-50 font-semibold min-h-[44px]"
              >
                {t.common.cancel}
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 text-white font-semibold hover:bg-zinc-800 min-h-[44px]"
              >
                <Save className="w-4 h-4" aria-hidden="true" />
                {editingPlaceId ? t.admin.updatePlace : t.admin.savePlace}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ------------------------------ Event form ------------------------------ */}
      {tab === 'events' && eventForm && (
        <div className="bg-white rounded-3xl border border-zinc-200 p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
            <h2 className="text-lg font-bold text-zinc-900">
              {editingEventId ? t.admin.editEvent : t.admin.newEvent}
            </h2>
            <button
              type="button"
              onClick={() => setEventForm(null)}
              className="p-2 text-zinc-400 hover:text-zinc-700"
              aria-label={t.admin.closeForm}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={submitEvent} className="space-y-5 text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Field label={`${t.admin.fields.eventTitle} *`}>
                <input
                  required
                  value={eventForm.title}
                  onChange={(e) => patchEvent({ title: e.target.value })}
                  className={inputClass}
                />
              </Field>

              <Field label={t.admin.fields.slug}>
                <input
                  value={eventForm.slug}
                  onChange={(e) => patchEvent({ slug: e.target.value })}
                  placeholder={slugify(eventForm.title)}
                  className={inputClass}
                />
              </Field>

              <Field label={`${t.admin.fields.eventType} *`}>
                <select
                  value={eventForm.event_type}
                  onChange={(e) => patchEvent({ event_type: e.target.value as EventType })}
                  className={inputClass}
                >
                  {eventTypeOptions(t).map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </Field>

              <Field label={`${t.admin.fields.startDate} *`}>
                <input
                  type="date"
                  required
                  value={eventForm.date_iso}
                  onChange={(e) => patchEvent({ date_iso: e.target.value })}
                  className={inputClass}
                />
              </Field>

              <Field label={t.admin.fields.endDate}>
                <input
                  type="date"
                  value={eventForm.end_date_iso ?? ''}
                  onChange={(e) => patchEvent({ end_date_iso: e.target.value || undefined })}
                  className={inputClass}
                />
              </Field>

              <Field label={t.admin.fields.time}>
                <input
                  value={eventForm.time}
                  onChange={(e) => patchEvent({ time: e.target.value })}
                  placeholder="19:00 – 22:00"
                  className={inputClass}
                />
              </Field>

              <Field label={`${t.admin.fields.locationName} *`}>
                <input
                  required
                  value={eventForm.location_name}
                  onChange={(e) => patchEvent({ location_name: e.target.value })}
                  className={inputClass}
                />
              </Field>

              <Field label={`${t.admin.fields.address} *`}>
                <input
                  required
                  value={eventForm.address}
                  onChange={(e) => patchEvent({ address: e.target.value })}
                  className={inputClass}
                />
              </Field>

              <Field label={t.admin.fields.price}>
                <input
                  value={eventForm.price}
                  onChange={(e) => patchEvent({ price: e.target.value })}
                  placeholder="250 MDL / Вхід вільний"
                  className={inputClass}
                />
              </Field>

              <Field label={t.admin.fields.eventCategory}>
                <input
                  value={eventForm.category}
                  onChange={(e) => patchEvent({ category: e.target.value })}
                  placeholder="Music &amp; Wine"
                  className={inputClass}
                />
              </Field>

              <Field label={t.admin.fields.dateLabel}>
                <input
                  value={eventForm.date}
                  onChange={(e) => patchEvent({ date: e.target.value })}
                  placeholder="12 вересня 2026"
                  className={inputClass}
                />
              </Field>

              <Field label={t.admin.fields.image}>
                <input
                  value={eventForm.image}
                  onChange={(e) => patchEvent({ image: e.target.value })}
                  className={`${inputClass} font-mono text-xs`}
                />
              </Field>
            </div>

            <Field label={`${t.admin.fields.description} *`}>
              <textarea
                required
                rows={3}
                value={eventForm.description}
                onChange={(e) => patchEvent({ description: e.target.value })}
                className={inputClass}
              />
            </Field>

            <Field label={t.admin.fields.tags}>
              <input
                value={eventTagsInput}
                onChange={(e) => setEventTagsInput(e.target.value)}
                placeholder="Jazz, Wine, Open Air"
                className={inputClass}
              />
            </Field>

            <fieldset className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200/70 space-y-4">
              <legend className="font-bold text-zinc-800 text-xs px-1">{t.admin.translations}</legend>
              <p className="text-[11px] text-zinc-500">{t.admin.translationsHint}</p>

              {TRANSLATABLE_LOCALES.map((code) => {
                const translation: EventTranslation = eventForm.i18n?.[code] ?? {};
                const patchTranslation = (patch: EventTranslation) =>
                  patchEvent({
                    i18n: {
                      ...eventForm.i18n,
                      [code]: { ...translation, ...patch },
                    },
                  });

                return (
                  <div key={code} className="space-y-3 pt-3 border-t border-zinc-200 first:border-0 first:pt-0">
                    <p className="text-xs font-bold text-zinc-700">{LOCALE_META[code].name}</p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <Field label={t.admin.fields.eventTitle}>
                        <input
                          lang={LOCALE_META[code].htmlLang}
                          value={translation.title ?? ''}
                          onChange={(e) => patchTranslation({ title: e.target.value })}
                          className={inputClass}
                        />
                      </Field>
                      <Field label={t.admin.fields.eventCategory}>
                        <input
                          lang={LOCALE_META[code].htmlLang}
                          value={translation.category ?? ''}
                          onChange={(e) => patchTranslation({ category: e.target.value })}
                          className={inputClass}
                        />
                      </Field>
                      <Field label={t.admin.fields.price}>
                        <input
                          lang={LOCALE_META[code].htmlLang}
                          value={translation.price ?? ''}
                          onChange={(e) => patchTranslation({ price: e.target.value })}
                          className={inputClass}
                        />
                      </Field>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Field label={t.admin.fields.dateLabel}>
                        <input
                          lang={LOCALE_META[code].htmlLang}
                          value={translation.date ?? ''}
                          onChange={(e) => patchTranslation({ date: e.target.value })}
                          className={inputClass}
                        />
                      </Field>
                      <Field label={t.admin.fields.tags}>
                        <input
                          lang={LOCALE_META[code].htmlLang}
                          value={(translation.tags ?? []).join(', ')}
                          onChange={(e) => patchTranslation({ tags: splitTags(e.target.value) })}
                          className={inputClass}
                        />
                      </Field>
                    </div>

                    <Field label={t.admin.fields.description}>
                      <textarea
                        rows={3}
                        lang={LOCALE_META[code].htmlLang}
                        value={translation.description ?? ''}
                        onChange={(e) => patchTranslation({ description: e.target.value })}
                        className={inputClass}
                      />
                    </Field>
                  </div>
                );
              })}
            </fieldset>

            <div className="flex flex-wrap gap-5 p-4 bg-amber-50/60 rounded-2xl border border-amber-200/70">
              <Toggle
                label={t.admin.recurringWeekly}
                checked={eventForm.recurring_weekly ?? false}
                onChange={(v) => patchEvent({ recurring_weekly: v })}
              />
              <Toggle
                label={t.admin.freeEntry}
                checked={eventForm.free_entry ?? false}
                onChange={(v) => patchEvent({ free_entry: v })}
              />
              <Toggle
                label={t.admin.isDemo}
                checked={eventForm.is_demo}
                onChange={(v) => patchEvent({ is_demo: v })}
              />
            </div>

            <div className="pt-4 border-t border-zinc-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setEventForm(null)}
                className="px-4 py-2.5 rounded-xl border border-zinc-200 text-zinc-700 hover:bg-zinc-50 font-semibold min-h-[44px]"
              >
                {t.common.cancel}
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 text-white font-semibold hover:bg-zinc-800 min-h-[44px]"
              >
                <Save className="w-4 h-4" aria-hidden="true" />
                {editingEventId ? t.admin.updateEvent : t.admin.saveEvent}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* --------------------------------- Lists -------------------------------- */}
      {tab === 'places' ? (
        <div className="bg-white rounded-3xl border border-zinc-200 overflow-hidden">
          <div className="p-5 border-b border-zinc-100">
            <h2 className="font-bold text-zinc-900">{t.admin.allPlaces(places.length)}</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-50 text-zinc-500 border-b border-zinc-100 uppercase text-[11px] font-bold">
                <tr>
                  <th className="px-4 py-3">{t.admin.columns.venue}</th>
                  <th className="px-4 py-3">{t.admin.columns.category}</th>
                  <th className="px-4 py-3">{t.admin.columns.district}</th>
                  <th className="px-4 py-3">{t.admin.columns.flags}</th>
                  <th className="px-4 py-3 text-right">{t.admin.columns.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {places.map((place) => (
                  <tr key={place.id} className="hover:bg-zinc-50/80">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        {/* The admin table shows the raw record: an empty box
                            here means the place still has no real photo. */}
                        {place.photos[0] ? (
                          <img src={place.photos[0]} alt="" className="w-10 h-10 rounded-lg object-cover bg-zinc-100 shrink-0" />
                        ) : (
                          <span className="w-10 h-10 rounded-lg bg-zinc-100 text-zinc-300 flex items-center justify-center shrink-0">
                            <ImageOff className="w-4 h-4" aria-hidden="true" />
                          </span>
                        )}
                        <div className="min-w-0">
                          <span className="font-bold text-zinc-900 block truncate">{place.name}</span>
                          <span className="text-xs text-zinc-400 block truncate">/{place.slug}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-zinc-100 text-zinc-700">
                        {place.subcategory}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap text-zinc-700">
                      {districtLabel(t, place.district)}
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {place.is_featured && <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[11px] font-bold">Featured</span>}
                        {place.is_popular && <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 text-[11px] font-bold">Popular</span>}
                        {place.is_demo && <span className="px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-600 text-[11px] font-bold">Demo</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => startEditPlace(place)}
                          className="p-2 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg"
                          aria-label={t.admin.edit(place.name)}
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(t.admin.deleteConfirm(place.name))) {
                              onDeletePlace(place.id);
                              flash(t.admin.deleted(place.name));
                            }
                          }}
                          className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg"
                          aria-label={t.admin.delete(place.name)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-zinc-200 overflow-hidden">
          <div className="p-5 border-b border-zinc-100">
            <h2 className="font-bold text-zinc-900">{t.admin.allEvents(events.length)}</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-50 text-zinc-500 border-b border-zinc-100 uppercase text-[11px] font-bold">
                <tr>
                  <th className="px-4 py-3">{t.admin.columns.event}</th>
                  <th className="px-4 py-3">{t.admin.columns.date}</th>
                  <th className="px-4 py-3">{t.admin.columns.place}</th>
                  <th className="px-4 py-3">{t.admin.columns.price}</th>
                  <th className="px-4 py-3 text-right">{t.admin.columns.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {events.map((cityEvent) => (
                  <tr key={cityEvent.id} className="hover:bg-zinc-50/80">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <img src={cityEvent.image} alt="" className="w-10 h-10 rounded-lg object-cover bg-zinc-100 shrink-0" />
                        <div className="min-w-0">
                          <span className="font-bold text-zinc-900 block truncate">{cityEvent.title}</span>
                          <span className="text-xs text-zinc-400 block truncate">{cityEvent.category}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap text-zinc-700">
                      {cityEvent.date_iso}
                      {cityEvent.recurring_weekly && (
                        <span className="ml-2 px-2 py-0.5 rounded-md bg-purple-100 text-purple-700 text-[11px] font-bold">
                          {t.admin.weekly}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-zinc-700">{cityEvent.location_name}</td>
                    <td className="px-4 py-3.5 whitespace-nowrap text-zinc-700">{cityEvent.price}</td>
                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => startEditEvent(cityEvent)}
                          className="p-2 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg"
                          aria-label={t.admin.edit(cityEvent.title)}
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(t.admin.deleteConfirm(cityEvent.title))) {
                              onDeleteEvent(cityEvent.id);
                              flash(t.admin.deleted(cityEvent.title));
                            }
                          }}
                          className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg"
                          aria-label={t.admin.delete(cityEvent.title)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {isSeoOpen && <SeoModal places={places} onClose={() => setSeoOpen(false)} />}
    </div>
  );
};
