import { ChevronRight } from 'lucide-react';
import { CalendarCheck, FolderOpen, Users } from 'lucide-react';

import { Button } from '@/components/ui/button';
import type { Appointment } from '~/generated/prisma/browser';

import type { Stats } from '../../helper';
import { AppointmentCard } from './AppointmentCard';
import { CaseCard } from './CaseCard';
import { StatsCard } from './StatsCard';

const shownStats: Stats[] = [
  {
    id: 1,
    title: 'Fälle insgesamt',
    statValue: 128,
    Icon: FolderOpen,
    iconColor: 'accent-blue',
  },
  {
    id: 2,
    title: 'Abgeschlossene Fälle',
    statValue: 76,
    Icon: Users,
    iconColor: 'accent-emerald',
  },
  {
    id: 3,
    title: 'Offene Fälle',
    statValue: 32,
    Icon: CalendarCheck,
    iconColor: 'accent-amber',
  },
];

const upcomingAppointments: Appointment[] = [
  {
    dateTimeStart: new Date('2024-07-10T10:00:00'),
    status: 'CONFIRMED',
    id: '1',
    caseId: null,
    userId: null,
    employeeId: '',
    duration: 60,
    location: null,
    meetingLink: null,
    dateTimeEnd: new Date('2024-07-10T11:00:00'),
    notes: 'Erstgespräch zur Fallbesprechung.',
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now()),
  },
  {
    dateTimeStart: new Date('2024-07-12T14:30:00'),
    status: 'REQUESTED',
    id: '2',
    caseId: null,
    userId: null,
    employeeId: '',
    duration: 60,
    location: 'Vorort Kanzlei, Raum 3B',
    meetingLink: null,
    dateTimeEnd: new Date('2024-07-12T15:30:00'),
    notes: 'Bitte alle Unterlagen mitbringen.',
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now()),
  },
  {
    dateTimeStart: new Date('2024-07-15T09:00:00'),
    status: 'CANCELED',
    id: '3',
    caseId: null,
    userId: null,
    employeeId: '',
    duration: 60,
    location: null,
    meetingLink: null,
    dateTimeEnd: new Date('2024-07-15T10:00:00'),
    notes: null,
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now()),
  },
];

const activeCases = [
  {
    title: 'Mietstreit Fall #1234',
    status: 'In Bearbeitung',
    organizationID: 'ORG-5678',
    employeeID: 'EMP-9012',
    id: '1',
    progress: 60,
    color: 'accent-blue',
  },
  {
    title: 'Arbeitsrecht Fall #2345',
    status: 'In Bearbeitung',
    organizationID: 'ORG-6789',
    employeeID: 'EMP-0123',
    id: '2',
    progress: 30,
    color: 'accent-amber/70',
  },
  {
    title: 'Vertragsprüfung Fall #3456',
    status: 'In Bearbeitung',
    organizationID: 'ORG-7890',
    employeeID: 'EMP-1234',
    id: '3',
    progress: 45,
    color: 'accent-green',
  },
];

export function UserDashboard() {
  return (
    <div className="bg-card flex-1 p-4 md:p-6 overflow-auto">
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {shownStats.map((stat) => (
            <StatsCard key={stat.id} stat={stat} />
          ))}
        </div>

        {/* Appointments */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Anstehende Termine</h2>
            <Button variant="ghost" size="sm" className="gap-1">
              Alle anzeigen <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {upcomingAppointments.slice(0, 4).map((appointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} />
            ))}
          </div>
        </div>

        {/* Cases */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Aktive Fälle</h2>
            <Button variant="ghost" size="sm" className="gap-1">
              Alle anzeigen <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {activeCases.slice(0, 4).map((caseItem) => (
              <CaseCard key={caseItem.id} {...caseItem} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
