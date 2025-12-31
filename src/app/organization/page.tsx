import Link from 'next/link';

import { OrganizationCard } from '@/app/organization/_components/OrganizationCard';
import type { Organization } from '~/generated/prisma/client';

//export const dynamic = 'force-dynamic';

async function fetchOrganizations(): Promise<Organization[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_ROOT}organization`, {
      cache: 'no-store',
    });
    if (!res.ok) {
      return [];
    } else {
      return (await res.json()) as Organization[];
    }
  } catch (error) {
    console.error('Failed to fetch organizations:', error);
    return [];
  }
}

export default async function OrganizationsPage() {
  const organizations: Organization[] = await fetchOrganizations();

  return (
    <div className="bg-card flex flex-col justify-start items-center min-h-screen pt-3 px-4">
      {organizations.length > 0 ? (
        <>
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
