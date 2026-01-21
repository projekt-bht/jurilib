import prisma from '@/lib/db';
export async function isAppointmentEmployeeMatch(
  appointmentID: string,
  employeeID: string
): Promise<boolean> {
  try {
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentID },
    });
    return appointment?.employeeId === employeeID;
  } catch (error) {
    throw new Error('Database error: ' + (error as Error).message);
  }
}
