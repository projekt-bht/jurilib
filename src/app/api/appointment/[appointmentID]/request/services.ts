import { sendAppointmentConfirmationEmail } from '@/app/api/email/service';
import prisma from '@/lib/db';
import type { Appointment } from '~/generated/prisma/client';
import { AppointmentStatus } from '~/generated/prisma/client';

// Book an appointment by ID
export async function bookAppointment(appointmentID: string, userID: string): Promise<Appointment> {
  try {
    // book appointment
    const bookedAppointment = await prisma.appointment.update({
      where: { id: appointmentID },
      data: {
        status: AppointmentStatus.REQUESTED,
        userId: userID,
      },
    });

    await sendAppointmentConfirmationEmail(userID, bookedAppointment);
    return bookedAppointment;
  } catch (error) {
    throw new Error('Database update failed: ' + (error as Error).message);
  }
}
