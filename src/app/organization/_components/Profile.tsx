import { Separator } from '@radix-ui/react-separator';
import { Info, Users } from 'lucide-react';

import type { Organization } from '~/generated/prisma/client';

import { ExpertiseAreaItem } from './OrganizaionHelper';
import { OrganisationTypeBadge } from './OrganizaionHelper';
import { PricingInfo } from './PricingInfo';
import { ProfileInfos } from './ProfileInfos';

export function Profile({ organization }: { organization: Organization }) {
  return (
    <div
      id={`${organization.id}_Profile`}
      className="flex flex-col justify-start items-start w-full px-10 py-8"
    >
      {/* Profile Info Section */}
      <div
        id={`${organization.id}_ProfileInfo`}
        className="bg-background border p-6 rounded-lg w-full max-w-5xl border-border shadow-md"
      >
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

            <span className="mb-4 text-foreground text-lg pb-2">
              {organization.shortDescription}
            </span>
            <div>
              <PricingInfo id={organization.id} priceCategory={organization.priceCategory} />
            </div>
            <div className="flex flex-wrap items-start gap-2">
              <ExpertiseAreaItem areas={organization.expertiseArea} />
            </div>
          </div>
        </div>

        <Separator className="my-6 h-px bg-border w-full" />
        <div className="flex justify-center w-full">
          <ProfileInfos
            id={organization.id}
            website={organization.website}
            phone={organization.phone}
            address={organization.address}
            email={organization.email}
          />
        </div>
      </div>

      {/* Description Section */}
      <div
        id={`${organization.id}_Description`}
        className="bg-background border p-6 mt-6 rounded-lg w-full max-w-5xl border-border shadow-md"
      >
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-1">
          <Info className="w-6 h-6 text-accent-blue inline-block mr-2" />
          Über uns
        </h2>
        <span className="text-foreground text-lg">{organization.description}</span>
      </div>

      {/* Employees Section */}
      <div
        id={`${organization.id}_Employees`}
        className="bg-background border p-6 mt-6 rounded-lg w-full max-w-5xl border-border shadow-md"
      >
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-1">
          <Users className="w-6 h-6 text-accent-blue inline-block mr-2" />
          Unser Team
        </h2>
        {/* Mapping der Employees kommt wenn der Endpoint implementiert ist*/}
      </div>
    </div>
  );
}
