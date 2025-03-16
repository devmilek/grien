import Image from "next/image";
import React from "react";
import db from "@/db";
import { recipes as dbRecipes, follows, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getInitials } from "@/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getCurrentSession } from "@/lib/auth/utils";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { pluralizeFollowers, pluralizeRecipes } from "@/utils/pluralize-words";
import { PenIcon } from "lucide-react";

const UserProfileHeaderSection = async ({ userId }: { userId: string }) => {
  const { session } = await getCurrentSession();

  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  if (!user) {
    return redirect("/");
  }

  const recipesCount = await db.$count(
    dbRecipes,
    eq(dbRecipes.userId, user.id)
  );

  const followersCount = await db.$count(
    follows,
    eq(follows.followingId, user.id)
  );

  const isCurrent = session?.userId === userId;

  return (
    <header className="bg-white pb-6 rounded-xl mb-6">
      <div className="w-full h-40 sm:h-60">
        <div className="relative size-full rounded-xl overflow-hidden">
          <div className="size-full bg-black/30 z-10 absolute left-0 top-0" />
          <Image src="/food2.jpg" fill alt="" objectFit="cover" className="" />
        </div>
      </div>
      <div className="px-4 flex flex-col gap-y-6 sm:flex-row sm:justify-between sm:items-center">
        <div className="flex items-end gap-4">
          <Avatar className="size-28 sm:size-28 md:size-32 border-[6px] border-background bg-background z-20 -mt-4 md:-mt-8">
            {user?.image && <AvatarImage src={user.image} />}
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>
          <div className="space-y-1 pb-3">
            <h1 className="font-display text-3xl">{user.name}</h1>
            <p className="text-muted-foreground text-sm">@{user.username}</p>
          </div>
        </div>
        <div className="">
          <div className="grid grid-cols-2 md:flex gap-4 items-center">
            <p className="font-bold">
              {recipesCount}
              <span className="text-muted-foreground text-sm font-normal ml-2">
                {pluralizeRecipes(recipesCount)}
              </span>
            </p>
            <p className="font-bold">
              {followersCount}
              <span className="text-muted-foreground text-sm font-normal ml-2">
                {pluralizeFollowers(followersCount)}
              </span>
            </p>
            <div className="hidden md:flex">
              {isCurrent ? (
                <Button variant="outline" asChild size="icon">
                  <Link href="/konto/ustawienia">
                    <PenIcon />
                  </Link>
                </Button>
              ) : (
                <Button size="sm">Obserwuj</Button>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="px-4 mt-6 md:hidden">
        {isCurrent ? (
          <Button variant="outline" asChild className="w-full">
            <Link href="/konto/ustawienia">
              <PenIcon />
              Edytuj profil
            </Link>
          </Button>
        ) : (
          <Button className="w-full" size="sm">
            Obserwuj
          </Button>
        )}
      </div>
    </header>
  );
};

export default UserProfileHeaderSection;
