import { BaseComponent } from "@/utils/types";

export const Container = ({ children, className }: BaseComponent) => (
  <div
    className={`max-w-7xl mx-auto ${
      className || ""
    }`}
  >
    {children}
  </div>
);
