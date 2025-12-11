import { notFound } from 'next/navigation';

import { Profile } from '@/app/organization/_components/Profile';
import type { Employee, Organization } from '~/generated/prisma/client';

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

  // Parse organization employees
  // Upcomming errors are also handled by the Error Boundary
  const resEmployee = await fetchBackendData('employee/organization/', organizationID);
  const employees: Employee[] = await resEmployee.json();

  return (
    <div className="bg-card grid grid-cols-1 lg:grid-cols-3 gap-5">
      {/* Left Column - Profile Info */}
      <div className="lg:col-span-2 space-y-8">
        <Profile organization={organization} employees={employees} />
      </div>
      {/* Right Column - Booking Section */}
      <div className="lg:col-span-1 space-y-8">{/*<OrganizationCalendar />*/}</div>
    </div>
  );
}
