import { db } from '@/server/db'
import * as schema from '@/server/db/schema'
import {genres, filmsToGenres, filmsToGenresRelations, genresRelations} from '@/server/db/schema/genre'
import {watchlist, watchlistRelations} from '@/server/db/schema/watchlist'
import {users, usersRelations, sessions, accounts} from '@/server/db/schema/users'
import {diary, diaryRelations} from '@/server/db/schema/diary'
import {persons, personsRelations} from '@/server/db/schema/persons'
import {reviews, reviewsRelations} from '@/server/db/schema/reviews'
import {films, filmsRelations, movieCastRelations, movieCast, movieCrewRelations, movieCrew} from '@/server/db/schema/films'
import slugify from 'slugify'
import bcrypt from 'bcrypt'
import { faker } from '@faker-js/faker'


const MOVIES = [
    {
        title: 'Битва за битвой',
        originalTitle: 'One Battle After Another',
        alternativeTitles: ['One Battle After Another', 'Битва за битвой'],
        description:
            'В 2000-х Пэт Калхун вместе со своей девушкой состоял в леворадикальной экстремистской группировке. 16 лет спустя мужчина живёт в Южной Калифорнии под именем Боб Фергюсон и воспитывает дочь-подростка, которая оказывается в опасности, когда старый противник начинает охоту.',
        posterUrl:
            'https://a.ltrbxd.com/resized/film-poster/9/5/1/2/7/7/951277-one-battle-after-another-0-460-0-690-crop.jpg',
        bannerUrl:
            'https://a.ltrbxd.com/resized/alternative-backdrop/9/5/1/2/7/7/tmdb/ev06XwWLSoTG2DkLlsllAhlWGsk-1200-1200-675-675-crop-000000.jpg',
        year: 2025,
        duration: 162,
        rating: 4.2,
        country: 'США',
        genres: ['Война', 'Драма', 'Боевик'],
        directors: ['Пол Томас Андерсон'],
        actors: [
            {
                fullName: 'Леонардо Ди Каприо',
                character: 'Боб',
                order: 1,
            },
            {
                fullName: 'Шон Пенн',
                character: 'Полковник Стивен Дж. Локджо',
                order: 2,
            },
            {
                fullName: 'Чейз Инфинити',
                character: 'Вилла',
                order: 3,
            },
            {
                fullName: 'Бенисио дель Торо',
                character: 'Сэнсэй Серджио Ст. Карлос',
                order: 4,
            },
            {
                fullName: 'Реджина Холл',
                character: 'Диандра',
                order: 5,
            },
            {
                fullName: 'Тейана Тейлор',
                character: 'Перфидия',
                order: 6,
            },
        ],
    },
    {
        title: 'Маленькие женщины',
        originalTitle: 'Little Women',
        alternativeTitles: ['Little Women', 'Маленькие женщины'],
        description:
            'Американский драматический фильм о взрослении четырёх сестёр Марч после Гражданской войны в США, их семейных отношениях, любви, трудностях взросления и самоопределении. Экранизация романа Луизы Мэй Олкотт (1868).',
        posterUrl:
            'https://a.ltrbxd.com/resized/sm/upload/r4/np/q5/te/mSmiB8XjUnR1GSIljuCPGsk0cwX-0-460-0-690-crop.jpg',
        bannerUrl:
            'https://a.ltrbxd.com/resized/sm/upload/st/1k/ed/14/little-women-2019-1200-1200-675-675-crop-000000.jpg',
        year: 2019,
        duration: 135,
        rating: 4.2,
        country: 'США',
        genres: ['Драма', 'Мелодрама'],
        directors: ['Грета Гервиг'],
        actors: [
            {
                fullName: 'Сирша Ронан',
                character: 'Джозефина "Джо" Марч',
                order: 1,
            },
            {
                fullName: 'Эмма Уотсон',
                character: 'Маргарет "Мег" Марч',
                order: 2,
            },
            {
                fullName: 'Флоренс Пью',
                character: 'Эми Марч',
                order: 3,
            },
            {
                fullName: 'Элайза Сканлен',
                character: 'Элизабет "Бет" Марч',
                order: 4,
            },
            {
                fullName: 'Лора Дерн',
                character: 'Марми Марч',
                order: 5,
            },
            {
                fullName: 'Тимоти Шаламе',
                character: 'Теодор "Лори" Лоуренс',
                order: 6,
            },
        ],
    },
    {
        title: 'Пролетая над гнездом кукушки',
        originalTitle: "One Flew Over the Cuckoo's Nest",
        alternativeTitles: [
            "One Flew Over the Cuckoo's Nest",
            'Пролетая над гнездом кукушки',
        ],
        description:
            'Обладая харизмой и бунтарством, преступник Рэндл П. Макмерфи попадает в психбольницу и противостоит строгому режиму медсестры Рэтчет.',
        posterUrl:
            'https://a.ltrbxd.com/resized/sm/upload/lf/ry/hy/2e/RHteRHXqym9f0gI4cmChbFOxD-0-2000-0-3000-crop.jpg?v=1e6a37509a',
        bannerUrl:
            'https://a.ltrbxd.com/resized/sm/upload/9q/8o/xb/41/one-flew-over-cuckoos-nest-1200-1200-675-675-crop-000000.jpg',
        year: 1975,
        duration: 133,
        rating: 4.4,
        country: 'США',
        genres: ['Драма'],
        directors: ['Милош Форман'],
        actors: [
            {
                fullName: 'Джек Николсон',
                character: 'Рэндл Макмерфи',
                order: 1,
            },
            {
                fullName: 'Луиза Флетчер',
                character: 'Сестра Рэтчед',
                order: 2,
            },
            {
                fullName: 'Уильям Редфилд',
                character: 'Дейл Хардинг',
                order: 3,
            },
            {
                fullName: 'Брэд Дуриф',
                character: 'Билли Биббит',
                order: 4,
            },
            {
                fullName: 'Дэнни ДеВито',
                character: 'Мартини',
                order: 5,
            },
            {
                fullName: 'Кристофер Ллойд',
                character: 'Макс Тэйбер',
                order: 6,
            },
        ],
    },
    {
        title: 'Казино',
        originalTitle: 'Casino',
        alternativeTitles: ['Casino', 'Казино'],
        description:
            'Эпическая криминальная драма Мартина Скорсезе о внутреннем устройстве мафии в Лас-Вегасе и падении гангстерских империй через азарт, предательство и власть.',
        posterUrl:
            'https://a.ltrbxd.com/resized/sm/upload/6p/om/dp/mc/casino-original-0-460-0-690-crop.jpg',
        bannerUrl:
            'https://a.ltrbxd.com/resized/sm/upload/4x/k7/eg/7o/casino-1200-1200-675-675-crop-000000.jpg',
        year: 1995,
        duration: 178,
        rating: 4.2,
        country: 'США',
        genres: ['Crime', 'Drama'],
        directors: ['Мартин Скорсезе'],
        actors: [
            {
                fullName: 'Роберт Де Ниро',
                character: "Сэм 'Туз' Ротштейн",
                order: 1,
            },
            {
                fullName: 'Шэрон Стоун',
                character: 'Джинджер Маккенна',
                order: 2,
            },
            {
                fullName: 'Джо Пеши',
                character: 'Ники Санторо',
                order: 3,
            },
            {
                fullName: 'Джеймс Вудс',
                character: 'Лестер Даймонд',
                order: 4,
            },
            {
                fullName: 'Кевин Поллак',
                character: 'Филлип Грин',
                order: 5,
            },
            {
                fullName: 'Дон Риклз',
                character: 'Билли Шерберт',
                order: 6,
            },
        ],
    },
    {
        title: 'Солнцестояние',
        originalTitle: 'Midsommar',
        alternativeTitles: ['Midsommar', 'Солнцестояння', 'Солнцестояние'],
        description:
            'Пара молодых американцев и их друзья отправляются в Швецию на уникальный фестиваль середины лета, но празднование превращается в ужасное испытание, когда они сталкиваются с древними культами и ужасными ритуалами.',
        posterUrl:
            'https://a.ltrbxd.com/resized/film-poster/4/5/9/5/6/4/459564-midsommar-0-460-0-690-crop.jpg',
        bannerUrl:
            'https://a.ltrbxd.com/resized/sm/upload/5q/jr/xl/0r/midsommar-1200-1200-675-675-crop-000000.jpg',
        year: 2019,
        duration: 147,
        rating: 3.7,
        country: 'США, Швеция',
        genres: ['Ужасы', 'Триллер', 'Драма'],
        directors: ['Ари Астер'],
        actors: [
            {
                fullName: 'Флоренс Пью',
                character: 'Дэни Ардор',
                order: 1,
            },
            {
                fullName: 'Джек Рейнор',
                character: 'Кристиан Хьюз',
                order: 2,
            },
            {
                fullName: 'Уилл Поултер',
                character: 'Марк',
                order: 3,
            },
            {
                fullName: 'Уильям Джексон Харпер',
                character: 'Джош',
                order: 4,
            },
            {
                fullName: 'Вильгельм Бломгрен',
                character: 'Пелле',
                order: 5,
            },
            {
                fullName: 'Эллора Торчия',
                character: 'Конни',
                order: 6,
            },
        ],
    },
    {
        title: 'Хорошо быть тихоней',
        originalTitle: 'The Perks of Being a Wallflower',
        alternativeTitles: [
            'The Perks of Being a Wallflower',
            'Хорошо быть тихоней',
        ],
        description:
            'История о застенчивом подростке Чарли, который находит поддержку и дружбу у двух старших школьников, переживая трудности взросления, семейные травмы и самоопределение.',
        posterUrl:
            'https://a.ltrbxd.com/resized/film-poster/7/1/3/3/8/71338-the-perks-of-being-a-wallflower-0-460-0-690-crop.jpg',
        bannerUrl:
            'https://a.ltrbxd.com/resized/alternative-backdrop/7/1/3/3/8/tmdb/rusdnkVpMzHOhbED1E1XqEPKdw9-1200-1200-675-675-crop-000000.jpg',
        year: 2012,
        duration: 103,
        rating: 4.0,
        country: 'США',
        genres: ['Драма', 'Мелодрама'],
        directors: ['Стивен Чбоски'],
        actors: [
            {
                fullName: 'Логан Лерман',
                character: 'Чарли Кельмекис',
                order: 1,
            },
            {
                fullName: 'Эмма Уотсон',
                character: 'Сэм',
                order: 2,
            },
            {
                fullName: 'Эзра Миллер',
                character: 'Патрик',
                order: 3,
            },
            {
                fullName: 'Мэй Уитман',
                character: 'Мэри Элизабет',
                order: 4,
            },
            {
                fullName: 'Нина Добрев',
                character: 'Кэндис Кельмекис',
                order: 5,
            },
            {
                fullName: 'Пол Радд',
                character: 'Мистер Андерсон',
                order: 6,
            },
        ],
    },
    {
        title: 'Славные парни',
        originalTitle: 'Goodfellas',
        alternativeTitles: ['Goodfellas', 'Славные парни'],
        description:
            'Культовая гангстерская драма о жизни в мафии от восхождения и власти до предательства и падения, через призму реальных событий и персонажей.',
        posterUrl:
            'https://a.ltrbxd.com/resized/film-poster/5/1/3/8/3/51383-goodfellas-0-460-0-690-crop.jpg',
        bannerUrl:
            'https://a.ltrbxd.com/resized/sm/upload/ws/2f/hj/8v/goodfellas-1200-1200-675-675-crop-000000.jpg',
        year: 1990,
        duration: 146,
        rating: 4.5,
        country: 'США',
        genres: ['Криминал', 'Драма'],
        directors: ['Мартин Скорсезе'],
        actors: [
            {
                fullName: 'Рэй Лиотта',
                character: 'Генри Хилл',
                order: 1,
            },
            {
                fullName: 'Роберт Де Ниро',
                character: 'Джеймс "Джимми" Конвей',
                order: 2,
            },
            {
                fullName: 'Джо Пеши',
                character: 'Томми ДеВито',
                order: 3,
            },
            {
                fullName: 'Лоррейн Бракко',
                character: 'Карен Хилл',
                order: 4,
            },
            {
                fullName: 'Пол Сорвино',
                character: 'Поли Сицеро',
                order: 5,
            },
            {
                fullName: 'Фрэнк Винсент',
                character: 'Билли Бэттс',
                order: 6,
            },
        ],
    },
    {
        title: 'Таксист',
        originalTitle: 'Taxi Driver',
        alternativeTitles: ['Taxi Driver', 'Таксист'],
        description:
            'Психологическая драма о ветеране Вьетнама, который работает таксистом в ночном Нью-Йорке и постепенно сходит с ума, пытаясь очистить город от «грязи».',
        posterUrl:
            'https://a.ltrbxd.com/resized/film-poster/5/1/9/4/7/51947-taxi-driver-0-460-0-690-crop.jpg',
        bannerUrl:
            'https://a.ltrbxd.com/resized/sm/upload/tu/1i/09/tr/taxi-driver-40-1200-1200-675-675-crop-000000.jpg',
        year: 1976,
        duration: 114,
        rating: 4.1,
        country: 'США',
        genres: ['Драма', 'Криминал'],
        directors: ['Мартин Скорсезе'],
        actors: [
            {
                fullName: 'Роберт Де Ниро',
                character: 'Трэвис Бикл',
                order: 1,
            },
            {
                fullName: 'Джоди Фостер',
                character: 'Айрис "Изи" Стинсма',
                order: 2,
            },
            {
                fullName: 'Сибилл Шеперд',
                character: 'Бэтси',
                order: 3,
            },
            {
                fullName: 'Харви Кейтель',
                character: 'Мэтью "Спот" Хиггинс',
                order: 4,
            },
            {
                fullName: 'Альберт Брукс',
                character: 'Том',
                order: 5,
            },
            {
                fullName: 'Питер Бойл',
                character: 'Уизард',
                order: 6,
            },
        ],
    },
    {
        title: 'Марти великолепный',
        originalTitle: 'Marty Supreme',
        alternativeTitles: ['Marty Supreme', 'Марти великолепный'],
        description:
            'В 1950-х в Нью-Йорке молодой человек Марти Маузер стремится к величию, несмотря на то, что никто не верит в его мечту. История о преодолении, страсти и самоутверждении.',
        posterUrl:
            'https://a.ltrbxd.com/resized/film-poster/1/1/9/7/4/9/9/1197499-marty-supreme-0-460-0-690-crop.jpg',
        bannerUrl:
            'https://a.ltrbxd.com/resized/sm/upload/9v/j7/mm/yn/marty-sup-1200-1200-675-675-crop-000000.jpg',
        year: 2025,
        duration: 130,
        rating: 4.1,
        country: 'США',
        genres: ['Драма', 'Биография'],
        directors: ['Джош Сэфди'],
        actors: [
            {
                fullName: 'Тимоти Шаламе',
                character: 'Марти Маузер',
                order: 1,
            },
            { fullName: 'Гвинет Пэлтроу', character: 'Мисс Коллинз', order: 2 },
            { fullName: "Одесса А'Зион", character: 'Рита', order: 3 },
            { fullName: "Кевин О'Лири", character: 'Мистер Сондерс', order: 4 },
            { fullName: 'Абель Феррара', character: 'Отец Джозеф', order: 5 },
            { fullName: 'Фрэн Дрешер', character: 'Миссис Коэн', order: 6 },
        ],
    },
    {
        title: 'Однажды в Америке',
        originalTitle: 'Once Upon a Time in America',
        alternativeTitles: ['Once Upon a Time in America', 'Однажды в Америке'],
        description:
            'Эпическая криминальная сага о дружбе и предательстве группы еврейских гангстеров в Нью-Йорке. История охватывает несколько десятилетий - от детства героев в 1920‑х до их взрослой жизни, наполненной преступлениями, любовью и сожалениями.',
        posterUrl:
            'https://a.ltrbxd.com/resized/film-poster/5/1/7/4/8/51748-once-upon-a-time-in-america-0-2000-0-3000-crop.jpg?v=803d65b52c',
        bannerUrl:
            'https://a.ltrbxd.com/resized/sm/upload/1f/n2/rx/0s/image%20(5)-1200-1200-675-675-crop-000000.jpg',
        year: 1984,
        duration: 229,
        rating: 4.2,
        country: 'США',
        genres: ['Криминал', 'Драма'],
        directors: ['Серджо Леоне'],
        actors: [
            {
                fullName: 'Роберт Де Ниро',
                character: 'Дэвид «Лапша» Ааронсон',
                order: 1,
            },
            {
                fullName: 'Джеймс Вудс',
                character: 'Максимилиан «Макс» Берковиц',
                order: 2,
            },
            {
                fullName: 'Элизабет Макговерн',
                character: 'Дебора Гелли',
                order: 3,
            },
            { fullName: 'Джо Пеши', character: 'Фрэнки Мональди', order: 4 },
            { fullName: 'Берт Янг', character: 'Джо', order: 5 },
            { fullName: 'Тьюсдей Уэлд', character: 'Кэрол', order: 6 },
        ],
    },
    {
        title: 'Арахисовый сокол',
        originalTitle: 'The Peanut Butter Falcon',
        alternativeTitles: ['The Peanut Butter Falcon', 'Арахисовый сокол'],
        description:
            'Зак, молодой человек с синдромом Дауна, сбегает из дома престарелых, чтобы осуществить свою мечту - стать рестлером. По пути он встречает беглого преступника Тайлерa, который становится его партнёром, и вместе с доброй соцработницей Элеонор они отправляются в приключение вдоль американских водных путей.',
        posterUrl:
            'https://a.ltrbxd.com/resized/sm/upload/oq/hs/fz/xj/qyQcRGvdW3VtxHR4fSDgPOePEip-0-2000-0-3000-crop.jpg?v=286844cae3',
        bannerUrl:
            'https://a.ltrbxd.com/resized/sm/upload/f6/m8/4j/9o/peanut-butter-falcon-1200-1200-675-675-crop-000000.jpg',
        year: 2019,
        duration: 97,
        rating: 3.8,
        country: 'США',
        genres: ['Приключения', 'Комедия', 'Драма'],
        directors: ['Тайлер Нилсон', 'Майкл Шварц'],
        actors: [
            { fullName: 'Зак Готтзаген', character: 'Зак', order: 1 },
            { fullName: 'Шайа Лабаф', character: 'Тайлер', order: 2 },
            { fullName: 'Дакота Джонсон', character: 'Элеанор', order: 3 },
            {
                fullName: 'Томас Хейден Чёрч',
                character: 'Солёный Реднек',
                order: 4,
            },
            { fullName: 'Брюс Дерн', character: 'Карл', order: 5 },
            { fullName: 'Джон Хоукс', character: 'Дункан', order: 6 },
        ],
    },
    {
        title: 'Назад в будущее',
        originalTitle: 'Back to the Future',
        alternativeTitles: ['Back to the Future', 'Назад в будущее'],
        description:
            'Подросток Марти МакФлай случайно отправляется из 1985 года в 1955-й на машине времени, созданной эксцентричным ученым Доком Брауном. Там он встречает молодые версии своих родителей и случайно вмешивается в их знакомство, рискуя стереть собственное существование.',
        posterUrl:
            'https://a.ltrbxd.com/resized/film-poster/5/1/9/4/5/51945-back-to-the-future-0-2000-0-3000-crop.jpg?v=b818c8ce28',
        bannerUrl:
            'https://a.ltrbxd.com/resized/sm/upload/wg/aa/he/wf/back-to-the-future-1200-1200-675-675-crop-000000.jpg',
        year: 1985,
        duration: 116,
        rating: 4.2,
        country: 'США',
        genres: ['Приключения', 'Комедия', 'Научная фантастика'],
        directors: ['Роберт Земекис'],
        actors: [
            {
                fullName: 'Майкл Дж. Фокс',
                character: 'Марти МакФлай',
                order: 1,
            },
            {
                fullName: 'Кристофер Ллойд',
                character: 'Доктор Эммет Браун',
                order: 2,
            },
            {
                fullName: 'Лиа Томпсон',
                character: 'Лоррейн Бейнс',
                order: 3,
            },
            {
                fullName: 'Криспин Гловер',
                character: 'Джордж МакФлай',
                order: 4,
            },
            {
                fullName: 'Томас Ф. Уилсон',
                character: 'Биф Таннен',
                order: 5,
            },
            {
                fullName: 'Клаудия Уэллс',
                character: 'Дженнифер Паркер',
                order: 6,
            },
        ],
    },
    {
        title: '12 разгневанных мужчин',
        originalTitle: '12 Angry Men',
        alternativeTitles: ['12 Angry Men', '12 разгневанных мужчин'],
        description:
            'Американская юридическая драма о двенадцати присяжных, обсуждающих дело о предполагаемом убийстве отца его сыном и пытающихся прийти к единогласному вердикту, сталкиваясь с предубеждениями и сомнениями каждого из них.',
        posterUrl:
            'https://a.ltrbxd.com/resized/film-poster/5/1/7/0/0/51700-12-angry-men-0-460-0-690-crop.jpg',
        bannerUrl:
            'https://a.ltrbxd.com/resized/sm/upload/h5/vs/mz/mj/12-angry-men-1200-1200-675-675-crop-000000.jpg',
        year: 1957,
        duration: 96,
        rating: 4.6,
        country: 'США',
        genres: ['Драма', 'Криминал'],
        directors: ['Сидни Люмет'],
        actors: [
            { fullName: 'Генри Фонда', character: 'Присяжный №8', order: 1 },
            { fullName: 'Мартин Балсам', character: 'Присяжный №1', order: 2 },
            { fullName: 'Джон Фидлер', character: 'Присяжный №2', order: 3 },
            { fullName: 'Ли Дж. Кобб', character: 'Присяжный №3', order: 4 },
            { fullName: 'Э. Дж. Маршалл', character: 'Присяжный №4', order: 5 },
            { fullName: 'Джек Клагман', character: 'Присяжный №5', order: 6 },
        ],
    },
    {
        title: 'Оставленные',
        originalTitle: 'The Holdovers',
        alternativeTitles: ['The Holdovers', 'Оставленные'],
        description:
            'В декабре 1970 года строгий преподаватель истории в престижной школе-интернате Новой Англии вынужден остаться на кампусе во время рождественских каникул, чтобы присматривать за оставшимися студентами. Сначала между ними нет общего языка, но со временем он начинает формировать неожиданные связи с одним из учеников и школьной поварихой, переживающей тяжёлую утрату.',
        posterUrl:
            'https://a.ltrbxd.com/resized/film-poster/7/5/5/5/6/4/755564-the-holdovers-0-460-0-690-crop.jpg',
        bannerUrl:
            'https://a.ltrbxd.com/resized/sm/upload/w7/tw/8s/e8/IMG_3085-1200-1200-675-675-crop-000000.jpg',
        year: 2023,
        duration: 133,
        rating: 4.3,
        country: 'США',
        genres: ['Комедия', 'Драма'],
        directors: ['Александр Пэйн'],
        actors: [
            { fullName: 'Пол Джаматти', character: 'Пол Ханэм', order: 1 },
            {
                fullName: "Да'Вин Джой Рэндольф",
                character: 'Мэри Лэмб',
                order: 2,
            },
            { fullName: 'Доминик Сесса', character: 'Ангус Талли', order: 3 },
            { fullName: 'Кэрри Престон', character: 'Лидия Крейн', order: 4 },
            { fullName: 'Брэйди Хепнер', character: 'Студент', order: 5 },
            { fullName: 'Иэн Долли', character: 'Студент', order: 6 },
        ],
    },
    {
        title: 'Апокалипсис сегодня',
        originalTitle: 'Apocalypse Now',
        alternativeTitles: ['Apocalypse Now', 'Апокалипсис сегодня'],
        description:
            'Эпическое антивоенное кино о капитане армии США, посланном на задание найти и устранить отставшего от армии полковника Кёрца, чье присутствие в джунглях Камбоджи вызывает вопросы о природе войны, морали и безумии.',
        posterUrl:
            'https://a.ltrbxd.com/resized/film-poster/2/6/9/0/2690-apocalypse-now-0-460-0-690-crop.jpg',
        bannerUrl:
            'https://a.ltrbxd.com/resized/sm/upload/d4/5v/ik/es/apocalypse-now-1200-1200-675-675-crop-000000.jpg',
        year: 1979,
        duration: 153,
        rating: 4.4,
        country: 'США',
        genres: ['Война', 'Драма'],
        directors: ['Фрэнсис Форд Коппола'],
        actors: [
            {
                fullName: 'Мартин Шин',
                character: 'Капитан Бенджамин Уиллард',
                order: 1,
            },
            {
                fullName: 'Марлон Брандо',
                character: 'Полковник Уолтер Курц',
                order: 2,
            },
            {
                fullName: 'Роберт Дюваль',
                character: 'Подполковник Билл Килгор',
                order: 3,
            },
            {
                fullName: 'Лоренс Фишбёрн',
                character: 'Тайрон «Чистый» Миллер',
                order: 4,
            },
            {
                fullName: 'Фредерик Форрест',
                character: 'Джей «Шеф» Хикс',
                order: 5,
            },
            { fullName: 'Деннис Хоппер', character: 'Фоторепортёр', order: 6 },
        ],
    },
    {
        title: 'Большой куш',
        originalTitle: 'Snatch',
        alternativeTitles: ['Snatch', 'Большой куш'],
        description:
            'Несколько историй переплетаются вокруг украденного бриллианта и подпольных боёв без правил. Боксёрский промоутер Турецкий, русский криминальный авторитет и другие персонажи сталкиваются в поисках драгоценности, что запускает цепь комичных и опасных событий в лондонском преступном мире.',
        posterUrl:
            'https://a.ltrbxd.com/resized/sm/upload/6p/tf/oh/ao/on9JlbGEccLsYkjeEph2Whm1DIp-0-460-0-690-crop.jpg',
        bannerUrl:
            'https://a.ltrbxd.com/resized/sm/upload/6t/20/ji/66/snatch-1200-1200-675-675-crop-000000.jpg',
        year: 2000,
        duration: 102,
        rating: 4.0,
        country: 'Великобритания',
        genres: ['Криминал', 'Комедия'],
        directors: ['Гай Ричи'],
        actors: [
            { fullName: 'Джейсон Стэтхэм', character: 'Турецкий', order: 1 },
            { fullName: 'Брэд Питт', character: "Микки О'Нил", order: 2 },
            {
                fullName: 'Бенисио дель Торо',
                character: 'Фрэнки Четыре Пальца',
                order: 3,
            },
            { fullName: 'Деннис Фарина', character: 'Кузен Ави', order: 4 },
            { fullName: 'Алан Форд', character: 'Брик Топ', order: 5 },
            { fullName: 'Стивен Грэм', character: 'Томми', order: 6 },
        ],
    },
    {
        title: 'Нефть',
        originalTitle: 'There Will Be Blood',
        alternativeTitles: ['There Will Be Blood', 'Нефть'],
        description:
            'Эпическая драма режиссёра Пола Томаса Андерсона о поисках богатства и власти в быстрорастущей нефтяной индустрии начала XX века. История прослеживает путь Дэниела Плейнвью - жестокого и одержимого предпринимателя, который готов на всё ради контроля над нефтью и собственной империей.',
        posterUrl:
            'https://a.ltrbxd.com/resized/sm/upload/jg/cd/7y/f5/there%20will%20be%20blood-0-460-0-690-crop.jpg',
        bannerUrl:
            'https://a.ltrbxd.com/resized/sm/upload/9u/5h/ey/it/there-will-be-blood-1200-1200-675-675-crop-000000.jpg',
        year: 2007,
        duration: 158,
        rating: 4.5,
        country: 'США',
        genres: ['Драма', 'История'],
        directors: ['Пол Томас Андерсон'],
        actors: [
            {
                fullName: 'Дэниел Дэй-Льюис',
                character: 'Дэниел Плейнвью',
                order: 1,
            },
            { fullName: 'Пол Дано', character: 'Элай Сандей', order: 2 },
            {
                fullName: "Кевин Дж. О'Коннор",
                character: 'Генри Брандс/Пол Сандей',
                order: 3,
            },
            { fullName: 'Киаран Хайндс', character: 'Бэнди', order: 4 },
            {
                fullName: 'Диллон Фризьер',
                character: 'Х.У. Плейнвью',
                order: 5,
            },
            { fullName: 'Дэвид Уиллис', character: 'Уильям Бэнди', order: 6 },
        ],
    },
    {
        title: 'Человек-паук: Через вселенные',
        originalTitle: 'Spider-Man: Into the Spider-Verse',
        alternativeTitles: [
            'Spider-Man: Into the Spider-Verse',
            'Человек-паук: Через вселенные',
        ],
        description:
            'Бруклинский подросток Майлз Моралес неожиданно получает суперспособности Человека-паука и оказывается втянут в мультивселенную, где встречает других версий Человека-паука. Вместе они пытаются остановить злодея Кингпина и спасти миры.',
        posterUrl:
            'https://a.ltrbxd.com/resized/film-poster/2/5/1/9/4/3/251943-spider-man-into-the-spider-verse-0-460-0-690-crop.jpg',
        bannerUrl:
            'https://a.ltrbxd.com/resized/sm/upload/yd/x2/cb/mw/spider-man-into-spider-verse-1200-1200-675-675-crop-000000.jpg',
        year: 2018,
        duration: 117,
        rating: 4.4,
        country: 'США',
        genres: ['Анимация', 'Боевик', 'Приключения'],
        directors: ['Боб Персичетти', 'Питер Рэмзи', 'Родни Ротман'],
        actors: [
            {
                fullName: 'Шамейк Мур',
                character: 'Майлз Моралес / Человек-паук',
                order: 1,
            },
            {
                fullName: 'Джейк Джонсон',
                character: 'Питер Б. Паркер / Человек-паук',
                order: 2,
            },
            {
                fullName: 'Хейли Стайнфелд',
                character: 'Гвен Стейси / Женщина-паук',
                order: 3,
            },
            {
                fullName: 'Махершала Али',
                character: 'Аарон Дэвис / Бродяга',
                order: 4,
            },
            {
                fullName: 'Брайан Тайри Генри',
                character: 'Джефферсон Дэвис',
                order: 5,
            },
            { fullName: 'Лили Томлин', character: 'Мэй Паркер', order: 6 },
        ],
    },
    {
        title: 'Пойман с поличным',
        originalTitle: 'Caught Stealing',
        alternativeTitles: ['Caught Stealing', 'Пойман с поличным'],
        description:
            'Бывший бейсболист, теперь бармен, оказывается втянут в опасный криминальный мир Нью-Йорка 1990-х после того, как по просьбе соседа присматривает за его питомцем и случайно связывается с преступниками и крупными долгами.',
        posterUrl:
            'https://a.ltrbxd.com/resized/film-poster/1/1/2/9/1/9/9/1129199-caught-stealing-0-460-0-690-crop.jpg',
        bannerUrl:
            'https://a.ltrbxd.com/resized/sm/upload/la/vb/rw/do/zWO3B2CTDguZqCrVQ2u5Xnp9VRS-1200-1200-675-675-crop-000000.jpg',
        year: 2025,
        duration: 107,
        rating: 3.4,
        country: 'США',
        genres: ['Криминал', 'Триллер', 'Комедия'],
        directors: ['Даррен Аронофски'],
        actors: [
            { fullName: 'Остин Батлер', character: 'Хэнк Томпсон', order: 1 },
            {
                fullName: 'Реджина Кинг',
                character: 'Детектив Элайза Роман',
                order: 2,
            },
            { fullName: 'Зои Кравиц', character: 'Ивонн', order: 3 },
            { fullName: 'Мэтт Смит', character: 'Русс', order: 4 },
            { fullName: 'Лиев Шрайбер', character: 'Липа', order: 5 },
            { fullName: "Винсент Д'Онофрио", character: 'Шмулли', order: 6 },
        ],
    },
    {
        title: 'Проект «Аве Мария»',
        originalTitle: 'Project Hail Mary',
        alternativeTitles: [
            'Project Hail Mary',
            'Проект «Аве Мария»',
            'Проект «Конец света»',
        ],
        description:
            'Научно-фантастическая одиссея по роману Энди Уира. Одинокий астронавт просыпается на космическом корабле без памяти о том, кто он и как здесь оказался, но именно ему предстоит спасти человечество от вымирания.',
        posterUrl:
            'https://a.ltrbxd.com/resized/film-poster/6/1/1/2/8/8/611288-project-hail-mary-0-2000-0-3000-crop.jpg?v=ac31b6ec03',
        bannerUrl:
            'https://a.ltrbxd.com/resized/alternative-backdrop/6/1/1/2/8/8/tmdb/o2xLxY1LdwBMsrGD9hjIaOrIQm6-1200-1200-675-675-crop-000000.jpg',
        year: 2026,
        duration: 135,
        rating: 4.0,
        country: 'США',
        genres: ['Фантастика', 'Драма', 'Приключения'],
        directors: ['Фил Лорд', 'Кристофер Миллер'],
        actors: [
            { fullName: 'Райан Гослинг', character: 'Райланд Грейс', order: 1 },
            { fullName: 'Сандра Хюллер', character: 'Стратт', order: 2 },
        ],
    },
    {
        title: 'Формула 1',
        originalTitle: 'F1 The Movie',
        alternativeTitles: ['F1 The Movie', 'F1', 'Формула 1'],
        description:
            'История бывшего гонщика Формулы 1 Сонни Хейза, который возвращается в спорт спустя десятилетия, чтоб спасти отстающую команду APXGP и помочь молодому новичку добиться успеха на мировом уровне.',
        posterUrl:
            'https://a.ltrbxd.com/resized/film-poster/8/1/7/9/7/7/817977-f1-the-movie-0-460-0-690-crop.jpg',
        bannerUrl:
            'https://a.ltrbxd.com/resized/sm/upload/j8/ma/xb/4d/f1-1200-1200-675-675-crop-000000.jpg',
        year: 2025,
        duration: 155,
        rating: 3.7,
        country: 'США',
        genres: ['Драма', 'Спорт', 'Боевик'],
        directors: ['Джозеф Косински'],
        actors: [
            { fullName: 'Брэд Питт', character: 'Сонни Хейс', order: 1 },
            { fullName: 'Дэмсон Идрис', character: 'Джошуа Пирс', order: 2 },
            { fullName: 'Керри Кондон', character: 'Кейт Маккенна', order: 3 },
            {
                fullName: 'Хавьер Бардем',
                character: 'Рубен Сервантес',
                order: 4,
            },
            {
                fullName: 'Тобиас Мензис',
                character: 'Питер Бэннинг',
                order: 5,
            },
            { fullName: 'Ким Бодния', character: 'Каспар Смолински', order: 6 },
        ],
    },
    {
        title: 'Дюна',
        originalTitle: 'Dune',
        alternativeTitles: ['Dune', 'Дюна'],
        description:
            'Экранная адаптация первой половины культового романа Фрэнка Герберта: наследник дома Атрейдесов Пауль отправляется на пустынную планету Арракис, где сталкивается с интригами, войной и собственным предназначением.',
        posterUrl:
            'https://a.ltrbxd.com/resized/sm/upload/nx/8b/vs/gc/cDbNAY0KM84cxXhmj8f0dLWza3t-0-2000-0-3000-crop.jpg?v=49eed12751',
        bannerUrl:
            'https://a.ltrbxd.com/resized/sm/upload/a6/8b/5j/zk/dune-2021a-1200-1200-675-675-crop-000000.jpg',
        year: 2021,
        duration: 155,
        rating: 3.9,
        country: 'США',
        genres: ['Научная фантастика', 'Приключения', 'Драма'],
        directors: ['Дени Вильнёв'],
        actors: [
            {
                fullName: 'Тимоти Шаламе',
                character: 'Пол Атрейдес',
                order: 1,
            },
            {
                fullName: 'Ребекка Фергюсон',
                character: 'Леди Джессика',
                order: 2,
            },
            {
                fullName: 'Оскар Айзек',
                character: 'Герцог Лето Атрейдес',
                order: 3,
            },
            { fullName: 'Зендая', character: 'Чани', order: 4 },
            { fullName: 'Джош Бролин', character: 'Гурни Халлек', order: 5 },
            {
                fullName: 'Стеллан Скарсгард',
                character: 'Барон Владимир Харконнен',
                order: 6,
            },
        ],
    },
    {
        title: 'Джанго освобожденный',
        originalTitle: 'Django Unchained',
        alternativeTitles: ['Django Unchained', 'Джанго освобожденный'],
        description:
            'Эксцентричный вестерн Квентина Тарантино. Охотник за головами Кинг Шульц освобождает раба Джанго, чтобы тот помог ему найти преступников, в обмен на помощь в спасении жены Джанго из рук жестокого плантатора.',
        posterUrl:
            'https://a.ltrbxd.com/resized/film-poster/5/2/5/1/6/52516-django-unchained-0-2000-0-3000-crop.jpg?v=f02aed63a3',
        bannerUrl:
            'https://a.ltrbxd.com/resized/sm/upload/ke/2v/n9/i6/django-unchained-1200-1200-675-675-crop-000000.jpg',
        year: 2012,
        duration: 165,
        rating: 4.3,
        country: 'США',
        genres: ['Вестерн', 'Драма', 'Боевик'],
        directors: ['Квентин Тарантино'],
        actors: [
            { fullName: 'Джейми Фокс', character: 'Джанго', order: 1 },
            {
                fullName: 'Кристоф Вальц',
                character: 'Доктор Кинг Шульц',
                order: 2,
            },
            {
                fullName: 'Леонардо ДиКаприо',
                character: 'Кэлвин Кэнди',
                order: 3,
            },
            { fullName: 'Сэмюэл Л. Джексон', character: 'Стивен', order: 4 },
        ],
    },
    {
        title: 'Бойцовский клуб',
        originalTitle: 'Fight Club',
        alternativeTitles: ['Fight Club', 'Бойцовский клуб'],
        description:
            'Терзаемый бессонницей клерк встречает харизматичного торговца мылом Тайлера Дердена. Вместе они основывают подпольный клуб, где мужчины могут выпустить пар в драках, что постепенно перерастает в опасный анархистский заговор.',
        posterUrl:
            'https://a.ltrbxd.com/resized/film-poster/5/1/5/6/8/51568-fight-club-0-2000-0-3000-crop.jpg?v=768b32dfa4',
        bannerUrl:
            'https://a.ltrbxd.com/resized/sm/upload/b0/iz/eb/dq/fight-club-1200-1200-675-675-crop-000000.jpg',
        year: 1999,
        duration: 139,
        rating: 4.3,
        country: 'США',
        genres: ['Драма'],
        directors: ['Дэвид Финчер'],
        actors: [
            { fullName: 'Эдвард Нортон', character: 'Рассказчик', order: 1 },
            { fullName: 'Брэд Питт', character: 'Тайлер Дерден', order: 2 },
            {
                fullName: 'Хелена Бонем Картер',
                character: 'Марла Зингер',
                order: 3,
            },
            {
                fullName: 'Джаред Лето',
                character: 'Ангельское личико',
                order: 4,
            },
        ],
    },
    {
        title: 'Семь',
        originalTitle: 'Se7en',
        alternativeTitles: ['Se7en', 'Семь'],
        description:
            'Мрачный детектив о двух полицейских, идущих по следу серийного убийцы, который выбирает своих жертв на основе семи смертных грехов, превращая каждое преступление в жуткую инсталляцию.',
        posterUrl:
            'https://a.ltrbxd.com/resized/film-poster/5/1/3/4/5/51345-se7en-0-2000-0-3000-crop.jpg?v=76a14ef6b4',
        bannerUrl:
            'https://a.ltrbxd.com/resized/sm/upload/om/48/ya/8v/se7en_uLHHCJ-1200-1200-675-675-crop-000000.jpg',
        year: 1995,
        duration: 127,
        rating: 4.4,
        country: 'США',
        genres: ['Криминал', 'Триллер', 'Детектив'],
        directors: ['Дэвид Финчер'],
        actors: [
            { fullName: 'Брэд Питт', character: 'Дэвид Миллс', order: 1 },
            {
                fullName: 'Морган Фриман',
                character: 'Уильям Сомерсет',
                order: 2,
            },
            { fullName: 'Гвинет Пэлтроу', character: 'Трейси Миллс', order: 3 },
            { fullName: 'Кевин Спейси', character: 'Джон Доу', order: 4 },
        ],
    },
    {
        title: 'Побег из Шоушенка',
        originalTitle: 'The Shawshank Redemption',
        alternativeTitles: ['The Shawshank Redemption', 'Побег из Шоушенка'],
        description:
            'Банкир Энди Дюфрейн несправедливо обвинен в убийстве и приговорен к пожизненному заключению. В суровых стенах тюрьмы Шоушенк он находит дружбу, надежду и прокладывает долгий путь к свободе.',
        posterUrl:
            'https://a.ltrbxd.com/resized/sm/upload/7l/hn/46/uz/zGINvGjdlO6TJRu9wESQvWlOKVT-0-2000-0-3000-crop.jpg?v=8736d1c395',
        bannerUrl:
            'https://a.ltrbxd.com/resized/sm/upload/1y/23/4e/ir/shawshank-redemption-1200-1200-675-675-crop-000000.jpg',
        year: 1994,
        duration: 142,
        rating: 4.6,
        country: 'США',
        genres: ['Драма', 'Криминал'],
        directors: ['Фрэнк Дарабонт'],
        actors: [
            { fullName: 'Тим Роббинс', character: 'Энди Дюфрейн', order: 1 },
            {
                fullName: 'Морган Фриман',
                character: 'Эллис Бойд «Ред» Реддинг',
                order: 2,
            },
            {
                fullName: 'Боб Гантон',
                character: 'Директор Уорден Нортон',
                order: 3,
            },
            { fullName: 'Уильям Сэдлер', character: 'Хейвуд', order: 4 },
        ],
    },
    {
        title: 'Дюна: Часть вторая',
        originalTitle: 'Dune: Part Two',
        alternativeTitles: ['Dune: Part Two', 'Дюна 2'],
        description:
            'Продолжение истории Пола Атрейдеса, который объединяет силы с фременами, чтобы вернуть Арракис из рук Харконненов, столкнуться с Императором и судьбой вселенной, балансируя между любовью, властью и пророчеством.',
        posterUrl:
            'https://a.ltrbxd.com/resized/film-poster/6/1/7/4/4/3/617443-dune-part-two-0-460-0-690-crop.jpg',
        bannerUrl:
            'https://a.ltrbxd.com/resized/sm/upload/qp/uv/i4/8b/l6b9YZEokZl1nt7q0pprrur6btG-1200-1200-675-675-crop-000000.jpg',
        year: 2024,
        duration: 166,
        rating: 4.4,
        country: 'США',
        genres: ['Научная фантастика', 'Приключения', 'Драма'],
        directors: ['Дени Вильнёв'],
        actors: [
            {
                fullName: 'Тимоти Шаламе',
                character: 'Пол Атрейдес',
                order: 1,
            },
            { fullName: 'Зендая', character: 'Чани', order: 2 },
            {
                fullName: 'Ребекка Фергюсон',
                character: 'Леди Джессика',
                order: 3,
            },
            {
                fullName: 'Остин Батлер',
                character: 'Фейд-Раута Харконнен',
                order: 4,
            },
            {
                fullName: 'Флоренс Пью',
                character: 'Принцесса Ирулан',
                order: 5,
            },
            {
                fullName: 'Кристофер Уокен',
                character: 'Император Шаддам IV',
                order: 6,
            },
        ],
    },
    {
        title: '28 дней спустя',
        originalTitle: '28 Days Later',
        alternativeTitles: ['28 Days Later', '28 дней спустя'],
        description:
            'После пробуждения из комы курьер Джим обнаруживает, что Британия опустела вследствие распространения вируса "ярости", превращающего людей в агрессивных существ. Он объединяется с другими выжившими, чтобы найти безопасное место в постапокалиптическом мире.',
        posterUrl:
            'https://a.ltrbxd.com/resized/sm/upload/qr/28/nz/3f/xaYdxi1PBEAYvqknvAmMPK5Eff3-0-460-0-690-crop.jpg',
        bannerUrl:
            'https://a.ltrbxd.com/resized/sm/upload/cr/e4/du/gf/28-days-later-1200-1200-675-675-crop-000000.jpg',
        year: 2002,
        duration: 113,
        rating: 3.7,
        country: 'Великобритания',
        genres: ['Ужасы', 'Драма'],
        directors: ['Дэнни Бойл'],
        actors: [
            { fullName: 'Киллиан Мёрфи', character: 'Джим', order: 1 },
            { fullName: 'Наоми Харрис', character: 'Селена', order: 2 },
            { fullName: 'Брендан Глисон', character: 'Фрэнк', order: 3 },
            { fullName: 'Меган Бёрнс', character: 'Ханна', order: 4 },
            {
                fullName: 'Кристофер Экклстон',
                character: 'Майор Генри Уэст',
                order: 5,
            },
            { fullName: 'Ноа Хантли', character: 'Марк', order: 6 },
        ],
    },
    {
        title: '28 недель спустя',
        originalTitle: '28 Weeks Later',
        alternativeTitles: ['28 Weeks Later', '28 недель спустя'],
        description:
            'Шесть месяцев спустя после вспышки вируса Британия частично восстановлена, и в безопасную зону возвращаются выжившие. Но романтическая надежда на мирную жизнь рушится после того, как вирус снова активируется и вызывает ужасное заражение.',
        posterUrl:
            'https://a.ltrbxd.com/resized/film-poster/5/0/9/7/2/50972-28-weeks-later-0-460-0-690-crop.jpg',
        bannerUrl:
            'https://a.ltrbxd.com/resized/sm/upload/w6/8z/3s/9k/28-weeks-later-1200-1200-675-675-crop-000000.jpg',
        year: 2007,
        duration: 100,
        rating: 2.9,
        country: 'Великобритания',
        genres: ['Ужасы', 'Боевик'],
        directors: ['Хуан Карлос Фреснадильо'],
        actors: [
            { fullName: 'Роуз Бирн', character: 'Дейзи', order: 1 },
            { fullName: 'Роберт Карлайл', character: 'Дон', order: 2 },
            {
                fullName: 'Джереми Реннер',
                character: 'Майор Скарлетт Леви',
                order: 3,
            },
            { fullName: 'Идрис Эльба', character: 'Нельсон', order: 4 },
            { fullName: 'Кэтрин Маккормак', character: 'Элис', order: 5 },
            { fullName: 'Имоджен Путс', character: 'Тэмми', order: 6 },
        ],
    },
    {
        title: '28 лет спустя',
        originalTitle: '28 Years Later',
        alternativeTitles: ['28 Years Later', '28 лет спустя'],
        description:
            'Действие происходит спустя почти три десятилетия после начала эпидемии вируса "ярости". В условиях тотальной изоляции некоторое население выживает на небольшом защищённом острове. Когда мальчик Спайк вынужден отправиться на материк, он сталкивается с мутировавшими угрозами и новыми ужасами.',
        posterUrl:
            'https://a.ltrbxd.com/resized/film-poster/9/9/2/7/8/6/992786-28-years-later-0-460-0-690-crop.jpg',
        bannerUrl:
            'https://a.ltrbxd.com/resized/sm/upload/or/yw/kz/od/Iw9jQe-1200-1200-675-675-crop-000000.jpg',
        year: 2025,
        duration: 115,
        rating: 3.4,
        country: 'Великобритания/США',
        genres: ['Ужасы', 'Драма'],
        directors: ['Дэнни Бойл'],
        actors: [
            {
                fullName: 'Аарон Тейлор-Джонсон',
                character: 'Джейми',
                order: 1,
            },
            { fullName: 'Джоди Комер', character: 'Айла', order: 2 },
            {
                fullName: 'Рэйф Файнс',
                character: 'Доктор Иэн Келсон',
                order: 3,
            },
            {
                fullName: "Джек О'Коннелл",
                character: 'Сэр Джимми Кристал',
                order: 4,
            },
            { fullName: 'Алфи Уильямс', character: 'Спайк', order: 5 },
            { fullName: 'Эдвин Райдинг', character: 'Э. Сундквист', order: 6 },
        ],
    },
    {
        title: 'Ла-Ла Ленд',
        originalTitle: 'La La Land',
        alternativeTitles: ['La La Land', 'Ла-Ла Ленд'],
        description:
            'Миа, начинающая актриса, подает кофе кинозвездам между прослушиваниями, а Себастьян, джазовый музыкант, зарабатывает на жизнь играя в барах. По мере их карьерного роста им приходится принимать решения, которые испытывают их любовь и ставят под угрозу мечты, которые они так упорно старались сохранить.',
        posterUrl:
            'https://a.ltrbxd.com/resized/film-poster/2/4/0/3/4/4/240344-la-la-land-0-460-0-690-crop.jpg',
        bannerUrl:
            'https://a.ltrbxd.com/resized/sm/upload/a6/th/cz/kf/la-la-land-1200-1200-675-675-crop-000000.jpg',
        year: 2016,
        duration: 129,
        rating: 4.1,
        country: 'США',
        genres: ['Комедия', 'Драма', 'Музыка', 'Мелодрама'],
        directors: ['Дэмьен Шазелл'],
        actors: [
            {
                fullName: 'Райан Гослинг',
                character: 'Себастьян Уайлдер',
                order: 1,
            },
            { fullName: 'Эмма Стоун', character: 'Миа Долан', order: 2 },
            { fullName: 'Джон Ледженд', character: 'Кит', order: 3 },
            {
                fullName: 'Розмари ДеУитт',
                character: 'Лора Уайлдер',
                order: 4,
            },
            { fullName: 'Финн Уиттрок', character: 'Грег Эрнест', order: 5 },
            { fullName: 'Кэлли Эрнандес', character: 'Трейси', order: 6 },
        ],
    },
    {
        title: 'Харакири',
        originalTitle: 'Harakiri',
        alternativeTitles: ['Harakiri', 'Seppuku', 'Харакири'],
        description:
            'В XVII веке ронин Хансиро Цугумо приходит в поместье клана Ии и просит разрешения совершить ритуальное самоубийство. Однако за его просьбой скрывается трагическая история и желание раскрыть лицемерие самурайского кодекса чести.',
        posterUrl:
            'https://a.ltrbxd.com/resized/film-poster/4/3/0/1/5/43015-harakiri-0-2000-0-3000-crop.jpg?v=007080a0fb',
        bannerUrl:
            'https://a.ltrbxd.com/resized/sm/upload/7g/p5/0v/14/harakiri-1200-1200-675-675-crop-000000.jpg',
        year: 1962,
        duration: 133,
        rating: 4.7,
        country: 'Япония',
        genres: ['Драма', 'История'],
        directors: ['Масаки Кобаяси'],
        actors: [
            {
                fullName: 'Тацуя Накадай',
                character: 'Хансиро Цугумо',
                order: 1,
            },
            { fullName: 'Рэнтаро Микуни', character: 'Сайто Кагэю', order: 2 },
            {
                fullName: 'Акира Исихама',
                character: 'Мотоме Чидзиива',
                order: 3,
            },
            { fullName: 'Сима Ивасита', character: 'Михо Цугумо', order: 4 },
            {
                fullName: 'Тэцуро Танба',
                character: 'Хикокуро Омодака',
                order: 5,
            },
            {
                fullName: 'Итиро Накадани',
                character: 'Хаято Ядзаки',
                order: 6,
            },
        ],
    },
    {
        title: 'Армия теней',
        originalTitle: "L'Armée des ombres",
        alternativeTitles: ['Army of Shadows', 'Армия теней'],
        description:
            'Шедевр Жан-Пьера Мельвиля о французском Сопротивлении. История о чести, предательстве и невыносимом выборе людей, которые борются с оккупацией в глубоком подполье.',
        posterUrl:
            'https://a.ltrbxd.com/resized/film-poster/4/2/4/1/6/42416-army-of-shadows-0-2000-0-3000-crop.jpg?v=2eee689db8',
        bannerUrl:
            'https://a.ltrbxd.com/resized/sm/upload/l7/ei/8m/i5/army-1200-1200-675-675-crop-000000.jpg',
        year: 1969,
        duration: 145,
        rating: 4.4,
        country: 'Франция',
        genres: ['Драма', 'Военный', 'История'],
        directors: ['Жан-Пьер Мельвиль'],
        actors: [
            { fullName: 'Лино Вентура', character: 'Филипп Жербье', order: 1 },
            { fullName: 'Поль Морисс', character: 'Люк Жарди', order: 2 },
            {
                fullName: 'Жан-Пьер Кассель',
                character: 'Жан-Франсуа Жарди',
                order: 3,
            },
            { fullName: 'Симона Синьоре', character: 'Матильда', order: 4 },
        ],
    },
    {
        title: 'Город Бога',
        originalTitle: 'Cidade de Deus',
        alternativeTitles: ['City of God', 'Город Бога'],
        description:
            'Жестокая и визуально безупречная история о жизни в фавелах Рио-де-Жанейро. Пока один мальчик мечтает стать фотографом, другой становится самым опасным наркобароном города.',
        posterUrl:
            'https://a.ltrbxd.com/resized/film-poster/5/1/5/2/3/51523-city-of-god-0-2000-0-3000-crop.jpg?v=7517ea94ce',
        bannerUrl:
            'https://a.ltrbxd.com/resized/sm/upload/pn/lo/pe/jr/city-of-god-1200-1200-675-675-crop-000000.jpg',
        year: 2002,
        duration: 130,
        rating: 4.6,
        country: 'Бразилия',
        genres: ['Криминал', 'Драма'],
        directors: ['Фернанду Мейреллиш', 'Катя Лунд'],
        actors: [
            { fullName: 'Алешандре Родригес', character: 'Ракета', order: 1 },
            { fullName: 'Леандру Фирмину', character: 'Малыш Зе', order: 2 },
            { fullName: 'Феллипе Хаагенсен', character: 'Бенни', order: 3 },
            { fullName: 'Сеу Жоржи', character: 'Красавчик Нед', order: 4 },
        ],
    },
    {
        title: 'Цельнометаллическая оболочка',
        originalTitle: 'Full Metal Jacket',
        alternativeTitles: [
            'Full Metal Jacket',
            'Цельнометаллическая оболочка',
        ],
        description:
            'Взгляд Стэнли Кубрика на войну во Вьетнаме через призму превращения обычных парней в тренированных убийц и последующий хаос сражения за Хюэ.',
        posterUrl:
            'https://a.ltrbxd.com/resized/sm/upload/l0/l4/6c/7v/29veIwD38rVL2qY74emXQw4y25H-0-2000-0-3000-crop.jpg?v=6e44829670',
        bannerUrl:
            'https://a.ltrbxd.com/resized/sm/upload/zi/ef/y7/yk/fmj-1200-1200-675-675-crop-000000.jpg',
        year: 1987,
        duration: 116,
        rating: 4.2,
        country: 'США',
        genres: ['Военный', 'Драма'],
        directors: ['Стэнли Кубрик'],
        actors: [
            {
                fullName: 'Мэттью Модайн',
                character: 'Рядовой Шутник',
                order: 1,
            },
            { fullName: 'Адам Болдуин', character: 'Зверюга', order: 2 },
            {
                fullName: 'Винсент Д’Онофрио',
                character: 'Рядовой Куча',
                order: 3,
            },
            { fullName: 'Р. Ли Эрми', character: 'Сержант Хартман', order: 4 },
        ],
    },
    {
        title: 'Собачье сердце',
        originalTitle: 'Собачье сердце',
        alternativeTitles: ['Heart of a Dog', 'Собачье сердце'],
        description:
            'Экранизация повести Михаила Булгакова. Профессор Преображенский проводит смелый эксперимент по пересадке человеческих желез собаке, создавая существо, которое становится кошмаром своего создателя.',
        posterUrl:
            'https://a.ltrbxd.com/resized/film-poster/2/1/4/7/5/21475-heart-of-a-dog-0-2000-0-3000-crop.jpg?v=f2f2f80ea7',
        bannerUrl:
            'https://a.ltrbxd.com/resized/alternative-backdrop/2/1/4/7/5/tmdb/3CXXJntMReQTN4DlDyZc0SxhPVL-1200-1200-675-675-crop-000000.jpg',
        year: 1988,
        duration: 136,
        rating: 4.0,
        country: 'СССР',
        genres: ['Драма', 'Фантастика', 'Комедия'],
        directors: ['Владимир Бортко'],
        actors: [
            {
                fullName: 'Евгений Евстигнеев',
                character: 'Профессор Преображенский',
                order: 1,
            },
            {
                fullName: 'Владимир Толоконников',
                character: 'Полиграф Полиграфович Шариков',
                order: 2,
            },
            {
                fullName: 'Борис Плотников',
                character: 'Доктор Борменталь',
                order: 3,
            },
            {
                fullName: 'Нина Русланова',
                character: 'Дарья Петровна',
                order: 4,
            },
        ],
    },
    {
        title: 'Шоу Трумана',
        originalTitle: 'The Truman Show',
        alternativeTitles: ['The Truman Show', 'Шоу Трумана'],
        description:
            'Труман Бербанк живет в идеальном городке, не подозревая, что вся его жизнь — это круглосуточное реалити-шоу, а все вокруг него, включая жену — нанятые актеры.',
        posterUrl:
            'https://a.ltrbxd.com/resized/sm/upload/xx/io/jp/45/the-truman-show-0-2000-0-3000-crop.jpg',
        bannerUrl:
            'https://a.ltrbxd.com/resized/sm/upload/z0/rf/dt/5l/truman-show-115-1200-1200-675-675-crop-000000.jpg',
        year: 1998,
        duration: 103,
        rating: 4.2,
        country: 'США',
        genres: ['Драма', 'Комедия', 'Фантастика'],
        directors: ['Питер Уир'],
        actors: [
            { fullName: 'Джим Керри', character: 'Труман Бербанк', order: 1 },
            { fullName: 'Лора Линни', character: 'Мэрил Бербанк', order: 2 },
            { fullName: 'Эд Харрис', character: 'Кристоф', order: 3 },
            { fullName: 'Ноа Эммерих', character: 'Марлон', order: 4 },
        ],
    },
    {
        title: 'Летят журавли',
        originalTitle: 'Летят журавли',
        alternativeTitles: ['The Cranes Are Flying', 'Летят журавли'],
        description:
            'Трагическая история любви Вероники и Бориса, которых разлучает война. Один из самых красивых фильмов в истории кино с невероятной операторской работой Сергея Урусевского.',
        posterUrl:
            'https://a.ltrbxd.com/resized/film-poster/2/6/2/0/1/26201-the-cranes-are-flying-0-2000-0-3000-crop.jpg',
        bannerUrl:
            'https://a.ltrbxd.com/resized/sm/upload/77/b7/6i/xq/the-cranes-are-flying-1200-1200-675-675-crop-000000.jpg',
        year: 1957,
        duration: 97,
        rating: 4.5,
        country: 'СССР',
        genres: ['Драма', 'Мелодрама', 'Военный'],
        directors: ['Михаил Калатозов'],
        actors: [
            {
                fullName: 'Татьяна Самойлова',
                character: 'Вероника',
                order: 1,
            },
            {
                fullName: 'Алексей Баталов',
                character: 'Борис',
                order: 2,
            },
            {
                fullName: 'Василий Меркурьев',
                character: 'Федор Иванович',
                order: 3,
            },
            {
                fullName: 'Александр Шворин',
                character: 'Марк',
                order: 4,
            },
        ],
    },
    {
        title: 'Орудия',
        originalTitle: 'Weapons',
        alternativeTitles: ['Weapons', 'Орудия'],
        description:
            'В маленьком городке Мэйбрук одной ночью таинственно исчезают почти все дети из одного класса, оставив только одного школьника. Жители пытаются понять, что произошло, а учительница и родители ведут собственные расследования, сталкиваясь с загадками, потерями и страхами.',
        posterUrl:
            'https://a.ltrbxd.com/resized/film-poster/9/7/2/1/0/9/972109-weapons-2025-0-460-0-690-crop.jpg',
        bannerUrl:
            'https://a.ltrbxd.com/resized/sm/upload/l7/cx/wv/3u/sQUvdgUcAX3YR5otU1RuCkIPaJX-1200-1200-675-675-crop-000000.jpg',
        year: 2025,
        duration: 128,
        rating: 3.6,
        country: 'США',
        genres: ['Ужасы', 'Детектив'],
        directors: ['Зак Крэггер'],
        actors: [
            { fullName: 'Джош Бролин', character: 'Арчер Графф', order: 1 },
            { fullName: 'Джулия Гарнер', character: 'Джастин Гэнди', order: 2 },
            {
                fullName: 'Олден Эренрайк',
                character: 'Пол Морган',
                order: 3,
            },
            { fullName: 'Остин Абрамс', character: 'Джеймс', order: 4 },
            { fullName: 'Кэри Кристофер', character: 'Алекс Лилли', order: 5 },
            { fullName: 'Бенедикт Вонг', character: 'Маркус Миллер', order: 6 },
        ],
    },
    {
        title: 'Интерстеллар',
        originalTitle: 'Interstellar',
        alternativeTitles: ['Interstellar', 'Интерстеллар'],
        description:
            'Группа исследователей отправляется через космический «червоточинный» проход в поисках нового дома для человечества, поскольку Земля истощается. Главный герой - бывший пилот и фермер Купер - вместе с командой пытается спасти будущее человечества.',
        posterUrl:
            'https://a.ltrbxd.com/resized/film-poster/1/1/7/6/2/1/117621-interstellar-0-460-0-690-crop.jpg',
        bannerUrl:
            'https://a.ltrbxd.com/resized/sm/upload/r4/0u/oq/0i/interstellar-1200-1200-675-675-crop-000000.jpg',
        year: 2014,
        duration: 169,
        rating: 4.4,
        country: 'США',
        genres: ['Научная фантастика', 'Приключения', 'Драма'],
        directors: ['Кристофер Нолан'],
        actors: [
            {
                fullName: 'Мэттью Макконахи',
                character: 'Джозеф «Куп» Купер',
                order: 1,
            },
            {
                fullName: 'Энн Хэтэуэй',
                character: 'Доктор Амелия Бранд',
                order: 2,
            },
            {
                fullName: 'Джессика Честейн',
                character: 'Мёрфи «Мёрф» Купер',
                order: 3,
            },
            {
                fullName: 'Майкл Кейн',
                character: 'Профессор Джон Бранд',
                order: 4,
            },
            { fullName: 'Кейси Аффлек', character: 'Том Купер', order: 5 },
            { fullName: 'Маккензи Фой', character: 'Юная Мёрф', order: 6 },
        ],
    },
    {
        title: 'Карты, деньги, два ствола',
        originalTitle: 'Lock, Stock and Two Smoking Barrels',
        alternativeTitles: [
            'Lock, Stock and Two Smoking Barrels',
            'Карты, деньги, два ствола',
        ],
        description:
            'Четверо друзей-азартщиков проигрывают крупную сумму в нечестной карточной игре и имеют неделю, чтобы вернуть долг криминальному боссу. Чтобы накопить нужные деньги, они решают ограбить соседнюю преступную группировку, что втягивает их в череду опасных и комичных передряг британского криминального мира.',
        posterUrl:
            'https://a.ltrbxd.com/resized/film-poster/5/1/9/5/0/51950-lock-stock-and-two-smoking-barrels-0-460-0-690-crop.jpg',
        bannerUrl:
            'https://a.ltrbxd.com/resized/sm/upload/al/m4/5q/96/lock-stock-and-two-smoking-barrels-1200-1200-675-675-crop-000000.jpg',
        year: 1998,
        duration: 106,
        rating: 4.1,
        country: 'Великобритания',
        genres: ['Криминал', 'Комедия'],
        directors: ['Гай Ричи'],
        actors: [
            { fullName: 'Ник Моран', character: 'Эдди', order: 1 },
            { fullName: 'Джейсон Флеминг', character: 'Том', order: 2 },
            { fullName: 'Декстер Флетчер', character: 'Соуп', order: 3 },
            { fullName: 'Джейсон Стэтхэм', character: 'Бекон', order: 4 },
            { fullName: 'Стивен Макинтош', character: 'Уинстон', order: 5 },
            { fullName: 'Винни Джонс', character: 'Большой Крис', order: 6 },
        ],
    },
    {
        title: 'Оппенгеймер',
        originalTitle: 'Oppenheimer',
        alternativeTitles: ['Oppenheimer', 'Оппенгеймер'],
        description:
            'Биографическая эпическая драма Кристофера Нолана о физике-теоретике Дж. Роберте Оппенгеймере - «отце» атомной бомбы, его жизни, работе над Проектом Манхэттен и последствиях создания ядерного оружия.',
        posterUrl:
            'https://a.ltrbxd.com/resized/film-poster/7/8/4/3/2/8/784328-oppenheimer-0-460-0-690-crop.jpg',
        bannerUrl:
            'https://a.ltrbxd.com/resized/sm/upload/mn/uu/op/02/oppenheimer-2023-1200-1200-675-675-crop-000000.jpg',
        year: 2023,
        duration: 180,
        rating: 4.2,
        country: 'США',
        genres: ['Биография', 'Драма', 'История'],
        directors: ['Кристофер Нолан'],
        actors: [
            {
                fullName: 'Киллиан Мёрфи',
                character: 'Дж. Роберт Оппенгеймер',
                order: 1,
            },
            {
                fullName: 'Эмили Блант',
                character: 'Кэтрин «Китти» Оппенгеймер',
                order: 2,
            },
            {
                fullName: 'Мэтт Дэймон',
                character: 'Генерал Лесли Гровс',
                order: 3,
            },
            {
                fullName: 'Роберт Дауни-младший',
                character: 'Льюис Штраусс',
                order: 4,
            },
            { fullName: 'Флоренс Пью', character: 'Джин Тэтлок', order: 5 },
            {
                fullName: 'Джош Хартнетт',
                character: 'Эрнест Лоуренс',
                order: 6,
            },
        ],
    },
    {
        title: 'Мементо',
        originalTitle: 'Memento',
        alternativeTitles: ['Memento', 'Мементо'],
        description:
            'Нолановский триллер о Леонарде Шелби, человеке с кратковременной потерей памяти, который пытается найти убийцу своей жены, используя фотографии и заметки, чтобы переживать события, которые он больше не может запомнить.',
        posterUrl:
            'https://a.ltrbxd.com/resized/sm/upload/v1/3q/s4/aa/memento-0-460-0-690-crop.jpg',
        bannerUrl:
            'https://a.ltrbxd.com/resized/sm/upload/za/7s/m0/sh/memento-1200-1200-675-675-crop-000000.jpg',
        year: 2000,
        duration: 113,
        rating: 4.2,
        country: 'США',
        genres: ['Детектив', 'Триллер', 'Драма'],
        directors: ['Кристофер Нолан'],
        actors: [
            { fullName: 'Гай Пирс', character: 'Леонард Шелби', order: 1 },
            { fullName: 'Кэрри-Энн Мосс', character: 'Натали', order: 2 },
            { fullName: 'Джо Пантолиано', character: 'Тедди', order: 3 },
            { fullName: 'Марк Бун Джуниор', character: 'Бёрт', order: 4 },
            { fullName: 'Русс Фега', character: 'Официант', order: 5 },
            { fullName: 'Джорджа Фокс', character: 'Кэтрин Шелби', order: 6 },
        ],
    },
    {
        title: 'Прочь',
        originalTitle: 'Get Out',
        alternativeTitles: ['Get Out', 'Прочь'],
        description:
            'Американский психологический хоррор, в котором молодой чернокожий фотограф Крис Вашингтон отправляется познакомиться с родителями своей белой девушки, но вскоре понимает, что скрытые мотивы и мрачные тайны семьи Армитаж гораздо опаснее, чем он мог представить.',
        posterUrl:
            'https://a.ltrbxd.com/resized/film-poster/3/5/3/1/1/7/353117-get-out-0-460-0-690-crop.jpg',
        bannerUrl:
            'https://a.ltrbxd.com/resized/sm/upload/n1/db/zy/ha/get-out-160-1200-1200-675-675-crop-000000.jpg',
        year: 2017,
        duration: 104,
        rating: 4.1,
        country: 'США',
        genres: ['Ужасы', 'Детектив', 'Триллер'],
        directors: ['Джордан Пил'],
        actors: [
            {
                fullName: 'Дэниел Калуйя',
                character: 'Крис Вашингтон',
                order: 1,
            },
            {
                fullName: 'Эллисон Уильямс',
                character: 'Роуз Армитаж',
                order: 2,
            },
            {
                fullName: 'Брэдли Уитфорд',
                character: 'Дин Армитаж',
                order: 3,
            },
            {
                fullName: 'Кэтрин Кинер',
                character: 'Мисси Армитаж',
                order: 4,
            },
            {
                fullName: 'Калеб Лэндри Джонс',
                character: 'Джереми Армитаж',
                order: 5,
            },
            { fullName: 'Лил Рел Хауэри', character: 'Род Уильямс', order: 6 },
        ],
    },
    {
        title: 'Иди и смотри',
        originalTitle: 'Иди и смотри',
        alternativeTitles: ['Come and See', 'Иди и смотри'],
        description:
            'Во время нацистской оккупации Беларуси подросток Флёра присоединяется к партизанам и становится свидетелем ужасающих зверств войны. Его детская наивность быстро сменяется шоком и травмой, когда он сталкивается с разрушением, насилием и трагедиями мирных жителей.',
        posterUrl:
            'https://a.ltrbxd.com/resized/film-poster/3/6/1/9/2/36192-come-and-see-0-2000-0-3000-crop.jpg?v=741b0269bb',
        bannerUrl:
            'https://a.ltrbxd.com/resized/sm/upload/ok/lw/1k/tl/come-and-see-1200-1200-675-675-crop-000000.jpg',
        year: 1985,
        duration: 142,
        rating: 4.6,
        country: 'СССР',
        genres: ['Война', 'Драма', 'История'],
        directors: ['Элем Климов'],
        actors: [
            { fullName: 'Алексей Кравченко', character: 'Флёра', order: 1 },
            { fullName: 'Ольга Миронова', character: 'Глаша', order: 2 },
            {
                fullName: 'Любомирас Лауцявичюс',
                character: 'Косач',
                order: 3,
            },
            { fullName: 'Владас Багдонас', character: 'Рубеж', order: 4 },
            { fullName: 'Юри Лумисте', character: 'Офицер', order: 5 },
            {
                fullName: 'Казимир Рабецкий',
                character: 'Старейшина деревни',
                order: 6,
            },
        ],
    },
    {
        title: 'Джентльмены',
        originalTitle: 'The Gentlemen',
        alternativeTitles: ['The Gentlemen', 'Джентльмены'],
        description:
            'Американский наркобарон Майкл «Микки» Пирсон построил могущественную криминальную империю по продаже марихуаны в Великобритании и теперь хочет уйти на покой, продав бизнес. Это запускает цепочку шантажа, шпионских игр и конфликтов с различными группировками и частными детективами в стиле фирменного британского криминального юмора.',
        posterUrl:
            'https://a.ltrbxd.com/resized/film-poster/4/5/2/2/8/9/452289-the-gentlemen-0-460-0-690-crop.jpg',
        bannerUrl:
            'https://a.ltrbxd.com/resized/sm/upload/xw/zo/3j/qs/the-gentlemen-1200-1200-675-675-crop-000000.jpg',
        year: 2019,
        duration: 113,
        rating: 3.8,
        country: 'Великобритания',
        genres: ['Криминал', 'Комедия', 'Боевик'],
        directors: ['Гай Ричи'],
        actors: [
            {
                fullName: 'Мэттью Макконахи',
                character: 'Микки Пирсон',
                order: 1,
            },
            {
                fullName: 'Чарли Ханнэм',
                character: 'Раймонд Смит',
                order: 2,
            },
            {
                fullName: 'Мишель Докери',
                character: 'Розалинд Пирсон',
                order: 3,
            },
            { fullName: 'Хью Грант', character: 'Флетчер', order: 4 },
            { fullName: 'Колин Фаррелл', character: 'Тренер', order: 5 },
            {
                fullName: 'Джереми Стронг',
                character: 'Мэттью Бергер',
                order: 6,
            },
        ],
    },
    {
        title: 'Одержимость',
        originalTitle: 'Whiplash',
        alternativeTitles: ['Whiplash', 'Одержимость'],
        description:
            'Талантливый молодой барабанщик Эндрю Ниман поступает в престижную музыкальную школу, где сталкивается с требовательным и жестоким преподавателем Терренсом Флетчером. Желание совершенства доводит его до предела, проверяя границы таланта и личности.',
        posterUrl:
            'https://a.ltrbxd.com/resized/sm/upload/cl/dn/kr/f1/4C9LHDxMsoYI0S3iMPZdm3Oevwo-0-460-0-690-crop.jpg',
        bannerUrl:
            'https://a.ltrbxd.com/resized/sm/upload/sk/f3/f1/b2/whiplash-1200-1200-675-675-crop-000000.jpg',
        year: 2014,
        duration: 107,
        rating: 4.4,
        country: 'США',
        genres: ['Драма', 'Музыка'],
        directors: ['Дэмьен Шазелл'],
        actors: [
            { fullName: 'Майлз Теллер', character: 'Эндрю Ниман', order: 1 },
            {
                fullName: 'Дж. К. Симмонс',
                character: 'Терренс Флетчер',
                order: 2,
            },
            { fullName: 'Пол Райзер', character: 'Джим Ниман', order: 3 },
            { fullName: 'Мелисса Беноист', character: 'Николь', order: 4 },
            {
                fullName: 'Остин Стоуэлл',
                character: 'Райан Коннолли',
                order: 5,
            },
            { fullName: 'Нэйт Лэнг', character: 'Карл Таннер', order: 6 },
        ],
    },
    {
        title: 'Крёстный отец 2',
        originalTitle: 'The Godfather Part II',
        alternativeTitles: ['The Godfather Part II', 'Крёстный отец 2'],
        description:
            'Продолжение эпической саги о семье Корлеоне показывает параллельные истории: становление молодого Вито Корлеоне в начале XX века и укрепление власти Майкла Корлеоне, который пытается сохранить контроль над семейной империей, сталкиваясь с предательством и внутренними конфликтами.',
        posterUrl:
            'https://a.ltrbxd.com/resized/film-poster/5/1/8/1/6/51816-the-godfather-part-ii-0-2000-0-3000-crop.jpg',
        bannerUrl:
            'https://a.ltrbxd.com/resized/sm/upload/rw/q1/s4/xy/the-godfather-part-ii-1200-1200-675-675-crop-000000.jpg',
        year: 1974,
        duration: 202,
        rating: 4.5,
        country: 'США',
        genres: ['Криминал', 'Драма'],
        directors: ['Фрэнсис Форд Коппола'],
        actors: [
            { fullName: 'Аль Пачино', character: 'Майкл Корлеоне', order: 1 },
            {
                fullName: 'Роберт Де Ниро',
                character: 'Молодой Вито Корлеоне',
                order: 2,
            },
            { fullName: 'Роберт Дюваль', character: 'Том Хейген', order: 3 },
            { fullName: 'Дайан Китон', character: 'Кей Корлеоне', order: 4 },
            { fullName: 'Джон Казале', character: 'Фредо Корлеоне', order: 5 },
            { fullName: 'Талия Шайр', character: 'Конни Корлеоне', order: 6 },
        ],
    },
    {
        title: 'Человек-паук: Паутина вселенных',
        originalTitle: 'Spider-Man: Across the Spider-Verse',
        alternativeTitles: [
            'Spider-Man: Across the Spider-Verse',
            'Человек-паук: Паутина вселенных',
        ],
        description:
            'Майлз Моралес продолжает путешествовать по мультивселенной, встречая новых Человеков-пауков и сталкиваясь с угрозой, способной разрушить все вселенные. Герои объединяются, чтобы защитить реальности и раскрыть скрытую опасность.',
        posterUrl:
            'https://a.ltrbxd.com/resized/film-poster/4/9/7/6/3/1/497631-spider-man-across-the-spider-verse-0-460-0-690-crop.jpg',
        bannerUrl:
            'https://a.ltrbxd.com/resized/sm/upload/22/gj/k3/ql/spider-verse-1200-1200-675-675-crop-000000.jpg',
        year: 2023,
        duration: 140,
        rating: 4.4,
        country: 'США',
        genres: ['Анимация', 'Боевик', 'Приключения'],
        directors: ['Кемп Пауэрс', 'Жуаким душ Сантуш'],
        actors: [
            {
                fullName: 'Шамейк Мур',
                character: 'Майлз Моралес / Человек-паук',
                order: 1,
            },
            {
                fullName: 'Хейли Стайнфелд',
                character: 'Гвен Стейси / Женщина-паук',
                order: 2,
            },
            {
                fullName: 'Оскар Айзек',
                character: 'Мигель О’Хара / Человек-паук 2099',
                order: 3,
            },
            {
                fullName: 'Брайан Тайри Генри',
                character: 'Джефферсон Дэвис',
                order: 4,
            },
            {
                fullName: 'Луна Лорен Велес',
                character: 'Рио Моралес',
                order: 5,
            },
            {
                fullName: 'Джейк Джонсон',
                character: 'Питер Б. Паркер / Человек-паук',
                order: 6,
            },
        ],
    },
    {
        title: 'Леди Бёрд',
        originalTitle: 'Lady Bird',
        alternativeTitles: ['Lady Bird', 'Леди Бёрд'],
        description:
            'Американская драмеди о взрослении 17-летней Кристины «Леди Бёрд» МакФерсон, которая стремится выбраться из своей провинциальной жизни в Сакраменто, ищет себя, сталкивается с трудностями взросления, семейными конфликтами и первыми романтическими переживаниями.',
        posterUrl:
            'https://a.ltrbxd.com/resized/film-poster/3/2/6/2/7/9/326279-lady-bird-0-460-0-690-crop.jpg',
        bannerUrl:
            'https://a.ltrbxd.com/resized/sm/upload/om/94/t6/xo/lady-bird-1200-1200-675-675-crop-000000.jpg',
        year: 2017,
        duration: 94,
        rating: 3.8,
        country: 'США',
        genres: ['Комедия', 'Драма'],
        directors: ['Грета Гервиг'],
        actors: [
            {
                fullName: 'Сирша Ронан',
                character: 'Кристина «Леди Бёрд» МакФерсон',
                order: 1,
            },
            {
                fullName: 'Лори Меткалф',
                character: 'Мэрион МакФерсон',
                order: 2,
            },
            {
                fullName: 'Трэйси Леттс',
                character: 'Ларри МакФерсон',
                order: 3,
            },
            { fullName: 'Лукас Хеджес', character: "Дэнни О'Нил", order: 4 },
            {
                fullName: 'Тимоти Шаламе',
                character: 'Кайл Шайбл',
                order: 5,
            },
            {
                fullName: 'Бини Фельдштейн',
                character: 'Джулианна «Джули» Стеффанс',
                order: 6,
            },
        ],
    },
    {
        title: 'Однажды... в Голливуде',
        originalTitle: 'Once Upon a Time in Hollywood',
        alternativeTitles: [
            'Once Upon a Time in Hollywood',
            'Однажды... в Голливуде',
        ],
        description:
            '1969 год. Актёр Рик Далтон и его дублёр по трюкам Клифф Бут пытаются найти своё место в меняющемся Голливуде. Их путь пересекается с реальными событиями и персонажами той эпохи, создавая одновременно драматическую и ностальгическую картину об индустрии кино.',
        posterUrl:
            'https://a.ltrbxd.com/resized/film-poster/3/9/7/8/5/9/397859-once-upon-a-time-in-hollywood-0-2000-0-3000-crop.jpg',
        bannerUrl:
            'https://a.ltrbxd.com/resized/sm/upload/3m/w9/ku/pt/once-upon-a-time-in-hollywood-1200-1200-675-675-crop-000000.jpg',
        year: 2019,
        duration: 161,
        rating: 3.8,
        country: 'США',
        genres: ['Комедия', 'Драма'],
        directors: ['Квентин Тарантино'],
        actors: [
            {
                fullName: 'Леонардо ДиКаприо',
                character: 'Рик Далтон',
                order: 1,
            },
            { fullName: 'Брэд Питт', character: 'Клифф Бут', order: 2 },
            { fullName: 'Марго Робби', character: 'Шэрон Тейт', order: 3 },
            { fullName: 'Аль Пачино', character: 'Марвин Шварц', order: 4 },
            {
                fullName: 'Дакота Фэннинг',
                character: 'Сквики Фромм',
                order: 5,
            },
            {
                fullName: 'Тимоти Олифант',
                character: 'Джеймс Стэйси',
                order: 6,
            },
        ],
    },
    {
        title: 'Умница Уилл Хантинг',
        originalTitle: 'Good Will Hunting',
        alternativeTitles: ['Good Will Hunting', 'Умница Уилл Хантинг'],
        description:
            'Драма о молодом уборщике Университета, скрывающем невероятный математический гений. После проблем с законом он соглашается на терапию с профессором психологии и начинает переосмысливать свою жизнь, отношения и будущее.',
        posterUrl:
            'https://a.ltrbxd.com/resized/film-poster/5/1/6/2/1/51621-good-will-hunting-0-460-0-690-crop.jpg',
        bannerUrl:
            'https://a.ltrbxd.com/resized/sm/upload/30/pr/tv/eg/IMG_5729-1200-1200-675-675-crop-000000.jpg',
        year: 1997,
        duration: 126,
        rating: 4.4,
        country: 'США',
        genres: ['Драма', 'Мелодрама'],
        directors: ['Гас Ван Сент'],
        actors: [
            { fullName: 'Мэтт Дэймон', character: 'Уилл Хантинг', order: 1 },
            {
                fullName: 'Робин Уильямс',
                character: 'Доктор Шон Магуайр',
                order: 2,
            },
            {
                fullName: 'Бен Аффлек',
                character: 'Чаки Салливан',
                order: 3,
            },
            {
                fullName: 'Стеллан Скарсгард',
                character: 'Профессор Джеральд Лэмбо',
                order: 4,
            },
            { fullName: 'Минни Драйвер', character: 'Скайлар', order: 5 },
            {
                fullName: 'Кейси Аффлек',
                character: "Морган О'Малли",
                order: 6,
            },
        ],
    },
    {
        title: 'Назад в будущее 3',
        originalTitle: 'Back to the Future Part III',
        alternativeTitles: ['Back to the Future Part III', 'Назад в будущее 3'],
        description:
            'Марти узнает, что Док Браун застрял в 1885 году на Диком Западе. Используя машину времени, он отправляется в прошлое, чтобы спасти друга. Однако ремонт Делориана оказывается сложной задачей, а Док неожиданно влюбляется в школьную учительницу Клару Клейтон.',
        posterUrl:
            'https://a.ltrbxd.com/resized/film-poster/5/1/8/5/6/51856-back-to-the-future-part-iii-0-2000-0-3000-crop.jpg?v=fdbcbb74cb',
        bannerUrl:
            'https://a.ltrbxd.com/resized/sm/upload/86/ao/b6/db/bttf3-1200-1200-675-675-crop-000000.jpg',
        year: 1990,
        duration: 118,
        rating: 3.6,
        country: 'США',
        genres: ['Приключения', 'Комедия', 'Вестерн', 'Научная фантастика'],
        directors: ['Роберт Земекис'],
        actors: [
            {
                fullName: 'Майкл Дж. Фокс',
                character: 'Марти МакФлай',
                order: 1,
            },
            {
                fullName: 'Кристофер Ллойд',
                character: 'Доктор Эммет Браун',
                order: 2,
            },
            {
                fullName: 'Мэри Стинберген',
                character: 'Клара Клейтон',
                order: 3,
            },
            {
                fullName: 'Томас Ф. Уилсон',
                character: 'Бьюфорд «Бешеный Пёс» Таннен',
                order: 4,
            },
            { fullName: 'Лиа Томпсон', character: 'Мэгги МакФлай', order: 5 },
            {
                fullName: 'Элизабет Шу',
                character: 'Дженнифер Паркер',
                order: 6,
            },
        ],
    },
    {
        title: 'Крёстный отец',
        originalTitle: 'The Godfather',
        alternativeTitles: ['The Godfather', 'Крёстный отец'],
        description:
            'Глава могущественной мафиозной семьи Вито Корлеоне передаёт контроль над своей криминальной империей младшему сыну Майклу. Погружаясь в мир насилия, предательства и власти, Майкл постепенно превращается в безжалостного лидера, чтобы защитить семью и сохранить её влияние.',
        posterUrl:
            'https://a.ltrbxd.com/resized/film-poster/5/1/8/1/8/51818-the-godfather-0-2000-0-3000-crop.jpg?v=bca8b67402',
        bannerUrl:
            'https://a.ltrbxd.com/resized/sm/upload/zp/bn/1x/6r/the-godfather-1200-1200-675-675-crop-000000.jpg',
        year: 1972,
        duration: 175,
        rating: 4.5,
        country: 'США',
        genres: ['Криминал', 'Драма'],
        directors: ['Фрэнсис Форд Коппола'],
        actors: [
            {
                fullName: 'Марлон Брандо',
                character: 'Дон Вито Корлеоне',
                order: 1,
            },
            { fullName: 'Аль Пачино', character: 'Майкл Корлеоне', order: 2 },
            { fullName: 'Джеймс Каан', character: 'Сонни Корлеоне', order: 3 },
            { fullName: 'Роберт Дюваль', character: 'Том Хейген', order: 4 },
            { fullName: 'Дайан Китон', character: 'Кей Адамс', order: 5 },
            { fullName: 'Талия Шайр', character: 'Конни Корлеоне', order: 6 },
        ],
    },
    {
        title: 'Старикам тут не место',
        originalTitle: 'No Country for Old Men',
        alternativeTitles: ['No Country for Old Men', 'Старикам тут не место'],
        description:
            'Триллер братьев Коэн о ветеране войны, который находит сумку с деньгами после проваленной сделки, и охоте на него безжалостного киллера Антона Чигура. История о морали, судьбе и насилии на американском Юго-Западе.',
        posterUrl:
            'https://a.ltrbxd.com/resized/sm/upload/dr/hr/pz/ez/ehLb2SQ3djlA1FrQKbP2WO3VH09-0-460-0-690-crop.jpg',
        bannerUrl:
            'https://a.ltrbxd.com/resized/sm/upload/er/gs/bn/id/no-country-for-old-men-1200-1200-675-675-crop-000000.jpg',
        year: 2007,
        duration: 122,
        rating: 4.3,
        country: 'США',
        genres: ['Криминал', 'Драма', 'Триллер'],
        directors: ['Итан Коэн', 'Джоэл Коэн'],
        actors: [
            {
                fullName: 'Томми Ли Джонс',
                character: 'Шериф Эд Том Белл',
                order: 1,
            },
            { fullName: 'Хавьер Бардем', character: 'Антон Чигур', order: 2 },
            { fullName: 'Джош Бролин', character: 'Льюэллин Мосс', order: 3 },
            {
                fullName: 'Вуди Харрельсон',
                character: 'Карсон Уэллс',
                order: 4,
            },
            {
                fullName: 'Келли Макдоналд',
                character: 'Карла Джин Мосс',
                order: 5,
            },
            { fullName: 'Барри Корбин', character: 'Эллис', order: 6 },
        ],
    },
    {
        title: 'Форрест Гамп',
        originalTitle: 'Forrest Gump',
        alternativeTitles: ['Forrest Gump', 'Форрест Гамп'],
        description:
            'Форрест Гамп - простой и добрый человек из Алабамы, который невольно становится участником важнейших событий американской истории второй половины XX века. Несмотря на жизненные трудности, он сохраняет оптимизм и преданность своей любви - Дженни.',
        posterUrl:
            'https://a.ltrbxd.com/resized/film-poster/2/7/0/4/2704-forrest-gump-0-2000-0-3000-crop.jpg?v=173bc04cf0',
        bannerUrl:
            'https://a.ltrbxd.com/resized/sm/upload/ly/1s/z6/yx/forrest-gump-1200-1200-675-675-crop-000000.jpg',
        year: 1994,
        duration: 142,
        rating: 4.2,
        country: 'США',
        genres: ['Драма', 'Мелодрама'],
        directors: ['Роберт Земекис'],
        actors: [
            { fullName: 'Том Хэнкс', character: 'Форрест Гамп', order: 1 },
            { fullName: 'Робин Райт', character: 'Дженни Каррен', order: 2 },
            {
                fullName: 'Гэри Синиз',
                character: 'Лейтенант Дэн Тейлор',
                order: 3,
            },
            {
                fullName: 'Майкелти Уильямсон',
                character: 'Бенджамин Бьюфорд «Бабба» Блю',
                order: 4,
            },
            { fullName: 'Салли Филд', character: 'Миссис Гамп', order: 5 },
            {
                fullName: 'Майкл Коннер Хамфрис',
                character: 'Юный Форрест',
                order: 6,
            },
        ],
    },
    {
        title: 'Список Шиндлера',
        originalTitle: "Schindler's List",
        alternativeTitles: ["Schindler's List", 'Список Шиндлера'],
        description:
            'История немецкого промышленника Оскара Шиндлера, спасшего более тысячи евреев от Холокоста, используя свои фабрики.',
        posterUrl:
            'https://a.ltrbxd.com/resized/sm/upload/bz/1x/em/jr/yPisjyLweCl1tbgwgtzBCNCBle-0-2000-0-3000-crop.jpg?v=ca5215c5a9',
        bannerUrl:
            'https://a.ltrbxd.com/resized/sm/upload/nd/tx/5x/q9/schindlers-list-1200-1200-675-675-crop-000000.jpg',
        year: 1993,
        duration: 195,
        rating: 4.5,
        country: 'США',
        genres: ['Биография', 'Драма', 'История'],
        directors: ['Стивен Спилберг'],
        actors: [
            { fullName: 'Лиам Нисон', character: 'Оскар Шиндлер', order: 1 },
            { fullName: 'Рэйф Файнс', character: 'Амон Гёт', order: 2 },
            { fullName: 'Бен Кингсли', character: 'Ицхак Штерн', order: 3 },
            { fullName: 'Кэролайн Гудолл', character: 'Эмили', order: 4 },
            {
                fullName: 'Джонатан Сагалл',
                character: 'Польдек Пфефферберг',
                order: 5,
            },
            { fullName: 'Эмбет Дэвидц', character: 'Хелен Хирш', order: 6 },
        ],
    },
    {
        title: 'Отступники',
        originalTitle: 'The Departed',
        alternativeTitles: ['The Departed', 'Отступники'],
        description:
            'Криминальный триллер Мартина Скорсезе о двух полицейских, один из которых - полицейский под прикрытием в мафии, а другой - мафиози, внедрённый в полицию. Оба пытаются раскрыть личность друг друга, оказываясь в смертельно опасной игре двойных предательств.',
        posterUrl:
            'https://a.ltrbxd.com/resized/sm/upload/jr/th/pu/pb/laefkgrfa3oKwvBtWTBtf2suiI4-0-460-0-690-crop.jpg',
        bannerUrl:
            'https://a.ltrbxd.com/resized/sm/upload/33/lu/26/83/the-departed-1200-1200-675-675-crop-000000.jpg',
        year: 2006,
        duration: 151,
        rating: 4.3,
        country: 'США',
        genres: ['Криминал', 'Драма', 'Триллер'],
        directors: ['Мартин Скорсезе'],
        actors: [
            {
                fullName: 'Леонардо ДиКаприо',
                character: 'Билли Костиган-младший',
                order: 1,
            },
            { fullName: 'Мэтт Дэймон', character: 'Колин Салливан', order: 2 },
            {
                fullName: 'Джек Николсон',
                character: 'Фрэнк Костелло',
                order: 3,
            },
            {
                fullName: 'Марк Уолберг',
                character: 'Штаб-сержант Шон Дигнам',
                order: 4,
            },
            {
                fullName: 'Мартин Шин',
                character: 'Капитан Оливер Куинан',
                order: 5,
            },
            {
                fullName: 'Вера Фармига',
                character: 'Доктор Мадолин Мэдден',
                order: 6,
            },
        ],
    },
    {
        title: 'Паразиты',
        originalTitle: 'Parasite',
        alternativeTitles: ['Parasite', '기생충', 'Паразиты'],
        description:
            'Семья Кимов, живущая в бедности в полу-подвальном жилище, получает шанс изменить свою жизнь, когда сын устраивается репетитором в богатый дом семьи Пак. Постепенно члены семьи Ким внедряются в дом и жизнь Паков, но игра обмана приводит к неожиданным и опасным последствиям, обнажая социальные и классовые противоречия.',
        posterUrl:
            'https://a.ltrbxd.com/resized/film-poster/4/2/6/4/0/6/426406-parasite-0-460-0-690-crop.jpg',
        bannerUrl:
            'https://a.ltrbxd.com/resized/sm/upload/oi/ha/78/z8/parasite-1200-1200-675-675-crop-000000.jpg',
        year: 2019,
        duration: 132,
        rating: 4.5,
        country: 'Южная Корея',
        genres: ['Драма', 'Комедия', 'Триллер'],
        directors: ['Пон Чжун Хо'],
        actors: [
            { fullName: 'Сон Кан-хо', character: 'Ким Ки-тхэк', order: 1 },
            { fullName: 'Ли Сон-гюн', character: 'Пак Дон-ик', order: 2 },
            { fullName: 'Чо Ё-джон', character: 'Чхве Ён-гё', order: 3 },
            { fullName: 'Чхве У-шик', character: 'Ким Ки-у', order: 4 },
            { fullName: 'Пак Со-дам', character: 'Ким Ки-джон', order: 5 },
            { fullName: 'Чан Хе-джин', character: 'Ким Чун-сук', order: 6 },
        ],
    },
    {
        title: 'Криминальное чтиво',
        originalTitle: 'Pulp Fiction',
        alternativeTitles: ['Pulp Fiction', 'Криминальное чтиво'],
        description:
            'Несколько взаимосвязанных криминальных историй разворачиваются в Лос-Анджелесе: двое наёмных убийц выполняют задания своего босса, боксёр пытается сбежать с деньгами мафии, а гангстер и его жена оказываются в центре опасного вечера. Нелинейное повествование соединяет судьбы персонажей в культовом стиле Тарантино.',
        posterUrl:
            'https://a.ltrbxd.com/resized/film-poster/5/1/4/4/4/51444-pulp-fiction-0-460-0-690-crop.jpg',
        bannerUrl:
            'https://a.ltrbxd.com/resized/sm/upload/z6/e0/vw/uy/pulp-fiction-65-1200-1200-675-675-crop-000000.jpg',
        year: 1994,
        duration: 154,
        rating: 4.2,
        country: 'США',
        genres: ['Криминал', 'Драма'],
        directors: ['Квентин Тарантино'],
        actors: [
            { fullName: 'Джон Траволта', character: 'Винсент Вега', order: 1 },
            {
                fullName: 'Сэмюэл Л. Джексон',
                character: 'Джулс Виннфилд',
                order: 2,
            },
            { fullName: 'Ума Турман', character: 'Миа Уоллес', order: 3 },
            { fullName: 'Брюс Уиллис', character: 'Бутч Кулидж', order: 4 },
            {
                fullName: 'Винг Рэймс',
                character: 'Марселлас Уоллес',
                order: 5,
            },
            { fullName: 'Харви Кейтель', character: 'Уинстон Уолф', order: 6 },
        ],
    },
    {
        title: 'Назад в будущее 2',
        originalTitle: 'Back to the Future Part II',
        alternativeTitles: ['Back to the Future Part II', 'Назад в будущее 2'],
        description:
            'Марти МакФлай и Док Браун отправляются в 2015 год, чтобы предотвратить проблемы в будущем семьи МакФлай. Однако вмешательство в события приводит к изменению временной линии, и героям приходится вернуться в 1955 год, чтобы исправить последствия.',
        posterUrl:
            'https://a.ltrbxd.com/resized/film-poster/5/1/8/8/6/51886-back-to-the-future-part-ii-0-2000-0-3000-crop.jpg?v=85bd0a310a',
        bannerUrl:
            'https://a.ltrbxd.com/resized/sm/upload/ia/n4/4q/ix/a4qvbI9x3nqu3hKQyDRVVBpMklx-1200-1200-675-675-crop-000000.jpgg',
        year: 1989,
        duration: 108,
        rating: 3.9,
        country: 'США',
        genres: ['Приключения', 'Комедия', 'Научная фантастика'],
        directors: ['Роберт Земекис'],
        actors: [
            {
                fullName: 'Майкл Дж. Фокс',
                character: 'Марти МакФлай',
                order: 1,
            },
            {
                fullName: 'Кристофер Ллойд',
                character: 'Доктор Эммет Браун',
                order: 2,
            },
            { fullName: 'Лиа Томпсон', character: 'Лоррейн МакФлай', order: 3 },
            {
                fullName: 'Томас Ф. Уилсон',
                character: 'Биф Таннен',
                order: 4,
            },
            {
                fullName: 'Элизабет Шу',
                character: 'Дженнифер Паркер',
                order: 5,
            },
            {
                fullName: 'Джеймс Толкан',
                character: 'Мистер Стрикленд',
                order: 6,
            },
        ],
    },
    {
        title: '1917',
        originalTitle: '1917',
        alternativeTitles: ['1917'],
        description:
            'Во время Первой мировой войны двум молодым британским солдатам поручают смертельно опасное задание: пересечь вражескую территорию и доставить сообщение, которое может спасти сотни их товарищей - в том числе и брата одного из них. Фильм снят так, что кажется снятым одним непрерывным кадром, и передаёт ужас и героизм войны.',
        posterUrl:
            'https://a.ltrbxd.com/resized/film-poster/4/6/0/1/5/5/460155-1917-0-2000-0-3000-crop.jpg',
        bannerUrl:
            'https://a.ltrbxd.com/resized/sm/upload/zc/ui/yj/1h/1917-1200-1200-675-675-crop-000000.jpg',
        year: 2019,
        duration: 119,
        rating: 4.1,
        country: 'Великобритания/США',
        genres: ['Война', 'Драма', 'История'],
        directors: ['Сэм Мендес'],
        actors: [
            {
                fullName: 'Джордж Маккей',
                character: 'Ланс-капрал Шофилд',
                order: 1,
            },
            {
                fullName: 'Дин-Чарльз Чапман',
                character: 'Ланс-капрал Блейк',
                order: 2,
            },
            { fullName: 'Марк Стронг', character: 'Капитан Смит', order: 3 },
            {
                fullName: 'Эндрю Скотт',
                character: 'Лейтенант Лесли',
                order: 4,
            },
            {
                fullName: 'Ричард Мэдден',
                character: 'Лейтенант Блейк',
                order: 5,
            },
            {
                fullName: 'Колин Фёрт',
                character: 'Генерал Эринмор',
                order: 6,
            },
        ],
    },
    {
        title: '1+1',
        originalTitle: 'The Intouchables',
        alternativeTitles: ['The Intouchables', '1+1'],
        description:
            'Парализованный аристократ Филипп нанимает в помощники Дрисса - молодого человека из неблагополучного района, только что вышедшего из тюрьмы. Несмотря на разницу в происхождении и характерах, между ними возникает искренняя дружба, меняющая их жизни и открывающая новый взгляд на свободу, радость и человеческое достоинство.',
        posterUrl:
            'https://a.ltrbxd.com/resized/sm/upload/6d/b1/v2/4j/intouchables-0-2000-0-3000-crop.jpg',
        bannerUrl:
            'https://a.ltrbxd.com/resized/sm/upload/2k/iu/hz/zy/untouchable-1200-1200-675-675-crop-000000.jpg',
        year: 2011,
        duration: 112,
        rating: 4.2,
        country: 'Франция',
        genres: ['Драма', 'Комедия'],
        directors: ['Оливье Накаш', 'Эрик Толедано'],
        actors: [
            { fullName: 'Франсуа Клюзе', character: 'Филипп', order: 1 },
            { fullName: 'Омар Си', character: 'Дрисс', order: 2 },
            { fullName: 'Анн Ле Ни', character: 'Ивонн', order: 3 },
            { fullName: 'Одри Флеро', character: 'Магали', order: 4 },
            { fullName: 'Клотильд Молле', character: 'Марсель', order: 5 },
            { fullName: 'Альба Гайя Беллуджи', character: 'Элиза', order: 6 },
        ],
    },
    {
        title: 'Топ Ган: Мэверик',
        originalTitle: 'Top Gun: Maverick',
        alternativeTitles: ['Top Gun: Maverick', 'Топ Ган: Мэверик'],
        description:
            'Спустя более 30 лет службы один из лучших пилотов ВМС США Пит «Мэверик» Митчелл продолжает испытывать пределы возможного как отважный летчик-испытатель. Когда его назначают тренировать выпускников программы Top Gun для опасной миссии, Мэверик сталкивается с призраками прошлого и должен преодолеть собственные страхи ради выполнения задания.',
        posterUrl:
            'https://a.ltrbxd.com/resized/film-poster/2/9/3/4/6/5/293465-top-gun-maverick-0-2000-0-3000-crop.jpg?v=9f8af0f61b',
        bannerUrl:
            'https://a.ltrbxd.com/resized/sm/upload/ah/66/ey/4h/top-gun-maverick-1200-1200-675-675-crop-000000.jpg',
        year: 2022,
        duration: 130,
        rating: 4.0,
        country: 'США',
        genres: ['Боевик', 'Драма'],
        directors: ['Джозеф Косински'],
        actors: [
            {
                fullName: 'Том Круз',
                character: 'Капитан Пит «Мэверик» Митчелл',
                order: 1,
            },
            {
                fullName: 'Майлз Теллер',
                character: 'Лейтенант Брэдли «Задира» Брэдшоу',
                order: 2,
            },
            {
                fullName: 'Дженнифер Коннелли',
                character: 'Пенни Бенджамин',
                order: 3,
            },
            {
                fullName: 'Джон Хэмм',
                character: 'Адмирал Бью «Циклон» Симпсон',
                order: 4,
            },
            {
                fullName: 'Глен Пауэлл',
                character: 'Лейтенант Джейк «Висельник» Сересин',
                order: 5,
            },
            {
                fullName: 'Эд Харрис',
                character: 'Контр-адмирал Честер «Молот» Кейн',
                order: 6,
            },
        ],
    },
    {
        title: 'Большой Лебовски',
        originalTitle: 'The Big Lebowski',
        alternativeTitles: ['The Big Lebowski', 'Большой Лебовски'],
        description:
            'Безработный лос‑анджелесский бездельник по прозвищу Дьюд оказывается втянутым в странную историю похищения после того, как его принимают за миллионера с таким же именем. Пытаясь вернуть свой испорченный ковёр, он оказывается в центре абсурдного расследования.',
        posterUrl:
            'https://a.ltrbxd.com/resized/film-poster/5/1/9/3/5/51935-the-big-lebowski-0-2000-0-3000-crop.jpg',
        bannerUrl:
            'https://a.ltrbxd.com/resized/sm/upload/9h/c4/sh/ks/big-1200-1200-675-675-crop-000000.jpg',
        year: 1998,
        duration: 117,
        rating: 4.1,
        country: 'США',
        genres: ['Комедия', 'Криминал'],
        directors: ['Джоэл Коэн'],
        actors: [
            {
                fullName: 'Джефф Бриджес',
                character: 'Джеффри "Чувак" Лебовски',
                order: 1,
            },
            {
                fullName: 'Джон Гудман',
                character: 'Уолтер Собчак',
                order: 2,
            },
            {
                fullName: 'Стив Бушеми',
                character: 'Донни',
                order: 3,
            },
            {
                fullName: 'Джулианна Мур',
                character: 'Мод Лебовски',
                order: 4,
            },
            {
                fullName: 'Филип Сеймур Хоффман',
                character: 'Брандт',
                order: 5,
            },
            {
                fullName: 'Дэвид Хаддлстон',
                character: 'Большой Лебовски',
                order: 6,
            },
        ],
    },
    {
        title: 'Ford против Ferrari',
        originalTitle: 'Ford v Ferrari',
        alternativeTitles: ['Ford v Ferrari', 'Ford против Ferrari'],
        description:
            'Американский дизайнер автомобилей Кэрролл Шелби и британский гонщик Кен Майлз объединяются, чтобы создать революционный гоночный автомобиль для Ford Motor Company и бросить вызов доминирующим Ferrari на 24 часах Ле-Мана в 1966 году.',
        posterUrl:
            'https://a.ltrbxd.com/resized/film-poster/2/9/1/4/1/9/291419-ford-v-ferrari-0-2000-0-3000-crop.jpg?v=27ed4e72db',
        bannerUrl:
            'https://a.ltrbxd.com/resized/sm/upload/j6/rv/uv/sq/ford-v-ferrari-1200-1200-675-675-crop-000000.jpg',
        year: 2019,
        duration: 152,
        rating: 4.0,
        country: 'США',
        genres: ['Боевик', 'Биография', 'Драма', 'Спорт'],
        directors: ['Джеймс Мэнголд'],
        actors: [
            { fullName: 'Мэтт Дэймон', character: 'Кэрролл Шелби', order: 1 },
            { fullName: 'Кристиан Бэйл', character: 'Кен Майлз', order: 2 },
            { fullName: 'Джон Бернтал', character: 'Ли Якокка', order: 3 },
            { fullName: 'Катрина Балф', character: 'Молли Майлз', order: 4 },
            { fullName: 'Джош Лукас', character: 'Лео Биби', order: 5 },
            { fullName: 'Ноа Джуп', character: 'Питер Майлз', order: 6 },
        ],
    },
    {
        title: 'Хамнет',
        alternativeTitles: ['Hamnet', 'Хамнет'],
        description:
            'История Агнес, жены самого известного в мире драматурга, которая пытается справиться с потерей своего единственного сына Хамнета. Боль на фоне эпидемии чумы перерастает в создание одной из величайших пьес в истории.',
        posterUrl:
            'https://a.ltrbxd.com/resized/film-poster/7/7/2/2/3/2/772232-hamnet-0-2000-0-3000-crop.jpg',
        bannerUrl:
            'https://a.ltrbxd.com/resized/alternative-backdrop/7/7/2/2/3/2/tmdb/yt9m5CiU2MZkQoNl1kqLPODNR4t-1200-1200-675-675-crop-000000.jpg',
        year: 2025,
        duration: 125,
        rating: 4.2,
        country: 'США',
        genres: ['Драма', 'История'],
        directors: ['Хлоя Чжао'],
        actors: [
            {
                fullName: 'Джесси Бакли',
                character: 'Агнес Хэтэуэй',
                order: 1,
            },
            {
                fullName: 'Пол Мескал',
                character: 'Уильям Шекспир',
                order: 2,
            },
            {
                fullName: 'Эмили Уотсон',
                character: 'Джоан Хэтэуэй',
                order: 3,
            },
            {
                fullName: 'Джо Элвин',
                character: 'Бартоломей',
                order: 4,
            },
        ],
    },
    {
        title: 'Драма',
        originalTitle: 'The Drama',
        alternativeTitles: ['The Drama', 'Драма'],
        description:
            'Загадочный проект Кристоффера Боргли. История пары, чьи отношения подвергаются неожиданному испытанию перед самой свадьбой, когда всплывают тайны прошлого.',
        posterUrl:
            'https://a.ltrbxd.com/resized/film-poster/1/2/0/5/4/9/4/1205494-the-drama-0-2000-0-3000-crop.jpg?v=2320acafd5',
        bannerUrl:
            'https://a.ltrbxd.com/resized/sm/upload/6o/d7/gp/q6/5qzLJcwua0ETNYgGRIXu40i4lKK-1200-1200-675-675-crop-000000.jpg',
        year: 2025,
        duration: 110,
        rating: 3.8,
        country: 'США',
        genres: ['Драма', 'Мелодрама'],
        directors: ['Кристоффер Боргли'],
        actors: [
            { fullName: 'Зендея', character: 'Нина', order: 1 },
            { fullName: 'Роберт Паттинсон', character: 'Сэм', order: 2 },
        ],
    },
    {
        title: 'Волк с Уолл-стрит',
        originalTitle: 'The Wolf of Wall Street',
        alternativeTitles: ['The Wolf of Wall Street', 'Волк с Уолл-стрит'],
        description:
            'Невероятная и ироничная история восхождения Джордана Белфорта — от мелкого брокера до мультимиллионера, прожигающего жизнь в вихре наркотиков, секса и махинаций на фондовом рынке.',
        posterUrl:
            'https://a.ltrbxd.com/resized/film-poster/8/6/1/1/4/86114-the-wolf-of-wall-street-0-2000-0-3000-crop.jpg?v=a2b958b6f1',
        bannerUrl:
            'https://a.ltrbxd.com/resized/sm/upload/cq/zm/xo/3z/wolf-of-wall-street-1200-1200-675-675-crop-000000.jpg',
        year: 2013,
        duration: 180,
        rating: 4.0,
        country: 'США',
        genres: ['Комедия', 'Криминал', 'Драма'],
        directors: ['Мартин Скорсезе'],
        actors: [
            {
                fullName: 'Леонардо ДиКаприо',
                character: 'Джордан Белфорт',
                order: 1,
            },
            { fullName: 'Джона Хилл', character: 'Донни Азофф', order: 2 },
            { fullName: 'Марго Робби', character: 'Наоми Лапалья', order: 3 },
            { fullName: 'Мэттью МакКонахи', character: 'Марк Ханна', order: 4 },
        ],
    },
]

