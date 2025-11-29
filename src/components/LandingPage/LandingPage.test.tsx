import { render, screen, waitFor } from '@testing-library/react';

import { LandingPage } from './LandingPage';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('Test LandingPage', () => {
  it('renders the component text', async () => {
    await waitFor(async () => {
      render(<LandingPage />);
      expect(screen.getByText(/Beschreibe dein Problem/i)).toBeInTheDocument();
    })
  });
});
