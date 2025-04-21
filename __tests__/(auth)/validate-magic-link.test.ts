import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '../../app/(auth)/validate-magic-link/route';
import { validateMagicLinkUser } from '../../app/lib/dal';
import { getMagicLinkPayloadByRequest } from '../../app/lib/magic-link.server';
import { createSetupProfile } from '../../app/lib/sessions';
import { NextRequest } from 'next/server';
import { redirect } from 'next/navigation';

// Mock the dependencies
vi.mock('../../app/lib/dal', () => ({
  validateMagicLinkUser: vi.fn(),
}));

vi.mock('../../app/lib/magic-link.server', () => ({
  getMagicLinkPayloadByRequest: vi.fn(),
}));

vi.mock('../../app/lib/sessions', () => ({
  createSetupProfile: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}));

describe('Validate Magic Link Route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('redirects to dashboard if user exists', async () => {
    const request = new NextRequest('http://localhost/api/validate-magic-link');
    vi.mocked(getMagicLinkPayloadByRequest).mockResolvedValue({
      email: 'existing@example.com',
      nonce: '123',
      createdAt: new Date().toISOString()
    });
    vi.mocked(validateMagicLinkUser).mockResolvedValue({
      id: 'user-id',
      email: 'existing@example.com',
      passwordHash: null,
      profilePhotoUrl: null,
      profilePhotoId: null,
      firstName: 'Test',
      lastName: 'User', 
      createdAt: new Date(),
      updatedAt: new Date(),
      role: 'user'
    });

    await GET(request);

    expect(validateMagicLinkUser).toHaveBeenCalledWith('existing@example.com');
    expect(redirect).toHaveBeenCalledWith('/dashboard');
  });

  it('creates setup profile and redirects to setup-profile if user does not exist', async () => {
    const request = new NextRequest('http://localhost/api/validate-magic-link');
    vi.mocked(getMagicLinkPayloadByRequest).mockResolvedValue({
      email: 'new@example.com',
      nonce: '123',
      createdAt: new Date().toISOString()
    });
    vi.mocked(validateMagicLinkUser).mockResolvedValue({
      id: 'user-id',
      email: 'existing@example.com',
      passwordHash: null,
      profilePhotoUrl: null,
      profilePhotoId: null,
      firstName: 'Test',
      lastName: 'User', 
      createdAt: new Date(),
      updatedAt: new Date(),
      role: 'user'
    });

    await GET(request);

    expect(createSetupProfile).toHaveBeenCalledWith({ email: 'new@example.com' });
    expect(redirect).toHaveBeenCalledWith('/setup-profile');
  });
});