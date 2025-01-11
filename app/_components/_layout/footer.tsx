import Link from "next/link";
import { AccessLinks, FooterLinks } from "./footerLinks";
import { RoundedLogo } from "./logo";
import { Typo } from "./typography";
import { Button } from "./button";
import { Facebook, Instagram, Twitter, Mail, Phone } from "lucide-react";

export async function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/40">
      <div className="mx-auto">
        <div className="py-12 px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Colonne Logo */}
            <div className="flex items-center">
              <div className="transform transition hover:scale-105 duration-300">
                <RoundedLogo size="large" />
              </div>
            </div>

            {/* Colonne Contact */}
            <div className="flex flex-col items-center lg:items-start space-y-6">
              <h2 className="text-lg font-semibold text-foreground">Contact</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-center lg:justify-start space-x-2">
                  <Phone className="h-4 w-4 text-primary dark:text-primary-light" />
                  <Typo
                    variant="body-sm"
                    component="p"
                    className="tracking-wider text-foreground/90"
                  >
                    09 78 970 970
                  </Typo>
                </div>
                <Link href="/contact" className="block">
                  <Button
                    size="small"
                    className="transition-all duration-300 hover:shadow-lg w-full"
                  >
                    Nous contacter
                  </Button>
                </Link>
              </div>
              <div className="flex flex-col items-center lg:items-start">
                <h2 className="text-lg font-semibold text-foreground mb-6">
                  Réseaux sociaux
                </h2>
                <div className="flex justify-center lg:justify-start space-x-4">
                  <Link
                    href="https://facebook.com"
                    target="_blank"
                    className="text-muted-foreground hover:text-primary dark:hover:text-primary-light transition-colors"
                  >
                    <Facebook className="h-5 w-5" />
                  </Link>
                  <Link
                    href="https://twitter.com"
                    target="_blank"
                    className="text-muted-foreground hover:text-primary dark:hover:text-primary-light transition-colors"
                  >
                    <Twitter className="h-5 w-5" />
                  </Link>
                  <Link
                    href="https://instagram.com"
                    target="_blank"
                    className="text-muted-foreground hover:text-primary dark:hover:text-primary-light transition-colors"
                  >
                    <Instagram className="h-5 w-5" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Colonne Navigation */}
            <div className="flex flex-col items-center lg:items-start">
              <h2 className="text-lg font-semibold text-foreground mb-6">
                Navigation
              </h2>
              <FooterLinks />
            </div>

            {/* Colonne Accès */}
            <div className="flex flex-col items-center lg:items-start">
              <h2 className="text-lg font-semibold text-foreground mb-6">
                Accès Privé
              </h2>
              <AccessLinks />
            </div>
          </div>
        </div>

        {/* Barre de copyright */}
        <div className="border-t border-border/40 py-6 px-6">
          <div className="flex flex-col lg:flex-row justify-between items-center text-sm text-muted-foreground space-y-4 lg:space-y-0">
            <p className="text-center lg:text-left">
              © {currentYear} Cinephoria. Tous droits réservés.
            </p>
            <div className="flex flex-wrap justify-center gap-4 lg:gap-6">
              <Link
                href="/mentions-legales"
                className="hover:text-primary dark:hover:text-primary-light transition-colors whitespace-nowrap"
              >
                Mentions légales
              </Link>
              <Link
                href="/politique-confidentialite"
                className="hover:text-primary dark:hover:text-primary-light transition-colors whitespace-nowrap"
              >
                Politique de confidentialité
              </Link>
              <Link
                href="/plan-du-site"
                className="hover:text-primary dark:hover:text-primary-light transition-colors whitespace-nowrap"
              >
                Plan du site
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
