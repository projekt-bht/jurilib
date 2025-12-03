import { jest } from '@jest/globals';

jest.unstable_mockModule('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// wichtige Regel für ESM: alle Imports NACH den Mocks als Konstanten!
const { render, screen } = await import('@testing-library/react');
const { ProblemSearchField } = await import('./ProblemSearchField');

describe('Test LandingPage', () => {
  it('renders the component text', async () => {
    await waitFor(async () => {
      render(<ProblemSearchField />);
      expect(screen.getByText(/Passende Lösung finden/i)).toBeInTheDocument();
    })
  });
});
