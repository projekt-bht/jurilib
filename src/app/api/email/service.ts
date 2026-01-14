import { ValidationError } from '@/error/validationErrors';
import prisma from '@/lib/db';
import type { Account, Appointment, User } from '~/generated/prisma/browser';

import { sendEmail } from './mailer';

/**
 * sends email containing the registration code to
 * confirm user's email address during registration
 *
 * right now focused on USER role only, as employees are
 * not yet sufficiently supported
 */
export async function sendRegistrationCodeEmail(account: Account, user: User) {
  // TODO: change to user.firstName, user.lastName when schema is updated
  const userFullName = `${user.firstname} ${user.lastname}`.trim();

  // Generate a 6-digit verification code
  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

  // Store the verification code
  await prisma.accountToken.create({
    data: {
      accountId: account.id!,
      type: 'EMAIL_VERIFICATION',
      token: verificationCode,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000), // expires in 15 minutes
    },
  });

  await sendEmail({
    toEmail: account.email,
    subject: `${verificationCode} ist dein JuriLib Registrierungscode`,
    templateFileName: 'registration_confirmation_code.html',
    templateVariables: {
      NAME: userFullName,
      VERIFICATION_CODE: verificationCode,
      EXPIRY_MINUTES: '15',
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
export async function sendPasswordResetEmail(email: string) {
  const account = await prisma.account.findUnique({
    where: { email },
    include: { user: true },
  });

  if (!account || !account.user) {
    throw new ValidationError('notFound', 'email', email, 404);
  }
  const user = account.user;
  // TODO: change to user.firstName, user.lastName when schema is updated
  const userFullName = `${user.firstname} ${user.lastname}`.trim();

  // Generate a 6-digit verification code
  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

  // Store the verification code
  await prisma.accountToken.create({
    data: {
      accountId: account.id!,
      type: 'PASSWORD_RESET',
      token: verificationCode,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000), // expires in 15 minutes
    },
  });

  await sendEmail({
    toEmail: email,
    subject: `${verificationCode} ist dein JuriLib Passwort-Zurücksetzungscode`,
    templateFileName: 'password_reset_code.html',
    templateVariables: {
      NAME: userFullName,
      VERIFICATION_CODE: verificationCode,
      EXPIRY_MINUTES: '15',
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
export async function sendAppointmentConfirmationEmail(userId: string, appt: Appointment) {
  const title = 'Bestätigung';
  const mainMessage =
    'vielen Dank dass du einen Termin über JuriLib gebucht hast. Dein Termin wurde erfolgreich bestätigt.';
  const updated = false;
  const cancelled = false;
  const hint =
    'Falls du den Termin nicht wahrnehmen kannst, informiere die Organisation bitte rechtzeitig.';
  await sendAppointmentInformationEmail(userId, appt, title, mainMessage, updated, cancelled, hint);
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
export async function sendAppointmentCancellationEmail(userId: string, appt: Appointment) {
  const title = 'Absage';
  const mainMessage =
    'leider müssen wir die mitteilen, dass ein Termin, den du über JuriLib gebucht hast, abgesagt wurde.';
  const updated = false;
  const cancelled = true;
  const hint =
    'Über den Button kommt du zu der Terminbuchungseite, um einen neuen Termin zu vereinbaren.';
  await sendAppointmentInformationEmail(userId, appt, title, mainMessage, updated, cancelled, hint);
}

/**
 * sends email to user notifying them of changes to
 * a previously booked appointment
 */
export async function sendAppointmentChangeEmail(userId: string, appt: Appointment) {
  const title = 'Änderung';
  const mainMessage =
    'die Details zu einem Termin, den du über JuriLib gebucht hast, wurden geändert.';
  const updated = true;
  const cancelled = false;
  const hint =
    'Falls du den Termin nicht wahrnehmen kannst, informiere die Organisation bitte rechtzeitig.';
  await sendAppointmentInformationEmail(userId, appt, title, mainMessage, updated, cancelled, hint);
}

async function sendAppointmentInformationEmail(
  userId: string,
  appt: Appointment,
  title: string,
  mainMessage: string,
  updated: boolean,
  cancelled: boolean,
  hint: string
) {
  // fetch necessary data
  const user = await getUser(userId);
  const account = await getAccount(user.accountId);
  const { appointmentDate, appointmentTime } = getDateTimeString(appt.dateTimeStart);
  const employee = await getEmployee(appt.employeeId);
  const organization = await getOrganization(employee.organizationId);
  const caseTitle = await getCaseTitle(appt.caseId!);

  // construct missing variables
  const fullTitle = `Termin ${title}`;
  const userFullName = `${user.firstname} ${user.lastname}`.trim();
  const employeeFullName = `${employee.firstname} ${employee.lastname}`.trim();
  // TODO: set appt.administration url
  const apptAdministrationUrl = 'https://jurilib.de';

  await sendEmail({
    toEmail: account.email,
    subject: `${title} deines Termins bei ${organization?.name}`,
    templateFileName: 'appointment_information.html',
    templateVariables: {
      TITLE: fullTitle,
      NAME: userFullName,
      MAIN_MESSAGE: mainMessage,
      UPDATED: updated ? 'aktualisierten ' : '',
      CANCELLED: cancelled ? 'abgesagten ' : '',
      APPT_DATE: appointmentDate,
      APPT_TIME: appointmentTime,
      APPT_ORGANIZATION_NAME: organization?.name ?? 'Nicht angegeben',
      APPT_LOCATION: appt.location ?? 'Nicht angegeben',
      APPT_EMPLOYEE_NAME: employeeFullName ?? 'Nicht angegeben',
      APPT_CASE_TITLE: caseTitle ?? 'Ohne Fallzuordnung',
      APPOINTMENT_MANAGEMENT_URL: apptAdministrationUrl,
      BUTTON_TEXT: cancelled ? 'Neuen Termin buchen' : 'Zur Terminverwaltung',
      HINT: hint,
      APPT_ORGANIZATION_EMAIL: organization?.email ?? '',
      CURRENT_YEAR: new Date().getFullYear().toString(),
    },
  });
}

/**
 * ########## helper functions ##########
 */

async function getUser(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new ValidationError('notFound', 'userId', userId, 404);
  }
  return user;
}

async function getAccount(accountId: string) {
  const account = await prisma.account.findUnique({
    where: { id: accountId },
  });

  if (!account) {
    throw new ValidationError('notFound', 'accountId', accountId, 404);
  }
  return account;
}

function getDateTimeString(date: Date): { appointmentDate: string; appointmentTime: string } {
  const appointmentDate = date.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  const appointmentTime = date.toLocaleTimeString('de-DE', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return { appointmentDate, appointmentTime };
}

async function getEmployee(employeeId: string) {
  const employee = await prisma.employee.findUnique({
    where: { id: employeeId },
    select: { firstname: true, lastname: true, organizationId: true },
  });

  if (!employee) {
    throw new ValidationError('notFound', 'employeeId', employeeId, 404);
  }
  return employee;
}

async function getOrganization(organizationId: string) {
  const organization = await prisma.organization.findUnique({
    where: { id: organizationId },
    select: { name: true, email: true },
  });

  if (!organization) {
    throw new ValidationError('notFound', 'organizationId', organizationId, 404);
  }
  return organization;
}

async function getCaseTitle(caseId: string) {
  const apptCase = await prisma.case.findUnique({
    where: { id: caseId },
    select: { title: true },
  });

  if (apptCase) return apptCase.title;
  else return null;
}
