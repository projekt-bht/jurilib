'use client';
import Link from 'next/link';

import { OrganizationCard } from '@/app/organization/_components/OrganizationCard';
import type { Organization } from '~/generated/prisma/client';
import { OrganizationExplorer } from './_components/OrganizationExplorer';
import { useEffect, useState } from 'react';

async function fetchOrganizations(skip: number, take: number): Promise<Organization[]> {
  try {
    const params = new URLSearchParams({
      skip: skip.toString(),
      take: take.toString(),
    });

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
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [skip, setSkip] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  async function loadOrganizations() {
    if (loading || !hasMore) return;

    setLoading(true);

    const fetched = await fetchOrganizations(skip, steps);

    setOrganizations((prev) => [...prev, ...fetched]);
    setSkip((prev) => prev + steps);

    if (fetched.length < steps) {
      setHasMore(false);
    }

    setLoading(false);
  }

  // Initial Load
  useEffect(() => {
    loadOrganizations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  return (
    <div className="bg-card flex flex-col items-center min-h-screen px-4">
      <div className="w-full max-w-6xl py-6 space-y-6">
        <div className="space-y-2">
          <p className="text-4xl text-foreground font-semibold">Organisationsliste</p>
          <div className="h-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-6xl">
            {organizations.map((orga) => (
              <Link href={`/organization/${orga.id}`} key={'OrganizationCard_' + orga.id}>
                <OrganizationCard organization={orga} />
              </Link>
            ))}
          </div>
          <div className="mb-8 text-muted-foreground pt-6">
            Deine Anfrage wird vertraulich behandelt.
          </div>
        </div>
        ) : (
        <div className="flex flex-col justify-center items-center h-full text-center gap-y-10">
          <p className="text-5xl font-bold text-foreground">
            Leider konnten wir keine passende Organisation finden.
          </p>
        </div>
        <OrganizationExplorer organizations={organizations} />
        <div className="mb-4 text-muted-foreground pt-2 text-sm">
          Deine Anfrage wird vertraulich behandelt.
        </div>
      </div>
    </div>
  );
}
