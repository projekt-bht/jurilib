'use client';

import { ArrowRight, Clock, MapPin } from 'lucide-react';

import type { Organization } from '~/generated/prisma/client';

import { ExpertiseAreaItem, OrganisationTypeBadge } from './OrganizaionHelper';

// TODO: Verfügbare Termine anzeigen, wenn der Endpunkt fertig ist

export function OrganizationCard({ organization }: { organization: Organization }) {
  return (
    <div
      id={`OrganizationCard_${organization.id}`}
      className="relative rounded-xl border border-border bg-background transition-colors hover:border-primary/20"
    >
      <div className="relative p-4 flex flex-col gap-3">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-muted text-foreground flex items-center justify-center text-lg font-semibold shrink-0">
            {organization.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0 text-left">
            <h3 className="text-lg font-semibold text-foreground">
              {organization.name}
            </h3>
          </div>
          <OrganisationTypeBadge type={organization.type} />
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed text-left">
          {organization.description}
        </p>

        <div className="flex flex-wrap gap-2">
          <ExpertiseAreaItem areas={organization.expertiseArea} />
        </div>

        <div className="pt-3 border-t border-border/50">
          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-col gap-1 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                <span>{organization.address}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>Termine verfügbar</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-medium text-foreground">
              <span>Profil ansehen</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
