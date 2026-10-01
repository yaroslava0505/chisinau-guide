import { writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { buildCatalogueFile } from '../src/utils/exportCatalogue';
import { INITIAL_PLACES, INITIAL_EVENTS } from '../src/data/chisinauPlaces';

async function main() {
  let failed = 0;
  const t = (label: string, actual: unknown, expected: unknown) => {
    const ok = JSON.stringify(actual) === JSON.stringify(expected);
    if (!ok) failed += 1;
    console.log(`${ok ? 'PASS' : 'FAIL'}  ${label} → ${JSON.stringify(actual)}${ok ? '' : ` (expected ${JSON.stringify(expected)})`}`);
  };

  const file = buildCatalogueFile(INITIAL_PLACES, INITIAL_EVENTS);

  t('містить імпорт типів', file.includes("from '../types'"), true);
  t('експортує INITIAL_PLACES', file.includes('export const INITIAL_PLACES'), true);
  t('експортує INITIAL_EVENTS', file.includes('export const INITIAL_EVENTS'), true);
  t('експортує DISTRICT_IDS', file.includes('export const DISTRICT_IDS'), true);

  // The real guarantee: the generated file must import back and match exactly.
  const dir = mkdtempSync(join(tmpdir(), 'catalogue-'));
  const path = join(dir, 'chisinauPlaces.ts');
  writeFileSync(path, file.replace("'../types'", "'/Users/vlad/Desktop/chisinau-guide/src/types'"));
  const reloaded = await import(path);

  t('кількість місць збігається', reloaded.INITIAL_PLACES.length, INITIAL_PLACES.length);
  t('дані місць ідентичні',
    JSON.stringify(reloaded.INITIAL_PLACES) === JSON.stringify(INITIAL_PLACES), true);
  t('події ідентичні',
    JSON.stringify(reloaded.INITIAL_EVENTS) === JSON.stringify(INITIAL_EVENTS), true);
  t('райони збереглися', reloaded.DISTRICT_IDS.length, 6);

  // Apostrophes and non-Latin text must survive the round trip untouched.
  const tricky = INITIAL_PLACES.find((p) => p.name.includes('ʼ') || p.name.includes("'"));
  if (tricky) {
    const back = reloaded.INITIAL_PLACES.find((p: any) => p.id === tricky.id);
    t('назви з апострофом не ламаються', back.name, tricky.name);
  }

  // An unchecked amenity must stay absent, not become false.
  const unchecked = INITIAL_PLACES.find((p) => p.terrace === undefined);
  if (unchecked) {
    const back = reloaded.INITIAL_PLACES.find((p: any) => p.id === unchecked.id);
    t('неперевірене поле лишається відсутнім', 'terrace' in back, false);
  }

  console.log(failed === 0 ? '\nAll export cases pass.' : `\n${failed} failing case(s).`);
}

main();
