import { prisma } from "@/db/db";
import { auth } from "@clerk/nextjs/server";
import { Unauthorized, Unconnected } from "@/app/_components/unauthorized";
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
    return <Unauthorized uid={userId} role="administrateur" />;
  }

  return (
    <div className={`${geistSans.variable} ${geistMono.variable}`}>
      <Toaster />
      <Container className="flex flex-col min-h-svh relative dark:bg-dot-white/[0.2] bg-dot-black/[0.2]">
          <header>
            <Navbar />
          </header>
          <main className="flex-grow">
            <div className="mt-16 mb-16 relative">{children}</div>
          </main>
      </Container>
    </div>
  );
}
