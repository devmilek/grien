import { BellIcon, ChefHat, HeartIcon, MenuIcon } from "lucide-react";
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
        <NavItems className="mr-auto hidden lg:flex" categories={categories} />
        <Button variant="outline" size="icon" className="lg:hidden ml-auto">
          <MenuIcon />
        </Button>
        <div className="gap-2 hidden lg:flex">
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
                <Link href="/logowanie">Zaloguj się</Link>
              </Button>
              <Button variant="default" asChild>
                <Link href="/rejestracja">Zarejestruj się</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
