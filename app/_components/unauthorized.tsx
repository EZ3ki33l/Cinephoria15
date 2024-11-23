import { AlertDialog } from "@/components/ui/alert-dialog";
import { Role } from "@/utils/types";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { CopyToClipboard } from "./copyToClipboard";
import { Typo } from "./_layout/typography";
import { Button } from "./_layout/button";
import Image from "next/image";

export interface ITellThemProps {
  uid: string;
  role: Role;
}

export const Unconnected = ({ role }: ITellThemProps) => {
  return (
    <AlertDialog>
      <div className="flex flex-col min-h-[75svh] justify-center items-center text-center">
        <div className="flex pb-12 my-6 font-serif text-2xl font-semibold">
          <Image
            src={"/images/surpris.png"}
            width={250}
            height={250}
            alt={"Monstre PopCorn surpris"}
            className="border rounded-full border-danger ml-32 "
          />
          <Image
            src={"/images/huh.png"}
            width={150}
            height={50}
            alt={"bulle bd huh"}
            className="object-contain object-center -mt-44"
          />
        </div>
        <Typo variant="h4" component="p" theme="danger">
          Accès non autorisé !
        </Typo>
        <Typo variant="body-base" component="p">
          Vous devez <span className="font-semibold">vous connecter</span> et
          avoir le rôle <span className="font-bold">{role}</span> afin de
          pouvoir accéder à cette page.
        </Typo>
        <div className="flex justify-center py-5 gap-5 text-white">
          <SignInButton mode="modal">
            <Button variant="primary">Connexion</Button>
          </SignInButton>
          <SignUpButton mode="modal">
            <Button variant="secondary">S'inscrire</Button>
          </SignUpButton>
        </div>
      </div>
    </AlertDialog>
  );
};

export const Unauthorized = ({ uid, role }: ITellThemProps) => {
  return (
    <AlertDialog>
      <div className="flex flex-col min-h-[75svh] justify-center items-center text-center">
        <div className="flex pb-12 my-6 font-serif text-2xl font-semibold">
          <Image
            src={"/images/surpris.png"}
            width={250}
            height={250}
            alt={"Monstre PopCorn surpris"}
            className="border rounded-full border-danger ml-32 "
          />
          <Image
            src={"/images/huh.png"}
            width={150}
            height={50}
            alt={"bulle bd huh"}
            className="object-contain object-center -mt-44"
          />
        </div>

        <Typo variant="h4" component="p" theme="danger">
          Accès non autorisé !
        </Typo>
        <Typo variant="body-base" component="p">
          Vous n'avez pas le rôle <span className="font-bold">{role}</span> dans
          nos systèmes. 🤷
        </Typo>
        <Typo variant="body-base" component="p" className="mt-6 mb-2">
          Vous pouvez contacter les administrateur en leur founissant votre
          identifiant :
        </Typo>
        <CopyToClipboard text={uid} />
      </div>
    </AlertDialog>
  );
};
