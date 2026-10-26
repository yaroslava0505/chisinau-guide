import type { Article } from '../types';

/**
 * Editorial guide pieces. Each one links out to real catalogue entries via
 * `placeSlugs` — the prose itself stays general (what the category is like,
 * how to choose) rather than asserting specifics about any one place, since
 * those specifics belong on the place record and may not be confirmed there.
 */
export const INITIAL_ARTICLES: Article[] = [
  {
    id: 'article-1',
    slug: 'best-cafes-chisinau',
    title: 'Де випити каву в Кишиневі: кавʼярні для неспішної розмови',
    excerpt:
      'Спешелті, мус-десерти чи просто тиха кава зранку — короткий гід по кавʼярнях Кишинева, які варто знати.',
    body: [
      'Кишинів давно переріс стандартну розчинну каву в барі на розі. За останні кілька років у місті з’явилося достатньо спешелті-кавʼярень, щоб обирати не лише напій, а й атмосферу — від камерного закутка на кілька столиків до просторого залу, де можна засидітися на годину.',
      'Якщо для вас кава — це насамперед напій, а не привід побути за ноутбуком, шукайте місця з акцентом на фільтр-каву та альтернативні методи заварювання: V60, аеропрес, кемекс. Там зазвичай уважніше ставляться до зерна і готові розповісти, звідки воно.',
      'Для зустрічі чи неспішної розмови краще підійдуть кавʼярні з окремим затишним залом — десертні заклади з авторською випічкою або невеликі кавʼярні в історичному центрі, де мало людей і немає поспіху.',
      'Нижче — кілька перевірених варіантів із каталогу. Повний список із адресами, графіком роботи та фільтрами за районом — на сторінці категорії «Кафе».',
    ],
    category: 'cafes',
    placeSlugs: [
      'coffee-molka-chisinau',
      'kive-cafe-columna',
      'poetry-coffeeshop-julius-meinl',
      'tucano-coffee-kenya',
    ],
    publishedAt: '2026-10-22',
    i18n: {
      ru: {
        title: 'Где выпить кофе в Кишинёве: кофейни для неспешного разговора',
        excerpt:
          'Спешелти, мусс-десерты или просто тихий кофе с утра — короткий гид по кофейням Кишинёва, которые стоит знать.',
        body: [
          'Кишинёв давно перерос стандартный растворимый кофе в баре на углу. За последние несколько лет в городе появилось достаточно спешелти-кофеен, чтобы выбирать не только напиток, но и атмосферу — от камерного уголка на несколько столиков до просторного зала, где можно задержаться на час.',
          'Если для вас кофе — это прежде всего напиток, а не повод посидеть с ноутбуком, ищите места с акцентом на фильтр-кофе и альтернативные методы заваривания: V60, аэропресс, кемекс. Там обычно внимательнее относятся к зерну и готовы рассказать, откуда оно.',
          'Для встречи или неспешного разговора лучше подойдут кофейни с отдельным уютным залом — десертные заведения с авторской выпечкой или небольшие кофейни в историческом центре, где мало людей и нет спешки.',
          'Ниже — несколько проверенных вариантов из каталога. Полный список с адресами, графиком работы и фильтрами по району — на странице категории «Кафе».',
        ],
      },
      ro: {
        title: 'Unde bei o cafea bună în Chișinău',
        excerpt:
          'Specialty, deserturi mousse sau pur și simplu o cafea liniștită dimineața — un ghid scurt al cafenelelor din Chișinău pe care merită să le cunoști.',
        body: [
          'Chișinăul a depășit de mult cafeaua solubilă de la barul din colț. În ultimii ani au apărut suficiente cafenele specialty încât să poți alege nu doar băutura, ci și atmosfera — de la un colțișor intim cu câteva mese până la o sală spațioasă unde poți rămâne o oră întreagă.',
          'Dacă pentru tine cafeaua e în primul rând o băutură, nu un pretext să stai cu laptopul, caută locuri axate pe filtru și metode alternative de preparare: V60, aeropress, chemex. Acolo, de regulă, se acordă mai multă atenție boabelor și știu să-ți spună de unde vin.',
          'Pentru o întâlnire sau o conversație fără grabă sunt mai potrivite cafenelele cu o sală proprie, liniștită — locuri cu deserturi de casă sau cafenele mici din centrul istoric, cu puțini oameni și fără agitație.',
          'Mai jos găsești câteva variante verificate din catalog. Lista completă, cu adrese, program și filtre pe sector — pe pagina categoriei „Cafenele”.',
        ],
      },
    },
  },
  {
    id: 'article-2',
    slug: 'remote-work-chisinau',
    title: 'Де попрацювати з ноутбуком у Кишиневі',
    excerpt:
      'Коворкінги з окремими місцями і кавʼярні, де не поженуть через дві години з ноутбуком, — підбірка для фрилансерів і віддаленої роботи.',
    body: [
      'Працювати з ноутбуком у Кишиневі можна по-різному: орендувати місце в коворкінгу на день чи на місяць, або просто знайти кавʼярню, де вас не поженуть, щойно спорожніє чашка.',
      'Коворкінги — надійніший варіант для довгого робочого дня: стабільний Wi-Fi, розетки на кожному столі, переговорні кімнати для дзвінків. У Кишиневі їх кілька — від великих ІТ-хабів біля університетів до невеликих просторів на кілька столів.',
      'Якщо формат коворкінгу не потрібен, шукайте кавʼярні, які самі себе позиціонують як місце для роботи — зазвичай це видно з того, що вони відкриваються рано і не обмежують, скільки часу можна провести за одним столиком.',
      'Нижче — кілька перевірених адрес. Повний список із фільтром за типом (коворкінг чи кавʼярня) — у категорії «Віддалена робота».',
    ],
    category: 'remote_work',
    placeSlugs: [
      'tekwill-studentilor',
      'ihub-31-august',
      'naringi-banulescu-bodoni',
      'totem-coworking-decebal',
    ],
    publishedAt: '2026-10-22',
    i18n: {
      ru: {
        title: 'Где поработать с ноутбуком в Кишинёве',
        excerpt:
          'Коворкинги с отдельными местами и кофейни, где не попросят на выход через два часа с ноутбуком, — подборка для фрилансеров и удалённой работы.',
        body: [
          'Работать с ноутбуком в Кишинёве можно по-разному: снять место в коворкинге на день или на месяц, или просто найти кофейню, где вас не поторопят, как только опустеет чашка.',
          'Коворкинги — более надёжный вариант для долгого рабочего дня: стабильный Wi-Fi, розетки на каждом столе, переговорные для звонков. В Кишинёве их несколько — от крупных IT-хабов рядом с университетами до небольших пространств на пару столов.',
          'Если формат коворкинга не нужен, ищите кофейни, которые сами позиционируют себя как место для работы — обычно это видно по тому, что они открываются рано и не ограничивают, сколько времени можно провести за одним столиком.',
          'Ниже — несколько проверенных адресов. Полный список с фильтром по типу (коворкинг или кофейня) — в категории «Удалённая работа».',
        ],
      },
      ro: {
        title: 'Unde poți lucra cu laptopul în Chișinău',
        excerpt:
          'Spații de coworking cu locuri proprii și cafenele unde nu te grăbește nimeni după două ore cu laptopul — o selecție pentru freelanceri și muncă la distanță.',
        body: [
          'Poți lucra cu laptopul în Chișinău în mai multe feluri: închiriezi un loc într-un spațiu de coworking pentru o zi sau o lună, sau pur și simplu găsești o cafenea unde nu te grăbește nimeni imediat ce ți se golește ceașca.',
          'Spațiile de coworking sunt o variantă mai sigură pentru o zi de lucru lungă: Wi-Fi stabil, prize la fiecare masă, săli pentru apeluri. În Chișinău sunt câteva — de la hub-uri IT mari, lângă universități, până la spații mici, cu câteva mese.',
          'Dacă nu ai nevoie de formatul de coworking, caută cafenele care se poziționează ele însele ca loc de lucru — de obicei se vede din faptul că se deschid devreme și nu limitează cât timp poți sta la o masă.',
          'Mai jos — câteva adrese verificate. Lista completă, cu filtru după tip (coworking sau cafenea) — în categoria „Muncă la distanță”.',
        ],
      },
    },
  },
  {
    id: 'article-3',
    slug: 'walking-routes-chisinau',
    title: 'Найкращі маршрути для прогулянок Кишиневом',
    excerpt:
      'Від набережної Валя Морілор до вуличних музикантів на Євгена Доги — куди піти пішки, якщо хочеться просто побути в місті.',
    body: [
      'Кишинів — зелене місто: великих парків тут більше, ніж здається на перший погляд, а в центрі можна скласти цілий маршрут, не виходячи за межі кількох кварталів.',
      'Для довгої прогулянки чи пробіжки найкраще підходять великі парки з власною інфраструктурою — доріжками, набережною, лавками в тіні. Для короткої вечірньої прогулянки — пішохідні вулиці й сквери в центрі, де завжди людно і є де присісти.',
      'Якщо хочеться поєднати прогулянку з кавою чи вечерею, варто обирати маршрути через центр — там прогулянкові вулиці межують із кавʼярнями та ресторанами просто по дорозі.',
      'Нижче — кілька місць, з яких можна почати. Повний список маршрутів, парків і скверів — у категорії «Прогулянки».',
    ],
    category: 'walks',
    placeSlugs: [
      'parcul-valea-morilor-chisinau',
      'gradina-publica-stefan-cel-mare',
      'valea-trandafirilor-chisinau',
      'strada-eugen-doga-chisinau',
    ],
    publishedAt: '2026-10-22',
    i18n: {
      ru: {
        title: 'Лучшие маршруты для прогулок по Кишинёву',
        excerpt:
          'От набережной Вале Морилор до уличных музыкантов на Еуджен Дога — куда пойти пешком, если хочется просто побыть в городе.',
        body: [
          'Кишинёв — зелёный город: больших парков здесь больше, чем кажется на первый взгляд, а в центре можно составить целый маршрут, не выходя за пределы нескольких кварталов.',
          'Для долгой прогулки или пробежки лучше всего подходят крупные парки с собственной инфраструктурой — дорожками, набережной, скамейками в тени. Для короткой вечерней прогулки — пешеходные улицы и скверы в центре, где всегда людно и есть где присесть.',
          'Если хочется совместить прогулку с кофе или ужином, стоит выбирать маршруты через центр — там прогулочные улицы соседствуют с кофейнями и ресторанами прямо по пути.',
          'Ниже — несколько мест, с которых можно начать. Полный список маршрутов, парков и скверов — в категории «Прогулки».',
        ],
      },
      ro: {
        title: 'Cele mai bune trasee de plimbare prin Chișinău',
        excerpt:
          'De la faleza Valea Morilor până la muzicanții stradali de pe strada Eugen Doga — unde mergi pe jos când vrei doar să fii prin oraș.',
        body: [
          'Chișinăul e un oraș verde: are mai multe parcuri mari decât pare la prima vedere, iar în centru poți face un traseu întreg fără să ieși din câteva cartiere.',
          'Pentru o plimbare lungă sau alergare, cele mai potrivite sunt parcurile mari, cu infrastructură proprie — alei, faleză, bănci la umbră. Pentru o plimbare scurtă de seară — străzile pietonale și scuarurile din centru, unde e mereu lume și ai unde să te așezi.',
          'Dacă vrei să combini plimbarea cu o cafea sau o cină, alege trasee prin centru — acolo străzile pietonale se învecinează cu cafenele și restaurante chiar pe drum.',
          'Mai jos — câteva locuri de unde poți începe. Lista completă de trasee, parcuri și scuaruri — în categoria „Plimbări”.',
        ],
      },
    },
  },
  {
    id: 'article-4',
    slug: 'shopping-centers-chisinau',
    title: 'Торгові центри Кишинева: куди йти за покупками й не тільки',
    excerpt:
      'Великий мол на пів дня, універмаг у центрі чи сусідній ТЦ із кінотеатром — як обрати торговий центр у Кишиневі під свою задачу.',
    body: [
      'Торговий центр у Кишиневі — це рідко лише магазини. Майже в кожному великому ТЦ під одним дахом є продуктовий супермаркет, фудкорт, зона розваг для дітей, іноді кінотеатр — тому сюди їдуть не тільки за покупками, а й щоб перечекати дощ, пообідати або зайняти дітей на пару годин.',
      'Якщо потрібен один заїзд «за всім одразу», орієнтуйтеся на великі моли на околицях і вздовж основних магістралей: там більше площі, безкоштовний паркінг і повний набір якірних орендарів. Якщо ж ви в центрі й маєте пів години між справами, зручніші невеликі центри та історичні універмаги на бульварі Штефан чел Маре — туди можна зайти пішки й не загубитися в коридорах.',
      'З дітьми варто дивитися не на кількість магазинів, а на те, чи є в центрі ігрова зона й кінотеатр: у таких ТЦ прогулянка легко перетворюється на повноцінний сімейний вихід, а на фудкорті завжди знайдеться щось просте. У будні після обіду людей значно менше, ніж у вихідні ввечері — якщо не любите черги, це найкращий час.',
      'Нижче — кілька центрів із каталогу. Повний список із адресами, графіком роботи та фільтрами за районом — у категорії «Торгові центри».',
    ],
    category: 'shopping_centers',
    placeSlugs: [
      'malldova-shopping-center',
      'port-mall-chisinau',
      'atrium-albisoara-chisinau',
      'unic-stefan-cel-mare-chisinau',
      'sun-city-pushkin-chisinau',
    ],
    publishedAt: '2026-10-26',
    i18n: {
      ru: {
        title: 'Торговые центры Кишинёва: куда идти за покупками и не только',
        excerpt:
          'Большой молл на полдня, универмаг в центре или соседний ТЦ с кинотеатром — как выбрать торговый центр в Кишинёве под свою задачу.',
        body: [
          'Торговый центр в Кишинёве — это редко только магазины. Почти в каждом крупном ТЦ под одной крышей есть продуктовый супермаркет, фудкорт, зона развлечений для детей, иногда кинотеатр — поэтому сюда едут не только за покупками, но и чтобы переждать дождь, пообедать или занять детей на пару часов.',
          'Если нужен один заезд «за всем сразу», ориентируйтесь на большие моллы на окраинах и вдоль основных магистралей: там больше площади, бесплатная парковка и полный набор якорных арендаторов. Если же вы в центре и у вас полчаса между делами, удобнее небольшие центры и исторические универмаги на бульваре Штефан чел Маре — туда можно зайти пешком и не потеряться в коридорах.',
          'С детьми стоит смотреть не на количество магазинов, а на то, есть ли в центре игровая зона и кинотеатр: в таких ТЦ прогулка легко превращается в полноценный семейный выход, а на фудкорте всегда найдётся что-то простое. В будни после обеда людей значительно меньше, чем в выходные вечером — если не любите очереди, это лучшее время.',
          'Ниже — несколько центров из каталога. Полный список с адресами, графиком работы и фильтрами по району — в категории «Торговые центры».',
        ],
      },
      ro: {
        title: 'Centrele comerciale din Chișinău: unde mergi la cumpărături și nu numai',
        excerpt:
          'Un mall mare pentru o jumătate de zi, un magazin universal din centru sau un centru comercial de cartier cu cinema — cum alegi centrul comercial potrivit în Chișinău.',
        body: [
          'Un centru comercial în Chișinău înseamnă rar doar magazine. Aproape fiecare mall mare are, sub același acoperiș, un supermarket alimentar, un food court, o zonă de distracții pentru copii, uneori și un cinema — de aceea lumea vine aici nu doar la cumpărături, ci și ca să aștepte să treacă ploaia, să ia prânzul sau să ocupe copiii câteva ore.',
          'Dacă vrei o singură deplasare „pentru tot”, orientează-te spre mall-urile mari de la periferie și de-a lungul arterelor principale: au mai mult spațiu, parcare gratuită și setul complet de chiriași-ancoră. Dacă însă ești în centru și ai o jumătate de oră între două treburi, sunt mai comode centrele mici și magazinele universale istorice de pe bulevardul Ștefan cel Mare — ajungi pe jos și nu te pierzi pe coridoare.',
          'Cu copiii, nu te uita la numărul de magazine, ci dacă centrul are zonă de joacă și cinema: în astfel de mall-uri o plimbare devine ușor o ieșire de familie, iar la food court se găsește mereu ceva simplu. În zilele de lucru, după-amiaza, e mult mai puțină lume decât în weekend seara — dacă nu îți plac cozile, acela e cel mai bun moment.',
          'Mai jos — câteva centre din catalog. Lista completă, cu adrese, program și filtre pe sector — în categoria „Centre comerciale”.',
        ],
      },
    },
  },
];
