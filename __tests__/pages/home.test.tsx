import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from '@/app/page';

describe('Home Page', () => {
  it('renders main heading', () => {
    render(<Home />);
    expect(screen.getByRole('heading', { name: /get started/i })).toBeInTheDocument();
  });
}); 