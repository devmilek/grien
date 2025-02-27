import { parseAsArrayOf, parseAsString, useQueryState } from "nuqs";

export const useInfiniteSearchParams = () => {
  const [categorySlug] = useQueryState("kategoria", parseAsString);
  const [cuisineSlugs] = useQueryState(
    "kuchnie",
    parseAsArrayOf(parseAsString).withDefault([])
  );
  const [occassionSlugs] = useQueryState(
    "okazje",
    parseAsArrayOf(parseAsString).withDefault([])
  );
  const [dietSlugs] = useQueryState(
    "diety",
    parseAsArrayOf(parseAsString).withDefault([])
  );

  return {
    categorySlug,
    cuisineSlugs,
    occassionSlugs,
    dietSlugs,
  };
};
