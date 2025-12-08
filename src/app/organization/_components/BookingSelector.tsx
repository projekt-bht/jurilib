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

type BookingSelectorProps = {
  className?: string;
  selectedStaff?: { name: string } | null;
  bookingMode?: 'quick' | 'staff';
  onBookingModeChange?: (mode: 'quick' | 'staff') => void;
}; // props allow external control of layout, mode, and selected staff

/**
 * Accordion-style selector:
 * - Collapsed: shows current booking mode (quick / staff) with icon + subtitle.
 * - Expanded: shows two choice cards like in the reference.
 */
export function BookingSelector({
  className,
  selectedStaff = null,
  bookingMode: bookingModeProp,
  onBookingModeChange,
}: BookingSelectorProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [bookingModeState, setBookingModeState] = useState<'quick' | 'staff'>('quick');

  const bookingMode = bookingModeProp ?? bookingModeState;
  const setBookingMode = useMemo(
    () => onBookingModeChange ?? setBookingModeState,
    [onBookingModeChange]
  );

  const subtitle =
    bookingMode === 'quick'
      ? 'Nächster verfügbarer Termin'
      : selectedStaff
      ? selectedStaff.name
      : 'Person auswählen';

  return (
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
            'h-5 w-5 text-muted-foreground transition-transform',
            isOpen ? 'rotate-180' : 'rotate-0'
          )}
        />
      </button>

      {isOpen && (
        <ItemGroup className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Item
            onClick={() => setBookingMode('quick')}
            className={cn(
              'rounded-3xl border-2 p-4 shadow-[0_6px_18px_rgba(0,0,0,0.08)] cursor-pointer',
              bookingMode === 'quick'
                ? 'border-accent-black bg-accent-gray-soft'
                : 'border-accent-gray-light bg-accent-white'
            )}
          >
            <div className="flex items-start gap-4">
              <ItemMedia
                className={cn(
                  'flex h-12 w-12 items-center justify-center rounded-2xl',
                  bookingMode === 'quick'
                    ? 'bg-accent-black text-accent-white'
                    : 'bg-muted text-muted-foreground'
                )}
              >
                <Zap className="h-6 w-6" />
              </ItemMedia>
              <ItemContent className="gap-2 min-w-0">
                <ItemTitle className="text-xl font-bold text-foreground leading-tight">
                  Schnellbuchung
                </ItemTitle>
                <ItemDescription className="text-[11px] leading-4 text-muted-foreground">
                  Nächsten freien Termin bei unserer Organisation buchen
                </ItemDescription>
              </ItemContent>
            </div>
          </Item>

          <Item
            onClick={() => setBookingMode('staff')}
            className={cn(
              'rounded-3xl border-2 p-4 shadow-[0_6px_18px_rgba(0,0,0,0.06)] cursor-pointer',
              bookingMode === 'staff'
                ? 'border-accent-black bg-accent-gray-soft'
                : 'border-accent-gray-light bg-accent-white'
            )}
          >
            <div className="flex items-start gap-4">
              <ItemMedia
                className={cn(
                  'flex h-12 w-12 items-center justify-center rounded-2xl',
                  bookingMode === 'staff'
                    ? 'bg-accent-black text-accent-white'
                    : 'bg-muted text-muted-foreground'
                )}
              >
                <User className="h-6 w-6" />
              </ItemMedia>
              <ItemContent className="gap-2">
                <ItemTitle className="text-xl font-bold text-foreground leading-tight">
                  Mitarbeiter wählen
                </ItemTitle>
                <ItemDescription className="text-[11px] leading-4 text-muted-foreground">
                  Wählen Sie die gewünschte Person aus
                </ItemDescription>
              </ItemContent>
            </div>
          </Item>
        </ItemGroup>
      )}
    </div>
  );
}

export default BookingSelector;
