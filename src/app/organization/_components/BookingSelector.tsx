'use client';

import { User, Zap } from 'lucide-react';
import { useMemo, useState } from 'react';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import type { Employee } from '~/generated/prisma/client';

export enum BookingMode {
  QUICK = 'quick',
  EMPLOYEE = 'employee',
}

type BookingSelectorProps = {
  className?: string;
  selectedEmployee?: Employee | null;
  bookingMode?: BookingMode;
  onBookingModeChange?: (mode: BookingMode) => void;
};
export default function BookingSelector({
  className,
  selectedEmployee = null,
  bookingMode: bookingModeProp,
  onBookingModeChange,
}: BookingSelectorProps) {
  const [bookingModeState, handleSetBookingModeState] = useState<'quick' | 'employee'>('quick'); // local booking mode fallback when parent doesn't control it

  const bookingMode = bookingModeProp ?? bookingModeState;
  // TODO: replace local state with server-driven defaults once booking preferences come from backend.
  const handleSetBookingMode = useMemo(
    () => onBookingModeChange ?? handleSetBookingModeState,
    [onBookingModeChange]
  );

  const subtitle =
    bookingMode === 'quick'
      ? 'Nächster verfügbarer Termin'
      : selectedEmployee
        ? selectedEmployee.lastname
        : 'Person auswählen';

  return (
    <div className={cn('space-y-2', className)}>
      {/* Tab toggle: pill container, active tab is white with shadow, icons per spec */}
      <Tabs
        value={bookingMode}
        onValueChange={(value) => handleSetBookingMode(value as BookingMode)}
        className="w-full"
      >
        <TabsList className="w-full rounded-full bg-accent-gray-soft p-1 shadow-inner">
          <TabsTrigger
            value={BookingMode.QUICK}
            className="rounded-full px-4 py-2 text-sm font-semibold data-[state=active]:bg-accent-white data-[state=active]:text-foreground data-[state=active]:shadow-sm data-[state=inactive]:text-muted-foreground"
          >
            <Zap className="h-4 w-4" />
            Schnellbuchung
          </TabsTrigger>
          <TabsTrigger
            value={BookingMode.EMPLOYEE}
            className="rounded-full px-4 py-2 text-sm font-semibold data-[state=active]:bg-accent-white data-[state=active]:text-foreground data-[state=active]:shadow-sm data-[state=inactive]:text-muted-foreground"
          >
            <User className="h-4 w-4" />
            Mitarbeiter*in
          </TabsTrigger>
        </TabsList>
      </Tabs>
      {/* Subtitle reflects current selection context (quick vs. employee) */}
      <p className="text-sm text-muted-foreground pl-1">{subtitle}</p>
    </div>
  );
}
