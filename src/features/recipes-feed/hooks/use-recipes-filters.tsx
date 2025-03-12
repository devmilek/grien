import { difficulties } from "@/db/schema";
import {
  parseAsArrayOf,
  parseAsString,
  parseAsStringLiteral,
  useQueryState,
} from "nuqs";

const localDifficulties = ["none", ...difficulties] as const;

export type RecipesFilters = {
  categorySlug: string;
  cuisineSlugs: string[];
  occassionSlugs: string[];
  dietSlugs: string[];
  query: string | null;
  difficulty: (typeof localDifficulties)[number] | null;
};

export type RecipesFilterSetters = {
  setCategorySlug: (value: string | null) => void;
  setCuisineSlugs: (value: string[]) => void;
  setOccassionSlugs: (value: string[]) => void;
  setDietSlugs: (value: string[]) => void;
  setQuery: (value: string | null) => void;
  setDifficulty: (value: (typeof localDifficulties)[number] | null) => void;
};

export const useRecipesFilters = (): RecipesFilters & RecipesFilterSetters => {
  const [query, setQuery] = useQueryState("szukaj", parseAsString);
  const [categorySlug, setCategorySlug] = useQueryState(
    "kategoria",
    parseAsString.withDefault("")
  );
  const [cuisineSlugs, setCuisineSlugs] = useQueryState(
    "kuchnie",
    parseAsArrayOf(parseAsString).withDefault([])
  );
  const [occassionSlugs, setOccassionSlugs] = useQueryState(
    "okazje",
    parseAsArrayOf(parseAsString).withDefault([])
  );
  const [dietSlugs, setDietSlugs] = useQueryState(
    "diety",
    parseAsArrayOf(parseAsString).withDefault([])
  );
  const [difficulty, setDifficulty] = useQueryState(
    "trudnosc",
    parseAsStringLiteral(localDifficulties).withDefault("none").withOptions({
      clearOnDefault: true,
    })
  );

  return {
    // Filter values
    categorySlug,
    cuisineSlugs,
    occassionSlugs,
    dietSlugs,
    query,
    difficulty,
    // Filter setters
    setCategorySlug,
    setCuisineSlugs,
    setOccassionSlugs,
    setDietSlugs,
    setQuery,
    setDifficulty,
  };
};
