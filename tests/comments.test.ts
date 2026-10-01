// Minimal localStorage stand-in so the repository can be exercised in node.
const mem = new Map<string, string>();
(globalThis as any).localStorage = {
  getItem: (k: string) => mem.get(k) ?? null,
  setItem: (k: string, v: string) => { mem.set(k, v); },
  removeItem: (k: string) => { mem.delete(k); },
};

async function main() {
const { addComment, deleteComment, getComments, getCommentCount, COMMENT_MAX_LENGTH } =
  await import('../src/utils/comments');

let failed = 0;
const t = (label: string, actual: unknown, expected: unknown) => {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (!ok) failed++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label} → ${JSON.stringify(actual)}${ok ? '' : ` (expected ${JSON.stringify(expected)})`}`);
};

t('порожній список на старті', getComments('place-1'), []);
t('лічильник на старті', getCommentCount('place-1'), 0);

addComment('place-1', { author: 'Вадим', text: 'Тихо зранку, розеток мало.' });
const one = getComments('place-1');
t('коментар додано', one.length, 1);
t('автор збережений', one[0].author, 'Вадим');
t('текст збережений', one[0].text, 'Тихо зранку, розеток мало.');
t('прив’язка до місця', one[0].place_id, 'place-1');
t('є мітка часу', !Number.isNaN(new Date(one[0].created_at).getTime()), true);

addComment('place-1', { author: '', text: 'Без імені' });
t('анонімний коментар', getComments('place-1')[0].author, '');
t('новіші зверху', getComments('place-1')[0].text, 'Без імені');

addComment('place-1', { author: 'X', text: '   ' });
t('порожній текст ігнорується', getCommentCount('place-1'), 2);

addComment('place-1', { author: 'Y', text: '  з пробілами  ' });
t('текст обрізається', getComments('place-1')[0].text, 'з пробілами');

addComment('place-2', { author: '', text: 'Інше місце' });
t('коментарі не течуть між місцями', getCommentCount('place-1'), 3);
t('друге місце має свій', getCommentCount('place-2'), 1);

addComment('place-3', { author: '', text: 'x'.repeat(COMMENT_MAX_LENGTH + 250) });
t('довгий текст обмежено', getComments('place-3')[0].text.length, COMMENT_MAX_LENGTH);

const target = getComments('place-1')[0];
deleteComment('place-1', target.id);
t('видалення працює', getCommentCount('place-1'), 2);
t('видалено саме той', getComments('place-1').some((c) => c.id === target.id), false);

deleteComment('place-2', getComments('place-2')[0].id);
t('останній видалений прибирає ключ', getCommentCount('place-2'), 0);

t('пошкоджені дані не ламають', (() => {
  mem.set('chisinau_comments_v1', 'not json');
  return getComments('place-1');
})(), []);

console.log(failed === 0 ? '\nAll comment cases pass.' : `\n${failed} failing case(s).`);
}
main();
