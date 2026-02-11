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
      ? 'Alle freien Termine auf einen Blick – wähle einfach ein Datum.'
      : 'Wähle zuerst eine Mitarbeiter*in, danach erscheint der Kalender.'; //hier kommt hannes text rein
  const subtitleClassName = 'text-foreground';

  return (
    <div className={`space-y-2 ${className ?? ''}`}>
      {/* Tab toggle: pill container, active tab is white with shadow, icons per spec */}
      <Tabs
        value={bookingMode}
        onValueChange={(value) => handleSetBookingMode(value as BookingMode)}
        className="w-full"
      >
        <TabsList className="w-full rounded-lg bg-accent-gray-soft p-1 shadow-inner !h-16 items-stretch">
          <TabsTrigger
            value={BookingMode.QUICK}
            className="h-full rounded-lg px-4 py-0 text-sm font-semibold data-[state=active]:bg-accent-white data-[state=active]:text-foreground data-[state=active]:shadow-sm data-[state=inactive]:text-muted-foreground h-14"
          >
            <CalendarDays className="h-4 w-4" />
            Alle Termine
          </TabsTrigger>
          <TabsTrigger
            value={BookingMode.EMPLOYEE}
            className="h-full rounded-lg px-4 py-0 text-sm font-semibold data-[state=active]:bg-accent-white data-[state=active]:text-foreground data-[state=active]:shadow-sm data-[state=inactive]:text-muted-foreground h-14"
          >
            <User className="h-4 w-4" />
            Mitarbeiter*in
          </TabsTrigger>
        </TabsList>
      </Tabs>
      {/* Friendly hint, centered below tabs for clarity */}
      <div className="flex justify-center">
        <p className={`text-sm ${subtitleClassName} bg-accent-gray-soft px-3 py-1.5 rounded-full`}>
          {subtitle}
        </p>
      </div>
    </div>
  );
}
