import React, { useEffect, useMemo, useRef, useState } from 'react';
import L from 'leaflet';
// Bundled locally (not from a CDN) and only loaded with this lazy chunk, so
// pages that never open the map don't pay for Leaflet's styles either.
import 'leaflet/dist/leaflet.css';
import {
  Coffee,
  Compass,
  Feather,
  Footprints,
  Heart,
  Laptop,
  Layers,
  MapPin,
  Navigation,
  Utensils,
  X,
} from 'lucide-react';
import type { CategoryId, District, Place, PlaceCategoryId } from '../types';
import { DISTRICT_IDS } from '../data/chisinauPlaces';
import { PlacePhoto } from './ui/PlacePhoto';
import { useT } from '../i18n';
import { districtShortLabel } from '../i18n/labels';

interface InteractiveMapProps {
  places: Place[];
  onSelectPlace: (place: Place) => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}

const CHISINAU_CENTER: [number, number] = [47.0245, 28.8322];

const MAP_CATEGORIES: { id: PlaceCategoryId; icon: React.ElementType; color: string }[] = [
  { id: 'cafes', icon: Coffee, color: '#e11d48' },
  { id: 'remote_work', icon: Laptop, color: '#059669' },
  { id: 'quiet_places', icon: Feather, color: '#d97706' },
  { id: 'food', icon: Utensils, color: '#ea580c' },
  { id: 'walks', icon: Footprints, color: '#0284c7' },
  { id: 'activities', icon: Compass, color: '#7c3aed' },
];

const CATEGORY_COLORS: Record<string, string> = Object.fromEntries(
  MAP_CATEGORIES.map((category) => [category.id, category.color]),
);

