import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '../../app/(auth)/auth/callback/route';
import { createAuthSession, createSetupProfile } from '../../app/lib/sessions';
import { createClient } from '../../app/lib/supabase.server';
import { getUserByProvider } from '../../models/user.server';
import { redirect } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';
import { SupabaseClient } from '@supabase/supabase-js';

// Mock the dependencies
vi.mock('../../app/lib/sessions', () => ({
  createAuthSession: vi.fn(),
  createSetupProfile: vi.fn(),
}));

vi.mock('../../app/lib/supabase.server', () => ({
  createClient: vi.fn(),
}));

vi.mock('../../models/user.server', () => ({
  getUserByProvider: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}));

describe('Auth Callback Route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('redirects to login if code is missing', async () => {
    const request = new NextRequest('http://localhost/api/auth/callback');
    const response = await GET(request);

    expect(redirect).toHaveBeenCalledWith('/login?error=Missing authorization code');
  });

  it('handles successful code exchange and existing user', async () => {
    const request = new NextRequest('http://localhost/api/auth/callback?code=valid-code');
    const mockClient = {
      auth: {
        exchangeCodeForSession: vi.fn().mockResolvedValue({
          data: { user: { email: 'test@example.com', id: 'user-id' } },
          error: null
        }),
      },
    };
    vi.mocked(createClient).mockReturnValue(mockClient as unknown as Promise<SupabaseClient>);
    vi.mocked(getUserByProvider).mockResolvedValue([
      { 
        User: {
          id: 'user-id',
          email: 'test@example.com',
          passwordHash: null,
          profilePhotoUrl: null,
          profilePhotoId: null,
          firstName: 'Test',
          lastName: 'User',
          createdAt: new Date(),
          updatedAt: new Date(),
          role: 'user'
        },
        SocialLogin: {
          id: 'social-login-id',
          userId: 'user-id',
          providerUserId: 'user-id',
          provider: 'google',
        }
      }
    ]);

    const response = await GET(request);

    expect(createAuthSession).toHaveBeenCalledWith({ id: 'user-id' });
    expect(response).toEqual(NextResponse.redirect('http://localhost/dashboard'));
  });

  it('handles code exchange error', async () => {
    const request = new NextRequest('http://localhost/api/auth/callback?code=invalid-code');
    const mockClient = {
      auth: {
        exchangeCodeForSession: vi.fn().mockResolvedValue({ data: null, error: { message: 'Invalid code' } }),
      },
    };
    vi.mocked(createClient).mockResolvedValue(mockClient as unknown as SupabaseClient);

    const response = await GET(request);

    expect(redirect).toHaveBeenCalledWith('/login?error=Invalid%20code');
  });

  it('handles new user setup', async () => {
    const request = new NextRequest('http://localhost/api/auth/callback?code=valid-code');
    const mockClient = {
      auth: {
        exchangeCodeForSession: vi.fn().mockResolvedValue({ data: { user: { email: 'new@example.com', id: 'new-user-id', app_metadata: { provider: 'google' } } }, error: null }),
      },
    };
    vi.mocked(createClient).mockResolvedValue(mockClient as unknown as SupabaseClient);
    vi.mocked(getUserByProvider).mockResolvedValue([]);

    const response = await GET(request);

    expect(createSetupProfile).toHaveBeenCalledWith({ email: 'new@example.com', provider: 'google', provider_user_id: 'new-user-id' });
    expect(redirect).toHaveBeenCalledWith('/setup-profile');
  });
});