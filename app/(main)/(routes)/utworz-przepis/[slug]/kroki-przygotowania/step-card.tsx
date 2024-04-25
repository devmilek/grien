"use client";

import Image from "next/image";
import React, { useState } from "react";
import { GripVerticalIcon, Loader2, Trash, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Draggable } from "@hello-pangea/dnd";
import { toast } from "sonner";
import axios from "axios";
import { useParams } from "next/navigation";
import { preparationStep } from "@/lib/db/schema";
import { deleteStep } from "@/actions/recipe-creation/steps";

interface StepCardProps {
  step: typeof preparationStep.$inferSelect;
  index: number;
  isReordering: boolean;
}

const StepCard = ({ step, index, isReordering }: StepCardProps) => {
  const [isDeleting, startTransition] = React.useTransition();

  const onDelete = () => {
    startTransition(async () => {
      await deleteStep(step.id);
    });
  };

  return (
    <Draggable key={step.id} draggableId={step.id.toString()} index={index}>
      {(provided) => (
        <article
          ref={provided.innerRef}
          {...provided.draggableProps}
          className="p-5 bg-white rounded-xl border"
        >
          <div className="flex items-center justify-between mb-3">
            <h1 className="font-display text-2xl">Krok {index + 1}</h1>
            <div className="flex space-x-2">
              <Button
                size="icon"
                variant="ghost"
                {...provided.dragHandleProps}
                disabled={isReordering}
              >
                {isReordering ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <GripVerticalIcon className="h-4 w-4" />
                )}
              </Button>
              <Button
                onClick={onDelete}
                size="icon"
                variant="ghost"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          <div className="flex space-x-4 items-center">
            <div className="aspect-[4/3] flex-shrink-0 object-cover rounded-lg overflow-hidden relative w-64">
              {step.imageUrl ? (
                <Image
                  alt="Step image"
                  src={step.imageUrl}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="bg-neutral-50 rounded-lg border h-full w-full"></div>
              )}
            </div>
            <p>{step.description}</p>
          </div>
        </article>
      )}
    </Draggable>
  );
};

export default StepCard;
