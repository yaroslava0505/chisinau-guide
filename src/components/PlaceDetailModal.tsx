import React, { useEffect, useRef, useState } from 'react';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  DollarSign,
  ExternalLink,
  Globe,
  Heart,
  Instagram,
  MapPin,
  Navigation,
  Phone,
  Route as RouteIcon,
  Share2,
  Sparkles,
} from 'lucide-react';
import L from 'leaflet';
// This modal renders its own mini-map eagerly (not behind the /map route's
// lazy chunk), so it needs Leaflet's stylesheet bundled locally here too —
// see the matching import in InteractiveMap.tsx.
import 'leaflet/dist/leaflet.css';
import type { Place } from '../types';
import { getConfirmedAmenities, getRatingItems, getWhyHere } from '../utils/placeMetrics';
import { formatOpeningHours, getOpenState } from '../utils/openingHours';
import { PlaceComments } from './PlaceComments';
import { PlacePhoto } from './ui/PlacePhoto';
import { Sheet } from './ui/Sheet';
import { absoluteUrl, buildPath } from '../router';
import { useLocale } from '../i18n';
import {
  atmosphereLabel,
  categoryName,
  difficultyLabel,
  districtLabel,
} from '../i18n/labels';

interface PlaceDetailModalProps {
  place: Place;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

const ratingBarColor = (score: number) => {
  if (score >= 5) return 'bg-emerald-500';
  if (score >= 4) return 'bg-teal-500';
  if (score >= 3) return 'bg-amber-500';
  return 'bg-zinc-300';
};

const instagramUrl = (handle: string) =>
  `https://instagram.com/${handle.replace(/^@/, '').trim()}`;

export const PlaceDetailModal: React.FC<PlaceDetailModalProps> = ({
  place,
  onClose,
  isFavorite,
  onToggleFavorite,
}) => {
  const { locale, t } = useLocale();
  const [photoIndex, setPhotoIndex] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);

  const ratings = getRatingItems(place, t);
  const reasons = getWhyHere(place, t);
  const amenities = getConfirmedAmenities(place, t);
  const openState = getOpenState(place.opening_hours);
  const openStateLabel = openState === 'open' ? t.common.openNowLong : t.common.closedNow;
  const districtShort = districtLabel(t, place.district);
  const category = categoryName(t, place.category);

  useEffect(() => {
    setPhotoIndex(0);
    setCopiedLink(false);
  }, [place.id]);

