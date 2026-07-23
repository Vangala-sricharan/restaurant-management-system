/**
 * Formats a number into Indian Rupee (₹) format using Indian numbering system.
 * Examples: 299 -> ₹299, 1499 -> ₹1,499, 12999 -> ₹12,999
 */
export function formatINR(amount: number): string {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '₹0';
  }
  const formatted = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(amount);

  return `₹${formatted}`;
}

export function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(d);
  } catch {
    return dateString;
  }
}
