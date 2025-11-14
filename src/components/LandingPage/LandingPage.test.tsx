import { render, screen } from '@testing-library/react';

import { LandingPage } from './LandingPage';

jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

describe('Test LandingPage', () => {
  it('renders the component text', () => {
    render(<LandingPage />);
    expect(screen.getByText(/Beschreibe dein Problem/i)).toBeInTheDocument();
  });
});

