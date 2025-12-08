import { Building, Building2, Info } from 'lucide-react';

import { OrganizationType } from '~/generated/prisma/client';

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
    <span className="px-3 py-1 rounded-full text-sm font-semibold bg-accent-blue-soft border border-accent-gray-light text-foreground inline-flex items-center gap-1">
      {icon}
      {displayType}
    </span>
  );
}
