/**
 * Pobiera pełne dane przepisu
 */
// export async function getRecipe(id: string): Promise<Recipe | null> {
//   try {
//     // Pobierz podstawowe dane przepisu
//     const recipeData = await db.query.recipes.findFirst({
//       where: (recipes, { eq }) => eq(recipes.id, id),
//       with: {
//         ingredients: true,
//         steps: {
//           orderBy: (steps, { asc }) => [asc(steps.orderIndex)],
//         },
//       },
//     });

//     if (!recipeData) {
//       return null;
//     }

//     // Przekształć dane z bazy na format Recipe
//     const recipe: Recipe = {
//       id: recipeData.id,
//       basics: {
//         name: recipeData.name,
//         description: recipeData.description,
//         difficulty: recipeData.difficulty,
//         preparationTime: recipeData.preparationTime,
//         portions: recipeData.portions,
//         imageId: recipeData.imageId || undefined,
//         categoryId: recipeData.categoryId,
//       },
//       ingredients: recipeData.ingredients.map((ingredient) => ({
//         id: ingredient.id,
//         name: ingredient.name,
//         amount: ingredient.amount,
//         unit: ingredient.unit || undefined,
//       })),
//       steps: recipeData.steps.map((step) => ({
//         id: step.id,
//         description: step.description,
//         imageId: step.imageId || undefined,
//       })),
//       attributes: recipeData.attributes,
//       status: recipeData.status,
//     };

//     return recipe;
//   } catch (error) {
//     console.error("Błąd podczas pobierania przepisu:", error);
//     return null;
//   }
// }
