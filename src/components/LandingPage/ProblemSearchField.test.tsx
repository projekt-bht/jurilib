import { render, screen } from '@testing-library/react';

import { ProblemSearchField } from './ProblemSearchField';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('Test LandingPage', () => {
  it('renders the component text', () => {
    render(<ProblemSearchField />);
    expect(screen.getByText(/Passende Lösung finden/i)).toBeInTheDocument();
  });
});
