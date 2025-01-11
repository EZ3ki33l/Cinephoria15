import { render, screen } from "@testing-library/react";
import { VisuallyHidden } from "../visually-hidden";

describe("VisuallyHidden Component", () => {
  it("rend le contenu avec les styles de base", () => {
    render(<VisuallyHidden>Contenu caché</VisuallyHidden>);
    const element = screen.getByText("Contenu caché");
    
    expect(element).toBeInTheDocument();
    expect(element).toHaveClass(
      "absolute",
      "w-[1px]",
      "h-[1px]",
      "p-0",
      "-m-[1px]",
      "overflow-hidden",
      "whitespace-nowrap",
      "border-0"
    );
    expect(element).toHaveStyle({ clip: "rect(0, 0, 0, 0)" });
  });

  it("accepte et applique des classes supplémentaires", () => {
    const customClass = "custom-class";
    render(<VisuallyHidden className={customClass}>Contenu caché</VisuallyHidden>);
    const element = screen.getByText("Contenu caché");
    
    expect(element).toHaveClass(customClass);
  });

  it("transmet les props HTML supplémentaires", () => {
    render(
      <VisuallyHidden data-testid="hidden-element" aria-label="texte caché">
        Contenu caché
      </VisuallyHidden>
    );
    const element = screen.getByTestId("hidden-element");
    
    expect(element).toHaveAttribute("aria-label", "texte caché");
  });
}); 