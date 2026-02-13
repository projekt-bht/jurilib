'use client';

import { ArrowLeft, CalendarDays, ChevronDown } from 'lucide-react';
import { notFound, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useLoginContext } from '@/app/LoginContext';
import { AppointmentCard } from '@/components/Dashboard/_components/user/AppointmentCard';
import { calcActiveAppointments, fetchBackendData } from '@/components/Dashboard/helper';
import { Button } from '@/components/ui/button';
import type { LoginResource } from '@/services/Resources';
import { AppointmentStatus, type Appointment } from '~/generated/prisma/browser';

const appointmentColors: string[] = [
  'from-accent-blue/85 to-accent-purple/85',
  'from-accent-purple/85 to-accent-emerald/85',
  'from-accent-emerald/85 to-accent-amber/85',
  'from-accent-amber/85 to-accent-red/85',
];

export default function AppointmentPage() {
  const router = useRouter();
  const { login } = useLoginContext();
  const userId = (login as LoginResource).userId;

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRequestedOpen, setIsRequestedOpen] = useState(true);
  const [isConfirmedOpen, setIsConfirmedOpen] = useState(false);
  const [isFinishedOpen, setIsFinishedOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        if (!userId) {
          throw new Error('Benutzer-ID ist ungültig oder wurde nicht gefunden.');
        }

        const appointmentsRes = await fetchBackendData(
          '/appointment/user',
          userId,
          'Benutzertermine'
        );
        const appointmentsData: Appointment[] = await appointmentsRes.json();
        setAppointments(appointmentsData);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : 'Unbekannter Fehler beim Laden der Daten'
        );
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [login, userId]);

  if (error) {
    return notFound();
  }

  const requestedAppointments = appointments.filter(
    (appointment) => appointment.status === AppointmentStatus.REQUESTED
  );
  const confirmedAppointments = appointments.filter(
    (appointment) => appointment.status === AppointmentStatus.CONFIRMED
  );
  const finishedAppointments = appointments.filter(
    (appointment) =>
      appointment.status === AppointmentStatus.CANCELED ||
      appointment.status === AppointmentStatus.COMPLETED
  );

  const formatDateTime = (dateTime: string | Date) => {
    const date = new Date(dateTime);
    return {
      date: date.toLocaleDateString('de-DE'),
      time: date.toLocaleTimeString('de-DE', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
  };

  const isUpcoming = (dateTime: string | Date) => {
    return new Date(dateTime) > new Date();
  };

  return (
    <section id="appointments-page" className="bg-card">
      <div className="bg-card flex-1 w-full p-20 md:p-20 overflow-y-auto md:overflow-y-hidden">
        <div className="space-y-6">
          {/* Header */}
          <div className="mb-12 flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight mb-2">
                Meine Termine
              </h1>
              <p className="text-lg text-muted-foreground pl-5">
                {appointments.length} {appointments.length === 1 ? 'Termin' : 'Termine'} insgesamt
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 cursor-pointer"
              onClick={() => router.push('/')}
            >
              <ArrowLeft className="w-4 h-4" />
              Zurück
            </Button>
          </div>

          {/* Appointments Grid */}
          {appointments.length > 0 ? (
            <>
              <div>
                <button
                  type="button"
                  onClick={() => setIsRequestedOpen((prev) => !prev)}
                  className="flex w-full items-center justify-between text-left cursor-pointer"
                >
                  <h1 className="text-xl font-semibold text-foreground mb-4">
                    Angefragte Termine - {requestedAppointments.length}
                  </h1>
                  <ChevronDown
                    className={`w-5 h-5 text-foreground transition-transform duration-300 ${
                      isRequestedOpen ? 'rotate-180' : 'rotate-0'
                    }`}
                  />
                </button>
                {isRequestedOpen && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.isArray(requestedAppointments) && requestedAppointments.length > 0 ? (
                      requestedAppointments.map((appointment) => (
                        <AppointmentCard key={appointment.id} appointment={appointment} />
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Keine angefragten Termine vorhanden.
                      </p>
                    )}
                  </div>
                )}
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => setIsConfirmedOpen((prev) => !prev)}
                  className="flex w-full items-center justify-between text-left cursor-pointer"
                >
                  <h1 className="text-xl font-semibold text-foreground mb-4">
                    Bestätigte Termine - {confirmedAppointments.length}
                  </h1>
                  <ChevronDown
                    className={`w-5 h-5 text-foreground transition-transform duration-300 ${
                      isConfirmedOpen ? 'rotate-180' : 'rotate-0'
                    }`}
                  />
                </button>
                {isConfirmedOpen && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.isArray(confirmedAppointments) && confirmedAppointments.length > 0 ? (
                      confirmedAppointments.map((appointment) => (
                        <AppointmentCard key={appointment.id} appointment={appointment} />
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Keine bestätigten Termine vorhanden.
                      </p>
                    )}
                  </div>
                )}
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => setIsFinishedOpen((prev) => !prev)}
                  className="flex w-full items-center justify-between text-left cursor-pointer"
                >
                  <h1 className="text-xl font-semibold text-foreground mb-4">
                    Beendete / Abgesagte Termine - {finishedAppointments.length}
                  </h1>
                  <ChevronDown
                    className={`w-5 h-5 text-foreground transition-transform duration-300 ${
                      isFinishedOpen ? 'rotate-180' : 'rotate-0'
                    }`}
                  />
                </button>
                {isFinishedOpen && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.isArray(finishedAppointments) && finishedAppointments.length > 0 ? (
                      finishedAppointments.map((appointment) => (
                        <AppointmentCard key={appointment.id} appointment={appointment} />
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Keine beendeten oder abgesagten Termine vorhanden.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="bg-linear-to-r from-accent-blue-light/30 via-accent-blue-soft to-background p-12 md:p-16 text-center rounded-2xl shadow-md relative overflow-hidden">
              {/* Decorative background elements */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10" />
              <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-accent/5 rounded-full blur-3xl -z-10" />

              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-accent-blue/10 flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <CalendarDays className="w-8 h-8 text-accent-blue" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2">
                  Keine Termine vorhanden
                </h3>
                <p className="text-muted-foreground mb-6">
                  Du hast aktuell keine Termine. Buche jetzt deinen nächsten Termin bei einer
                  Anwaltskanzlei!
                </p>
                <Button
                  className="bg-accent-blue hover:bg-accent-blue/90 cursor-pointer shadow-sm"
                  onClick={() => router.push('/search')}
                >
                  Termin buchen
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
