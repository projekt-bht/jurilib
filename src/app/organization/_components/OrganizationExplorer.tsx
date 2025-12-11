'use client';

import { Sparkles } from 'lucide-react';
import { useState } from 'react';

import type { Organization } from '~/generated/prisma/client';
import type { Areas, OrganizationType, PriceCategory } from '~/generated/prisma/enums';

import { OrganizationFilters, type FilterOptions } from './OrganizationFilters';
import { OrganizationGrid } from './OrganizationGrid';

type FilterValue = PriceCategory | OrganizationType | Areas;

const createDefaultFilters = (): FilterOptions => ({
  priceCategory: [],
  organizationType: [],
  specialties: [],
});

export function OrganizationExplorer({ organizations }: { organizations: Organization[] }) {
  const [filters, setFilters] = useState<FilterOptions>(createDefaultFilters());

  const handleFilterChange = (
    category: keyof FilterOptions,
    value: FilterValue,
    checked: boolean,
  ) => {
    setFilters((prev) => {
      const currentValues = prev[category];
      const updatedValues = checked
        ? [...currentValues, value]
        : currentValues.filter((item) => item !== value);

      return { ...prev, [category]: updatedValues } as FilterOptions;
    });
  };

  const resetFilters = () => {
    setFilters(createDefaultFilters());
  };

  const activeFilterCount =
    filters.priceCategory.length + filters.organizationType.length + filters.specialties.length;

  return (
    <section className="flex w-full flex-col gap-6 lg:flex-row">
      <OrganizationFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={resetFilters}
        activeFilterCount={activeFilterCount}
      />

      <div className="flex-1 space-y-4">
        <div className="flex items-center justify-between rounded-2xl border border-border bg-background px-4 py-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-primary/10 p-2 text-primary">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-semibold text-foreground">
                Passende Organisationen
              </span>
              <span className="text-xs text-muted-foreground">
                Ergebnisse aktualisieren sich automatisch bei jeder Auswahl
              </span>
            </div>
          </div>
          <span className="text-sm font-semibold text-foreground">
            {organizations.length} gesamt
          </span>
        </div>

        <OrganizationGrid organizations={organizations} filters={filters} />
      </div>
    </section>
  );
}
