"use server";
import slugify from "@sindresorhus/slugify";
import db from "..";
import {
  AttributeInsert,
  attributes,
  categories,
  CategoryInsert,
} from "../schema";

const categoriesData = [
  {
    name: "Śniadania",
    description:
      "Pyszne i pożywne propozycje na dobry początek dnia, od owsianki po jajecznicę.",
  },
  {
    name: "Zupy",
    description:
      "Rozgrzewające i aromatyczne zupy, idealne na każdą porę roku.",
  },
  {
    name: "Dania główne",
    description:
      "Syte i smaczne potrawy, które sprawdzą się na rodzinny obiad lub kolację.",
  },
  {
    name: "Desery",
    description:
      "Słodkie przyjemności, od domowych ciast po lekkie musy i lody.",
  },
  {
    name: "Napoje",
    description:
      "Orzeźwiające i rozgrzewające napoje, zarówno bezalkoholowe, jak i koktajle.",
  },
  {
    name: "Przekąski",
    description: "Szybkie i smaczne propozycje na mały głód w ciągu dnia.",
  },
  {
    name: "Sałatki",
    description:
      "Świeże i lekkie kompozycje warzywne, mięsne i z dodatkiem serów.",
  },
  {
    name: "Przetwory",
    description: "Domowe konfitury, kiszonki i inne zapasy na zimowe miesiące.",
  },
  {
    name: "Dodatki",
    description: "Sosy, dipy i inne smakołyki, które wzbogacą smak Twoich dań.",
  },
  {
    name: "Pieczywo",
    description: "Chrupiące domowe chleby, bułki i inne wypieki.",
  },
  {
    name: "Wędliny",
    description: "Tradycyjne domowe wędliny, pasztety i inne mięsne specjały.",
  },
];

const occasionsData = [
  {
    name: "Wielkanoc",
    description:
      "Tradycyjne świąteczne potrawy, od żurku i białej kiełbasy po mazurki i babki.",
  },
  {
    name: "Boże Narodzenie",
    description:
      "Wigilijne specjały i świąteczne przysmaki, w tym pierogi, karp i piernik.",
  },
  {
    name: "Impreza",
    description:
      "Przekąski i dania idealne na każdą domówkę, od finger food po wykwintne tapas.",
  },
  {
    name: "Grill",
    description:
      "Soczyste mięsa, chrupiące warzywa i aromatyczne marynaty na letnie spotkania przy grillu.",
  },
  {
    name: "Tłusty czwartek",
    description:
      "Słodkie wypieki na ostatni dzień karnawału, od pączków po chrupiące faworki.",
  },
  {
    name: "Walentynki",
    description:
      "Romantyczne kolacje i słodkie desery, które zachwycą ukochaną osobę.",
  },
  {
    name: "Halloween",
    description:
      "Strasznie smaczne przekąski i desery inspirowane duchem Halloween.",
  },
  {
    name: "Komunia",
    description:
      "Eleganckie dania i klasyczne wypieki na uroczyste przyjęcie komunijne.",
  },
  {
    name: "Do pracy",
    description:
      "Szybkie i pożywne posiłki, które łatwo zabrać w lunchboxie do pracy.",
  },
];

