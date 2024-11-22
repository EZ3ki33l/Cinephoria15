import { BaseComponent } from "@/utils/types";

export const Container = ({ children, className }: BaseComponent) => (
  <div className={`max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto ${className || ""}`}>
    {children}
  </div>
);
