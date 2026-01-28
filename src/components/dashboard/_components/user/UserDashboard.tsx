import { ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';

import { useLoginContext } from '@/app/LoginContext';
import { Button } from '@/components/ui/button';
import type { LoginResource } from '@/services/Resources';
import type { User } from '~/generated/prisma/browser';
import { type Appointment, type Case } from '~/generated/prisma/browser';

import { AppointmentCard } from './AppointmentCard';
import { CaseCard } from './CaseCard';
import { StatCards } from './StatCards';

export function UserDashboard() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { login, setLogin } = useLoginContext();
  const userId = (login as LoginResource).userId;

  const [user, setUser] = useState<User | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [cases, setCases] = useState<Case[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch user data
        const userRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_ROOT}/user/${userId}`);
        setUser(await userRes.json());

        // Fetch appointments data
        const appointmentsRes = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_ROOT}/appointment/user/${userId}`
        );
        const appointmentsData: Appointment[] = await appointmentsRes.json();
        setAppointments(appointmentsData);

        // Fetch cases data
        const casesRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_ROOT}/case/user/${userId}`);
        const casesData: Case[] = await casesRes.json();
        setCases(casesData);
      } finally {
      }
    }

    fetchData();
  }, [userId]);

  return (
    <section id="user-dashboard" className="py-16 md:py-10 px-6 bg-background scroll-mt-24">
      <div className="bg-background flex-1 w-full p-8 md:p-9 overflow-y-auto">
        <div className="space-y-6">
          {/* Greeting */}
          <div className="mb-12">
            <h1 className="text-2xl md:text-2xl lg:text-4xl font-bold text-foreground tracking-tight mb-2">
              Willkommen zurück, {user?.firstname}!
            </h1>
            <p className="text-lg text-muted-foreground">
              {new Date().toLocaleDateString('de-DE', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>

          {/* Statistics */}
          <div className="w-4/5 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <StatCards cases={cases} />
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
              {Array.isArray(appointments)
                ? appointments
                    .slice(0, 4)
                    .map((appointment) => (
                      <AppointmentCard key={appointment.id} appointment={appointment} />
                    ))
                : null}
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
              {Array.isArray(cases)
                ? cases.slice(0, 4).map((caseItem) => <CaseCard key={caseItem.id} {...caseItem} />)
                : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
