import { render, screen } from '@testing-library/react';
import { Unauthorized } from '../unauthorized';
import { Role } from '@/utils/types';

// Mock des composants externes
jest.mock('@clerk/nextjs', () => ({
  SignInButton: ({ children }: { children: React.ReactNode }) => (
    <button data-testid="sign-in-button">{children}</button>
  ),
  SignUpButton: ({ children }: { children: React.ReactNode }) => (
    <button data-testid="sign-up-button">{children}</button>
  ),
}));

// Mock de framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock du composant GlitchText
jest.mock('../_components/GlitchText', () => ({
  GlitchText: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// Mock du type Role
jest.mock('@/utils/types', () => ({
  Role: {
    USER: 'user',
    ADMIN: 'admin',
    MANAGER: 'manager'
  }
}));

const defaultProps = {
  role: 'user' as Role,
  isOpen: true,
  onClose: jest.fn(),
  uid: "test-uid"
};

describe('Unauthorized Component', () => {
  it('affiche le message d\'accès non autorisé', () => {
    render(<Unauthorized {...defaultProps} />);
    expect(screen.getByText(/accès non autorisé/i)).toBeInTheDocument();
  });

  it('affiche les boutons de connexion et d\'inscription', () => {
    render(<Unauthorized {...defaultProps} />);
    expect(screen.getByTestId('sign-in-button')).toBeInTheDocument();
    expect(screen.getByTestId('sign-up-button')).toBeInTheDocument();
  });

  it('affiche le rôle requis', () => {
    render(<Unauthorized {...defaultProps} />);
    expect(screen.getByText('user')).toBeInTheDocument();
  });

  it('appelle onClose quand le bouton est cliqué', () => {
    render(<Unauthorized {...defaultProps} />);
    const closeButton = screen.getByRole('button', { name: /fermer/i });
    closeButton.click();
    expect(defaultProps.onClose).toHaveBeenCalled();
  });
}); 