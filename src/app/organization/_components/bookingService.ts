'use client'; // Pure service utilities (no JSX), so this remains .ts instead of .tsx

/**
 * Service helpers that mock the booking API. We keep them in this folder so the
 * calendar feature stays encapsulated and avoids merge conflicts with other
 * teams.
 *
 * TODO: swap mocks for real backend endpoints once booking API is available.
 */
const DEFAULT_TIME_SLOTS = [
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

export type BookingRequest = {
  date: Date;
  time: string;
  note?: string;
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchAvailableSlots(date: Date): Promise<string[]> {
  await wait(150);

  const day = date.getDate();
  return DEFAULT_TIME_SLOTS.filter((slot, index) => (day + index) % 2 === 0);
}

export async function bookAppointment({ date, time }: BookingRequest) {
  await wait(300);
  console.warn('Booked appointment (mock)', { date, time });
}

export function getFallbackSlots() {
  return [...DEFAULT_TIME_SLOTS];
}
