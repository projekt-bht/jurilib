import { MapPin, Video } from 'lucide-react';
import { useEffect, useState } from 'react';

import type { Appointment } from '~/generated/prisma/browser';
import { AppointmentStatus } from '~/generated/prisma/browser';

function getAppointmentHeaderColor(status: AppointmentStatus): string {
  switch (status) {
    case AppointmentStatus.REQUESTED:
      return 'bg-accent-blue';
    case AppointmentStatus.CONFIRMED:
      return 'bg-accent-emerald';
    case AppointmentStatus.CANCELED:
      return 'bg-accent-red';
    default:
      return 'bg-accent-amber';
  }
}

export function AppointmentCard({ appointment }: { appointment: Appointment }) {
  const color = getAppointmentHeaderColor(appointment.status);

  // fetch backend data
  const [employeeName, setEmployeeName] = useState<string>('');
  const [organizationName, setOrganizationName] = useState<string>('');

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      try {
        const resEmployee = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_ROOT}employee/${appointment.employeeId}`,
          { cache: 'no-store' }
        );
        const employeeData = await resEmployee.json();

        if (!isMounted) return;

        setEmployeeName(`${employeeData.firstname} ${employeeData.lastname}`);

        const resOrganization = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_ROOT}organization/${employeeData.organizationId}`,
          { cache: 'no-store' }
        );
        const organizationData = await resOrganization.json();

        if (isMounted) {
          setOrganizationName(organizationData.name);
        }
      } catch (error) {
        // TODO: Handle error state
        console.error('Error fetching appointment data:', error);
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [appointment]);

  return (
    <div
      key={appointment.id}
      className="group relative bg-background
      rounded-2xl border border-border/60
      overflow-hidden shadow-sm
      hover:shadow-md transition-all
      duration-300 hover:scale-105 hover:-translate-y-2"
    >
      {/* Colored left border */}
      <div className={`absolute left-0 top-0 bottom-0 w-2 ${color}`} />

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
            className={`px-2.5 py-1 rounded-full text-xs font-semibold text-accent-white ${color}`}
          >
            {translateAppointmentStatus(appointment.status)}
          </span>
        </div>

        {/* Case info */}
        <p className="font-semibold text-sm text-foreground line-clamp-1 mb-1">
          {organizationName}
        </p>
        <p className="text-xs text-muted-foreground line-clamp-1 mb-3">{employeeName}</p>

        {/* Location */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {appointment.location ? (
            <>
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span className="line-clamp-1">{appointment.location}</span>
            </>
          ) : (
            <>
              <Video className="w-3.5 h-3.5 shrink-0" />
              <span>Online-Meeting</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function translateAppointmentStatus(status: AppointmentStatus): string {
  switch (status) {
    case AppointmentStatus.REQUESTED:
      return 'Angefragt';
    case AppointmentStatus.CONFIRMED:
      return 'Bestätigt';
    case AppointmentStatus.CANCELED:
      return 'Abgesagt';
    default:
      return 'Geplant';
  }
}
