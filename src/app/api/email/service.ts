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
export async function sendAppointmentConfirmationEmail() {
  // implementation here
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
