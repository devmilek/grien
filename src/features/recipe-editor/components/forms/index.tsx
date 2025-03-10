"use client";

import React from "react";
import BasicsForm from "./basics-form";
import IngredientsStep from "./ingredients-step";
import StepsStep from "./steps-step";
import AdditionalStep from "./additional-step";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useRecipe } from "../../context/use-recipe-context";

const FormsView = () => {
  const {
    currentStep,
    nextStep,
    previousStep,
    isNew,
    publishRecipe,
    saveAsDraft,
    updateRecipe,
    isPublishing,
    isSaving,
  } = useRecipe();

  const router = useRouter();

  const handlePublish = async () => {
    const result = await publishRecipe();
    if (result.success) {
      toast.success("Sukces", {
        description: "Przepis został opublikowany.",
      });
      router.push(`/przepisy/${result.id}`);
    } else {
      toast.error("Wystąpił błąd", {
        description: result.error,
      });
    }
  };

  const handleSaveAsDraft = async () => {
    const result = await saveAsDraft();
    if (result.success) {
      toast.success("Zapisano", {
        description: "Przepis został zapisany jako wersja robocza.",
      });
      router.push("/moje-przepisy");
    } else {
      toast.error("Wystapił błąd", {
        description: result.error,
      });
    }
  };

  const handleUpdate = async () => {
    const result = await updateRecipe();
    if (result.success) {
      toast.success("Zaktualizowano", {
        description: "Przepis został zaktualizowany.",
      });
    } else {
      toast.error("Wystąpił błąd", {
        description: result.error,
      });
    }
  };

  return (
    <div className="container">
      {currentStep === "basics" && <BasicsForm />}
      {currentStep === "ingredients" && <IngredientsStep />}
      {currentStep === "steps" && <StepsStep />}
      {currentStep === "additional" && <AdditionalStep />}
      {currentStep !== "basics" && (
        <div className="flex justify-between mt-8">
          <Button variant="outline" onClick={previousStep}>
            Wstecz
          </Button>

          {currentStep !== "additional" ? (
            <Button onClick={nextStep}>Dalej</Button>
          ) : (
            <div className="flex gap-4">
              {isNew ? (
                <>
                  <Button onClick={handlePublish} disabled={isPublishing}>
                    {isPublishing ? "Publikowanie..." : "Opublikuj przepis"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleSaveAsDraft}
                    disabled={isSaving}
                  >
                    {isSaving ? "Zapisywanie..." : "Zapisz jako wersję roboczą"}
                  </Button>
                </>
              ) : (
                <Button onClick={handleUpdate} disabled={isSaving}>
                  {isSaving ? "Aktualizowanie..." : "Zapisz zmiany"}
                </Button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FormsView;
