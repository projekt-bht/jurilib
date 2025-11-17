import OrganizationCard from '@/app/organization/_components/OrganizationCard';
import type { Organization } from '~/generated/prisma/client';

// erzwingt SSG
export const dynamic = 'force-static';
// ISR mit 1h Cache
export const revalidate = 3600;

async function getOrganizations(): Promise<Organization[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_ROOT}organization`, {
      next: { revalidate },
    });
    if (!res.ok) {
      return [];
    } else {
      return (await res.json()) as Organization[];
    }
  } catch (error) {
    console.error('Error fetching organizations:', error);
    return [];
  }
}

export default async function OrganizationsPage() {
  const organizations: Organization[] = await getOrganizations();

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
          <p className="text-gray-500">Hinweis: Beim Build war die API evtl. nicht erreichbar.</p>
        </div>
      )}
    </div>
  );
}
