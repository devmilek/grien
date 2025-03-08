"use client";

import React from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useRecipe } from "../../../context";
import { IngredientsListItem } from "./ingredients-list-item";
import { Button } from "@/components/ui/button";

const IngredientsList = () => {
  const { recipe, setFullRecipe, previousStep, nextStep } = useRecipe();
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = recipe.ingredients.findIndex(
        (ing) => ing.id === active.id
      );
      const newIndex = recipe.ingredients.findIndex(
        (ing) => ing.id === over?.id
      );

      const newIngredients = arrayMove(recipe.ingredients, oldIndex, newIndex);
      setFullRecipe({ ...recipe, ingredients: newIngredients });
    }
  }

  return (
    <div className="mt-10">
      {recipe.ingredients.length > 0 && (
        <h3 className="text-2xl font-display mb-4 mt-6">Lista składników</h3>
      )}
      <div>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={recipe.ingredients.map((item) => item.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {recipe.ingredients.map((ingredient) => (
                <IngredientsListItem key={ingredient.id} {...ingredient} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
      <div className="mt-8 flex justify-between">
        <Button variant="outline" onClick={previousStep}>
          Cofnij
        </Button>
        <Button onClick={nextStep}>Dalej</Button>
      </div>
    </div>
  );
};

export default IngredientsList;
