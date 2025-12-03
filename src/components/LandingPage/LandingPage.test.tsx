import { jest } from '@jest/globals';

jest.unstable_mockModule('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

const { render, screen, waitFor } = await import('@testing-library/react');
const { LandingPage } = await import('./LandingPage');

describe('Test LandingPage', () => {
  it('renders the component text', async () => {
    await waitFor(async () => {
      render(<LandingPage />);
      expect(screen.getByText(/Beschreibe dein Problem/i)).toBeInTheDocument();
    })
  });
});
