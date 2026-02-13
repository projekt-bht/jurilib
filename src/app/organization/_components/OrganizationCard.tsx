import { ArrowRight, Clock, MapPin, PersonStanding, Star } from 'lucide-react';
import { useEffect, useState } from 'react';

import type { Accessibility, Organization } from '~/generated/prisma/client';

import { ExpertiseAreaBadge, OrganisationTypeBadge } from './OrganizaionHelper';

// TODO: Verfügbare Termine anzeigen, wenn der Endpunkt fertig ist

export function OrganizationCard({ organization }: { organization: Organization }) {
  const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(false);
  const accessibilityArr: Accessibility[] = organization.accessibility
    ? organization.accessibility
    : [];

  return (
    <div
      id={`OrganizationCard_${organization.id}`}
      className="relative bg-background rounded-3xl border border-border hover:border-primary/40 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden"
    >
      <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative p-4 flex flex-col min-h-62.5">
        <div className="flex items-center gap-6 mb-4">
          <div className="w-24 h-24 rounded-full bg-linear-to-br from-accent-blue to-accent-purple flex items-center justify-center text-accent-white text-3xl font-bold shadow-lg shrink-0">
            {organization.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0 text-left">
            <h3 className="text-[clamp(1rem,2.2vw,1.5rem)] font-bold text-foreground group-hover:text-primary transition-colors duration-300 mb-2 whitespace-nowrap tracking-tight">
              {organization.name}
            </h3>
            <div className="flex flex-wrap gap-6">
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
                {accessibilityArr.length > 0 && (
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
                  </div>
                )}
              </div>
              <div className="ml-auto w-fit">
                <OrganisationTypeBadge type={organization.type} />
              </div>
            </div>
          </div>
        </div>
        <p className="text-muted-foreground leading-relaxed text-[15px] mb-6 text-left">
          {organization.shortDescription}
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          <ExpertiseAreaBadge areas={organization.expertiseAreas} />
        </div>

        <div className="mt-auto pt-6 border-t border-border/50">
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                <span>
                  {organization.zipCode} {organization.city}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span className="text-accent-emerald font-medium">Termine verfügbar</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-primary font-semibold group-hover:gap-3 transition-all duration-300">
              <span>Profil ansehen</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-primary via-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
  );
}
