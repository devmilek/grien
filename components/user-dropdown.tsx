"use client";

import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Book,
  BookmarkIcon,
  LogOut,
  PencilRulerIcon,
  Plus,
  Settings,
  UserIcon,
} from "lucide-react";
import Link from "next/link";
import { User } from "next-auth";
import { signOut } from "next-auth/react";

interface UserButtonProps {
  profile: User;
}

const UserDropdown = ({ profile }: UserButtonProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="py-2 hover:bg-white px-0">
          <div className="flex items-center space-x-3">
            <Avatar>
              {profile.image && <AvatarImage src={profile.image} />}
              <AvatarFallback className="uppercase">
                {profile.name?.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <p className="text-sm hidden lg:inline-block">{profile.name}</p>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56"
        align="end"
        side="top"
        sideOffset={20}
      >
        <DropdownMenuLabel>Twoje konto</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <UserIcon className="mr-2 w-4 h-4" />
            <span>Profil</span>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/utworz-przepis">
              <Plus className="mr-2 w-4 h-4" />
              <span>Utwórz przepis</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/twoje-przepisy">
              <Book className="mr-2 w-4 h-4" />
              <span>Twoje przepisy</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/zapisane-przepisy">
              <BookmarkIcon className="mr-2 w-4 h-4" />
              <span>Zapisane przepisy</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/edytuj-profil">
              <PencilRulerIcon className="w-4 h-4 mr-2" />
              <span>Edytuj profil</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              signOut();
            }}
          >
            <LogOut className="w-4 h-4 mr-2" />
            <span>Wyloguj się</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
