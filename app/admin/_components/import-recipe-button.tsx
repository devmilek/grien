"use client";

import { importRecipeJson } from "@/actions/admin/import-recipe-json";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { ingredient } from "@/lib/db/schema";
import React, { useState } from "react";
import { z } from "zod";

interface RecipeJSON {
  name: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  preparationTime: number;
  servings: number;
  category:
    | "salatki"
    | "przetwory"
    | "napoje"
    | "dania-glowne"
    | "desery"
    | "pieczywo"
    | "zupy"
    | "przekaski"
    | "wedliny"
    | "dodatki";
  ingredients: {
    quantity: number;
    unit: string;
    name: string;
  }[];
  preparationSteps: {
    description: string;
    position: number;
  }[];
  attributes:
    | "do-pracy"
    | "boze-narodzenie"
    | "grill"
    | "halloween"
    | "walentynki"
    | "impreza"
    | "tlusty-czwartek"
    | "wielkanoc"
    | "komunia"
    | "zydowska"
    | "tajska"
    | "chinska"
    | "czeska"
    | "wloska"
    | "meksykanska"
    | "ukrainska"
    | "grecka"
    | "francuska"
    | "polska"
    | "wegierska"
    | "indyjska"
    | "balkanska"
    | "azjatycka"
    | "srodziemnomorska"
    | "amerykanska"
    | "bez-glutenu"
    | "dla-dzieci"
    | "bez-laktozy"
    | "dla-zdrowia"
    | "bez-cukru"
    | "wegetarianskie"
    | "weganskie"
    | "dietetyczne"
    | "ketogeniczne";
}

export const RecipeJSONSchema = z.object({
  name: z.string(),
  description: z.string(),
  difficulty: z.enum(["easy", "medium", "hard"]),
  preparationTime: z.number(),
  servings: z.number(),
  category: z.enum([
    "salatki",
    "przetwory",
    "napoje",
    "dania-glowne",
    "desery",
    "pieczywo",
    "zupy",
    "przekaski",
    "wedliny",
    "dodatki",
  ]),
  ingredients: z
    .object({
      quantity: z.number(),
      unit: z.string(),
      name: z.string(),
    })
    .array(),
  preparationSteps: z
    .object({
      description: z.string(),
    })
    .array(),
  attributes: z
    .enum([
      "do-pracy",
      "boze-narodzenie",
      "grill",
      "halloween",
      "walentynki",
      "impreza",
      "tlusty-czwartek",
      "wielkanoc",
      "komunia",
      "zydowska",
      "tajska",
      "chinska",
      "czeska",
      "wloska",
      "meksykanska",
      "ukrainska",
      "grecka",
      "francuska",
      "polska",
      "wegierska",
      "indyjska",
      "balkanska",
      "azjatycka",
      "srodziemnomorska",
      "amerykanska",
      "bez-glutenu",
      "dla-dzieci",
      "bez-laktozy",
      "dla-zdrowia",
      "bez-cukru",
      "wegetarianskie",
      "weganskie",
      "dietetyczne",
      "ketogeniczne",
    ])
    .array(),
});

const ImportRecipeButton = () => {
  const [json, setJson] = useState("");
  const onSubmit = async () => {
    // Validate JSON
    const parsedJson = JSON.parse(json);
    const validated = RecipeJSONSchema.parse(parsedJson);

    console.log(validated);

    await importRecipeJson(validated);

    console.log("Recipe imported");
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Import recipe</Button>
      </DialogTrigger>
      <DialogContent>
        <Textarea
          rows={12}
          value={json}
          onChange={(e) => setJson(e.target.value)}
        />
        <div>
          <Button onClick={onSubmit}>Zapisz</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImportRecipeButton;
