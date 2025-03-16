import { BookmarkIcon, ChefHat, SearchIcon, UserIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import NavItems from "./nav-items";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import UserButton from "./user-button";
import { getCurrentSession } from "@/lib/auth/utils";
import NavbarSearch from "./navbar-search";
import MobileNav from "./mobile-nav";

const Navbar = async () => {
  const { user } = await getCurrentSession();

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
        <NavItems className="mr-auto hidden lg:flex" />
        <div className="flex gap-4 flex-row-reverse w-full items-center ml-auto">
          <div className="lg:hidden">
            {user ? (
              <UserButton user={user} />
            ) : (
              <Button variant="outline" size="icon">
                <Link href="/logowanie">
                  <span className="sr-only">Zaloguj się</span>
                  <UserIcon />
                </Link>
              </Button>
            )}
          </div>
          <MobileNav />
        </div>
        <div className="gap-2 hidden lg:flex">
          <NavbarSearch>
            <div className="relative w-[140px]">
              <Input className="peer ps-9" placeholder="Wyszukaj..." />
              <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                <SearchIcon size={16} aria-hidden="true" />
              </div>
            </div>
          </NavbarSearch>
          {user ? (
            <>
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
