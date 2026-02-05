import { ArrowLeft, Search, type LucideProps } from 'lucide-react';
import Link from 'next/link';
import type { ForwardRefExoticComponent, RefAttributes } from 'react';

import type { Appointment, Case } from '~/generated/prisma/browser';
import { AppointmentStatus, CaseStatus } from '~/generated/prisma/browser';
import { Button } from '../ui/button';

/**
 * Type definition for metrics/statistics displayed in the StatsCard component.
 * Used in the user dashboard to represent key user statistics.
 * @property id - Unique identifier for the statistic
 * @property title - Name of the statistic
 * @property statValue - Value of the statistic
 * @property iconColor - Specifies the color theme for the icon background and icon itself
 * @property Icon - Lucide icon component to be displayed
 */
export type Stats = {
  id: string;
  title: string;
  statValue: number;
  iconColor: string;
  Icon: ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>>;
};

/**
 * Helper function to calculate the number of active appointments for a user.
 * @param appointments Array containing complete user appointment data
 * @returns Number of active appointments
 */
export function calcActiveAppointments(appointments: Appointment[]): number {
  const completedAppointments = appointments.filter(
    (a) => a.status === AppointmentStatus.COMPLETED
  ).length;
  const canceledAppointments = appointments.filter(
    (a) => a.status === AppointmentStatus.CANCELED
  ).length;
  return appointments.length - (completedAppointments + canceledAppointments);
}

/**
 * Helper function to calculate the number of active cases for a user.
 * @param cases Array containing complete user case data
 * @returns Number of active cases
 */
export function calcActiveCases(cases: Case[]): number {
  return cases.filter((c) => c.status !== CaseStatus.COMPLETED).length;
}

export async function fetchBackendData(
  endpoint: string,
  id: string,
  errorInfo: string
): Promise<Response> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_ROOT}${endpoint}/${id}`, {
    cache: 'no-store',
  });

  // Call not-found.tsx page if resource is not found
  if (res.status === 404) {
    throw new Error(`Requested resource "${errorInfo}" not found`);
  }

  // If other errors occur, throw an error that is handled by the Error Boundary in error.tsx
  if (!res.ok) {
    throw new Error(`Failed to fetch data: ${res.statusText}`);
  }
  return res;
}

/**
 * Returns a not-found styled error component any error occurs during data fetching.
 * @param error - Error message to be displayed
 * @returns JSX.Element representing the not-found error page
 */
export function notFound(error: string) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-2xl w-full text-center space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-linear-to-br from-accent-blue-light to-accent-purple-light mb-4">
              <Search className="w-12 h-12 text-accent-gray" />
            </div>

            <h1 className="text-5xl font-bold text-foreground">{error}</h1>

            <p className="text-xl text-foreground leading-relaxed">
              Die von dir gesuchte Ressource existiert leider nicht, konnte nicht gefunden werden
              oder wurde entfernt. Bitte überprüfe die URL oder versuche es später erneut.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Link href="/">
              <Button size="lg" className="gap-2">
                <ArrowLeft className="w-5 h-5" />
                Zurück zur Startseite
              </Button>
            </Link>
          </div>

          <div className="pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Benötigen Sie Hilfe? Kontaktieren Sie uns unter{' '}
              <a href="mailto:support@jurilib.de" className="text-accent-blue hover:underline">
                support@jurilib.de
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
