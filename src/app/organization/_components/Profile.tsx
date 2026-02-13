'use client';

import { Separator } from '@radix-ui/react-separator';
import { ChevronDown, ChevronUp, Info, PersonStanding, Star, Users } from 'lucide-react';
import { useState } from 'react';

import type { Employee, Organization } from '~/generated/prisma/client';

import { EmployeeCard, ExpertiseAreaBadge } from './OrganizaionHelper';
import { OrganisationTypeBadge } from './OrganizaionHelper';
import { PricingInfo } from './PricingInfo';
import { ProfileInfos } from './ProfileInfos';

export function Profile({
  organization,
  employees,
}: {
  organization: Organization;
  employees: Employee[];
}) {
  const [isTeamExpanded, setIsTeamExpanded] = useState(false);
  const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(false);

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
            <div className="flex flex-wrap gap-6 mb-6">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-accent-amber fill-accent-amber" />
                <div>
                  <span className="font-bold text-lg text-foreground">
                    {organization.averageRating}
                  </span>
                  <span className="text-sm text-muted-foreground ml-1">
                    ({organization.numberOfRatings})
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {organization.accessibility && organization.accessibility.length > 0 && (
                  <div
                    className="relative"
                    onMouseEnter={() => setIsAccessibilityOpen(true)}
                    onMouseLeave={() => setIsAccessibilityOpen(false)}
                  >
                    <button
                      type="button"
                      onClick={() => setIsAccessibilityOpen((prev) => !prev)}
                      className="h-6 w-6 rounded-full bg-background flex items-center justify-center text-foreground transition border border-primary"
                      aria-expanded={isAccessibilityOpen}
                      aria-label="Barrierefreiheit"
                    >
                      <PersonStanding className="w-5 h-5" />
                    </button>
                    {isAccessibilityOpen && (
                      <div className="absolute left-0 top-full mt-2 w-56 rounded-lg border border-border bg-background p-2 shadow-lg z-10">
                        <div className="space-y-1">
                          {organization.accessibility.map((acc) => (
                            <div key={acc.toString()} className="px-2 py-1 text-sm text-foreground">
                              {acc.toString().replace(/_/g, ' ')}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div>
              <PricingInfo id={organization.id} priceCategory={organization.priceCategory} />
            </div>
            <span className="mb-4 text-foreground text-lg pb-2">
              {organization.shortDescription}
            </span>
            <div className="flex flex-wrap items-start gap-2">
              <ExpertiseAreaBadge areas={organization.expertiseAreas} />
            </div>
          </div>
        </div>

        <Separator className="my-6 h-px bg-border w-full" />
        <div className="flex justify-center">
          <ProfileInfos
            id={organization.id}
            website={organization.website}
            phone={organization.phone}
            address={`${organization.street} ${organization.houseNumber}, ${organization.zipCode} ${organization.city}`}
            email={organization.email}
          />
        </div>
      </div>

      {/* Description Section */}
      <div
        id={`${organization.id}_Description`}
        className="bg-background border p-6 mt-6 rounded-lg w-full max-w-5xl border-border shadow-md"
      >
        <h2 className="text-xl font-bold mb-4 flex items-center gap-1">
          <Info className="w-6 h-6 text-accent-blue inline-block mr-2" />
          Über uns
        </h2>
        <span className="text-foreground text-lg">{organization.description}</span>
      </div>

      {/* Employees Section */}
      {employees.length > 0 && (
        <div
          id={`${organization.id}_Employees`}
          className="bg-background border p-6 mt-6 rounded-lg w-full max-w-5xl border-border shadow-md"
        >
          <button onClick={() => setIsTeamExpanded(!isTeamExpanded)} className="w-full text-left">
            <h2
              className={`text-xl font-bold flex items-center gap-2 ${isTeamExpanded ? 'mb-4' : ''}`}
            >
              <Users className="w-6 h-6 text-accent-blue shrink-0 mr-2" />
              <span className="flex-1">Unser Team</span>
              {isTeamExpanded ? (
                <ChevronUp className="w-7 h-7 text-foreground shrink-0" />
              ) : (
                <ChevronDown className="w-7 h-7 text-foreground shrink-0" />
              )}
            </h2>
          </button>
          {isTeamExpanded && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {employees.map((e) => (
                <EmployeeCard key={e.id} employee={e} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
