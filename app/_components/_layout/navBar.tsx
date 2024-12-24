"use client";

import {
  SignIn,
  SignInButton,
  SignUpButton,
  useAuth,
  useUser,
} from "@clerk/nextjs";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "./logo";
import { NavbarLinks } from "./navBarLinks";
import { Sidebar } from "./sidebar";
import { Typo } from "./typography";
import { Button } from "./button";
import { getUserProfile } from "@/app/dashboard/_components/actions";

export const Navbar = () => {
  const { isSignedIn, userId } = useAuth();
  const [userData, setUserData] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (isSignedIn && userId) {
        const userProfile = await getUserProfile(userId);
        setUserData(userProfile);
      }
    };
    fetchData();
  }, [isSignedIn, userId]);

  const [heure, setHeure] = useState<number | null>(null);

  useEffect(() => {
    setHeure(new Date().getHours());
    const intervalId = setInterval(() => {
      setHeure(new Date().getHours());
    }, 120000);
    return () => clearInterval(intervalId);
  }, []);

  if (!mounted) {
    return null; // ou un loader
  }

  const salutation = heure && heure < 18 ? "Bonjour" : "Bonsoir";

  if (!isSignedIn) {
    return (
      <div className="flex justify-between items-center mx-0 border-b py-2 bg-transparent backdrop-blur-md h-[8svh]">
        <Link href="/">
          <Logo size="extra-small" />
        </Link>
        <div className="flex justify-between items-center border rounded-full py-2 px-4 gap-4">
          <NavbarLinks />
          <div className="space-x-2">
            <SignInButton mode="modal">
              <Button>Connexion</Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button variant="secondary">S'inscrire</Button>
            </SignUpButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-between items-center px-10 border-b py-5 my-auto bg-transparent backdrop-blur-md h-[10svh]">
      <Link href="/">
        <Logo size="extra-small" />
      </Link>
      <div className="flex justify-between items-center border rounded-full py-2 px-4 gap-4">
        <NavbarLinks />
        <div className="space-x-2 flex items-center justify-center border px-3 py-2 rounded-full">
          <Typo variant="body-base" component="p" className="hidden md:block">
            {salutation} {userData?.userName || userData?.firstName} !
          </Typo>
          <Sidebar />
        </div>
      </div>
    </div>
  );
};
