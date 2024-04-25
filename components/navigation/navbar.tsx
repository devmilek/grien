import { ChefHat, SearchIcon, UserIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import NavbarLinks from "./navbar-links";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import UserDropdown from "../user-dropdown";
import { auth } from "@/lib/auth";
import { SignedIn } from "../auth/signed";
import { UtilityData } from "@/types";
import { SITE_NAME } from "@/config";
import NavbarSearch from "./navbar-search";
import MobileMenu from "./mobile-menu";

const Navbar = async ({ categories, attributes }: UtilityData) => {
  const session = await auth();

  return (
    <header className="bg-white border-b fixed inset-x-0 z-50">
      <div className="container flex justify-between items-center h-16">
        <div className="flex space-x-4">
          <Link href="/" className="text-2xl font-display flex items-center">
            <ChefHat className="h-6 w-6 mr-2 text-emerald-600" />
            {SITE_NAME}
          </Link>
          <NavbarLinks
            className="hidden lg:flex"
            categories={categories}
            attributes={attributes}
          />
        </div>
        <div className="flex space-x-2 flex-1 justify-end">
          <NavbarSearch className="hidden lg:flex" />
          {session ? (
            <UserDropdown profile={session.user} />
          ) : (
            <>
              <div className="space-x-2 hidden xl:flex">
                <Button variant="ghost" asChild>
                  <Link href="/sign-in">Zaloguj się</Link>
                </Button>
                <Button asChild>
                  <Link href="/sign-up">Utwórz konto</Link>
                </Button>
              </div>
              <Button size="icon" asChild className="hidden lg:flex xl:hidden">
                <Link href="/sign-in">
                  <UserIcon className="w-4 h-4" />
                  <span className="sr-only">
                    Zaloguj się do konta lub utwórz nowe
                  </span>
                </Link>
              </Button>
            </>
          )}
          <MobileMenu className="lg:hidden" session={session} />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
