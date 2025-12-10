import { jest } from '@jest/globals';
import { render, screen } from '@testing-library/react';

import type { Organization } from '~/generated/prisma/client';

import { OrganizationCard } from '../_components/OrganizationCard';

const mockOrganization: Organization = {
  id: '1',
  name: 'Rechtsberatum München',
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

  it('renders organization card by ID', () => {
    render(<OrganizationCard organization={mockOrganization} />);
    expect(document.getElementById('OrganizationCard_1')).toBeInTheDocument();
  });

  it('renders organization name', () => {
    render(<OrganizationCard organization={mockOrganization} />);
    expect(screen.getByText('Rechtsberatum München')).toBeInTheDocument();
  });

  it('renders expertise area', () => {
    render(<OrganizationCard organization={mockOrganization} />);
    expect(screen.getByText('Arbeitsrecht')).toBeInTheDocument();
  });
});
