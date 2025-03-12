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

const UserProfileHeaderSection = async () => {
  const { session } = await getCurrentSession();

  if (!session) {
    return redirect("/logowanie");
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, session.userId),
  });

  if (!user) {
    return redirect("/logowanie");
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
    <header className="bg-white pb-6 rounded-xl mb-6">
      <div className="w-full h-60">
        <div className="relative size-full rounded-xl overflow-hidden">
          <div className="size-full bg-black/30 z-10 absolute left-0 top-0" />
          <Image src="/food2.jpg" fill alt="" objectFit="cover" className="" />
        </div>
      </div>
      <div className="px-8 -mt-8 flex items-end gap-6">
        <Avatar className="size-32 border-[6px] border-background bg-background z-20">
          {user?.image && <AvatarImage src={user.image} />}
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

            <Button variant="outline" asChild>
              <Link href="/konto/ustawienia">Edytuj profil</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default UserProfileHeaderSection;
