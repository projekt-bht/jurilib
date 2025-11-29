import { render, screen, waitFor } from '@testing-library/react';

import { ProblemSearchField } from './ProblemSearchField';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('Test LandingPage', () => {
  it('renders the component text', async () => {
    await waitFor(async () => {
      render(<ProblemSearchField />);
      expect(screen.getByText(/Passende Lösung finden/i)).toBeInTheDocument();
    })
  });
});
