import { describe, it, expect, vi, beforeEach } from 'vitest';
import { logout } from '../../app/actions/logout-action';
import { deleteAuthSession } from '../../app/lib/sessions';
import { redirect } from 'next/navigation';

// Mock the dependencies
vi.mock('../../app/lib/sessions', () => ({
  deleteAuthSession: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}));

describe('Logout Action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should delete the auth session and redirect to home page', async () => {
    // Call the logout action
    await logout();

    // Verify that deleteAuthSession was called
    expect(deleteAuthSession).toHaveBeenCalled();

    // Verify that redirect was called with the correct path
    expect(redirect).toHaveBeenCalledWith('/');
  });
}); 