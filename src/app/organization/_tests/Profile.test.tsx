import { jest } from '@jest/globals';
import { render, screen } from '@testing-library/react';

import type { Organization } from '~/generated/prisma/client';

import { Profile } from '../_components/Profile';

const mockOrganization: Organization = {
  name: 'Rechtsberatum München',
  id: '1',
  description: 'In Ansprechpartner für Arbeitsrecht und Vertragsrecht.',
  shortDescription: 'test.',
  email: 'contact@rechtsberatum.de',
  phone: '+49 89 1234567',
  address: 'München, Germany',
  website: 'https://rechtsberatum.de',
  expertiseArea: ['Arbeitsrecht'],
  type: 'LAW_FIRM',
  priceCategory: 'MEDIUM',
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('Organization Profile Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders organization profile component by id', () => {
    render(<Profile organization={mockOrganization} />);
    expect(document.getElementById(`${mockOrganization.id}_Profile`)).toBeInTheDocument();
  });

  it('renders profile info component by id', () => {
    render(<Profile organization={mockOrganization} />);
    expect(document.getElementById(`${mockOrganization.id}_ProfileInfos`)).toBeInTheDocument();
  });

  it('renders pricing info component by id', () => {
    render(<Profile organization={mockOrganization} />);
    expect(document.getElementById(`${mockOrganization.id}_PricingInfo`)).toBeInTheDocument();
  });

  it('renders profile description section by id', () => {
    render(<Profile organization={mockOrganization} />);
    expect(document.getElementById(`${mockOrganization.id}_Description`)).toBeInTheDocument();
  });

  it('renders profile employees section by id', () => {
    render(<Profile organization={mockOrganization} />);
    expect(document.getElementById(`${mockOrganization.id}_Employees`)).toBeInTheDocument();
  });

  it('renders profile organization name', () => {
    render(<Profile organization={mockOrganization} />);
    expect(screen.getByText('Rechtsberatum München')).toBeInTheDocument();
  });

  it('renders profile organization description', () => {
    render(<Profile organization={mockOrganization} />);
    expect(
      screen.getByText('In Ansprechpartner für Arbeitsrecht und Vertragsrecht.')
    ).toBeInTheDocument();
  });

  it('renders profile organization short description', () => {
    render(<Profile organization={mockOrganization} />);
    expect(screen.getByText('test.')).toBeInTheDocument();
  });

  it('renders profile expertise area', () => {
    render(<Profile organization={mockOrganization} />);
    expect(screen.getByText('Arbeitsrecht')).toBeInTheDocument();
  });

  it('renders profile organization type badge', () => {
    render(<Profile organization={mockOrganization} />);
    expect(screen.getByText('Kanzlei')).toBeInTheDocument();
  });

  it('renders profile website info', () => {
    render(<Profile organization={mockOrganization} />);
    expect(screen.getByText(mockOrganization.website!)).toBeInTheDocument();
  });

  it('renders profile phone info', () => {
    render(<Profile organization={mockOrganization} />);
    expect(screen.getByText(mockOrganization.phone!)).toBeInTheDocument();
  });

  it('renders profile address info', () => {
    render(<Profile organization={mockOrganization} />);
    expect(screen.getByText(mockOrganization.address!)).toBeInTheDocument();
  });
});
