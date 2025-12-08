'use client';

import { useMemo, useState } from 'react';
import { de } from 'date-fns/locale';
import { Calendar as CalendarIcon, Clock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

import type { Employee } from '~/generated/prisma/client';

import BookingSelector from './BookingSelector';
import { useBookingSchedule } from './useBookingSchedule';

type CalendarWithTimeProps = {
  onChange?: (selection: { date?: Date; time?: string | null }) => void;
};
// Placeholder employee data
type EmployeeCard = Pick<Employee, 'id' | 'name' | 'position'> & {
  specialties: string[];
  avatar?: string | null;
};
/* TODO: replace mockStaff with real employee data once the backend API is ready */
const mockStaff: EmployeeCard[] = [
  {
    id: '1',
    name: 'Anna Schmidt',
    position: 'Rechtsanwältin',
    specialties: ['Familienrecht', 'Arbeitsrecht'],
    avatar: null,
  },
  {
    id: '2',
    name: 'Lukas Meyer',
    position: 'Jurist',
    specialties: ['Vertragsrecht', 'Gesellschaftsrecht'],
    avatar: null,
  },
  {
    id: '3',
    name: 'Sofia Keller',
    position: 'Beraterin',
    specialties: ['Compliance', 'Datenschutz'],
    avatar: null,
  },
];

/**
 * Calendar widget with date/time selection plus booking flow state; emits combined selection via onChange.
 */
export function CalendarWithTime({ onChange }: CalendarWithTimeProps) {
  /* TODO: wire this to the real backend data model once the API is ready */
  const {
    selectedDate,
    selectedTime,
    availableSlots,
    slotsLoading,
    isBooking,
    statusMessage,
    setDate,
    selectTime,
    confirmBooking,
  } = useBookingSchedule();

  const [bookingMode, setBookingMode] = useState<'quick' | 'staff'>('quick'); // track current booking mode (quick/staff)
  const [selectedStaff, setSelectedStaff] = useState<EmployeeCard | null>(null); // currently chosen employee (null for quick mode)

  const today = useMemo(() => new Date(), []); // cache today's date so it doesn't change across renders; useMemo avoids new Date() on every render
  const germanLocale = useMemo(() => de, []); // reuse locale object instead of recreating per render; useMemo keeps it stable for DayPicker

  const isDisabledDay = (date: Date) => {
    const midnight = new Date(today);
    midnight.setHours(0, 0, 0, 0);
    const weekday = date.getDay();
    const isWeekend = weekday === 0 || weekday === 6;
    return date < midnight || isWeekend;
  };

  const handleChange = (date?: Date, time?: string | null) => {
    onChange?.({
      date: date ?? selectedDate,
      time: time ?? selectedTime,
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-3xl font-bold">Termin buchen</h2>
        <p className="text-base text-muted-foreground">
          Wählen Sie einen passenden Termin für Ihre Beratung
        </p>
      </div>

      <BookingSelector
        bookingMode={bookingMode}
        onBookingModeChange={(mode) => setBookingMode(mode)}
        selectedStaff={selectedStaff}
      />

      {bookingMode === 'staff' && (
        <div className="mb-6 rounded-xl border border-border bg-accent-white p-4 shadow-sm">
          <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
            <User className="w-5 h-5" />
            Wählen Sie einen Mitarbeiter
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {mockStaff.map((staff) => (
              <button
                key={staff.id}
                onClick={() => {
                  setSelectedStaff(staff);
                }}
                className={cn(
                  // cn merges the base classes with either the active or inactive variant; keeps the card markup clean while toggling selection state
                  'p-4 rounded-xl border-2 transition-all duration-200 text-left',
                  selectedStaff?.id === staff.id
                    ? 'border-accent-black bg-accent-gray-soft shadow-md'
                    : 'border-border hover:border-primary/50 bg-accent-white'
                )}
              >
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-full bg-accent-gray-soft text-muted-foreground flex items-center justify-center">
                    <User className="w-7 h-7" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-foreground mb-1">{staff.name}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{staff.position}</p>
                    <div className="flex flex-wrap gap-1">
                      {staff.specialties.map((specialty) => (
                        <span
                          key={specialty}
                          className="px-2 py-1 bg-accent-gray-soft text-muted-foreground text-[11px] rounded-full border border-accent-gray-light"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center gap-2">
        <CalendarIcon className="h-5 w-5" />
        <span className="text-lg font-semibold">Wählen Sie ein Datum</span>
      </div>
      <div className="rounded-md shadow-sm bg-accent-gray-soft p-4 space-y-4">
        <Calendar
          mode="single"
          today={today}
          locale={germanLocale}
          selected={selectedDate}
          onSelect={(date) => {
            setDate(date);
            handleChange(date, null);
          }}
          disabled={isDisabledDay}
          className="bg-transparent"
          // classNames customized to mirror the reference design: centered/bold caption, spaced nav, roomy day cells, visible today ring, muted disabled days, and hover affordances
          /* https://daypicker.dev/docs/styling */
          classNames={{
            months: '', // keep empty to preserve layout spacing; removing it shifts the nav arrows
            month: 'w-full',
            caption: '',
            caption_label: 'mb-14 font-bold text-2xl',
            nav: 'flex justify-between ',
            button_previous: ' hover:bg-accent-white rounded-lg p-2',
            button_next: ' hover:bg-accent-white rounded-lg p-2',
            table: 'w-full',
            day: 'bg-accent-white m-2 rounded-lg w-15 h-16 hover:bg-accent-gray-light hover:cursor-pointer hover:border hover:border-accent-gray-light',
            today:
              '!bg-accent-white !border-2 !border-accent-gray !text-foreground font-bold rounded ring-1 ring-accent-gray ring-offset-1 ring-offset-transparent data-[selected=true]:ring-0',

            disabled:
              '!bg-transparent !border-none !shadow-none !outline-none text-muted-foreground !cursor-not-allowed hover:!bg-transparent hover:!border-none hover:!shadow-none hover:!outline-none hover:!cursor-not-allowed',
          }}
        />

        <div className="flex items-center gap-6 px-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded border-2 border-accent-gray" />
            <span>Heute</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="inline-flex h-5 w-5 rounded bg-accent-black" />
            <span>Ausgewählt</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="inline-flex h-5 w-5 rounded bg-accent-gray-light" />
            <span>Nicht verfügbar</span>
          </div>
        </div>
      </div>

      {selectedDate && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            <span className="text-lg font-semibold">Wählen Sie eine Uhrzeit</span>
          </div>
          <p className="text-sm font-medium text-foreground">
            {slotsLoading ? 'Termine werden geladen ...' : 'Verfügbare Zeiten'}
          </p>

          <div className="grid grid-cols-4 gap-2">
            {availableSlots.map((slot) => {
              const isSelected = selectedTime === slot;

              return (
                <Button
                  key={slot}
                  variant={isSelected ? 'default' : 'outline'}
                  className="m-2 rounded-lg p-2"
                  onClick={() => {
                    selectTime(slot);
                    handleChange(undefined, slot);
                  }}
                >
                  {slot}
                </Button>
              );
            })}
          </div>

          <div className="space-y-2 pt-2">
            <Button
              className="w-full"
              disabled={!selectedDate || !selectedTime || isBooking}
              onClick={confirmBooking}
            >
              {isBooking ? 'Termin wird bestätigt...' : 'Termin bestätigen'}
            </Button>
            {statusMessage && (
              <p className="text-center text-sm text-muted-foreground">{statusMessage}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function OrganizationCalendar(props: CalendarWithTimeProps) {
  return <CalendarWithTime {...props} />;
}