  // Mini map with a single marker for the place.
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!mapContainerRef.current || leafletMapRef.current) return;

      const map = L.map(mapContainerRef.current, {
        center: [place.latitude, place.longitude],
        zoom: 15,
        zoomControl: false,
        attributionControl: false,
        scrollWheelZoom: false,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);

      const icon = L.divIcon({
        className: 'custom-pin',
        html: `<div style="background:#18181b;color:#fff;width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(0,0,0,.3);border:2px solid #fff"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg></div>`,
        iconSize: [34, 34],
        iconAnchor: [17, 17],
      });

      L.marker([place.latitude, place.longitude], { icon }).addTo(map);
      leafletMapRef.current = map;
    }, 120);

    return () => {
      clearTimeout(timer);
      leafletMapRef.current?.remove();
      leafletMapRef.current = null;
    };
  }, [place.id, place.latitude, place.longitude]);

  const handleShare = async () => {
    const url = absoluteUrl(
      buildPath({ view: 'place', category: place.category, slug: place.slug }, locale),
    );
    try {
      await navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      // Clipboard can be unavailable (insecure context, denied permission).
      window.prompt(t.detail.copyPrompt, url);
    }
  };

  const showPhoto = (delta: number) => {
    setPhotoIndex((current) => (current + delta + place.photos.length) % place.photos.length);
  };

  return (
    <Sheet
      title={place.name}
      onClose={onClose}
      variant="dialog"
      maxWidth="max-w-4xl"
      footer={
        <div className="flex items-center gap-3">
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${place.latitude},${place.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-bold transition-colors min-h-[52px]"
          >
            <Navigation className="w-4 h-4" aria-hidden="true" />
            {t.detail.openRoute}
          </a>

          <button
            type="button"
            onClick={() => onToggleFavorite(place.id)}
            aria-pressed={isFavorite}
            className={`inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-2xl text-sm font-bold border transition-colors min-h-[52px] ${
              isFavorite
                ? 'bg-rose-500 text-white border-rose-500'
                : 'bg-white text-zinc-800 border-zinc-200 hover:border-zinc-400'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} aria-hidden="true" />
            <span className="hidden sm:inline">{isFavorite ? t.detail.saved : t.detail.save}</span>
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center justify-center p-3.5 rounded-2xl border border-zinc-200 text-zinc-700 hover:border-zinc-400 transition-colors min-h-[52px]"
            aria-label={t.detail.copyLink}
          >
            {copiedLink ? (
              <Check className="w-4 h-4 text-emerald-600" aria-hidden="true" />
            ) : (
              <Share2 className="w-4 h-4" aria-hidden="true" />
            )}
          </button>
        </div>
      }
    >
      <div className="space-y-7">
        {/* Gallery */}
        <div className="space-y-2.5">
          <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-zinc-100">
            <PlacePhoto
              place={place}
              index={photoIndex}
              alt={t.detail.photoOf(place.name, photoIndex + 1)}
              className="w-full h-full"
              withNote
            />

            {place.photos.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => showPhoto(-1)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/90 text-zinc-800 hover:bg-white shadow-md"
                  aria-label={t.detail.prevPhoto}
                >
                  <ChevronLeft className="w-5 h-5" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => showPhoto(1)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/90 text-zinc-800 hover:bg-white shadow-md"
                  aria-label={t.detail.nextPhoto}
                >
                  <ChevronRight className="w-5 h-5" aria-hidden="true" />
                </button>
              </>
            )}

            {place.is_demo && (
              <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-400 text-zinc-950">
                {t.common.demoUnverified}
              </span>
            )}
          </div>

          {place.photos.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {place.photos.map((photo, index) => (
                <button
                  key={photo}
                  type="button"
                  onClick={() => setPhotoIndex(index)}
                  aria-label={t.detail.photo(index + 1)}
                  aria-current={photoIndex === index}
                  className={`w-20 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                    photoIndex === index ? 'border-zinc-900' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={photo} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Header */}
        <header>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-zinc-900 text-white">
              {category}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-zinc-100 text-zinc-700 border border-zinc-200">
              {place.subcategory}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-zinc-100 text-zinc-700 border border-zinc-200">
              {districtLabel(t, place.district)}
            </span>
            {place.atmosphere && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                {atmosphereLabel(t, place.atmosphere)}
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-zinc-900 font-['Outfit',sans-serif] leading-tight">
            {place.name}
          </h1>

          <p className="mt-3 text-sm sm:text-base text-zinc-600 leading-relaxed">
            {place.description}
          </p>
        </header>

        {/* Why here */}
        {reasons.length > 0 && (
          <section className="bg-zinc-50 rounded-2xl p-5 border border-zinc-200/70">
            <h2 className="flex items-center gap-2 text-sm font-bold text-zinc-900 mb-3">
              <Sparkles className="w-4 h-4 text-amber-500" aria-hidden="true" />
              {t.detail.whyHere}
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {reasons.map((reason) => (
                <li key={reason.id} className="flex items-center gap-2 text-sm text-zinc-700">
                  <reason.icon className="w-4 h-4 text-zinc-400 shrink-0" aria-hidden="true" />
                  {reason.label}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Ratings appear only where somebody actually measured them. */}
        {ratings.length > 0 && (
          <section>
            <div className="flex items-baseline justify-between mb-3">
              <h2 className="text-sm font-bold text-zinc-900">{t.detail.ratings}</h2>
              <span className="text-xs text-zinc-400">{t.detail.ratingsScale}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ratings.map((rating) => (
                <div key={rating.id} className="bg-white p-4 rounded-2xl border border-zinc-200">
                  <div className="flex items-center justify-between text-sm font-semibold text-zinc-800 mb-2">
                    <span className="flex items-center gap-2">
                      <rating.icon className={`w-4 h-4 ${rating.color}`} aria-hidden="true" />
                      {rating.label}
                    </span>
                    <span className="font-extrabold">
                      {rating.value}
                      <span className="text-zinc-400 font-semibold">/5</span>
                    </span>
                  </div>
                  <div
                    className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden"
                    role="meter"
                    aria-valuenow={rating.value}
                    aria-valuemin={0}
                    aria-valuemax={5}
                    aria-label={rating.label}
                  >
                    <div
                      className={`h-full rounded-full ${ratingBarColor(rating.value)}`}
                      style={{ width: `${(rating.value / 5) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Confirmed amenities — nothing unverified is listed. */}
        {amenities.length > 0 && (
          <section>
            <h2 className="text-sm font-bold text-zinc-900 mb-3">{t.detail.amenities}</h2>
            <ul className="flex flex-wrap gap-2">
              {amenities.map((a) => (
                <li
                  key={a.id}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-semibold text-zinc-700"
                >
                  <a.icon className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
                  {a.label}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Route details, for walking routes only */}
        {place.route && (
          <section className="bg-sky-50/60 rounded-2xl p-5 border border-sky-200/70">
            <h2 className="flex items-center gap-2 text-sm font-bold text-zinc-900 mb-4">
              <RouteIcon className="w-4 h-4 text-sky-600" aria-hidden="true" />
              {t.detail.route}
            </h2>

            <dl className="grid grid-cols-3 gap-3 mb-4">
              <div>
                <dt className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">{t.detail.duration}</dt>
                <dd className="text-base font-extrabold text-zinc-900">
                  {t.metrics.chips.minutes(place.route.duration_min)}
                </dd>
              </div>
              <div>
                <dt className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">{t.detail.distance}</dt>
                <dd className="text-base font-extrabold text-zinc-900">
                  {t.metrics.chips.kilometres(place.route.distance_km)}
                </dd>
              </div>
              <div>
                <dt className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">{t.detail.difficulty}</dt>
                <dd className="text-base font-extrabold text-zinc-900">
                  {difficultyLabel(t, place.route.difficulty)}
                </dd>
              </div>
            </dl>

            <div className="space-y-2 text-sm text-zinc-700">
              <p><span className="font-semibold">{t.detail.start}:</span> {place.route.start}</p>
              <p><span className="font-semibold">{t.detail.finish}:</span> {place.route.finish}</p>
              {place.route.highlights.length > 0 && (
                <p><span className="font-semibold">{t.detail.highlights}:</span> {place.route.highlights.join(' · ')}</p>
              )}
              {place.route.cafes_on_route.length > 0 && (
                <p><span className="font-semibold">{t.detail.cafesOnRoute}:</span> {place.route.cafes_on_route.join(' · ')}</p>
              )}
            </div>
          </section>
        )}

        {/* Practical info + map */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-zinc-50 rounded-2xl p-5 border border-zinc-200/70 space-y-3">
            <h2 className="text-sm font-bold text-zinc-900">{t.detail.practical}</h2>

            <p className="flex items-start gap-3 text-sm text-zinc-700">
              <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" aria-hidden="true" />
              <span>{place.address}</span>
            </p>

            <p className="flex items-start gap-3 text-sm text-zinc-700">
              <Clock className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
              <span>
                {formatOpeningHours(place.opening_hours, t.common)}
                {openState !== 'unknown' && (
                  <span className={`ml-2 font-semibold ${openState === 'open' ? 'text-emerald-700' : 'text-zinc-500'}`}>
                    · {openStateLabel}
                  </span>
                )}
              </span>
            </p>

            <p className="flex items-start gap-3 text-sm text-zinc-700">
              <DollarSign className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" aria-hidden="true" />
              <span>{t.detail.priceLevel}: {'$'.repeat(place.price_level)}</span>
            </p>

            {place.phone && (
              <p className="flex items-start gap-3 text-sm text-zinc-700">
                <Phone className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" aria-hidden="true" />
                <span>{place.phone}</span>
              </p>
            )}

            {place.source && (
              <p className="text-[11px] text-zinc-400 pt-1">
                {t.detail.source}:{' '}
                {place.source.url ? (
                  <a
                    href={place.source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-zinc-600"
                  >
                    {place.source.name}
                  </a>
                ) : (
                  place.source.name
                )}
              </p>
            )}

            <div className="flex flex-wrap gap-2 pt-1">
              {place.website && (
                <a
                  href={place.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-zinc-200 text-xs font-semibold text-zinc-800 hover:border-zinc-400 transition-colors"
                >
                  <Globe className="w-3.5 h-3.5 text-blue-600" aria-hidden="true" />
                  {t.detail.website}
                  <ExternalLink className="w-3 h-3 text-zinc-400" aria-hidden="true" />
                </a>
              )}

              {place.instagram && (
                <a
                  href={instagramUrl(place.instagram)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-zinc-200 text-xs font-semibold text-zinc-800 hover:border-zinc-400 transition-colors"
                >
                  <Instagram className="w-3.5 h-3.5 text-pink-600" aria-hidden="true" />
                  {place.instagram}
                  <ExternalLink className="w-3 h-3 text-zinc-400" aria-hidden="true" />
                </a>
              )}
            </div>
          </div>

          <div className="bg-zinc-50 rounded-2xl p-5 border border-zinc-200/70 flex flex-col">
            <h2 className="text-sm font-bold text-zinc-900 mb-3">{t.detail.onMap}</h2>
            <div
              ref={mapContainerRef}
              className="w-full flex-1 min-h-[180px] rounded-xl overflow-hidden border border-zinc-200 z-0 relative"
            />
            <p className="text-[11px] text-zinc-400 mt-2">
              {place.latitude.toFixed(4)}, {place.longitude.toFixed(4)} · {districtShort}
            </p>
          </div>
        </section>

        <PlaceComments placeId={place.id} />
      </div>
    </Sheet>
  );
};
