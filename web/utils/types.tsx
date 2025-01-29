import { ReactElement, ReactNode } from "react";

export type Role = "administrateur" | "manager";

export type BaseComponent = {
  children?: ReactNode;
  className?: string;
};

export type StripeItemType = {
  screenId: number;
  showtimeId: number;
  seats: { column: number; row: number; price: number }[];
};

export type LinkType = "internal" | "external";

export const LinkTypes: Record<string, LinkType> = {
  INTERNAL: "internal",
  EXTERNAL: "external",
};

export interface IconProps {
  size: number;
}
