import { jest } from '@jest/globals';

jest.unstable_mockModule('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

const { render, screen } = await import('@testing-library/react');
const { Authentication } = await import('./Authentication');
const { LoginContext } = await import('@/app/LoginContext');

describe('Test Authentication', () => {
  it('renders the login button when not logged in', () => {
    render(
      <LoginContext.Provider value={{ login: false, setLogin: jest.fn() }}>
        <Authentication />
      </LoginContext.Provider>
    );
    expect(screen.getByText(/Einloggen/i)).toBeInTheDocument();
  });
});
