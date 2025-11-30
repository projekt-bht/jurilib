import { jest } from '@jest/globals';

jest.unstable_mockModule('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

const { render, screen } = await import('@testing-library/react');
const { LandingPage } = await import('./LandingPage');

describe('Test LandingPage', () => {
  it('renders the component text', () => {
    render(<LandingPage />);
    expect(screen.getByText(/Beschreibe dein Problem/i)).toBeInTheDocument();
  });
});
