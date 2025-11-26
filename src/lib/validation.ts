export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const MIN_PASSWORD_LENGTH = 8;

export const sanitizeString = (value: unknown): string =>
  typeof value === "string" ? value.trim() : "";

export const isValidEmail = (value: string): boolean => EMAIL_REGEX.test(value);
