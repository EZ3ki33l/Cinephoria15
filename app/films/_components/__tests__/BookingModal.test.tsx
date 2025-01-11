import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BookingModal } from '../BookingModal';
import { getUserFavoriteCinema } from '@/app/_actions/user';
import { getAllCinemas } from '@/app/(private-access)/administrateur/cinemas/_components/actions';
import { getShowtimesByScreen } from '@/app/reservation/_components/action';
import { useAuth } from '@clerk/nextjs';
import { toast } from 'sonner';

// Mocks
jest.mock('@/app/_actions/user');
jest.mock('@/app/(private-access)/administrateur/cinemas/_components/actions');
jest.mock('@/app/reservation/_components/action');
jest.mock('@clerk/nextjs');
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const mockShowtimes = [
  {
    id: 1,
    startTime: new Date('2024-01-20T14:30:00').toISOString(),
    Screen: {
      id: 1,
      number: 1,
      price: 10,
      Cinema: {
        id: 1,
        name: 'Cinéma Test'
      }
    },
    Movie: {
      id: 1,
      title: 'Film Test'
    }
  }
];

const mockCinemas = [
  {
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
      city: 'Ville test',
      postalCode: 12345,
      lat: 0,
      lng: 0
    }
  }
];

describe('BookingModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getUserFavoriteCinema as jest.Mock).mockResolvedValue(1);
    (getAllCinemas as jest.Mock).mockResolvedValue({ success: true, data: mockCinemas });
    (getShowtimesByScreen as jest.Mock).mockResolvedValue({
      success: true,
      data: [{ showtimes: mockShowtimes }]
    });
    (useAuth as jest.Mock).mockReturnValue({
      userId: 'test-user',
      isSignedIn: true
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('affiche le titre du film', async () => {
    render(
      <BookingModal
        isOpen={true}
        onClose={() => {}}
        movieId={1}
        movieTitle="Film Test"
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Réserver pour Film Test')).toBeInTheDocument();
    });
  });

  it('charge le cinéma favori au démarrage', async () => {
    render(
      <BookingModal
        isOpen={true}
        onClose={() => {}}
        movieId={1}
        movieTitle="Film Test"
      />
    );

    await waitFor(() => {
      expect(getUserFavoriteCinema).toHaveBeenCalled();
    });
  });

  it('charge les cinémas au démarrage', async () => {
    render(
      <BookingModal
        isOpen={true}
        onClose={() => {}}
        movieId={1}
        movieTitle="Film Test"
      />
    );

    await waitFor(() => {
      expect(getAllCinemas).toHaveBeenCalled();
      expect(screen.getByText('Cinéma Test')).toBeInTheDocument();
    });
  });

  it('charge les séances quand un cinéma est sélectionné', async () => {
    render(
      <BookingModal
        isOpen={true}
        onClose={() => {}}
        movieId={1}
        movieTitle="Film Test"
      />
    );

    await waitFor(() => {
      expect(getShowtimesByScreen).toHaveBeenCalled();
    });

    const startTime = new Date(mockShowtimes[0].startTime);
    const formattedTime = startTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    
    await waitFor(() => {
      expect(screen.getByText(formattedTime)).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('affiche un message quand aucune séance n\'est disponible', async () => {
    (getShowtimesByScreen as jest.Mock).mockResolvedValue({
      success: true,
      data: []
    });

    render(
      <BookingModal
        isOpen={true}
        onClose={() => {}}
        movieId={1}
        movieTitle="Film Test"
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Aucune séance disponible à cette date')).toBeInTheDocument();
    });
  });

  it('affiche la modale de connexion pour un utilisateur non connecté', async () => {
    (useAuth as jest.Mock).mockReturnValue({
      userId: null,
      isSignedIn: false
    });

    render(
      <BookingModal
        isOpen={true}
        onClose={() => {}}
        movieId={1}
        movieTitle="Film Test"
      />
    );

    const startTime = new Date(mockShowtimes[0].startTime);
    const formattedTime = startTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    
    await waitFor(() => {
      const timeButton = screen.getByText(formattedTime);
      fireEvent.click(timeButton);
      expect(screen.getByText(/connexion/i)).toBeInTheDocument();
    });
  });

  it('gère les erreurs de chargement des séances', async () => {
    (getShowtimesByScreen as jest.Mock).mockRejectedValue(new Error('Erreur de chargement'));

    render(
      <BookingModal
        isOpen={true}
        onClose={() => {}}
        movieId={1}
        movieTitle="Film Test"
      />
    );

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Une erreur est survenue lors du chargement des séances');
    });
  });
}); 
