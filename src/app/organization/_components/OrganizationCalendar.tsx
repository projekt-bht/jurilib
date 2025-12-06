'use client';

import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';

import { useBookingSchedule } from './useBookingSchedule';
/*import { Calendar, Clock, User, Zap, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react"*/

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

  const isDisabledDay = (date: Date) => {
    const midnight = new Date(today);
    midnight.setHours(0, 0, 0, 0);
    return date < midnight;
  };

  const handleChange = (date?: Date, time?: string | null) => {
    onChange?.({
      date: date ?? selectedDate,
      time: time ?? selectedTime,
    });
  };

  return (
    <div className="space-y-6">
      <Calendar
        mode="single"
        today={today}
        selected={selectedDate}
        onSelect={(date) => {
          setDate(date);
          handleChange(date, null);
        }}
        disabled={isDisabledDay}
        className="rounded-md border shadow-sm [--cell-size:--spacing(11)]"
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
          day: '',
          day_selected: '',
          today: 'border-2 border-gray-400 bg-white font-bold rounded',
          day_outside: '',
          day_disabled: '',
          day_range_middle: '',
          day_hidden: '',
        }}
      />

      {selectedDate && (
        <div className="space-y-3">
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
