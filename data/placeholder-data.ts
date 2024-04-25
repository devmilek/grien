import {
  Category,
  Cuisine,
  CuisinesOnRecipes,
  Diet,
  DietsOnRecipes,
  Difficulty,
  Ingredient,
  Occasion,
  OccasionsOnRecipes,
  PreparationStep,
  Recipe,
  User,
} from "@prisma/client";

export const aiProfile: User = {
  id: "b617d56d-e526-4f86-94e1-545e784388b4",
  name: "Szef kuchni AI",
  bio: "Jestem szefem kuchni AI i uwielbiam gotować. Moje przepisy generowane są maszynowo, więc uważaj bo czasem się myle.",
  email: "ai@grief.devmilek.pl",
  image: null,

  emailVerified: new Date(),
  password: process.env.AI_USER_PASS!,
};

export const categories = [
  {
    name: "Sałatki",
    image:
      "https://firebasestorage.googleapis.com/v0/b/grief-8ecef.appspot.com/o/categories%2Fpexels-roman-odintsov-4958950.avif?alt=media&token=e1cfea2e-d8bf-4ac3-bbad-65ce1a385f1c",
  },
  {
    name: "Przetwory",
    image:
      "https://firebasestorage.googleapis.com/v0/b/grief-8ecef.appspot.com/o/categories%2Fpexels-pixabay-48817%20(1).avif?alt=media&token=15938332-cc4a-4fdf-8484-6d7104fde1ba",
  },
  {
    name: "Napoje",
    image:
      "https://firebasestorage.googleapis.com/v0/b/grief-8ecef.appspot.com/o/categories%2Fpexels-rene-asmussen-3217151.avif?alt=media&token=8a2a0a07-d2bb-4c8b-81f5-777e6e82d997",
  },
  {
    name: "Dania główne",
    image:
      "https://firebasestorage.googleapis.com/v0/b/grief-8ecef.appspot.com/o/categories%2Fpexels-sebastian-coman-photography-3791089.avif?alt=media&token=4d899acf-f6a6-4330-95ca-b903fbf3a96b",
  },
  {
    name: "Desery",
    image:
      "https://firebasestorage.googleapis.com/v0/b/grief-8ecef.appspot.com/o/categories%2Fpexels-geraud-pfeiffer-6605961.avif?alt=media&token=38197b60-a6da-45a1-b0d2-80c339d99f6d",
  },
  {
    name: "Pieczywo",
    image:
      "https://firebasestorage.googleapis.com/v0/b/grief-8ecef.appspot.com/o/categories%2Fpexels-mariana-kurnyk-1775043.avif?alt=media&token=404597e5-43b7-4c9c-9177-7d2ca3bf7391",
  },
  {
    name: "Zupy",
    image:
      "https://firebasestorage.googleapis.com/v0/b/grief-8ecef.appspot.com/o/categories%2Fpexels-valeria-boltneva-1277483.avif?alt=media&token=9a3c632b-accd-4bb0-8580-56f8f9168f14",
  },
  {
    name: "Śniadania",
    image:
      "https://firebasestorage.googleapis.com/v0/b/grief-8ecef.appspot.com/o/categories%2Fpexels-sueda-19047503.avif?alt=media&token=d223c264-2052-49e2-b16a-a5d07770165c",
  },
  {
    name: "Przekąski",
    image:
      "https://firebasestorage.googleapis.com/v0/b/grief-8ecef.appspot.com/o/categories%2Fpexels-lucas-guizo-5337821.avif?alt=media&token=190ab9c2-85b1-404c-a285-a734e5388845",
  },
  {
    name: "Wędliny",
    image:
      "https://firebasestorage.googleapis.com/v0/b/grief-8ecef.appspot.com/o/categories%2Fpexels-ruslan-khmelevsky-14118155.avif?alt=media&token=31470028-5f45-40c3-9e22-e78eba16447e",
  },
  {
    name: "Dodatki",
    image:
      "https://firebasestorage.googleapis.com/v0/b/grief-8ecef.appspot.com/o/categories%2Fpexels-pixabay-36756.avif?alt=media&token=e5db25f5-2152-4765-8d3b-35e0293adc92",
  },
];

export const occasions = [
  "Do pracy",
  "Boże narodzenie",
  "Grill",
  "Halloween",
  "Walentynki",
  "Impreza",
  "Tłusty czwartek",
  "Wielkanoc",
  "Komunia",
];

export const cuisines = [
  "Żydowska",
  "Tajska",
  "Chińska",
  "Czeska",
  "Włoska",
  "Meksykańska",
  "Ukraińska",
  "Grecka",
  "Francuska",
  "Polska",
  "Węgierska",
  "Indyjska",
  "Bałkańska",
  "Azjatycka",
  "Śródziemnomorska",
  "Amerykańska",
];

export const diets = [
  "Bez glutenu",
  "Dla dzieci",
  "Bez laktozy",
  "Dla zdrowia",
  "Bez cukru",
  "Wegetariańskie",
  "Wegańskie",
  "Dietetyczne",
  "Ketogeniczne",
];

