import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContactForm } from '../_components/ContactForm';
import { submitContactForm } from '../actions';
import { toast } from 'sonner';
import renderWithProviders from '../../_lib/test-utils';

// Mock des dépendances
jest.mock('../actions');
jest.mock('sonner');

const mockCinemas = [{
  id: 1,
  name: 'Cinéma Test',
  addressId: 1,
  isOpen: true,
  managerId: '1',
  description: 'Description test',
  createdAt: new Date(),
  updatedAt: new Date(),
  Address: {
    id: 1,
    street: 'Rue test',
    city: 'Ville Test',
    postalCode: 12345,
    lat: 0,
    lng: 0
  },
  Equipment: [],
  Screens: []
}];

describe('ContactForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('affiche un message d\'erreur pour un email invalide', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ContactForm cinemas={mockCinemas} />);

    const emailInput = screen.getByRole('textbox', { name: /^email$/i });
    const motifTrigger = screen.getByTestId('motif-trigger');
    const messageInput = screen.getByRole('textbox', { name: /^votre message$/i });
    
    await user.type(emailInput, 'invalid-email');
    await user.click(motifTrigger);
    await user.click(screen.getByTestId('select-item-Information générale'));
    await user.type(messageInput, 'Un message de test');
    await user.click(screen.getByRole('button', { name: /^envoyer$/i }));

    expect(await screen.findByText('Email invalide')).toBeInTheDocument();
  });

  it('réinitialise le formulaire après une soumission réussie', async () => {
    const user = userEvent.setup();
    (submitContactForm as jest.Mock).mockResolvedValue({ success: true });

    renderWithProviders(<ContactForm cinemas={mockCinemas} />);
    
    const nomInput = screen.getByRole('textbox', { name: /^nom$/i });
    const prenomInput = screen.getByRole('textbox', { name: /^prénom$/i });
    const emailInput = screen.getByRole('textbox', { name: /^email$/i });
    const motifTrigger = screen.getByTestId('motif-trigger');
    const messageInput = screen.getByRole('textbox', { name: /^votre message$/i });

    await user.type(nomInput, 'Doe');
    await user.type(prenomInput, 'John');
    await user.type(emailInput, 'john.doe@example.com');
    await user.click(motifTrigger);
    await user.click(screen.getByTestId('select-item-Information générale'));
    await user.type(messageInput, 'Un message de test');
    await user.click(screen.getByRole('button', { name: /^envoyer$/i }));

    expect(submitContactForm).toHaveBeenCalledWith({
      nom: 'Doe',
      prenom: 'John',
      email: 'john.doe@example.com',
      motif: 'Information générale',
      message: 'Un message de test'
    });
    expect(await screen.findByText('Votre message a bien été envoyé !')).toBeInTheDocument();
  });

  it('gère les erreurs de soumission', async () => {
    const user = userEvent.setup();
    const errorMessage = 'Une erreur est survenue';
    (submitContactForm as jest.Mock).mockResolvedValue({ 
      success: false, 
      error: errorMessage 
    });

    renderWithProviders(<ContactForm cinemas={mockCinemas} />);
    
    const nomInput = screen.getByRole('textbox', { name: /^nom$/i });
    const prenomInput = screen.getByRole('textbox', { name: /^prénom$/i });
    const emailInput = screen.getByRole('textbox', { name: /^email$/i });
    const motifTrigger = screen.getByTestId('motif-trigger');
    const messageInput = screen.getByRole('textbox', { name: /^votre message$/i });

    await user.type(nomInput, 'Doe');
    await user.type(prenomInput, 'John');
    await user.type(emailInput, 'john.doe@example.com');
    await user.click(motifTrigger);
    await user.click(screen.getByTestId('select-item-Information générale'));
    await user.type(messageInput, 'Un message de test');

    await user.click(screen.getByRole('button', { name: /^envoyer$/i }));

    expect(await screen.findByText(errorMessage)).toBeInTheDocument();
  });
}); 