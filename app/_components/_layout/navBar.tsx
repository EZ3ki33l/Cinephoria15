"use client";

import { SignIn, SignInButton, SignUpButton, useAuth, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "./logo";
import { NavbarLinks } from "./navBarLinks";
import { Sidebar } from "./sidebar";
import { Typo } from "./typography";
import { Button } from "./button";

export const Navbar = () => {
  const user = useAuth();
  const dataUser = useUser();
  const [heure, setHeure] = useState(new Date().getHours());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setHeure(new Date().getHours());
    }, 120000); // Mettre à jour l'heure toutes les minutes
    return () => clearInterval(intervalId);
  }, []);

  const salutation = heure < 18 ? "Bonjour" : "Bonsoir";

  if (!user.isSignedIn) {
    return (
      <div className="flex justify-between items-center mx-0 border-b py-2 bg-transparent backdrop-blur-md h-[8svh]">
        <Link href="/">
          <Logo size="extra-small" />
        </Link>
        <div className="flex justify-between items-center border rounded-full py-2 px-4 gap-4">
          <div>
            <NavbarLinks />
          </div>
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
      <div>
        <Link href="/">
          <Logo size="extra-small" />
        </Link>
      </div>
      <div className="flex justify-between items-center border rounded-full py-2 px-4 gap-4">
        <div>
          <NavbarLinks />
        </div>
        <div className="space-x-2 flex items-center justify-center border px-3 py-2 rounded-full">
          <Typo variant="body-base" component="p" className="hidden md:block">
            {salutation} {dataUser.user?.firstName} !
          </Typo>
          <Sidebar />
        </div>
      </div>
    </div>
  );
};
