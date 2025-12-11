'use client';

import { ChevronDown, User, Zap } from 'lucide-react';
import { useMemo, useState } from 'react';

import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item';
import { cn } from '@/lib/utils';

import type { EmployeeCard } from './OrganizationCalendar';

type BookingSelectorProps = {
  className?: string;
  selectedEmployee?: EmployeeCard | null;
  bookingMode?: 'quick' | 'employee';
  onBookingModeChange?: (mode: 'quick' | 'employee') => void;
}; // props allow external control of layout, mode, and selected staff

/**
 * Accordion-style selector:
 * - Collapsed: shows current booking mode (quick / staff) with icon + subtitle.
 * - Expanded: shows two choice cards like in the reference.
 */
export default function BookingSelector({
  className,
  selectedEmployee = null,
  bookingMode: bookingModeProp,
  onBookingModeChange,
}: BookingSelectorProps) {
  const [isOpen, setIsOpen] = useState(false); // controls accordion open/closed state
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
      ? selectedEmployee.name
      : 'Person auswählen';

  return (
    // cn merges our default spacing with any external className passed in
    <div className={cn('space-y-4', className)}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full rounded-xl border border-border bg-accent-white px-4 py-3 shadow-sm flex items-center justify-between"
      >
        <div className="flex items-center gap-3 text-left">
          <div className="p-1.5 rounded-lg bg-primary text-primary-foreground">
            {bookingMode === 'quick' ? <Zap className="w-4 h-4" /> : <User className="w-4 h-4" />}
          </div>
          <div className="text-left">
            <h3 className="text-lg font-bold text-foreground">
              {bookingMode === 'quick' ? 'Schnellbuchung' : 'Mitarbeiter wählen'}
            </h3>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </div>
        </div>
        <ChevronDown
          className={cn(
            // cn combines the base icon styles with rotation when open/closed
            'h-5 w-5 text-muted-foreground transition-transform',
            isOpen ? 'rotate-180' : 'rotate-0'
          )}
        />
      </button>

      {isOpen && (
        <ItemGroup className="grid grid-cols-1 gap-4 l:grid-cols-2">
          <Item
            onClick={() => handleSetBookingMode('quick')}
            className={cn(
              // base card styles + variant for active/inactive quick mode
              'rounded-3xl border-2 shadow-[0_6px_18px_rgba(0,0,0,0.08)] cursor-pointer',
              bookingMode === 'quick'
                ? 'border-accent-blue-light bg-accent-gray-soft'
                : 'border-accent-gray-light bg-accent-white'
            )}
          >
            <div className="flex items-start gap-4">
              <ItemMedia
                className={cn(
                  // icon pill switches between active black and muted gray
                  'flex h-12 w-12 items-center justify-center rounded-2xl',
                  bookingMode === 'quick'
                    ? 'bg-accent-black text-accent-white'
                    : 'bg-accent-gray-soft text-muted-foreground'
                )}
              >
                <Zap className="h-4 w-4" />
              </ItemMedia>
              <ItemContent className="gap-2 min-w-0">
                <ItemTitle className="text-l font-bold text-foreground leading-tight">
                  Schnellbuchung
                </ItemTitle>
              </ItemContent>
            </div>
          </Item>

          <Item
            onClick={() => handleSetBookingMode('employee')}
            className={cn(
              // base card styles + variant for active/inactive employee mode
              'rounded-3xl border-2 p-4 shadow-[0_6px_18px_rgba(0,0,0,0.06)] cursor-pointer',
              bookingMode === 'employee'
                ? 'border-accent-blue-light bg-accent-gray-soft'
                : 'border-accent-gray-light bg-accent-white'
            )}
          >
            <div className="flex items-start gap-4">
              <ItemMedia
                className={cn(
                  // icon pill switches between active black and muted gray
                  'flex h-12 w-12 items-center justify-center rounded-2xl',
                  bookingMode === 'employee'
                    ? 'bg-accent-black text-accent-white'
                    : 'bg-accent-gray-soft text-muted-foreground'
                )}
              >
                <User className="h-6 w-6" />
              </ItemMedia>
              <ItemContent className="gap-2">
                <ItemTitle className="text-xl font-bold text-foreground leading-tight">
                  Mitarbeiter wählen
                </ItemTitle>
                <ItemDescription className="text-[11px] leading-4 text-muted-foreground">
                  Wähle die gewünschte Person aus
                </ItemDescription>
              </ItemContent>
            </div>
          </Item>
        </ItemGroup>
      )}
    </div>
  );
}

