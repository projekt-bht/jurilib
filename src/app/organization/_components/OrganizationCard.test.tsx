import { render, screen } from '@testing-library/react';

import type { Organization } from '~/generated/prisma/client';

import OrganizationDetail from './OrganizationDetail';

const mockOrganization: Organization = {
  id: '1',
  name: 'Rechtsberatum München',
  shortDescription: 'Ihr Partner für Arbeitsrecht.',
  description: 'Ihr aller bester Partner für Arbeitsrecht.',
  priceCategory: 'FREE',
  email: 'contact@rechtsberatum.de',
  password: 'hashedPassword123',
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
    render(<OrganizationDetail {...mockOrganization} />);
    expect(screen.getByText('Rechtsberatum München')).toBeInTheDocument();
  });

  it('renders organization description', () => {
    render(<OrganizationDetail {...mockOrganization} />);
    expect(screen.getByText('Ihr aller bester Partner für Arbeitsrecht.')).toBeInTheDocument();
  });

  it('renders organization short description', () => {
    render(<OrganizationDetail {...mockOrganization} />);
    expect(screen.getByText('Ihr Partner für Arbeitsrecht.')).toBeInTheDocument();
  });

  it('renders expertise area', () => {
    render(<OrganizationDetail {...mockOrganization} />);
    expect(screen.getByText('Arbeitsrecht')).toBeInTheDocument();
  });

  it('renders pricing placeholder', () => {
    render(<OrganizationDetail {...mockOrganization} />);
    expect(screen.getByText('FREE')).toBeInTheDocument();
  });
});
