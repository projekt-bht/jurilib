'use client';
import { Separator } from '@radix-ui/react-separator';
import { Globe, Info, Mail, MapPin, Phone, Star, Users } from 'lucide-react';

import type { Areas, Organization } from '~/generated/prisma/client';

//import type { Employee } from '~/generated/prisma/client';
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
// export function Profile(organization: Organization, employees: Employee[]) {
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
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-1">
          <Info className="w-6 h-6 text-blue-600 inline-block mr-2" />
          Über uns
        </h2>
        <div className="text-foreground text-lg">{organization.description}</div>
      </div>

      {/* Employees Section */}
      {/* Hier noch prüfen, ob Employees vorhanden sind */}
      <div className="bg-background outline-1 p-6 mt-6 rounded-lg w-full max-w-5xl outline-border shadow-md">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-1">
          <Users className="w-6 h-6 text-blue-600 inline-block mr-2" />
          Unser Team
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Kommt wenn der Endpoint implementiert ist*/}
          {/* 
          {employees.map((member, index) => (
            <div
              key={member.name}
              className="bg-linear-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-border hover:shadow-lg transition-all duration-300 hover:scale-105 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold shadow-md shrink-0">
                  {member.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">{member.name}</h3>
                  <p className="text-sm text-blue-600 font-medium">{member.role}</p>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Briefcase className="w-4 h-4 text-purple-600" />
                
                  <span className="text-muted-foreground">{member.experience} Erfahrung</span>
 
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {member.expertiseArea.map((specialty) => (
                  <span
                    key={specialty}
                    className="px-2 py-1 bg-white text-foreground text-xs font-medium rounded-full border border-border shadow-sm"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </div>
          ))}*/}
        </div>
      </div>

      {/* Bewertungen */}
      {/* DEMO! Kann ausgetauscht werden, wenn Bewertungen da sind. Aktuell nur zur Veranschaulichung */}
      <div className="bg-background outline-1 p-6 mt-6 rounded-lg w-full max-w-5xl outline-border shadow-md">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-1">
          <Star className="w-6 h-6 text-accent-amber fill-accent-amber-light inline-block mr-2" />
          Kundenbewertungen
        </h2>
        <div className="space-y-6">
          <div className="border-l-4 border-accent-blue pl-4 py-2 bg-accent-blue-soft rounded-r">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-4 h-4 text-accent-amber fill-accent-amber" />
                ))}
              </div>
              <span className="text-sm font-semibold text-muted-foreground">vor 2 Wochen</span>
            </div>
            <p className="text-muted-foreground italic">
              &quot;Hervorragende Beratung! Das Team hat sich sehr viel Zeit genommen und mein
              Anliegen professionell gelöst.&quot;
            </p>
            <p className="text-sm font-medium text-foreground mt-2">- Michael K.</p>
          </div>
          <div className="border-l-4 border-accent-purple pl-4 py-2 bg-accent-purple-light rounded-r">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-4 h-4 text-accent-amber fill-accent-amber" />
                ))}
              </div>
              <span className="text-sm font-semibold text-muted-foreground">vor 1 Monat</span>
            </div>
            <p className="text-muted-foreground italic">
              &quot;Kompetent, freundlich und zuverlässig. Ich kann diese Kanzlei nur
              weiterempfehlen!&quot;
            </p>
            <p className="text-sm font-medium text-foreground mt-2">- Sarah M.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
