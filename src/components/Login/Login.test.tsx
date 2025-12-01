import { jest } from '@jest/globals';

jest.unstable_mockModule('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  }),
}));

// ESM requires awaiting imports after mocks are registered
const { render, screen } = await import('@testing-library/react');
const { Login } = await import('./Login');

describe('Test NavBar', () => {
  it('renders the component text', () => {
    render(<Login />);
    expect(screen.getByText(/Registrieren/i)).toBeInTheDocument();
  });
});
