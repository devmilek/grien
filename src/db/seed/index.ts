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
  { name: "Wielkanoc" },
  { name: "Boże Narodzenie" },
  { name: "Impreza" },
  { name: "Grill" },
  { name: "Tłusty czwartek" },
  { name: "Walentynki" },
  { name: "Halloween" },
  { name: "Komunia" },
  { name: "Do pracy" },
];

const cuisinesData = [
  { name: "Amerykańska" },
  { name: "Czeska" },
  { name: "Włoska" },
  { name: "Indyjska" },
  { name: "Chińska" },
  { name: "Bałkańska" },
  { name: "Węgierska" },
  { name: "Ukraińska" },
  { name: "Azjatycka" },
  { name: "Polska" },
  { name: "Meksykańska" },
  { name: "Francuska" },
  { name: "Grecka" },
  { name: "Tajska" },
  { name: "Śródziemnomorska" },
  { name: "Żydowska" },
];

const dietsData = [
  { name: "Bez glutenu" },
  { name: "Bez laktozy" },
  { name: "Bez cukru" },
  { name: "Dla dzieci" },
  { name: "Dietetyczne" },
  { name: "Wegetariańskie" },
  { name: "Wegańskie" },
  { name: "Dla zdrowia" },
  { name: "Keto" },
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
  }));

  const cuisinesBatch: AttributeInsert[] = cuisinesData.map((cuisine) => ({
    name: cuisine.name,
    slug: slugify(cuisine.name),
    type: "cuisines",
  }));

  const dietsBatch: AttributeInsert[] = dietsData.map((diet) => ({
    name: diet.name,
    slug: slugify(diet.name),
    type: "diets",
  }));

  await db.insert(categories).values(categoriesBatch);
  await db
    .insert(attributes)
    .values([...occasionsBatch, ...cuisinesBatch, ...dietsBatch]);
}
