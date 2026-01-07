'use client';

import { Search } from 'lucide-react';
import Link from 'next/link';
import { OrganizationCard } from '@/app/organization/_components/OrganizationCard';
import type { Organization } from '~/generated/prisma/client';

import type { FilterOptions } from './OrganizationFilters';

export function OrganizationGrid({
  organizations,
  filters,
}: {
  organizations: Organization[];
  filters: FilterOptions;
}) {
  const filteredOrganizations = organizations.filter((organization) => {
    const matchesPrice =
      filters.priceCategory.length === 0 ||
      (organization.priceCategory && filters.priceCategory.includes(organization.priceCategory));

    const matchesType =
      filters.organizationType.length === 0 ||
      (organization.type && filters.organizationType.includes(organization.type));

    const matchesSpecialties =
      filters.specialties.length === 0 ||
      organization.expertiseArea?.some((area) => filters.specialties.includes(area));

    return matchesPrice && matchesType && matchesSpecialties;
  });

  if (filteredOrganizations.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-border bg-background px-6 py-10 text-center">
        <div className="rounded-full bg-muted p-2 text-muted-foreground mb-3">
          <Search className="w-5 h-5" />
        </div>
        <p className="text-base font-semibold text-foreground">Keine Ergebnisse</p>
        <p className="text-sm text-muted-foreground">
          Passe die Filter an, um weitere Organisationen zu entdecken.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
      {filteredOrganizations.map((organization) => (
        <Link href={`/organization/${organization.id}`} key={organization.id}>
          <OrganizationCard organization={organization} />
        </Link>
      ))}
    </div>
  );
}
