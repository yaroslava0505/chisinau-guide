/**
 * Cloudflare Pages Function — POST /api/recommend
 *
 * Backs the homepage's free-text "AI підбір" box. Runs server-side so the
 * Gemini API key never reaches the browser (unlike VITE_* values, this one
 * must stay a secret — see README § AI-підбір місць).
 *
 * The model only ever sees the catalogue already shipped on the site (never
 * invents a place) and must answer with JSON matching a fixed schema, so the
 * response shape is guaranteed rather than hopefully-parsed free text.
 */
import { GoogleGenAI } from '@google/genai';
import { INITIAL_PLACES } from '../../src/data/chisinauPlaces';
import type { Place } from '../../src/types';

interface Env {
  GEMINI_API_KEY?: string;
  /** Same value as VITE_SITE_URL — used to reject cross-site requests. */
  SITE_URL?: string;
}

interface EventContext {
  request: Request;
  env: Env;
}

const MAX_QUERY_LENGTH = 300;
const MAX_RESULTS = 6;
// Short field names and a clipped description are the two biggest levers on
// the catalogue's token count — it's resent on every single request, so
// trimming it here is the highest-value place to cut cost.
const DESCRIPTION_LIMIT = 90;

/** Cuts at the last space within the limit instead of mid-word. */
function clip(text: string, limit: number): string {
  if (text.length <= limit) return text;
  const cut = text.slice(0, limit);
  const lastSpace = cut.lastIndexOf(' ');
  return `${lastSpace > 0 ? cut.slice(0, lastSpace) : cut}…`;
}

function toCatalogueEntry(place: Place) {
  return {
    slug: place.slug,
    cat: place.category,
    name: place.name,
    sub: place.subcategory,
    district: place.district,
    desc: clip(place.description, DESCRIPTION_LIMIT),
    tags: place.tags ?? [],
    kids: place.kids_friendly,
    free: place.free_entry,
    price: place.price_level,
  };
}

const CATALOGUE_JSON = JSON.stringify(INITIAL_PLACES.map(toCatalogueEntry));
const KNOWN_SLUGS = new Set(INITIAL_PLACES.map((place) => place.slug));

const SYSTEM_PROMPT = `Ти — асистент міського гіда "Кишинів Гід" по Кишиневу (Молдова). Відвідувач своїми словами описує, чого хоче зараз. Підбери від 1 до ${MAX_RESULTS} найбільш підходящих місць із каталогу нижче — і тільки з нього, ніколи не вигадуй місце, якого там немає.

Каталог (JSON-масив, поля: slug, cat=категорія, name, sub=підкатегорія, district, desc=короткий опис (може бути обрізаний), tags, kids=для дітей, free=безкоштовний вхід, price=рівень цін 1-3):
${CATALOGUE_JSON}

Відповідай лише JSON-обʼєктом з полями:
- "intro": одне коротке дружнє речення тією самою мовою, якою написаний запит (українська/російська/румунська), без слів "AI", "алгоритм" чи "модель".
- "slugs": slug-и з каталогу вище, найкращі варіанти першими.
Якщо в каталозі справді немає нічого підходящого — поверни порожній масив і чесно скажи про це в intro, замість вигаданої відповіді.`;

const RESPONSE_SCHEMA = {
  type: 'OBJECT',
  properties: {
    intro: { type: 'STRING' },
    slugs: { type: 'ARRAY', items: { type: 'STRING' } },
  },
  required: ['intro', 'slugs'],
};

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

export async function onRequestPost(context: EventContext): Promise<Response> {
  const { request, env } = context;

  // Same-origin only: this endpoint spends real money per call, and the
  // browser's CORS same-origin default only stops OTHER SITES from reading
  // the response, not from sending the request — this check stops the call
  // itself.
  const origin = request.headers.get('Origin');
  const siteUrl = env.SITE_URL ?? '';
  if (origin && siteUrl && new URL(origin).host !== new URL(siteUrl).host) {
    return json({ error: 'forbidden' }, 403);
  }

  if (!env.GEMINI_API_KEY) {
    return json({ error: 'not_configured' }, 503);
  }

  let body: { query?: unknown };
  try {
    body = await request.json();
  } catch {
    return json({ error: 'invalid_json' }, 400);
  }

  const query = typeof body.query === 'string' ? body.query.trim().slice(0, MAX_QUERY_LENGTH) : '';
  if (!query) {
    return json({ error: 'empty_query' }, 400);
  }

  const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash-lite',
      contents: query,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: 'application/json',
        responseSchema: RESPONSE_SCHEMA,
      },
    });

    const text = response.text;
    if (!text) {
      return json({ error: 'no_result' }, 502);
    }

    const parsed = JSON.parse(text) as { intro?: string; slugs?: unknown };
    const slugs = Array.isArray(parsed.slugs)
      ? parsed.slugs.filter((slug): slug is string => typeof slug === 'string' && KNOWN_SLUGS.has(slug)).slice(0, MAX_RESULTS)
      : [];

    return json({ intro: parsed.intro ?? '', slugs });
  } catch (error) {
    console.error('recommend function error', error);
    return json({ error: 'upstream_error' }, 502);
  }
}
