// src/utils/format.ts

/**
 * Formats a number as Vietnamese currency (VND).
 * @param value The number to format.
 * @returns Formatted currency string, e.g., "1.500.000 ₫".
 */
export const formatCurrency = (value: number): string => {
    if (isNaN(value)) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0,
    }).format(value);
};

/**
 * Formats a date string to DD/MM/YYYY.
 * @param dateString The date string in ISO format or parsable by Date.
 * @returns Formatted date string, e.g., "12/01/2026".
 */
export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
};