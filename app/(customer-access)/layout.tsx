import type { Metadata } from "next";
import localFont from "next/font/local";
import "../globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { frFR } from "@clerk/localizations";
import { Toaster } from "sonner";
import { Container } from "../_components/_layout/container";
import { Navbar } from "../_components/_layout/navBar";
import { Footer } from "../_components/_layout/footer";

const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Cinéphoria - Billeterie et actualités",
  description:
    "Site officiel des cinémas Cinéphoria : billeterie et actualités !",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider localization={frFR} dynamic>
      <html lang="fr-FR">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <Toaster />
          <header className="max-w-7xl mx-auto">
            <Navbar />
          </header>
          <Container className="flex flex-col min-h-svh relative dark:bg-dot-white/[0.2] bg-dot-black/[0.2]">
            <main>{children}</main>
          </Container>
          <footer className="max-w-7xl mx-auto">
            <Footer />
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}
