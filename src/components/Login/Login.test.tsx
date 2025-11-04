import { render, screen } from '@testing-library/react';
import { Login } from './Login';

describe('Test NavBar', () => {
  it('renders the component text', () => {
    render(<Login />);
    expect(screen.getByText(/Einloggen/i)).toBeInTheDocument();
  })
});

