import { ArrowRight, Clock, MapPin } from 'lucide-react';

import type { Organization } from '~/generated/prisma/client';

import { ExpertiseAreaBadge, OrganisationTypeBadge } from './OrganizaionHelper';

// TODO: Verfügbare Termine anzeigen, wenn der Endpunkt fertig ist

export function OrganizationCard({ organization }: { organization: Organization }) {
  return (
    <div
      id={`OrganizationCard_${organization.id}`}
      className="relative bg-background rounded-3xl border border-border hover:border-primary/40 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden"
    >
      <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative p-4 flex flex-col min-h-[250px]">
        <div className="flex items-start gap-6 mb-4">
          <div className="w-24 h-24 rounded-full bg-linear-to-br from-accent-blue to-accent-purple flex items-center justify-center text-accent-white text-3xl font-bold shadow-lg shrink-0">
            {organization.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0 text-left">
            <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300 mb-2">
              {organization.name}
            </h3>
          </div>
          <OrganisationTypeBadge type={organization.type} />
        </div>

        <p className="text-muted-foreground leading-relaxed text-[15px] mb-6 text-left">
          {organization.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          <ExpertiseAreaBadge areas={organization.expertiseArea} />
        </div>

        <div className="mt-auto pt-6 border-t border-border/50">
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                <span>{organization.address}</span>
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
