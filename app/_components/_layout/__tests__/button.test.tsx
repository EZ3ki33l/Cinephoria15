import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../button';
import { Mail } from 'lucide-react';

describe('Button', () => {
  it('rend le bouton avec le texte par défaut', () => {
    render(<Button>Test Button</Button>);
    expect(screen.getByText('Test Button')).toBeInTheDocument();
  });

  it('applique la classe de variante correcte', () => {
    const { container } = render(<Button variant="primary">Primary Button</Button>);
    expect(container.firstChild).toHaveClass('bg-primary');
  });

  it('applique la taille correcte', () => {
    const { container } = render(<Button size="large">Large Button</Button>);
    expect(container.firstChild).toHaveClass('h-12');
  });

  it('affiche le spinner pendant le chargement', () => {
    render(<Button isLoading>Loading Button</Button>);
    expect(screen.getByText('Loading Button')).toHaveClass('invisible');
    expect(document.querySelector('[role="status"]')).toBeInTheDocument();
  });

  it('désactive le bouton pendant le chargement', () => {
    render(<Button isLoading>Loading Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('affiche l\'icône à gauche par défaut', () => {
    render(<Button icon={<Mail data-testid="mail-icon" />}>Icon Button</Button>);
    const buttonContent = screen.getByText('Icon Button').parentElement;
    const icon = screen.getByTestId('mail-icon');
    expect(buttonContent?.firstChild).toBe(icon);
  });

  it('affiche l\'icône à droite quand spécifié', () => {
    render(
      <Button icon={<Mail data-testid="mail-icon" />} iconPosition="right">
        Icon Button
      </Button>
    );
    const buttonContent = screen.getByText('Icon Button').parentElement;
    const icon = screen.getByTestId('mail-icon');
    expect(buttonContent?.lastChild).toBe(icon);
  });

  it('rend un lien interne avec Next.js Link', () => {
    render(<Button baseUrl="/test">Link Button</Button>);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/test');
  });

  it('rend un lien externe', () => {
    render(
      <Button baseUrl="https://example.com" linkType="external">
        External Link
      </Button>
    );
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', 'https://example.com');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('appelle la fonction action au clic', () => {
    const handleClick = jest.fn();
    render(<Button action={handleClick}>Action Button</Button>);
    fireEvent.click(screen.getByText('Action Button'));
    expect(handleClick).toHaveBeenCalled();
  });

  it('applique la classe fullWidth quand spécifié', () => {
    const { container } = render(<Button fullWidth>Full Width Button</Button>);
    expect(container.firstChild).toHaveClass('w-full');
  });

  it('est désactivé quand la prop disabled est true', () => {
    render(<Button disabled>Disabled Button</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
}); 