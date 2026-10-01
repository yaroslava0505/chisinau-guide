import React from 'react';
import { ImageOff } from 'lucide-react';
import type { Place } from '../../types';
import { useT } from '../../i18n';
import { getIllustration } from '../../utils/illustrations';

interface PlacePhotoProps {
  place: Place;
  /** Index into the place's own photos; ignored when it has none. */
  index?: number;
  alt: string;
  className?: string;
  /** Renders the "illustrative photo" note; off for small thumbnails. */
  withNote?: boolean;
  /**
   * Position classes for the note. Callers that already place their own
   * badges in a photo's corners (district, price, demo tag) must move the
   * note elsewhere so the two don't render on top of each other.
   */
  noteClassName?: string;
}

/**
 * A place's photograph when one exists, otherwise a thematic illustration.
 *
 * The illustration is always labelled, because a stock photo of some other
 * café presented without a caption reads as a picture of *this* café. The
 * label is what keeps the imagery honest.
 */
export const PlacePhoto: React.FC<PlacePhotoProps> = ({
  place,
  index = 0,
  alt,
  className = '',
  withNote = false,
  noteClassName = 'bottom-2 left-2',
}) => {
  const t = useT();
  const real = place.photos[index] ?? place.photos[0];
  const illustration = real ? null : getIllustration(place);
  const src = real ?? illustration;

  if (!src) {
    return (
      <div
        role="img"
        aria-label={t.common.noPhoto}
        className={`flex items-center justify-center bg-zinc-100 text-zinc-400 ${className}`}
      >
        <ImageOff className="w-7 h-7" aria-hidden="true" />
      </div>
    );
  }

  return (
    <span className={`relative block overflow-hidden ${className}`}>
      <img
        src={src}
        alt={real ? alt : ''}
        aria-hidden={real ? undefined : true}
        loading="lazy"
        className="w-full h-full object-cover"
      />

      {/* Only an illustration carries the note; a real photo needs none. */}
      {illustration && withNote && (
        <span className={`absolute inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-black/55 backdrop-blur-sm text-white text-[10px] font-semibold ${noteClassName}`}>
          <ImageOff className="w-3 h-3" aria-hidden="true" />
          {t.common.illustrative}
        </span>
      )}
    </span>
  );
};
