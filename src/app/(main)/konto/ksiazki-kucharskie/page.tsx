import db from "@/db";
import { collections, collectionsRecipes, favouriteRecipes } from "@/db/schema";
import { getCurrentSession } from "@/lib/auth/utils";
import { cn } from "@/lib/utils";
import { getInitials } from "@/utils";
import { constructMetadata } from "@/utils/construct-metadata";
import { pluralizeRecipes } from "@/utils/pluralize-words";
import { countDistinct, eq, getTableColumns, sql } from "drizzle-orm";
import { HeartIcon } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

export const metadata: Metadata = constructMetadata({
  title: "Twoje książki kucharskie",
  noIndex: true,
});

const CollectionsPage = async () => {
  const { user } = await getCurrentSession();

  if (!user) {
    return redirect("/logowanie");
  }

  const data = await db
    .select({
      ...getTableColumns(collections),
      count: countDistinct(collectionsRecipes.recipeId),
      images: sql`COALESCE(
        ARRAY(
            SELECT i.url
            FROM collections_recipes cr2
            JOIN recipes r ON cr2."recipeId" = r.id
            JOIN images i ON r.image_id = i.id
            WHERE cr2."collectionId" = collections.id
            ORDER BY r.created_at DESC
            LIMIT 4
        ),
        '{}'::VARCHAR[]
    )`.as<string[]>("recipe_images"),
    })
    .from(collections)
    .leftJoin(
      collectionsRecipes,
      eq(collections.id, collectionsRecipes.collectionId)
    )
    .groupBy(collections.id);

  const favouriteRecipesCount = await db.$count(
    favouriteRecipes,
    eq(favouriteRecipes.userId, user.id)
  );

  return (
    <div className="container pt-6">
      <h2 className="text-3xl font-display">Książki kucharskie</h2>
      <div className="mt-6 rounded-xl p-6 bg-white grid grid-cols-6 gap-4">
        <Link href="/konto/ksiazki-kucharskie/polubione" className="group">
          <div className="aspect-square w-full rounded-lg bg-emerald-50 text-primary flex justify-center items-center">
            <HeartIcon className="group-hover:scale-110 transition-transform" />
          </div>
          <p className="font-medium mt-2">Polubione przepisy</p>
          <p className="text-sm text-muted-foreground">
            {favouriteRecipesCount} {pluralizeRecipes(favouriteRecipesCount)}
          </p>
        </Link>
        {data.map((collection) => {
          return (
            <Link
              key={collection.id}
              className="group cursor-pointer"
              href={`/konto/ksiazki-kucharskie/${collection.slug}`}
            >
              <div className="aspect-square w-full overflow-hidden rounded-lg text-primary bg-emerald-50 border-emerald-50 border-4">
                <div
                  className={cn(
                    "size-full gap-1 grid hover:scale-110 transition-transform",
                    {
                      "grid-cols-1":
                        collection.images.length === 1 ||
                        collection.images.length === 2,
                      "grid-cols-2": collection.images.length >= 3,
                      "flex justify-center items-center":
                        collection.images.length === 0,
                    }
                  )}
                >
                  {collection.images.length == 0 && (
                    <p className="font-medium">
                      {getInitials(collection.name)}
                    </p>
                  )}
                  {collection.images.map((src, index) => (
                    <div
                      key={src}
                      className={cn("size-full relative", {
                        "col-span-2":
                          collection.images.length === 3 && index === 0,
                      })}
                    >
                      <Image
                        src={src}
                        alt=" "
                        unoptimized
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
              <p className="font-medium mt-2 group-hover:underline">
                {collection.name}
              </p>
              <p className="text-sm text-muted-foreground">
                {collection.count} {pluralizeRecipes(favouriteRecipesCount)}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default CollectionsPage;
