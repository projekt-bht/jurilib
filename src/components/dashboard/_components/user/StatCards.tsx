import { CheckCircle, Clock, FolderOpen } from 'lucide-react';

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
          key={stat.id}
          className="group relative isolate rounded-2xl
            p-3 overflow-hidden 
            bg-background border
            border-border/40 
            transition-all duration-300
            shadow-sm hover:shadow-md 
            hover:scale-105 hover:-translate-y-2"
        >
          {/* Solid accent bar - 5px left of icon */}
          <div className="absolute left-12 top-3 bottom-3 w-0.5 rounded-full bg-accent-gray-light" />

          <div className="relative flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-muted/50 flex items-center justify-center shrink-0">
              <stat.Icon className={`w-4 h-4 md:w-6 md:h-6 text-${stat.iconColor}`} />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground tracking-tight">{stat.statValue}</p>
              <p className="text-xs text-muted-foreground font-medium">{stat.title}</p>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

function calculateStats(cases: Case[]): Stats[] {
  let stats: Stats[] = [];

  if (cases.length === 0) return stats;

  const totalCases = cases.length;
  const activeCases = cases.filter((caseItem) => caseItem.status !== CaseStatus.COMPLETED).length;
  const closedCases = totalCases - activeCases;

  stats = [
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
      iconColor: 'accent-amber',
      Icon: Clock,
    },
    {
      id: 'closed-cases',
      title: 'Abgeschlossene Fälle',
      statValue: closedCases,
      iconColor: 'accent-emerald',
      Icon: CheckCircle,
    },
  ];

  return stats;
}
