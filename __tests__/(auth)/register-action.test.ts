import { describe, it, expect, vi, beforeEach } from 'vitest';
import { registerWithEmail } from '../../app/actions/register-action';
import { createUser, createUserWithProvider } from '../../models/user.server';
import { decrypt, deleteSetupProfile, deleteNonce, createAuthSession } from '../../app/lib/sessions';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

// Mock the dependencies
vi.mock('../../models/user.server', () => ({
  createUser: vi.fn(),
  createUserWithProvider: vi.fn(),
}));

vi.mock('../../app/lib/sessions', () => ({
  decrypt: vi.fn(),
  deleteSetupProfile: vi.fn(),
  deleteNonce: vi.fn(),
  createAuthSession: vi.fn(),
}));

vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}));

describe('Register Action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return validation errors for invalid input', async () => {
    const formData = new FormData();
    formData.append('first_name', '');
    formData.append('last_name', '');

    const result = await registerWithEmail(undefined, formData);

    expect(result).toEqual({
      errors: {
        first_name: expect.any(Array),
        last_name: expect.any(Array),
      },
    });
  });

  it('should create a user with email and redirect to dashboard', async () => {
    // Mock the setup profile cookie
    const mockSetupProfile = {
      email: 'test@example.com',
    };
    vi.mocked(cookies).mockReturnValue({
      get: () => ({ value: 'mock-cookie-value' }),
    } as any);
    vi.mocked(decrypt).mockResolvedValue(mockSetupProfile);
    vi.mocked(createUser).mockResolvedValue([{
      id: '123',
      email: 'test@example.com',
      passwordHash: null,
      profilePhotoUrl: null,
      profilePhotoId: null,
      firstName: 'John',
      lastName: 'Doe',
      createdAt: new Date(),
      updatedAt: new Date(),
      role: 'user'
    }]);

    const formData = new FormData();
    formData.append('first_name', 'John');
    formData.append('last_name', 'Doe');

    await registerWithEmail(undefined, formData);

    expect(createUser).toHaveBeenCalledWith(
      'test@example.com',
      'John',
      'Doe'
    );
    expect(deleteSetupProfile).toHaveBeenCalled();
    expect(deleteNonce).toHaveBeenCalled();
    expect(createAuthSession).toHaveBeenCalledWith({ id: '123' });
    expect(redirect).toHaveBeenCalledWith('/dashboard');
  });

  it('should create a user with provider and redirect to dashboard', async () => {
    // Mock the setup profile cookie with provider data
    const mockSetupProfile = {
      email: 'test@example.com',
      provider: 'google',
      provider_user_id: 'google123',
    };
    vi.mocked(cookies).mockReturnValue({
      get: () => ({ value: 'mock-cookie-value' }),
    } as any);
    vi.mocked(decrypt).mockResolvedValue(mockSetupProfile);
    vi.mocked(createUserWithProvider).mockResolvedValue({
      user: {
        id: '123',
        email: 'test@example.com',
        passwordHash: null,
        profilePhotoUrl: null,
        profilePhotoId: null,
        firstName: 'John',
        lastName: 'Doe',
        createdAt: new Date(),
        updatedAt: new Date(),
        role: 'user'
      },
      socialLogin: {
        rows: [],
        rowCount: 0,
        command: 'SELECT',
        oid: 0,
        fields: []
      }
    });

    const formData = new FormData();
    formData.append('first_name', 'John');
    formData.append('last_name', 'Doe');

    await registerWithEmail(undefined, formData);

    expect(createUserWithProvider).toHaveBeenCalledWith(
      'test@example.com',
      'John',
      'Doe',
      'google',
      'google123'
    );
    expect(deleteSetupProfile).toHaveBeenCalled();
    expect(deleteNonce).toHaveBeenCalled();
    expect(createAuthSession).toHaveBeenCalledWith({ id: '123' });
    expect(redirect).toHaveBeenCalledWith('/dashboard');
  });

  it('should handle server errors gracefully', async () => {
    // Mock the setup profile cookie
    const mockSetupProfile = {
      email: 'test@example.com',
    };
    vi.mocked(cookies).mockReturnValue({
      get: () => ({ value: 'mock-cookie-value' }),
    } as any);
    vi.mocked(decrypt).mockResolvedValue(mockSetupProfile);
    vi.mocked(createUser).mockRejectedValue(new Error('Database error'));

    const formData = new FormData();
    formData.append('first_name', 'John');
    formData.append('last_name', 'Doe');

    const result = await registerWithEmail(undefined, formData);

    expect(result).toEqual({
      server_error: 'An unexpected error occurred. Please try again later.',
    });
  });
}); 