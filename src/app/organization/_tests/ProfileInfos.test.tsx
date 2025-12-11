import { jest } from '@jest/globals';
import { render, screen } from '@testing-library/react';

import type { Organization } from '~/generated/prisma/client';

import { ProfileInfos } from '../_components/ProfileInfos';

const mockOrganization: Organization = {
  name: 'Rechtsberatum München',
  id: '1',
  description: 'In Ansprechpartner für Arbeitsrecht und Vertragsrecht.',
  shortDescription: 'test.',
  email: 'contact@rechtsberatum.de',
  phone: '+49 89 1234567',
  address: 'München, Germany',
  website: 'https://rechtsberatum.de',
  expertiseArea: ['Transport- & Speditionsrecht'],
  type: 'LAW_FIRM',
  priceCategory: 'MEDIUM', // Medium pricing is represented by '€€'
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('Organization ProfileInfos Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders organization profile infos component by id', () => {
    render(
      <ProfileInfos
        id={mockOrganization.id}
        website={mockOrganization.website}
        phone={mockOrganization.phone}
        address={mockOrganization.address}
        email={mockOrganization.email}
      />
    );
    expect(document.getElementById(`${mockOrganization.id}_ProfileInfos`)).toBeInTheDocument();
  });

  it('renders organization website', () => {
    render(
      <ProfileInfos
        id={mockOrganization.id}
        website={mockOrganization.website}
        phone={mockOrganization.phone}
        address={mockOrganization.address}
        email={mockOrganization.email}
      />
    );
    expect(screen.getByText('https://rechtsberatum.de')).toBeInTheDocument();
  });

  it('renders organization phone', () => {
    render(
      <ProfileInfos
        id={mockOrganization.id}
        website={mockOrganization.website}
        phone={mockOrganization.phone}
        address={mockOrganization.address}
        email={mockOrganization.email}
      />
    );
    expect(screen.getByText('+49 89 1234567')).toBeInTheDocument();
  });

  it('renders organization address', () => {
    render(
      <ProfileInfos
        id={mockOrganization.id}
        website={mockOrganization.website}
        phone={mockOrganization.phone}
        address={mockOrganization.address}
        email={mockOrganization.email}
      />
    );
    expect(screen.getByText('München, Germany')).toBeInTheDocument();
  });
});
