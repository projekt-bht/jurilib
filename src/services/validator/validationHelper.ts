//Generated, too tired for this
export function isValidEmail(email: string) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

export function isValidGermanPhone(phone: string) {
  const regex = /^(\+49[1-9][0-9]{7,12}|0(15[0-9]|16[0-9]|17[0-9])[0-9]{7,10})$/;
  return regex.test(phone);
}

export function isStrongPassword(password: string): boolean {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) && // Upper
    /[a-z]/.test(password) && // Lower
    /[0-9]/.test(password) && // Number
    /[^A-Za-z0-9]/.test(password) // Specials
  );
}
