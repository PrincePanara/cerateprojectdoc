import { twMerge } from 'tailwind-merge';

export function cn(...parts: (string | false | null | undefined)[]): string {
  return twMerge(parts.filter(Boolean).join(' '));
}

export function uid(prefix = 'id'): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

export function pad(n: number, width = 2): string {
  return String(n).padStart(width, '0');
}