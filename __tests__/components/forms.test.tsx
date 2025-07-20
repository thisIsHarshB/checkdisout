import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProfileForm } from '@/components/forms/ProfileForm';

describe('ProfileForm', () => {
  it('renders with initial data', () => {
    render(
      <ProfileForm
        initialData={{ name: 'Test User', email: 'test@example.com' }}
        onSubmit={jest.fn()}
        onCancel={jest.fn()}
      />
    );
    expect(screen.getByDisplayValue('Test User')).toBeInTheDocument();
    expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument();
  });

  it('shows validation error for empty name', async () => {
    render(
      <ProfileForm
        initialData={{ name: '', email: 'test@example.com' }}
        onSubmit={jest.fn()}
        onCancel={jest.fn()}
      />
    );
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: '' } });
    fireEvent.click(screen.getByText(/save/i));
    expect(await screen.findByText(/name is required/i)).toBeInTheDocument();
  });
}); 