import { prisma } from "@/db/db";
import { auth } from "@clerk/nextjs/server";
import { Unauthorized, Unconnected } from "@/app/_components/unauthorized";
import { ClerkProvider } from "@clerk/nextjs";
import { frFR } from "@clerk/localizations";
import { Toaster } from "sonner";
import { Container } from "@/app/_components/_layout/container";
import localFont from "next/font/local";
import "../../globals.css";
import { Navbar } from "./_components/navBar";

const geistSans = localFont({
  src: "../../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  if (!userId) {
    return <Unconnected uid={userId as string} role="administrateur" />;
  }

  const isAdmin = await prisma.admin.findUnique({
    where: {
      id: userId as string,
    },
  });
  if (!isAdmin) {
    <Unauthorized uid={userId} role="administrateur" />;
  }

  if (isAdmin) {
    return (
      <ClerkProvider localization={frFR} dynamic>
        <html lang="fr-FR">
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          >
            <Toaster />
            <Container className="flex flex-col min-h-svh">
              <div className="w-full dark:bg-black bg-white  dark:bg-dot-white/[0.2] bg-dot-black/[0.2] relative flex items-center justify-center">
                <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
                <header>
                  <Navbar />
                </header>
                <div className="flex-grow ">
                  <div className="mt-44 mb-16 relative">{children}</div>
                </div>
              </div>
            </Container>
          </body>
        </html>
      </ClerkProvider>
    );
  } // Renvoyer les enfants sans le layout si l'utilisateur est un administrateur
}
