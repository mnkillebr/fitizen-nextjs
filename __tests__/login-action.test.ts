import { jest } from '@jest/globals';
import { login, googleSignIn } from '../app/actions/login-action';
import { createClient } from '../app/lib/supabase.server';
import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server';

// Mock the required modules
jest.mock('../app/lib/supabase.server', () => ({
  createClient: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}));

jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn().mockImplementation((data, init) => ({
      ...((typeof data === 'object' && data) || {}),
      ...((typeof init === 'object' && init) || {}),
    })),
  },
}));

jest.mock('../app/lib/magic-link.server', () => ({
  generateMagicLink: jest.fn().mockResolvedValue('http://test-magic-link.com') as unknown as jest.Mock,
  sendMagicLinkEmail: jest.fn().mockResolvedValue(true) as unknown as jest.Mock,
}));

jest.mock('../app/lib/sessions', () => ({
  createNonce: jest.fn().mockResolvedValue(true) as unknown as jest.Mock,
}));

// Mock Supabase client
const mockSupabase = {
  auth: {
    signInWithOAuth: jest.fn(),
  },
};

(createClient as jest.Mock).mockReturnValue(mockSupabase);

describe('Login Actions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should return success when email is valid', async () => {
      const formData = new FormData();
      formData.append('email', 'test@example.com');

      const result = await login(null, formData);

      expect(result).toEqual({
        success: 'Magic link sent to email',
      });
    });

    it('should return errors when email is invalid', async () => {
      const formData = new FormData();
      formData.append('email', 'invalid-email');

      const result = await login(null, formData);

      expect(result).toHaveProperty('errors');
      expect(result.errors).toHaveProperty('email');
    });

    it('should handle server errors gracefully', async () => {
      jest.spyOn(console, 'error').mockImplementation(() => {});
      const formData = new FormData();
      formData.append('email', 'test@example.com');

      // Mock a failure in generateMagicLink
      jest.spyOn(require('../app/lib/magic-link.server'), 'generateMagicLink')
        .mockRejectedValueOnce(new Error('Test error'));

      const result = await login(null, formData);

      expect(result).toEqual({
        server_error: 'An unexpected error occurred. Please try again later.',
      });
    });
  });

  describe('googleSignIn', () => {
    it('should redirect to Supabase URL on successful sign-in', async () => {
      (mockSupabase.auth.signInWithOAuth as jest.Mock).mockResolvedValue({
        data: { url: 'http://supabase-redirect-url.com' },
        error: null,
      });

      await googleSignIn();

      expect(redirect).toHaveBeenCalledWith('http://supabase-redirect-url.com');
    });

    it('should handle Supabase auth errors', async () => {
      (mockSupabase.auth.signInWithOAuth as jest.Mock).mockResolvedValue({
        data: null,
        error: { message: 'Auth error' },
      });

      const result = await googleSignIn();

      expect(result).toEqual({
        error: 'Auth error',
        status: 400,
      });
    });

    it('should handle unexpected errors gracefully', async () => {
      (mockSupabase.auth.signInWithOAuth as jest.Mock).mockRejectedValue(new Error('Unexpected error'));
      jest.spyOn(console, 'error').mockImplementation(() => {});

      const result = await googleSignIn();

      expect(result).toEqual({
        server_error: 'An unexpected error occurred during Google sign-in. Please try again later.',
      });
    });
  });
}); 