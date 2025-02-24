"use client";

import React from "react";
import { IngredientWithId, useRecipeStore } from "../../use-recipe-store";
import { Button } from "@/components/ui/button";
import { GripVertical, PenIcon, TrashIcon } from "lucide-react";
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
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import IngredientForm from "./ingredient-form";

const IngredientsList = () => {
  const { ingredients, setIngredients } = useRecipeStore();
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = ingredients.findIndex((ing) => ing.id === active.id);
      const newIndex = ingredients.findIndex((ing) => ing.id === over?.id);

      setIngredients(arrayMove(ingredients, oldIndex, newIndex));
    }
  }

  return (
    <div>
      {ingredients.length > 0 && (
        <h3 className="text-2xl font-display mb-4 mt-6">Lista składników</h3>
      )}
      <div>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={ingredients.map((item) => item.id)}
            strategy={verticalListSortingStrategy}
          >
            {ingredients.map((ingredient) => (
              <SortableItem key={ingredient.id} {...ingredient} />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
};

export function SortableItem(ingredient: IngredientWithId) {
  const { removeIngredient } = useRecipeStore();
  const [editing, setEditing] = React.useState(false);
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: ingredient.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (editing) {
    return (
      <IngredientForm id={ingredient.id} onSubmit={() => setEditing(false)} />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center bg-white rounded-xl py-4 px-6 mt-2"
    >
      <div className="flex items-center gap-2">
        <span className="font-medium">{ingredient.name}</span>
        {(ingredient.amount > 0 || ingredient.unit) && (
          <span className="text-muted-foreground">
            ({ingredient.amount} {ingredient.unit})
          </span>
        )}
      </div>
      <div className="ml-auto space-x-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => removeIngredient(ingredient.id)}
        >
          <TrashIcon />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => setEditing(true)}>
          <PenIcon />
        </Button>
        <Button variant="ghost" size="icon" {...attributes} {...listeners}>
          <GripVertical />
        </Button>
      </div>
    </div>
  );
}

export default IngredientsList;
