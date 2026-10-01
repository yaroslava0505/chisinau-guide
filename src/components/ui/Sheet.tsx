import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { useT } from '../../i18n';

interface SheetProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  /** Footer pinned below the scrollable body, e.g. an "apply" button. */
  footer?: React.ReactNode;
  /** `sheet` slides up from the bottom on mobile; `dialog` is centred everywhere. */
  variant?: 'sheet' | 'dialog';
  maxWidth?: string;
}

/**
 * Accessible overlay used for mobile filters and the place detail view:
 * closes on Esc and on backdrop click, locks background scroll and moves
 * focus into the panel.
 */
export const Sheet: React.FC<SheetProps> = ({
  title,
  onClose,
  children,
  footer,
  variant = 'sheet',
  maxWidth = 'max-w-2xl',
}) => {
  const t = useT();
  const panelRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onClose();
      }
    };
    document.addEventListener('keydown', onKeyDown);

    panelRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = overflow;
      previouslyFocused.current?.focus?.();
    };
  }, [onClose]);

  const panelPosition =
    variant === 'sheet'
      ? 'items-end sm:items-center'
      : 'items-center';

  const panelShape =
    variant === 'sheet'
      ? 'rounded-t-3xl sm:rounded-3xl max-h-[88vh] sm:max-h-[90vh]'
      : 'rounded-3xl max-h-[92vh]';

  return (
    <div className={`fixed inset-0 z-50 flex justify-center ${panelPosition} bg-zinc-950/50 backdrop-blur-sm p-0 sm:p-4`}>
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className={`relative z-10 w-full ${maxWidth} bg-white ${panelShape} shadow-2xl border border-zinc-200 flex flex-col outline-none`}
      >
        <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-zinc-100 shrink-0">
          <h2 className="text-base font-bold text-zinc-900 font-['Outfit',sans-serif]">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 -mr-2 rounded-full text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
            aria-label={t.common.close}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto px-5 py-5 flex-1">{children}</div>

        {footer && (
          <div className="px-5 py-4 border-t border-zinc-100 bg-white shrink-0 pb-[max(1rem,env(safe-area-inset-bottom))]">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
