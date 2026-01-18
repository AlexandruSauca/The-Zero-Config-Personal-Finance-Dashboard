/**
 * Currency, date, and number formatting utilities
 */

/**
 * Format a number as currency
 * @param {number} amount - The amount to format
 * @param {string} currency - Currency code (default: USD)
 * @returns {string} Formatted currency string
 */
export function formatCurrency(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
}

/**
 * Format a date for display
 * @param {Date|string} date - Date to format
 * @param {string} format - Format type: 'short', 'medium', 'long'
 * @returns {string} Formatted date string
 */
export function formatDate(date, format = 'medium') {
    const d = date instanceof Date ? date : new Date(date);

    if (isNaN(d.getTime())) {
        return 'Invalid Date';
    }

    const options = {
        short: { month: 'numeric', day: 'numeric' },
        medium: { month: 'short', day: 'numeric', year: 'numeric' },
        long: { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }
    };

    return new Intl.DateTimeFormat('en-US', options[format] || options.medium).format(d);
}

/**
 * Format a number with thousand separators
 * @param {number} num - Number to format
 * @param {number} decimals - Decimal places
 * @returns {string} Formatted number string
 */
export function formatNumber(num, decimals = 0) {
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    }).format(num);
}

/**
 * Format a percentage
 * @param {number} value - Value as decimal (e.g., 0.25 for 25%)
 * @param {number} decimals - Decimal places
 * @returns {string} Formatted percentage string
 */
export function formatPercentage(value, decimals = 1) {
    return new Intl.NumberFormat('en-US', {
        style: 'percent',
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    }).format(value);
}

/**
 * Parse a date string in various formats
 * @param {string} dateStr - Date string to parse
 * @returns {Date|null} Parsed date or null if invalid
 */
export function parseDate(dateStr) {
    if (!dateStr) return null;

    // Try direct parsing first
    let date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
        return date;
    }

    // Try common formats
    const formats = [
        /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/, // MM/DD/YYYY
        /^(\d{1,2})-(\d{1,2})-(\d{4})$/,   // MM-DD-YYYY
        /^(\d{4})\/(\d{1,2})\/(\d{1,2})$/, // YYYY/MM/DD
        /^(\d{4})-(\d{1,2})-(\d{1,2})$/    // YYYY-MM-DD
    ];

    for (const format of formats) {
        const match = dateStr.match(format);
        if (match) {
            const [, a, b, c] = match;
            // Determine year position
            if (a.length === 4) {
                date = new Date(parseInt(a), parseInt(b) - 1, parseInt(c));
            } else {
                date = new Date(parseInt(c), parseInt(a) - 1, parseInt(b));
            }
            if (!isNaN(date.getTime())) {
                return date;
            }
        }
    }

    return null;
}

/**
 * Get month name from date
 * @param {Date} date - The date
 * @param {boolean} short - Use short format
 * @returns {string} Month name
 */
export function getMonthName(date, short = false) {
    return new Intl.DateTimeFormat('en-US', {
        month: short ? 'short' : 'long'
    }).format(date);
}

/**
 * Format file size
 * @param {number} bytes - Size in bytes
 * @returns {string} Formatted size string
 */
export function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
