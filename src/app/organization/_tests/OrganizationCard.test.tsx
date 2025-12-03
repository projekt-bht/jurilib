import { jest } from '@jest/globals';
import { render, screen } from '@testing-library/react';

import type { Organization } from '~/generated/prisma/client';

import OrganizationDetail from '../[organizationID]/OrganizationPage';

const mockOrganization: Organization = {
  name: 'Rechtsberatum München',
  id: '1',
  description: 'In Ansprechpartner für Arbeitsrecht und Vertragsrecht.',
  shortDescription: 'test.',
  email: 'contact@rechtsberatum.de',
  password: '2334',
  phone: '+49 89 1234567',
  address: 'München, Germany',
  website: 'https://rechtsberatum.de',
  expertiseArea: ['Arbeitsrecht'],
  type: 'LAW_FIRM',
  priceCategory: 'MEDIUM', // Medium pricing is represented by '€€'
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
    expect(
      screen.getByText('In Ansprechpartner für Arbeitsrecht und Vertragsrecht.')
    ).toBeInTheDocument();
  });

  it('renders organization short description', () => {
    render(<OrganizationDetail {...mockOrganization} />);
    expect(screen.getByText('test.')).toBeInTheDocument();
  });

  it('renders expertise area', () => {
    render(<OrganizationDetail {...mockOrganization} />);
    expect(screen.getByText('Arbeitsrecht')).toBeInTheDocument();
  });
});
