'use client';

import { de } from 'date-fns/locale';
import { Calendar as CalendarIcon, Check, Clock, User } from 'lucide-react'; //User icons
import { useEffect, useState } from 'react';

import { useLoginContext } from '@/app/LoginContext';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import type { Appointment, Employee } from '~/generated/prisma/client';
import { AppointmentStatus } from '~/generated/prisma/enums';

import BookingSelector, { BookingMode } from './BookingSelector';

type OrganizationCalendarProps = {
  onChange?: (selection: { date?: Date; time?: string | null }) => void;
  appointments: Appointment[];
  employees: Employee[];
};
// Placeholder employee data
export type EmployeeCard = Pick<Employee, 'id' | 'lastname' | 'position'> & {
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

/**
 * Calendar widget with date/time selection plus booking flow state; emits combined selection via onChange.
 */
export default function OrganizationCalendar({
  onChange,
  appointments,
  employees,
}: OrganizationCalendarProps) {
  const { login } = useLoginContext();
  const [availableDays, setAvailableDays] = useState<Date[]>([]);
  const [availableSlots, setAvailableSlots] = useState<Record<string, SlotOption[]>>({});
  const [showStatusMessage, setShowStatusMessage] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<SlotOption | null>(null);
  // Tracks the month currently shown by the calendar UI.
  const [visibleMonth, setVisibleMonth] = useState<Date>(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  );
  const [isBooking, setIsBooking] = useState(false);
  const [bookedSlotIds, setBookedSlotIds] = useState<string[]>([]);
  const [bookingMode, setBookingMode] = useState<BookingMode>(BookingMode.QUICK); // track current booking mode (quick/employee)
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null); // currently chosen employee (null for quick mode)

  // Ensure employee selection is reset when switching into employee mode
  // so no one is pre-selected on first view.
  const handleBookingModeChange = (mode: BookingMode) => {
    setBookingMode(mode);
    if (mode === BookingMode.EMPLOYEE) {
      setSelectedEmployee(null);
    }
  };

  const setDate = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTime(null);
    setSelectedSlot(null);
  };

  useEffect(() => {
    if (statusMessage) {
      const timer = setTimeout(() => {
        setShowStatusMessage(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [statusMessage]);

  useEffect(() => {
    // Reset date/time selection when the employee context changes
    // to avoid keeping slots from a different employee.
    if (bookingMode === BookingMode.EMPLOYEE) {
      setSelectedDate(undefined);
      setSelectedTime(null);
      setSelectedSlot(null);
    }
  }, [bookingMode, selectedEmployee]);

  useEffect(() => {
    // In employee mode, only show open appointments for the selected employee.
    // In quick mode, show all open appointments.
    // Past appointments are filtered out so users cannot book in the past.
    const now = new Date();
    const openAppointments = appointments.filter(
      (a) => a.status === AppointmentStatus.OPEN && new Date(a.dateTimeStart) >= now
    );
    // When no employee is selected in employee mode, return an empty list
    // to avoid showing unrelated slots.
    const filteredAppointments =
      bookingMode === BookingMode.EMPLOYEE
        ? selectedEmployee
          ? openAppointments.filter((a) => a.employeeId === selectedEmployee.id)
          : []
        : openAppointments;

    const days: Date[] = filteredAppointments.map((a) => {
      // create a new Date instance and normalize to midnight without mutating source
      const d = new Date(a.dateTimeStart);
      d.setHours(0, 0, 0, 0);
      return d;
    });
    // vibe coded hell
    const slotsByDate: Record<string, SlotOption[]> = filteredAppointments.reduce(
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

    // Update calendar data sources based on the selected employee context.
    setAvailableSlots(slotsByDate);
    setAvailableDays(days);
  }, [appointments, bookingMode, selectedEmployee]);

  function isDisabledDay(date: Date) {
    const normalisedDate = new Date(date);
    normalisedDate.setHours(0, 0, 0, 0);

    // Compare by timestamp to avoid reference equality issues with Date objects
    const isAvailable = availableDays.some((d) => d.getTime() === normalisedDate.getTime());
    return !isAvailable;
  }
  async function confirmBooking() {
    if (!selectedDate || !selectedSlot) {
      setStatusMessage('Bitte Datum und Uhrzeit auswählen.');
      return;
    }

    setIsBooking(true);
    setStatusMessage(null);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_ROOT}appointment/${selectedSlot.appointmentId}/request`,
        {
          method: 'POST',
          credentials: 'include' as RequestCredentials,
        }
      );

      if (!response.ok) {
        throw new Error('Update failed');
      }

      setShowStatusMessage(true);
      setStatusMessage('Termin erfolgreich gebucht!');
      // mark slot as booked locally so it disappears/appears disabled without reload
      setBookedSlotIds((prev) => [...prev, selectedSlot.appointmentId]);
      setSelectedSlot(null);
      setSelectedTime(null);
      //TODO: find better solution instead of refreshing the whole page. Didn't want to migrate fetching the appointment in here now
      // reload page so appointments list is refetched and reflects updated booking status

      //Booking ok, we can clear current cachedProblem
      sessionStorage.removeItem('problemText');

      if (typeof window !== 'undefined') {
        window.location.reload();
      }
    } catch {
      setStatusMessage('Buchung fehlgeschlagen. Bitte erneut versuchen.');
      setShowStatusMessage(true);
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

  // Check if the currently visible month has any available days.
  const visibleYear = visibleMonth.getFullYear();
  const visibleMonthIndex = visibleMonth.getMonth();
  const hasDaysInMonth = availableDays.some(
    (day) => day.getFullYear() === visibleYear && day.getMonth() === visibleMonthIndex
  );
  const sortedAvailableDays = availableDays
    .slice()
    .sort((a, b) => a.getTime() - b.getTime());
  // Only show "next available" after the currently visible month
  // to avoid pointing to past months when browsing the future.
  const nextAvailableAfterMonth = sortedAvailableDays.find(
    (day) =>
      day.getFullYear() > visibleYear ||
      (day.getFullYear() === visibleYear && day.getMonth() > visibleMonthIndex)
  );
  const nextAvailableMonthLabel = nextAvailableAfterMonth
    ? nextAvailableAfterMonth.toLocaleDateString('de-DE', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null;

  return (
    <div className="px-0 xl:pr-8">
      <div className="bg-accent-white p-6 shadow-lg rounded-xl space-y-6 mb-10 flex flex-col px-4 sm:px-6 lg:px-10 flex-start max-w-5xl border border-border">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold">Termin buchen</h2>
          <p className="text-base text-muted-foreground">
            Wähle einen passenden Termin für deine Beratung.
          </p>
        </div>

        {/* Booking mode tabs (quick booking vs employee) */}
        <BookingSelector
          bookingMode={bookingMode}
          onBookingModeChange={handleBookingModeChange}
          selectedEmployee={selectedEmployee}
        />

        {/* Employee list only shown in employee mode; compact layout with avatar ring + check */}
        {bookingMode === BookingMode.EMPLOYEE && (
          <div className="mb-2 rounded-xl border border-border bg-accent-white p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
              <User className="w-5 h-5 text-accent-blue" />
              Wähle einen Mitarbeiter
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {employees.slice(0, 4).map((employee) => {
                const isSelected = selectedEmployee?.id === employee.id;
                // When one employee is selected, visually mute all other cards
                // so the active choice is unmistakable but still changeable.
                const isMuted = selectedEmployee && !isSelected;
                return (
                  <button
                    key={employee.id}
                    onClick={() => {
                      setSelectedEmployee(employee);
                    }}
                    className={`rounded-2xl px-4 py-3 border-2 text-left transition-all duration-200 ${
                      isSelected
                        ? 'border-accent-blue bg-linear-to-r from-accent-blue-soft to-accent-white shadow-2xl ring-4 ring-accent-blue-light scale-[1.02]'
                        : 'border-border bg-accent-white hover:border-accent-blue-light hover:bg-accent-blue-soft'
                    } ${isMuted ? 'opacity-55 hover:opacity-100' : ''}`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`relative w-12 h-12 rounded-full bg-linear-to-br from-accent-blue to-accent-purple flex items-center justify-center text-accent-white text-base font-bold shadow-md shrink-0 ring-2 ${
                          isSelected ? 'ring-accent-blue' : 'ring-transparent'
                        }`}
                      >
                        {employee.firstname
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                        {/* Selected state: blue ring + blue check badge */}
                        {isSelected && (
                          <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent-blue text-accent-white shadow-sm">
                            <Check className="h-3 w-3" />
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-foreground mb-0.5 break-words">
                          {employee.firstname} {employee.lastname}
                        </h4>
                        <p className="text-sm text-muted-foreground">{employee.position}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Calendar is visible immediately in quick booking,
            or after an employee is picked in employee mode. */}
        {/* Empty state when no appointments are available for the current context */}
        {(bookingMode === BookingMode.QUICK ||
          (bookingMode === BookingMode.EMPLOYEE && selectedEmployee)) &&
          availableDays.length === 0 && (
            <div className="rounded-lg border border-accent-blue-light bg-accent-blue-soft p-4 text-center">
              <p className="text-sm font-semibold text-accent-blue">
                Keine freien Termine verfügbar
                {bookingMode === BookingMode.EMPLOYEE && selectedEmployee
                  ? ` für ${selectedEmployee.firstname} ${selectedEmployee.lastname}.`
                  : '.'}
              </p>
            </div>
          )}

        {/* Calendar view only renders when there are available days to show */}
        {(bookingMode === BookingMode.QUICK ||
          (bookingMode === BookingMode.EMPLOYEE && selectedEmployee)) &&
          availableDays.length > 0 && (
          <>
            <div className="flex items-center gap-2 flex-wrap">
              <CalendarIcon className="h-5 w-5 text-accent-blue" />
              <h2 className="text-2xl font-semibold">Wähle ein Datum</h2>
            </div>
            {/* Month-level hint when the visible month has no available days */}
            {!hasDaysInMonth && (
              <div className="rounded-lg border border-accent-blue-light bg-accent-blue-soft p-4 text-center">
                <p className="text-sm font-semibold text-accent-blue">
                  Keine freien Termine für diesen Monat.
                </p>
                {nextAvailableMonthLabel && (
                  <p className="text-sm text-accent-blue">
                    Nächster verfügbarer Termin
                    {bookingMode === BookingMode.EMPLOYEE && selectedEmployee
                      ? ` bei ${selectedEmployee.firstname} ${selectedEmployee.lastname}`
                      : ''}{' '}
                    ist am {nextAvailableMonthLabel}.
                  </p>
                )}
              </div>
            )}
            <div className="rounded-md shadow-sm bg-accent-gray-soft space-y-4 w-full pl-4 pr-4">
              <Calendar
                mode="single"
                today={new Date()}
                locale={de}
                selected={selectedDate}
                onSelect={(date) => {
                  setDate(date);
                  handleChange(date, null);
                }}
                onMonthChange={(date) => setVisibleMonth(date)}
                disabled={isDisabledDay}
                startMonth={new Date(new Date().getFullYear(), new Date().getMonth(), 1)} // calendar cannot go back in time
                endMonth={new Date(new Date().getFullYear() + 1, new Date().getMonth(), 1)} // limits last possible month to now + 1 year
                className="bg-transparent mx-auto flex-col"
                /* https://daypicker.dev/docs/styling */
                classNames={{
                  caption_label: 'font-bold text-xl',
                  day: 'w-full h-full flex items-center justify-center rounded-lg bg-accent-white text-xs sm:text-sm hover:border-accent-gray-light hover:bg-accent-gray-light hover:cursor-pointer',
                  today:
                    ' flex items-center justify-center rounded !bg-accent-white !border-[3px] !border-accent-blue-light !text-foreground font-bold ring-2 ring-accent-blue-light ring-offset-transparent data-[selected=true]:ring-0 ',
                  disabled:
                    '!bg-transparent !border-none !shadow-none !outline-none text-muted-foreground hover:!bg-transparent hover:!border-none hover:!shadow-none hover:!outline-none hover:!cursor-not-allowed',
                }}
              />

              <div className="flex justify-center items-center gap-6 px-2 pb-2 flex-wrap">
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
          </>
        )}

        {selectedDate && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <Clock className="h-5 w-5 text-accent-blue" />
              <h2 className="text-2xl font-semibold">Wähle eine Uhrzeit</h2>
            </div>

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
                      className={`rounded-lg border font-semibold text-center w-full px-4 text-base whitespace-normal break-words leading-snug ${
                        isBooked
                          ? 'border-border bg-accent-gray-light text-muted-foreground cursor-not-allowed'
                          : isSelected
                            ? 'bg-accent-blue text-accent-white border-accent-blue hover:bg-accent-blue hover:text-accent-white'
                            : 'border-border hover:bg-accent-gray-light'
                      }`}
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
              <div className="flex justify-center gap-6 mt-6 p-4 bg-accent-blue-soft border border-accent-blue-light rounded-lg animate-fade-in">
                <p className=" text-xl font-bold text-foreground">
                  {selectedDate.toLocaleDateString('de-DE', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
                <p className="text-xl font-bold text-accent-blue">{selectedTime} Uhr</p>
              </div>
            )}

            {login && (
              <div className="space-y-2 pt-2">
                <Button
                  className="bg-primary text-primary-foreground text-lg font-bold hover:bg-primary-hover hover:text-primary-hover-foreground px-4 py-3 rounded-full hover:shadow-xl transition-all duration-300 hover:scale-105 w-full"
                  disabled={!selectedDate || !selectedTime || isBooking}
                  onClick={confirmBooking}
                >
                  {isBooking ? 'Termin wird angefragt...' : 'Termin anfragen'}
                </Button>
                {showStatusMessage && (
                  <div className="p-4 bg-accent-emerald-light border border-accent-emerald rounded-lg text-center animate-fade-in">
                    <p className="text-accent-emerald font-medium">Termin erfolgreich gebucht!</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        {!login && (
          <div className="p-4 bg-accent-red-light border border-accent-red rounded-lg text-center animate-fade-in">
            <p className="text-accent-red font-medium">
              Du musst eingeloggt sein, um einen Termin zu buchen.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
