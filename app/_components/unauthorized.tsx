"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { VisuallyHidden } from "@/app/components/ui/visually-hidden";
import { Role } from "@/utils/types";
import Image from "next/image";
import { Typo } from "./_layout/typography";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "./_layout/button";
import { CopyToClipboard } from "./copyToClipboard";
import { motion } from "framer-motion";
import Link from "next/link";

export interface ITellThemProps {
  uid: string;
  role: Role;
}

const GlitchText = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full text-center">
      <div className="relative inline-block">
        <motion.span
          className="absolute left-0 top-0 text-red-500 opacity-80"
          animate={{
            x: [-1, 1, -1],
            y: [1, -1, 1],
          }}
          transition={{
            duration: 0.2,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        >
          {children}
        </motion.span>
        <motion.span
          className="absolute left-0 top-0 text-cyan-500 opacity-80"
          animate={{
            x: [1, -1, 1],
            y: [-1, 1, -1],
          }}
          transition={{
            duration: 0.2,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        >
          {children}
        </motion.span>
        <span className="relative text-white mix-blend-screen">{children}</span>
      </div>
    </div>
  );
};

const BackgroundDots = () => (
  <div className="absolute inset-0 bg-dot-black/[0.2] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
);

const particles = [
  { id: 1, x: 10, y: 20 },
  { id: 2, x: 20, y: 40 },
  { id: 3, x: 30, y: 60 },
  { id: 4, x: 40, y: 80 },
  { id: 5, x: 50, y: 20 },
  { id: 6, x: 60, y: 40 },
  { id: 7, x: 70, y: 60 },
  { id: 8, x: 80, y: 80 },
  { id: 9, x: 90, y: 20 },
  { id: 10, x: 15, y: 40 },
  { id: 11, x: 25, y: 60 },
  { id: 12, x: 35, y: 80 },
  { id: 13, x: 45, y: 20 },
  { id: 14, x: 55, y: 40 },
  { id: 15, x: 65, y: 60 },
  { id: 16, x: 75, y: 80 },
  { id: 17, x: 85, y: 20 },
  { id: 18, x: 95, y: 40 },
  { id: 19, x: 5, y: 60 },
  { id: 20, x: 45, y: 80 },
];
export const Unconnected = ({ role }: ITellThemProps) => {
  return (
    <AlertDialog defaultOpen>
      <AlertDialogContent className="p-0 border-0 bg-transparent">
        <VisuallyHidden>
          <AlertDialogTitle>Accès non autorisé</AlertDialogTitle>
        </VisuallyHidden>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col min-h-[75svh] justify-center items-center text-center p-8 relative bg-white bg-dot-black/[0.2] overflow-hidden rounded-lg border border-neutral-800"
        >
          <BackgroundDots />

          {/* Particules avec positions prédéfinies */}
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute w-1 h-1 bg-cyan-500"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
              }}
              animate={{
                y: ["0%", "100%"],
                opacity: [1, 0],
              }}
              transition={{
                duration: 2 + (particle.id % 3),
                repeat: Infinity,
                ease: "linear",
                delay: particle.id * 0.1,
              }}
            />
          ))}

          <div className="relative w-full flex justify-center items-center pb-12 my-6">
            <div className="relative">
              <motion.div
                animate={{
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Image
                  src={"/images/surpris.png"}
                  width={250}
                  height={250}
                  alt={"Monstre PopCorn surpris"}
                  className="border-2 rounded-full border-red-500 shadow-lg shadow-red-500/50"
                />
              </motion.div>
              <Image
                src={"/images/huh.png"}
                width={150}
                height={50}
                alt={"bulle bd huh"}
                className="absolute -top-20 -right-20 object-contain animate-pulse"
              />
            </div>
          </div>

          <div className="relative z-10 w-full">
            <GlitchText>
              <Typo
                variant="h4"
                component="p"
                theme="danger"
                className="mb-4 text-4xl font-bold"
              >
                ACCÈS NON AUTORISÉ
              </Typo>
            </GlitchText>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-cyan-400 mb-8"
            >
              <Typo>
                Vous devez{" "}
                <span className="font-bold text-white">vous connecter</span> et
                avoir le rôle{" "}
                <span className="font-bold text-red-500">{role}</span> afin de
                pouvoir accéder à cette page.
              </Typo>
            </motion.div>

            <div className="flex justify-center py-5 gap-5">
              <SignInButton mode="modal">
                <Button
                  variant="primary"
                  className="bg-cyan-500 hover:bg-cyan-600 shadow-lg shadow-cyan-500/50 border border-cyan-400"
                >
                  CONNEXION
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button
                  variant="secondary"
                  className="bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/50 border border-red-400"
                >
                  S'INSCRIRE
                </Button>
              </SignUpButton>
            </div>
          </div>
        </motion.div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export const Unauthorized = ({ uid, role }: ITellThemProps) => {
  return (
    <AlertDialog defaultOpen>
      <AlertDialogContent className="p-0 border-0 bg-transparent">
        <VisuallyHidden>
          <AlertDialogTitle>Accès non autorisé</AlertDialogTitle>
        </VisuallyHidden>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col min-h-[75svh] justify-center items-center text-cente bg-white bg-dot-black/[0.2] p-8 relative overflow-hidden rounded-lg border border-neutral-800"
        >
          <BackgroundDots />
          {/* Particules cyberpunk */}
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute w-1 h-1 bg-cyan-500"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
              }}
              animate={{
                y: ["0%", "100%"],
                opacity: [1, 0],
              }}
              transition={{
                duration: 2 + (particle.id % 3),
                repeat: Infinity,
                ease: "linear",
                delay: particle.id * 0.1,
              }}
            />
          ))}
          <div className="relative w-full flex justify-center items-center pb-12 my-6">
            <div className="relative">
              <motion.div
                animate={{
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Image
                  src={"/images/surpris.png"}
                  width={250}
                  height={250}
                  alt={"Monstre PopCorn surpris"}
                  className="border-2 rounded-full border-red-500 shadow-lg shadow-red-500/50"
                />
              </motion.div>
              <Image
                src={"/images/huh.png"}
                width={150}
                height={50}
                alt={"bulle bd huh"}
                className="absolute -top-20 -right-20 object-contain animate-pulse"
              />
            </div>
          </div>

          <div className="relative z-10">
            <GlitchText>
              <Typo
                variant="h4"
                component="p"
                theme="danger"
                className="mb-4 text-4xl font-bold text-center"
              >
                ACCÈS NON AUTORISÉ
              </Typo>
            </GlitchText>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-cyan-400"
            >
              <Typo variant="body-base" component="p">
                Vous n'avez pas le rôle{" "}
                <span className="font-bold text-red-500">{role}</span> dans nos
                systèmes. 🤷
              </Typo>
              <Typo variant="body-base" component="p" className="mt-6 mb-2">
                Vous pouvez contacter les administrateur en leur fournissant
                votre identifiant :
              </Typo>
            </motion.div>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-4"
            >
              <CopyToClipboard text={uid} />
            </motion.div>
          </div>
          <Link href="/">
            <Button variant="primary" className="mt-10">
              Retour à l'accueil
            </Button>
          </Link>
        </motion.div>
      </AlertDialogContent>
    </AlertDialog>
  );
};
