import {
  ArrowLeft,
  CalendarDays,
  ChevronRight,
  FolderOpen,
  Link,
  Plus,
  Search,
} from 'lucide-react';
import { useEffect, useState } from 'react';

import { useLoginContext } from '@/app/LoginContext';
import { Button } from '@/components/ui/button';
import type { LoginResource } from '@/services/Resources';
import type { User } from '~/generated/prisma/browser';
import { type Appointment, type Case } from '~/generated/prisma/browser';

import { calcActiveAppointments, calcActiveCases, fetchBackendData, notFound } from '../../helper';
import { AppointmentCard } from './AppointmentCard';
import { CaseCard } from './CaseCard';
import { StatCards } from './StatCards';

export function UserDashboard() {
  const { login } = useLoginContext();
  const userId = (login as LoginResource).userId;

  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [activeAppointments, setActiveAppointments] = useState<number>(0);
  const [cases, setCases] = useState<Case[]>([]);
  const [activeCases, setActiveCases] = useState<number>(0);

  const caseColors: string[] = [
    'from-accent-red/85 to-accent-purple/85',
    'from-accent-purple/85 to-accent-blue/85',
    'from-accent-blue/85 to-accent-emerald/85',
    'from-accent-amber/85 to-accent-red/85',
  ];

  useEffect(() => {
    async function fetchData() {
      try {
        if (!userId) {
          throw new Error('Benutzer-ID ist ungültig oder wurde nicht gefunden.');
        }
        // Fetch user data
        const userRes = await fetchBackendData('/user', userId, 'Benutzerinformationen');
        setUser(await userRes.json());

        // Fetch appointments data
        const appointmentsRes = await fetchBackendData(
          '/appointment/user',
          userId,
          'Benutzertermine'
        );
        const appointmentsData: Appointment[] = await appointmentsRes.json();
        setAppointments(appointmentsData);
        setActiveAppointments(calcActiveAppointments(appointmentsData));

        // Fetch cases data
        const casesRes = await fetchBackendData('/case/user', userId, 'Benutzerfälle');
        const casesData: Case[] = await casesRes.json();
        setCases(casesData);
        setActiveCases(calcActiveCases(casesData));
      } catch (error) {
        setError(
          error instanceof Error ? error.message : 'Unbekannter Fehler beim Laden der Daten'
        );
      }
    }

    fetchData();
  }, [login, userId]);

  if (error) {
    return notFound(error);
  }

  return (
    <section id="user-dashboard" className="bg-card">
      <div className="bg-card flex-1 w-full p-20 md:p-20 overflow-y-auto md:overflow-y-hidden">
        <div className="space-y-6">
          {/* Greeting */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tight mb-2">
              Willkommen zurück, {user?.firstname}!
            </h1>
            <p className="text-lg text-muted-foreground pl-5">
              {new Date().toLocaleDateString('de-DE', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <StatCards cases={cases} />
          </div>

          {/* Appointments */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold pl-2">Anstehende Termine</h2>

              <Button
                variant="ghost"
                size="sm"
                className="gap-1 cursor-pointer
                relative after:absolute
                after:bottom-0 after:left-0
                after:w-0 after:h-0.5 
                after:bg-accent-blue/50
                after:transition-all 
                after:duration-500 
                hover:after:w-full"
              >
                Alle anzeigen <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            {activeAppointments > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array.isArray(appointments)
                  ? appointments
                      .slice(0, 4)
                      .map((appointment) => (
                        <AppointmentCard key={appointment.id} appointment={appointment} />
                      ))
                  : null}
              </div>
            ) : (
              <div className="bg-linear-to-r from-accent-blue-light/30 via-accent-blue-soft to-background p-12 md:p-16 text-center rounded-2xl shadow-md">
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10" />
                <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-accent/5 rounded-full blur-3xl -z-10" />

                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-accent-blue/10 flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <CalendarDays className="w-8 h-8 text-accent-blue" />
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2">
                    Keine anstehenden Termine
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Du hast aktuell keine Termine. Buche jetzt deinen nächsten Termin!
                  </p>
                  <Button className="bg-accent-blue hover:bg-accent-blue/90 cursor-pointer shadow-sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Termin vereinbaren
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Cases */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold pl-2">Aktive Fälle</h2>
              <Button
                variant="ghost"
                size="sm"
                className="gap-1 cursor-pointer
                relative after:absolute
                after:bottom-0 after:left-0
                after:w-0 after:h-0.5 
                after:bg-accent-blue/50
                after:transition-all 
                after:duration-500 
                hover:after:w-full"
              >
                Alle anzeigen <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            {activeCases > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array.isArray(cases)
                  ? cases
                      .slice(0, 4)
                      .map((caseItem, index) => (
                        <CaseCard
                          key={caseItem.id}
                          color={caseColors[index % caseColors.length]}
                          caseItem={caseItem}
                        />
                      ))
                  : null}
              </div>
            ) : (
              <div className="bg-linear-to-r from-accent-blue-light/30 via-accent-blue-soft to-background p-12 md:p-16 text-center rounded-2xl shadow-md">
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10" />
                <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-accent/5 rounded-full blur-3xl -z-10" />

                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-accent-blue/10 flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <FolderOpen className="w-8 h-8 text-accent-blue" />
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2">
                    Keine aktiven Fälle
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    <span>Du hast aktuell keine aktiven Fälle die bearbeitet werden.</span>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
