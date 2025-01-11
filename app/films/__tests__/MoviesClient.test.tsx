import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MoviesClient } from '../_components/MoviesClient';
import { getUserFavoriteCinema } from '@/app/_actions/user';
import { Movie, Genre } from '@prisma/client';

// Mocks
jest.mock('@/app/_actions/user', () => ({
  getUserFavoriteCinema: jest.fn(),
}));

jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

const mockMovies = [
  {
    id: 1,
    title: 'Test Movie 1',
    summary: 'Test Summary 1',
    releaseDate: new Date(),
    duration: 120,
    images: ['test-image-1.jpg'],
    director: 'Test Director',
    trailer: 'test-trailer-1.mp4',
    lovedByTeam: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    genres: [{ id: 1, name: 'Action', movieId: 1 }],
  },
  {
    id: 2,
    title: 'Test Movie 2',
    summary: 'Test Summary 2',
    releaseDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 jours avant
    duration: 90,
    images: ['test-image-2.jpg'],
    director: 'Test Director 2',
    trailer: 'test-trailer-2.mp4',
    lovedByTeam: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    genres: [{ id: 2, name: 'Comédie', movieId: 2 }],
  },
] as (Movie & { genres: Genre[] })[];

const mockGenres = [
  { id: 1, name: 'Action', movieId: null },
  { id: 2, name: 'Comédie', movieId: null },
] as Genre[];

const mockCinemas = [
  {
    id: 1,
    name: 'Cinéma Test',
    addressId: 1,
    isOpen: true,
    managerId: '1',
    description: 'Test Description',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

describe('MoviesClient', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getUserFavoriteCinema as jest.Mock).mockResolvedValue(1);
  });

  it('affiche la liste des films', () => {
    render(
      <MoviesClient
        initialMovies={mockMovies}
        initialGenres={mockGenres}
        cinemas={mockCinemas}
      />
    );

    expect(screen.getByText('Test Movie 1')).toBeInTheDocument();
    expect(screen.getByText('Test Movie 2')).toBeInTheDocument();
  });

  it('filtre les films par genre', async () => {
    render(
      <MoviesClient
        initialMovies={mockMovies}
        initialGenres={mockGenres}
        cinemas={mockCinemas}
      />
    );

    const genreSelect = screen.getByRole('combobox');
    fireEvent.click(genreSelect);
    
    await waitFor(() => {
      const actionOption = screen.getByText('Action');
      fireEvent.click(actionOption);
    });

    expect(screen.getByText('Test Movie 1')).toBeInTheDocument();
    expect(screen.queryByText('Test Movie 2')).not.toBeInTheDocument();
  });

  it('filtre les nouveautés', () => {
    render(
      <MoviesClient
        initialMovies={mockMovies}
        initialGenres={mockGenres}
        cinemas={mockCinemas}
      />
    );

    const nouveautesCheckbox = screen.getByRole('checkbox', { name: /nouveautés/i });
    fireEvent.click(nouveautesCheckbox);

    expect(screen.getByText('Test Movie 1')).toBeInTheDocument();
    expect(screen.queryByText('Test Movie 2')).not.toBeInTheDocument();
  });

  it('affiche un message quand aucun film ne correspond aux critères', async () => {
    render(
      <MoviesClient
        initialMovies={[]}
        initialGenres={mockGenres}
        cinemas={mockCinemas}
      />
    );

    expect(screen.getByText('Aucun film ne correspond à vos critères')).toBeInTheDocument();
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
    });
  });
}); 