import { MapPin, Video } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import type { Appointment } from '~/generated/prisma/browser';
import { AppointmentStatus } from '~/generated/prisma/browser';

import { fetchBackendData, notFound } from '../../helper';

export function AppointmentCard({ appointment }: { appointment: Appointment }) {
  const router = useRouter();
  const status = statusToTextAndColor(appointment.status);

  // fetch backend data
  const [employeeName, setEmployeeName] = useState<string>('');
  const [organizationName, setOrganizationName] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const resEmployee = await fetchBackendData('employee', appointment.employeeId, 'Employee');
        const employeeData = await resEmployee.json();
        setEmployeeName(`${employeeData.firstname} ${employeeData.lastname}`);

        const resOrganization = await fetchBackendData(
          'organization',
          employeeData.organizationId,
          'Organization'
        );
        const organizationData = await resOrganization.json();
        setOrganizationName(organizationData.name);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Unknown error occurred');
      }
    }

    fetchData();
  }, [appointment]);

  if (error) {
    return notFound(error);
  }

  return (
    <div
      id={appointment.id}
      onClick={() => router.push(`/appointment/${appointment.id}`)}
      key={appointment.id}
      className="group relative bg-background
      rounded-2xl border border-border/60
      overflow-hidden shadow-sm
      hover:shadow-md transition-all
      duration-300 hover:scale-105 hover:-translate-y-2
      cursor-pointer"
    >
      {/* Colored left border */}
      <div className={`absolute left-0 top-0 bottom-0 w-2 ${status.color}`} />

      {/* Content */}
      <div className="p-4 pl-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-foreground">
              {new Date(appointment.dateTimeStart).toLocaleDateString('de-DE', {
                day: 'numeric',
                month: 'short',
              })}
            </span>
            <span className="text-sm text-primary">
              {new Date(appointment.dateTimeStart).toLocaleTimeString('de-DE', {
                hour: '2-digit',
                minute: '2-digit',
              })}{' '}
              Uhr
            </span>
          </div>
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-semibold text-accent-white ${status.color}`}
          >
            {status.content}
          </span>
        </div>

        {/* Case info */}
        <p className="font-semibold text-sm text-foreground line-clamp-1 mb-1">
          {organizationName}
        </p>
        <p className="text-xs text-muted-foreground line-clamp-1 mb-3">{employeeName}</p>

        {/* Location */}
        <div className="flex items-center gap-2 text-xs text-foreground">
          {appointment.location ? (
            <>
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span className="line-clamp-1">{appointment.location}</span>
            </>
          ) : appointment.meetingLink ? (
            <a
              href={appointment.meetingLink || undefined}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <Video className="w-3.5 h-3.5 shrink-0" />
              <span>Online-Meeting</span>
            </a>
          ) : (
            <>
              <Video className="w-3.5 h-3.5 shrink-0" />
              <span>Online-Meeting</span>
            </>
          )}
        </div>
        {/* Notes */}
        <div className="bg-accent-white/10 rounded-lg mt-4">
          <h4 className="text-xs font-semibold text-foreground mb-1">Infos an dich:</h4>
          <p className="text-xs text-muted-foreground line-clamp-3">
            {appointment.notes ?? 'Keine Infos vorhanden.'}
          </p>
        </div>
      </div>
    </div>
  );
}

// TODO: Combine to one Function called: blablapups
function statusToTextAndColor(status: AppointmentStatus): { content: string; color: string } {
  switch (status) {
    case AppointmentStatus.REQUESTED:
      return { content: 'Angefragt', color: 'bg-accent-blue' };
    case AppointmentStatus.CONFIRMED:
      return { content: 'Bestätigt', color: 'bg-accent-emerald' };
    case AppointmentStatus.CANCELED:
      return { content: 'Abgesagt', color: 'bg-accent-red' };
    default:
      return { content: 'Geplant', color: 'bg-accent-amber' };
  }
}
