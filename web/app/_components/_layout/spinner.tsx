import { cn } from "@/lib/utils";

interface Props {
  size?: "small" | "medium" | "large";
  variant?: "primary" | "white";
  className?: string;
}

export const Spinner = ({
  size = "medium",
  variant = "primary",
  className,
}: Props) => {
  let variantStyles: string = "",
    sizeStyles: string = "";

  switch (size) {
    case "small":
      sizeStyles = "w-5 h-5";
      break;
    case "medium":
      sizeStyles = "w-9 - h-9";
      break;
    case "large":
      sizeStyles = "w-12 h-12";
      break;
  }

  switch (variant) {
    case "primary":
      variantStyles = "text-primary";
      break;
    case "white":
      variantStyles = "text-white";
      break;
  }

  return (
    <svg
      role="spinner"
      className={cn(sizeStyles, variantStyles, className)}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
    >
      <defs>
        <filter id="svgSpinnersGooeyBalls20">
          <feGaussianBlur in="SourceGraphic" result="y" stdDeviation="1" />
          <feColorMatrix
            in="y"
            result="z"
            values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 18 -7"
          />
          <feBlend in="SourceGraphic" in2="z" />
        </filter>
      </defs>
      <g filter="url(#svgSpinnersGooeyBalls20)">
        <circle cx="5" cy="12" r="4" fill="currentColor">
          <animate
            attributeName="cx"
            calcMode="spline"
            dur="2s"
            keySplines=".36,.62,.43,.99;.79,0,.58,.57"
            repeatCount="indefinite"
            values="5;8;5"
          />
        </circle>
        <circle cx="19" cy="12" r="4" fill="currentColor">
          <animate
            attributeName="cx"
            calcMode="spline"
            dur="2s"
            keySplines=".36,.62,.43,.99;.79,0,.58,.57"
            repeatCount="indefinite"
            values="19;16;19"
          />
        </circle>
        <animateTransform
          attributeName="transform"
          dur="0.75s"
          repeatCount="indefinite"
          type="rotate"
          values="0 12 12;360 12 12"
        />
      </g>
    </svg>
  );
};