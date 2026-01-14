import { jest } from '@jest/globals';
import { render, screen } from '@testing-library/react';

import type { Employee } from '~/generated/prisma/browser';
import { Accessibility, Gender } from '~/generated/prisma/browser';
import type { Organization } from '~/generated/prisma/client';

import { Profile } from '../_components/Profile';

const mockOrganization: Organization = {
  id: '1',
  name: 'Rechtsberatum München',
  shortDescription: 'Ihr Partner für Arbeitsrecht.',
  description: 'Ihr aller bester Partner für Arbeitsrecht.',
  priceCategory: 'FREE',
  type: 'LAW_FIRM',
  email: 'contact@rechtsberatum.de',
  phone: '+49 89 1234567',
  country: 'Germany',
  city: 'Munich',
  zipCode: '80331',
  street: 'Marienplatz',
  houseNumber: '1',
  accessibility: [Accessibility.Parkplätze_vorhanden, Accessibility.Rollstuhlgerecht],
  website: 'https://rechtsberatum.de',
  expertiseAreas: ['Arbeitsrecht'],
  imageUrl: 'https://example.com/image.jpg',
  averageRating: 4.5,
  numberOfRatings: 150,

  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockEmployees: Employee[] = [
  {
    id: 'e1',
    accountId: 'a1',
    firstname: 'Max',
    lastname: 'Mustermann',
    gender: Gender.Mann,
    position: 'Rechtsanwalt',
    organizationId: '1',
    email: 'max.mustermann@rechtsberatum.de',
    languages: ['DEUTSCH', 'ENGLISCH'],
    imageUrl: 'https://example.com/employee1.jpg',
    expertiseAreas: ['Steuerrecht'],
    createdAt: new Date(),
    updatedAt: new Date(),
    phone: '+49 01231231323',
    description: null,
    title: null,
    pronoun: null,
    pronounText: null,
    genderText: null,
  },
];

describe('Organization Profile Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders organization profile component by id', () => {
    render(<Profile organization={mockOrganization} employees={mockEmployees} />);
    expect(document.getElementById(`${mockOrganization.id}_Profile`)).toBeInTheDocument();
  });

  it('renders profile info component by id', () => {
    render(<Profile organization={mockOrganization} employees={mockEmployees} />);
    expect(document.getElementById(`${mockOrganization.id}_ProfileInfos`)).toBeInTheDocument();
  });

  it('renders pricing info component by id', () => {
    render(<Profile organization={mockOrganization} employees={mockEmployees} />);
    expect(document.getElementById(`${mockOrganization.id}_PricingInfo`)).toBeInTheDocument();
  });

  it('renders profile description section by id', () => {
    render(<Profile organization={mockOrganization} employees={mockEmployees} />);
    expect(document.getElementById(`${mockOrganization.id}_Description`)).toBeInTheDocument();
  });

  it('renders profile employees section by id', () => {
    render(<Profile organization={mockOrganization} employees={mockEmployees} />);
    expect(document.getElementById(`${mockOrganization.id}_Employees`)).toBeInTheDocument();
  });

  it('renders profile employee card by id', () => {
    render(<Profile organization={mockOrganization} employees={mockEmployees} />);
    expect(document.getElementById(`${mockEmployees[0].id}_EmployeeCard`)).toBeInTheDocument();
  });

  it('renders employee name in profile', () => {
    render(<Profile organization={mockOrganization} employees={mockEmployees} />);
    expect(screen.getByText('Max Mustermann')).toBeInTheDocument();
  });

  it('renders employee position in profile', () => {
    render(<Profile organization={mockOrganization} employees={mockEmployees} />);
    expect(screen.getByText('Rechtsanwalt')).toBeInTheDocument();
  });

  it('renders profile organization name', () => {
    render(<Profile organization={mockOrganization} employees={mockEmployees} />);
    expect(screen.getByText('Rechtsberatum München')).toBeInTheDocument();
  });

  it('renders profile organization description', () => {
    render(<Profile organization={mockOrganization} employees={mockEmployees} />);
    expect(screen.getByText('Ihr aller bester Partner für Arbeitsrecht.')).toBeInTheDocument();
  });

  it('renders profile organization short description', () => {
    render(<Profile organization={mockOrganization} employees={mockEmployees} />);
    expect(screen.getByText('Ihr Partner für Arbeitsrecht.')).toBeInTheDocument();
  });

  it('renders profile expertise area', () => {
    render(<Profile organization={mockOrganization} employees={mockEmployees} />);
    expect(screen.getAllByText('Steuerrecht')[0]).toBeInTheDocument();
  });

  it('renders profile organization type badge', () => {
    render(<Profile organization={mockOrganization} employees={mockEmployees} />);
    expect(screen.getByText('Kanzlei')).toBeInTheDocument();
  });

  it('renders profile website info', () => {
    render(<Profile organization={mockOrganization} employees={mockEmployees} />);
    expect(screen.getByText(mockOrganization.website!)).toBeInTheDocument();
  });

  it('renders profile phone info', () => {
    render(<Profile organization={mockOrganization} employees={mockEmployees} />);
    expect(screen.getByText(mockOrganization.phone!)).toBeInTheDocument();
  });

  it('renders profile address info', () => {
    render(<Profile organization={mockOrganization} employees={mockEmployees} />);
    expect(
      screen.getByText(
        `${mockOrganization.zipCode} ${mockOrganization.city}, ${mockOrganization.street} ${mockOrganization.houseNumber}`
      )
    ).toBeInTheDocument();
  });

  it('renders profile email info', () => {
    render(<Profile organization={mockOrganization} employees={mockEmployees} />);
    expect(screen.getByText(mockOrganization.email!)).toBeInTheDocument();
  });

  it('renders organization logo initial', () => {
    render(<Profile organization={mockOrganization} employees={mockEmployees} />);
    expect(screen.getByText('R')).toBeInTheDocument();
  });

  it('does not render employees section when employees array is empty', () => {
    render(<Profile organization={mockOrganization} employees={[]} />);
    expect(document.getElementById(`${mockOrganization.id}_Employees`)).not.toBeInTheDocument();
  });
});
