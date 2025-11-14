import { render, screen } from '@testing-library/react';

import { Navbar } from './Navbar';

describe('Test NavBar', () => {
  it('renders the component text', () => {
    render(<Navbar />);
    expect(screen.getByText(/JuriLib/i)).toBeInTheDocument();
    expect(screen.getByText(/Organisationen/i)).toBeInTheDocument();
    expect(screen.getByText(/Registrieren/i)).toBeInTheDocument();
    expect(screen.getByText(/Einloggen/i)).toBeInTheDocument();
  })
});
