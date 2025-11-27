'use client';

import { useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';

const TIME_SLOTS = [
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '14:00',
  '14:30',
  '15:00',
  '16:00',
] as const;

type TimeSelection = {
  date?: Date;
  time?: string | null;
};

type CalendarWithTimeProps = {
  onChange?: (selection: TimeSelection) => void;
};

/**
 * Reusable calendar widget that pairs a single-day picker with predefined slot
 * buttons. Consumers receive the combined state through the onChange callback.
 */
export function CalendarWithTime({ onChange }: CalendarWithTimeProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

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
        selected={selectedDate}
        onSelect={(date) => {
          setSelectedDate(date);
          // Reset the time when a new date is picked.
          setSelectedTime(null);
          handleChange(date, null);
        }}
        disabled={isDisabledDay}
        className="rounded-md border shadow-sm"
      />

      {selectedDate && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-700">Verfügbare Zeiten</p>

          <div className="grid grid-cols-2 gap-2">
            {TIME_SLOTS.map((slot) => {
              const isSelected = selectedTime === slot;

              return (
                <Button
                  key={slot}
                  variant={isSelected ? 'default' : 'outline'}
                  className="w-full"
                  onClick={() => {
                    setSelectedTime(slot);
                    handleChange(undefined, slot);
                  }}
                >
                  {slot}
                </Button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function OrganizationCalendar(props: CalendarWithTimeProps) {
  return <CalendarWithTime {...props} />;
}
