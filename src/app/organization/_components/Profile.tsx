'use client';
import { Separator } from '@radix-ui/react-separator';
import { Building, Building2, Info, Users } from 'lucide-react';

import type { Areas, Organization } from '~/generated/prisma/client';

import { PricingInfo } from './PricingDropDown';
import { ProfileInfos } from './ProfileInfos';

// Function to create and format the Expertise Area items to badges
function ExpertiseAreaItem({ areas }: { areas: Areas[] }) {
  return areas.map((area) => (
    <div
      key={area}
      className="text-sm inline-block px-3 py-1 rounded-xl font-semibold bg-accent-blue-soft border border-accent-gray-light text-foreground shadow-sm"
    >
      {area}
    </div>
  ));
}

// Function to create and format the Organisation Type Badge
function OrganisationTypeBadge({ type }: { type: string }) {
  let displayType = '';
  let icon = null;
  switch (type) {
    case 'LAW_FIRM':
      displayType = 'Kanzlei';
      icon = <Building className="w-4 h-4 text-accent-gray" />;
      break;
    case 'ASSOCIATION':
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

export function Profile(organization: Organization) {
  return (
    <div
      id={`OrganizationDetailPage_${organization.id}`}
      className="flex flex-col justify-start items-start w-full px-10 py-8"
    >
      {/* Profile Info Section */}
      <div className="bg-background border p-6 rounded-lg w-full max-w-5xl border-border shadow-md">
        <div className="flex flex-col lg:flex-row  items-start gap-8">
          {/* Organization logo */}
          <div className="w-24 h-24 rounded-full bg-linear-to-br from-accent-blue to-accent-purple flex items-center justify-center text-accent-white text-3xl font-bold shadow-lg shrink-0">
            {organization.name.charAt(0)}
          </div>
          <div className="flex flex-col gap-2 flex-1">
            <h2 className="text-3xl font-bold">{organization.name}</h2>
            <div className="pb-2">
              <OrganisationTypeBadge type={organization.type} />
            </div>

            <div className="mb-4 text-foreground text-lg pb-2">{organization.shortDescription}</div>
            <div>
              <PricingInfo priceCategory={organization.priceCategory} />
            </div>
            <div className="flex flex-wrap items-start gap-2">
              <ExpertiseAreaItem areas={organization.expertiseArea} />
            </div>
          </div>
        </div>

        <Separator className="my-6 h-px bg-border w-full" />
        <div className="flex justify-center w-full">
          <ProfileInfos organization={{ ...organization }} />
        </div>
      </div>

      {/* Description Section */}
      <div className="bg-background border p-6 mt-6 rounded-lg w-full max-w-5xl border-border shadow-md">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-1">
          <Info className="w-6 h-6 text-accent-blue inline-block mr-2" />
          Über uns
        </h2>
        <div className="text-foreground text-lg">{organization.description}</div>
      </div>

      {/* Employees Section */}
      {/* Hier noch prüfen, ob Employees vorhanden sind */}
      <div className="bg-background border p-6 mt-6 rounded-lg w-full max-w-5xl border-border shadow-md">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-1">
          <Users className="w-6 h-6 text-accent-blue inline-block mr-2" />
          Unser Team
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Kommt wenn der Endpoint implementiert ist*/}
        </div>
      </div>
    </div>
  );
}
