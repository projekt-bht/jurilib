import { Authentication } from './Authentication';

const { render, screen } = await import('@testing-library/react');

describe('Test NavBar', () => {
  it('renders the component text', () => {
    render(<Authentication />);
    expect(screen.getByText(/Einloggen/i)).toBeInTheDocument();
  });
});
