"use client";

import { Button } from "@/components/ui/button";
import { seed } from "@/db/seed";
import React from "react";

const AdminPage = () => {
  const handleSeed = async () => {
    await seed();
    console.log("Seeded");
  };
  return (
    <div>
      <Button onClick={handleSeed}>Seed</Button>
    </div>
  );
};

export default AdminPage;
