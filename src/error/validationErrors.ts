/**
 * Custom error class for handling validation errors.
 * Usage:
 * throw new ValidationError('duplicate', 'email', input.email, 400);
 */

export class ValidationError extends Error {
  constructor(
    public details:
      | 'duplicate'
      | 'notFound'
      | 'invalidInput'
      | 'mismatch'
      | 'missingRequiredValue'
      | 'invalidReference'
      | 'overlappingAppointment'
      | 'invalidContentType',
    public field?: string,
    public value?: unknown,
    public statusCode: number = 400
  ) {
    super(details);
    this.name = 'ValidationError';
  }
  getErrorMessage(): string {
    switch (this.details) {
      case 'duplicate':
        return 'There is already an entry with these attributes.';
      case 'notFound':
        return 'The entry could not be found.';
      case 'invalidInput':
        return 'The given input is invalid.';
      case 'mismatch':
        return 'The given ID in the parameter does not match the ID in the body.';
      case 'missingRequiredValue':
        return `The value for required field ${this.field} is missing.`;
      case 'invalidReference':
        return 'The reference is invalid.';
      case 'overlappingAppointment':
        return 'The appointment overlaps with an existing appointment.';
      case 'invalidContentType':
        return 'Invalid content type, must be application/json';
    }
  }
}
