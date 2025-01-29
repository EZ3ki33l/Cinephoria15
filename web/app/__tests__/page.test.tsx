import { render, screen, waitFor } from '@testing-library/react';
import HomePage from '../page';
import { getAllCinemas } from '@/app/(private-access)/administrateur/cinemas/_components/actions';

// Mock des dépendances
jest.mock('@/app/(private-access)/administrateur/cinemas/_components/actions', () => ({
  getAllCinemas: jest.fn(),
}));

jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

jest.mock('@/app/_components/maps/DynamicMap', () => ({
  DynamicMap: () => <div data-testid="dynamic-map">Map Component</div>,
}));

jest.mock('@/app/_components/expandableMovieCard', () => ({
  InfiniteExpandableCards: () => <div data-testid="movie-cards">Movie Cards</div>,
}));

jest.mock('@/app/_components/newsCarousel', () => ({
  NewsCarousel: () => <div data-testid="news-carousel">News Carousel</div>,
}));

describe('HomePage', () => {
  const mockCinemas = [
    {
      id: 1,
      name: 'Cinéma Test',
      Address: { city: 'Paris' },
      Screens: [
        {
          id: 1,
          number: 1,
          Seats: [{ id: 1, row: 'A', column: 1 }],
          ProjectionType: { name: 'Standard' },
          SoundSystemType: { name: 'Dolby' },
        },
      ],
    },
  ];

  beforeEach(() => {
    (getAllCinemas as jest.Mock).mockResolvedValue(mockCinemas);
  });

  it('affiche les sections principales', async () => {
    render(<HomePage />);
    
    await waitFor(() => {
      expect(screen.getByText('Les dernières sorties :')).toBeInTheDocument();
      expect(screen.getByText('Nos cinémas :')).toBeInTheDocument();
      expect(screen.getByText('Nous connaitre :')).toBeInTheDocument();
      expect(screen.getByText('Nos actualités :')).toBeInTheDocument();
    });
  });

  it('affiche les composants enfants', async () => {
    render(<HomePage />);
    
    await waitFor(() => {
      expect(screen.getByTestId('movie-cards')).toBeInTheDocument();
      expect(screen.getByTestId('dynamic-map')).toBeInTheDocument();
      expect(screen.getByTestId('news-carousel')).toBeInTheDocument();
    });
  });

  it('affiche les villes des cinémas', async () => {
    render(<HomePage />);
    
    await waitFor(() => {
      expect(screen.getByText('Paris')).toBeInTheDocument();
    });
  });

  it('affiche les boutons de navigation', async () => {
    render(<HomePage />);
    
    await waitFor(() => {
      expect(screen.getByText('Voir tous les films')).toBeInTheDocument();
      expect(screen.getByText('En voir plus')).toBeInTheDocument();
    });
  });
}); 