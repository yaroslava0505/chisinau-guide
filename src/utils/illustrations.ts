import type { Place, PlaceCategoryId } from '../types';

/**
 * Thematic illustrations.
 *
 * The catalogue holds no photographs of the venues themselves. Rather than
 * leaving every card blank, the interface shows a stock image that matches the
 * *kind* of place — always labelled as illustrative, so it is never mistaken
 * for a picture of that particular venue. A real photo, once added to
 * `place.photos`, replaces the illustration.
 *
 * Selection is deterministic (hashed from the slug) so a place keeps the same
 * image between visits and never flickers between renders.
 */

const U = (id: string) =>
  `https://images.unsplash.com/photo-${id}?q=80&w=1000&auto=format&fit=crop`;

/** Pools keyed by the most specific thing known about a place. */
const BY_SUBTYPE: Record<string, string[]> = {
  // food — cuisine
  pizza: [U('1513104890138-7c749659a591'), U('1565299624946-b28f40a0ae38')],
  burgers: [U('1568901346375-23c9450c58cd'), U('1571091718767-18b5b1457add')],
  sushi: [U('1579871494447-9811cf80d66c'), U('1553621042-f6e147245754')],
  italian: [U('1555396273-367ea4eb4db5'), U('1481931098730-318b6f776db0')],
  meat: [U('1546964124-0cce460f38ef'), U('1558030006-450675393462')],
  moldovan: [U('1555939594-58d7cb561ad1'), U('1476224203421-9ac39bcb3327')],
  vegetarian: [U('1512621776951-a57141f2eefd'), U('1540420773420-3366772f4999')],
  bakery: [U('1509440159596-0249088772ff'), U('1608198093002-ad4e005484ec')],
  desserts: [U('1488477181946-6428a0291777'), U('1551024506-0bccd828d307')],
  street_food: [U('1601050690597-df0568f70950'), U('1550547660-d9450f859349')],
  healthy: [U('1540189549336-e6e99c3679fe'), U('1512621776951-a57141f2eefd')],

  // activities — type
  museum: [U('1554907984-15263bfd63bd'), U('1770910195254-d0f97308c30f')],
  exhibition: [U('1518998053901-5348d3961a04'), U('1531058020387-3be344556be6')],
  cinema: [U('1489599849927-2ee91cede3ba'), U('1517604931442-7e0c8ed2963c')],
  theatre: [U('1503095396549-807759245b35'), U('1507924538820-ede94a04019d')],
  concert: [U('1465847899084-d164df4dedc6'), U('1493225457124-a3eb161ffa5f')],
  workshop: [U('1522202176988-66273c2fd55f'), U('1544928147-79a2dbc1f389')],
  sport: [U('1534438327276-14e5300c3a48'), U('1571019613454-1cb2f99b2d8b')],
  creative: [U('1513364776144-60967b0f800f'), U('1753164725860-ffcd260b7b32')],
  wellness: [U('1544161515-4ab6ce6db874'), U('1540555700478-4be289fbecef')],
  entertainment: [U('1596464716127-f2a82984de30'), U('1503919545889-aef636e10ad4')],

  // walks — type
  park: [U('1519331379826-f10be5486c6f'), U('1441974231531-c6227db76b6e'), U('1742827620052-af00b20fab71')],
  square: [U('1519331379826-f10be5486c6f'), U('1441974231531-c6227db76b6e')],
  route: [U('1572170490453-fdf4bc1f4679'), U('1672430172282-fd2167ba8067')],
  nature: [U('1448375240586-882707db888b'), U('1476231682828-37e571bc172f'), U('1742931568565-aca88c43ada7')],
  scenic: [U('1470252649378-9c29740c9fa8'), U('1731857796983-4e392cd86726')],
  sunset: [U('1495616811223-4d98c6e9c869'), U('1472120435266-53107fd0c44a')],
  photo: [U('1553592742-def0a198f084'), U('1766126535244-b75a7b8d511d')],

  // quiet places — venue type
  library: [
    U('1521587760476-6c12a4b040da'), U('1507842217343-583bb7270b66'),
    U('1760166699654-5d0e10f51994'), U('1754697831323-6d51e460ba8f'),
  ],

  // remote work / cafes — venue type
  coworking: [U('1497215728101-856f4ea42174'), U('1527192491265-7e15c55b1ed2'), U('1758691737060-3814f16d5aba')],
  cafe: [
    U('1554118811-1e0d58224f24'), U('1501339847302-ac426a4a7cbb'),
    U('1749733600739-23f17b79f788'), U('1753873555674-1d6698c7537b'),
    U('1762754105061-8082763619e6'), U('1746933117276-a5520d0f6aae'),
  ],
  bistro: [U('1555396273-367ea4eb4db5'), U('1414235077428-338989a2e8c0')],
  restaurant: [U('1517248135467-4c7edcad34c4'), U('1552566626-52f8b828add9')],
  culture: [U('1518998053901-5348d3961a04'), U('1507924538820-ede94a04019d')],
};

/** Fallback pools when nothing more specific is known. */
const BY_CATEGORY: Record<PlaceCategoryId, string[]> = {
  remote_work: [U('1497215728101-856f4ea42174'), U('1442512595331-e89e73853f31')],
  quiet_places: [U('1521587760476-6c12a4b040da'), U('1448375240586-882707db888b')],
  cafes: [U('1554118811-1e0d58224f24'), U('1442512595331-e89e73853f31')],
  food: [U('1517248135467-4c7edcad34c4'), U('1555939594-58d7cb561ad1')],
  walks: [U('1519331379826-f10be5486c6f'), U('1441974231531-c6227db76b6e')],
  activities: [U('1518998053901-5348d3961a04'), U('1507924538820-ede94a04019d')],
};

/** Small stable hash so a place always gets the same image from its pool. */
function hash(value: string): number {
  let h = 0;
  for (let i = 0; i < value.length; i += 1) {
    h = (h * 31 + value.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

/**
 * The illustration for a place, or null when it has a real photograph and
 * needs none.
 */
export function getIllustration(place: Place): string | null {
  if (place.photos.length > 0) return null;

  const key = place.cuisine ?? place.activity_type ?? place.walk_type ?? place.venue_type;
  const pool = (key && BY_SUBTYPE[key]) || BY_CATEGORY[place.category];
  return pool[hash(place.slug) % pool.length];
}

/**
 * The image actually shown for a place — its own photo if it has one,
 * otherwise the same illustration `PlacePhoto` renders. Used for SEO (meta
 * tags, JSON-LD `image`) so a shared link's preview matches the page itself
 * instead of falling back to the site-wide default image.
 */
export function getPlaceImage(place: Place): string {
  return place.photos[0] ?? getIllustration(place) ?? '';
}
