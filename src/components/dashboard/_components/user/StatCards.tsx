import { FolderOpen } from 'lucide-react';

import { type Case, CaseStatus } from '~/generated/prisma/browser';

import type { Stats } from '../../helper';

/**
 * Creates a statistics card component to display user key metrics.
 * @param title Name of the statistic
 * @param statValue Value of the statistic
 * @param iconColor Specifies the color theme for the icon background and icon itself
 * @param Icon Lucide icon component to be displayed
 * @returns
 */
export function StatCards({ cases }: { cases: Case[] }) {
  const stats: Stats[] = calculateStats(cases);

  return (
    <>
      {stats.map((stat) => (
        <div
          key={stat.title}
          className="bg-background rounded-2xl p-3 md:p-4 border border-border shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
        >
          <div className="flex items-center gap-2 md:gap-3">
            <div
              className={`w-8 h-8 md:w-10 md:h-10 rounded-xl bg-${stat.iconColor}-light flex items-center justify-center border border-border`}
            >
              <stat.Icon className={`w-4 h-4 md:w-6 md:h-6 text-${stat.iconColor}`} />
            </div>
            <div>
              <p className="text-xl md:text-2xl font-bold">{stat.statValue}</p>
              <p className="text-xs md:text-sm text-muted-foreground">{stat.title}</p>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

function calculateStats(cases: Case[]): Stats[] {
  const totalCases = cases.length;
  const activeCases = cases.filter((caseItem) => caseItem.status !== CaseStatus.COMPLETED).length;
  const closedCases = totalCases - activeCases;

  const stats: Stats[] = [
    {
      id: 'total-cases',
      title: 'Anzahl aller Fälle',
      statValue: totalCases,
      iconColor: 'accent-blue',
      Icon: FolderOpen,
    },
    {
      id: 'active-cases',
      title: 'Aktive Fälle',
      statValue: activeCases,
      iconColor: 'accent-green',
      Icon: FolderOpen,
    },
    {
      id: 'closed-cases',
      title: 'Abgeschlossene Fälle',
      statValue: closedCases,
      iconColor: 'accent-red',
      Icon: FolderOpen,
    },
  ];

  return stats;
}
