"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth/auth-client";
import { User } from "better-auth";
import {
  Loader2Icon,
  LogOutIcon,
  PlusIcon,
  Settings,
  User2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useTransition } from "react";

const UserButton = ({
  user,
}: {
  user: User & {
    username?: string | null;
  };
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSignOut = async () => {
    startTransition(async () => {
      await authClient.signOut();
      router.refresh();
      router.push("/logowanie");
    });
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center gap-2 cursor-pointer">
          <Avatar>
            {user.image && <AvatarImage src={user.image} />}
            <AvatarFallback>{user.name[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <p className="text-sm font-medium">{user.name.split(" ")[0]}</p>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-56">
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="h-8 w-8 rounded-lg">
              {user.image && <AvatarImage src={user.image} />}
              <AvatarFallback className="rounded-lg">CN</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{user.name}</span>
              <span className="truncate text-xs">@{user.username}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={`/konto`}>
            <User2 />
            Profil
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/przepisy/utworz">
            <PlusIcon />
            Utwórz przepis
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/konto/ustawienia">
            <Settings />
            Ustawienia
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} disabled={isPending}>
          {isPending ? (
            <Loader2Icon className="animate-spin" />
          ) : (
            <LogOutIcon />
          )}
          Wyloguj się
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserButton;
