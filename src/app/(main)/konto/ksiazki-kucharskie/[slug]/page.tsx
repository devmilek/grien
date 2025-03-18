import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import db from "@/db";
import { collections, collectionsRecipes } from "@/db/schema";
import RecipesFeed from "@/features/recipes-feed/components/recipes-feed";
import { getCurrentSession } from "@/lib/auth/utils";
import { getInitials } from "@/utils";
import { pluralizeRecipes } from "@/utils/pluralize-words";
import { and, eq } from "drizzle-orm";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import React from "react";

const CollectionDetailsPage = async ({
  params,
}: {
  params: Promise<{
    slug: string;
  }>;
}) => {
  const slug = (await params).slug;
  const { user } = await getCurrentSession();

  if (!user) {
    redirect("/logowanie");
  }

  const collection = await db.query.collections.findFirst({
    where: and(eq(collections.userId, user.id), eq(collections.slug, slug)),
    with: {
      recipes: true,
    },
  });

  if (!collection) {
    notFound();
  }

  const recipesCount = await db.$count(
    collectionsRecipes,
    eq(collectionsRecipes.collectionId, collection.id)
  );

  return (
    <div className="container">
      <header className="bg-white p-6 rounded-2xl mb-6">
        <div className="flex items-center gap-5">
          <div className="aspect-square w-32 bg-emerald-100 rounded-lg items-center justify-center text-primary flex font-medium text-lg">
            <p>{getInitials(collection.name)}</p>
          </div>
          <div>
            <h2 className="text-muted-foreground">
              {collection.public ? "Publiczna kolekcja" : "Prywatna kolekcja"}
            </h2>
            <h1 className="font-display text-2xl">{collection.name}</h1>
            <div className="flex items-center gap-4 text-sm mt-2">
              <Link
                href={"/kucharze/" + user.username}
                className="flex items-center gap-2"
              >
                <Avatar className="size-7">
                  {user.image && (
                    <AvatarImage src={user.image} alt={user.name} />
                  )}
                  <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                </Avatar>
                <p className="text-sm font-medium">{user.name}</p>
              </Link>
              <p>•</p>
              <p className="text-muted-foreground">
                {recipesCount} {pluralizeRecipes(recipesCount)}
              </p>
            </div>
          </div>
        </div>
      </header>
      <RecipesFeed collectionId={collection.id} />
    </div>
  );
};

export default CollectionDetailsPage;
