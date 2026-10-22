import { describe, expect, it } from 'vitest';
import { formatBytes, UNKNOWN_VALUE } from './types';

describe('formatBytes', () => {
  it('formats measured bytes in decimal units', () => {
    expect(formatBytes(0, 'en')).toBe('0 B');
    expect(formatBytes(1500, 'en')).toBe('1.5 KB');
    expect(formatBytes(240_000_000, 'en')).toBe('240 MB');
    expect(formatBytes(1_500_000_000, 'en')).toBe('1.5 GB');
    expect(formatBytes(2_400_000_000_000, 'en')).toBe('2.4 TB');
  });

  it('passes the requested locale to number formatting', () => {
    const arabicDigits = new Intl.NumberFormat('ar', { maximumFractionDigits: 1 }).format(1.5);
    expect(formatBytes(1500, 'ar')).toBe(`${arabicDigits} KB`);
  });

  it('never turns a negative or invalid value into a measured zero', () => {
    expect(formatBytes(-1, 'en')).toBe(UNKNOWN_VALUE);
    expect(formatBytes(Number.NaN, 'en')).toBe(UNKNOWN_VALUE);
    expect(formatBytes(Number.POSITIVE_INFINITY, 'en')).toBe(UNKNOWN_VALUE);
    expect(formatBytes(Number.NEGATIVE_INFINITY, 'en')).toBe(UNKNOWN_VALUE);
  });
});
