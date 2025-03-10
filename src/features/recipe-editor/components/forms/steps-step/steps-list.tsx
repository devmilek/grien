"use client";

import React from "react";
import Image from "next/image";
import { getR2ImageSrc } from "@/utils";
import { Button } from "@/components/ui/button";
import { GripVertical, PenIcon, TrashIcon } from "lucide-react";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import StepForm from "./step-form";
import { RecipeStepSchema, useRecipe } from "../../../context";
import { cn } from "@/lib/utils";

const StepsList = () => {
  const { setFullRecipe, recipe } = useRecipe();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = recipe.steps.findIndex((step) => step.id === active.id);
      const newIndex = recipe.steps.findIndex((step) => step.id === over?.id);

      const newSteps = arrayMove(recipe.steps, oldIndex, newIndex);
      setFullRecipe({ ...recipe, steps: newSteps });
    }
  }

  return (
    <div className="mt-12">
      {recipe.steps.length > 0 && (
        <h3 className="text-2xl font-display mb-4">Lista kroków</h3>
      )}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={recipe.steps.map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {recipe.steps.map((step, index) => (
              <SortableItem key={step.id} step={step} index={index} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export function SortableItem({
  step,
  index,
}: {
  step: RecipeStepSchema;
  index: number;
}) {
  const { removeStep } = useRecipe();
  const [editing, setEditing] = React.useState(false);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: step.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (editing) {
    return (
      <StepForm
        id={step.id}
        onSubmit={() => setEditing(false)}
        onCancel={() => {
          setEditing(false);
        }}
      />
    );
  }

  return (
    <article
      key={step.id}
      className={cn("gap-4 rounded-xl bg-white p-6 z-10 relative", {
        "bg-white/40 z-50 border shadow-md backdrop-blur-sm": isDragging,
      })}
      ref={setNodeRef}
      style={style}
    >
      <header className="flex justify-between items-center mb-2 w-full">
        <h4 className="font-display text-xl">Krok {index + 1}</h4>
        <div className="flex gap-2">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => {
              setEditing(true);
            }}
          >
            <PenIcon />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => {
              removeStep(step.id);
            }}
          >
            <TrashIcon />
          </Button>
          <Button
            className="cursor-grab active:cursor-grabbing"
            size="icon"
            variant="ghost"
            {...attributes}
            {...listeners}
          >
            <GripVertical />
          </Button>
        </div>
      </header>
      <div className="flex gap-4 items-center">
        <p className="text-muted-foreground text-sm flex-1">
          {step.description}
        </p>
        {step.imageId && (
          <Image
            src={getR2ImageSrc(step.imageId)}
            alt=""
            unoptimized
            width={400}
            height={400}
            className="max-w-52 rounded-lg border"
          />
        )}
      </div>
    </article>
  );
}

export default StepsList;
