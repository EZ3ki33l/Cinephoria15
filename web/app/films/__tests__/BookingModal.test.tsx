import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BookingModal } from '../_components/BookingModal';
import { getAllCinemas } from '@/app/(private-access)/administrateur/cinemas/_components/actions';
import { getShowtimesByScreen } from '@/app/reservation/_components/action';
import { toast } from 'sonner';

jest.mock('@/app/(private-access)/administrateur/cinemas/_components/actions');
jest.mock('@/app/reservation/_components/action');
jest.mock('sonner');

const mockCinemas = [
  {
    id: 1,
    name: 'Cinéma Test',
    address: '123 rue Test',
    city: 'Ville Test',
    latitude: 48.8566,
    longitude: 2.3522,
    screens: [
      {
        id: 1,
        name: 'Salle 1',
        capacity: 100,
      },
    ],
  },
];

const mockShowtimes = [
  {
    id: 1,
    startTime: new Date('2025-01-01T14:30:00'),
    endTime: new Date('2025-01-01T16:30:00'),
    movieId: 1,
    screenId: 1,
    screen: {
      id: 1,
      name: 'Salle 1',
      capacity: 100,
    },
  },
];

describe('BookingModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getAllCinemas as jest.Mock).mockResolvedValue({ success: true, data: mockCinemas });
    (getShowtimesByScreen as jest.Mock).mockResolvedValue({ success: true, data: mockShowtimes });
  });

  it('charge les cinémas au démarrage', async () => {
    render(
      <BookingModal
        movieId={1}
        movieTitle="Film Test"
        isOpen={true}
        onClose={() => {}}
      />
    );

    await waitFor(() => {
      expect(getAllCinemas).toHaveBeenCalled();
    }, { timeout: 2000 });

    await waitFor(() => {
      expect(screen.getByText('Cinéma Test')).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it('affiche la modale de connexion pour un utilisateur non connecté', async () => {
    render(
      <BookingModal
        movieId={1}
        movieTitle="Film Test"
        isOpen={true}
        onClose={() => {}}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Cinéma Test')).toBeInTheDocument();
    }, { timeout: 2000 });

    const timeButton = screen.getByText('14:30');
    fireEvent.click(timeButton);

    await waitFor(() => {
      expect(screen.getByRole('dialog', { name: /connexion/i })).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it('gère les erreurs de chargement des séances', async () => {
    (getShowtimesByScreen as jest.Mock).mockRejectedValue(new Error('Erreur test'));
    
    render(
      <BookingModal
        movieId={1}
        movieTitle="Film Test"
        isOpen={true}
        onClose={() => {}}
      />
    );

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Une erreur est survenue lors du chargement des séances');
    }, { timeout: 2000 });
  });
}); 