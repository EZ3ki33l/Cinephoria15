import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CinemaSelector } from '../CinemaSelector';
import { getUserFavoriteCinema, updateFavoriteCinema } from '@/app/_actions/user';

interface SimpleCinema {
  id: number;
  name: string;
  addressId: number;
  isOpen: boolean | null;
  managerId: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

// Mocks
jest.mock('@/app/_actions/user', () => ({
  getUserFavoriteCinema: jest.fn(),
  updateFavoriteCinema: jest.fn(),
}));

const mockCinemas: SimpleCinema[] = [
  {
    id: 1,
    name: 'Cinéma Test 1',
    addressId: 1,
    isOpen: true,
    managerId: '1',
    description: 'Description test 1',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 2,
    name: 'Cinéma Test 2',
    addressId: 2,
    isOpen: true,
    managerId: '2',
    description: 'Description test 2',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

describe('CinemaSelector', () => {
  const mockOnSelect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (getUserFavoriteCinema as jest.Mock).mockResolvedValue(1);
    (updateFavoriteCinema as jest.Mock).mockResolvedValue(undefined);
  });

  it('affiche le bouton de sélection de cinéma', () => {
    render(
      <CinemaSelector
        cinemas={mockCinemas}
        currentCinemaId={null}
        onSelect={mockOnSelect}
      />
    );

    expect(screen.getByText('Choisir mon cinéma')).toBeInTheDocument();
  });

  it('charge le cinéma favori au démarrage', async () => {
    render(
      <CinemaSelector
        cinemas={mockCinemas}
        currentCinemaId={null}
        onSelect={mockOnSelect}
      />
    );

    await waitFor(() => {
      expect(getUserFavoriteCinema).toHaveBeenCalled();
      expect(screen.getByText(/Cinéma Test 1/)).toBeInTheDocument();
    });
  });

  it('ouvre la modale de sélection au clic sur le bouton', async () => {
    render(
      <CinemaSelector
        cinemas={mockCinemas}
        currentCinemaId={null}
        onSelect={mockOnSelect}
      />
    );

    const button = screen.getByText('Choisir mon cinéma');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Choisissez votre cinéma')).toBeInTheDocument();
      expect(screen.getAllByRole('button')).toHaveLength(mockCinemas.length + 1); // +1 pour le bouton principal
    });
  });

  it('sélectionne un nouveau cinéma', async () => {
    render(
      <CinemaSelector
        cinemas={mockCinemas}
        currentCinemaId={1}
        onSelect={mockOnSelect}
      />
    );

    const button = screen.getByText('Choisir mon cinéma');
    fireEvent.click(button);

    await waitFor(() => {
      const cinema2Button = screen.getByText('Cinéma Test 2');
      fireEvent.click(cinema2Button);
    });

    await waitFor(() => {
      expect(updateFavoriteCinema).toHaveBeenCalledWith(2);
      expect(mockOnSelect).toHaveBeenCalledWith(2);
    });
  });

  it('affiche le cinéma actuellement sélectionné', () => {
    render(
      <CinemaSelector
        cinemas={mockCinemas}
        currentCinemaId={1}
        onSelect={mockOnSelect}
      />
    );

    expect(screen.getByText(/Cinéma Test 1/)).toBeInTheDocument();
  });

  it('met à jour l\'affichage après la sélection d\'un nouveau cinéma', async () => {
    render(
      <CinemaSelector
        cinemas={mockCinemas}
        currentCinemaId={1}
        onSelect={mockOnSelect}
      />
    );

    const button = screen.getByText('Choisir mon cinéma');
    fireEvent.click(button);

    await waitFor(() => {
      const cinema2Button = screen.getByText('Cinéma Test 2');
      fireEvent.click(cinema2Button);
    });

    await waitFor(() => {
      expect(screen.getByText(/Cinéma Test 2/)).toBeInTheDocument();
    });
  });
}); 