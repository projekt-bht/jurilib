import { OrganizationExplorer } from '@/app/organization/_components/OrganizationExplorer';
import type { Organization } from '~/generated/prisma/client';

//export const dynamic = 'force-dynamic';

async function fetchOrganizations(): Promise<Organization[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_ROOT}organization`);
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
    <div className="bg-card flex flex-col items-center min-h-screen px-4">
      <div className="w-full max-w-6xl py-6 space-y-6">
        <div className="space-y-2">
          <p className="text-4xl text-foreground font-semibold">Organisationsliste</p>
          <p className="text-muted-foreground text-sm">
            Nutze die Filter, um passende Kanzleien oder Vereine nach Preisniveau und Fachgebiet zu
            finden.
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
