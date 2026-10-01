import type { PlaceComment } from '../types';

/**
 * Comment storage.
 *
 * There is no server in this project, so comments live in the visitor's own
 * browser: whoever writes one is the only person who can read it. The UI says
 * so plainly — presenting private notes as public reviews would mislead people
 * into thinking they are talking to other readers.
 *
 * Everything below is deliberately a thin, synchronous repository around one
 * key. Swapping it for an API means reimplementing these four functions (and
 * making the callers await them); no component reaches into storage directly.
 */

const COMMENTS_KEY = 'chisinau_comments_v1';

export const COMMENT_MAX_LENGTH = 600;
export const AUTHOR_MAX_LENGTH = 40;

/** All comments, grouped by place id. */
type CommentStore = Record<string, PlaceComment[]>;

function readStore(): CommentStore {
  try {
    const raw = localStorage.getItem(COMMENTS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
  } catch (err) {
    console.error('Error reading comments', err);
    return {};
  }
}

function writeStore(store: CommentStore): void {
  try {
    localStorage.setItem(COMMENTS_KEY, JSON.stringify(store));
  } catch (err) {
    console.error('Error saving comments', err);
  }
}

/**
 * Newest first.
 *
 * Ordering follows insertion, not `created_at`: two comments written in the
 * same millisecond share a timestamp, and sorting by it would put them in an
 * arbitrary order that changes between reads.
 */
export function getComments(placeId: string): PlaceComment[] {
  const list = readStore()[placeId] ?? [];
  return [...list].reverse();
}

export function getCommentCount(placeId: string): number {
  return (readStore()[placeId] ?? []).length;
}

/**
 * Appends a comment and returns the updated list.
 * Returns the unchanged list when the text is blank, so an accidental submit
 * cannot create an empty entry.
 */
export function addComment(placeId: string, input: { author: string; text: string }): PlaceComment[] {
  const text = input.text.trim().slice(0, COMMENT_MAX_LENGTH);
  if (!text) return getComments(placeId);

  const comment: PlaceComment = {
    id: `comment-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    place_id: placeId,
    author: input.author.trim().slice(0, AUTHOR_MAX_LENGTH),
    text,
    created_at: new Date().toISOString(),
  };

  const store = readStore();
  store[placeId] = [...(store[placeId] ?? []), comment];
  writeStore(store);

  return getComments(placeId);
}

export function deleteComment(placeId: string, commentId: string): PlaceComment[] {
  const store = readStore();
  store[placeId] = (store[placeId] ?? []).filter((comment) => comment.id !== commentId);
  if (store[placeId].length === 0) delete store[placeId];
  writeStore(store);

  return getComments(placeId);
}
