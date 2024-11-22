import Image from "next/image";
interface Props {
  size?: "extra-small" | "very-small" | "small" | "medium" | "large";
}

export const Logo = ({ size = "medium" }: Props) => {
  let longueur: number;
  let largeur: number;

  switch (size) {
    case "extra-small":
      longueur = 135;
      largeur = 38;
      break;
    case "very-small":
      longueur = 180;
      largeur = 51;
      break;
    case "small":
      longueur = 271;
      largeur = 77;
      break;
    case "medium":
      longueur = 361;
      largeur = 102;
      break;
    case "large":
      longueur = 541;
      largeur = 153;
      break;
  }

  return (
    <Image
      src="/images/Logo_cinephoria.png"
      alt="logo"
      width={longueur}
      height={largeur}
      priority={true}
    />
  );
};

export const RoundedLogo = ({ size = "medium" }: Props) => {
  let longueur: number;
  let largeur: number;

  switch (size) {
    case "extra-small":
      longueur = 40;
      largeur = 40;
      break;
    case "very-small":
      longueur = 50;
      largeur = 50;
      break;
    case "small":
      longueur = 80;
      largeur = 80;
      break;
    case "medium":
      longueur = 100;
      largeur = 100;
      break;
    case "large":
      longueur = 150;
      largeur = 150;
      break;
  }

  return (
    <Image
      src="/images/Logo_carre_cinephoria.png"
      alt="logo"
      width={longueur}
      height={largeur}
      priority={false}
      className="rounded-full"
    />
  );
};