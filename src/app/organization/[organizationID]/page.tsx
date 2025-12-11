import { notFound } from 'next/navigation';

import { Profile } from '@/app/organization/_components/Profile';
import type { Organization } from '~/generated/prisma/client';

import OrganizationCalendar from '../_components/OrganizationCalendar';

async function fetchBackendData(endpoint: string, organizationID: string): Promise<Response> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_ROOT}${endpoint}/${organizationID}`, {
    cache: 'no-store',
  });

  // Rufe NotFound-Seite auf, wenn Endpoint oder Inhalt nicht gefunden wurde
  if (res.status === 404) {
    notFound();
  }

  // Treten andere Fehler auf, werfe einen Fehler, der vom Error Boundary in der error.tsx behandelt wird
  if (!res.ok) {
    throw new Error(`Failed to fetch organization: ${res.statusText}`);
  }
  return res;
}

export default async function OrganizationDetailPage({
  params,
}: {
  params: { organizationID: string };
}) {
  const { organizationID } = await params;

  // Parse die Organisationsdaten
  // Auftretende Fehler werden ebenfalls vom Error Boundary behandelt
  const OrgaResponse = await fetchBackendData('organization', organizationID);
  const organization: Organization = await OrgaResponse.json();

  // Wenn Employee Endpunkt fertig ist, wieder entkommentieren
  // Parse die Mitarbeiterdaten der Organisation
  // Auftretende Fehler werden ebenfalls vom Error Boundary behandelt
  // const resEmployee = await fetchBackendData('employee', organizationID);
  // const employees: Employee[] = await resEmployee.json();

  return (
    <div className="container mx-auto">
      <div className="bg-card flex justify-center xl:flex-row flex-col">
        {/* Left Column - Profile Info */}
        <div className=" space-y-8 w-full xl:w-[65%]">
          <Profile organization={organization} />
        </div>
        {/* Right Column - Booking Section */}
        <div className=" space-y-8 w-full xl:w-[35%] ">
          <OrganizationCalendar />
        </div>
      </div>
    </div>
  );
}
