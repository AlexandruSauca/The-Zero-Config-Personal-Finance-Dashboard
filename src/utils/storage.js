/**
 * Local storage wrapper for data persistence
 */

const STORAGE_KEY = 'finance_dashboard_data';
const SETTINGS_KEY = 'finance_dashboard_settings';

/**
 * Save transactions to local storage
 * @param {Array} transactions - Array of transaction objects
 */
export function saveTransactions(transactions) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
            transactions,
            lastUpdated: new Date().toISOString()
        }));
        return true;
    } catch (error) {
        console.error('Failed to save transactions:', error);
        return false;
    }
}

/**
 * Load transactions from local storage
 * @returns {Object|null} Object with transactions and lastUpdated, or null
 */
export function loadTransactions() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        if (!data) return null;

        const parsed = JSON.parse(data);
        // Restore Date objects
        if (parsed.transactions) {
            parsed.transactions = parsed.transactions.map(t => ({
                ...t,
                date: new Date(t.date)
            }));
        }
        return parsed;
    } catch (error) {
        console.error('Failed to load transactions:', error);
        return null;
    }
}

/**
 * Clear all stored transactions
 */
export function clearTransactions() {
    try {
        localStorage.removeItem(STORAGE_KEY);
        return true;
    } catch (error) {
        console.error('Failed to clear transactions:', error);
        return false;
    }
}

/**
 * Save user settings
 * @param {Object} settings - Settings object
 */
export function saveSettings(settings) {
    try {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
        return true;
    } catch (error) {
        console.error('Failed to save settings:', error);
        return false;
    }
}

/**
 * Load user settings
 * @returns {Object} Settings object with defaults
 */
export function loadSettings() {
    const defaults = {
        currency: 'USD',
        pageSize: 10,
        defaultView: 'dashboard'
    };

    try {
        const data = localStorage.getItem(SETTINGS_KEY);
        if (!data) return defaults;
        return { ...defaults, ...JSON.parse(data) };
    } catch (error) {
        console.error('Failed to load settings:', error);
        return defaults;
    }
}

/**
 * Check if there is stored data
 * @returns {boolean}
 */
export function hasStoredData() {
    return localStorage.getItem(STORAGE_KEY) !== null;
}
