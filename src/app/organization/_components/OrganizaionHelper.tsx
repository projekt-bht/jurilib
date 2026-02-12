import { Briefcase, Building, Building2, Info, LanguagesIcon } from 'lucide-react';

import type { Area, Employee } from '~/generated/prisma/browser';
import { OrganizationType } from '~/generated/prisma/browser';

// Function to create and format the Organisation Type Badge
export function OrganisationTypeBadge({ type }: { type: OrganizationType }) {
  let displayType = '';
  let icon = null;
  switch (type) {
    case OrganizationType.LAW_FIRM:
      displayType = 'Kanzlei';
      icon = <Building className="w-4 h-4 text-background" />;
      break;
    case OrganizationType.ASSOCIATION:
      displayType = 'Verein';
      icon = <Building2 className="w-4 h-4 text-background" />;
      break;
    default:
      displayType = 'Keine Angabe';
      icon = <Info className="w-4 h-4 text-background" />;
  }
  return (
    <span className="px-3 py-1 rounded-full text-sm font-semibold bg-accent-blue/80 border border-accent-blue text-background inline-flex items-center gap-1 shadow-sm">
      {icon}
      {displayType}
    </span>
  );
}
// Function to create and format the Expertise Area items to badges
export function ExpertiseAreaBadge({ areas }: { areas: Area[] }) {
  return (
    <>
      {areas.length === 0 && (
        <div className="text-sm inline-block px-3 py-1 rounded-xl font-semibold bg-accent-gray-soft border border-accent-gray-light text-foreground shadow-sm">
          Keine Angabe
        </div>
      )}

      {areas.map((area) => (
        <div
          key={area}
          className="text-sm inline-block px-3 py-1 rounded-xl font-semibold bg-accent-white border border-accent-gray-light text-foreground shadow-sm"
        >
          {area.toString().replace(/_/g, ' ')}
        </div>
      ))}
    </>
  );
}

// Function to create and format an Employee Card
export function EmployeeCard({ employee }: { employee: Employee }) {
  return (
    <div
      key={`EmployeeCard_${employee.id}`}
      className="bg-linear-to-br from-accent-purple-soft to-accent-blue/5 rounded-xl p-6 border border-border hover:shadow-lg transition-all duration-300 hover:scale-101 animate-fade-in"
      id={`${employee.id}_EmployeeCard`}
    >
      <div className="flex items-start gap-4 mb-4">
        <div className="w-16 h-16 rounded-full bg-linear-to-br from-accent-blue to-accent-purple flex items-center justify-center text-accent-white text-xl font-bold shadow-md shrink-0">
          {employee.firstname
            .split(' ')
            .map((n) => n[0])
            .join('')}
        </div>
        <div className="flex flex-col gap-1 flex-1 min-h-24">
          <h3 className="text-lg font-bold text-foreground">
            {employee.title ? `${employee.title} ` : ''}
            {employee.firstname} {employee.lastname}
          </h3>
          <p className="text-sm text-muted-foreground flex items-center gap-2 pb-1">
            {employee.pronoun
              ? `(${employee.pronounText ?? employee.pronoun.toString().replace(/_/g, '/')})`
              : null}
          </p>
          <p className="text-sm text-accent-blue font-medium flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-accent-purple" />
            {employee.position}
          </p>
        </div>
      </div>
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm">
          <LanguagesIcon className="w-4 h-4 text-accent-emerald" />
          <span>
            {employee.languages.length > 0
              ? employee.languages
                  .map((lang) => {
                    const formatted = lang.toString().replace(/_/g, ' ').toLowerCase();
                    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
                  })
                  .join(', ')
              : 'Keine Sprachangaben vorhanden'}
          </span>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <ExpertiseAreaBadge areas={employee.expertiseAreas} />
      </div>
    </div>
  );
}
