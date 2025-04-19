import { describe, it, expect, vi, beforeEach } from 'vitest';
import { login, googleSignIn } from '../app/actions/login-action';
import { createClient } from '../app/lib/supabase.server';
import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server';
import { SupabaseClient } from '@supabase/supabase-js';

// Mock the required modules
vi.mock('../app/lib/supabase.server', () => ({
  createClient: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}));

vi.mock('next/server', () => ({
  NextResponse: {
    json: vi.fn().mockImplementation((data, init) => ({
      ...((typeof data === 'object' && data) || {}),
      ...((typeof init === 'object' && init) || {}),
    })),
  },
}));

vi.mock('../app/lib/magic-link.server', () => ({
  generateMagicLink: vi.fn().mockResolvedValue('http://test-magic-link.com'),
  sendMagicLinkEmail: vi.fn().mockResolvedValue(true),
}));

vi.mock('../app/lib/sessions', () => ({
  createNonce: vi.fn().mockResolvedValue(true),
}));

describe('Login Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
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
      vi.spyOn(console, 'error').mockImplementation(() => {});
      const formData = new FormData();
      formData.append('email', 'test@example.com');

      // Mock a failure in generateMagicLink
      vi.spyOn(await import('../app/lib/magic-link.server'), 'generateMagicLink')
        .mockRejectedValueOnce(new Error('Test error'));

      const result = await login(null, formData);

      expect(result).toEqual({
        server_error: 'An unexpected error occurred. Please try again later.',
      });
    });
  });

  describe('googleSignIn', () => {
    it('should redirect to Supabase URL on successful sign-in', async () => {
      const mockSupabase = {
        auth: {
          signInWithOAuth: vi.fn().mockResolvedValue({
            data: { url: 'http://supabase-redirect-url.com' },
            error: null,
          }),
        },
        supabaseUrl: 'http://test-supabase-url.com',
        supabaseKey: 'test-key',
        realtime: {},
        realtimeUrl: 'http://test-realtime-url.com',
      } as unknown as SupabaseClient;

      vi.mocked(createClient).mockResolvedValue(mockSupabase);

      await googleSignIn();

      expect(redirect).toHaveBeenCalledWith('http://supabase-redirect-url.com');
    });

    it('should handle Supabase auth errors', async () => {
      const mockSupabase = {
        auth: {
          signInWithOAuth: vi.fn().mockResolvedValue({
            data: null,
            error: { message: 'Auth error' },
          }),
        },
        supabaseUrl: 'http://test-supabase-url.com',
        supabaseKey: 'test-key',
        realtime: {},
        realtimeUrl: 'http://test-realtime-url.com',
      } as unknown as SupabaseClient;

      vi.mocked(createClient).mockResolvedValue(mockSupabase);

      const result = await googleSignIn();

      expect(result).toEqual({
        error: 'Auth error',
        status: 400,
      });
    });

    it('should handle unexpected errors gracefully', async () => {
      const mockSupabase = {
        auth: {
          signInWithOAuth: vi.fn().mockRejectedValue(new Error('Unexpected error')),
        },
        supabaseUrl: 'http://test-supabase-url.com',
        supabaseKey: 'test-key',
        realtime: {},
        realtimeUrl: 'http://test-realtime-url.com',
      } as unknown as SupabaseClient;

      vi.mocked(createClient).mockResolvedValue(mockSupabase);
      vi.spyOn(console, 'error').mockImplementation(() => {});

      const result = await googleSignIn();

      expect(result).toEqual({
        server_error: 'An unexpected error occurred during Google sign-in. Please try again later.',
      });
    });
  });
}); 