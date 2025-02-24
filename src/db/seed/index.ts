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
  { name: "Śniadania" },
  { name: "Zupy" },
  { name: "Dania główne" },
  { name: "Desery" },
  { name: "Napoje" },
  { name: "Przekąski" },
  { name: "Sałatki" },
  { name: "Przetwory" },
  { name: "Dodatki" },
  { name: "Pieczywo" },
  { name: "Wędliny" },
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
