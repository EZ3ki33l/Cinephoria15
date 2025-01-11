import { render, screen, fireEvent } from "@testing-library/react";
import { TouchScrollContainer } from "../TouchScrollContainer";

describe("TouchScrollContainer Component", () => {
  it("rend le contenu avec la classe de base", () => {
    render(
      <TouchScrollContainer>
        <div>Contenu scrollable</div>
      </TouchScrollContainer>
    );
    
    const container = screen.getByText("Contenu scrollable").parentElement;
    expect(container).toHaveClass("overscroll-contain");
  });

  it("accepte et applique des classes supplémentaires", () => {
    const customClass = "custom-class";
    render(
      <TouchScrollContainer className={customClass}>
        <div>Contenu scrollable</div>
      </TouchScrollContainer>
    );
    
    const container = screen.getByText("Contenu scrollable").parentElement;
    expect(container).toHaveClass(customClass, "overscroll-contain");
  });

  it("gère l'événement touchstart", () => {
    render(
      <TouchScrollContainer>
        <div>Contenu scrollable</div>
      </TouchScrollContainer>
    );
    
    const container = screen.getByText("Contenu scrollable").parentElement;
    fireEvent.touchStart(container!);
    expect(container).toHaveStyle({ overflowY: "auto" });
  });

  it("gère l'événement touchend", () => {
    render(
      <TouchScrollContainer>
        <div>Contenu scrollable</div>
      </TouchScrollContainer>
    );
    
    const container = screen.getByText("Contenu scrollable").parentElement;
    fireEvent.touchEnd(container!);
    expect(container).toHaveStyle({ overflowY: "hidden" });
  });

  it("transmet les props HTML supplémentaires", () => {
    render(
      <TouchScrollContainer data-testid="scroll-container" aria-label="zone scrollable">
        <div>Contenu scrollable</div>
      </TouchScrollContainer>
    );
    
    const container = screen.getByTestId("scroll-container");
    expect(container).toHaveAttribute("aria-label", "zone scrollable");
  });
}); 