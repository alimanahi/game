/**
 * Converts English digits (0-9) to Persian digits (۰-۹)
 */
export function toPersianDigits(input: string | number): string {
  if (input === undefined || input === null) return '';
  const str = input.toString();
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return str.replace(/[0-9]/g, (w) => persianDigits[parseInt(w, 10)]);
}

/**
 * Format seconds into mm:ss with Persian numbers
 */
export function formatDurationPersian(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  const formatted = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  return toPersianDigits(formatted);
}

/**
 * Get today's local date string in YYYY-MM-DD
 */
export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Calculate difference in days between two YYYY-MM-DD strings
 */
export function getDaysDifference(dateStr1: string, dateStr2: string): number {
  if (!dateStr1 || !dateStr2) return 999;
  const d1 = new Date(dateStr1);
  const d2 = new Date(dateStr2);
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}
