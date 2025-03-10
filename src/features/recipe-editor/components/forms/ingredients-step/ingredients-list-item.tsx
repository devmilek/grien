import { Button } from "@/components/ui/button";
import { GripVertical, PenIcon, TrashIcon } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import IngredientForm from "./ingredient-form";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { RecipeIngredientSchema } from "@/features/recipe-editor/schema/recipe-ingredient-shema";
import { useRecipe } from "@/features/recipe-editor/context/use-recipe-context";

export function IngredientsListItem(ingredient: RecipeIngredientSchema) {
  const { removeIngredient } = useRecipe();
  const [editing, setEditing] = useState(false);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: ingredient.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (editing) {
    return (
      <IngredientForm
        id={ingredient.id}
        onSubmit={() => setEditing(false)}
        onCancel={() => {
          setEditing(false);
        }}
      />
    );
  }

  const handleDelete = () => {
    if (
      window.confirm(`Czy na pewno chcesz usunąć składnik: ${ingredient.name}?`)
    ) {
      removeIngredient(ingredient.id);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center bg-white rounded-xl py-4 px-6 relative z-40 group",
        {
          "bg-white/40 z-50 border shadow-md backdrop-blur-sm": isDragging,
        }
      )}
    >
      <div className="flex items-center gap-2">
        <span className="font-medium">{ingredient.name}</span>
        {((ingredient.amount && ingredient.amount > 0) || ingredient.unit) && (
          <span className="text-muted-foreground">
            ({ingredient.amount || 0}
            {ingredient.unit ? ` ${ingredient.unit}` : ""})
          </span>
        )}
      </div>
      <div className="ml-auto space-x-2 opacity-70 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDelete}
          aria-label={`Usuń składnik ${ingredient.name}`}
          className="hover:bg-red-100 hover:text-red-600 transition-colors"
        >
          <TrashIcon size={18} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setEditing(true)}
          aria-label={`Edytuj składnik ${ingredient.name}`}
        >
          <PenIcon size={18} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          {...attributes}
          {...listeners}
          aria-label="Przeciągnij, aby zmienić kolejność"
          className="cursor-grab active:cursor-grabbing hover:bg-gray-100"
        >
          <GripVertical size={18} />
        </Button>
      </div>
    </div>
  );
}
