import { Separator } from '@radix-ui/react-separator';
import { Globe, Mail, MapPin, Phone } from 'lucide-react';

import type { Organization } from '~/generated/prisma/client';

// Helper component for profile items
function profileItem(
  Icon: React.ComponentType<{ className?: string; size?: number }>,
  title: string,
  content: string | null
) {
  return (
    <div className="col-span-1">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="text-foreground" size={25} />
        <p className="flex items-center gap-2 text-xl font-bold text-foreground">{title}</p>
      </div>
      <p>{content ?? 'Keine Angabe.'}</p>
    </div>
  );
}

export default function OrganizationDetail(organization: Organization) {
  return (
    <div
      id={`OrganizationDetailPage_${organization.id}`}
      className="flex flex-col justify-start items-center w-full px-4 py-6"
    >
      <div className="bg-background outline-1 p-6 rounded-lg w-full max-w-5xl outline-border shadow-md">
        <div className="flex items-center mb-4">
          <p className="text-4xl font-bold pr-4">{organization.name}</p>
          <div className="text-base inline-block px-2 py-1 rounded-xl border border-accent-amber font-semibold bg-accent-amber-light text-accent-amber">
            €€€
          </div>
        </div>
        <div className="text-sm inline-block px-2 py-1 rounded-xl  border border-accent-amber font-semibold bg-accent-amber-light text-accent-amber mb-4">
          <p>{organization.expertiseArea}</p>
        </div>
        <div className="mb-4 pt-2 text-foreground text-lg">
          <p>{organization.description}</p>
        </div>

        <Separator className="my-6 h-px bg-border w-full" />

        <div className="grid grid-cols-2 gap-x-10 gap-y-5 justify-items-start">
          {profileItem(Globe, 'Webseite', organization.website)}
          {profileItem(Phone, 'Telefon', organization.phone)}
          {profileItem(MapPin, 'Adresse', organization.address)}
          {profileItem(Mail, 'E-Mail', organization.email)}
        </div>
      </div>
    </div>
  );
}
