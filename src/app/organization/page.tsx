import OrganizationCard from '@/app/organization/_components/OrganizationCard';
import type { Organization } from '~/generated/prisma/client';

export const dynamic = 'force-dynamic';

async function fetchOrganizations(): Promise<Organization[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_ROOT}organization`, {
      next: { revalidate: 3600 },
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
    <div className="flex flex-col justify-start items-center h-screen pt-3">
      {organizations.length > 0 ? (
        <>
          <p className="text-xl text-gray-800 font-semibold">Organisationsliste</p>
          <div className="h-8" />
          {organizations.map((orga) => (
            <OrganizationCard key={'OrganizationCard_' + orga.id} {...orga} />
          ))}
          <div className="mb-8 text-gray-400 pt-6">Deine Anfrage wird vertraulich behandelt.</div>
        </>
      ) : (
        <div className="flex flex-col justify-center items-center h-full text-center gap-y-10">
          <p className="text-5xl font-bold text-black">
            Leider konnten wir keine passende Organisation finden.
          </p>
        </div>
      )}
    </div>
  );
}