const cuisinesData = [
  {
    name: "Amerykańska",
    description:
      "Klasyczne burgery, soczyste steki i kultowe desery jak brownies czy pancakes.",
  },
  {
    name: "Czeska",
    description:
      "Syte i aromatyczne potrawy, takie jak knedle, smażony ser i gulasz.",
  },
  {
    name: "Włoska",
    description:
      "Pyszne makarony, chrupiąca pizza i klasyczne tiramisu rodem z Włoch.",
  },
  {
    name: "Indyjska",
    description:
      "Bogate w przyprawy curry, aromatyczny ryż i tradycyjne chlebki naan.",
  },
  {
    name: "Chińska",
    description:
      "Egzotyczne smaki Orientu – smażony ryż, pierożki dim sum i kurczak słodko-kwaśny.",
  },
  {
    name: "Bałkańska",
    description:
      "Mięsne specjały, takie jak ćevapi i pljeskavica, oraz świeże sałatki i sery.",
  },
  {
    name: "Węgierska",
    description:
      "Rozgrzewające gulasze, pikantne leczo i klasyczna zupa rybna halászlé.",
  },
  {
    name: "Ukraińska",
    description:
      "Babka ziemniaczana, barszcz ukraiński i pierogi zwane warenikami.",
  },
  {
    name: "Azjatycka",
    description:
      "Kuchnia pełna kontrastów – od sushi po ostre kimchi i aromatyczne zupy pho.",
  },
  {
    name: "Polska",
    description: "Tradycyjne smaki – pierogi, bigos, żurek i domowe wypieki.",
  },
  {
    name: "Meksykańska",
    description: "Pikantne tacos, soczyste burrito i słynne guacamole.",
  },
  {
    name: "Francuska",
    description:
      "Wykwintne sery, aromatyczne bagietki i delikatne creme brûlée.",
  },
  {
    name: "Grecka",
    description:
      "Śródziemnomorskie smaki, od sałatki greckiej po musakę i souvlaki.",
  },
  {
    name: "Tajska",
    description: "Egzotyczne curry, pikantne zupy i świeże spring rollsy.",
  },
  {
    name: "Śródziemnomorska",
    description: "Zdrowa i lekka kuchnia pełna oliwek, ryb i świeżych warzyw.",
  },
  {
    name: "Żydowska",
    description: "Tradycyjne dania, takie jak chałka, gefilte fish i maczanka.",
  },
];

const dietsData = [
  {
    name: "Bez glutenu",
    description:
      "Przepisy bez produktów zawierających gluten, idealne dla osób z celiakią i nietolerancją glutenu.",
  },
  {
    name: "Bez laktozy",
    description:
      "Dania przygotowane bez mleka i jego przetworów, odpowiednie dla osób z nietolerancją laktozy.",
  },
  {
    name: "Bez cukru",
    description:
      "Zdrowe alternatywy dla tradycyjnych potraw, bez dodatku cukru i sztucznych słodzików.",
  },
  {
    name: "Dla dzieci",
    description:
      "Smaczne i zdrowe przepisy, które zachwycą najmłodszych i dostarczą im niezbędnych składników odżywczych.",
  },
  {
    name: "Dietetyczne",
    description:
      "Lekkie i niskokaloryczne posiłki wspomagające zdrową dietę i utrzymanie sylwetki.",
  },
  {
    name: "Wegetariańskie",
    description:
      "Dania bez mięsa, bazujące na warzywach, roślinach strączkowych i produktach roślinnych.",
  },
  {
    name: "Wegańskie",
    description:
      "100% roślinne potrawy, bez mięsa, nabiału i innych produktów pochodzenia zwierzęcego.",
  },
  {
    name: "Dla zdrowia",
    description:
      "Odżywcze i pełnowartościowe posiłki wspierające dobre samopoczucie i zdrowy tryb życia.",
  },
  {
    name: "Keto",
    description:
      "Przepisy bogate w tłuszcze i białko, o niskiej zawartości węglowodanów, idealne na diecie ketogenicznej.",
  },
];

export async function seedAttributes() {
  const categoriesBatch: CategoryInsert[] = categoriesData.map((category) => ({
    name: category.name,
    slug: slugify(category.name),
    description: category.description,
  }));

  const occasionsBatch: AttributeInsert[] = occasionsData.map((occasion) => ({
    name: occasion.name,
    slug: slugify(occasion.name),
    type: "occasions",
    description: occasion.description,
  }));

  const cuisinesBatch: AttributeInsert[] = cuisinesData.map((cuisine) => ({
    name: cuisine.name,
    slug: slugify(cuisine.name),
    type: "cuisines",
    description: cuisine.description,
  }));

  const dietsBatch: AttributeInsert[] = dietsData.map((diet) => ({
    name: diet.name,
    slug: slugify(diet.name),
    type: "diets",
    description: diet.description,
  }));

  await db.insert(categories).values(categoriesBatch);
  await db
    .insert(attributes)
    .values([...occasionsBatch, ...cuisinesBatch, ...dietsBatch]);
}
