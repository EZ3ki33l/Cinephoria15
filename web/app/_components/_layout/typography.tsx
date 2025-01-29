import clsx from "clsx";

interface Props {
  variant?:
    | "display"
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "lead"
    | "body-lg"
    | "body-base"
    | "body-sm"
    | "caption1"
    | "caption2"
    | "caption3"
    | "caption4";
  component?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";
  theme?:
    | "gray-dark"
    | "gray"
    | "gray-light"
    | "primary"
    | "primary-light"
    | "primary-dark"
    | "secondary"
    | "secondary-light"
    | "secondary-dark"
    | "danger"
    | "success"
    | "warning";
  weight?: "regular" | "medium" | "semibold" | "bold" | "extra-bold";
  className?: string;
  children: React.ReactNode;
}

export const Typo = ({
  variant = "body-base",
  component = "div",
  theme = "gray-dark",
  weight = "regular",
  className,
  children,
}: Props) => {
  let variantStyles: string = "",
    colorStyles: string = "",
    weightStyles: string = "";

  // Définir les styles pour le variant
  switch (variant) {
    case "display":
      variantStyles = "text-8xl";
      break;
    case "h1":
      variantStyles = "text-3xl md:text-6xl font-h1 ";
      break;
    case "h2":
      variantStyles = "text-2xl md:text-5xl";
      break;
    case "h3":
      variantStyles = "text-xl md:text-4xl";
      break;
    case "h4":
      variantStyles = "text-lg md:text-3xl";
      break;
    case "h5":
      variantStyles = "text-2xl";
      break;
    case "lead":
      variantStyles = "text-xl";
      break;
    case "body-lg":
      variantStyles = "text-lg";
      break;
    case "body-base":
      variantStyles = "text-base";
      break;
    case "body-sm":
      variantStyles = "text-sm";
      break;
    case "caption1":
      variantStyles = "text-caption1";
      break;
    case "caption2":
      variantStyles = "text-caption2";
      break;
    case "caption3":
      variantStyles = "text-caption3";
      break;
    case "caption4":
      variantStyles = "text-caption4";
      break;
  }

  // Définir les styles de poids de police
  switch (weight) {
    case "regular":
      weightStyles = "font-normal";
      break;
    case "medium":
      weightStyles = "font-medium";
      break;
    case "semibold":
      weightStyles = "font-semibold";
      break;
    case "bold":
      weightStyles = "font-bold";
      break;
    case "extra-bold":
      weightStyles = "font-extrabold";
      break;
  }

  // Définir les styles pour le thème
  switch (theme) {
    case "gray-dark":
      colorStyles = "text-gray-dark";
      break;
    case "gray":
      colorStyles = "text-gray";
      break;
    case "gray-light":
      colorStyles = "text-gray-light";
      break;
    case "primary":
      colorStyles = "text-primary";
      break;
    case "primary-light":
      colorStyles = "text-primary-light";
      break;
    case "primary-dark":
      colorStyles = "text-primary-dark";
      break;
    case "secondary":
      colorStyles = "text-secondary";
      break;
    case "secondary-light":
      colorStyles = "text-secondary-light";
      break;
    case "secondary-dark":
      colorStyles = "text-secondary-dark";
      break;
    case "danger":
      colorStyles = "text-danger";
      break;
    case "success":
      colorStyles = "text-success";
      break;
    case "warning":
      colorStyles = "text-warning";
      break;
  }

  const combinedClassName = clsx(variantStyles, colorStyles, weightStyles, className);

  switch (component) {
    case "h1":
      return <h1 className={combinedClassName}>{children}</h1>;
    case "h2":
      return <h2 className={combinedClassName}>{children}</h2>;
    case "h3":
      return <h3 className={combinedClassName}>{children}</h3>;
    case "h4":
      return <h4 className={combinedClassName}>{children}</h4>;
    case "p":
      return <p className={combinedClassName}>{children}</p>;
    case "span":
      return <span className={combinedClassName}>{children}</span>;
    default:
      return <div className={combinedClassName}>{children}</div>;
  }
};
