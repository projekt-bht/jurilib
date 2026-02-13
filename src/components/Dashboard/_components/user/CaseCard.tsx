'use client';
import { GripVertical, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import {
  type Case,
  CaseStatus,
  type Employee,
  type Organization,
} from '~/generated/prisma/browser';

import { fetchBackendData, notFound } from '../../helper';

export function CaseCard({ color, caseItem }: { color: string; caseItem: Case }) {
  const router = useRouter();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [error, setError] = useState<string | null>(null);

  // TODO: Replace with real progress from case data, currently random for demo purposes
  const [progressBarProgress] = useState(() => Math.floor(Math.random() * 101));

  useEffect(() => {
    async function fetchData() {
      try {
        const resEmployee = await fetchBackendData('/employee', caseItem.employeeId, 'Employee');
        const employeeData = await resEmployee.json();

        const resOrganization = await fetchBackendData(
          'organization',
          employeeData.organizationId,
          'Organization'
        );
        const organizationData = await resOrganization.json();

        setEmployee(employeeData);
        setOrganization(organizationData);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Unknown error occurred');
      }
    }

    fetchData();
  }, [caseItem]);

  if (error) {
    return notFound(error);
  }

  return (
    <div
      id={caseItem.id}
      onClick={() => router.push(`/case/${caseItem.id}`)}
      key={caseItem.title}
      className={` bg-linear-to-br ${color}
                    rounded-2xl p-5
                    transition-all duration-500 ease-out shadow-sm hover:shadow-md
                    hover:scale-105 hover:-translate-y-2
                    relative overflow-hidden cursor-pointer`}
    >
      {/* Header Section*/}
      <div className="flex justify-between items-center pb-4 ">
        <GripVertical className="w-5 h-5 text-accent-gray-soft cursor-move mr-2" />
        <p className="px-2.5 py-1 rounded-full text-xs font-semibold text-foreground bg-accent-white/70">
          {translateCaseStatus(caseItem.status)}
        </p>
      </div>

      {/* Body Section*/}
      <div className="flex flex-col gap-2 ">
        <div className="text-background mb-5">
          <h3 className="text-lg font-bold line-clamp-2">{caseItem.title}</h3>
          <p className="text-sm"> {organization?.name}</p>
        </div>

        {/* Progress Bar*/}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-accent-white">Fortschritt</span>
            <span className="text-accent-white font-medium">
              {caseItem.status === CaseStatus.IN_PROGRESS ? `${progressBarProgress}` : '0'}%
            </span>
          </div>
          <div className="h-2 bg-background/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-background rounded-full transition-all duration-500 ease-out"
              style={{
                width:
                  caseItem.status === CaseStatus.IN_PROGRESS ? `${progressBarProgress}%` : '0%',
              }}
            />
          </div>
        </div>

        {/* Footer Section*/}
        <div className="flex items-center justify-start mt-4">
          <div className="flex items-center rounded-full bg-accent-white/20 p-1">
            <User className="w-5 h-5 text-accent-white/80 inline-block" />
          </div>
          <span className="text-accent-white text-sm pl-2">
            {employee?.firstname} {employee?.lastname}
          </span>
        </div>
      </div>
    </div>
  );
}

function translateCaseStatus(status: CaseStatus): string {
  switch (status) {
    case CaseStatus.OPEN:
      return 'Offen';
    case CaseStatus.IN_PROGRESS:
      return 'In Bearbeitung';
    case CaseStatus.COMPLETED:
      return 'Abgeschlossen';
    default:
      return 'Unbekannt';
  }
}