const createSlug = (text: string) =>
    slugify(text, { lower: true, strict: true, locale: 'ru' })

const salt = await bcrypt.genSalt(10)

const PASS_HASH = await bcrypt.hash('123456', salt)

async function seed() {
    console.log('Database seeding started')

    try {
        await db.transaction(async (tx) => {
            console.log('Clearing existing records')

            // await tx.delete(schema.movieCast)
            // await tx.delete(schema.movieCrew)
            // await tx.delete(schema.filmsToGenres)
            // await tx.delete(schema.diary)
            // await tx.delete(schema.reviews)
            // await tx.delete(schema.watchlist)
            // await tx.delete(schema.sessions)
            // await tx.delete(schema.accounts)
            // await tx.delete(schema.twoFactor)
            // await tx.delete(schema.verifications)
            // await tx.delete(schema.payments)
            // await tx.delete(schema.subscriptions)
            // await tx.delete(schema.films)
            // await tx.delete(schema.persons)
            // await tx.delete(schema.genres)
            // await tx.delete(schema.users)

            const createdFilmIds: string[] = []
            const movieTargetRatings = new Map<string, number>()

            for (const movie of MOVIES) {
                const filmId = crypto.randomUUID()

                createdFilmIds.push(filmId)
                movieTargetRatings.set(filmId, movie.rating)

                console.log(`Processing film: ${movie.title}`)

                await tx.insert(films).values({
                    id: filmId,
                    slug: `${createSlug(movie.title)}-${movie.year}`,
                    title: movie.title,
                    originalTitle: movie.originalTitle,
                    description: movie.description,
                    year: movie.year,
                    duration: movie.duration,
                    rating: movie.rating,
                    posterUrl: movie.posterUrl,
                    bannerUrl: movie.bannerUrl,
                    alternativeTitles: movie.alternativeTitles,
                    country: movie.country,
                })

                for (const genreName of movie.genres) {
                    const genreSlug = createSlug(genreName)

                    const [genre] = await tx
                        .insert(genres)
                        .values({
                            id: crypto.randomUUID(),
                            slug: genreSlug,
                            name: genreName,
                        })
                        .onConflictDoUpdate({
                            target: genres.slug,
                            set: { name: genreName },
                        })
                        .returning()

                    await tx
                        .insert(filmsToGenres)
                        .values({
                            filmId: filmId,
                            genreId: genre.id,
                        })
                        .onConflictDoNothing()
                }

                for (const directorName of movie.directors) {
                    const personId = crypto.randomUUID()
                    const personSlug = createSlug(directorName)

                    const [director] = await tx
                        .insert(persons)
                        .values({
                            id: personId,
                            slug: personSlug,
                            name: directorName,
                        })
                        .onConflictDoUpdate({
                            target: persons.slug,
                            set: { name: directorName },
                        })
                        .returning()

                    await tx
                        .insert(movieCrew)
                        .values({
                            filmId: filmId,
                            personId: director.id,
                            job: 'Director',
                        })
                        .onConflictDoNothing()
                }

                for (const actor of movie.actors) {
                    const personId = crypto.randomUUID()
                    const personSlug = createSlug(actor.fullName)

                    const [actorRecord] = await tx
                        .insert(persons)
                        .values({
                            id: personId,
                            slug: personSlug,
                            name: actor.fullName,
                        })
                        .onConflictDoUpdate({
                            target: persons.slug,
                            set: { name: actor.fullName },
                        })
                        .returning()

                    await tx
                        .insert(movieCast)
                        .values({
                            filmId: filmId,
                            personId: actorRecord.id,
                            characterName: actor.character,
                            order: actor.order,
                        })
                        .onConflictDoNothing()
                }
            }

            console.log(
                'Films and related entities seeded. Starting user seeding...',
            )

            const TOTAL_USERS = 25000
            const BATCH_SIZE = 500

            for (let i = 0; i < TOTAL_USERS; i += BATCH_SIZE) {
                const batchUsers = []
                const batchAccounts = []
                const batchDiary = []
                const batchReviews = []
                const batchWatchlist = []

                for (let j = 0; j < BATCH_SIZE; j++) {
                    const uId = crypto.randomUUID()
                    const firstName = faker.person.firstName()
                    const lastName = faker.person.lastName()
                    const username =
                        faker.internet
                            .username({ firstName, lastName })
                            .toLowerCase() + faker.string.alphanumeric(3)
                    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}.${uId.toLowerCase().slice(-5)}@gmail.com`

                    batchUsers.push({
                        id: uId,
                        name: `${firstName} ${lastName}`,
                        username,
                        email,
                        avatar: faker.image.avatar(),
                        createdAt: faker.date.past({ years: 2 }),
                    })

                    batchAccounts.push({
                        id: crypto.randomUUID(),
                        userId: uId,
                        accountId: uId,
                        providerId: 'credential',
                        password: PASS_HASH,
                    })

                    const watchedCount = faker.number.int({ min: 1, max: 12 })
                    const selectedFilms = faker.helpers.arrayElements(
                        createdFilmIds,
                        watchedCount,
                    )

                    for (const filmId of selectedFilms) {
                        const targetRating =
                            movieTargetRatings.get(filmId) || 4.0

                        const hasRating = faker.datatype.boolean(0.7)
                        let rId: string | undefined = undefined

                        if (hasRating) {
                            rId = crypto.randomUUID()

                            const rating = faker.helpers.weightedArrayElement([
                                { weight: 45, value: targetRating },
                                {
                                    weight: 20,
                                    value: Math.min(5, targetRating + 0.5),
                                },
                                {
                                    weight: 20,
                                    value: Math.max(0.5, targetRating - 0.5),
                                },
                                {
                                    weight: 10,
                                    value: Math.min(5, targetRating + 1.0),
                                },
                                {
                                    weight: 5,
                                    value: Math.max(0.5, targetRating - 1.5),
                                },
                            ])

                            batchReviews.push({
                                id: rId,
                                content: faker.lorem.sentences(
                                    faker.number.int({ min: 1, max: 3 }),
                                ),
                                rating: rating,
                                userId: uId,
                                filmId,
                                isContainsSpoilers: faker.datatype.boolean(0.1),
                                createdAt: faker.date.recent(),
                            })
                        }

                        batchDiary.push({
                            id: crypto.randomUUID(),
                            userId: uId,
                            filmId,
                            reviewId: rId,
                            watchedAtDate: faker.date
                                .past({ years: 1 })
                                .toISOString()
                                .split('T')[0],
                            isRewatch: faker.datatype.boolean(0.1),
                            createdAt: faker.date.recent(),
                        })
                    }

                    const watchlistCount = faker.number.int({ min: 0, max: 10 })

                    const unviewedFilms = createdFilmIds.filter(
                        (id) => !selectedFilms.includes(id),
                    )
                    const watchlistFilms = faker.helpers.arrayElements(
                        unviewedFilms,
                        Math.min(watchlistCount, unviewedFilms.length),
                    )

                    for (const filmId of watchlistFilms) {
                        batchWatchlist.push({
                            userId: uId,
                            filmId,
                            addedAt: faker.date.recent(),
                        })
                    }
                }

                await tx.insert(users).values(batchUsers)
                await tx.insert(accounts).values(batchAccounts)
                if (batchReviews.length > 0)
                    await tx.insert(reviews).values(batchReviews)
                if (batchDiary.length > 0)
                    await tx.insert(diary).values(batchDiary)
                if (batchWatchlist.length > 0)
                    await tx.insert(watchlist).values(batchWatchlist)

                console.log(
                    `Seeded batch ${i / BATCH_SIZE + 1}/${TOTAL_USERS / BATCH_SIZE}`,
                )
            }
        })

        console.log('Seeding completed successfully')
    } catch (error) {
        console.error('Seeding failed')
        console.error(error)
        process.exit(1)
    }
}

seed()