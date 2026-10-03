/**
 * Formats a numeric monetary value into standard Indian Currency representation.
 * Example:
 * 48250 -> "₹48,250"
 * 2499 -> "₹2,499"
 * 100000 -> "₹1,00,000"
 */
export function formatCurrency(amount: number, showDecimals: boolean = false): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return '₹0';
  }

  const rounded = Math.round(amount * 100) / 100;
  const isNegative = rounded < 0;
  const absVal = Math.abs(rounded);

  const parts = showDecimals ? absVal.toFixed(2).split('.') : [Math.round(absVal).toString()];
  let integerPart = parts[0];
  const decimalPart = parts[1] ? `.${parts[1]}` : '';

  // Indian number grouping: last 3 digits, then groups of 2 digits
  if (integerPart.length > 3) {
    const last3 = integerPart.substring(integerPart.length - 3);
    const otherDigits = integerPart.substring(0, integerPart.length - 3);
    integerPart = otherDigits.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + last3;
  }

  const prefix = isNegative ? '-₹' : '₹';
  return `${prefix}${integerPart}${decimalPart}`;
}

export function formatCompactNumber(amount: number): string {
  if (Math.abs(amount) >= 10000000) {
    return `₹${(amount / 10000000).toFixed(1)}Cr`;
  }
  if (Math.abs(amount) >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`;
  }
  if (Math.abs(amount) >= 1000) {
    return `₹${(amount / 1000).toFixed(1)}k`;
  }
  return `₹${Math.round(amount)}`;
}
