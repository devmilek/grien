import { BellIcon, ChefHat, HeartIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import NavItems from "./nav-items";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import db from "@/db";
import UserButton from "./user-button";
import { getCurrentSession } from "@/lib/auth/utils";

const Navbar = async () => {
  const { user } = await getCurrentSession();
  const categories = await db.query.categories.findMany();
  const occasions = await db.query.occasions.findMany();
  const cuisines = await db.query.cuisines.findMany();
  const diets = await db.query.diets.findMany();

  return (
    <header className="h-16 border-b fixed left-0 w-full top-0 bg-white z-50">
      <div className="container mx-auto h-full flex items-center gap-8">
        <Link
          href="/"
          className="flex items-center gap-2 text-emerald-600 font-display"
        >
          <ChefHat />
          <span className="text-2xl text-foreground">grien</span>
        </Link>
        <NavItems
          className="mr-auto"
          categories={categories}
          occasions={occasions}
          cuisines={cuisines}
          diets={diets}
        />
        <div className="flex gap-2">
          <Input placeholder="Wyszukaj przepisu..." />
          {user ? (
            <>
              <Button variant="ghost" size="icon" className="shrink-0">
                <BellIcon />
              </Button>
              <Button variant="ghost" size="icon" className="shrink-0">
                <HeartIcon />
              </Button>
              <UserButton user={user} />
            </>
          ) : (
            <>
              <Button variant="outline" asChild>
                <Link href="/sign-in">Zaloguj się</Link>
              </Button>
              <Button variant="default" asChild>
                <Link href="/sign-up">Zarejestruj się</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
