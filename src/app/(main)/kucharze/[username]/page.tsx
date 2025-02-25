import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import db from "@/db";
import { recipes as dbRecipes, follows, users } from "@/db/schema";
import { getCurrentSession } from "@/lib/auth/utils";
import { eq } from "drizzle-orm";
import Image from "next/image";
import { notFound } from "next/navigation";
import React from "react";
import RecipesFeed from "./recipes-feed";
import { Metadata } from "next";
import { constructMetadata } from "@/utils/construct-metadata";
import { getInitials } from "@/utils";

interface ProfilePageProps {
  params: Promise<{
    username: string;
  }>;
}

export async function generateMetadata({
  params,
}: ProfilePageProps): Promise<Metadata> {
  const username = (await params).username;
  const user = await db.query.users.findFirst({
    where: eq(users.username, username),
  });

  if (!user) {
    return {};
  }

  return constructMetadata({
    title: "Kucharz " + user.name,
    url: `/kucharze/${user.username}`,
  });
}

const ProfilePage = async ({ params }: ProfilePageProps) => {
  const { user: currentUser } = await getCurrentSession();
  const username = (await params).username;

  const user = await db.query.users.findFirst({
    where: eq(users.username, username),
  });

  if (!user) {
    return notFound();
  }

  const recipesCount = await db.$count(
    dbRecipes,
    eq(dbRecipes.userId, user.id)
  );

  const followersCount = await db.$count(
    follows,
    eq(follows.followingId, user.id)
  );

  return (
    <div className="container">
      <header className="bg-white pb-6 rounded-xl mb-6">
        <div className="w-full h-60">
          <div className="relative size-full rounded-xl overflow-hidden">
            <div className="size-full bg-black/30 z-10 absolute left-0 top-0" />
            <Image
              src="/food2.jpg"
              fill
              alt=""
              objectFit="cover"
              className=""
            />
          </div>
        </div>
        <div className="px-8 -mt-8 flex items-end gap-6">
          <Avatar className="size-32 border-[6px] border-background bg-background z-20">
            {user.image && <AvatarImage src={user.image} />}
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>
          <div className="pb-4 flex justify-between flex-1">
            <div className="">
              <h1 className="font-display text-3xl">{user.name}</h1>
              <p className="text-muted-foreground">@{user.username}</p>
            </div>
            <div className="flex gap-8 items-center">
              <p className="font-bold">
                {recipesCount}
                <span className="text-muted-foreground text-sm font-normal ml-2">
                  Przepisów
                </span>
              </p>
              <p className="font-bold">
                {followersCount}
                <span className="text-muted-foreground text-sm font-normal ml-2">
                  Obserwujących
                </span>
              </p>
              {currentUser?.id === user.id ? (
                <Button variant="outline">Edytuj profil</Button>
              ) : (
                <Button>Zaobserwuj</Button>
              )}
            </div>
          </div>
        </div>
      </header>
      <RecipesFeed userId={user.id} />
    </div>
  );
};

export default ProfilePage;
