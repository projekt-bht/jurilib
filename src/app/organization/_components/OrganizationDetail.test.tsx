import { render, screen } from '@testing-library/react';

import type { Organization } from '~/generated/prisma/client';

import OrganizationCard from './OrganizationCard';

const mockOrganization: Organization = {
  id: '1',
  name: 'Rechtsberatum München',
  password: 'securepassword',
  shortDescription: 'Ihr Partner für Arbeitsrecht.',
  description: 'Ihr aller bester Partner für Arbeitsrecht.',
  priceCategory: 'FREE',
  email: 'contact@rechtsberatum.de',
  phone: '+49 89 1234567',
  address: 'München, Germany',
  website: 'https://rechtsberatum.de',
  expertiseArea: ['Arbeitsrecht'],
  type: 'LAW_FIRM',
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('OrganizationCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders organization name', () => {
    render(<OrganizationCard {...mockOrganization} />);
    expect(screen.getByText('Rechtsberatum München')).toBeInTheDocument();
  });

  it('renders organization description', () => {
    render(<OrganizationCard {...mockOrganization} />);
    expect(screen.getByText('Ihr Partner für Arbeitsrecht.')).toBeInTheDocument();
  });

  it('renders organization short description', () => {
    render(<OrganizationCard {...mockOrganization} />);
    expect(screen.getByText('Ihr Partner für Arbeitsrecht.')).toBeInTheDocument();
  });

  it('renders expertise area', () => {
    render(<OrganizationCard {...mockOrganization} />);
    expect(screen.getByText('Arbeitsrecht')).toBeInTheDocument();
  });

  it('renders pricing placeholder', () => {
    render(<OrganizationCard {...mockOrganization} />);
    expect(screen.getByText('FREE')).toBeInTheDocument();
  });

  it('renders profile button with correct text', () => {
    render(<OrganizationCard {...mockOrganization} />);
    expect(screen.getByRole('button', { name: /zum profil/i })).toBeInTheDocument();
  });

  it('calls router.push when button is clicked', async () => {
    render(<OrganizationCard {...mockOrganization} />);
    const link = screen.getByRole('link', { name: /zum profil/i });
    expect(link).toHaveAttribute('href', `/organization/${mockOrganization.id}`);
  });
});
