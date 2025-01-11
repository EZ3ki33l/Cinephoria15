import { submitContactForm } from '../actions';
import { prisma } from '@/db/db';

interface ContactFormData {
  nom: string;
  prenom: string;
  email: string;
  motif: string;
  message: string;
}

interface MockContact {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  motif: string;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}

// Mocks
jest.mock('@/db/db', () => ({
  prisma: {
    contact: {
      create: jest.fn(),
    },
  },
}));

const mockSendEmail = jest.fn();
jest.mock('@/app/config/resend', () => ({
  resend: {
    emails: {
      send: mockSendEmail,
    },
  },
}));

describe('Actions du formulaire de contact', () => {
  const mockContactData: ContactFormData = {
    nom: 'Doe',
    prenom: 'John',
    email: 'test@example.com',
    motif: 'Information',
    message: 'Test message',
  };

  const mockContact: MockContact = {
    id: 1,
    ...mockContactData,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('crée un contact et envoie un email de confirmation', async () => {
    (prisma.contact.create as jest.Mock).mockResolvedValue(mockContact);
    mockSendEmail.mockResolvedValue({ id: 'email-123' });

    const result = await submitContactForm(mockContactData);

    expect(result.success).toBe(true);
    expect(prisma.contact.create).toHaveBeenCalledWith({
      data: mockContactData,
    });
    expect(mockSendEmail).toHaveBeenCalled();
  });

  it('gère les erreurs de la base de données', async () => {
    (prisma.contact.create as jest.Mock).mockRejectedValue(new Error('Erreur DB'));

    const result = await submitContactForm(mockContactData);

    expect(result.success).toBe(false);
    expect(result.error).toBe('Une erreur est survenue lors de l\'envoi du message');
  });

  it('gère les erreurs d\'envoi d\'email', async () => {
    (prisma.contact.create as jest.Mock).mockResolvedValue(mockContact);
    mockSendEmail.mockRejectedValue(new Error('Erreur email'));

    const result = await submitContactForm(mockContactData);

    expect(result.success).toBe(false);
    expect(result.error).toBe('Une erreur est survenue lors de l\'envoi du message');
  });
}); 