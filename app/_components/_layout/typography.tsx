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
  component?: "h1" | "h2" | "h3" | "h4" | "h4" | "p" | "span" | "div";
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
  weigth?: "regular" | "medium" | "semibold" | "bold" | "extra-bold";
  className?: string;
  children: React.ReactNode;
}

export const Typo = ({
  variant = "body-base",
  component: Component = "div",
  theme = "gray-dark",
  weigth = "regular",
  className,
  children,
}: Props) => {
  let variantStyles: string = "",
    colorStyles: string = "";

  switch (variant) {
    case "display":
      variantStyles = "text-8xl";
      break;
    case "h1":
      variantStyles = "text-6xl font-h1 pb-5 ";
      break;
    case "h2":
      variantStyles = "text-5xl";
      break;
    case "h3":
      variantStyles = "text-4xl";
      break;
    case "h4":
      variantStyles = "text-3xl";
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
    case "secondary":
      colorStyles = "text-secondary";
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

  return (
    <Component className={clsx(variantStyles, colorStyles, weigth, className)}>
      {children}
    </Component>
  );
};