const DISTRICT_CENTERS: Record<District, [number, number]> = {
  'Центр': [47.0245, 28.8322],
  'Ришканівка': [47.045, 28.858],
  'Ботаніка': [46.995, 28.865],
  'Буюкань': [47.0322, 28.8105],
  'Чокана': [47.05, 28.885],
  'Телецентр': [47.005, 28.825],
};

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  places,
  onSelectPlace,
  favorites,
  onToggleFavorite,
}) => {
  const t = useT();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<District | 'all'>('all');
  const [preview, setPreview] = useState<Place | null>(null);

  const visiblePlaces = useMemo(
    () =>
      places.filter(
        (place) =>
          (selectedCategory === 'all' || place.category === selectedCategory) &&
          (selectedDistrict === 'all' || place.district === selectedDistrict),
      ),
    [places, selectedCategory, selectedDistrict],
  );

  useEffect(() => {
    if (!mapContainerRef.current || leafletMapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: CHISINAU_CENTER,
      zoom: 13,
      zoomControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    markersLayerRef.current = L.layerGroup().addTo(map);
    leafletMapRef.current = map;

    // The container is sized by CSS; make sure Leaflet measures it after layout.
    setTimeout(() => map.invalidateSize(), 120);

    return () => {
      map.remove();
      leafletMapRef.current = null;
      markersLayerRef.current = null;
    };
  }, []);

  useEffect(() => {
    const layer = markersLayerRef.current;
    if (!layer) return;

    layer.clearLayers();

    visiblePlaces.forEach((place) => {
      const color = CATEGORY_COLORS[place.category] ?? '#18181b';

      const icon = L.divIcon({
        className: 'chisinau-custom-pin',
        html: `<div style="background:${color};color:#fff;width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 14px rgba(0,0,0,.35);border:2.5px solid #fff;cursor:pointer"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg></div>`,
        iconSize: [38, 38],
        iconAnchor: [19, 38],
      });

      L.marker([place.latitude, place.longitude], { icon, title: place.name })
        .on('click', () => {
          setPreview(place);
          leafletMapRef.current?.panTo([place.latitude, place.longitude], { animate: true });
        })
        .addTo(layer);
    });
  }, [visiblePlaces]);

  const handleLocateMe = () => {
    if (!navigator.geolocation || !leafletMapRef.current) return;

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const map = leafletMapRef.current;
        if (!map) return;
        map.setView([coords.latitude, coords.longitude], 15);
        L.marker([coords.latitude, coords.longitude], {
          icon: L.divIcon({
            className: 'user-location-pin',
            html: '<div style="width:20px;height:20px;background:#3b82f6;border-radius:50%;border:3px solid #fff;box-shadow:0 0 10px rgba(59,130,246,.6)"></div>',
            iconSize: [20, 20],
            iconAnchor: [10, 10],
          }),
        })
          .addTo(map)
          .bindPopup(t.map.youAreHere)
          .openPopup();
      },
      (error) => console.warn('Geolocation error', error),
    );
  };

  const focusDistrict = (district: District | 'all') => {
    setSelectedDistrict(district);
    const map = leafletMapRef.current;
    if (!map) return;

    if (district === 'all') map.setView(CHISINAU_CENTER, 13, { animate: true });
    else map.setView(DISTRICT_CENTERS[district], 14, { animate: true });
  };

  return (
    <div className="bg-white rounded-3xl border border-zinc-200 overflow-hidden">
      <div className="p-4 sm:p-6 border-b border-zinc-200 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 font-['Outfit',sans-serif] flex items-center gap-2">
              <MapPin className="w-6 h-6 text-rose-500" aria-hidden="true" />
              {t.map.title}
            </h1>
            <p className="text-sm text-zinc-500 mt-1">{t.map.subtitle(visiblePlaces.length)}</p>
          </div>

          <button
            type="button"
            onClick={handleLocateMe}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold bg-zinc-100 hover:bg-zinc-200 text-zinc-800 transition-colors min-h-[44px]"
          >
            <Navigation className="w-4 h-4 text-blue-600" aria-hidden="true" />
            {t.map.locateMe}
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            aria-pressed={selectedCategory === 'all'}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap border transition-colors min-h-[40px] ${
              selectedCategory === 'all'
                ? 'bg-zinc-900 text-white border-zinc-900'
                : 'bg-white text-zinc-700 border-zinc-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" aria-hidden="true" />
            {t.map.allCategories}
          </button>

          {MAP_CATEGORIES.map(({ id, icon: Icon, color }) => {
            const isActive = selectedCategory === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setSelectedCategory(isActive ? 'all' : id)}
                aria-pressed={isActive}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap border transition-colors min-h-[40px] ${
                  isActive
                    ? 'bg-zinc-900 text-white border-zinc-900'
                    : 'bg-white text-zinc-700 border-zinc-200'
                }`}
              >
                <Icon
                  className="w-3.5 h-3.5"
                  style={{ color: isActive ? undefined : color }}
                  aria-hidden="true"
                />
                {t.map.categories[id]}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          <span className="text-xs font-semibold text-zinc-400 shrink-0">{t.map.district}</span>
          <button
            type="button"
            onClick={() => focusDistrict('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
              selectedDistrict === 'all' ? 'bg-zinc-200 text-zinc-900 font-bold' : 'text-zinc-600 hover:bg-zinc-100'
            }`}
          >
            {t.map.wholeCity}
          </button>
          {DISTRICT_IDS.map((district) => (
            <button
              key={district}
              type="button"
              onClick={() => focusDistrict(district)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
                selectedDistrict === district
                  ? 'bg-zinc-200 text-zinc-900 font-bold'
                  : 'text-zinc-600 hover:bg-zinc-100'
              }`}
            >
              {districtShortLabel(t, district)}
            </button>
          ))}
        </div>
      </div>

      <div className="relative w-full h-[60vh] min-h-[380px] sm:h-[620px]">
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {preview && (
          <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 z-20">
            <div className="relative bg-white rounded-2xl p-4 shadow-xl border border-zinc-200">
              <button
                type="button"
                onClick={() => setPreview(null)}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-zinc-100 text-zinc-500 hover:text-zinc-900"
                aria-label={t.common.close}
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>

              <div className="flex gap-3 pr-8">
                <PlacePhoto place={preview} alt="" className="w-20 h-20 rounded-xl shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 truncate">
                    {preview.subcategory}
                  </p>
                  <h2 className="font-bold text-sm text-zinc-900 leading-snug line-clamp-2">
                    {preview.name}
                  </h2>
                  <p className="text-xs text-zinc-500 truncate mt-0.5">{preview.address}</p>
                  <p className="flex items-center gap-2 mt-1.5 text-xs">
                    <span className="text-zinc-600">{'$'.repeat(preview.price_level)}</span>
                  </p>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-zinc-100 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onSelectPlace(preview)}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold transition-colors min-h-[42px]"
                >
                  {t.common.details}
                </button>

                <button
                  type="button"
                  onClick={() => onToggleFavorite(preview.id)}
                  aria-pressed={favorites.includes(preview.id)}
                  aria-label={t.map.saveToFavorites}
                  className={`p-2.5 rounded-xl border transition-colors min-h-[42px] ${
                    favorites.includes(preview.id)
                      ? 'bg-rose-50 border-rose-200 text-rose-600'
                      : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                  }`}
                >
                  <Heart
                    className={`w-4 h-4 ${favorites.includes(preview.id) ? 'fill-current' : ''}`}
                    aria-hidden="true"
                  />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
