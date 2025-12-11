import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Areas } from '~/generated/prisma/enums';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export type AreaKeys = keyof typeof Areas;

// the following is purely vibe coded
// Build reverse lookup (value → key)
const AreaValuesToKeysMap: Record<Areas, AreaKeys> = Object.fromEntries(
  Object.entries(Areas).map(([key, value]) => [value, key])
) as Record<Areas, AreaKeys>;

// Function version
export function areaValuesToKeys(value: string): AreaKeys {
  return AreaValuesToKeysMap[value as Areas];
}
