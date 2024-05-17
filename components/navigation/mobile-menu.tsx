"use client";

import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Button } from "../ui/button";
import { MenuIcon, UserIcon } from "lucide-react";
import UserDropdown from "../user-dropdown";
import Link from "next/link";
import NavbarSearch from "./navbar-search";
import MobileMenuAccordion from "./mobile-menu-accordion";
import { Session } from "next-auth";

const MobileMenu = ({
  className,
  session,
}: {
  className?: string;
  session: Session | null;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <Sheet
      open={open}
      onOpenChange={() => {
        setOpen(!open);
      }}
    >
      <SheetTrigger asChild>
        <Button size="icon" className={className}>
          <MenuIcon className="h-4 w-4" />
          <span className="sr-only">Otwórz menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full flex-col flex gap-0">
        <SheetHeader className="text-start mb-6">
          <SheetTitle className="font-display text-2xl">Nawigacja</SheetTitle>
        </SheetHeader>
        <NavbarSearch
          className="w-full"
          onSearch={() => {
            setOpen(false);
          }}
        />
        {!session && (
          <div className="space-x-2 xl:flex grid grid-cols-2 mt-4">
            <Button variant="outline" asChild>
              <Link href="/sign-in">Zaloguj się</Link>
            </Button>
            <Button asChild>
              <Link href="/sign-up">Utwórz konto</Link>
            </Button>
          </div>
        )}
        <MobileMenuAccordion setOpen={setOpen} />
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
