"use client";

import { DragDropContext, DropResult, Droppable } from "@hello-pangea/dnd";
import { PreparationStep } from "@prisma/client";
import React from "react";
import StepCard from "./step-card";
import { preparationStep } from "@/lib/db/schema";
import { reorderSteps } from "@/actions/recipe-creation/steps";
import { toast } from "sonner";

const StepsFeed = ({
  steps,
}: {
  steps: (typeof preparationStep.$inferSelect)[];
}) => {
  const [isPending, startTransition] = React.useTransition();
  const mutateStepReorder = async (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(steps || []);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const startIndex = Math.min(result.source.index, result.destination.index);
    const endIndex = Math.max(result.source.index, result.destination.index);

    const updatedSteps = items.slice(startIndex, endIndex + 1);

    const bulkUpdateData = updatedSteps.map((step) => ({
      id: step.id,
      position: items.findIndex((item) => item.id === step.id),
    }));

    startTransition(async () => {
      await reorderSteps(bulkUpdateData);
    });
  };

  return (
    <DragDropContext onDragEnd={mutateStepReorder}>
      <Droppable droppableId="steps">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="space-y-4"
          >
            {steps.map((step, index) => (
              <StepCard
                index={index}
                step={step}
                key={step.id}
                isReordering={isPending}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default StepsFeed;
