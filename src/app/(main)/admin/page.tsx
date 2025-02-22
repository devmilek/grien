"use client";

import { Button } from "@/components/ui/button";
import { seedAttributes } from "@/db/seed";
import React from "react";
import { toast } from "sonner";
import { seedRecipes } from "./seed-recipes";

const AdminPage = () => {
  const handleSeedAttributes = async () => {
    await seedAttributes();
    console.log("Seeded");
  };

  const handleSeedRecipes = async () => {
    toast.promise(seedRecipes, {
      loading: "Seeding recipes...",
      success: "Recipes seeded",
      error: "Error seeding recipes",
    });
  };

  return (
    <div className="py-10 mx-auto container flex gap-4">
      <Button onClick={handleSeedAttributes}>Seed attributes</Button>
      <Button onClick={handleSeedRecipes}>Seed Recipes</Button>
    </div>
  );
};

export default AdminPage;
