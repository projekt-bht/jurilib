import { jest } from '@jest/globals';
import { render, screen } from '@testing-library/react';

import { Profile } from '@/app/organization/_components/Profile';
import type { Organization } from '~/generated/prisma/client';

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

describe('Profile', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders organization profile component by id', () => {
    render(<Profile {...mockOrganization} />);
    expect(document.getElementById(`${mockOrganization.id}_Profile`)).toBeInTheDocument();
  });

  it('renders profile info component by id', () => {
    render(<Profile {...mockOrganization} />);
    expect(document.getElementById(`${mockOrganization.id}_ProfileInfos`)).toBeInTheDocument();
  });

  it('renders description section by id', () => {
    render(<Profile {...mockOrganization} />);
    expect(document.getElementById(`${mockOrganization.id}_Description`)).toBeInTheDocument();
  });

  it('renders employees section by id', () => {
    render(<Profile {...mockOrganization} />);
    expect(document.getElementById(`${mockOrganization.id}_Employees`)).toBeInTheDocument();
  });

  it('renders organization name', () => {
    render(<Profile {...mockOrganization} />);
    expect(screen.getByText('Rechtsberatum München')).toBeInTheDocument();
  });

  it('renders organization description', () => {
    render(<Profile {...mockOrganization} />);
    expect(
      screen.getByText('In Ansprechpartner für Arbeitsrecht und Vertragsrecht.')
    ).toBeInTheDocument();
  });

  it('renders organization short description', () => {
    render(<Profile {...mockOrganization} />);
    expect(screen.getByText('test.')).toBeInTheDocument();
  });

  it('renders expertise area', () => {
    render(<Profile {...mockOrganization} />);
    expect(screen.getByText('Arbeitsrecht')).toBeInTheDocument();
  });

  it('renders organization type badge', () => {
    render(<Profile {...mockOrganization} />);
    expect(screen.getByText('Kanzlei')).toBeInTheDocument();
  });

  it('renders website info', () => {
    render(<Profile {...mockOrganization} />);
    expect(screen.getByText(mockOrganization.website!)).toBeInTheDocument();
  });

  it('renders phone info', () => {
    render(<Profile {...mockOrganization} />);
    expect(screen.getByText(mockOrganization.phone!)).toBeInTheDocument();
  });

  it('renders address info', () => {
    render(<Profile {...mockOrganization} />);
    expect(screen.getByText(mockOrganization.address!)).toBeInTheDocument();
  });
});
