import { render, screen, fireEvent } from '@testing-library/react';
import { Navbar } from '../navBar';
import { useAuth, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

// Mocks
jest.mock('@clerk/nextjs', () => ({
  useAuth: jest.fn(),
  useUser: jest.fn(),
  UserButton: () => <button>User Button</button>,
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('framer-motion', () => ({
  motion: {
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
  },
}));

const mockUser = {
  fullName: 'John Doe',
  username: 'johndoe',
  primaryEmailAddress: {
    emailAddress: 'john@example.com',
  },
};

describe('Navbar', () => {
  const mockSignOut = jest.fn();
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({ signOut: mockSignOut });
    (useUser as jest.Mock).mockReturnValue({ user: mockUser });
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  it('affiche le logo', () => {
    render(<Navbar />);
    expect(screen.getByText('Cinéphoria')).toBeInTheDocument();
  });

  it('affiche les liens principaux', () => {
    render(<Navbar />);
    expect(screen.getByText('Accueil Admin')).toBeInTheDocument();
    expect(screen.getByText('Retour Site')).toBeInTheDocument();
  });

  it('affiche les liens administratifs', () => {
    render(<Navbar />);
    expect(screen.getByText('Administrateurs')).toBeInTheDocument();
    expect(screen.getByText('Managers')).toBeInTheDocument();
    expect(screen.getByText('Cinémas')).toBeInTheDocument();
    expect(screen.getByText('Films')).toBeInTheDocument();
    expect(screen.getByText('Paramètres')).toBeInTheDocument();
  });

  it('affiche les informations de l\'utilisateur', () => {
    render(<Navbar />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('gère la déconnexion', async () => {
    render(<Navbar />);
    const logoutButton = screen.getByText('Déconnexion');
    
    fireEvent.click(logoutButton);

    expect(mockSignOut).toHaveBeenCalled();
    expect(mockPush).toHaveBeenCalledWith('/');
  });

  it('n\'affiche pas les sous-liens quand la barre est fermée', () => {
    render(<Navbar />);
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
    expect(screen.queryByText('Créer')).not.toBeInTheDocument();
  });

  it('affiche les sous-liens quand on clique sur un lien parent', () => {
    render(<Navbar />);
    
    // Ouvrir la barre latérale
    const cinemaLink = screen.getByText('Cinémas');
    fireEvent.click(cinemaLink);

    expect(screen.getAllByText('Dashboard')).toHaveLength(1);
    expect(screen.getByText('Créer')).toBeInTheDocument();
  });

  it('applique la classe personnalisée', () => {
    const { container } = render(<Navbar className="test-class" />);
    expect(container.firstChild).toHaveClass('test-class');
  });

  it('gère l\'absence d\'informations utilisateur', () => {
    (useUser as jest.Mock).mockReturnValue({
      user: {
        ...mockUser,
        fullName: null,
        primaryEmailAddress: null,
      },
    });

    render(<Navbar />);
    expect(screen.getByText('johndoe')).toBeInTheDocument();
  });
}); 