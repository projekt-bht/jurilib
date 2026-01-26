import { MapPin, Video } from 'lucide-react';

import { cn } from '@/lib/utils';
import type { Appointment } from '~/generated/prisma/browser';
import { AppointmentStatus } from '~/generated/prisma/browser';

function getAppointmentHeaderColor(status: AppointmentStatus): {
  color: string;
  lightColor: string;
} {
  switch (status) {
    case AppointmentStatus.REQUESTED:
      return { color: 'bg-accent-blue', lightColor: 'bg-accent-blue-light' };
    case AppointmentStatus.CONFIRMED:
      return { color: 'bg-accent-emerald', lightColor: 'bg-accent-emerald-light' };
    case AppointmentStatus.CANCELED:
      return { color: 'bg-accent-red', lightColor: 'bg-accent-red-light' };
    default:
      return { color: 'bg-accent-amber', lightColor: 'bg-accent-amber-light' };
  }
}

export function AppointmentCard({ appointment }: { appointment: Appointment }) {
  const { color, lightColor } = getAppointmentHeaderColor(appointment.status);
  return (
    <div
      key={appointment.id}
      className="bg-background rounded-2xl border border-border overflow-hidden shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
    >
      {/* Header with fixed height and colored background */}
      <div
        className={cn(
          'px-4 py-3 h-14 flex items-center justify-between border-b border-border drop-shadow-sm',
          lightColor
        )}
      >
        {/* Date and Time */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-foreground">
            {appointment.dateTimeStart.toLocaleDateString('de-DE', {
              day: 'numeric',
              month: 'short',
            })}
          </span>
          <span className="text-sm text-accent-gray">
            {appointment.dateTimeStart.toLocaleTimeString('de-DE', {
              hour: '2-digit',
              minute: '2-digit',
            })}{' '}
            Uhr
          </span>
        </div>

        {/* Status Badge */}
        <span
          className={cn('px-2.5 py-1 rounded-full text-xs font-semibold text-accent-white ', color)}
        >
          {appointment.status.replace('_', ' ')}
        </span>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div>
          <p className="font-semibold text-sm line-clamp-1">TITEL DES TERMINS</p>
          <p className="text-xs text-muted-foreground line-clamp-1">EMPLOYEENAME</p>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-foreground">
          {appointment.location ? (
            <>
              <MapPin className="w-3.5 h-3.5 shrink-0 " />
              <span className="line-clamp-1">{appointment.location}</span>
            </>
          ) : (
            <>
              <Video className="w-3.5 h-3.5 shrink-0" />
              <span>Online-Meeting</span>
            </>
          )}
        </div>

        {appointment.notes && (
          <p className="text-xs text-foreground bg-accent-gray/10 rounded-lg px-3 py-2 line-clamp-2 border border-border">
            {appointment.notes}
          </p>
        )}
      </div>
    </div>
  );
}
