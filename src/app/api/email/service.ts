import prisma from '@/lib/db';
import type { Appointment } from '~/generated/prisma/browser';

import { sendEmail } from './mailer';

/**
 * sends email containing the registration code to
 * confirm user's email address during registration
 *
 * right now focused on USER role only, as employees are
 * not yet sufficiently supported
 */
export async function sendRegistrationCodeEmail(
  userFirstName: string,
  userLastName: string,
  userEmail: string
) {
  const userFullName = `${userFirstName} ${userLastName}`.trim();

  // Generate a 6-digit verification code
  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

  // TODO: Store the verification code associated with the user in the database with an expiration time

  sendEmail({
    toEmail: userEmail,
    subject: `${verificationCode} ist dein JuriLib Registrierungscode`,
    templateFileName: 'registration_confirmation_code.html',
    templateVariables: {
      NAME: userFullName,
      VERIFICATION_CODE: verificationCode,
      // TODO: Add expiration time variable as EXPIRY_MINUTES
      CURRENT_YEAR: new Date().getFullYear().toString(),
    },
  });
}

/**
 * sends email containing password reset link
 * to users who requested a password reset
 *
 * right now focused on USER role only, as employees are
 * not yet sufficiently supported
 */
export async function sendPasswordResetEmail(
  userFirstName: string,
  userLastName: string,
  userEmail: string
) {
  const userFullName = `${userFirstName} ${userLastName}`.trim();

  // Generate a 6-digit verification code
  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

  // TODO: Store the verification code associated with the user in the database with an expiration time
  // see if addig a password reset count is needed

  sendEmail({
    toEmail: userEmail,
    subject: `${verificationCode} ist dein JuriLib Passwort-Zurücksetzungscode`,
    templateFileName: 'password_reset_code.html',
    templateVariables: {
      NAME: userFullName,
      VERIFICATION_CODE: verificationCode,
      // TODO: Add expiration time variable as EXPIRY_MINUTES
      EXPIRY_MINUTES: '30',
      CURRENT_YEAR: new Date().getFullYear().toString(),
    },
  });
}

/**
 * sends email to user notifying them of a successful
 * appointment booking, including appointment details
 *
 * right now focused on USER role only, as employees are
 * not yet sufficiently supported
 * later some form of notification to employee will be needed
 */
export async function sendAppointmentConfirmationEmail(
  userFirstName: string,
  userLastName: string,
  userEmail: string,
  appt: Appointment
) {
  const userFullName = `${userFirstName} ${userLastName}`.trim();
  const appointmentDate = appt.dateTimeStart.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  const appointmentTime = appt.dateTimeStart.toLocaleTimeString('de-DE', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const employee = await prisma.employee.findUnique({
    where: { id: appt.employeeId },
    select: { name: true, organizationId: true },
  });

  const organization = await prisma.organization.findUnique({
    where: { id: employee?.organizationId },
    select: { name: true, email: true },
  });

  let apptCase;
  if (appt.caseId) {
    apptCase = await prisma.case.findUnique({
      where: { id: appt.caseId },
      select: { title: true },
    });
  }

  // TODO: set appt.administration url
  const apptAdministrationUrl = 'https://jurilib.de';

  sendEmail({
    toEmail: userEmail,
    subject: `Bestätigung Ihres Termins bei ${organization?.name}`,
    templateFileName: 'appointment_confirmation.html',
    templateVariables: {
      NAME: userFullName,
      APPT_DATE: appointmentDate,
      APPT_TIME: appointmentTime,
      APPT_ORGANIZATION_NAME: organization?.name ?? 'Nicht angegeben',
      APPT_LOCATION: appt.location ?? 'Nicht angegeben',
      APPT_EMPLOYEE_NAME: employee?.name ?? 'Nicht angegeben',
      APPT_CASE_TITLE: apptCase?.title ?? 'Ohne Fallzuordnung',
      APPOINTMENT_MANAGEMENT_URL: apptAdministrationUrl,
      APPT_ORGANIZATION_EMAIL: organization?.email ?? '',
      CURRENT_YEAR: new Date().getFullYear().toString(),
    },
  });
}

/**
 * sends email to user reminding them of an upcoming
 * appointment
 *
 * right now focused on USER role only, as employees are
 * not yet sufficiently supported
 */
export async function sendAppointmentReminderEmail() {
  // implementation here
}

/**
 * sends email to user notifying them of an appointment
 * cancellation, when appointment is cancelled by employee
 */
export async function sendAppointmentCancellationEmail() {
  // implementation here
}

/**
 * sends email to user notifying them of changes to
 * a previously booked appointment
 */
export async function sendAppointmentChangeEmail() {
  // implementation here
}
