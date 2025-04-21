import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AuthLayout from '../../app/(auth)/layout';

describe('Login Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the auth layout with children and dark mode toggle', () => {
    render(
      <AuthLayout>
        <div>Test</div>
      </AuthLayout>
    );

    expect(screen.getByTestId('dark-mode-toggle')).toBeInTheDocument();
  });
});