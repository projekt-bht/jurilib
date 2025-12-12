'use client';

import { de } from 'date-fns/locale';
import { Calendar as CalendarIcon, Clock, User } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import type { Appointment, Employee } from '~/generated/prisma/client';

import BookingSelector from './BookingSelector';
import { useBookingSchedule } from './useBookingSchedule';
import { Noto_Sans_Cypro_Minoan } from 'next/font/google';
import { LoginContext } from '@/app/LoginContext';
import { getLogin } from '@/services/api';
import { LoginResource } from '@/services/Resources';

type OrganizationCalendarProps = {
  onChange?: (selection: { date?: Date; time?: string | null }) => void;
  appointments: Appointment[];
  employees: Employee[];
};
// Placeholder employee data
export type EmployeeCard = Pick<Employee, 'id' | 'name' | 'position'> & {
  expertiseAreas: string[];
  avatar?: string | null;
};

/**
 * Calendar widget with date/time selection plus booking flow state; emits combined selection via onChange.
 */
export default function OrganizationCalendar({
  onChange,
  appointments,
  employees,
}: OrganizationCalendarProps) {
  /* TODO: adjust colors, icons, and calendar positioning after Hannes' PR */
  const { selectedDate, selectedTime, isBooking, setDate, selectTime } = useBookingSchedule();

  const [login, setLogin] = useState<undefined | false | LoginResource>(undefined);
  const [availableDays, setAvailableDays] = useState<Date[]>([]);
  const [availableSlots, setAvailableSlots] = useState<Record<string, string[]>>({});
  const [statusMessage, setStatusMessage] = useState<boolean>(false);
  // const [bookingMode, setBookingMode] = useState<'quick' | 'employee'>('quick'); // track current booking mode (quick/employee)
  // const [selectedEmployee, setSelectedEmployee] = useState<EmployeeCard | null>(null); // currently chosen employee (null for quick mode)
  // TODO: when backend is ready, lift bookingMode/employee selection to persisted state and load employees dynamically.

  useEffect(() => {
    (async () => {
      try {
        const loginFromServer = await getLogin();
        setLogin(loginFromServer);
      } catch {
        setLogin(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (statusMessage) {
      const timer = setTimeout(() => {
        setStatusMessage(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [statusMessage]);

  useEffect(() => {
    const days: Date[] = appointments.map((a) => {
      // create a new Date instance and normalize to midnight without mutating source
      const d = new Date(a.dateTimeStart);
      d.setHours(0, 0, 0, 0);
      return d;
    });
    // vibe coded hell
    const slotsByDate: Record<string, string[]> = appointments.reduce(
      (acc: Record<string, string[]>, appointment) => {
        const dateKey = new Date(appointment.dateTimeStart).toDateString();
        const start = new Date(appointment.dateTimeStart);
        const end = new Date(appointment.dateTimeEnd);
        const fmt = (d: Date) => `${d.getHours()}:${d.getMinutes().toString().padStart(2, '0')}`;
        const slot = `${fmt(start)} - ${fmt(end)}`;

        if (!acc[dateKey]) {
          acc[dateKey] = [];
        }
        acc[dateKey].push(slot);
        return acc;
      },
      {}
    );
    // vibe coded hell ends

    setAvailableSlots(slotsByDate);
    setAvailableDays(days);
  }, [appointments]);

  function isDisabledDay(date: Date) {
    const normalisedDate = new Date(date);
    normalisedDate.setHours(0, 0, 0, 0);

    // Compare by timestamp to avoid reference equality issues with Date objects
    const isAvailable = availableDays.some((d) => d.getTime() === normalisedDate.getTime());
    return !isAvailable;

    // // checks if the given date is either a weekend or a day before today
    // const midnight = new Date(new Date().setHours(0, 0, 0, 0));
    // const weekday = date.getDay();
    // const isWeekend = weekday === 0 || weekday === 6;
    // return date < midnight || isWeekend;
  }
  function confirmBooking() {
    if (!login) {
      const authDialog = document.getElementById('authButton') as HTMLElement | null;
      if (authDialog) {
        authDialog.click();
      }
      return;
    } else {
      setStatusMessage(true);
    }
    // Simulate booking process
  }

  const handleChange = (date?: Date, time?: string | null) => {
    onChange?.({
      date: date ?? selectedDate,
      time: time ?? selectedTime,
    });
  };

  return (
    <LoginContext.Provider value={{ login, setLogin }}>
      <div className="pr-8">
        <div className="bg-accent-white p-6 shadow-lg rounded-xl space-y-6 mt-8 mb-10 flex flex-col px-10 flex-start mx-auto max-w-4xl border border-border">
          <div className="space-y-1">
            <h2 className="text-3xl font-bold">Termin buchen</h2>
            <p className="text-base text-muted-foreground">
              Wähle einen passenden Termin für deine Beratung.
            </p>
          </div>

          {/* <BookingSelector
        bookingMode={bookingMode}
        onBookingModeChange={(mode) => setBookingMode(mode)}
        selectedEmployee={selectedEmployee}
      /> */}

          {/* {bookingMode === 'employee' && (
        <div className="mb-6 rounded-xl border border-border bg-accent-white p-4 shadow-sm">
          <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
            <User className="w-5 h-5 text-accent-blue" />
            Wähle einen Mitarbeiter
          </h3>
          <div className="grid grid-cols-1 gap-4 2xl:grid-cols-2">
            {mockStaff.map((employee) => (
              <button
                key={employee.id}
                onClick={() => {
                  setSelectedEmployee(employee);
                }}
                className={cn(
                  // cn merges the base classes with either the active or inactive variant; keeps the card markup clean while toggling selection state
                  'p-4 rounded-xl border-2 transition-all duration-200 text-left',
                  selectedEmployee?.id === employee.id
                    ? 'border-accent-blue-light bg-accent-gray-soft shadow-md'
                    : 'border-border hover:border-primary/50 bg-accent-white'
                )}
              >
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-full bg-accent-gray-soft text-muted-foreground flex items-center justify-center">
                    <User className="w-7 h-7" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-foreground mb-1">{employee.name}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{employee.position}</p>
                    <div className="flex flex-wrap gap-1">
                      {employee.expertiseAreas.map((expertiseArea) => (
                        <span
                          key={expertiseArea}
                          className="px-3 py-1 rounded-xl text-sm font-semibold bg-accent-blue-soft border border-accent-gray-light text-foreground shadow-sm"
                        >
                          {expertiseArea}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )} */}

          <div className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-accent-blue" />
            <h2 className="text-2xl font-semibold">Wähle ein Datum</h2>
          </div>
          <div className="rounded-md shadow-sm bg-accent-gray-soft space-y-4">
            <Calendar
              mode="single"
              today={new Date()}
              locale={de}
              selected={selectedDate}
              onSelect={(date) => {
                setDate(date);
                handleChange(date, null);
              }}
              disabled={isDisabledDay}
              className="bg-transparent w-full max-w-sm mx-auto justify-center items-center "
              // classNames customized to mirror the reference design: centered/bold caption, spaced nav, roomy day cells, visible today ring, muted disabled days, and hover affordances
              /* https://daypicker.dev/docs/styling */
              classNames={{
                //   months: '', // keep empty to preserve layout spacing; removing it shifts the nav arrows
                //   month: 'w-full',
                //   caption: '',
                //   caption_label: 'mb-14 font-bold text-2xl',
                //   nav: 'w-full flex justify-between ',
                button_previous: ' hover:bg-accent-white rounded-lg p-2',
                button_next: ' hover:bg-accent-white rounded-lg p-2',
                //   table: 'w-full max-w-full',
                // row: 'flex justify-between',
                day: 'm-1 p-1 rounded-lg bg-accent-white text-sm hover:border-accent-gray-light hover:bg-accent-gray-light hover:cursor-pointer',
                today:
                  'rounded !bg-accent-white !border-[3px] !border-accent-blue-light !text-foreground font-bold ring-2 ring-accent-blue-light ring-offset-transparent data-[selected=true]:ring-0 ',

                disabled:
                  '!bg-transparent !border-none !shadow-none !outline-none text-muted-foreground !cursor-not-allowed hover:!bg-transparent hover:!border-none hover:!shadow-none hover:!outline-none hover:!cursor-not-allowed',
              }}
            />

            <div className="flex items-center gap-6 px-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded border-2 border-accent-blue-light" />
                <span>Heute</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="inline-flex h-5 w-5 rounded bg-accent-blue" />
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
                <Clock className="h-5 w-5 text-accent-blue" />
                <h2 className="text-2xl font-semibold">Wählen eine Uhrzeit</h2>
              </div>
              <p className="text-sm font-medium text-muted-foreground">Verfügbare Zeiten</p>

              <div className="grid grid-cols-2 gap-2">
                {(() => {
                  const slotsForSelectedDate: string[] =
                    availableSlots[selectedDate?.toDateString() || ''] || [];

                  return slotsForSelectedDate.map((slot: string) => {
                    const isSelected = selectedTime === slot;

                    return (
                      <Button
                        key={slot}
                        variant="outline"
                        className={cn(
                          'm-2 rounded-lg border font-semibold text-center w-full px-4 text-base',
                          isSelected
                            ? 'bg-accent-blue text-accent-white border-accent-blue hover:bg-accent-blue hover:text-accent-white'
                            : 'border-border hover:bg-accent-gray-light'
                        )}
                        onClick={() => {
                          selectTime(slot);
                          handleChange(undefined, slot);
                        }}
                      >
                        {slot}
                      </Button>
                    );
                  });
                })()}
              </div>

              {selectedDate && selectedTime && (
                <div className="mb-6">
                  <div className="mb-6 p-4 bg-accent-blue-soft border border-accent-blue-light rounded-lg animate-fade-in">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Ihr Termin</h3>

                    <p className="mb-1 text-xl font-bold text-foreground">
                      {selectedDate.toLocaleDateString('de-DE', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                    <p className="text-xl font-bold text-accent-blue">{selectedTime} Uhr</p>
                  </div>
                </div>
              )}

              <div className="space-y-2 pt-2">
                <Button
                  className="bg-primary text-primary-foreground text-lg font-bold hover:bg-primary-hover hover:text-primary-hover-foreground px-4 py-3 rounded-full hover:shadow-xl transition-all duration-300 hover:scale-105 w-full"
                  disabled={!selectedDate || !selectedTime || isBooking}
                  onClick={confirmBooking}
                >
                  {isBooking ? 'Termin wird bestätigt...' : 'Termin bestätigen'}
                </Button>
                {statusMessage && (
                  <div className="p-4 bg-accent-emerald-light border border-accent-emerald rounded-lg text-center animate-fade-in">
                    <p className="text-accent-emerald font-medium">Termin erfolgreich gebucht!</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </LoginContext.Provider>
  );
}
