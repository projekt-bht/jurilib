import { sendAppointmentCancellationEmail } from '@/app/api/email/service';
import prisma from '@/lib/db';
import type { Appointment } from '~/generated/prisma/client';
import { AppointmentStatus } from '~/generated/prisma/client';

// Book an appointment by ID
export async function cancelAppointment(appointmentID: string): Promise<Appointment> {
  try {
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentID },
    });

    if (!appointment) {
      throw new Error('Appointment not Found');
    }

    const bookedAppointment = await prisma.appointment.update({
      where: { id: appointmentID },
      data: {
        status: AppointmentStatus.OPEN,
        userId: null,
      },
    });

    if (appointment.userId) {
      await sendAppointmentCancellationEmail(appointment.userId, bookedAppointment);
      //SEND MAIL TO EMPLOYEE ALSO, BUT NOT NEEDED RN
      //await sendAppointmentCancellationEmail(appointment.employeeId, bookedAppointment);
    }
    return bookedAppointment;
  } catch (error) {
    throw new Error('Database update failed: ' + (error as Error).message);
  }
}
