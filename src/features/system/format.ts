/** Byte counts and rates rendered the way the panel shows them. */

/** 1024-based units; the panel shows one decimal until the value is large. */
const UNITS = ["B", "KB", "MB", "GB", "TB"];

export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < UNITS.length - 1) {
    value /= 1024;
    unit += 1;
  }
  // Whole bytes and tens of units need no decimal; 1.5 GB does.
  const digits = unit === 0 || value >= 100 ? 0 : 1;
  return `${value.toFixed(digits)} ${UNITS[unit]}`;
}

/**
 * Rates step at 1024 like sizes do, but never print a rounded "1024 KB/s": that is
 * 1.0 MB/s wearing the wrong unit, and the figure and its scale would then disagree.
 */
export function formatRate(bytesPerSecond: number | null): string {
  if (bytesPerSecond === null || !Number.isFinite(bytesPerSecond) || bytesPerSecond < 0) return "—";
  let value = bytesPerSecond;
  let unit = 0;
  while (value >= 1024 && unit < UNITS.length - 1) {
    value /= 1024;
    unit += 1;
  }
  let digits = digitsFor(unit, value);
  // Rounding at the top of a unit (1023.6 KB) would read as 1024, so step up instead.
  if (unit < UNITS.length - 1 && Number(value.toFixed(digits)) >= 1024) {
    value /= 1024;
    unit += 1;
    digits = digitsFor(unit, value);
  }
  return `${value.toFixed(digits)} ${UNITS[unit]}/s`;
}

/** Whole bytes and three-digit figures need no decimal; 1.5 KB does. */
function digitsFor(unit: number, value: number) {
  return unit === 0 || value >= 100 ? 0 : 1;
}

export function formatPercent(percent: number | null): string {
  if (percent === null || !Number.isFinite(percent)) return "—";
  return `${Math.round(percent)}%`;
}

/** Used/total for the memory row, e.g. "11.2 / 32.0 GB". */
export function formatMemoryPair(usedBytes: number, totalBytes: number): string {
  if (!Number.isFinite(usedBytes) || !Number.isFinite(totalBytes) || totalBytes <= 0) return "—";
  return `${formatBytes(usedBytes)} / ${formatBytes(totalBytes)}`;
}

/** Fraction of a bar, clamped so a bad reading cannot overflow the track. */
export function barFraction(percent: number | null): number {
  if (percent === null || !Number.isFinite(percent)) return 0;
  return Math.min(1, Math.max(0, percent / 100));
}

/** normal: nothing to see; warm: worth a glance; high: nearly spent. */
export type MeterLevel = "normal" | "warm" | "high";

/**
 * How loud a bar should be. A bar that looks the same at 5% and 95% makes the reader
 * parse the number; the hue answers "should I care" at a glance. The figure itself
 * stays in the text colour, so colour is never the only thing carrying the reading.
 */
export function meterLevel(fraction: number): MeterLevel {
  if (!Number.isFinite(fraction)) return "normal";
  if (fraction >= 0.85) return "high";
  if (fraction >= 0.65) return "warm";
  return "normal";
}
