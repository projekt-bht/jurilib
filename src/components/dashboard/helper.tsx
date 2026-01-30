import type { LucideProps } from 'lucide-react';
import type { ForwardRefExoticComponent, RefAttributes } from 'react';

import type { Appointment, Case } from '~/generated/prisma/browser';
import { AppointmentStatus, CaseStatus } from '~/generated/prisma/browser';

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
