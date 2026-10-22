import type { Locale } from '../../copy';

/** A reading is either not available at all, or a value with explicit provenance. */
export type UsageReading =
  | { status: 'unknown' }
  | {
      status: 'value';
      bytes: number;
      provenance: 'measured' | 'estimated';
      coverage: 'complete' | 'partial';
    };

export type CollectorStatus =
  | 'not_started'
  | 'collecting'
  | 'paused'
  | 'permission_required'
  | 'error'
  | 'unsupported';

export type FeedbackTone = 'info' | 'success' | 'error';

/** Placeholder for an unknown quantity. Never a zero. */
export const UNKNOWN_VALUE = '–';

const byteUnits = ['B', 'KB', 'MB', 'GB', 'TB'] as const;

/** Formats a measured byte count with locale digits in decimal units. Negative or invalid input stays unknown. */
export function formatBytes(bytes: number, locale: Locale): string {
  if (!Number.isFinite(bytes) || bytes < 0) return UNKNOWN_VALUE;
  let value = bytes;
  let unit = 0;
  while (value >= 1000 && unit < byteUnits.length - 1) {
    value /= 1000;
    unit += 1;
  }
  const digits = new Intl.NumberFormat(locale, { maximumFractionDigits: unit === 0 ? 0 : 1 }).format(value);
  return `${digits} ${byteUnits[unit]}`;
}
