import { DragDropContext, DropResult, Droppable } from "@hello-pangea/dnd";
import { PreparationStep } from "@prisma/client";
import React from "react";
import StepCard from "./step-card";

const StepsFeed = ({
  steps,
  onReorder,
}: {
  steps: PreparationStep[];
  onReorder: (result: DropResult) => void;
}) => {
  return (
    <DragDropContext onDragEnd={onReorder}>
      <Droppable droppableId="steps">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="space-y-4"
          >
            {steps.map((step, index) => (
              <StepCard index={index} step={step} key={step.id} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default StepsFeed;
