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
      icon = <Building className="w-4 h-4 text-muted-foreground" />;
      break;
    case OrganizationType.ASSOCIATION:
      displayType = 'Verein';
      icon = <Building2 className="w-4 h-4 text-muted-foreground" />;
      break;
    default:
      displayType = 'Keine Angabe';
      icon = <Info className="w-4 h-4 text-muted-foreground" />;
  }
  return (
    <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-muted border border-border text-foreground inline-flex items-center gap-1">
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
          className="text-xs inline-block px-2.5 py-1 rounded-md font-medium bg-muted border border-border text-foreground"
        >
          {area}
        </div>
      ))}
    </>
  );
}
