import React, { useEffect, useMemo, useState } from 'react';
import { Info, MessageSquare, Trash2 } from 'lucide-react';
import type { PlaceComment } from '../types';
import {
  AUTHOR_MAX_LENGTH,
  COMMENT_MAX_LENGTH,
  addComment,
  deleteComment,
  getComments,
} from '../utils/comments';
import { useT } from '../i18n';
import { formatDate } from '../utils/events';

interface PlaceCommentsProps {
  placeId: string;
}

export const PlaceComments: React.FC<PlaceCommentsProps> = ({ placeId }) => {
  const t = useT();
  const [comments, setComments] = useState<PlaceComment[]>([]);
  const [author, setAuthor] = useState('');
  const [text, setText] = useState('');

  useEffect(() => {
    setComments(getComments(placeId));
    setText('');
  }, [placeId]);

  const charsLeft = COMMENT_MAX_LENGTH - text.length;
  const canSubmit = text.trim().length > 0;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!canSubmit) return;
    setComments(addComment(placeId, { author, text }));
    setText('');
  };

  const handleDelete = (commentId: string) => {
    if (!window.confirm(t.comments.deleteConfirm)) return;
    setComments(deleteComment(placeId, commentId));
  };

  const dateLabel = useMemo(
    () => (iso: string) => {
      const date = new Date(iso);
      if (Number.isNaN(date.getTime())) return '';
      const time = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
      const withYear = date.getFullYear() !== new Date().getFullYear();
      return `${formatDate(date, t, withYear)}, ${time}`;
    },
    [t],
  );

  return (
    <section aria-labelledby={`comments-${placeId}`}>
      <div className="flex items-baseline justify-between gap-3 mb-3">
        <h2 id={`comments-${placeId}`} className="flex items-center gap-2 text-sm font-bold text-zinc-900">
          <MessageSquare className="w-4 h-4 text-zinc-400" aria-hidden="true" />
          {t.comments.title}
        </h2>
        {comments.length > 0 && (
          <span className="text-xs text-zinc-400">{t.comments.count(comments.length)}</span>
        )}
      </div>

      {/* Saying this out loud matters: these are private notes, not public reviews. */}
      <p className="flex items-start gap-2 text-[11px] text-zinc-500 bg-zinc-50 border border-zinc-200/70 rounded-xl px-3 py-2.5 mb-4">
        <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-zinc-400" aria-hidden="true" />
        {t.comments.localOnly}
      </p>

      <form onSubmit={handleSubmit} className="space-y-2.5 mb-5">
        <input
          type="text"
          value={author}
          maxLength={AUTHOR_MAX_LENGTH}
          onChange={(event) => setAuthor(event.target.value)}
          placeholder={t.comments.namePlaceholder}
          aria-label={t.comments.namePlaceholder}
          className="w-full bg-white border border-zinc-200 rounded-xl px-3.5 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900 min-h-[46px]"
        />

        <textarea
          rows={3}
          value={text}
          maxLength={COMMENT_MAX_LENGTH}
          onChange={(event) => setText(event.target.value)}
          placeholder={t.comments.textPlaceholder}
          aria-label={t.comments.textPlaceholder}
          className="w-full bg-white border border-zinc-200 rounded-xl px-3.5 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900 resize-y"
        />

        <div className="flex items-center justify-between gap-3">
          <span className="text-[11px] text-zinc-400" aria-live="polite">
            {text.length > 0 && t.comments.charsLeft(charsLeft)}
          </span>
          <button
            type="submit"
            disabled={!canSubmit}
            className="px-4 py-2.5 rounded-xl bg-zinc-900 text-white text-sm font-semibold transition-colors hover:bg-zinc-800 disabled:bg-zinc-200 disabled:text-zinc-400 disabled:cursor-not-allowed min-h-[44px]"
          >
            {t.comments.submit}
          </button>
        </div>
      </form>

      {comments.length === 0 ? (
        <p className="text-sm text-zinc-500 text-center py-4">{t.comments.empty}</p>
      ) : (
        <ul className="space-y-3">
          {comments.map((comment) => (
            <li
              key={comment.id}
              className="bg-white border border-zinc-200 rounded-2xl px-4 py-3.5"
            >
              <div className="flex items-baseline justify-between gap-3 mb-1.5">
                <span className="text-sm font-semibold text-zinc-900">
                  {comment.author || t.comments.anonymous}
                </span>
                <span className="flex items-center gap-2 shrink-0">
                  <time dateTime={comment.created_at} className="text-[11px] text-zinc-400">
                    {dateLabel(comment.created_at)}
                  </time>
                  <button
                    type="button"
                    onClick={() => handleDelete(comment.id)}
                    aria-label={t.comments.delete}
                    className="p-3.5 -m-2.5 rounded-lg text-zinc-300 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" aria-hidden="true" />
                  </button>
                </span>
              </div>

              <p className="text-sm text-zinc-700 leading-relaxed whitespace-pre-wrap break-words">
                {comment.text}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};
