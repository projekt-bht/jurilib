import { Building, Building2, Info } from 'lucide-react';

import type { Areas } from '~/generated/prisma/browser';
import { OrganizationType } from '~/generated/prisma/browser';

// Function to create and format the Organisation Type Badge
export function OrganisationTypeBadge({ type }: { type: OrganizationType }) {
  let displayType = '';
  let icon = null;
  switch (type) {
    case OrganizationType.LAW_FIRM:
      displayType = 'Kanzlei';
      icon = <Building className="w-4 h-4 text-accent-gray" />;
      break;
    case OrganizationType.ASSOCIATION:
      displayType = 'Verein';
      icon = <Building2 className="w-4 h-4 text-accent-gray" />;
      break;
    default:
      displayType = 'Keine Angabe';
      icon = <Info className="w-4 h-4 text-accent-gray" />;
  }
  return (
    <span className="px-3 py-1 rounded-full text-sm font-semibold bg-accent-blue-soft border border-accent-gray-light text-foreground inline-flex items-center gap-1 shadow-sm">
      {icon}
      {displayType}
    </span>
  );
}
// Function to create and format the Expertise Area items to badges
export function ExpertiseAreaItem({ areas }: { areas: Areas[] }) {
  return (
    <>
      {areas.map((area) => (
        <div
          key={area}
          className="text-sm inline-block px-3 py-1 rounded-xl font-semibold bg-accent-blue-soft border border-accent-gray-light text-foreground shadow-sm"
        >
          {area}
        </div>
      ))}
    </>
  );
}
