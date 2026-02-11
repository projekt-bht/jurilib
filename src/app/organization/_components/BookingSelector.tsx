'use client';

import { CalendarDays, User } from 'lucide-react';
import { useState } from 'react';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  selectedEmployee: _selectedEmployee = null,
  bookingMode: bookingModeProp,
  onBookingModeChange,
}: BookingSelectorProps) {
  const [bookingModeState, handleSetBookingModeState] = useState<'quick' | 'employee'>('quick'); // local booking mode fallback when parent doesn't control it

  const bookingMode = bookingModeProp ?? bookingModeState;
  // TODO: replace local state with server-driven defaults once booking preferences come from backend.
  const handleSetBookingMode = (mode: BookingMode) => {
    if (onBookingModeChange) {
      onBookingModeChange(mode);
      return;
    }
    handleSetBookingModeState(mode);
  };

  const subtitle =
    bookingMode === 'quick'
      ? 'Alle freien Termine auf einen Blick. Buche schnell und unkompliziert deinen Wunschtermin.'
      : 'Du möchtest einen Termin bei einer bestimmten Mitarbeiter*in buchen? Kein Problem, du hast die Wahl.';
  const subtitleClassName = 'text-muted-foreground';

  return (
    <div className={`space-y-2 ${className ?? ''}`}>
      {/* Tab toggle: pill container, active tab is white with shadow, icons per spec */}
      <Tabs
        value={bookingMode}
        onValueChange={(value) => handleSetBookingMode(value as BookingMode)}
        className="w-full"
      >
        <TabsList className="w-full rounded-lg bg-accent-gray-soft p-1 shadow-inner h-16! items-stretch">
          <TabsTrigger
            value={BookingMode.QUICK}
            className="h-full rounded-lg px-4 py-0 text-sm font-semibold data-[state=active]:bg-accent-white data-[state=active]:text-foreground data-[state=active]:shadow-sm data-[state=inactive]:text-muted-foreground"
          >
            <CalendarDays className="h-5 w-5" />
            <span className="ml-2 font-bold">Alle Termine</span>
          </TabsTrigger>
          <TabsTrigger
            value={BookingMode.EMPLOYEE}
            className="h-full rounded-lg px-4 py-0 text-sm font-semibold data-[state=active]:bg-accent-white data-[state=active]:text-foreground data-[state=active]:shadow-sm data-[state=inactive]:text-muted-foreground"
          >
            <User className="h-5 w-5" />
            <span className="ml-2 font-bold">Mitarbeiter*innen</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>
      {/* Friendly hint, centered below tabs for clarity */}
      <div className="flex justify-center items-center">
        <p
          className={`text-sm font-medium ${subtitleClassName} text-center px-3 py-1.5 rounded-full`}
        >
          {subtitle}
        </p>
      </div>
    </div>
  );
}
