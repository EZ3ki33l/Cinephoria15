import { render } from '@testing-library/react';
import { Typo } from '../typography';

describe('Typography', () => {
  it('rend avec les valeurs par défaut', () => {
    const { container } = render(<Typo>Test Text</Typo>);
    const element = container.firstChild;

    expect(element?.nodeName).toBe('DIV');
    expect(element).toHaveClass('text-base');
    expect(element).toHaveClass('text-gray-dark');
    expect(element).toHaveClass('font-normal');
  });

  describe('Variants', () => {
    const variants = [
      { name: 'display', expectedClass: 'text-8xl' },
      { name: 'h1', expectedClass: 'text-3xl' },
      { name: 'h2', expectedClass: 'text-2xl' },
      { name: 'h3', expectedClass: 'text-xl' },
      { name: 'h4', expectedClass: 'text-lg' },
      { name: 'h5', expectedClass: 'text-2xl' },
      { name: 'lead', expectedClass: 'text-xl' },
      { name: 'body-lg', expectedClass: 'text-lg' },
      { name: 'body-base', expectedClass: 'text-base' },
      { name: 'body-sm', expectedClass: 'text-sm' },
      { name: 'caption1', expectedClass: 'text-caption1' },
      { name: 'caption2', expectedClass: 'text-caption2' },
      { name: 'caption3', expectedClass: 'text-caption3' },
      { name: 'caption4', expectedClass: 'text-caption4' },
    ] as const;

    variants.forEach(({ name, expectedClass }) => {
      it(`applique le style pour la variante ${name}`, () => {
        const { container } = render(
          <Typo variant={name}>Test Text</Typo>
        );
        expect(container.firstChild).toHaveClass(expectedClass);
      });
    });
  });

  describe('Components', () => {
    const components = ['h1', 'h2', 'h3', 'h4', 'p', 'span', 'div'] as const;

    components.forEach((comp) => {
      it(`rend en tant que ${comp}`, () => {
        const { container } = render(
          <Typo component={comp}>Test Text</Typo>
        );
        expect(container.firstChild?.nodeName).toBe(comp.toUpperCase());
      });
    });
  });

  describe('Themes', () => {
    const themes = [
      { name: 'gray-dark', expectedClass: 'text-gray-dark' },
      { name: 'gray', expectedClass: 'text-gray' },
      { name: 'gray-light', expectedClass: 'text-gray-light' },
      { name: 'primary', expectedClass: 'text-primary' },
      { name: 'primary-light', expectedClass: 'text-primary-light' },
      { name: 'primary-dark', expectedClass: 'text-primary-dark' },
      { name: 'secondary', expectedClass: 'text-secondary' },
      { name: 'secondary-light', expectedClass: 'text-secondary-light' },
      { name: 'secondary-dark', expectedClass: 'text-secondary-dark' },
      { name: 'danger', expectedClass: 'text-danger' },
      { name: 'success', expectedClass: 'text-success' },
      { name: 'warning', expectedClass: 'text-warning' },
    ] as const;

    themes.forEach(({ name, expectedClass }) => {
      it(`applique le style pour le thème ${name}`, () => {
        const { container } = render(
          <Typo theme={name}>Test Text</Typo>
        );
        expect(container.firstChild).toHaveClass(expectedClass);
      });
    });
  });

  describe('Weights', () => {
    const weights = [
      { name: 'regular', expectedClass: 'font-normal' },
      { name: 'medium', expectedClass: 'font-medium' },
      { name: 'semibold', expectedClass: 'font-semibold' },
      { name: 'bold', expectedClass: 'font-bold' },
      { name: 'extra-bold', expectedClass: 'font-extrabold' },
    ] as const;

    weights.forEach(({ name, expectedClass }) => {
      it(`applique le style pour le poids ${name}`, () => {
        const { container } = render(
          <Typo weight={name}>Test Text</Typo>
        );
        expect(container.firstChild).toHaveClass(expectedClass);
      });
    });
  });

  it('applique les classes personnalisées', () => {
    const { container } = render(
      <Typo className="test-class">Test Text</Typo>
    );
    expect(container.firstChild).toHaveClass('test-class');
  });

  it('rend le contenu enfant', () => {
    const { container } = render(
      <Typo>
        <span>Child Content</span>
      </Typo>
    );
    expect(container.querySelector('span')).toHaveTextContent('Child Content');
  });

  it('combine plusieurs propriétés', () => {
    const { container } = render(
      <Typo
        variant="h1"
        component="h1"
        theme="primary"
        weight="bold"
        className="custom-class"
      >
        Test Text
      </Typo>
    );

    const element = container.firstChild;
    expect(element?.nodeName).toBe('H1');
    expect(element).toHaveClass('text-3xl');
    expect(element).toHaveClass('text-primary');
    expect(element).toHaveClass('font-bold');
    expect(element).toHaveClass('custom-class');
  });
}); 