import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { SignOutButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

export const Sidebar = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex justify-center items-center">
        <AvatarUser />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-full p-0">
        <DropdownMenuLabel className="text-center">Menu</DropdownMenuLabel>
        <DropdownMenuSeparator className="my-0" />
        <DropdownMenuItem className="rounded-none">
          <Link href="/dashboard">Mon profil</Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="rounded-none">
          Mes tickets
        </DropdownMenuItem>
        <DropdownMenuSeparator className="my-0" />
        <DropdownMenuItem>
          <div className="text-destructive font-semibold">
            <SignOutButton children="Déconnexion" />
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const AvatarUser = () => {
  const user = useUser();

  return (
    <Avatar className="relative w-8 h-8">
      <AvatarImage src={user.user?.imageUrl} />
      <AvatarFallback>
        <Image
          src="/images/user.png"
          alt="avatar utilisateur"
          fill
          sizes="w-8 h-8"
          className="object-contain object-center"
        />
      </AvatarFallback>
    </Avatar>
  );
};
