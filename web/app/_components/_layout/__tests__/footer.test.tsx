import { render, screen } from '@testing-library/react';
import { Footer } from '../footer';

describe('Footer', () => {
  it('affiche le numéro de téléphone', async () => {
    render(await Footer());
    expect(screen.getByText('09 78 970 970')).toBeInTheDocument();
  });

  it('affiche le bouton de contact', async () => {
    render(await Footer());
    expect(screen.getByRole('button', { name: 'Nous contacter' })).toBeInTheDocument();
  });

  it('affiche les liens des réseaux sociaux', async () => {
    render(await Footer());
    expect(screen.getByRole('link', { name: /facebook/i })).toHaveAttribute('href', 'https://facebook.com/cinephoria15');
    expect(screen.getByRole('link', { name: /x/i })).toHaveAttribute('href', 'https://twitter.com/cinephoria15');
    expect(screen.getByRole('link', { name: /youtube/i })).toHaveAttribute('href', 'https://youtube.com/cinephoria15');
    expect(screen.getByRole('link', { name: /linkedin/i })).toHaveAttribute('href', 'https://linkedin.com/company/cinephoria15');
  });

  it('affiche les liens de navigation', async () => {
    render(await Footer());
    expect(screen.getByRole('link', { name: 'A propos de nous' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Nos cinémas' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Réservation' })).toBeInTheDocument();
  });

  it('affiche les liens privés', async () => {
    render(await Footer());
    expect(screen.getByRole('link', { name: /administrateur/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /manager/i })).toBeInTheDocument();
  });

  it('affiche le copyright et les liens légaux', async () => {
    render(await Footer());
    expect(screen.getByText(/cinephoria\. tous droits réservés\./i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Mentions légales' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Politique de confidentialité' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Plan du site' })).toBeInTheDocument();
  });
}); 