type RecipeWithRelations = Recipe & {
  category: Category;
  cuisines: CuisinesOnRecipes[];
  diets?: DietsOnRecipes[];
  occasions?: OccasionsOnRecipes[];
  ingredients: Ingredient[];
  steps: PreparationStep[];
};

export type RecipeWithRelationsWithoutId = {
  name: string;
  description: string;
  image: string;
  difficulty: string;
  preparationTime: number;
  servings: number;
  ingredients: {
    quantity: number;
    unit: string;
    name: string;
  }[];
  steps: {
    description: string;
    position: number;
  }[];
};

// export const recipes: RecipeWithRelations[] = [
//   {
//     id: "5c161ca7-1cf0-4be1-9a68-2c81d8e079ce",
//     name: "Zapiekanka ziemniaczana z kiełbasą",
//     description:
//       "Zapiekanka ziemniaczana z kiełbasą to proste, sycące danie, które zadowoli nawet najbardziej wybredne podniebienia. Ziemniaki w połączeniu z aromatyczną kiełbasą i rozpuszczonym serem tworzą idealny zestaw smaków. To danie świetnie sprawdzi się na obiad lub kolację dla całej rodziny.",
//     image:
//       "https://firebasestorage.googleapis.com/v0/b/grief-8ecef.appspot.com/o/images%2Frecipe-5c161ca7-1cf0-4be1-9a68-2c81d8e079ce%2Fcover%2Fpexels-roman-odintsov-4552980.jpg?alt=media&token=7b49925f-4063-4487-a0b4-053538adb31b",
//     difficulty: "EASY",
//     preparationTime: 190,
//     published: true,
//     servings: 6,
//     categoryId: "68127b54-8880-4b65-bf00-566c6712bc35",
//     userId: aiProfile.id,
//     createdAt: new Date(),
//     updatedAt: new Date(),
//     cuisines: [],
//     category: {
//       id: "68127b54-8880-4b65-bf00-566c6712bc35",
//       slug: "dania-glowne",
//       name: "Dania główne",
//       image:
//         "https://firebasestorage.googleapis.com/v0/b/grief-8ecef.appspot.com/o/categories%2Fpexels-sebastian-coman-photography-3791089.avif?alt=media&token=4d899acf-f6a6-4330-95ca-b903fbf3a96b",
//     },
//     ingredients: [
//       {
//         id: "499a7030-340c-4111-8b61-807bdb050e73",
//         quantity: 2,
//         unit: "",
//         name: "jajka",
//         recipeId: "5c161ca7-1cf0-4be1-9a68-2c81d8e079ce",
//       },
//       {
//         id: "6b847db1-d686-46c5-a4f8-6a0b53fe3960",
//         quantity: 1,
//         unit: "kg",
//         name: "ziemniaków, obranych i pokrojonych w plastry",
//         recipeId: "5c161ca7-1cf0-4be1-9a68-2c81d8e079ce",
//       },
//       {
//         id: "790c0c3b-bc37-42f1-9e90-45294d82ae30",
//         quantity: 200,
//         unit: "gram",
//         name: "sera zółtego",
//         recipeId: "5c161ca7-1cf0-4be1-9a68-2c81d8e079ce",
//       },
//       {
//         id: "afa80df2-db42-4674-a1ab-3769807a3233",
//         quantity: 2,
//         unit: "",
//         name: "ząbki czonsku",
//         recipeId: "5c161ca7-1cf0-4be1-9a68-2c81d8e079ce",
//       },
//       {
//         id: "bb7d614b-02d0-4a88-abcf-36e80fffef7c",
//         quantity: 400,
//         unit: "gram",
//         name: "kiełbasy",
//         recipeId: "5c161ca7-1cf0-4be1-9a68-2c81d8e079ce",
//       },
//       {
//         id: "de98cbcd-086f-4e36-8f54-b897342fbaee",
//         quantity: 1,
//         unit: "",
//         name: "cebula",
//         recipeId: "5c161ca7-1cf0-4be1-9a68-2c81d8e079ce",
//       },
//       {
//         id: "e5c03108-21b2-490b-b8c2-8eb03e5d2627",
//         quantity: 1,
//         unit: "łyżka",
//         name: "masła",
//         recipeId: "5c161ca7-1cf0-4be1-9a68-2c81d8e079ce",
//       },
//     ],
//     steps: [
//       {
//         id: "7c289b74-a713-43c5-9708-7f9846431c84",
//         description:
//           "Wbij jajka do sosu, posyp całość pozostałym startym serem. Piecz w nagrzanym piekarniku do momentu, gdy ser stanie się złocisty i zapiekanka ziemniaczana nabierze apetycznego wyglądu.",
//         position: 5,
//         image: "",
//         recipeId: "5c161ca7-1cf0-4be1-9a68-2c81d8e079ce",
//       },
//       {
//         id: "82c54bf9-ea42-4abf-8b7e-76c1547ae941",
//         description:
//           "Wyjmij zapiekankę z piekarnika, posyp ją świeżą posiekaną natką pietruszki. Podawaj gorącą, krojąc na porcje.",
//         position: 6,
//         image: "",
//         recipeId: "5c161ca7-1cf0-4be1-9a68-2c81d8e079ce",
//       },
//       {
//         id: "a0b5b3a1-e316-47a1-aa64-34c1c1d2c2f8",
//         description:
//           "Ziemniaki obierz, umyj i pokrój na cienkie plastry. Gotuj w osolonej wodzie do momentu, gdy staną się miękkie, ale nie rozgotowane. Odcedź.",
//         position: 1,
//         image: "",
//         recipeId: "5c161ca7-1cf0-4be1-9a68-2c81d8e079ce",
//       },
//       {
//         id: "c64ddf68-d9c1-44af-8128-a7140bcb0319",
//         description:
//           "W rondlu rozpuść masło, dodaj mleko, a następnie wsyp stopniowo starty ser, mieszając ciągle, aby uzyskać gładki sos. Dopraw solą i pieprzem do smaku.",
//         position: 3,
//         image: "",
//         recipeId: "5c161ca7-1cf0-4be1-9a68-2c81d8e079ce",
//       },
//       {
//         id: "e10ea521-069e-425d-8849-0f71a918b025",
//         description:
//           "W natłuszczonym naczyniu żaroodpornym układaj warstwę gotowanych ziemniaków, na nich rozłóż połowę kiełbasy z cebulą i czosnkiem. Zalej połową sosu serowego. Powtórz warstwy.",
//         position: 4,
//         image: "",
//         recipeId: "5c161ca7-1cf0-4be1-9a68-2c81d8e079ce",
//       },
//       {
//         id: "fdaa66ce-3695-4d6e-8470-bb093ab06de8",
//         description:
//           "Kiełbasę pokrój na plastry lub kostki, a następnie podsmaż na patelni do momentu, gdy uzyska złoty kolor. Dodaj posiekaną cebulę i czosnek, smażąc, aż warzywa zmiękną.",
//         position: 2,
//         image: "",
//         recipeId: "5c161ca7-1cf0-4be1-9a68-2c81d8e079ce",
//       },
//     ],
//   },
//   {
//     id: "8edd540b-0d00-4cdf-abae-7a62434db310",
//     name: "Ryba ze szpinakiem",
//     description:
//       "Ryba ze szpinakiem to danie pełne smaku i zdrowych składników. Delikatne filety rybne w połączeniu ze szpinakiem, aromatycznym czosnkiem i soczystymi pomidorami tworzą lekki i pyszny posiłek. Prosty w przygotowaniu, ten przepis z pewnością przypadnie do gustu miłośnikom zdrowego jedzenia.",
//     image:
//       "https://firebasestorage.googleapis.com/v0/b/grief-8ecef.appspot.com/o/images%2Frecipe-8edd540b-0d00-4cdf-abae-7a62434db310%2Fcover%2Fpexels-nadin-sh-19051900%20(1).jpg?alt=media&token=a0bdab09-935a-4a5d-920b-354db9583b43",
//     difficulty: "HARD",
//     preparationTime: 120,
//     published: true,
//     servings: 1,
//     categoryId: "68127b54-8880-4b65-bf00-566c6712bc35",
//     userId: aiProfile.id,
//     createdAt: new Date(),
//     updatedAt: new Date(),
//     cuisines: [],
//     category: {
//       id: "68127b54-8880-4b65-bf00-566c6712bc35",
//       slug: "dania-glowne",
//       name: "Dania główne",
//       image:
//         "https://firebasestorage.googleapis.com/v0/b/grief-8ecef.appspot.com/o/categories%2Fpexels-sebastian-coman-photography-3791089.avif?alt=media&token=4d899acf-f6a6-4330-95ca-b903fbf3a96b",
//     },
//     ingredients: [
//       {
//         id: "02e26479-d981-4a30-80c0-3ba9eecc4307",
//         quantity: 2,
//         unit: "łyzki",
//         name: "oliwy",
//         recipeId: "8edd540b-0d00-4cdf-abae-7a62434db310",
//       },
//       {
//         id: "4b716f28-36bf-437d-9308-9e0b9f6e82ed",
//         quantity: 1,
//         unit: "sztuki",
//         name: "cebuli",
//         recipeId: "8edd540b-0d00-4cdf-abae-7a62434db310",
//       },
//       {
//         id: "a9a2a0ab-e809-4685-b7ff-474b5063a62f",
//         quantity: 300,
//         unit: "gram",
//         name: "świeżego szpinaku",
//         recipeId: "8edd540b-0d00-4cdf-abae-7a62434db310",
//       },
//       {
//         id: "b9861e80-107e-4284-b040-6480c56988a8",
//         quantity: 3,
//         unit: "ząbki",
//         name: "czosnku",
//         recipeId: "8edd540b-0d00-4cdf-abae-7a62434db310",
//       },
//       {
//         id: "d68fd7f9-0b2e-44ef-b98f-8ac6217c082c",
//         quantity: 4,
//         unit: "filety",
//         name: "białej ryby",
//         recipeId: "8edd540b-0d00-4cdf-abae-7a62434db310",
//       },
//     ],
//     steps: [
//       {
//         id: "3822a85d-0060-498e-aee3-606a6b15ca15",
//         description:
//           "Przygotowanie ryb:\n\nOczyść i umyj filety z ryby. Osusz je papierowym ręcznikiem i posól oraz popieprz z obu stron.",
//         position: 1,
//         image: "",
//         recipeId: "8edd540b-0d00-4cdf-abae-7a62434db310",
//       },
//       {
//         id: "588a943e-1acc-4485-bda6-af2b2417ade2",
//         description:
//           "Smażenie ryb:\n\nRozgrzej oliwę na dużej patelni. Smaż filety z obu stron na średnim ogniu, aż staną się rumiane i łatwo będzie je dzielić widelcem. Przełóż na talerz i przykryj folią aluminiową.",
//         position: 2,
//         image: "",
//         recipeId: "8edd540b-0d00-4cdf-abae-7a62434db310",
//       },
//       {
//         id: "75c95871-9c40-4d7c-a259-aa243b28e794",
//         description:
//           "Doprawienie i podanie:\n\nDopraw danie solą i pieprzem według własnego smaku.\nPosyp posiekaną natką pietruszki.",
//         position: 5,
//         image: "",
//         recipeId: "8edd540b-0d00-4cdf-abae-7a62434db310",
//       },
//       {
//         id: "7d675e28-eb90-4edf-af9b-a445751bac39",
//         description:
//           "Podgrzewanie ryb:\n\nPrzełóż filety na patelnię z szpinakiem. Delikatnie obtocz w warzywach, skraplając sokiem z cytryny.",
//         position: 4,
//         image: "",
//         recipeId: "8edd540b-0d00-4cdf-abae-7a62434db310",
//       },
//       {
//         id: "bd0cbd88-c090-43bd-8cf9-b664cfa61a41",
//         description:
//           "Podanie:\n\nDanie podawaj od razu, najlepiej na ciepło, by zachować delikatność ryby.",
//         position: 6,
//         image: "",
//         recipeId: "8edd540b-0d00-4cdf-abae-7a62434db310",
//       },
//       {
//         id: "f2e35151-dcdb-4df8-95c0-f1d4ed194906",
//         description:
//           "Przygotowanie szpinaku:\n\nNa tej samej patelni rozgrzej masło. Dodaj posiekaną cebulę i czosnek, smażąc aż będą miękkie.",
//         position: 3,
//         image: "",
//         recipeId: "8edd540b-0d00-4cdf-abae-7a62434db310",
//       },
//     ],
//   },
//   {
//     id: "c5d35465-d4a6-4786-b985-1bc828edc700",
//     name: "Ciasto Smerfetka",
//     description:
//       "Ciasto Smerfetka to słodki, niebiański przysmak, który z pewnością rozbawi i zachwyci każde podniebienie. Z lekko kwaśnym smakiem jagód, delikatnym musem i puszystym ciastem, to ciasto sprawi, że Twoje podniebienie poczuje się jak w magicznym świecie Smerfów.",
//     image:
//       "https://firebasestorage.googleapis.com/v0/b/grief-8ecef.appspot.com/o/images%2Frecipe-c5d35465-d4a6-4786-b985-1bc828edc700%2Fcover%2Fpexels-valeria-boltneva-1247670.jpg?alt=media&token=5f2dea88-f545-438a-bf0d-15320bf3124d",
//     difficulty: "MEDIUM",
//     preparationTime: 230,
//     published: true,
//     servings: 13,
//     categoryId: "720f659b-0daa-4a33-bda1-8473a6a6f7bf",
//     userId: aiProfile.id,
//     createdAt: new Date(),
//     updatedAt: new Date(),
//     cuisines: [
//       {
//         recipeId: "c5d35465-d4a6-4786-b985-1bc828edc700",
//         cuisineId: "12be8dcf-15e5-4926-bc99-77f851d6ea72",
//       },
//       {
//         recipeId: "c5d35465-d4a6-4786-b985-1bc828edc700",
//         cuisineId: "ee96b1c0-0c5a-4fa5-abd6-3fc599dd4f1b",
//       },
//     ],
//     category: {
//       id: "720f659b-0daa-4a33-bda1-8473a6a6f7bf",
//       slug: "desery",
//       name: "Desery",
//       image:
//         "https://firebasestorage.googleapis.com/v0/b/grief-8ecef.appspot.com/o/categories%2Fpexels-geraud-pfeiffer-6605961.avif?alt=media&token=38197b60-a6da-45a1-b0d2-80c339d99f6d",
//     },
//     ingredients: [
//       {
//         id: "5cba1009-e587-49e6-9686-78f25d93dcf9",
//         quantity: 2,
//         unit: "szklanki",
//         name: "mąki",
//         recipeId: "c5d35465-d4a6-4786-b985-1bc828edc700",
//       },
//       {
//         id: "8be8a4de-2693-4afd-9b38-c9bdde5e8969",
//         quantity: 500,
//         unit: "gram",
//         name: "serka homogenizowanego",
//         recipeId: "c5d35465-d4a6-4786-b985-1bc828edc700",
//       },
//       {
//         id: "b186c85d-ebd1-4a96-ab8c-426efcac3397",
//         quantity: 2,
//         unit: "szklanki",
//         name: "świeżych owoców",
//         recipeId: "c5d35465-d4a6-4786-b985-1bc828edc700",
//       },
//       {
//         id: "f3ce01ca-3190-4def-89be-2dbf245b4c3c",
//         quantity: 3,
//         unit: "sztuki",
//         name: "jajek",
//         recipeId: "c5d35465-d4a6-4786-b985-1bc828edc700",
//       },
//       {
//         id: "fa7b253b-60c3-43d6-b17e-a4ba81267c3b",
//         quantity: 1,
//         unit: "szklanka",
//         name: "cukru",
//         recipeId: "c5d35465-d4a6-4786-b985-1bc828edc700",
//       },
//     ],
//     steps: [
//       {
//         id: "0198858c-ea1b-4632-b336-8150971fdc09",
//         description:
//           "Pieczenie ciasta:\n\nPiecz w rozgrzanym do 180°C piekarniku przez około 30-35 minut lub do momentu, gdy wbity w ciasto patyczek będzie suchy.\nWyjmij ciasto z piekarnika i pozostaw do ostygnięcia.",
//         position: 2,
//         image: "",
//         recipeId: "c5d35465-d4a6-4786-b985-1bc828edc700",
//       },
//       {
//         id: "047dce54-fb72-40d2-a4bc-d655e2fc61da",
//         description:
//           "Przygotowanie ciasta:\n\nW misie miksera umieść jajka, cukier i olej. Ubijaj na puszystą masę.\nDodaj jogurt i ekstrakt waniliowy, kontynuuj ubijanie.\nW osobnej misce połącz mąkę i proszek do pieczenia.\nStopniowo dodawaj suchą mieszankę do mokrej, cały czas mieszając, aby uniknąć grudek.\nPrzełóż ciasto do formy wyłożonej papierem do pieczenia.",
//         position: 1,
//         image: "",
//         recipeId: "c5d35465-d4a6-4786-b985-1bc828edc700",
//       },
//       {
//         id: "63558954-5b84-4db6-8f4a-27a23d32bd0e",
//         description:
//           "Przygotowanie kremu:\n\nW misie miksera umieść serek wiejski, cukier puder i ekstrakt waniliowy. Ubijaj do uzyskania gładkiego kremu.",
//         position: 4,
//         image: "",
//         recipeId: "c5d35465-d4a6-4786-b985-1bc828edc700",
//       },
//       {
//         id: "a9fd5461-85ca-4991-9271-f0e6ced38037",
//         description:
//           "Przygotowanie musu jagodowego:\n\nW rondlu podgrzej jagody, cukier i sok z cytryny.\nGotuj na małym ogniu przez około 15 minut, aż jagody zmiękną.\nZblenduj masę na gładki mus. Odstaw do ostygnięcia.",
//         position: 3,
//         image: "",
//         recipeId: "c5d35465-d4a6-4786-b985-1bc828edc700",
//       },
//       {
//         id: "b88898c2-35fc-47b5-ba27-2c4475b11b36",
//         description:
//           "Składanie ciasta:\n\nPo ostygnięciu ciasta przekrój je na pół.\nNa dolnej części rozsmaruj połowę musem jagodowego, a następnie nałóż połowę kremu.\nPrzykryj górną częścią ciasta.",
//         position: 5,
//         image: "",
//         recipeId: "c5d35465-d4a6-4786-b985-1bc828edc700",
//       },
//       {
//         id: "c59d0cb8-a79d-4eed-9d6c-a66da114fc00",
//         description:
//           "Dekoracja:\n\nPozostałym musem jagodowym i kremem ozdób wierzch ciasta według własnego pomysłu.\nSchłódź w lodówce przez co najmniej 2 godziny przed podaniem.",
//         position: 6,
//         image: "",
//         recipeId: "c5d35465-d4a6-4786-b985-1bc828edc700",
//       },
//     ],
//   },
//   {
//     id: "e43e236e-2033-45ae-8b44-034cdd6bfdf3",
//     name: "Fasolka po bretońsku z kiełbasą",
//     description:
//       "Fasolka po bretońsku to tradycyjne danie kuchni francuskiej, które wzbogacono smakiem i aromatem kiełbasy. To połączenie soczystej fasolki, pikantnej kiełbasy, cebuli i ziół, które zachwyci miłośników prostych, domowych smaków. To danie jest doskonałym wyborem na rozgrzewający obiad, zwłaszcza w chłodne dni.",
//     image:
//       "https://firebasestorage.googleapis.com/v0/b/grief-8ecef.appspot.com/o/images%2Frecipe-e43e236e-2033-45ae-8b44-034cdd6bfdf3%2Fcover%2Fpexels-nadin-sh-17346226.jpg?alt=media&token=e2b12a8a-72e0-425f-8083-a50ee0ad928b",
//     difficulty: "HARD",
//     preparationTime: 148,
//     published: true,
//     servings: 12,
//     categoryId: "68127b54-8880-4b65-bf00-566c6712bc35",
//     userId: aiProfile.id,
//     createdAt: new Date(),
//     updatedAt: new Date(),
//     cuisines: [
//       {
//         recipeId: "e43e236e-2033-45ae-8b44-034cdd6bfdf3",
//         cuisineId: "08af99ba-c599-4f2f-b7cd-827774bff569",
//       },
//       {
//         recipeId: "e43e236e-2033-45ae-8b44-034cdd6bfdf3",
//         cuisineId: "2a9a5bb5-5835-4094-8924-3fd840aee7b4",
//       },
//       {
//         recipeId: "e43e236e-2033-45ae-8b44-034cdd6bfdf3",
//         cuisineId: "8364e68c-f35a-42ca-825e-9ede07022cba",
//       },
//     ],
//     category: {
//       id: "68127b54-8880-4b65-bf00-566c6712bc35",
//       slug: "dania-glowne",
//       name: "Dania główne",
//       image:
//         "https://firebasestorage.googleapis.com/v0/b/grief-8ecef.appspot.com/o/categories%2Fpexels-sebastian-coman-photography-3791089.avif?alt=media&token=4d899acf-f6a6-4330-95ca-b903fbf3a96b",
//     },
//     ingredients: [
//       {
//         id: "644294bf-fb5e-4495-a9c8-ca648cf146b4",
//         quantity: 1,
//         unit: "łyżka ",
//         name: "tymianku",
//         recipeId: "e43e236e-2033-45ae-8b44-034cdd6bfdf3",
//       },
//       {
//         id: "70fabe43-3941-467e-8ed9-f73520ce2e90",
//         quantity: 1,
//         unit: "sztuka",
//         name: "cebuli",
//         recipeId: "e43e236e-2033-45ae-8b44-034cdd6bfdf3",
//       },
//       {
//         id: "75c762f3-eb5d-4143-a216-f45a5344fc1a",
//         quantity: 2,
//         unit: "łyżki",
//         name: "koncentratu pomidorowego",
//         recipeId: "e43e236e-2033-45ae-8b44-034cdd6bfdf3",
//       },
//       {
//         id: "7d365af8-24b4-4f01-9f07-4978409f318c",
//         quantity: 501,
//         unit: "gram ",
//         name: "fasolki szparagowej",
//         recipeId: "e43e236e-2033-45ae-8b44-034cdd6bfdf3",
//       },
//       {
//         id: "cfd30c55-f8b9-45de-bb6e-0038d7898468",
//         quantity: 2,
//         unit: "łyzki",
//         name: "oliwy",
//         recipeId: "e43e236e-2033-45ae-8b44-034cdd6bfdf3",
//       },
//       {
//         id: "ddfc8133-8fcb-4304-bea4-81c9f9daf0e6",
//         quantity: 250,
//         unit: "gram ",
//         name: "kiełbasy bretońskiej",
//         recipeId: "e43e236e-2033-45ae-8b44-034cdd6bfdf3",
//       },
//       {
//         id: "e2866b4f-81c2-40d6-a944-77fe6dade71b",
//         quantity: 1,
//         unit: "puszka",
//         name: "pomidorów krojonych",
//         recipeId: "e43e236e-2033-45ae-8b44-034cdd6bfdf3",
//       },
//     ],
//     steps: [
//       {
//         id: "1ca55c7a-c4fd-4da9-bfc4-c19c02892061",
//         description:
//           "Dodanie cebuli i czosnku:\n\nDodaj posiekaną cebulę i czosnek do kiełbasy. Smaż, aż cebula stanie się miękka i szklista.",
//         position: 3,
//         image: "",
//         recipeId: "e43e236e-2033-45ae-8b44-034cdd6bfdf3",
//       },
//       {
//         id: "3ae1c390-7486-46df-a471-afd1659eea96",
//         description:
//           "Podanie:\n\nPodawaj fasolkę po bretońsku z kiełbasą na talerzach, najlepiej gorącą.\nPodawaj z kawałkiem świeżej bagietki, aby złapać pyszny sos.",
//         position: 6,
//         image: "",
//         recipeId: "e43e236e-2033-45ae-8b44-034cdd6bfdf3",
//       },
//       {
//         id: "4a518884-06da-4229-8c63-81e0f2fd009c",
//         description:
//           "Gotowanie:\n\nDoprowadź do wrzenia, a następnie zmniejsz ogień. Gotuj na wolnym ogniu pod przykryciem przez około 15-20 minut, aż fasolka będzie miękka, a smaki dobrze się połączą.",
//         position: 5,
//         image: "",
//         recipeId: "e43e236e-2033-45ae-8b44-034cdd6bfdf3",
//       },
//       {
//         id: "8e8883f1-cbd4-492b-8100-96f373689f27",
//         description:
//           "Smażenie kiełbasy:\n\nNa głębokiej patelni rozgrzej oliwę z oliwek.\nSmaż kiełbasę na średnim ogniu, aż zacznie się rumienić.",
//         position: 2,
//         image: "",
//         recipeId: "e43e236e-2033-45ae-8b44-034cdd6bfdf3",
//       },
//       {
//         id: "cab5eb81-33f9-4c3a-a801-6c133c61ed2e",
//         description:
//           "Dodanie fasolki i przypraw:\n\nWrzuć pokrojoną fasolkę do patelni. Mieszaj przez kilka minut.\nDodaj pomidory krojone, koncentrat pomidorowy, tymianek, rozmaryn, sól i pieprz. Całość dokładnie wymieszaj.",
//         position: 4,
//         image: "",
//         recipeId: "e43e236e-2033-45ae-8b44-034cdd6bfdf3",
//       },
//       {
//         id: "e50278be-4b8b-4a35-8421-d2aec705b35f",
//         description:
//           "Przygotowanie składników:\n\nOczyść fasolkę, usuwając końcówki, i pokrój ją na kawałki.\nKiełbasę pokrój na plastry.",
//         position: 1,
//         image: "",
//         recipeId: "e43e236e-2033-45ae-8b44-034cdd6bfdf3",
//       },
//     ],
//   },
//   {
//     id: "e60e2fc4-6b14-49c3-b91e-08654dc88531",
//     name: "Sałatka Szefa",
//     description:
//       "Sałatka Szefa to wykwintne połączenie świeżości warzyw, delikatności sera oraz wyrazistego smaku marynowanych kurczaków. To idealna propozycja dla tych, którzy cenią sobie połączenie zdrowego jedzenia z intensywnymi smakami. Sałatka doskonale sprawdzi się jako lekki obiad lub eleganckie danie na specjalne okazje.",
//     image:
//       "https://firebasestorage.googleapis.com/v0/b/grief-8ecef.appspot.com/o/images%2Frecipe-e60e2fc4-6b14-49c3-b91e-08654dc88531%2Fcover%2Fpexels-karolina-grabowska-4198015.jpg?alt=media&token=bed9de92-824d-4ea1-8442-663a7d0b1b11",
//     difficulty: "EASY",
//     preparationTime: 34,
//     published: true,
//     servings: 1,
//     categoryId: "0dbc07ca-197a-463c-a9c3-8a1d06256eb4",
//     userId: aiProfile.id,
//     createdAt: new Date(),
//     updatedAt: new Date(),
//     cuisines: [
//       {
//         recipeId: "e60e2fc4-6b14-49c3-b91e-08654dc88531",
//         cuisineId: "15243899-a4f0-4afc-88af-438f108d4e81",
//       },
//     ],
//     category: {
//       id: "0dbc07ca-197a-463c-a9c3-8a1d06256eb4",
//       slug: "salatki",
//       name: "Sałatki",
//       image:
//         "https://firebasestorage.googleapis.com/v0/b/grief-8ecef.appspot.com/o/categories%2Fpexels-roman-odintsov-4958950.avif?alt=media&token=e1cfea2e-d8bf-4ac3-bbad-65ce1a385f1c",
//     },
//     ingredients: [
//       {
//         id: "0338f427-d5f7-472b-9395-93e36738d658",
//         quantity: 1,
//         unit: "łyżka",
//         name: "sosu sojowego",
//         recipeId: "e60e2fc4-6b14-49c3-b91e-08654dc88531",
//       },
//       {
//         id: "1443bc9c-1e90-4905-8540-4014c09b0864",
//         quantity: 300,
//         unit: "gram",
//         name: "filetów z kurczaka",
//         recipeId: "e60e2fc4-6b14-49c3-b91e-08654dc88531",
//       },
//       {
//         id: "2206d761-a577-4f3d-9177-0df32473813f",
//         quantity: 1,
//         unit: "",
//         name: "pomidor",
//         recipeId: "e60e2fc4-6b14-49c3-b91e-08654dc88531",
//       },
//       {
//         id: "55fcfa66-13a1-4e89-9092-952c1bdd9aa5",
//         quantity: 1,
//         unit: "ząbek",
//         name: " czosnku",
//         recipeId: "e60e2fc4-6b14-49c3-b91e-08654dc88531",
//       },
//       {
//         id: "920720b7-0cf0-46bc-9d1b-c46e72a99804",
//         quantity: 200,
//         unit: "gram ",
//         name: "mieszanki sałat",
//         recipeId: "e60e2fc4-6b14-49c3-b91e-08654dc88531",
//       },
//       {
//         id: "a184fccd-fd88-4cae-ba20-6c3d19571ed0",
//         quantity: 100,
//         unit: "gram",
//         name: "sera feta",
//         recipeId: "e60e2fc4-6b14-49c3-b91e-08654dc88531",
//       },
//       {
//         id: "b66c91e8-e599-4e4b-8f99-d6ac2243b15c",
//         quantity: 1,
//         unit: "łyżeczka",
//         name: "miodu",
//         recipeId: "e60e2fc4-6b14-49c3-b91e-08654dc88531",
//       },
//       {
//         id: "e6a177e9-b8a5-4806-86f7-29cf1e845efc",
//         quantity: 1,
//         unit: "łyżeczka",
//         name: "oliwy z oliwek",
//         recipeId: "e60e2fc4-6b14-49c3-b91e-08654dc88531",
//       },
//     ],
//     steps: [
//       {
//         id: "031a98c2-a1f4-4a62-b17f-658b7b2ea355",
//         description:
//           "Marynowanie kurczaka:\n\nFilety z kurczaka umyj i osusz.\nW miseczce przygotuj marynatę, mieszając sos sojowy, miód, posiekany czosnek i oliwę z oliwek.\nPokrój kurczaka na kawałki i zanurz w przygotowanej marynacie. Odstaw na minimum 30 minut, aby mięso nabrało aromatu.",
//         position: 1,
//         image:
//           "https://firebasestorage.googleapis.com/v0/b/grief-8ecef.appspot.com/o/images%2Frecipe-e60e2fc4-6b14-49c3-b91e-08654dc88531%2Fsteps%2Fpexels-j%C3%A9shoots-4318.jpg?alt=media&token=aa5cb02f-ea20-489d-bab5-a9a081fe67d4",
//         recipeId: "e60e2fc4-6b14-49c3-b91e-08654dc88531",
//       },
//       {
//         id: "605e2bc5-91c2-484f-bc52-1cb8e0c30443",
//         description:
//           "Przygotowanie sałatki:\n\nW dużej misce połącz mieszankę sałat, pomidora, ogórka, paprykę, ser fetę i czerwoną cebulę.\nDodaj usmażone kawałki kurczaka.",
//         position: 3,
//         image:
//           "https://firebasestorage.googleapis.com/v0/b/grief-8ecef.appspot.com/o/images%2Frecipe-e60e2fc4-6b14-49c3-b91e-08654dc88531%2Fsteps%2Fpexels-los-muertos-crew-7601413.jpg?alt=media&token=22711d83-4065-44e9-a71c-f8577ab846d6",
//         recipeId: "e60e2fc4-6b14-49c3-b91e-08654dc88531",
//       },
//       {
//         id: "8468edbe-6d64-461b-b8e3-952944a6f98d",
//         description:
//           "Smażenie kurczaka:\n\nNa patelni rozgrzej trochę oliwy.\nSmaż kawałki kurczaka na średnim ogniu do złotobrązowego koloru i upewnij się, że są dokładnie ugotowane.",
//         position: 2,
//         image:
//           "https://firebasestorage.googleapis.com/v0/b/grief-8ecef.appspot.com/o/images%2Frecipe-e60e2fc4-6b14-49c3-b91e-08654dc88531%2Fsteps%2Fpexels-rdne-stock-project-4910232.jpg?alt=media&token=2d58a652-55a4-4274-ae9d-97f1800ec76a",
//         recipeId: "e60e2fc4-6b14-49c3-b91e-08654dc88531",
//       },
//       {
//         id: "b8238747-97aa-4f55-86d0-918db4f28896",
//         description:
//           "Podanie:\n\nSałatkę podawaj od razu, aby zachować świeżość składników.",
//         position: 5,
//         image:
//           "https://firebasestorage.googleapis.com/v0/b/grief-8ecef.appspot.com/o/images%2Frecipe-e60e2fc4-6b14-49c3-b91e-08654dc88531%2Fsteps%2Fpexels-cats-coming-406152.jpg?alt=media&token=b318b0ed-f6e3-448c-a8c4-9e85e73215e0",
//         recipeId: "e60e2fc4-6b14-49c3-b91e-08654dc88531",
//       },
//       {
//         id: "f63a09b7-90c6-40bf-a8bf-900b0e3da79d",
//         description:
//           "Dodatki:\n\nPosyp sałatkę pestkami dyni i świeżą bazylią.\nDopraw do smaku solą i pieprzem.",
//         position: 4,
//         image:
//           "https://firebasestorage.googleapis.com/v0/b/grief-8ecef.appspot.com/o/images%2Frecipe-e60e2fc4-6b14-49c3-b91e-08654dc88531%2Fsteps%2Fpexels-anastasia-belousova-3233275.jpg?alt=media&token=0e33d9fc-c5fc-456d-833d-c3a5b197266f",
//         recipeId: "e60e2fc4-6b14-49c3-b91e-08654dc88531",
//       },
//     ],
//   },
// ];
