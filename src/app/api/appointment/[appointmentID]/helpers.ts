import prisma from '@/lib/db';
export async function isAppointmentUserMatch(
  appointmentID: string,
  userID: string
): Promise<boolean> {
  try {
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentID },
    });
    return appointment?.userId === userID;
  } catch (error) {
    throw new Error('Database error: ' + (error as Error).message);
  }
}
