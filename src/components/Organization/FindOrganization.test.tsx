import { render, screen } from '@testing-library/react';

import { FindOrganization } from './FindOrganization';



jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

describe('Test LandingPage', () => {
  it('renders the component text', () => {
    render(<FindOrganization />);
    expect(screen.getByText(/Passende Lösung finden/i)).toBeInTheDocument();
  });
});

