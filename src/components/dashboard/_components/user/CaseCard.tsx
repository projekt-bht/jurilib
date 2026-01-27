import { GripVertical, User } from 'lucide-react';

import type { Case } from '~/generated/prisma/browser';

export async function CaseCard(caseItem: Case) {
  // fetch additional data
  const resEmployee = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_ROOT}employees/${caseItem.employeeId}`,
    { cache: 'no-store' }
  );
  const employee = await resEmployee.json();

  const resOrganization = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_ROOT}organizations/${employee.organizationId}`,
    { cache: 'no-store' }
  );
  const organization = await resOrganization.json();

  return (
    <div
      key={caseItem.title}
      className="bg-linear-to-br from-accent-purple-light to-accent-purple rounded-2xl border border-border overflow-hidden shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 p-4"
    >
      {/* Header Section*/}
      <div className="flex justify-start items-center pb-4 ">
        <GripVertical className="w-5 h-5 text-accent-gray-soft cursor-move mr-2" />
        <p className="px-2.5 py-1 rounded-full text-xs font-semibold text-foreground bg-accent-white/70">
          {caseItem.status}
        </p>
      </div>

      {/* Body Section*/}
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-bold text-background line-clamp-2 min-h-13.5">
          {caseItem.title}
        </h3>
        <p className="text-sm text-background"> {organization.name}</p>

        {/* Progress Bar*/}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-accent-white/80">Fortschritt</span>
            <span className="text-accent-white font-medium">{caseItem.status}%</span>
          </div>
          <div className="h-2 bg-background/30 rounded-full overflow-hidden">
            {/* TODO: FIX ME! There is no progress property */}
            <div
              className="h-full bg-background rounded-full transition-all duration-500 ease-out"
              style={{ width: `80%` }}
            />
          </div>
        </div>

        {/* Footer Section*/}
        <div className="flex items-center justify-start mt-4">
          <div className="flex items-center rounded-full bg-accent-white/20 p-1">
            <User className="w-5 h-5 text-accent-white/80 inline-block" />
          </div>
          <span className="text-accent-white/80 text-sm pl-2">
            {employee.firstname} {employee.lastname}
          </span>
        </div>
      </div>
    </div>
  );
}
