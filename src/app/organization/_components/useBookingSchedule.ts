'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  bookAppointment,
  fetchAvailableSlots,
  getFallbackSlots,
} from './bookingService';

type BookingState = {
  selectedDate?: Date;
  selectedTime: string | null;
  availableSlots: string[];
  slotsLoading: boolean;
  isBooking: boolean;
  statusMessage: string | null;
};

type UseBookingScheduleReturn = BookingState & {
  setDate: (date: Date | undefined) => void;
  selectTime: (slot: string) => void;
  confirmBooking: () => Promise<void>;
};

/**
 * Hook that manages booking state: it fetches available slots for a date, keeps
 * the selection in sync and handles mock booking submissions.
 */
export function useBookingSchedule(): UseBookingScheduleReturn {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [availableSlots, setAvailableSlots] = useState<string[]>(getFallbackSlots());
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const resetStatus = useCallback(() => setStatusMessage(null), []);

  useEffect(() => {
    if (!selectedDate) {
      setAvailableSlots(getFallbackSlots());
      setSelectedTime(null);
      return;
    }

    setSlotsLoading(true);
    resetStatus();

    fetchAvailableSlots(selectedDate)
      .then((slots) => {
        setAvailableSlots(slots);
        if (slots.length === 0) {
          setStatusMessage('Keine Termine verfügbar');
        }
      })
      .catch(() => {
        setStatusMessage('Termine konnten nicht geladen werden.');
      })
      .finally(() => {
        setSlotsLoading(false);
      });
  }, [resetStatus, selectedDate]);

  const confirmBooking = useCallback(async () => {
    if (!selectedDate || !selectedTime) {
      setStatusMessage('Bitte Datum und Uhrzeit auswählen.');
      return;
    }

    setIsBooking(true);
    resetStatus();
    try {
      await bookAppointment({ date: selectedDate, time: selectedTime });
      setStatusMessage('Termin erfolgreich gebucht!');
    } catch {
      setStatusMessage('Buchung fehlgeschlagen. Bitte erneut versuchen.');
    } finally {
      setIsBooking(false);
    }
  }, [resetStatus, selectedDate, selectedTime]);

  const setDate = useCallback((date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTime(null);
  }, []);

  const selectTime = useCallback((slot: string) => {
    setSelectedTime(slot);
  }, []);

  return useMemo(
    () => ({
      selectedDate,
      selectedTime,
      availableSlots,
      slotsLoading,
      isBooking,
      statusMessage,
      setDate,
      selectTime,
      confirmBooking,
    }),
    [
      availableSlots,
      confirmBooking,
      isBooking,
      selectedDate,
      selectedTime,
      selectTime,
      setDate,
      slotsLoading,
      statusMessage,
    ],
  );
}
