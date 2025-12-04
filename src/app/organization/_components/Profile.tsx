'use client';
import { Separator } from '@radix-ui/react-separator';
import { Globe, Mail, MapPin, Phone } from 'lucide-react';

import type { Areas, Organization } from '~/generated/prisma/client';

import { PricingInfo } from './PricingDropDown';

// Function to create and formate the Profile Info Items with icon, title and content
// Used to create items like Website, Phone, Address, Email
function ProfileInfoItem({
  Icon,
  title,
  content,
}: {
  Icon: React.ComponentType<{ className?: string; size?: number }>;
  title: string;
  content: string | null;
}) {
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

// Function to create and format the Expertise Area items
function ExpertiseAreaItem({ areas }: { areas: Areas[] }) {
  return areas.map((area) => (
    <div
      key={area}
      className="text-sm inline-block px-2 py-1 rounded-xl  border border-accent-amber font-semibold bg-accent-amber-light text-accent-amber mb-2 mr-2"
    >
      {area}
    </div>
  ));
}

export function Profile(organization: Organization) {
  return (
    <div
      id={`OrganizationDetailPage_${organization.id}`}
      className="flex flex-col justify-start items-start w-full px-10 py-8"
    >
      {/* Profile Info Section */}
      <div className="bg-background outline-1 p-6 rounded-lg w-full max-w-5xl outline-border shadow-md">
        <div className="flex flex-col lg:flex-row  items-start gap-8">
          {/* Organization logo */}
          <div className="w-24 h-24 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
            {organization.name.charAt(0)}
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-4xl font-bold">{organization.name}</p>
            <div className="flex flex-wrap items-start gap-2">
              <ExpertiseAreaItem areas={organization.expertiseArea} />
            </div>
            <div className="mb-4 pt-2 text-foreground text-lg">
              <p>{organization.shortDescription}</p>
            </div>
          </div>
        </div>

        <PricingInfo priceCategory={organization.priceCategory} />

        <Separator className="my-6 h-px bg-border w-full" />

        <div className="grid grid-cols-2 gap-x-10 gap-y-5 justify-items-start">
          <ProfileInfoItem Icon={Globe} title="Webseite" content={organization.website} />
          <ProfileInfoItem Icon={Phone} title="Telefon" content={organization.phone} />
          <ProfileInfoItem Icon={MapPin} title="Adresse" content={organization.address} />
          <ProfileInfoItem Icon={Mail} title="E-Mail" content={organization.email} />
        </div>
      </div>

      {/* Description Section */}
      <div className="bg-background outline-1 p-6 mt-6 rounded-lg w-full max-w-5xl outline-border shadow-md">
        <h2 className="text-2xl font-bold mb-4">Über uns</h2>
        <div className="text-foreground text-lg">
          <p>{organization.description}</p>
        </div>
      </div>

      {/* Employees Section */}
    </div>
  );
}
