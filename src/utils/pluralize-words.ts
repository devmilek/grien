function pluralizeWord(
  number: number,
  [singular, pluralFew, pluralMany]: string[]
) {
  if (number === 1) {
    return `${singular}`;
  }
  const lastDigit = number % 10;
  const lastTwoDigits = number % 100;
  if (
    lastDigit >= 2 &&
    lastDigit <= 4 &&
    !(lastTwoDigits >= 12 && lastTwoDigits <= 14)
  ) {
    return `${pluralFew}`;
  }
  return `${pluralMany}`;
}

export const pluralizeViews = (views: number) =>
  pluralizeWord(views, ["wyświetlenie", "wyświetlenia", "wyświetleń"]);

export const pluralizeLikes = (likes: number) =>
  pluralizeWord(likes, ["polubienie", "polubienia", "polubień"]);

export const pluralizeComments = (comments: number) =>
  pluralizeWord(comments, ["komentarz", "komentarze", "komentarzy"]);

export const pluralizeRecipes = (recipes: number) =>
  pluralizeWord(recipes, ["przepis", "przepisy", "przepisów"]);

export const pluralizePortions = (portions: number) =>
  pluralizeWord(portions, ["porcja", "porcje", "porcji"]);

export const pluralizeCuisines = (cuisines: number) =>
  pluralizeWord(cuisines, ["kuchnia", "kuchnie", "kuchni"]);

export const pluralizeDiets = (diets: number) =>
  pluralizeWord(diets, ["dieta", "diety", "diet"]);

export const pluralizeOccasions = (occasions: number) =>
  pluralizeWord(occasions, ["okazja", "okazje", "okazji"]);

export const pluralizeFollowers = (followers: number) =>
  pluralizeWord(followers, ["obserwujący", "obserwujący", "obserwujących"]);
