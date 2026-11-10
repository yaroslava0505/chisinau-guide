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
  {
    id: 'article-5',
    slug: 'rammstein-symphonic-experience-chisinau',
    title: 'Rammstein Symphonic Experience у Кишиневі: що це за концерт',
    excerpt:
      'Не сам гурт, а оркестрова інтерпретація його хітів на сцені Національної опери — що варто знати перед тим, як купувати квиток.',
    body: [
      '28 листопада Національний театр опери та балету «Maria Bieșu» приймає «Rammstein Symphonic Experience» — варто одразу прояснити: це не концерт самого гурту Rammstein, а симфонічна трибʼют-програма. На сцені — оркестр із близько двох десятків музикантів, який переосмислює найвідоміші пісні гурту без участі Тілля Ліндеманна чи інших оригінальних учасників.',
      'Шоу вже проїхало десятки міст Європи — від Парижа до Таллінна, і скрізь працює за однією формулою: близько 75 хвилин без антракту, кінематографічне світло й візуальний ряд, важкі гітарні рифи, перекладені на мову струнних і духових. Для тих, хто любить Rammstein за атмосферу й драматургію, а не лише за звучання оригіналу, — це своя, окрема форма враження.',
      'Квитки коштують 900–1300 лей залежно від місця в залі, початок о 19:00. Зала — та сама, де зазвичай ставлять оперу й балет, тож формат ближчий до вечірнього виходу, ніж до звичного клубного концерту.',
      'Перед виставою зручно перекусити чи випити кави просто на бульварі Штефан чел Маре — поруч із театром є кілька перевірених варіантів. Повна афіша інших подій у Кишиневі на найближчі тижні — на сторінці «Події».',
    ],
    category: 'activities',
    placeSlugs: ['la-mamuca-stefan-cel-mare', 'bouchee-stefan-cel-mare', 'poetry-coffeeshop-julius-meinl'],
    eventSlug: 'rammstein-symphonic-experience-2026',
    publishedAt: '2026-10-26',
    i18n: {
      ru: {
        title: 'Rammstein Symphonic Experience в Кишинёве: что это за концерт',
        excerpt:
          'Не сама группа, а оркестровая интерпретация её хитов на сцене Национальной оперы — что стоит знать перед покупкой билета.',
        body: [
          '28 ноября Национальный театр оперы и балета «Maria Bieșu» принимает «Rammstein Symphonic Experience» — сразу стоит прояснить: это не концерт самой группы Rammstein, а симфоническая трибьют-программа. На сцене — оркестр примерно из двух десятков музыкантов, который переосмысляет самые известные песни группы без участия Тилля Линдеманна или других оригинальных участников.',
          'Шоу уже проехало десятки городов Европы — от Парижа до Таллина, и везде работает по одной формуле: около 75 минут без антракта, кинематографичный свет и визуальный ряд, тяжёлые гитарные риффы, переложенные на язык струнных и духовых. Для тех, кто любит Rammstein за атмосферу и драматургию, а не только за звучание оригинала, — это своя, отдельная форма впечатления.',
          'Билеты стоят 900–1300 лей в зависимости от места в зале, начало в 19:00. Зал — тот же, где обычно ставят оперу и балет, поэтому формат ближе к вечернему выходу, чем к привычному клубному концерту.',
          'Перед спектаклем удобно перекусить или выпить кофе прямо на бульваре Штефан чел Маре — рядом с театром есть несколько проверенных вариантов. Полная афиша других событий в Кишинёве на ближайшие недели — на странице «События».',
        ],
      },
      ro: {
        title: 'Rammstein Symphonic Experience la Chișinău: ce fel de concert este',
        excerpt:
          'Nu trupa însăși, ci o interpretare simfonică a hiturilor ei pe scena Operei Naționale — ce merită să știi înainte să cumperi un bilet.',
        body: [
          'Pe 28 noiembrie, Teatrul Național de Operă și Balet „Maria Bieșu” găzduiește „Rammstein Symphonic Experience” — trebuie clarificat de la bun început: nu este un concert al trupei Rammstein, ci un program simfonic de tip tribute. Pe scenă urcă o orchestră de aproximativ două zeci de muzicieni, care reinterpretează cele mai cunoscute piese ale trupei, fără participarea lui Till Lindemann sau a celorlalți membri originali.',
          'Spectacolul a trecut deja prin zeci de orașe din Europa — de la Paris la Tallinn — și funcționează peste tot după aceeași formulă: aproximativ 75 de minute fără pauză, lumini și imagini de nivel cinematografic, riff-uri grele de chitară transpuse pentru instrumente de coarde și suflat. Pentru cei care iubesc Rammstein pentru atmosferă și dramaturgie, nu doar pentru sunetul original, este o experiență aparte.',
          'Biletele costă 900–1300 lei, în funcție de loc, iar spectacolul începe la ora 19:00. Sala e aceeași în care se joacă de obicei operă și balet, așa că formatul e mai aproape de o ieșire de seară decât de un concert obișnuit de club.',
          'Înainte de spectacol, e comod să iei o gustare sau o cafea chiar pe bulevardul Ștefan cel Mare — lângă teatru sunt câteva variante verificate. Afișul complet al celorlalte evenimente din Chișinău pentru săptămânile următoare — pe pagina „Evenimente”.',
        ],
      },
    },
  },
  {
    id: 'article-6',
    slug: 'sviatoslav-vakarchuk-chisinau-2026',
    title: 'Святослав Вакарчук у Кишиневі 15 грудня: сольний концерт у Палаці Націонал',
    excerpt:
      'Лідер «Океану Ельзи» привозить камерну програму — лише голос, гітара й фортепіано. Дата, ціни, де купити квитки і де повечеряти поруч.',
    body: [
      '15 грудня 2026 року Святослав Вакарчук виступить у Кишиневі із сольним концертом у Палаці Націонал «Ніколае Сулак» (вул. Пушкіна, 21). Початок о 19:00. Це не концерт гурту «Океан Ельзи» в повному складі, а камерна програма: на сцені — сам Вакарчук, голос, гітара та фортепіано.',
      'У програмі — відомі пісні «Океану Ельзи», твори з сольних проєктів і нові композиції. Організатори анонсують вечір як розмову з залом без великого продакшену, де головне — пісні та їхні історії. Концерт проходить за підтримки Посольства України в Республіці Молдова.',
      'Квитки коштують від 750 до 2050 лей залежно від сектора й продаються на livetickets.md. Для українців Кишинева це, ймовірно, найбільша українська музична подія зими.',
      'Палац Націонал стоїть у самому центрі, за два квартали від бульвару Штефан чел Маре. Повечеряти перед концертом можна на тій самій вулиці Пушкіна: Fuior Gourmet — винний ресторан з молдовською авторською кухнею за адресою Пушкіна, 30, або Torro Burgers на Пушкіна, 12, якщо хочеться швидко й без церемоній. Після концерту кавʼярні вже зачинені, а от ресторани в центрі працюють до 23:00.',
      'Інші концерти й вистави в Кишиневі на грудень — у розділі «Події»: там же 17 грудня в тому ж залі — різдвяна програма Паули Селінг, а 13 грудня на площі Великих національних зборів — святковий забіг на 3 км.',
    ],
    category: 'activities',
    placeSlugs: ['fuior-gourmet-chisinau', 'torro-burgers-puskin', 'bellucci-cafe-kogalniceanu'],
    eventSlug: 'sviatoslav-vakarchuk-chisinau-2026',
    image: '/images/articles/sviatoslav-vakarchuk-2023.jpg',
    imageCredit: {
      author: 'Посольство США в Україні',
      license: 'суспільне надбання',
      url: 'https://commons.wikimedia.org/wiki/File:Ambassador_Bridget_Brink_attended_a_concert_of_one_of_her_favorite_musicians_%E2%80%94_Svyatoslav_Vakarchuk,_the_legendary_Ukrainian_singer_and_lead_of_Okean_Elzy_band,_Dec._9,_2023_-_2.jpg',
    },
    publishedAt: '2026-11-01',
    i18n: {
      ru: {
        title: 'Святослав Вакарчук в Кишинёве 15 декабря: сольный концерт в Национальном дворце',
        excerpt:
          'Лидер «Океана Ельзи» привозит камерную программу — только голос, гитара и фортепиано. Дата, цены, где купить билеты и где поужинать рядом.',
        body: [
          '15 декабря 2026 года Святослав Вакарчук выступит в Кишинёве с сольным концертом в Национальном дворце «Николае Сулак» (ул. Пушкина, 21). Начало в 19:00. Это не концерт группы «Океан Ельзи» в полном составе, а камерная программа: на сцене — сам Вакарчук, голос, гитара и фортепиано.',
          'В программе — известные песни «Океана Ельзи», произведения из сольных проектов и новые композиции. Организаторы анонсируют вечер как разговор с залом без большого продакшена, где главное — песни и их истории. Концерт проходит при поддержке Посольства Украины в Республике Молдова.',
          'Билеты стоят от 750 до 2050 леев в зависимости от сектора и продаются на livetickets.md. Для украинцев Кишинёва это, вероятно, самое крупное украинское музыкальное событие зимы.',
          'Национальный дворец стоит в самом центре, в двух кварталах от бульвара Штефан чел Маре. Поужинать перед концертом можно на той же улице Пушкина: Fuior Gourmet — винный ресторан с молдавской авторской кухней по адресу Пушкина, 30, или Torro Burgers на Пушкина, 12, если хочется быстро и без церемоний. После концерта кофейни уже закрыты, а рестораны в центре работают до 23:00.',
          'Другие концерты и спектакли в Кишинёве на декабрь — в разделе «События»: там же 17 декабря в том же зале — рождественская программа Паулы Селинг, а 13 декабря на Площади Великого национального собрания — праздничный забег на 3 км.',
        ],
      },
      ro: {
        title: 'Sviatoslav Vakarciuk la Chișinău pe 15 decembrie: concert solo la Palatul Național',
        excerpt:
          'Liderul trupei Okean Elzy aduce un program de cameră — doar voce, chitară și pian. Data, prețurile, de unde iei bilete și unde cinezi în apropiere.',
        body: [
          'Pe 15 decembrie 2026, Sviatoslav Vakarciuk susține un concert solo la Palatul Național „Nicolae Sulac” din Chișinău (str. Pușkin 21). Începe la ora 19:00. Nu este un concert al trupei Okean Elzy în formulă completă, ci un program de cameră: pe scenă — Vakarciuk însuși, voce, chitară și pian.',
          'În program: piese cunoscute ale trupei Okean Elzy, lucrări din proiectele solo și compoziții noi. Organizatorii anunță seara ca pe un dialog cu sala, fără producție mare, în care contează piesele și poveștile lor. Concertul are loc cu sprijinul Ambasadei Ucrainei în Republica Moldova.',
          'Biletele costă între 750 și 2050 lei, în funcție de sector, și se vând pe livetickets.md. Pentru comunitatea ucraineană din Chișinău este, probabil, cel mai mare eveniment muzical ucrainean al iernii.',
          'Palatul Național e chiar în centru, la două cvartale de bulevardul Ștefan cel Mare. Înainte de concert poți cina pe aceeași stradă Pușkin: Fuior Gourmet — restaurant cu vinuri și bucătărie moldovenească de autor, la Pușkin 30, sau Torro Burgers la Pușkin 12, dacă vrei ceva rapid. După concert cafenelele sunt deja închise, dar restaurantele din centru lucrează până la 23:00.',
          'Alte concerte și spectacole din Chișinău pentru decembrie — în secțiunea „Evenimente”: tot acolo, pe 17 decembrie, în aceeași sală — programul de Crăciun al Paulei Seling, iar pe 13 decembrie, în Piața Marii Adunări Naționale — cursa festivă de 3 km.',
        ],
      },
    },
  },
  {
    id: 'article-7',
    slug: '3-sud-est-chisinau-2026',
    title: '3 Sud Est у Кишиневі 18 і 19 листопада: два концерти в Палаці Націонал',
    excerpt:
      'Румунський гурт, чиї хіти знають усі, хто ріс у 2000-х, дає два вечори поспіль. Ціни, час, квитки і що поруч.',
    body: [
      '3 Sud Est — один із найвідоміших румунських поп-гуртів, що виник наприкінці 1990-х. 18 і 19 листопада 2026 року гурт грає два концерти в Кишиневі — обидва в Палаці Націонал «Ніколае Сулак» на вул. Пушкіна, 21, початок о 19:00.',
      'Програма — головні хіти майже тридцятирічної карʼєри; організатори Sens Music і 1AM обіцяють повну живу програму без скорочень. Якщо перший вечір розкуплять, другий — така сама програма, тож можна спокійно обирати зручнішу дату.',
      'Квитки — від 300 до 830 лей залежно від сектора, у продажу на iticket.md.',
      'Палац Націонал — у двох кварталах від бульвару Штефан чел Маре, тож зручно дійти пішки з центру. Повечеряти до концерту можна на тій самій вулиці Пушкіна — від Torro Burgers (Пушкіна, 12) до винного Fuior Gourmet (Пушкіна, 30).',
      'Інші концерти в Кишиневі в листопаді — Alternosfera в Chișinău Arena 12 листопада, відкриття органного фестивалю «J.S. Bach» 12 листопада, Rammstein Symphonic Experience 28 листопада — у розділі «Події».',
    ],
    category: 'activities',
    placeSlugs: ['torro-burgers-puskin', 'fuior-gourmet-chisinau', 'bellucci-cafe-kogalniceanu'],
    eventSlug: '3-sud-est-chisinau-2026',
    image: '/images/articles/palatul-national-chisinau.jpg',
    imageCredit: {
      author: 'Tomasz Bladyniec',
      license: 'CC BY 4.0',
      url: 'https://commons.wikimedia.org/wiki/File:Palatul_Na%C8%9Bional,_Chi%C8%99in%C4%83u.jpg',
    },
    publishedAt: '2026-11-01',
    i18n: {
      ru: {
        title: '3 Sud Est в Кишинёве 18 и 19 ноября: два концерта в Национальном дворце',
        excerpt:
          'Румынская группа, чьи хиты знают все, кто рос в 2000-х, даёт два вечера подряд. Цены, время, билеты и что рядом.',
        body: [
          '3 Sud Est — одна из самых известных румынских поп-групп, возникшая в конце 1990-х. 18 и 19 ноября 2026 года группа играет два концерта в Кишинёве — оба в Национальном дворце «Николае Сулак» на ул. Пушкина, 21, начало в 19:00.',
          'Программа — главные хиты почти тридцатилетней карьеры; организаторы Sens Music и 1AM обещают полную живую программу без сокращений. Если первый вечер раскупят, второй — та же программа, так что можно спокойно выбирать более удобную дату.',
          'Билеты — от 300 до 830 леев в зависимости от сектора, в продаже на iticket.md.',
          'Национальный дворец — в двух кварталах от бульвара Штефан чел Маре, так что удобно дойти пешком из центра. Поужинать до концерта можно на той же улице Пушкина — от Torro Burgers (Пушкина, 12) до винного Fuior Gourmet (Пушкина, 30).',
          'Другие концерты в Кишинёве в ноябре — Alternosfera в Chișinău Arena 12 ноября, открытие органного фестиваля «J.S. Bach» 12 ноября, Rammstein Symphonic Experience 28 ноября — в разделе «События».',
        ],
      },
      ro: {
        title: '3 Sud Est la Chișinău pe 18 și 19 noiembrie: două concerte la Palatul Național',
        excerpt:
          'Trupa românească ale cărei hituri le știe oricine a crescut în anii 2000 cântă două seri la rând. Prețuri, ore, bilete și ce e în apropiere.',
        body: [
          '3 Sud Est este una dintre cele mai cunoscute trupe pop românești, apărută la sfârșitul anilor 1990. Pe 18 și 19 noiembrie 2026, trupa susține două concerte la Chișinău — ambele la Palatul Național „Nicolae Sulac”, str. Pușkin 21, de la ora 19:00.',
          'Programul cuprinde hiturile celor aproape trei decenii de carieră; organizatorii Sens Music și 1AM promit un program live complet. Dacă prima seară se epuizează, a doua are același program, așa că poți alege liniștit data mai convenabilă.',
          'Biletele costă între 300 și 830 lei, în funcție de sector, și se vând pe iticket.md.',
          'Palatul Național e la două cvartale de bulevardul Ștefan cel Mare, așa că ajungi comod pe jos din centru. Înainte de concert poți cina pe aceeași stradă Pușkin — de la Torro Burgers (Pușkin 12) la restaurantul cu vinuri Fuior Gourmet (Pușkin 30).',
          'Alte concerte din Chișinău în noiembrie — Alternosfera la Chișinău Arena pe 12 noiembrie, deschiderea Festivalului „J.S. Bach” la Sala cu Orgă pe 12 noiembrie, Rammstein Symphonic Experience pe 28 noiembrie — în secțiunea „Evenimente”.',
        ],
      },
    },
  },
  {
    id: 'article-8',
    slug: 'maratonul-de-craciun-chisinau-2026',
    title: 'Різдвяний забіг у Кишиневі 13 грудня: 3 км у центрі для всієї родини',
    excerpt:
      'Maratonul de Crăciun — не змагання, а святкова пробіжка від площі Великих національних зборів. Як зареєструватися, скільки коштує і що дають учасникам.',
    body: [
      '13 грудня 2026 року о 12:00 у центрі Кишинева стартує Maratonul de Crăciun by Moldcell — святковий забіг, який організатор Sporter проводить щороку перед Різдвом. Попри назву, це не марафон: дистанція — 3 км, темп вільний, результати не фіксують. Старт і фініш — на площі Великих національних зборів, навпроти Тріумфальної арки.',
      'Участь відкрита для всіх віків і рівнів підготовки: бігти, йти швидким кроком чи котити візочок — на вибір. Діти до 14 років беруть участь лише в супроводі батьків.',
      'Реєстрація на sporter.md. Стартовий пакет коштує 200 лей за одного учасника, 350 лей за двох і 500 лей за трьох — тобто сімейна реєстрація помітно вигідніша. У пакет входять стартовий номер, святкова шапка та «їстівна медаль» на фініші.',
      'Після забігу центр уже живе в передсвятковому режимі. Зігрітися можна в кавʼярнях за кілька хвилин ходи: Coffee Molka на вул. 31 Серпня 1989, 78/3 — кавʼярня-музей зі сніданками, або La Plăcinte на Дософтей, 100, де є дитяча ігрова зона — зручно, якщо бігли з малечею.',
      'Дату відкриття різдвяного ярмарку на площі мерія зазвичай оголошує в середині листопада — щойно вона буде відома, вона зʼявиться в розділі «Події».',
    ],
    category: 'activities',
    placeSlugs: ['coffee-molka-chisinau', 'la-placinte-chisinau', 'bouchee-stefan-cel-mare'],
    eventSlug: 'maratonul-de-craciun-2026',
    image: '/images/articles/arcul-de-triumf-chisinau.jpg',
    imageCredit: {
      author: 'ValentinVrz',
      license: 'CC BY-SA 4.0',
      url: 'https://commons.wikimedia.org/wiki/File:Arcul_de_triumf_(Chi%C8%99in%C4%83u).jpg',
    },
    publishedAt: '2026-11-01',
    i18n: {
      ru: {
        title: 'Рождественский забег в Кишинёве 13 декабря: 3 км в центре для всей семьи',
        excerpt:
          'Maratonul de Crăciun — не соревнование, а праздничная пробежка от Площади Великого национального собрания. Как зарегистрироваться, сколько стоит и что дают участникам.',
        body: [
          '13 декабря 2026 года в 12:00 в центре Кишинёва стартует Maratonul de Crăciun by Moldcell — праздничный забег, который организатор Sporter проводит каждый год перед Рождеством. Несмотря на название, это не марафон: дистанция — 3 км, темп свободный, результаты не фиксируются. Старт и финиш — на Площади Великого национального собрания, напротив Триумфальной арки.',
          'Участие открыто для всех возрастов и уровней подготовки: бежать, идти быстрым шагом или катить коляску — на выбор. Дети до 14 лет участвуют только в сопровождении родителей.',
          'Регистрация на sporter.md. Стартовый пакет стоит 200 леев за одного участника, 350 леев за двоих и 500 леев за троих — семейная регистрация заметно выгоднее. В пакет входят стартовый номер, праздничная шапка и «съедобная медаль» на финише.',
          'После забега центр уже живёт в предпраздничном режиме. Согреться можно в кофейнях в нескольких минутах ходьбы: Coffee Molka на ул. 31 Августа 1989, 78/3 — кофейня-музей с завтраками, или La Plăcinte на Дософтей, 100, где есть детская игровая зона — удобно, если бежали с малышами.',
          'Дату открытия рождественской ярмарки на площади мэрия обычно объявляет в середине ноября — как только она станет известна, она появится в разделе «События».',
        ],
      },
      ro: {
        title: 'Cursa de Crăciun din Chișinău pe 13 decembrie: 3 km în centru pentru toată familia',
        excerpt:
          'Maratonul de Crăciun nu e o competiție, ci o alergare festivă din Piața Marii Adunări Naționale. Cum te înscrii, cât costă și ce primesc participanții.',
        body: [
          'Pe 13 decembrie 2026, la ora 12:00, în centrul Chișinăului pornește Maratonul de Crăciun by Moldcell — cursa festivă pe care organizatorul Sporter o ține în fiecare an înainte de Crăciun. În ciuda numelui, nu e un maraton: distanța e de 3 km, ritmul e liber, iar rezultatele nu se cronometrează. Startul și sosirea — în Piața Marii Adunări Naționale, vizavi de Arcul de Triumf.',
          'Participarea e deschisă tuturor vârstelor și nivelurilor: alergi, mergi în pas rapid sau împingi căruciorul — cum vrei. Copiii sub 14 ani participă doar însoțiți de părinți.',
          'Înscrierile se fac pe sporter.md. Pachetul de start costă 200 lei pentru un participant, 350 lei pentru doi și 500 lei pentru trei — înscrierea în familie e vizibil mai avantajoasă. Pachetul include numărul de concurs, căciulița festivă și o „medalie comestibilă” la sosire.',
          'După cursă, centrul e deja în ritm de sărbătoare. Te poți încălzi în cafenelele aflate la câteva minute de mers: Coffee Molka pe str. 31 August 1989, 78/3 — cafenea-muzeu cu mic dejun, sau La Plăcinte de pe Dosoftei 100, unde există loc de joacă pentru copii — util dacă ai alergat cu cei mici.',
          'Data deschiderii Târgului de Crăciun din piață e anunțată de primărie de obicei la mijlocul lunii noiembrie — imediat ce va fi cunoscută, va apărea în secțiunea „Evenimente”.',
        ],
      },
    },
  },
  {
    id: 'article-9',
    slug: 'kudy-pity-chisinau-lystopad-2026',
    title: 'Куди піти в Кишиневі в листопаді 2026: концерти, премʼєри, фестивалі',
    excerpt:
      'Перевірена добірка подій місяця — від Uriah Heep і Alternosfera до органного фестивалю Баха, трьох театральних премʼєр і документального кіно MOLDOX.',
    body: [
      'Листопад у Кишиневі — найщільніший концертний місяць осені. Нижче — лише події, які ми перевірили на сайтах організаторів і в касах; повний список із цінами й адресами — у розділі «Події», де кожну подію можна відкрити окремо.',
      'Концерти. 2 листопада Палац Націонал приймає прощальний тур Uriah Heep, 5 листопада там же — ювілейний вечір формації «Noroc» до 60-річчя. 12 листопада Alternosfera в Chișinău Arena святкує 20 років альбому «Orașul 511», а того ж вечора в Органній залі молодий німецький органіст Ян Ліберман відкриває XV фестиваль «J.S. Bach» (150–400 лей; фестиваль триває до 26 листопада). 18 і 19 листопада — два концерти 3 Sud Est у Палаці Націонал (300–830 лей). 19 листопада в Палаці Республіки — вечір української хорової музики капели «Doina» (100 лей). 28 листопада в Опері — Rammstein Symphonic Experience (900–1300 лей).',
      'Театр. Три премʼєри за один тиждень: 12 листопада в Студійній залі Національного театру ім. Емінеску — документальна вистава «Oameni care dispar» про Анну Політковську; 13 і 14 листопада в Satiricus — «Приборкання норовливої» Шекспіра в постановці Александру Греку (від 100 лей); 14 листопада в театрі Чехова — драма «Лошади за окном» (150 лей, 14+). В Опері — балет «Dracula» 8 листопада.',
      'З дітьми. 14 листопада о 13:00 — балет «Червона Шапочка» в Опері, 22 листопада о 17:00 там же — «Спляча красуня» Чайковського в недільний час (150–400 лей; дітей до 7 років в Оперу не пускають). У Національному музеї історії до 30 листопада триває виставка про міську археологію Кишинева, а поруч із нею відкрилася довга експозиція артефактів Кукутень–Трипілля (дорослі 50 лей, діти 10).',
      'Фестивалі й кіно. 21–22 листопада Chișinău Arena приймає танцювальний JDC Dance Weekend (від 370 лей), а 25–29 листопада в Cineplex Loteanu — XI фестиваль документального кіно MOLDOX із близько 50 фільмами, ретроспективою Аньєс Варда і дискусіями.',
      'Якщо плануєте вечір у центрі: майже всі перелічені зали — Палац Націонал, Органна зала, Опера, театри Емінеску та Satiricus — стоять уздовж бульвару Штефан чел Маре або за квартал від нього, тож повечеряти чи випити кави до вистави можна пішки. Картки залів із адресами й фото — нижче.',
    ],
    category: 'activities',
    placeSlugs: ['teatrul-opera-balet', 'sala-cu-orga', 'teatrul-national-mihai-eminescu', 'teatrul-satiricus', 'palatul-republicii', 'muzeul-national-de-istorie-chisinau'],
    eventSlug: 'bach-festival-liebermann-2026',
    image: '/images/articles/sala-cu-orga-chisinau.jpg',
    imageCredit: {
      author: 'Pelin Oleg',
      license: 'CC BY-SA 4.0',
      url: 'https://commons.wikimedia.org/wiki/File:Sala_cu_Org%C4%83_din_Chi%C8%99in%C4%83u_2.jpg',
    },
    publishedAt: '2026-11-01',
    i18n: {
      ru: {
        title: 'Куда пойти в Кишинёве в ноябре 2026: концерты, премьеры, фестивали',
        excerpt:
          'Проверенная подборка событий месяца — от Uriah Heep и Alternosfera до органного фестиваля Баха, трёх театральных премьер и документального кино MOLDOX.',
        body: [
          'Ноябрь в Кишинёве — самый плотный концертный месяц осени. Ниже — только события, которые мы проверили на сайтах организаторов и в кассах; полный список с ценами и адресами — в разделе «События», где каждое событие можно открыть отдельно.',
          'Концерты. 2 ноября Национальный дворец принимает прощальный тур Uriah Heep, 5 ноября там же — юбилейный вечер формации «Noroc» к 60-летию. 12 ноября Alternosfera в Chișinău Arena отмечает 20 лет альбома «Orașul 511», а в тот же вечер в Органном зале молодой немецкий органист Ян Либерманн открывает XV фестиваль «J.S. Bach» (150–400 леев; фестиваль длится до 26 ноября). 18 и 19 ноября — два концерта 3 Sud Est в Национальном дворце (300–830 леев). 19 ноября во Дворце Республики — вечер украинской хоровой музыки капеллы «Doina» (100 леев). 28 ноября в Опере — Rammstein Symphonic Experience (900–1300 леев).',
          'Театр. Три премьеры за одну неделю: 12 ноября в Студийном зале Национального театра им. Эминеску — документальный спектакль «Oameni care dispar» об Анне Политковской; 13 и 14 ноября в Satiricus — «Укрощение строптивой» Шекспира в постановке Александру Греку (от 100 леев); 14 ноября в театре Чехова — драма «Лошади за окном» (150 леев, 14+). В Опере — балет «Dracula» 8 ноября.',
          'С детьми. 14 ноября в 13:00 — балет «Красная Шапочка» в Опере, 22 ноября в 17:00 там же — «Спящая красавица» Чайковского в воскресное время (150–400 леев; детей до 7 лет в Оперу не пускают). В Национальном музее истории до 30 ноября идёт выставка о городской археологии Кишинёва, а рядом открылась долгая экспозиция артефактов Кукутень–Триполье (взрослые 50 леев, дети 10).',
          'Фестивали и кино. 21–22 ноября Chișinău Arena принимает танцевальный JDC Dance Weekend (от 370 леев), а 25–29 ноября в Cineplex Loteanu — XI фестиваль документального кино MOLDOX с примерно 50 фильмами, ретроспективой Аньес Варда и дискуссиями.',
          'Если планируете вечер в центре: почти все перечисленные залы — Национальный дворец, Органный зал, Опера, театры Эминеску и Satiricus — стоят вдоль бульвара Штефан чел Маре или в квартале от него, так что поужинать или выпить кофе до спектакля можно пешком. Карточки залов с адресами и фото — ниже.',
        ],
      },
      ro: {
        title: 'Unde mergi în Chișinău în noiembrie 2026: concerte, premiere, festivaluri',
        excerpt:
          'O selecție verificată a evenimentelor lunii — de la Uriah Heep și Alternosfera la festivalul de orgă Bach, trei premiere de teatru și documentarele MOLDOX.',
        body: [
          'Noiembrie este cea mai aglomerată lună de concerte a toamnei la Chișinău. Mai jos — doar evenimente pe care le-am verificat pe site-urile organizatorilor și la case; lista completă, cu prețuri și adrese, e în secțiunea „Evenimente”, unde fiecare eveniment are pagina lui.',
          'Concerte. Pe 2 noiembrie Palatul Național găzduiește turneul de adio Uriah Heep, pe 5 noiembrie tot acolo — seara aniversară a formației „Noroc”, la 60 de ani. Pe 12 noiembrie Alternosfera sărbătorește la Chișinău Arena 20 de ani ai albumului „Orașul 511”, iar în aceeași seară, la Sala cu Orgă, tânărul organist german Jan Liebermann deschide ediția a XV-a a Festivalului „J.S. Bach” (150–400 lei; festivalul ține până pe 26 noiembrie). Pe 18 și 19 noiembrie — două concerte 3 Sud Est la Palatul Național (300–830 lei). Pe 19 noiembrie la Palatul Republicii — seară de muzică corală ucraineană cu capela „Doina” (100 lei). Pe 28 noiembrie la Operă — Rammstein Symphonic Experience (900–1300 lei).',
          'Teatru. Trei premiere într-o singură săptămână: pe 12 noiembrie, în Sala Studio a Teatrului Național „Mihai Eminescu” — spectacolul documentar „Oameni care dispar” despre Anna Politkovskaia; pe 13 și 14 noiembrie la Satiricus — „Îmblânzirea scorpiei” de Shakespeare în regia lui Alexandru Grecu (de la 100 lei); pe 14 noiembrie la Teatrul Cehov — drama „Лошади за окном” (150 lei, 14+). La Operă — baletul „Dracula” pe 8 noiembrie.',
          'Cu copiii. Pe 14 noiembrie, ora 13:00 — baletul „Scufița Roșie” la Operă; pe 22 noiembrie, ora 17:00, tot acolo — „Frumoasa din Pădurea Adormită” de Ceaikovski, într-un orar de duminică (150–400 lei; copiii sub 7 ani nu au acces la Operă). La Muzeul Național de Istorie, până pe 30 noiembrie, continuă expoziția despre arheologia urbană a Chișinăului, iar alături s-a deschis o expoziție de lungă durată cu artefacte Cucuteni–Trypillia (adulți 50 lei, copii 10).',
          'Festivaluri și film. Pe 21–22 noiembrie Chișinău Arena găzduiește JDC Dance Weekend (de la 370 lei), iar pe 25–29 noiembrie, la Cineplex Loteanu — ediția a XI-a a festivalului de film documentar MOLDOX, cu circa 50 de filme, o retrospectivă Agnès Varda și dezbateri.',
          'Dacă plănuiești o seară în centru: aproape toate sălile enumerate — Palatul Național, Sala cu Orgă, Opera, teatrele Eminescu și Satiricus — sunt pe bulevardul Ștefan cel Mare sau la un cvartal de el, așa că poți cina sau bea o cafea înainte de spectacol mergând pe jos. Cardurile sălilor, cu adrese și fotografii — mai jos.',
        ],
      },
    },
  },
  {
    id: 'article-10',
    slug: 'where-to-eat-chisinau',
    title: 'Де поїсти в Кишиневі: від плацинд до стейка',
    excerpt:
      'Молдовська класика, грузинська кухня, суші, бургери й винні вечері — як орієнтуватися в ресторанах Кишинева і вибирати під нагоду, а не навмання.',
    body: [
      'Кишинів — місто, де поїсти недорого й смачно все ще легше, ніж у більшості європейських столиць. Основа — молдовська кухня: плацинди, зама, мамалига з брину, мʼясо на вуглинні. Але одним цим місто не обмежується: за останнє десятиліття тут міцно осіли грузинські ресторани, італійські траторії, суші-бари, бургерні та кебабні, а поряд із ними працюють пекарні й кондитерські, куди ходять просто за хлібом і десертом.',
      'Найпростіший спосіб не загубитися — обирати не «найкращий ресторан», а формат під нагоду. Якщо ви вперше в Молдові або приймаєте гостей, починати варто з традиційної кухні: там зрозуміле меню, великі порції й та сама їжа, яку тут готують удома. Для особливого вечора логічніше дивитися на заклади з власною винною картою — Молдова все-таки винна країна, і місцеве вино в ресторані зазвичай коштує стільки ж, скільки в магазині в Європі. Для щоденного обіду чи швидкої вечері працює третя категорія: бургери, піца, кебаб, боули — те, що готують за десять хвилин.',
      'Кілька практичних речей, які економлять час. У будні багато ресторанів у центрі пропонують бізнес-ланч — та сама кухня, але помітно дешевше, ніж вечірнє меню. У пʼятницю й суботу ввечері в популярні місця варто телефонувати заздалегідь: зал на 10–12 столиків заповнюється до вісімнадцятої. І ще — більшість закладів поза центром зачиняються раніше, ніж здається, тож пізню вечерю надійніше планувати на бульварі Штефан чел Маре або в кварталах поруч.',
      'З дітьми орієнтуйтеся не на кухню, а на простір: заклади з ігровою зоною й дитячим меню є і серед молдовських, і серед піцерій — у каталозі це видно по фільтрах. А якщо потрібно просто швидко перекусити між справами, зверніть увагу на пекарні: у Кишиневі це окрема й дуже конкурентна категорія, де свіжий ковриг або плацинда коштують дрібні гроші.',
      'Нижче — кілька закладів із каталогу, різних за форматом. Повний список із фільтрами за кухнею, районом, ціною та зручностями — у категорії «Їжа».',
    ],
    category: 'food',
    placeSlugs: [
      'la-placinte-chisinau',
      'vatra-veche-melestiu',
      'tiflis-studentilor',
      'fuior-gourmet-chisinau',
      'torro-burgers-puskin',
    ],
    publishedAt: '2026-11-02',
    i18n: {
      ru: {
        title: 'Где поесть в Кишинёве: от плацинд до стейка',
        excerpt:
          'Молдавская классика, грузинская кухня, суши, бургеры и винные ужины — как ориентироваться в ресторанах Кишинёва и выбирать под повод, а не наугад.',
        body: [
          'Кишинёв — город, где поесть недорого и вкусно всё ещё проще, чем в большинстве европейских столиц. Основа — молдавская кухня: плацинды, зама, мамалыга с брынзой, мясо на углях. Но одним этим город не ограничивается: за последнее десятилетие здесь прочно осели грузинские рестораны, итальянские траттории, суши-бары, бургерные и кебабные, а рядом с ними работают пекарни и кондитерские, куда ходят просто за хлебом и десертом.',
          'Самый простой способ не потеряться — выбирать не «лучший ресторан», а формат под повод. Если вы впервые в Молдове или принимаете гостей, начинать стоит с традиционной кухни: там понятное меню, большие порции и та самая еда, которую здесь готовят дома. Для особенного вечера логичнее смотреть на заведения с собственной винной картой — Молдова всё-таки винная страна, и местное вино в ресторане обычно стоит столько же, сколько в магазине в Европе. Для ежедневного обеда или быстрого ужина работает третья категория: бургеры, пицца, кебаб, боулы — то, что готовят за десять минут.',
          'Несколько практических вещей, которые экономят время. В будни многие рестораны в центре предлагают бизнес-ланч — та же кухня, но заметно дешевле вечернего меню. В пятницу и субботу вечером в популярные места стоит звонить заранее: зал на 10–12 столиков заполняется к шести. И ещё — большинство заведений вне центра закрываются раньше, чем кажется, поэтому поздний ужин надёжнее планировать на бульваре Штефан чел Маре или в кварталах рядом.',
          'С детьми ориентируйтесь не на кухню, а на пространство: заведения с игровой зоной и детским меню есть и среди молдавских, и среди пиццерий — в каталоге это видно по фильтрам. А если нужно просто быстро перекусить между делами, обратите внимание на пекарни: в Кишинёве это отдельная и очень конкурентная категория, где свежий ковриг или плацинда стоят копейки.',
          'Ниже — несколько заведений из каталога, разных по формату. Полный список с фильтрами по кухне, району, цене и удобствам — в категории «Еда».',
        ],
      },
      ro: {
        title: 'Unde mănânci în Chișinău: de la plăcinte la friptură',
        excerpt:
          'Clasici moldovenești, bucătărie georgiană, sushi, burgeri și cine cu vin — cum te orientezi printre restaurantele Chișinăului și alegi după ocazie, nu la întâmplare.',
        body: [
          'Chișinăul rămâne un oraș în care mănânci bine și ieftin mai ușor decât în majoritatea capitalelor europene. Baza e bucătăria moldovenească: plăcinte, zeamă, mămăligă cu brânză, carne la grătar. Dar orașul nu se oprește aici: în ultimul deceniu s-au așezat solid restaurante georgiene, trattorii italiene, baruri de sushi, burgerii și kebaberii, iar alături de ele funcționează brutării și cofetării unde lumea intră doar după pâine și desert.',
          'Cel mai simplu mod de a nu te pierde e să alegi nu „cel mai bun restaurant”, ci formatul potrivit ocaziei. Dacă ești pentru prima dată în Moldova sau ai oaspeți, începe cu bucătăria tradițională: meniu limpede, porții mari și exact mâncarea care se gătește aici în familie. Pentru o seară specială, uită-te mai bine la localurile cu carte de vinuri proprie — Moldova e totuși o țară a vinului, iar vinul local la restaurant costă de obicei cât într-un magazin din Europa. Pentru prânzul de zi cu zi sau o cină rapidă funcționează a treia categorie: burgeri, pizza, kebab, bowl-uri — lucruri gata în zece minute.',
          'Câteva detalii practice care economisesc timp. În zilele de lucru, multe restaurante din centru au business lunch — aceeași bucătărie, dar vizibil mai ieftin decât meniul de seară. Vineri și sâmbătă seara, la locurile populare merită să suni din timp: o sală de 10–12 mese se umple până la ora șase. Și încă ceva — majoritatea localurilor din afara centrului se închid mai devreme decât pare, așa că o cină târzie e mai sigur planificată pe bulevardul Ștefan cel Mare sau în cvartalele din apropiere.',
          'Cu copiii, uită-te nu la bucătărie, ci la spațiu: locuri cu zonă de joacă și meniu pentru copii există și printre cele moldovenești, și printre pizzerii — în catalog se vede după filtre. Iar dacă vrei doar să iei ceva rapid între două treburi, uită-te spre brutării: în Chișinău e o categorie separată și foarte competitivă, unde un covrig proaspăt sau o plăcintă costă mărunțiș.',
          'Mai jos — câteva localuri din catalog, diferite ca format. Lista completă, cu filtre după bucătărie, sector, preț și facilități — în categoria „Mâncare”.',
        ],
      },
    },
  },
  {
    id: 'article-11',
    slug: 'kudy-pity-chisinau-hruden-2026',
    title: 'Зимовий Кишинів: куди піти в грудні 2026',
    excerpt:
      'Колядки з оркестром «Lăutarii», K-pop на Арені, боксерський гала-вечір, різдвяний забіг і китайський цирк — перевірена афіша грудня з цінами й годинами.',
    body: [
      'Грудень у Кишиневі влаштований інакше, ніж листопад. Осінь тут — місяці театральних премʼєр і фестивалів у залах на бульварі Штефан чел Маре; грудень же зміщується на північ міста, на Chișinău Arena, і будується навколо двох речей — великих шоу та святкової програми з колядками. Нижче — лише ті події, дати й ціни яких ми звірили з календарями залів і сайтами організаторів.',
      'Великі шоу на Арені. 3 грудня о 19:30 — K-POP FOREVER, програма з хітів BTS, BLACKPINK, TWICE та інших гуртів корейської сцени (900–1800 лей). 5 грудня в Малій арені — Chișinău Boxing Night IV: у головному бою 12 раундів за титул чемпіона світу WBF, а всього понад 15 поєдинків із боксу, MMA та кікбоксингу зі спортсменами з семи країн (400–600 лей; час початку організатори ще не оголосили). 22 грудня о 19:00 Арена приймає Китайський національний цирк із програмою ZENsation — «best-of» найвідоміших номерів колективу (450–1000 лей).',
      'Святкова програма. 12 грудня о 19:00 Іон Паладі дає концерт «Colindăm cu drag tot neamul» разом із Національним оркестром народної музики «Lăutarii» під керівництвом Ніколае Ботгроса (350–1300 лей) — це найбільший вечір колядок місяця. 17 грудня о 19:00 у Палаці Націонал із різдвяною програмою «Colindăm, colindăm prin viață» виступає Паула Селінг (250–1000 лей). А 15 грудня там же — камерний сольний концерт Святослава Вакарчука: лише голос, гітара й фортепіано (750–2050 лей).',
      'На вулиці та з дітьми. 13 грудня о 12:00 від площі Великих національних зборів стартує Maratonul de Crăciun by Moldcell — неконкурентний забіг на 3 км, куди беруть усіх і будь-яким темпом; сімейна реєстрація помітно вигідніша за одиночну (200 лей за одного, 500 за трьох). Якщо потрібен варіант «у теплі», у Національному музеї історії працює довга експозиція артефактів Кукутень–Трипілля — дорослий квиток 50 лей, дитячий 10.',
      'Дві речі, яких у цьому списку свідомо немає. Станом на 10 листопада мерія ще не оголосила дати різдвяного ярмарку на площі Великих національних зборів на сезон 2026–2027, а Національний театр опери та балету ще не опублікував грудневу афішу — тож ні ярмарку, ні традиційного «Спăргăторул де нучі» ми тут не вказуємо, щоб не писати неперевірених дат. Щойно обидва календарі зʼявляться, події додамо в розділ «Події», і вони одразу будуть на головній.',
      'Практична порада про логістику: Chișinău Arena стоїть не в центрі, а на Каля Орхеюлуй у Стеученях, тож на вечірнє шоу варто закласти час на дорогу й заздалегідь продумати, як вертатися. Події в Палаці Націонал, Органній залі та Опері, навпаки, лежать у межах пішої прогулянки одна від одної — повечеряти перед концертом у центрі цілком реально.',
    ],
    category: 'activities',
    placeSlugs: [
      'teatrul-opera-balet',
      'sala-cu-orga',
      'muzeul-national-de-istorie-chisinau',
      'coffee-molka-chisinau',
      'la-placinte-chisinau',
    ],
    eventSlug: 'ion-paladi-colindam-cu-drag-2026',
    keywords: [
      'куди піти в Кишиневі в грудні',
      'афіша Кишинів грудень 2026',
      'концерти Кишинів грудень',
      'Кишинів Різдво 2026',
      'Chișinău Arena грудень',
    ],
    image: '/images/articles/arcul-de-triumf-chisinau.jpg',
    imageCredit: {
      author: 'ValentinVrz',
      license: 'CC BY-SA 4.0',
      url: 'https://commons.wikimedia.org/wiki/File:Arcul_de_triumf_(Chi%C8%99in%C4%83u).jpg',
    },
    publishedAt: '2026-11-10',
    i18n: {
      ru: {
        title: 'Зимний Кишинёв: куда пойти в декабре 2026',
        excerpt:
          'Колядки с оркестром «Lăutarii», K-pop на Арене, боксёрский гала-вечер, рождественский забег и китайский цирк — проверенная афиша декабря с ценами и временем.',
        body: [
          'Декабрь в Кишинёве устроен иначе, чем ноябрь. Осень здесь — месяцы театральных премьер и фестивалей в залах на бульваре Штефан чел Маре; декабрь же смещается на север города, на Chișinău Arena, и строится вокруг двух вещей — больших шоу и праздничной программы с колядками. Ниже — только те события, даты и цены которых мы сверили с календарями залов и сайтами организаторов.',
          'Большие шоу на Арене. 3 декабря в 19:30 — K-POP FOREVER, программа из хитов BTS, BLACKPINK, TWICE и других групп корейской сцены (900–1800 леев). 5 декабря в Малой арене — Chișinău Boxing Night IV: в главном бою 12 раундов за титул чемпиона мира WBF, а всего больше 15 поединков по боксу, MMA и кикбоксингу со спортсменами из семи стран (400–600 леев; время начала организаторы пока не объявили). 22 декабря в 19:00 Арена принимает Китайский национальный цирк с программой ZENsation — «best-of» самых известных номеров коллектива (450–1000 леев).',
          'Праздничная программа. 12 декабря в 19:00 Ион Палади даёт концерт «Colindăm cu drag tot neamul» вместе с Национальным оркестром народной музыки «Lăutarii» под управлением Николае Ботгроса (350–1300 леев) — это самый большой вечер колядок месяца. 17 декабря в 19:00 в Национальном дворце с рождественской программой «Colindăm, colindăm prin viață» выступает Паула Селинг (250–1000 леев). А 15 декабря там же — камерный сольный концерт Святослава Вакарчука: только голос, гитара и фортепиано (750–2050 леев).',
          'На улице и с детьми. 13 декабря в 12:00 от Площади Великого национального собрания стартует Maratonul de Crăciun by Moldcell — неконкурентный забег на 3 км, куда берут всех и любым темпом; семейная регистрация заметно выгоднее одиночной (200 леев за одного, 500 за троих). Если нужен вариант «в тепле», в Национальном музее истории работает долгая экспозиция артефактов Кукутень–Триполье — взрослый билет 50 леев, детский 10.',
          'Две вещи, которых в этом списке сознательно нет. На 10 ноября мэрия ещё не объявила даты рождественской ярмарки на Площади Великого национального собрания на сезон 2026–2027, а Национальный театр оперы и балета ещё не опубликовал декабрьскую афишу — поэтому ни ярмарку, ни традиционного «Щелкунчика» мы здесь не указываем, чтобы не писать непроверенных дат. Как только оба календаря появятся, события добавим в раздел «События», и они сразу будут на главной.',
          'Практический совет про логистику: Chișinău Arena стоит не в центре, а на Каля Орхеюлуй в Стэучень, так что на вечернее шоу стоит заложить время на дорогу и заранее продумать, как возвращаться. События в Национальном дворце, Органном зале и Опере, наоборот, лежат в пределах пешей прогулки друг от друга — поужинать перед концертом в центре вполне реально.',
        ],
      },
      ro: {
        title: 'Chișinăul de iarnă: unde mergi în decembrie 2026',
        excerpt:
          'Colinde cu orchestra „Lăutarii”, K-pop la Arenă, o gală de box, cursa de Crăciun și circul chinez — programul verificat al lunii decembrie, cu prețuri și ore.',
        body: [
          'Decembrie e altfel construit la Chișinău decât noiembrie. Toamna aici înseamnă premiere de teatru și festivaluri în sălile de pe bulevardul Ștefan cel Mare; decembrie se mută însă spre nordul orașului, la Chișinău Arena, și se organizează în jurul a două lucruri — show-uri mari și programul festiv de colinde. Mai jos — doar evenimentele ale căror date și prețuri le-am verificat în calendarele sălilor și pe site-urile organizatorilor.',
          'Show-urile mari de la Arenă. Pe 3 decembrie, ora 19:30 — K-POP FOREVER, un program din hiturile BTS, BLACKPINK, TWICE și ale altor trupe ale scenei coreene (900–1800 lei). Pe 5 decembrie, în Arena Mică — Chișinău Boxing Night IV: în main event, 12 runde pentru titlul mondial WBF, iar în total peste 15 lupte de box, MMA și kickboxing cu sportivi din șapte țări (400–600 lei; ora de start nu a fost încă anunțată). Pe 22 decembrie, ora 19:00, Arena găzduiește Circul Național Chinez cu programul ZENsation — un „best-of” al celor mai cunoscute numere ale trupei (450–1000 lei).',
          'Programul de sărbători. Pe 12 decembrie, ora 19:00, Ion Paladi susține concertul „Colindăm cu drag tot neamul” împreună cu Orchestra Națională de Muzică Populară „Lăutarii”, dirijată de Nicolae Botgros (350–1300 lei) — cea mai mare seară de colinde a lunii. Pe 17 decembrie, ora 19:00, la Palatul Național cântă Paula Seling, cu programul de Crăciun „Colindăm, colindăm prin viață” (250–1000 lei). Iar pe 15 decembrie, tot acolo — recitalul solo de cameră al lui Sviatoslav Vakarciuk: doar voce, chitară și pian (750–2050 lei).',
          'Afară și cu copiii. Pe 13 decembrie, ora 12:00, din Piața Marii Adunări Naționale pornește Maratonul de Crăciun by Moldcell — o cursă necompetitivă de 3 km, deschisă tuturor și în orice ritm; înscrierea în familie e vizibil mai avantajoasă decât cea individuală (200 lei pentru unu, 500 pentru trei). Dacă vrei o variantă „la căldură”, la Muzeul Național de Istorie e deschisă expoziția de lungă durată cu artefacte Cucuteni–Trypillia — bilet adult 50 lei, copii 10.',
          'Două lucruri care lipsesc intenționat din această listă. La 10 noiembrie, primăria nu anunțase încă datele Târgului de Crăciun din Piața Marii Adunări Naționale pentru sezonul 2026–2027, iar Teatrul Național de Operă și Balet nu publicase încă afișul de decembrie — așa că nici târgul, nici tradiționalul „Spărgătorul de nuci” nu apar aici, ca să nu scriem date neverificate. Imediat ce ambele calendare apar, adăugăm evenimentele în secțiunea „Evenimente” și vor fi vizibile pe prima pagină.',
          'Un sfat practic de logistică: Chișinău Arena nu e în centru, ci pe Calea Orheiului, în Stăuceni, așa că pentru un show de seară merită să calculezi timpul de drum și să te gândești din timp cum te întorci. Evenimentele de la Palatul Național, Sala cu Orgă și Operă sunt, în schimb, la distanță de mers pe jos unul de altul — poți cina în centru înainte de concert fără probleme.',
        ],
      },
    },
  },
  {
    id: 'article-12',
    slug: 'ion-paladi-colinde-chisinau-2026',
    title: 'Колядки з «Lăutarii»: концерт Іона Паладі 12 грудня',
    excerpt:
      'Найбільший вечір колядок грудня — Іон Паладі з Національним оркестром народної музики «Lăutarii» і Ніколае Ботгросом на Chișinău Arena. Ціни, час і як дістатися.',
    body: [
      '12 грудня 2026 року о 19:00 на Chișinău Arena Іон Паладі дає концерт «Colindăm cu drag tot neamul» — програму, повністю складену із зимового репертуару: колядки, традиційні пісні й святкові обробки. Виступає він не сам: разом із ним на сцені Національний оркестр народної музики «Lăutarii» під керівництвом Ніколае Ботгроса. Квитки — 350–1300 лей залежно від сектора, продаж на livetickets.md.',
      'Для тих, хто в Молдові недавно, варто пояснити, чому це подія, а не просто ще один концерт у грудні. Колядки тут — не фонова музика з торгових центрів, а живий жанр із власними виконавцями й великою аудиторією; «Lăutarii» ж — найвідоміший оркестр народної музики країни, і поєднання Паладі з ботгросівським складом традиційно збирає повний зал. Якщо ви хочете один раз почути молдовську святкову традицію в її «великій» концертній формі, цей вечір — найочевидніший вибір сезону.',
      'Практичне. Арена стоїть на Каля Орхеюлуй, 130, у Стеученях — це північ агломерації, а не центр, тож закладайте час на дорогу в обидві сторони й заздалегідь вирішуйте, як повертатися після 21:00. Зал великий, і різниця між найдешевшим і найдорожчим квитком тут — це насамперед відстань до сцени, а не якість звуку.',
      'Якщо квитки розійдуться або формат великої арени вам не близький, у грудні в місті є ще два святкові вечори меншого масштабу: 17 грудня в Палаці Націонал із різдвяною програмою виступає Паула Селінг, а камерну класику й органні програми цілий сезон дає Органна зала на бульварі Штефан чел Маре. Обидва варіанти — у центрі, пішки від вечері.',
    ],
    category: 'activities',
    placeSlugs: ['sala-cu-orga', 'teatrul-opera-balet', 'la-placinte-chisinau', 'coffee-molka-chisinau'],
    eventSlug: 'ion-paladi-colindam-cu-drag-2026',
    keywords: [
      'Іон Паладі концерт Кишинів',
      'колядки Кишинів 2026',
      'Lăutarii Ботгрос концерт',
      'Colindăm cu drag tot neamul квитки',
    ],
    publishedAt: '2026-11-10',
    i18n: {
      ru: {
        title: 'Колядки с «Lăutarii»: концерт Иона Палади 12 декабря',
        excerpt:
          'Самый большой вечер колядок декабря — Ион Палади с Национальным оркестром народной музыки «Lăutarii» и Николае Ботгросом на Chișinău Arena. Цены, время и как добраться.',
        body: [
          '12 декабря 2026 года в 19:00 на Chișinău Arena Ион Палади даёт концерт «Colindăm cu drag tot neamul» — программу, целиком составленную из зимнего репертуара: колядки, традиционные песни и праздничные обработки. Выступает он не один: вместе с ним на сцене Национальный оркестр народной музыки «Lăutarii» под управлением Николае Ботгроса. Билеты — 350–1300 леев в зависимости от сектора, продажа на livetickets.md.',
          'Тем, кто в Молдове недавно, стоит объяснить, почему это событие, а не просто ещё один концерт в декабре. Колядки здесь — не фоновая музыка из торговых центров, а живой жанр со своими исполнителями и большой аудиторией; «Lăutarii» же — самый известный оркестр народной музыки страны, и сочетание Палади с ботгросовским составом традиционно собирает полный зал. Если вы хотите один раз услышать молдавскую праздничную традицию в её «большой» концертной форме, этот вечер — самый очевидный выбор сезона.',
          'Практическое. Арена стоит на Каля Орхеюлуй, 130, в Стэучень — это север агломерации, а не центр, так что закладывайте время на дорогу в обе стороны и заранее решайте, как возвращаться после 21:00. Зал большой, и разница между самым дешёвым и самым дорогим билетом здесь — это прежде всего расстояние до сцены, а не качество звука.',
          'Если билеты разойдутся или формат большой арены вам не близок, в декабре в городе есть ещё два праздничных вечера меньшего масштаба: 17 декабря в Национальном дворце с рождественской программой выступает Паула Селинг, а камерную классику и органные программы весь сезон даёт Органный зал на бульваре Штефан чел Маре. Оба варианта — в центре, пешком от ужина.',
        ],
      },
      ro: {
        title: 'Colinde cu „Lăutarii”: concertul lui Ion Paladi pe 12 decembrie',
        excerpt:
          'Cea mai mare seară de colinde a lunii decembrie — Ion Paladi cu Orchestra Națională de Muzică Populară „Lăutarii” și Nicolae Botgros, la Chișinău Arena. Prețuri, ore și cum ajungi.',
        body: [
          'Pe 12 decembrie 2026, ora 19:00, la Chișinău Arena, Ion Paladi susține concertul „Colindăm cu drag tot neamul” — un program alcătuit integral din repertoriul de iarnă: colinde, cântece tradiționale și prelucrări festive. Nu cântă singur: pe scenă, alături de el, este Orchestra Națională de Muzică Populară „Lăutarii”, dirijată de Nicolae Botgros. Biletele costă 350–1300 lei, în funcție de sector, și se vând pe livetickets.md.',
          'Pentru cei care sunt de puțin timp în Moldova, merită explicat de ce acesta e un eveniment, nu doar un alt concert de decembrie. Colindele nu sunt aici muzică de fundal din mall-uri, ci un gen viu, cu interpreții și publicul lui; iar „Lăutarii” e cea mai cunoscută orchestră de muzică populară din țară, așa că formula Paladi plus orchestra lui Botgros umple de obicei sala. Dacă vrei să auzi o dată tradiția festivă moldovenească în forma ei concertistică „mare”, seara aceasta e alegerea cea mai evidentă a sezonului.',
          'Partea practică. Arena se află pe Calea Orheiului 130, în Stăuceni — nordul aglomerației, nu centrul, așa că socotește timpul de drum în ambele sensuri și decide din timp cum te întorci după ora 21:00. Sala e mare, iar diferența dintre cel mai ieftin și cel mai scump bilet ține în primul rând de distanța până la scenă, nu de calitatea sunetului.',
          'Dacă biletele se epuizează sau formatul unei arene mari nu e pe gustul tău, în decembrie orașul mai are două seri festive de dimensiuni mai mici: pe 17 decembrie, la Palatul Național, cântă Paula Seling cu un program de Crăciun, iar Sala cu Orgă de pe bulevardul Ștefan cel Mare oferă programe camerale și de orgă pe tot parcursul sezonului. Ambele sunt în centru, la câțiva pași de o cină.',
        ],
      },
    },
  },
  {
    id: 'article-13',
    slug: 'circul-chinez-zensation-chisinau-2026',
    title: 'Китайський національний цирк у Кишиневі: ZENsation 22 грудня',
    excerpt:
      'Акробатика, еквілібр і номери на межі можливого — програма ZENsation на Chișinău Arena. Що це за колектив, скільки коштують квитки і чи варто йти з дітьми.',
    body: [
      '22 грудня 2026 року о 19:00 на Chișinău Arena виступає Китайський національний цирк із програмою ZENsation. Це не класичний цирк із тваринами, а суто акробатичне шоу: еквілібр, групова акробатика, номери на реквізиті й трюки, побудовані на точності та балансі. Сама програма зібрана як «best-of» — у неї увійшли найвідоміші номери колективу за минулі роки. Квитки коштують 450–1000 лей.',
      'Чи брати дітей — найчастіше питання про такі гастролі. Формат для цього підходить: у шоу немає тексту, який потрібно розуміти, воно тримається на візуальному ефекті, а номери короткі й змінюються швидко, тож увагу легше втримати, ніж на виставі. Єдине обмеження суто практичне — початок о 19:00 і великий зал: для малечі, яка рано засинає, вечір вийде довгим, тож варто заздалегідь подивитися схему залу й узяти місця, з яких видно без бінокля.',
      'Логістика. Chișinău Arena — це Каля Орхеюлуй, 130, у Стеученях, тобто на північ від центру, а не в межах пішої прогулянки від бульвару Штефан чел Маре. На грудневий вечір закладайте час на дорогу в обидві сторони; якщо йдете з дітьми, подумайте про зворотний шлях ще до того, як купувати квитки.',
      'Якщо 22 грудня не складається, у грудні в місті є й інші варіанти «з дітьми»: 13 грудня — різдвяний забіг на 3 км у центрі, куди беруть сімʼї з візочками, а в Національному музеї історії весь сезон відкрита експозиція артефактів Кукутень–Трипілля з дитячим квитком за 10 лей. У теплу погоду цілком робочий план на день — парки Валя Морілор і Дендраріум, обидва з прогулянковими маршрутами.',
    ],
    category: 'activities',
    placeSlugs: [
      'parcul-valea-morilor-chisinau',
      'parcul-dendrariu-chisinau',
      'muzeul-national-de-istorie-chisinau',
      'la-placinte-chisinau',
    ],
    eventSlug: 'grand-chinese-national-circus-zensation-2026',
    keywords: [
      'китайський цирк Кишинів',
      'ZENsation Chișinău Arena',
      'куди піти з дітьми Кишинів грудень',
      'цирк Кишинів 2026 квитки',
    ],
    publishedAt: '2026-11-10',
    i18n: {
      ru: {
        title: 'Китайский национальный цирк в Кишинёве: ZENsation 22 декабря',
        excerpt:
          'Акробатика, эквилибр и номера на грани возможного — программа ZENsation на Chișinău Arena. Что это за коллектив, сколько стоят билеты и стоит ли идти с детьми.',
        body: [
          '22 декабря 2026 года в 19:00 на Chișinău Arena выступает Китайский национальный цирк с программой ZENsation. Это не классический цирк с животными, а чисто акробатическое шоу: эквилибр, групповая акробатика, номера на реквизите и трюки, построенные на точности и балансе. Сама программа собрана как «best-of» — в неё вошли самые известные номера коллектива за прошлые годы. Билеты стоят 450–1000 леев.',
          'Брать ли детей — самый частый вопрос про такие гастроли. Формат для этого подходит: в шоу нет текста, который нужно понимать, оно держится на визуальном эффекте, а номера короткие и быстро сменяются, так что внимание удержать легче, чем на спектакле. Единственное ограничение чисто практическое — начало в 19:00 и большой зал: для малышей, которые рано засыпают, вечер выйдет длинным, поэтому стоит заранее посмотреть схему зала и взять места, с которых видно без бинокля.',
          'Логистика. Chișinău Arena — это Каля Орхеюлуй, 130, в Стэучень, то есть к северу от центра, а не в пределах пешей прогулки от бульвара Штефан чел Маре. На декабрьский вечер закладывайте время на дорогу в обе стороны; если идёте с детьми, продумайте обратный путь ещё до покупки билетов.',
          'Если 22 декабря не складывается, в декабре в городе есть и другие варианты «с детьми»: 13 декабря — рождественский забег на 3 км в центре, куда берут семьи с коляской, а в Национальном музее истории весь сезон открыта экспозиция артефактов Кукутень–Триполье с детским билетом за 10 леев. В тёплую погоду вполне рабочий план на день — парки Валя Морилор и Дендрарий, оба с прогулочными маршрутами.',
        ],
      },
      ro: {
        title: 'Circul Național Chinez la Chișinău: ZENsation pe 22 decembrie',
        excerpt:
          'Acrobație, echilibristică și numere la limita posibilului — programul ZENsation la Chișinău Arena. Ce este această trupă, cât costă biletele și dacă merită să mergi cu copiii.',
        body: [
          'Pe 22 decembrie 2026, ora 19:00, la Chișinău Arena evoluează Circul Național Chinez cu programul ZENsation. Nu e un circ clasic, cu animale, ci un show pur acrobatic: echilibristică, acrobație de grup, numere cu recuzită și trucuri construite pe precizie și echilibru. Programul în sine e gândit ca un „best-of” — adună cele mai cunoscute numere ale trupei din anii trecuți. Biletele costă 450–1000 lei.',
          'Dacă să iei copiii e cea mai frecventă întrebare la astfel de turnee. Formatul se potrivește: show-ul nu are text de înțeles, se sprijină pe efectul visual, iar numerele sunt scurte și se schimbă repede, așa că atenția se ține mai ușor decât la un spectacol de teatru. Singura limitare e practică — începe la 19:00, într-o sală mare: pentru cei mici, care adorm devreme, seara va fi lungă, deci merită să te uiți din timp la harta sălii și să iei locuri de unde se vede fără binoclu.',
          'Logistica. Chișinău Arena se află pe Calea Orheiului 130, în Stăuceni, adică la nord de centru, nu la distanță de mers pe jos de bulevardul Ștefan cel Mare. Pentru o seară de decembrie, calculează timpul de drum în ambele sensuri; dacă mergi cu copiii, gândește-te la drumul de întoarcere înainte să cumperi biletele.',
          'Dacă pe 22 decembrie nu iese, orașul are și alte variante „cu copiii” în decembrie: pe 13 decembrie — cursa de Crăciun de 3 km din centru, deschisă familiilor, inclusiv cu cărucior, iar la Muzeul Național de Istorie e deschisă tot sezonul expoziția cu artefacte Cucuteni–Trypillia, cu bilet pentru copii la 10 lei. Pe vreme bună, un plan bun de zi sunt parcurile Valea Morilor și Dendrariu, ambele cu trasee de plimbare.',
        ],
      },
    },
  },
  {
    id: 'article-20',
    slug: 'quiet-places-chisinau',
    title: 'Де побути в тиші в Кишиневі: бібліотеки, сквери та тихі парки',
    excerpt:
      'Потрібно попрацювати в тиші, почитати або просто побути наодинці — місця, де в Кишиневі справді тихо, з адресами й графіком.',
    body: [
      'Тиша в місті — рідкісний ресурс. Якщо треба зосередитися над текстом, почитати книжку або просто побути без шуму, у Кишиневі є два надійні типи місць: публічні бібліотеки та невеликі сквери подалі від магістралей.',
      'Бібліотеки — найпередбачуваніший варіант. У муніципальній мережі «B. P. Hasdeu» доступ за безкоштовним читацьким квитком, у філіях є Wi-Fi і місця для індивідуальної роботи; Національна бібліотека працює за схожим принципом. Це тиша з розеткою, столом і опаленням — на відміну від кавʼярні, де за сусіднім столиком може початися нарада.',
      'Якщо хочеться тиші на повітрі, шукайте не великі парки біля проспектів, а сквери в глибині кварталів і лісопарки: там менше людей і немає транспортного гулу. Узимку й у негоду логіка зворотна — бібліотека виграє в будь-якому разі.',
      'Нижче — перевірені адреси з каталогу. Повний список із фільтром за типом (парк, бібліотека, кавʼярня) — у категорії «Тихі місця»; там же можна увімкнути фільтр «Відчинено зараз», щоб не їхати даремно.',
    ],
    category: 'quiet_places',
    placeSlugs: ['biblioteca-hasdeu', 'biblioteca-nationala-chisinau', 'scuarul-mateevici', 'padurea-parc-schinoasa'],
    keywords: ['тихі місця Кишинів', 'де попрацювати в тиші', 'бібліотеки Кишинева', 'тихі парки', 'читальна зала'],
    publishedAt: '2026-11-10',
    i18n: {
      ru: {
        title: 'Где побыть в тишине в Кишинёве: библиотеки, скверы и тихие парки',
        excerpt:
          'Нужно поработать в тишине, почитать или просто побыть одному — места, где в Кишинёве действительно тихо, с адресами и графиком.',
        body: [
          'Тишина в городе — редкий ресурс. Если нужно сосредоточиться над текстом, почитать книгу или просто побыть без шума, в Кишинёве есть два надёжных типа мест: публичные библиотеки и небольшие скверы в стороне от магистралей.',
          'Библиотеки — самый предсказуемый вариант. В муниципальной сети «B. P. Hasdeu» доступ по бесплатному читательскому билету, в филиалах есть Wi-Fi и места для индивидуальной работы; Национальная библиотека работает по схожему принципу. Это тишина с розеткой, столом и отоплением — в отличие от кофейни, где за соседним столиком может начаться совещание.',
          'Если хочется тишины на воздухе, ищите не большие парки у проспектов, а скверы в глубине кварталов и лесопарки: там меньше людей и нет транспортного гула. Зимой и в непогоду логика обратная — библиотека выигрывает в любом случае.',
          'Ниже — проверенные адреса из каталога. Полный список с фильтром по типу (парк, библиотека, кофейня) — в категории «Тихие места»; там же можно включить фильтр «Открыто сейчас», чтобы не ехать зря.',
        ],
      },
      ro: {
        title: 'Unde găsești liniște în Chișinău: biblioteci, scuaruri și parcuri liniștite',
        excerpt:
          'Ai nevoie să lucrezi în liniște, să citești sau pur și simplu să stai singur — locurile cu adevărat liniștite din Chișinău, cu adrese și program.',
        body: [
          'Liniștea în oraș e o resursă rară. Dacă trebuie să te concentrezi pe un text, să citești o carte sau doar să stai fără zgomot, în Chișinău există două tipuri sigure de locuri: bibliotecile publice și scuarurile mici, departe de arterele mari.',
          'Bibliotecile sunt varianta cea mai previzibilă. În rețeaua municipală „B. P. Hasdeu” accesul se face pe baza unui card gratuit, filialele au Wi-Fi și spații pentru studiu individual; Biblioteca Națională funcționează pe un principiu similar. E liniște cu priză, masă și căldură — spre deosebire de o cafenea, unde la masa de alături poate începe o ședință.',
          'Dacă vrei liniște în aer liber, caută nu parcurile mari de lângă bulevarde, ci scuarurile din interiorul cartierelor și pădurile-parc: sunt mai puțini oameni și lipsește zgomotul traficului. Iarna și pe vreme rea logica se inversează — biblioteca câștigă oricum.',
          'Mai jos — adrese verificate din catalog. Lista completă, cu filtru după tip (parc, bibliotecă, cafenea) — în categoria „Locuri liniștite”; tot acolo poți activa filtrul „Deschis acum”, ca să nu mergi degeaba.',
        ],
      },
    },
  },
  {
    id: 'article-21',
    slug: 'free-wifi-chisinau',
    title: 'Де в Кишиневі безкоштовний Wi-Fi: кавʼярні, бібліотеки, коворкінги',
    excerpt:
      'Потрібен інтернет поза домом — заклади Кишинева, де Wi-Fi підтверджено, а не припущено.',
    body: [
      'Безкоштовний Wi-Fi у Кишиневі є в більшості кавʼярень, але «є роутер» і «можна спокійно попрацювати годину» — різні речі. У каталозі позначку Wi-Fi мають лише ті місця, де це підтверджено джерелом, а не здогадкою: зараз таких 36.',
      'Для короткої задачі — відповісти на листи, зідзвонитися — підійде будь-яка спешелті-кавʼярня в центрі. Для довшої роботи краще дивитися на коворкінги: там інтернет — частина послуги, а не бонус, є розетки біля кожного місця й окремі кімнати для дзвінків.',
      'Найнедооціненіший варіант — бібліотеки. У мережі «B. P. Hasdeu» Wi-Fi безкоштовний, пароль дає черговий бібліотекар, а доступ — за безкоштовним читацьким квитком. Платити за каву, щоб мати інтернет, не доводиться взагалі.',
      'Нижче — кілька перевірених адрес. Щоб побачити всі, відкрийте будь-яку категорію і ввімкніть фільтр «Wi-Fi» — він показує лише місця з підтвердженим інтернетом.',
    ],
    category: 'remote_work',
    placeSlugs: ['tucano-coffee-brasil', 'coffee-molka-chisinau', 'rozmarin-urban-cafe', 'tekwill-studentilor'],
    keywords: ['безкоштовний Wi-Fi Кишинів', 'кафе з Wi-Fi', 'де працювати з ноутбуком', 'інтернет Кишинів', 'коворкінг Кишинів'],
    publishedAt: '2026-11-10',
    i18n: {
      ru: {
        title: 'Где в Кишинёве бесплатный Wi-Fi: кофейни, библиотеки, коворкинги',
        excerpt:
          'Нужен интернет вне дома — заведения Кишинёва, где Wi-Fi подтверждён, а не предположен.',
        body: [
          'Бесплатный Wi-Fi в Кишинёве есть в большинстве кофеен, но «есть роутер» и «можно спокойно поработать час» — разные вещи. В каталоге отметку Wi-Fi имеют только те места, где это подтверждено источником, а не догадкой: сейчас таких 36.',
          'Для короткой задачи — ответить на письма, созвониться — подойдёт любая спешелти-кофейня в центре. Для долгой работы лучше смотреть на коворкинги: там интернет — часть услуги, а не бонус, есть розетки у каждого места и отдельные комнаты для звонков.',
          'Самый недооценённый вариант — библиотеки. В сети «B. P. Hasdeu» Wi-Fi бесплатный, пароль даёт дежурный библиотекарь, а доступ — по бесплатному читательскому билету. Платить за кофе, чтобы иметь интернет, не приходится вовсе.',
          'Ниже — несколько проверенных адресов. Чтобы увидеть все, откройте любую категорию и включите фильтр «Wi-Fi» — он показывает только места с подтверждённым интернетом.',
        ],
      },
      ro: {
        title: 'Unde găsești Wi-Fi gratuit în Chișinău: cafenele, biblioteci, coworking',
        excerpt:
          'Ai nevoie de internet în afara casei — localurile din Chișinău unde Wi-Fi-ul este confirmat, nu presupus.',
        body: [
          'Wi-Fi gratuit în Chișinău există în majoritatea cafenelelor, dar „există un router” și „poți lucra liniștit o oră” sunt lucruri diferite. În catalog, eticheta Wi-Fi o au doar locurile unde acest lucru e confirmat de o sursă, nu ghicit: acum sunt 36.',
          'Pentru o sarcină scurtă — să răspunzi la e-mailuri, să ai un apel — merge orice cafenea specialty din centru. Pentru lucru de durată, uită-te mai degrabă la spațiile de coworking: acolo internetul face parte din serviciu, nu e un bonus, există prize la fiecare loc și camere separate pentru apeluri.',
          'Varianta cea mai subestimată sunt bibliotecile. În rețeaua „B. P. Hasdeu” Wi-Fi-ul e gratuit, parola o dă bibliotecarul de serviciu, iar accesul se face pe baza unui card gratuit. Nu trebuie să plătești o cafea doar ca să ai internet.',
          'Mai jos — câteva adrese verificate. Ca să le vezi pe toate, deschide orice categorie și activează filtrul „Wi-Fi” — arată doar locurile cu internet confirmat.',
        ],
      },
    },
  },
  {
    id: 'article-22',
    slug: 'terrace-chisinau',
    title: 'Кавʼярні та ресторани Кишинева з терасою',
    excerpt:
      'Тепла погода — привід сісти надворі. Заклади, у яких тераса підтверджена, з адресами й орієнтовними цінами.',
    body: [
      'Тераса в Кишиневі працює довше, ніж здається: багато закладів тримають вуличні столики з квітня до середини жовтня, а частина — з обігрівачами й узимку. У каталозі позначка «тераса» стоїть лише там, де це підтверджено, тож у списку немає закладів «із двома стільцями біля входу».',
      'Вибираючи терасу, звертайте увагу на вулицю: на бульварі Штефан чел Маре і великих проспектах шумно й пильно, а в бічних вулицях центру та у спальних районах біля парків сидіти значно приємніше.',
      'Друге, що варто врахувати, — тінь і час доби. Південні тераси до вечора розжарюються, тож улітку туди краще приходити після 18:00; ранкова кава комфортніша на східному боці.',
      'Нижче — перевірені варіанти. Повний перелік — через фільтр «Тераса» в категоріях «Кафе» та «Їжа».',
    ],
    category: 'cafes',
    placeSlugs: ['la-placinte-chisinau', 'biorganic-raw-cafe', 'the-moss-caffe-strisca', 'andys-pizza-moscova'],
    keywords: ['кафе з терасою Кишинів', 'ресторан з терасою', 'літня тераса Кишинів', 'де посидіти надворі'],
    publishedAt: '2026-11-10',
    i18n: {
      ru: {
        title: 'Кофейни и рестораны Кишинёва с террасой',
        excerpt:
          'Тёплая погода — повод сесть на улице. Заведения, у которых терраса подтверждена, с адресами и ориентировочными ценами.',
        body: [
          'Терраса в Кишинёве работает дольше, чем кажется: многие заведения держат уличные столики с апреля до середины октября, а часть — с обогревателями и зимой. В каталоге отметка «терраса» стоит только там, где это подтверждено, так что в списке нет заведений «с двумя стульями у входа».',
          'Выбирая террасу, обращайте внимание на улицу: на бульваре Штефан чел Маре и больших проспектах шумно и пыльно, а в боковых улицах центра и в спальных районах у парков сидеть значительно приятнее.',
          'Второе, что стоит учесть, — тень и время суток. Южные террасы к вечеру раскаляются, поэтому летом туда лучше приходить после 18:00; утренний кофе комфортнее на восточной стороне.',
          'Ниже — проверенные варианты. Полный перечень — через фильтр «Терраса» в категориях «Кафе» и «Еда».',
        ],
      },
      ro: {
        title: 'Cafenele și restaurante cu terasă în Chișinău',
        excerpt:
          'Vremea caldă e un motiv să stai afară. Localuri cu terasa confirmată, cu adrese și prețuri orientative.',
        body: [
          'Terasa la Chișinău funcționează mai mult decât pare: multe localuri țin mesele afară din aprilie până la mijlocul lui octombrie, iar unele — cu încălzitoare, chiar și iarna. În catalog, eticheta „terasă” apare doar acolo unde e confirmată, așa că lista nu conține localuri „cu două scaune la intrare”.',
          'Când alegi o terasă, uită-te la stradă: pe bulevardul Ștefan cel Mare și pe arterele mari e zgomot și praf, în timp ce pe străzile laterale din centru și în cartierele de lângă parcuri e mult mai plăcut.',
          'Al doilea lucru de luat în calcul este umbra și ora. Terasele cu expunere sudică se încing spre seară, așa că vara e mai bine să ajungi după ora 18:00; cafeaua de dimineață e mai comodă pe partea estică.',
          'Mai jos — variante verificate. Lista completă — prin filtrul „Terasă” din categoriile „Cafenele” și „Mâncare”.',
        ],
      },
    },
  },
  {
    id: 'article-23',
    slug: 'free-chisinau',
    title: 'Що подивитися в Кишиневі безкоштовно',
    excerpt:
      'Парки, сквери, пішохідні вулиці та відкриті памʼятки, куди можна піти без квитка — 39 місць у каталозі.',
    body: [
      'Кишинів добре підходить для безкоштовних прогулянок: майже весь центр — це парки, сквери та відкриті публічні простори, куди не треба купувати квиток. У каталозі позначку «безкоштовний вхід» мають 39 місць, і це перевірена ознака, а не припущення.',
      'Базовий маршрут вихідного дня — Центральний парк «Штефан чел Маре», далі пішохідна вулиця Євгена Доги з кавʼярнями, потім Соборний парк і Тріумфальна арка. Усе це в межах пішої доступності й не коштує нічого.',
      'Якщо хочеться більше природи, ідіть до Валя Морілор з озером і набережною або до Долини Троянд — обидва парки великі, із затіненими алеями й місцями для пікніка. Зверніть увагу: Дендрарій, попри схожий формат, має платний вхід (5–10 лей), тож у фільтр безкоштовних місць він не потрапляє.',
      'Нижче — кілька таких місць. Повний список — фільтр «Безкоштовно» в категоріях «Прогулянки» та «Чим зайнятися».',
    ],
    category: 'walks',
    placeSlugs: ['parcul-valea-morilor-chisinau', 'strada-eugen-doga-chisinau', 'gradina-catedralei', 'valea-trandafirilor-chisinau'],
    keywords: ['безкоштовно Кишинів', 'що подивитися в Кишиневі', 'парки Кишинева', 'прогулянка центром', 'куди піти безкоштовно'],
    publishedAt: '2026-11-10',
    i18n: {
      ru: {
        title: 'Что посмотреть в Кишинёве бесплатно',
        excerpt:
          'Парки, скверы, пешеходные улицы и открытые достопримечательности, куда можно пойти без билета — 39 мест в каталоге.',
        body: [
          'Кишинёв хорошо подходит для бесплатных прогулок: почти весь центр — это парки, скверы и открытые публичные пространства, куда не нужно покупать билет. В каталоге отметку «бесплатный вход» имеют 39 мест, и это проверенный признак, а не предположение.',
          'Базовый маршрут выходного дня — Центральный парк «Штефан чел Маре», дальше пешеходная улица Евгения Доги с кофейнями, потом Соборный парк и Триумфальная арка. Всё это в пешей доступности и не стоит ничего.',
          'Если хочется больше природы, идите к Валя Морилор с озером и набережной или к Долине Роз — оба парка большие, с тенистыми аллеями и местами для пикника. Обратите внимание: Дендрарий, несмотря на похожий формат, имеет платный вход (5–10 леев), поэтому в фильтр бесплатных мест он не попадает.',
          'Ниже — несколько таких мест. Полный список — фильтр «Бесплатно» в категориях «Прогулки» и «Чем заняться».',
        ],
      },
      ro: {
        title: 'Ce poți vedea gratuit în Chișinău',
        excerpt:
          'Parcuri, scuaruri, străzi pietonale și obiective deschise, unde intri fără bilet — 39 de locuri în catalog.',
        body: [
          'Chișinăul se pretează bine plimbărilor gratuite: aproape tot centrul înseamnă parcuri, scuaruri și spații publice deschise, pentru care nu cumperi bilet. În catalog, eticheta „intrare gratuită” o au 39 de locuri, iar aceasta este o informație verificată, nu o presupunere.',
          'Traseul de bază pentru weekend: Parcul Central „Ștefan cel Mare”, apoi strada pietonală Eugen Doga cu cafenelele ei, apoi Grădina Catedralei și Arcul de Triumf. Totul se poate parcurge pe jos și nu costă nimic.',
          'Dacă vrei mai multă natură, mergi la Valea Morilor, cu lacul și faleza, sau la Valea Trandafirilor — ambele parcuri sunt mari, cu alei umbrite și locuri de picnic. Atenție: Grădina Dendrariu, deși seamănă ca format, are intrare cu plată (5–10 lei), deci nu apare în filtrul locurilor gratuite.',
          'Mai jos — câteva astfel de locuri. Lista completă — filtrul „Gratuit” din categoriile „Plimbări” și „Ce poți face”.',
        ],
      },
    },
  },
  {
    id: 'article-24',
    slug: 'with-kids-chisinau',
    title: 'Куди піти з дитиною в Кишиневі',
    excerpt:
      'Заклади з дитячою кімнатою й дитячим меню, зоопарк і торгові центри з розвагами — місця, де з дітьми справді раді.',
    body: [
      'Похід у кафе з дитиною залежить не від ввічливості персоналу, а від того, чи є дитині де подітися. Тому в каталозі окремо позначені два різні факти: «дитяча кімната» — виділена ігрова зона, і «дитяче меню» — окремий розділ у меню, а не просто половина дорослої порції.',
      'Мережеві ресторани тут мають перевагу: у частини закладів La Plăcinte, Andy\'s Pizza та Oliva ігрові зони заявлені на власних сайтах, подекуди — ще й аніматори на дні народження. Важливо дивитися саме на конкретну локацію: у тій самій мережі один ресторан має ігрову кімнату, а інший — ні.',
      'На цілий день із дитиною найпростіший план — зоопарк на бульварі Дачія: велика територія, де можна провести кілька годин, і поруч Ботанічний сад. У холодну погоду виручають торгові центри — Atrium і Port Mall у каталозі позначені як придатні для відвідин із дітьми: там є розважальні зони й фудкорти.',
      'Нижче — перевірені варіанти з адресами. Плануючи вихідний, загляньте ще в афішу: дитячі вистави й майстер-класи в Кишиневі бувають щотижня.',
    ],
    category: 'food',
    placeSlugs: ['la-placinte-chisinau', 'oliva-moscova', 'gradina-zoologica-chisinau', 'atrium-albisoara-chisinau'],
    keywords: ['з дитиною Кишинів', 'кафе з дитячою кімнатою', 'дитяче меню Кишинів', 'куди піти з дітьми', 'зоопарк Кишинів'],
    publishedAt: '2026-11-10',
    i18n: {
      ru: {
        title: 'Куда пойти с ребёнком в Кишинёве',
        excerpt:
          'Заведения с детской комнатой и детским меню, зоопарк и торговые центры с развлечениями — места, где детям действительно рады.',
        body: [
          'Поход в кафе с ребёнком зависит не от вежливости персонала, а от того, есть ли ребёнку куда деться. Поэтому в каталоге отдельно отмечены два разных факта: «детская комната» — выделенная игровая зона, и «детское меню» — отдельный раздел в меню, а не просто половина взрослой порции.',
          'Сетевые рестораны здесь имеют преимущество: у части заведений La Plăcinte, Andy\'s Pizza и Oliva игровые зоны заявлены на собственных сайтах, кое-где — ещё и аниматоры на дни рождения. Важно смотреть именно на конкретную локацию: в одной и той же сети один ресторан имеет игровую комнату, а другой — нет.',
          'На целый день с ребёнком самый простой план — зоопарк на бульваре Дачия: большая территория, где можно провести несколько часов, и рядом Ботанический сад. В холодную погоду выручают торговые центры — Atrium и Port Mall в каталоге отмечены как подходящие для посещения с детьми: там есть развлекательные зоны и фудкорты.',
          'Ниже — проверенные варианты с адресами. Планируя выходной, загляните ещё в афишу: детские спектакли и мастер-классы в Кишинёве бывают еженедельно.',
        ],
      },
      ro: {
        title: 'Unde mergi cu copilul în Chișinău',
        excerpt:
          'Localuri cu loc de joacă și meniu pentru copii, grădina zoologică și centre comerciale cu distracții — locuri unde copiii chiar sunt bineveniți.',
        body: [
          'O ieșire la cafenea cu un copil nu depinde de amabilitatea personalului, ci de faptul că cel mic are unde să stea. De aceea, în catalog sunt marcate separat două lucruri diferite: „cameră pentru copii” — o zonă de joacă dedicată, și „meniu pentru copii” — o secțiune separată în meniu, nu doar o jumătate de porție de adult.',
          'Restaurantele de rețea au aici un avantaj: o parte dintre localurile La Plăcinte, Andy\'s Pizza și Oliva anunță zone de joacă pe propriile site-uri, iar unele — și animatori pentru aniversări. Contează însă locația concretă: în aceeași rețea, un restaurant are loc de joacă, altul nu.',
          'Pentru o zi întreagă cu copilul, cel mai simplu plan e grădina zoologică de pe bulevardul Dacia: un teritoriu mare, unde poți petrece câteva ore, iar alături se află Grădina Botanică. Pe vreme rece salvează centrele comerciale — Atrium și Port Mall sunt marcate în catalog ca potrivite pentru vizite cu copiii: au zone de divertisment și food court.',
          'Mai jos — variante verificate, cu adrese. Când planifici weekendul, verifică și afișul: spectacole pentru copii și ateliere au loc la Chișinău în fiecare săptămână.',
        ],
      },
    },
  },
  {
    id: 'article-25',
    slug: 'breakfast-chisinau',
    title: 'Де поснідати в Кишиневі',
    excerpt:
      'Заклади, у яких сніданок — окремий розділ меню, а не просто кава з круасаном. З адресами й орієнтовними цінами.',
    body: [
      'Снідати поза домом у Кишиневі дешевше, ніж здається: повний сніданок у кавʼярні коштує приблизно стільки ж, скільки обід у бістро. У каталозі позначку «сніданки» мають лише заклади, де це заявлено на власному сайті — зазвичай з окремим розділом меню й часовими рамками.',
      'Тип сніданку варто обрати заздалегідь. Кавʼярні дають класичний формат: яєчня, сирники, тости, кава. Ресторани на кшталт La Plăcinte та Oliva пропонують ситніші страви й відчиняються рано. Є й проміжний варіант — пекарні, де сніданок складається з випічки, зате кава зазвичай дешевша.',
      'Другий критерій — час. Більшість місць подає сніданки до 11:00–12:00, у вихідні трохи довше. Якщо прокидаєтеся пізно, шукайте заклади, де сніданок подають цілий день, або просто дивіться на звичайне меню.',
      'Нижче — кілька перевірених адрес; у картках є графік роботи та орієнтовні ціни з сайтів закладів.',
    ],
    category: 'cafes',
    placeSlugs: ['coffee-molka-chisinau', 'miro-cafe-petru-movila', 'oliva-moscova', 'star-kebab-grigore-vieru'],
    keywords: ['сніданок Кишинів', 'де поснідати', 'кафе зі сніданками', 'ранкова кава Кишинів', 'бранч'],
    publishedAt: '2026-11-10',
    i18n: {
      ru: {
        title: 'Где позавтракать в Кишинёве',
        excerpt:
          'Заведения, в которых завтрак — отдельный раздел меню, а не просто кофе с круассаном. С адресами и ориентировочными ценами.',
        body: [
          'Завтракать вне дома в Кишинёве дешевле, чем кажется: полный завтрак в кофейне стоит примерно столько же, сколько обед в бистро. В каталоге отметку «завтраки» имеют только заведения, где это заявлено на собственном сайте — обычно с отдельным разделом меню и временными рамками.',
          'Тип завтрака стоит выбрать заранее. Кофейни дают классический формат: яичница, сырники, тосты, кофе. Рестораны вроде La Plăcinte и Oliva предлагают более сытные блюда и открываются рано. Есть и промежуточный вариант — пекарни, где завтрак состоит из выпечки, зато кофе обычно дешевле.',
          'Второй критерий — время. Большинство мест подаёт завтраки до 11:00–12:00, в выходные чуть дольше. Если просыпаетесь поздно, ищите заведения, где завтрак подают весь день, или просто смотрите на обычное меню.',
          'Ниже — несколько проверенных адресов; в карточках есть график работы и ориентировочные цены с сайтов заведений.',
        ],
      },
      ro: {
        title: 'Unde iei micul dejun în Chișinău',
        excerpt:
          'Localuri în care micul dejun e o secțiune separată de meniu, nu doar o cafea cu un croissant. Cu adrese și prețuri orientative.',
        body: [
          'Micul dejun în oraș costă la Chișinău mai puțin decât pare: un mic dejun complet la cafenea costă cam cât un prânz la bistro. În catalog, eticheta „mic dejun” o au doar localurile care anunță acest lucru pe propriul site — de obicei cu o secțiune separată de meniu și un interval orar.',
          'Tipul micului dejun merită ales din timp. Cafenelele oferă formatul clasic: omletă, clătite cu brânză, toast, cafea. Restaurante precum La Plăcinte și Oliva propun preparate mai consistente și se deschid devreme. Există și o variantă intermediară — patiseriile, unde micul dejun înseamnă produse de panificație, în schimb cafeaua e de obicei mai ieftină.',
          'Al doilea criteriu e ora. Majoritatea locurilor servesc micul dejun până la 11:00–12:00, în weekend puțin mai mult. Dacă te trezești târziu, caută localurile care servesc mic dejun toată ziua sau uită-te pur și simplu la meniul obișnuit.',
          'Mai jos — câteva adrese verificate; în carduri găsești programul și prețurile orientative de pe site-urile localurilor.',
        ],
      },
    },
  },
  {
    id: 'article-26',
    slug: 'food-delivery-chisinau',
    title: 'Доставка їжі в Кишиневі: заклади з власною доставкою',
    excerpt:
      'Піца, суші, бургери й домашня кухня з доставкою — умови й вартість із сайтів самих закладів.',
    body: [
      'Доставка в Кишиневі працює двома способами: через агрегатори та напряму з сайту закладу. Другий варіант зазвичай вигідніший — немає націнки сервісу, а багато ресторанів дають безкоштовну доставку від певної суми.',
      'Типові умови виглядають так: доставка в межах міста коштує 40–60 лей, безкоштовна — від 400–550 лей. Деякі мережі працюють цілодобово, інші приймають замовлення до 22:45–23:00, тож пізно ввечері вибір звужується. У каталозі позначку «доставка» мають 18 закладів — лише ті, хто заявляє власну службу на своєму сайті.',
      'Якщо замовляєте на компанію, зверніть увагу на банкетні та сімейні набори: вони майже завжди вигідніші за ту саму кількість окремих позицій.',
      'Нижче — перевірені заклади з доставкою; у картках є посилання на сайт, де вказані актуальні умови та зона доставки.',
    ],
    category: 'food',
    placeSlugs: ['andys-pizza-moscova', 'esushi-dacia', 'torro-burgers-puskin', 'citypizza-mircea-cel-batran'],
    keywords: ['доставка їжі Кишинів', 'доставка піци Кишинів', 'доставка суші', 'замовити їжу додому', 'доставка цілодобово'],
    publishedAt: '2026-11-10',
    i18n: {
      ru: {
        title: 'Доставка еды в Кишинёве: заведения с собственной доставкой',
        excerpt:
          'Пицца, суши, бургеры и домашняя кухня с доставкой — условия и стоимость с сайтов самих заведений.',
        body: [
          'Доставка в Кишинёве работает двумя способами: через агрегаторы и напрямую с сайта заведения. Второй вариант обычно выгоднее — нет наценки сервиса, а многие рестораны дают бесплатную доставку от определённой суммы.',
          'Типичные условия выглядят так: доставка в пределах города стоит 40–60 леев, бесплатная — от 400–550 леев. Некоторые сети работают круглосуточно, другие принимают заказы до 22:45–23:00, так что поздно вечером выбор сужается. В каталоге отметку «доставка» имеют 18 заведений — только те, кто заявляет собственную службу на своём сайте.',
          'Если заказываете на компанию, обратите внимание на банкетные и семейные наборы: они почти всегда выгоднее того же количества отдельных позиций.',
          'Ниже — проверенные заведения с доставкой; в карточках есть ссылка на сайт, где указаны актуальные условия и зона доставки.',
        ],
      },
      ro: {
        title: 'Livrare de mâncare în Chișinău: localuri cu livrare proprie',
        excerpt:
          'Pizza, sushi, burgeri și bucătărie de casă cu livrare — condiții și costuri de pe site-urile localurilor.',
        body: [
          'Livrarea la Chișinău funcționează în două feluri: prin agregatori și direct de pe site-ul localului. A doua variantă e de regulă mai avantajoasă — nu are adaosul serviciului, iar multe restaurante oferă livrare gratuită peste o anumită sumă.',
          'Condițiile tipice arată așa: livrarea în oraș costă 40–60 de lei, iar de la 400–550 de lei devine gratuită. Unele rețele lucrează non-stop, altele primesc comenzi până la 22:45–23:00, așa că seara târziu opțiunile se reduc. În catalog, eticheta „livrare” o au 18 localuri — doar cele care anunță serviciu propriu pe site-ul lor.',
          'Dacă dai comandă pentru un grup, uită-te la platourile de banchet și la seturile de familie: aproape întotdeauna sunt mai avantajoase decât aceleași produse luate separat.',
          'Mai jos — localuri verificate cu livrare; în carduri găsești linkul către site, unde sunt condițiile actuale și zona de livrare.',
        ],
      },
    },
  },
  {
    id: 'article-27',
    slug: 'cheap-eats-chisinau',
    title: 'Де недорого поїсти в Кишиневі',
    excerpt:
      'Плацинди, ковриги, піца й домашня кухня в бюджетному сегменті — з орієнтовними цінами з меню закладів.',
    body: [
      'Кишинів — одне з небагатьох європейських міст, де повноцінно пообідати можна за 100–150 лей. Найдешевший сегмент — традиційна молдовська кухня та вулична випічка: плацинда або ковриг коштують у межах 20–50 лей, і цього часто вистачає замість перекусу.',
      'Наступний рівень — сімейні бістро й піцерії з домашньою кухнею: суп, друга страва й компот укладаються приблизно в ту саму сотню. У каталозі ціновий рівень «$» мають 28 закладів, і для багатьох із них є орієнтовні ціни, узяті просто з меню на сайті.',
      'Окремо варто знати про бізнес-ланчі: у низці ресторанів вони коштують 130–150 лей і включають кілька страв, тобто вигідніші за замовлення тих самих позицій окремо. Працюють зазвичай у будні з 11:00 до 16:00.',
      'Нижче — кілька перевірених бюджетних місць. Повний список — фільтр ціни «$» у категорії «Їжа».',
    ],
    category: 'food',
    placeSlugs: ['covrigo-zelinski', 'la-mamuca-stefan-cel-mare', 'citypizza-mircea-cel-batran', 'cafe-mon-ami'],
    keywords: ['недорого поїсти Кишинів', 'дешеве кафе Кишинів', 'бізнес-ланч Кишинів', 'плацинди', 'бюджетний обід'],
    publishedAt: '2026-11-10',
    i18n: {
      ru: {
        title: 'Где недорого поесть в Кишинёве',
        excerpt:
          'Плацинды, ковриги, пицца и домашняя кухня в бюджетном сегменте — с ориентировочными ценами из меню заведений.',
        body: [
          'Кишинёв — один из немногих европейских городов, где полноценно пообедать можно за 100–150 леев. Самый дешёвый сегмент — традиционная молдавская кухня и уличная выпечка: плацинда или ковриг стоят в пределах 20–50 леев, и этого часто хватает вместо перекуса.',
          'Следующий уровень — семейные бистро и пиццерии с домашней кухней: суп, второе и компот укладываются примерно в ту же сотню. В каталоге ценовой уровень «$» имеют 28 заведений, и для многих из них есть ориентировочные цены, взятые прямо из меню на сайте.',
          'Отдельно стоит знать о бизнес-ланчах: в ряде ресторанов они стоят 130–150 леев и включают несколько блюд, то есть выгоднее заказа тех же позиций отдельно. Работают обычно в будни с 11:00 до 16:00.',
          'Ниже — несколько проверенных бюджетных мест. Полный список — фильтр цены «$» в категории «Еда».',
        ],
      },
      ro: {
        title: 'Unde mănânci ieftin în Chișinău',
        excerpt:
          'Plăcinte, covrigi, pizza și bucătărie de casă în segmentul accesibil — cu prețuri orientative din meniurile localurilor.',
        body: [
          'Chișinăul e unul dintre puținele orașe europene unde poți lua un prânz complet cu 100–150 de lei. Segmentul cel mai ieftin îl reprezintă bucătăria tradițională moldovenească și patiseria stradală: o plăcintă sau un covrig costă între 20 și 50 de lei, iar de multe ori asta ține loc de gustare.',
          'Nivelul următor sunt bistrourile de familie și pizzeriile cu bucătărie de casă: o supă, un fel principal și o compoziție se încadrează cam în aceeași sută. În catalog, nivelul de preț „$” îl au 28 de localuri, iar pentru multe dintre ele există prețuri orientative, luate direct din meniul de pe site.',
          'Merită știut și despre business lunch: în mai multe restaurante costă 130–150 de lei și include câteva feluri, deci e mai avantajos decât aceleași preparate comandate separat. De obicei funcționează în zilele lucrătoare, între 11:00 și 16:00.',
          'Mai jos — câteva locuri accesibile și verificate. Lista completă — filtrul de preț „$” din categoria „Mâncare”.',
        ],
      },
    },
  },
];
