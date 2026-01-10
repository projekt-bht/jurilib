'use client';

import { Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

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

// Serialize filter selections into query params for the backend request.
const buildQueryString = (filters: FilterOptions) => {
  const params = new URLSearchParams();
  filters.priceCategory.forEach((price) => params.append('priceCategory', price));
  filters.organizationType.forEach((type) => params.append('organizationType', type));
  filters.specialties.forEach((area) => params.append('specialties', area));
  return params.toString();
};

export function OrganizationExplorer({
  organizations: initialOrganizations,
}: {
  organizations: Organization[];
}) {
  const [filters, setFilters] = useState<FilterOptions>(createDefaultFilters());
  const [organizations, setOrganizations] = useState<Organization[]>(initialOrganizations);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

  useEffect(() => {
    // Debounce filter changes to avoid spamming the backend while the user is clicking.
    const controller = new AbortController();
    const timeout = setTimeout(async () => {
      setIsLoading(true);
      setErrorMessage(null);
      try {
        const queryString = buildQueryString(filters);
        const url = `${process.env.NEXT_PUBLIC_BACKEND_ROOT}organization${
          queryString ? `?${queryString}` : ''
        }`;
        const res = await fetch(url, { cache: 'no-store', signal: controller.signal });
        if (!res.ok) {
          throw new Error(`Failed to fetch organizations (${res.status})`);
        }
        const data = (await res.json()) as Organization[];
        setOrganizations(data);
      } catch (error) {
        if ((error as Error).name === 'AbortError') {
          return;
        }
        setErrorMessage('Organisationen konnten nicht geladen werden.');
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }, 300);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [filters]);

  return (
    <section className="flex w-full flex-col gap-6">
      <OrganizationFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={resetFilters}
        activeFilterCount={activeFilterCount}
      />

      <div className="space-y-4">
        <div className="flex items-center justify-between rounded-xl border border-border bg-background px-3 py-2">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-muted p-2 text-muted-foreground">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-foreground">Passende Organisationen</span>
              <span className="text-xs text-muted-foreground">
                Ergebnisse aktualisieren sich automatisch bei jeder Auswahl
              </span>
            </div>
          </div>
          <span className="text-xs font-semibold text-foreground">
            {isLoading ? 'Aktualisiere…' : `${organizations.length} gesamt`}
          </span>
        </div>
        {errorMessage && (
          <div className="rounded-lg border border-border bg-background px-3 py-2 text-xs text-muted-foreground">
            {errorMessage}
          </div>
        )}

        <OrganizationGrid organizations={organizations} />
      </div>
    </section>
  );
}
