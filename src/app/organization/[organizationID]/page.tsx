import { Profile } from '@/app/organization/_components/Profile';
import type { Organization } from '~/generated/prisma/client';

// import OrganizationCalendar from '../_components/OrganizationCalendar';

export default async function OrganizationDetailPage({
  params,
}: {
  params: { organizationID: string };
}) {
  const parameters = await params;
  const organizationID = parameters.organizationID;
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_ROOT}organization/${organizationID}`);
  const org: Organization = await res.json();

  return org ? (
    <div className="bg-card grid grid-cols-1 lg:grid-cols-3 gap-5">
      {/* Left Column - Profile Info */}
      <div className="lg:col-span-2 space-y-8">
        <Profile {...org} />
      </div>
      {/* Right Column - Booking Section */}
      <div className="lg:col-span-1 space-y-8">{/*<OrganizationCalendar />*/}</div>
    </div>
  ) : (
    <div className="flex flex-col justify-center items-center h-full text-center gap-y-10">
      <p className="text-5xl font-bold text-foreground">
        Leider konnten wir keine passende Organisation finden.
      </p>
    </div>
  );
}
