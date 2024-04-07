import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import EditRecipeForm from "../_components/edit-recipe-form";

interface CreateRecipePageProps {
  params: {
    recipeId: string;
  };
}

const CreateRecipePage = async ({ params }: CreateRecipePageProps) => {
  const session = await auth();

  if (!session) {
    return redirect("/");
  }

  const recipe = await db.recipe.findUnique({
    where: {
      id: params.recipeId,
      userId: session.user.id,
    },
  });

  if (!recipe) {
    return redirect("/");
  }

  const requiredFields = [
    recipe.name,
    recipe.image,
    recipe.description,
    recipe.categoryId,
    recipe.difficulty,
    recipe.preparationTime,
  ];

  const isComplete = requiredFields.every(Boolean);

  return (
    <>
      <EditRecipeForm
        recipeId={recipe.id}
        recipe={recipe}
        isComplete={isComplete}
      />
    </>
  );
};

export default CreateRecipePage;
