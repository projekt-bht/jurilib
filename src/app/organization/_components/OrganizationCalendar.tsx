'use client';

import { de } from 'date-fns/locale';
import { Calendar as CalendarIcon, Clock, User } from 'lucide-react';
import { useEffect, useState } from 'react';

import { LoginContext } from '@/app/LoginContext';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { getLogin } from '@/services/api';
import type { LoginResource } from '@/services/Resources';
import type { Appointment, Employee } from '~/generated/prisma/client';
import { AppointmentStatus } from '~/generated/prisma/enums';

import BookingSelector from './BookingSelector';

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

// SlotOption carries the IDs needed to PATCH the existing appointment (employee + appointment) instead of creating a new one.
type SlotOption = {
  appointmentId: string;
  employeeId: string;
  label: string;
};

// TODO (future): Ampelsystem für Terminstatus (OPEN=grün, REQUESTED=gelb, CONFIRMED=rot) direkt im Kalender visualisieren.

export enum BookingMode {
  QUICK = 'quick',
  EMPLOYEE = 'employee',
}

/**
 * Calendar widget with date/time selection plus booking flow state; emits combined selection via onChange.
 */
export default function OrganizationCalendar({
  onChange,
  appointments,
  employees,
}: OrganizationCalendarProps) {
  const [login, setLogin] = useState<undefined | false | LoginResource>(undefined);
  const [availableDays, setAvailableDays] = useState<Date[]>([]);
  const [availableSlots, setAvailableSlots] = useState<Record<string, SlotOption[]>>({});
  const [showStatusMessage, setShowStatusMessage] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<SlotOption | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const [bookedSlotIds, setBookedSlotIds] = useState<string[]>([]);
  const [bookingMode, setBookingMode] = useState<BookingMode>(BookingMode.QUICK); // track current booking mode (quick/employee)
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null); // currently chosen employee (null for quick mode)
  // TODO: when backend is ready, lift bookingMode/employee selection to persisted state and load employees dynamically.

  const setDate = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTime(null);
    setSelectedSlot(null);
  };

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
        setShowStatusMessage(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [statusMessage]);

  useEffect(() => {
    const openAppointments = appointments.filter((a) => a.status === AppointmentStatus.OPEN);

    const days: Date[] = openAppointments.map((a) => {
      // create a new Date instance and normalize to midnight without mutating source
      const d = new Date(a.dateTimeStart);
      d.setHours(0, 0, 0, 0);
      return d;
    });
    // vibe coded hell
    const slotsByDate: Record<string, SlotOption[]> = openAppointments.reduce(
      (acc: Record<string, SlotOption[]>, appointment) => {
        if (!appointment.employeeId) return acc;

        const dateKey = new Date(appointment.dateTimeStart).toDateString();
        const start = new Date(appointment.dateTimeStart);
        const end = new Date(appointment.dateTimeEnd);
        const fmt = (d: Date) => `${d.getHours()}:${d.getMinutes().toString().padStart(2, '0')}`;
        const slot = `${fmt(start)} - ${fmt(end)}`;

        if (!acc[dateKey]) {
          acc[dateKey] = [];
        }
        acc[dateKey].push({
          appointmentId: appointment.id,
          employeeId: appointment.employeeId,
          label: slot,
        });
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
  }
  async function confirmBooking() {
    if (!login) {
      const authDialog = document.getElementById('authButton') as HTMLElement | null;
      if (authDialog) {
        authDialog.click();
      }
      return;
    }
    // Simulate booking process
    if (!selectedDate || !selectedSlot) {
      setStatusMessage('Bitte Datum und Uhrzeit auswählen.');
      return;
    }

    setIsBooking(true);
    setStatusMessage(null);
    //patchCall to backend to confirm booking
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_ROOT}appointment/employee/${selectedSlot.employeeId}/${selectedSlot.appointmentId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include' as RequestCredentials,
          body: JSON.stringify({
            // attach user and close slot in backend so it no longer appears as OPEN
            userId: login.id,
            appointmentStatus: AppointmentStatus.CONFIRMED,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Update failed');
      }

      setShowStatusMessage(true);
      setStatusMessage('Termin erfolgreich gebucht!');
      // mark slot as booked locally so it disappears/appears disabled without reload
      setBookedSlotIds((prev) =>
        prev.includes(selectedSlot.appointmentId) ? prev : [...prev, selectedSlot.appointmentId]
      );
      setSelectedSlot(null);
      setSelectedTime(null);
    } catch {
      setStatusMessage('Buchung fehlgeschlagen. Bitte erneut versuchen.');
    } finally {
      setIsBooking(false);
    }
  }

  const handleChange = (date?: Date, time?: string | null) => {
    onChange?.({
      date: date ?? selectedDate,
      time: time ?? selectedTime,
    });
  };

  return (
    <LoginContext.Provider value={{ login, setLogin }}>
      <div className="px-0 xl:pr-8">
        <div className="bg-accent-white p-6 shadow-lg rounded-xl space-y-6 mb-10 flex flex-col px-4 sm:px-6 lg:px-10 flex-start max-w-5xl border border-border">
          <div className="space-y-1">
            <h2 className="text-3xl font-bold">Termin buchen</h2>
            <p className="text-base text-muted-foreground">
              Wähle einen passenden Termin für deine Beratung.
            </p>
          </div>

          <BookingSelector
            bookingMode={bookingMode}
            onBookingModeChange={(mode) => setBookingMode(mode)}
            selectedEmployee={selectedEmployee}
          />

          {bookingMode === BookingMode.EMPLOYEE && (
            <div className="mb-6 rounded-xl border border-border bg-accent-white p-4 shadow-sm">
              <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                <User className="w-5 h-5 text-accent-blue" />
                Wähle einen Mitarbeiter
              </h3>
              <div className="grid grid-cols-1 gap-4 2xl:grid-cols-2">
                {employees.map((employee) => (
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
                        <div className="w-16 h-16 rounded-full bg-linear-to-br from-accent-blue to-accent-purple flex items-center justify-center text-accent-white text-xl font-bold shadow-md shrink-0">
                          {employee.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-foreground mb-1 break-words">
                          {employee.name}
                        </h4>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 flex-wrap">
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
              className="bg-transparent w-full max-w-full mx-auto flex flex-col items-center justify-center"
              /* https://daypicker.dev/docs/styling */
              classNames={{
                months: '', // keep empty to preserve layout spacing; removing it shifts the nav arrows
                month: 'w-full px-1',
                caption: '',
                caption_label: 'mb-15 font-bold text-xl',
                nav: 'w-full flex justify-between pl-1 pr-6',
                button_previous: ' hover:bg-accent-white rounded-lg p-2',
                button_next: ' hover:bg-accent-white rounded-lg p-2',
                table: 'w-full max-w-full',
                weekdays: 'flex w-full justify-between px-1',
                weekday: 'w-8 sm:w-10 text-center text-muted-foreground',
                row: 'flex justify-between px-1',
                day: 'h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center rounded-lg bg-accent-white text-xs sm:text-sm hover:border-accent-gray-light hover:bg-accent-gray-light hover:cursor-pointer',
                today:
                  'h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center rounded !bg-accent-white !border-[3px] !border-accent-blue-light !text-foreground font-bold ring-2 ring-accent-blue-light ring-offset-transparent data-[selected=true]:ring-0 ',

                disabled:
                  '!bg-transparent !border-none !shadow-none !outline-none text-muted-foreground !cursor-not-allowed hover:!bg-transparent hover:!border-none hover:!shadow-none hover:!outline-none hover:!cursor-not-allowed',
              }}
            />

            <div className="flex items-center gap-6 px-2 pb-2 flex-wrap">
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
              <div className="flex items-center gap-2 flex-wrap">
                <Clock className="h-5 w-5 text-accent-blue" />
                <h2 className="text-2xl font-semibold">Wählen eine Uhrzeit</h2>
              </div>
              <p className="text-sm font-medium text-muted-foreground">Verfügbare Zeiten</p>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {(() => {
                  const slotsForSelectedDate: SlotOption[] =
                    availableSlots[selectedDate?.toDateString() || ''] || [];

                  return slotsForSelectedDate.map((slot: SlotOption) => {
                    const isBooked = bookedSlotIds.includes(slot.appointmentId);
                    const isSelected = selectedSlot?.appointmentId === slot.appointmentId;

                    return (
                      <Button
                        key={slot.appointmentId}
                        variant="outline"
                        className={cn(
                          'rounded-lg border font-semibold text-center w-full px-4 text-base whitespace-normal break-words leading-snug',
                          isBooked
                            ? 'border-border bg-accent-gray-light text-muted-foreground cursor-not-allowed'
                            : isSelected
                            ? 'bg-accent-blue text-accent-white border-accent-blue hover:bg-accent-blue hover:text-accent-white'
                            : 'border-border hover:bg-accent-gray-light'
                        )}
                        disabled={isBooked}
                        onClick={() => {
                          if (isBooked) return;
                          setSelectedSlot(slot);
                          setSelectedTime(slot.label);
                          handleChange(undefined, slot.label);
                        }}
                      >
                        {slot.label}
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
                {showStatusMessage && (
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
