import { jest } from '@jest/globals';

jest.unstable_mockModule('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

const { render, screen } = await import('@testing-library/react');
const { Authentication } = await import('./Authentication');

describe('Test NavBar', () => {
  it('renders the component text', () => {
    render(<Authentication />);
    expect(screen.getByText(/Einloggen/i)).toBeInTheDocument();
  });
});
