import { notFound } from 'next/navigation';

import { Profile } from '@/app/organization/_components/Profile';
import type { Appointment, Employee, Organization } from '~/generated/prisma/client';

import OrganizationCalendar from '../_components/OrganizationCalendar';

async function fetchBackendData(endpoint: string, organizationID: string): Promise<Response> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_ROOT}${endpoint}/${organizationID}`, {
    cache: 'no-store',
  });

  // Call not-found.tsx page if resource is not found
  if (res.status === 404) {
    notFound();
  }

  // If other errors occur, throw an error that is handled by the Error Boundary in error.tsx
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

  // Parse organization data
  // Upcomming errors are also handled by the Error Boundary
  const OrgaResponse = await fetchBackendData('organization', organizationID);
  const organization: Organization = await OrgaResponse.json();

  // Parse organization employees
  // Upcomming errors are also handled by the Error Boundary
  const resEmployee = await fetchBackendData('employee/organization/', organizationID);
  const employees: Employee[] = await resEmployee.json();

  // Parse organization appointments
  // Upcomming errors are also handled by the Error Boundary
  const resAppointments = await fetchBackendData('appointment/organization/', organizationID);
  const appointments: Appointment[] = await resAppointments.json();
  console.log(appointments);

  return (
    <div className="flex justify-center bg-card items-start gap-2 p-2">
      {/* Left Column - Profile Info */}
      <div className="w-4/6">
        <Profile organization={organization} employees={employees} />
      </div>
      {/* Right Column - Booking Section */}
      <div className="w-2/6">
        <OrganizationCalendar appointments={appointments} employees={employees} />
      </div>
    </div>
  );
}
