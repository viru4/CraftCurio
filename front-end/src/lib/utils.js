import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function isValidPublishableKey(key) {
  // Guard against common misconfigurations where environment vars are set to
  // the literal strings "undefined" or "null" or empty values.
  return typeof key === 'string' && key.length > 0 && key !== 'undefined' && key !== 'null';
}
