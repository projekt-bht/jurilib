'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { OrganizationCard } from '@/app/organization/_components/OrganizationCard';
import {
  OrganizationFilters,
  type FilterOptions,
  type FilterValue,
} from '@/app/organization/_components/OrganizationFilters';
import type { Organization } from '~/generated/prisma/client';

async function fetchOrganizations(
  skip: number,
  take: number,
  filters: FilterOptions
): Promise<Organization[]> {
  try {
    const params = new URLSearchParams({
      skip: skip.toString(),
      take: take.toString(),
    });
    filters.priceCategory.forEach((price) => params.append('priceCategory', price));
    filters.organizationType.forEach((type) => params.append('organizationType', type));
    filters.area.forEach((area) => params.append('area', area));
    filters.languages.forEach((language) => params.append('language', language));

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_ROOT}organization?${params.toString()}`,
      { cache: 'no-store' }
    );

    if (!res.ok) return [];

    return (await res.json()) as Organization[];
  } catch (error) {
    console.error('Failed to fetch organizations:', error);
    return [];
  }
}

const steps = 10;
const SCROLL_THRESHOLD = 150; // px vor Seitenende

export default function OrganizationsPage() {
  // RM: Filter UI and filter state live in the page so there is a single source of truth
  // RM: and no duplicate state handling in child components. Filter changes request new DB results here.
  const emptyFilters: FilterOptions = {
    priceCategory: [],
    organizationType: [],
    area: [],
    languages: [],
    accessibility: [],
    pricingModel: [],
  };
  const [filters, setFilters] = useState<FilterOptions>(emptyFilters);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [skip, setSkip] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  async function loadOrganizations(nextSkip = skip, nextFilters = filters) {
    if (loading || (!hasMore && nextSkip !== 0)) return;

    setLoading(true);

    const fetched = await fetchOrganizations(nextSkip, steps, nextFilters);

    setOrganizations((prev) => {
      //remove the React key warning
      const merged = nextSkip === 0 ? fetched : [...prev, ...fetched];
      const byId = new Map<string, Organization>();
      merged.forEach((org) => byId.set(org.id, org));
      return Array.from(byId.values());
    });
    setSkip(nextSkip + steps);

    setHasMore(fetched.length === steps);

    setLoading(false);
  }

  // Initial Load + Filter Change
  useEffect(() => {
    setOrganizations([]);
    setSkip(0);
    setHasMore(true);
    loadOrganizations(0, filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  // Scroll Event
  // this was GPT
  useEffect(() => {
    function handleScroll() {
      if (loading || !hasMore) return;

      // if the site performs badly when scrolling, it could be an error with this
      const scrollPosition = window.innerHeight + window.scrollY;
      const pageHeight = document.documentElement.scrollHeight;

      if (scrollPosition >= pageHeight - SCROLL_THRESHOLD) {
        loadOrganizations();
      }
    }

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, hasMore]);

  // RM: Toggle a single filter value on/off and update only that category.
  const handleFilterChange = (
    category: keyof FilterOptions,
    value: FilterValue,
    isChecked: boolean
  ) =>
    setFilters((prev) => {
      const next = isChecked
        ? [...prev[category], value]
        : prev[category].filter((item) => item !== value);
      return { ...prev, [category]: next };
    });

  // RM: Reset all filters back to empty arrays (default state).
  const handleResetFilters = () => setFilters(emptyFilters);

  // RM: Used by the UI to show how many filters are currently active.
  const activeFilterCount = Object.values(filters).reduce((sum, list) => sum + list.length, 0);

  return (
    <div className="bg-card flex flex-col justify-start items-center min-h-screen pt-6 px-4 pb-10">
      <div className="w-full max-w-6xl">
        <p className="text-4xl text-foreground font-bold">Organisationsliste</p>
        <div className="h-6" />

        {/* RM: w-full keeps filters aligned to the card grid width; max-w-6xl prevents over-wide UI on large screens */}
        <OrganizationFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
          activeFilterCount={activeFilterCount}
        />
      </div>
      <div className="h-8" />

      {organizations.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-6xl">
            {organizations.map((orga) => (
              <Link href={`/organization/${orga.id}`} key={`OrganizationCard_${orga.id}`}>
                <OrganizationCard organization={orga} />
              </Link>
            ))}
          </div>

          {loading && (
            <div className="py-6 text-muted-foreground">Lade weitere Organisationen…</div>
          )}

          {!hasMore && (
            <div className="py-6 text-muted-foreground">
              Keine weiteren Organisationen verfügbar.
            </div>
          )}

          <div className="mb-8 text-muted-foreground pt-6">
            Deine Anfrage wird vertraulich behandelt.
          </div>
        </>
      ) : (
        <div className="flex flex-col justify-center items-center h-full text-center gap-y-10">
          <p className="text-5xl font-bold text-foreground">
            Leider konnten wir keine passende Organisation finden.
          </p>
        </div>
      )}
    </div>
  );
}
