import RecipeEditor from "@/features/recipe-editor/components/recipe-editor";
import { getCurrentSession } from "@/lib/auth/utils";
import { constructMetadata } from "@/utils/construct-metadata";
import { redirect } from "next/navigation";
import React from "react";

export const metadata = constructMetadata({
  title: "Utwórz przepis",
  noIndex: true,
});

const CreateRecipePage = async () => {
  const { user } = await getCurrentSession();

  if (!user) {
    redirect("/logowanie");
  }
  return <RecipeEditor />;
};

export default CreateRecipePage;
