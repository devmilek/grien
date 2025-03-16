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
      <div className="container mx-auto h-full flex items-center">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-emerald-600 font-display"
        >
          <ChefHat />
          <span className="text-2xl text-foreground">grien</span>
        </Link>

        {/* nav items - desktop */}
        <NavItems className="mx-4 hidden lg:flex mr-auto" />

        {/* search n auth - desktop */}
        <div className="hidden lg:flex items-center gap-3">
          <NavbarSearch>
            <div className="relative w-[200px]">
              <Input className="peer ps-9" placeholder="Wyszukaj..." />
              <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                <SearchIcon size={16} aria-hidden="true" />
              </div>
            </div>
          </NavbarSearch>

          {user ? (
            <>
              <Button variant="ghost" size="icon" asChild className="shrink-0">
                <Link
                  href="/konto/ksiazki-kucharskie"
                  aria-label="Książki kucharskie"
                >
                  <BookmarkIcon />
                </Link>
              </Button>
              <UserButton user={user} />
            </>
          ) : (
            <>
              <Button variant="outline" asChild size="sm">
                <Link href="/logowanie">Zaloguj się</Link>
              </Button>
              <Button variant="default" asChild size="sm">
                <Link href="/rejestracja">Zarejestruj się</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Navigation */}
        <div className="flex items-center gap-4 lg:hidden ml-auto">
          {user ? (
            <UserButton user={user} />
          ) : (
            <Button variant="outline" size="icon" asChild>
              <Link href="/logowanie" aria-label="Zaloguj się">
                <UserIcon />
              </Link>
            </Button>
          )}
          <MobileNav />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
