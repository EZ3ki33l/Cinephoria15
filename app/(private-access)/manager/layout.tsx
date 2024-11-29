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
    return <Unconnected uid={userId as string} role="manager" />;
  }

  const isManager = await prisma.manager.findUnique({
    where: {
      id: userId as string,
    },
  });
  if (!isManager) {
    <Unauthorized uid={userId} role="manager" />;
  }

  if (isManager) {
    return (
      <ClerkProvider localization={frFR} dynamic>
        <html lang="fr-FR">
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          >
            <Toaster />
            <Container className="flex flex-col min-h-svh">
              <header>
                <Navbar />
              </header>
              <div className="flex-grow ">
                <div className="mt-44 mb-16 relative">{children}</div>
              </div>
            </Container>
          </body>
        </html>
      </ClerkProvider>
    );
  } 
}
