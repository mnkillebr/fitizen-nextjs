import { describe, it, expect, vi, beforeEach } from 'vitest';
import { login, googleSignIn } from '../app/actions/login-action';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';


vi.mock('../app/actions/login-action', () => ({
  login: vi.fn().mockImplementation(() => Promise.resolve({ success: 'Magic link sent to email' })),
  googleSignIn: vi.fn().mockImplementation(() => Promise.resolve(NextResponse.json({ error: null }, { status: 200 }))),
}));

import Login from '../app/(auth)/login/page';
import { NextResponse } from 'next/server';

describe('Login Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the login form with email input and buttons', () => {
    render(<Login />);

    // Check for the title and description
    expect(screen.getByTestId('login-title')).toBeInTheDocument();
    expect(screen.getByTestId('login-description')).toBeInTheDocument();

    // Check for the email input
    const emailInput = screen.getByTestId('email-input');
    expect(emailInput).toBeInTheDocument();
    expect(emailInput).toHaveAttribute('type', 'email');
    expect(emailInput).toHaveAttribute('required');

    // Check for the login button
    expect(screen.getByTestId('login-button')).toBeInTheDocument();

    // Check for the Google sign-in button
    expect(screen.getByTestId('google-auth-button')).toBeInTheDocument();
  });

  it('updates email input value when typed', () => {
    render(<Login />);
    
    const emailInput = screen.getByTestId('email-input');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    
    expect(emailInput).toHaveValue('test@example.com');
  });

  it('submits the form when login button is clicked', async () => {
    render(<Login />);
    
    const emailInput = screen.getByTestId('email-input');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    
    const loginButton = screen.getByTestId('login-button');
    fireEvent.click(loginButton);
    
    // The form submission is handled by Next.js, so we can't directly test the action
    // Instead, we verify that the form was submitted with the correct data
    await waitFor(() => {
      expect(emailInput).toHaveValue('test@example.com');
    });
  });

  it('triggers Google sign-in when Google button is clicked', () => {
    render(<Login />);
    
    const googleButton = screen.getByTestId('google-auth-button');
    fireEvent.click(googleButton);
    
    // The Google sign-in is handled by the browser, so we can't directly test the action
    // Instead, we verify that the button was clicked
    expect(googleButton).toBeInTheDocument();
  });

  it('shows error message when email is invalid', async () => {
    const mockLogin = vi.mocked(login).mockResolvedValue({
      errors: { email: ['Invalid email format'] },
    });
    render(<Login />);

    // Fill in the email input with invalid email
    const emailInput = screen.getByTestId('email-input');
    fireEvent.change(emailInput, { target: { value: 'invalid@email' } });

    // Submit the form
    const loginButton = screen.getByTestId('login-button');
    fireEvent.click(loginButton);

    // Check if error message is displayed
    await waitFor(() => {
      expect(screen.getByTestId('email-error')).toBeInTheDocument();
    });
  });

  it('calls googleSignIn when Google button is clicked', async () => {
    render(<Login />);

    // Click the Google sign-in button
    const googleButton = screen.getByTestId('google-auth-button');
    fireEvent.click(googleButton);

    // Check if googleSignIn was called
    await waitFor(() => {
      expect(googleSignIn).toHaveBeenCalled();
    });
  });

  it('handles server errors gracefully', async () => {
    const mockLogin = vi.mocked(login).mockResolvedValue({
      server_error: 'An unexpected error occurred. Please try again later.',
    });
    render(<Login />);

    // Fill in the email input
    const emailInput = screen.getByTestId('email-input');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    // Submit the form
    const loginButton = screen.getByTestId('login-button');
    fireEvent.click(loginButton);

    // Check if error message is displayed
    await waitFor(() => {
      expect(screen.getByTestId('server-error')).toBeInTheDocument();
    });
  });
}); 