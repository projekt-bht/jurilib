import OrganizationDetail from '@/app/organization/_components/OrganizationDetail';
import type { Organization } from '~/generated/prisma/client';

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
    <OrganizationDetail {...org} />
  ) : (
    <div className="flex flex-col justify-center items-center h-full text-center gap-y-10">
      <p className="text-5xl font-bold text-black">
        Leider konnten wir keine passende Organisation finden.
      </p>
    </div>
  );
}
