/**
 * Formats a module ID into a human-readable name
 * Example: "lead-management" -> "Lead Management"
 */
export function formatModuleName(moduleId: string): string {
  return moduleId
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Formats a date string into a localized date
 */
export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString();
}

/**
 * Formats a number as currency
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  }).format(amount);
}