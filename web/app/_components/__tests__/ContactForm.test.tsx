import { render, screen, fireEvent } from '@testing-library/react';
import { ContactForm } from '@/app/contact/_components/ContactForm';
import { submitContactForm } from '@/app/contact/actions';
import { toast } from 'sonner';

// Mock des dépendances
jest.mock('@/app/contact/actions');
jest.mock('sonner');

// Type partiel pour le mock
type PartialCinema = {
  id: number;
  name: string;
  addressId: number;
  isOpen: boolean | null;
  managerId: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  Address: {
    id: number;
    street: string;
    city: string;
    postalCode: number;
    lat: number;
    lng: number;
  };
  Equipment: {
    id: number;
    name: string;
  }[];
  Screens: {
    id: number;
    number: number;
    projectionType: string;
    soundSystemType: string;
  }[];
};

describe('ContactForm', () => {
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
  }] as PartialCinema[];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('affiche le formulaire avec tous les champs requis', () => {
    render(<ContactForm cinemas={mockCinemas} />);
    
    expect(screen.getByRole('textbox', { name: /nom/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /prénom/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /email/i })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /motif/i })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /cinéma/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /message/i })).toBeInTheDocument();
  });

  it('soumet le formulaire avec succès', async () => {
    (submitContactForm as jest.Mock).mockResolvedValueOnce({ success: true });
    
    render(<ContactForm cinemas={mockCinemas} />);
    
    fireEvent.change(screen.getByRole('textbox', { name: /nom/i }), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByRole('textbox', { name: /prénom/i }), { target: { value: 'John' } });
    fireEvent.change(screen.getByRole('textbox', { name: /email/i }), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByRole('combobox', { name: /motif/i }), { target: { value: 'Information générale' } });
    fireEvent.change(screen.getByRole('combobox', { name: /cinéma/i }), { target: { value: '1' } });
    fireEvent.change(screen.getByRole('textbox', { name: /message/i }), { target: { value: 'Test message' } });
    
    fireEvent.submit(screen.getByRole('form'));
    
    expect(submitContactForm).toHaveBeenCalledWith({
      nom: 'Doe',
      prenom: 'John', 
      email: 'john@example.com',
      motif: 'Information générale',
      cinema: '1',
      message: 'Test message'
    });
    
    expect(toast.success).toHaveBeenCalled();
  });

  it('affiche une erreur si la soumission échoue', async () => {
    (submitContactForm as jest.Mock).mockRejectedValueOnce(new Error('Erreur test'));
    
    render(<ContactForm cinemas={mockCinemas} />);
    
    fireEvent.change(screen.getByRole('textbox', { name: /nom/i }), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByRole('textbox', { name: /prénom/i }), { target: { value: 'John' } });
    fireEvent.change(screen.getByRole('textbox', { name: /email/i }), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByRole('combobox', { name: /motif/i }), { target: { value: 'Information générale' } });
    fireEvent.change(screen.getByRole('combobox', { name: /cinéma/i }), { target: { value: '1' } });
    fireEvent.change(screen.getByRole('textbox', { name: /message/i }), { target: { value: 'Test message' } });
    
    fireEvent.submit(screen.getByRole('form'));
    
    expect(toast.error).toHaveBeenCalled();
  });
}); 