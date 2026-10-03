import { CustomDateRange, DatePeriod } from './types';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const SHORT_MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

/**
 * Parses a date string into a Date object.
 * Supports: "Today", "Yesterday", "Now", "12 Feb 2025", "2025-02-12", "12-02-2025", "12/02/2025", etc.
 */
export function parseDate(dateStr: string, now: Date = new Date()): Date | null {
  if (!dateStr) return null;
  const trimmed = dateStr.trim();
  if (trimmed.length === 0) return null;

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  if (trimmed.toLowerCase() === 'today' || trimmed.toLowerCase() === 'now') {
    return today;
  }
  if (trimmed.toLowerCase() === 'yesterday') {
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday;
  }

  // Check ISO format: yyyy-mm-dd
  const isoMatch = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(trimmed);
  if (isoMatch) {
    const y = parseInt(isoMatch[1], 10);
    const m = parseInt(isoMatch[2], 10) - 1;
    const d = parseInt(isoMatch[3], 10);
    return new Date(y, m, d);
  }

  // Check "12 Feb 2025" or "12 February 2025"
  const textDateMatch = /^(\d{1,2})\s+([A-Za-z]+)\s*(\d{4})?$/.exec(trimmed);
  if (textDateMatch) {
    const d = parseInt(textDateMatch[1], 10);
    const mStr = textDateMatch[2].toLowerCase();
    const y = textDateMatch[3] ? parseInt(textDateMatch[3], 10) : now.getFullYear();

    const mIdx = SHORT_MONTH_NAMES.findIndex(
      (sm, idx) => sm.toLowerCase() === mStr || MONTH_NAMES[idx].toLowerCase() === mStr
    );
    if (mIdx !== -1) {
      return new Date(y, mIdx, d);
    }
  }

  // Check dd/mm/yyyy or dd-mm-yyyy
  const parts = trimmed.split(/[-/]/);
  if (parts.length === 3) {
    const d = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10) - 1;
    let y = parseInt(parts[2], 10);
    if (!isNaN(d) && !isNaN(m) && !isNaN(y)) {
      if (y < 100) y += 2000;
      return new Date(y, m, d);
    }
  }

  const parsed = new Date(trimmed);
  if (!isNaN(parsed.getTime())) {
    return new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
  }

  return null;
}

/**
 * Formats a Date object into "12 Feb 2025" format
 */
export function formatDate(date: Date): string {
  const d = date.getDate();
  const m = SHORT_MONTH_NAMES[date.getMonth()];
  const y = date.getFullYear();
  return `${d} ${m} ${y}`;
}

export function parseBudgetMonth(monthStr: string, now: Date = new Date()): { year: number; month: number } | null {
  if (!monthStr) return null;
  const trimmed = monthStr.trim();
  if (trimmed.length === 0) return null;

  const lower = trimmed.toLowerCase();
  if (lower === 'current month' || lower === 'this month') {
    return { year: now.getFullYear(), month: now.getMonth() };
  }
  if (lower === 'previous month' || lower === 'last month') {
    const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    return { year: prev.getFullYear(), month: prev.getMonth() };
  }

  const parts = trimmed.split(/\s+/);
  const mStr = parts[0].toLowerCase();
  const yPart = parts[1] ? parseInt(parts[1], 10) : now.getFullYear();

  const mIdx = MONTH_NAMES.findIndex(
    (name, idx) => name.toLowerCase() === mStr || SHORT_MONTH_NAMES[idx].toLowerCase() === mStr
  );

  if (mIdx !== -1) {
    return { year: isNaN(yPart) ? now.getFullYear() : yPart, month: mIdx };
  }

  return null;
}

export function formatMonthYear(date: Date): string {
  return `${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`;
}

/**
 * Checks whether a transaction date string belongs to the given DatePeriod.
 */
export function isDateInPeriod(
  dateStr: string,
  period: DatePeriod,
  now: Date = new Date(),
  customRange?: CustomDateRange | null
): boolean {
  if (period === 'ALL_TIME') return true;

  const txDate = parseDate(dateStr, now);
  if (!txDate) return false;

  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();


  switch (period) {
    case 'CURRENT_WEEK': {
      // Week starts Monday and ends Sunday
      const day = now.getDay();
      const diffToMonday = (day === 0 ? -6 : 1) - day;
      const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() + diffToMonday);
      startOfWeek.setHours(0, 0, 0, 0);

      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(endOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);

      return txDate >= startOfWeek && txDate <= endOfWeek;
    }

    case 'CURRENT_MONTH':
      return txDate.getFullYear() === currentYear && txDate.getMonth() === currentMonth;

    case 'PREVIOUS_MONTH': {
      const prevDate = new Date(currentYear, currentMonth - 1, 1);
      return txDate.getFullYear() === prevDate.getFullYear() && txDate.getMonth() === prevDate.getMonth();
    }

    case 'CUSTOM': {
      if (!customRange) return true;
      const start = parseDate(customRange.startDate, now);
      const end = parseDate(customRange.endDate, now);
      const afterStart = !start || txDate >= start;
      const beforeEnd = !end || txDate <= end;
      return afterStart && beforeEnd;
    }

    default:
      return true;
  }
}

/**
 * Checks if a transaction date matches a budget month string, e.g. "March 2025"
 */
export function isDateInBudgetMonth(dateStr: string, budgetMonth: string, now: Date = new Date()): boolean {
  const parsedBudgetMonth = parseBudgetMonth(budgetMonth, now);
  if (!parsedBudgetMonth) return true; // match all if format not parsed

  const txDate = parseDate(dateStr, now);
  if (!txDate) return false;

  return (
    txDate.getFullYear() === parsedBudgetMonth.year &&
    txDate.getMonth() === parsedBudgetMonth.month
  );
}
