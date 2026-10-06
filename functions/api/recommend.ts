/**
 * Cloudflare Pages Function — POST /api/recommend
 *
 * Backs the homepage's free-text "AI підбір" box. Runs server-side so the
 * Anthropic API key never reaches the browser (unlike VITE_* values, this one
 * must stay a secret — see README § AI-підбір місць).
 *
 * The model only ever sees the catalogue already shipped on the site (never
 * invents a place) and must answer through a strict tool call, so the
 * response shape is guaranteed rather than hopefully-parsed free text.
 */
import Anthropic from '@anthropic-ai/sdk';
import { INITIAL_PLACES } from '../../src/data/chisinauPlaces';
import type { Place } from '../../src/types';

interface Env {
  ANTHROPIC_API_KEY?: string;
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
// the catalogue's token count — it's resent (or, once cached, re-read) on
// every single request, so trimming it here is the highest-value place to
// cut cost. See README § AI-підбір місць for the measured $/request impact.
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

// Built once per isolate (not per request) and marked cacheable below, so a
// burst of requests only pays full price for the catalogue once.
const CATALOGUE_JSON = JSON.stringify(INITIAL_PLACES.map(toCatalogueEntry));
const KNOWN_SLUGS = new Set(INITIAL_PLACES.map((place) => place.slug));

const SYSTEM_PROMPT = `Ти — асистент міського гіда "Кишинів Гід" по Кишиневу (Молдова). Відвідувач своїми словами описує, чого хоче зараз. Підбери від 1 до ${MAX_RESULTS} найбільш підходящих місць із каталогу нижче — і тільки з нього, ніколи не вигадуй місце, якого там немає.

Каталог (JSON-масив, поля: slug, cat=категорія, name, sub=підкатегорія, district, desc=короткий опис (може бути обрізаний), tags, kids=для дітей, free=безкоштовний вхід, price=рівень цін 1-3):
${CATALOGUE_JSON}

Відповідай викликом інструмента recommend_places.
- "intro": одне коротке дружнє речення тією самою мовою, якою написаний запит (українська/російська/румунська), без слів "AI", "алгоритм" чи "модель".
- "slugs": slug-и з каталогу вище, найкращі варіанти першими.
Якщо в каталозі справді немає нічого підходящого — поверни порожній масив і чесно скажи про це в intro, замість вигаданої відповіді.`;

const RECOMMEND_TOOL: Anthropic.Tool = {
  name: 'recommend_places',
  description: "Return the catalogue places that best match the visitor's request.",
  input_schema: {
    type: 'object',
    properties: {
      intro: { type: 'string' },
      slugs: { type: 'array', items: { type: 'string' } },
    },
    required: ['intro', 'slugs'],
    additionalProperties: false,
  },
  strict: true,
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

  if (!env.ANTHROPIC_API_KEY) {
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

  const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });

  try {
    const response = await client.messages.create({
      model: 'claude-opus-5',
      max_tokens: 1024,
      // Matching a request against a provided list doesn't need deep
      // reasoning — "low" keeps the (expensive, $25/1M) thinking/output
      // tokens short without hurting match quality.
      output_config: { effort: 'low' },
      // The catalogue is identical across requests until the next deploy, so
      // a 1h cache (vs the 5-minute default) keeps it warm across a whole
      // day's worth of spread-out visitors, not just back-to-back ones.
      system: [
        { type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral', ttl: '1h' } },
      ],
      tools: [RECOMMEND_TOOL],
      tool_choice: { type: 'tool', name: 'recommend_places' },
      messages: [{ role: 'user', content: query }],
    });

    const toolUse = response.content.find(
      (block): block is Anthropic.ToolUseBlock => block.type === 'tool_use',
    );
    if (!toolUse) {
      return json({ error: 'no_result' }, 502);
    }

    const input = toolUse.input as { intro?: string; slugs?: unknown };
    const slugs = Array.isArray(input.slugs)
      ? input.slugs.filter((slug): slug is string => typeof slug === 'string' && KNOWN_SLUGS.has(slug)).slice(0, MAX_RESULTS)
      : [];

    return json({ intro: input.intro ?? '', slugs });
  } catch (error) {
    console.error('recommend function error', error);
    return json({ error: 'upstream_error' }, 502);
  }
}
