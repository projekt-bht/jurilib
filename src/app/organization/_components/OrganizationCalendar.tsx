'use client';

import { useMemo } from 'react';
import { de } from 'date-fns/locale';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Zap,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';

import { useBookingSchedule } from './useBookingSchedule';

type CalendarWithTimeProps = {
  onChange?: (selection: { date?: Date; time?: string | null }) => void;
};

/**
 * Reusable calendar widget that pairs a single-day picker with predefined slot
 * buttons. Consumers receive the combined state through the onChange callback.
 */
export function CalendarWithTime({ onChange }: CalendarWithTimeProps) {
  /* TODO:
      use database model after implementation
  */
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

  const today = useMemo(() => new Date(), []);
  const germanLocale = useMemo(() => de, []);

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
      <div className="flex items-center gap-2">
        <CalendarIcon className="h-5 w-5" />
        <span className="text-lg font-semibold">Wählen Sie ein Datum</span>
      </div>
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
        className="rounded-md border shadow-sm bg-accent-gray-soft"
        classNames={{
          months: '',
          month: '',
          caption: '',
          caption_label: '',
          nav: '',
          nav_button: '',
          nav_button_previous: '',
          nav_button_next: '',
          table: '',
          head_row: '',
          head_cell: '',
          row: '',
          cell: '',
          day: 'bg-white m-2 rounded-lg p-2 hover:bg-accent-gray-light hover:cursor-pointer hover:border hover:border-gray-400',
          day_selected: '',
          today: 'border-2 border-gray-400 bg-white font-bold rounded',
          day_outside: '',
          disabled:
            '!bg-transparent !border-none !shadow-none !outline-none text-gray-300 hover:!bg-transparent hover:!border-none hover:!shadow-none hover:!outline-none hover:cursor-not-allowed',
          day_range_middle: '',
          day_hidden: '',
        }}
      />

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
                  className="w-full"
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
