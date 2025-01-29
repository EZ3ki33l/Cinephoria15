import { updateFavoriteCinema, getUserFavoriteCinema } from '../user';
import { prisma } from '@/db/db';
import { createMockAuth } from "@/app/_lib/test-utils";

interface MockUser {
  id: string;
  favoriteCinemaId: number | null;
}

// Mocks
jest.mock('@/db/db', () => ({
  prisma: {
    user: {
      update: jest.fn(),
      findUnique: jest.fn(),
    },
  },
}));

const mockedAuth = jest.fn();
jest.mock("@clerk/nextjs", () => ({
  auth: () => mockedAuth(),
}));

describe('Actions utilisateur', () => {
  const mockUserId = 'user-123';
  const mockCinemaId = 1;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('updateFavoriteCinema', () => {
    it('met à jour le cinéma favori pour un utilisateur connecté', async () => {
      mockedAuth.mockResolvedValue(createMockAuth(mockUserId));
      (prisma.user.update as jest.Mock).mockResolvedValue({
        id: mockUserId,
        favoriteCinemaId: mockCinemaId,
      } as MockUser);

      await updateFavoriteCinema(mockCinemaId);

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: mockUserId },
        data: { favoriteCinemaId: mockCinemaId },
      });
    });

    it('lance une erreur si l\'utilisateur n\'est pas connecté', async () => {
      mockedAuth.mockResolvedValue(createMockAuth(null));

      await expect(updateFavoriteCinema(mockCinemaId)).rejects.toThrow('Non autorisé');
      expect(prisma.user.update).not.toHaveBeenCalled();
    });

    it('propage les erreurs de la base de données', async () => {
      mockedAuth.mockResolvedValue(createMockAuth(mockUserId));
      (prisma.user.update as jest.Mock).mockRejectedValue(new Error('Erreur DB'));

      await expect(updateFavoriteCinema(mockCinemaId)).rejects.toThrow('Erreur DB');
    });
  });

  describe('getUserFavoriteCinema', () => {
    it('retourne le cinéma favori pour un utilisateur connecté', async () => {
      mockedAuth.mockResolvedValue(createMockAuth(mockUserId));
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        favoriteCinemaId: mockCinemaId,
      } as MockUser);

      const result = await getUserFavoriteCinema();

      expect(result).toBe(mockCinemaId);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: mockUserId },
        select: { favoriteCinemaId: true },
      });
    });

    it('retourne null si l\'utilisateur n\'est pas connecté', async () => {
      mockedAuth.mockResolvedValue(createMockAuth(null));

      const result = await getUserFavoriteCinema();

      expect(result).toBeNull();
      expect(prisma.user.findUnique).not.toHaveBeenCalled();
    });

    it('retourne null si l\'utilisateur n\'a pas de cinéma favori', async () => {
      mockedAuth.mockResolvedValue(createMockAuth(mockUserId));
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        favoriteCinemaId: null,
      } as MockUser);

      const result = await getUserFavoriteCinema();

      expect(result).toBeNull();
    });

    it('gère les erreurs de la base de données', async () => {
      mockedAuth.mockResolvedValue(createMockAuth(mockUserId));
      (prisma.user.findUnique as jest.Mock).mockRejectedValue(new Error('Erreur DB'));

      await expect(getUserFavoriteCinema()).rejects.toThrow('Erreur DB');
    });
  });
}); 