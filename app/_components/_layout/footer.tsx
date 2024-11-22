import Link from "next/link";
import { AccessLinks, FooterLinks } from "./footerLinks";
import { RoundedLogo } from "./logo";
import { Typo } from "./typography";
import { Button } from "./button";

export async function Footer() {
  return (
    <footer className="pt-5 pb-10 px-10 border-t flex flex-col md:flex-row justify-between items-center mt-5">
      <div className="flex flex-col items-center justify-center">
        <RoundedLogo size="medium" />
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-lg font-semibold">Nous contacter :</h2>
          <div className="flex flex-col justify-center items-center">
            <Typo variant="body-sm" component="p">
              09<span className="text-primaryfont-bold"> - </span>78
              <span className="text-primary font-bold"> - </span>97
              <span className="text-primary font-bold"> - </span>09
              <span className="text-primary font-bold"> - </span>70
            </Typo>
            <Link href="/contact">
              <Button size="small" className="text-xs">
                Accéder au formulaire
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <FooterLinks />
      </div>
      <div className="flex flex-col">
        <AccessLinks />
      </div>
    </footer>
  );
}
