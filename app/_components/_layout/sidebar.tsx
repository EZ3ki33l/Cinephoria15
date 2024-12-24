"use client";

import { getUserProfile } from "@/app/dashboard/_components/actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SignOutButton, useAuth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

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
        <Link href="/dashboard/tickets">Mes tickets</Link>
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
  const { userId } = useAuth();
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const userProfile = await getUserProfile(userId as string);
      setUserData(userProfile);
    };
    fetchData();
  }, []);

  return (
    <Avatar className="relative w-8 h-8">
      <AvatarImage src={userData?.imageUrl} />
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
