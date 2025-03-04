import { BellIcon, BookmarkIcon, ChefHat } from "lucide-react";
import Link from "next/link";
import React from "react";
import NavItems from "./nav-items";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import db from "@/db";
import UserButton from "./user-button";
import { getCurrentSession } from "@/lib/auth/utils";
import NavbarSearch from "./navbar-search";
import MobileNav from "./mobile-nav";

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
        <MobileNav />
        <div className="gap-2 hidden lg:flex">
          <NavbarSearch>
            <Input placeholder="Wyszukaj przepisu..." />
          </NavbarSearch>
          {user ? (
            <>
              <Button variant="ghost" size="icon" className="shrink-0">
                <BellIcon />
              </Button>
              <Button variant="ghost" size="icon" className="shrink-0">
                <Link href="/konto/ksiazki-kucharskie">
                  <BookmarkIcon />
                </Link>
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
