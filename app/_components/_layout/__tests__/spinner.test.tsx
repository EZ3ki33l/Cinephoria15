import { render } from '@testing-library/react';
import { Spinner } from '../spinner';

describe('Spinner', () => {
  it('rend le spinner avec les valeurs par défaut', () => {
    const { container } = render(<Spinner />);
    const spinner = container.querySelector('svg');
    
    expect(spinner).toHaveClass('w-9 - h-9');
    expect(spinner).toHaveClass('text-primary');
    expect(spinner).toHaveAttribute('role', 'spinner');
  });

  it('applique la taille small', () => {
    const { container } = render(<Spinner size="small" />);
    const spinner = container.querySelector('svg');
    
    expect(spinner).toHaveClass('w-5 h-5');
  });

  it('applique la taille large', () => {
    const { container } = render(<Spinner size="large" />);
    const spinner = container.querySelector('svg');
    
    expect(spinner).toHaveClass('w-12 h-12');
  });

  it('applique la variante white', () => {
    const { container } = render(<Spinner variant="white" />);
    const spinner = container.querySelector('svg');
    
    expect(spinner).toHaveClass('text-white');
  });

  it('applique les classes personnalisées', () => {
    const { container } = render(<Spinner className="test-class" />);
    const spinner = container.querySelector('svg');
    
    expect(spinner).toHaveClass('test-class');
  });

  it('contient les éléments SVG nécessaires', () => {
    const { container } = render(<Spinner />);
    
    expect(container.querySelector('defs')).toBeInTheDocument();
    expect(container.querySelector('filter')).toBeInTheDocument();
    expect(container.querySelectorAll('circle')).toHaveLength(2);
    expect(container.querySelector('animateTransform')).toBeInTheDocument();
  });

  it('applique les animations correctes', () => {
    const { container } = render(<Spinner />);
    const animateTransform = container.querySelector('animateTransform');
    
    expect(animateTransform).toHaveAttribute('attributeName', 'transform');
    expect(animateTransform).toHaveAttribute('dur', '0.75s');
    expect(animateTransform).toHaveAttribute('repeatCount', 'indefinite');
    expect(animateTransform).toHaveAttribute('type', 'rotate');
    expect(animateTransform).toHaveAttribute('values', '0 12 12;360 12 12');
  });

  it('applique le filtre gooey', () => {
    const { container } = render(<Spinner />);
    const filter = container.querySelector('filter');
    const feGaussianBlur = container.querySelector('feGaussianBlur');
    const feColorMatrix = container.querySelector('feColorMatrix');
    
    expect(filter).toHaveAttribute('id', 'svgSpinnersGooeyBalls20');
    expect(feGaussianBlur).toHaveAttribute('stdDeviation', '1');
    expect(feColorMatrix).toBeInTheDocument();
  });
}); 