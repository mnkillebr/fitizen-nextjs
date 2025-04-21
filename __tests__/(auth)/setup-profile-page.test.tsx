import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

import { registerWithEmail } from '../../app/actions/register-action';
import { redirect } from 'next/navigation';

// Mock the register action
vi.mock('../../app/actions/register-action', () => ({
  registerWithEmail: vi.fn().mockImplementation(() => Promise.resolve({ success: "Registration successful" })),
}));

import SetupProfile from '../../app/(auth)/setup-profile/page';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}));

describe('Setup Profile Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the setup profile form with all required elements', () => {
    render(<SetupProfile />);

    // Check for the title and description
    expect(screen.getByTestId('setup-profile-title')).toBeInTheDocument();
    expect(screen.getByTestId('setup-profile-description')).toBeInTheDocument();

    // Check for the first name input
    const firstNameInput = screen.getByTestId('first-name-input');
    expect(firstNameInput).toBeInTheDocument();
    expect(firstNameInput).toHaveAttribute('type', 'text');
    expect(firstNameInput).toHaveAttribute('required');

    // Check for the last name input
    const lastNameInput = screen.getByTestId('last-name-input');
    expect(lastNameInput).toBeInTheDocument();
    expect(lastNameInput).toHaveAttribute('type', 'text');
    expect(lastNameInput).toHaveAttribute('required');

    // Check for the sign up button
    expect(screen.getByTestId('signup-button')).toBeInTheDocument();
  });

  it('updates input values when typed', () => {
    render(<SetupProfile />);
    
    const firstNameInput = screen.getByTestId('first-name-input');
    const lastNameInput = screen.getByTestId('last-name-input');
    
    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
    
    expect(firstNameInput).toHaveValue('John');
    expect(lastNameInput).toHaveValue('Doe');
  });

  it('does not submit the form when required fields are empty', async () => {
    render(<SetupProfile />);

    const signupButton = screen.getByTestId('signup-button');
    fireEvent.click(signupButton);

    // Check that the register action is not called
    await waitFor(() => {
      expect(registerWithEmail).not.toHaveBeenCalled();
    });
  });

  it('submits the form with valid data', async () => {
    const mockRegister = vi.mocked(registerWithEmail).mockResolvedValue({
      errors: {
        first_name: undefined,
        last_name: undefined
      }
    });
    render(<SetupProfile />);

    const firstNameInput = screen.getByTestId('first-name-input');
    const lastNameInput = screen.getByTestId('last-name-input');
    const signupButton = screen.getByTestId('signup-button');

    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
    fireEvent.click(signupButton);

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith(
        undefined,
        expect.any(FormData)
      );
    });
  });

  it('handles server errors gracefully', async () => {
    const mockRegister = vi.mocked(registerWithEmail).mockResolvedValue({
      server_error: 'An unexpected error occurred. Please try again later.',
    });
    render(<SetupProfile />);

    // Fill in the name inputs
    const firstNameInput = screen.getByTestId('first-name-input');
    const lastNameInput = screen.getByTestId('last-name-input');
    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    fireEvent.change(lastNameInput, { target: { value: 'Doe' } });

    // Submit the form
    const signupButton = screen.getByTestId('signup-button');
    fireEvent.click(signupButton);

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalled();
      expect(screen.getByTestId('server-error')).toBeInTheDocument();
    });
  });
}); 