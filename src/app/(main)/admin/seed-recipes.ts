"use server";

import path from "path";
import fs from "fs";

export const seedRecipes = async () => {
  const jsonDirectory = path.resolve(__dirname, "./data/recipes");

  try {
    // Check if directory exists
    if (!fs.existsSync(jsonDirectory)) {
      throw new Error(`Directory ${jsonDirectory} does not exist`);
    }

    // Read all files in the directory
    const files = fs.readdirSync(jsonDirectory);

    // Filter for .json files and read them
    for (const file of files) {
      if (path.extname(file) === ".json") {
        const filePath = path.join(jsonDirectory, file);
        const fileContent = fs.readFileSync(filePath, "utf-8");
        const jsonData = JSON.parse(fileContent);
        console.log(jsonData);
      }
    }
  } catch (error) {
    console.error("Error reading JSON files:", error);
    throw error;
  }
};
