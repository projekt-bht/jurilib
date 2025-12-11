import { Briefcase, Building, Building2, Info } from 'lucide-react';

import type { Areas, Employee } from '~/generated/prisma/browser';
import { OrganizationType } from '~/generated/prisma/browser';

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
    <span className="px-3 py-1 rounded-full text-sm font-semibold bg-accent-blue-soft border border-accent-gray-light text-foreground inline-flex items-center gap-1 shadow-sm">
      {icon}
      {displayType}
    </span>
  );
}
// Function to create and format the Expertise Area items to badges
export function ExpertiseAreaBadge({ areas }: { areas: Areas[] }) {
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
          className="text-sm inline-block px-3 py-1 rounded-xl font-semibold bg-accent-blue-soft border border-accent-gray-light text-foreground shadow-sm"
        >
          {area}
        </div>
      ))}
    </>
  );
}

// Function to create and format an Employee Card
export function EmplyeeCard({ employee }: { employee: Employee }) {
  return (
    <div
      key={employee.name}
      className="bg-linear-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-border hover:shadow-lg transition-all duration-300 hover:scale-105 animate-fade-in"
      id={`${employee.id}_EmployeeCard`}
    >
      <div className="flex items-start gap-4 mb-4">
        <div className="w-16 h-16 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold shadow-md shrink-0">
          {employee.name
            .split(' ')
            .map((n) => n[0])
            .join('')}
        </div>
        <div>
          <h3 className="text-xl font-bold text-foreground">{employee.name}</h3>
          <p className="text-sm text-blue-600 font-medium">{employee.position}</p>
        </div>
      </div>
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm">
          <Briefcase className="w-4 h-4 text-purple-600" />
          <span className="text-muted-foreground">{employee.position}</span>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <ExpertiseAreaBadge areas={employee.expertiseArea} />
      </div>
    </div>
  );
}
