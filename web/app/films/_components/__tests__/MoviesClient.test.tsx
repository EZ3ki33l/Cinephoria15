import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MoviesClient } from '../MoviesClient';
import { getUserFavoriteCinema } from '@/app/_actions/user';
import type { Movie, Genre } from '@prisma/client';

// Mock des composants UI
jest.mock('@/components/ui/select', () => ({
  Select: ({ children, onValueChange, defaultValue }: any) => (
    <div 
      data-testid="select" 
      onClick={(e: React.MouseEvent<HTMLDivElement>) => {
        const target = e.target as HTMLDivElement;
        onValueChange && onValueChange(defaultValue || target.dataset.value);
      }}
    >
      {children}
    </div>
  ),
  SelectContent: ({ children }: any) => <div data-testid="select-content">{children}</div>,
  SelectTrigger: ({ children }: any) => <div data-testid="select-trigger">{children}</div>,
  SelectValue: ({ children }: any) => <div data-testid="select-value">{children}</div>,
  SelectItem: ({ children, value }: any) => (
    <div data-testid={`select-item-${value}`} data-value={value} onClick={() => {}}>
      {children}
    </div>
  ),
}));

jest.mock('@/components/ui/cardHoverEffect', () => ({
  HoverEffect: ({ items }: any) => (
    <div data-testid="hover-effect">
      {items.map((item: any, index: number) => (
        <div key={index} data-testid="movie-card">
          <h3>{item.title}</h3>
          <p>{item.description}</p>
          {item.onReserve && (
            <button onClick={item.onReserve} data-testid="reserve-button">
              Réserver
            </button>
          )}
        </div>
      ))}
    </div>
  ),
}));

jest.mock('@/app/_actions/user', () => ({
  getUserFavoriteCinema: jest.fn(),
}));

const mockMovies = [
  {
    id: 1,
    title: 'Film Test 1',
    summary: 'Résumé du film 1',
    images: ['image1.jpg'],
    releaseDate: new Date(),
    director: 'Directeur 1',
    duration: 120,
    trailer: 'trailer1.mp4',
    lovedByTeam: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    genres: [{ id: 1, name: 'Action' }]
  },
  {
    id: 2,
    title: 'Film Test 2',
    summary: 'Résumé du film 2',
    images: ['image2.jpg'],
    releaseDate: new Date('2023-01-01'),
    director: 'Directeur 2',
    duration: 110,
    trailer: 'trailer2.mp4',
    lovedByTeam: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    genres: [{ id: 2, name: 'Comédie' }]
  }
] as unknown as (Movie & { genres: Genre[] })[];

const mockGenres = [
  { id: 1, name: 'Action' },
  { id: 2, name: 'Comédie' }
] as Genre[];

const mockCinemas = [
  {
    id: 1,
    name: 'Cinéma Test 1',
    addressId: 1,
    isOpen: true,
    managerId: '1',
    description: 'Description test 1',
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

describe('MoviesClient', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getUserFavoriteCinema as jest.Mock).mockResolvedValue(1);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('affiche la liste des films', async () => {
    render(
      <MoviesClient
        initialMovies={mockMovies}
        initialGenres={mockGenres}
        cinemas={mockCinemas}
      />
    );

    await waitFor(() => {
      expect(screen.getAllByTestId('movie-card')).toHaveLength(2);
    }, { timeout: 5000 });

    expect(screen.getByText('Film Test 1')).toBeInTheDocument();
    expect(screen.getByText('Film Test 2')).toBeInTheDocument();
  });

  it('filtre les films par genre', async () => {
    render(
      <MoviesClient
        initialMovies={mockMovies}
        initialGenres={mockGenres}
        cinemas={mockCinemas}
      />
    );

    await waitFor(() => {
      expect(screen.getAllByTestId('movie-card')).toHaveLength(2);
    }, { timeout: 5000 });

    const select = screen.getByTestId('select');
    fireEvent.click(select);

    const actionItem = screen.getByTestId('select-item-Action');
    fireEvent.click(actionItem);

    await waitFor(() => {
      const movieCards = screen.getAllByTestId('movie-card');
      expect(movieCards).toHaveLength(1);
      expect(screen.getByText('Film Test 1')).toBeInTheDocument();
      expect(screen.queryByText('Film Test 2')).not.toBeInTheDocument();
    }, { timeout: 5000 });
  });

  it('filtre les nouveautés', async () => {
    render(
      <MoviesClient
        initialMovies={mockMovies}
        initialGenres={mockGenres}
        cinemas={mockCinemas}
      />
    );

    await waitFor(() => {
      expect(screen.getAllByTestId('movie-card')).toHaveLength(2);
    }, { timeout: 5000 });

    const nouveautesCheckbox = screen.getByRole('checkbox', { name: /nouveautés/i });
    fireEvent.click(nouveautesCheckbox);

    await waitFor(() => {
      const movieCards = screen.getAllByTestId('movie-card');
      expect(movieCards).toHaveLength(1);
      expect(screen.getByText('Film Test 1')).toBeInTheDocument();
      expect(screen.queryByText('Film Test 2')).not.toBeInTheDocument();
    }, { timeout: 5000 });
  });

  it('affiche un message quand aucun film ne correspond aux critères', async () => {
    render(
      <MoviesClient
        initialMovies={[]}
        initialGenres={mockGenres}
        cinemas={mockCinemas}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Aucun film ne correspond à vos critères')).toBeInTheDocument();
    }, { timeout: 5000 });
  });

  it('charge le cinéma favori au démarrage', async () => {
    render(
      <MoviesClient
        initialMovies={mockMovies}
        initialGenres={mockGenres}
        cinemas={mockCinemas}
      />
    );

    await waitFor(() => {
      expect(getUserFavoriteCinema).toHaveBeenCalled();
    }, { timeout: 5000 });
  });
}); 