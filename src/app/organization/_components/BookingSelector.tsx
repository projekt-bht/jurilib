'use client';

import { useState } from 'react';
import { Calendar as CalendarIcon, Clock, User, Zap, ChevronDown } from 'lucide-react';

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
};

/**
 * Accordion-style selector:
 * - Collapsed: shows current booking mode (quick / staff) with icon + subtitle.
 * - Expanded: shows two choice cards like in the reference.
 */
export function BookingSelector({ className, selectedStaff = null }: BookingSelectorProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [bookingMode, setBookingMode] = useState<'quick' | 'staff'>('quick');

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
        className="w-full rounded-xl border border-border bg-accent-white px-4 py-2.5 shadow-sm flex items-center justify-between"
      >
        <div className="flex items-center gap-3 text-left">
          <div className="p-1.5 rounded-lg bg-primary text-primary-foreground">
            {bookingMode === 'quick' ? <Zap className="w-4 h-4" /> : <User className="w-4 h-4" />}
          </div>
          <div className="text-left">
            <h3 className="text-base font-semibold text-foreground leading-tight">
              {bookingMode === 'quick' ? 'Schnellbuchung' : 'Mitarbeiter wählen'}
            </h3>
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          </div>
        </div>
        <ChevronDown
          className={cn(
            'h-4 w-4 text-muted-foreground transition-transform',
            isOpen ? 'rotate-180' : 'rotate-0'
          )}
        />
      </button>

      {isOpen && (
        <ItemGroup className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Item
            onClick={() => setBookingMode('quick')}
            className={cn(
              'rounded-3xl border-2 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.12)] cursor-pointer',
              bookingMode === 'quick'
                ? 'border-accent-black bg-accent-gray-soft'
                : 'border-accent-gray-light bg-accent-white'
            )}
          >
            <div className="flex items-center gap-5">
              <ItemMedia className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-black text-accent-white">
                <Zap className="h-8 w-8" />
              </ItemMedia>
              <ItemContent className="gap-2">
                <ItemTitle className="text-xl font-bold text-foreground leading-tight">
                  Schnellbuchung
                </ItemTitle>
                <ItemDescription className="text-m leading-8 text-muted-foreground">
                  Buchen Sie den nächsten verfügbaren Termin bei unserer Organisation
                </ItemDescription>
              </ItemContent>
            </div>
          </Item>

          <Item
            onClick={() => setBookingMode('staff')}
            className={cn(
              'rounded-3xl border-2 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.08)] cursor-pointer',
              bookingMode === 'staff'
                ? 'border-accent-black bg-accent-gray-soft'
                : 'border-accent-gray-light bg-accent-white'
            )}
          >
            <div className="flex items-center gap-5">
              <ItemMedia className="flex h-18 w-18 items-center justify-center rounded-2xl bg-accent-gray-soft text-muted-foreground">
                <User className="h-8 w-8" />
              </ItemMedia>
              <ItemContent className="gap-3">
                <ItemTitle className="text-3xl font-bold text-foreground leading-tight">
                  Mitarbeiter wählen
                </ItemTitle>
                <ItemDescription className="text-xl leading-8 text-muted-foreground">
                  Wählen Sie eine bestimmte Person für Ihren Termin aus
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
