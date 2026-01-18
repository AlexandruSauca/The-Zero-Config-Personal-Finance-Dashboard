/**
 * Financial calculations utility functions
 */

/**
 * Calculate total income from transactions
 * @param {Array} transactions - Array of transaction objects
 * @returns {number} Total income
 */
export function calculateTotalIncome(transactions) {
    return transactions
        .filter(t => t.type === 'income' || t.type === 'Income')
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);
}

/**
 * Calculate total expenses from transactions
 * @param {Array} transactions - Array of transaction objects
 * @returns {number} Total expenses
 */
export function calculateTotalExpenses(transactions) {
    return transactions
        .filter(t => t.type === 'expense' || t.type === 'Expense')
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);
}

/**
 * Calculate net balance (income - expenses)
 * @param {Array} transactions - Array of transaction objects
 * @returns {number} Net balance
 */
export function calculateBalance(transactions) {
    const income = calculateTotalIncome(transactions);
    const expenses = calculateTotalExpenses(transactions);
    return income - expenses;
}

/**
 * Calculate savings rate as a percentage
 * @param {Array} transactions - Array of transaction objects
 * @returns {number} Savings rate (0-1)
 */
export function calculateSavingsRate(transactions) {
    const income = calculateTotalIncome(transactions);
    if (income === 0) return 0;
    const balance = calculateBalance(transactions);
    return Math.max(0, balance / income);
}

/**
 * Group transactions by category and calculate totals
 * @param {Array} transactions - Array of transaction objects
 * @param {string} type - 'income', 'expense', or 'all'
 * @returns {Object} Object with category names as keys and totals as values
 */
export function calculateByCategory(transactions, type = 'all') {
    let filtered = transactions;

    if (type !== 'all') {
        filtered = transactions.filter(t =>
            t.type.toLowerCase() === type.toLowerCase()
        );
    }

    return filtered.reduce((acc, t) => {
        const category = t.category || 'Uncategorized';
        acc[category] = (acc[category] || 0) + Math.abs(t.amount);
        return acc;
    }, {});
}

/**
 * Group transactions by month and calculate totals
 * @param {Array} transactions - Array of transaction objects
 * @returns {Object} Object with month keys and income/expense totals
 */
export function calculateByMonth(transactions) {
    const monthlyData = {};

    transactions.forEach(t => {
        const date = new Date(t.date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

        if (!monthlyData[monthKey]) {
            monthlyData[monthKey] = { income: 0, expenses: 0, month: monthKey };
        }

        if (t.type.toLowerCase() === 'income') {
            monthlyData[monthKey].income += Math.abs(t.amount);
        } else {
            monthlyData[monthKey].expenses += Math.abs(t.amount);
        }
    });

    // Sort by month
    return Object.values(monthlyData).sort((a, b) => a.month.localeCompare(b.month));
}

/**
 * Get unique categories from transactions
 * @param {Array} transactions - Array of transaction objects
 * @returns {Array} Array of unique category names
 */
export function getUniqueCategories(transactions) {
    const categories = new Set(transactions.map(t => t.category || 'Uncategorized'));
    return Array.from(categories).sort();
}

/**
 * Get date range from transactions
 * @param {Array} transactions - Array of transaction objects
 * @returns {Object} Object with min and max dates
 */
export function getDateRange(transactions) {
    if (transactions.length === 0) {
        return { min: null, max: null };
    }

    const dates = transactions.map(t => new Date(t.date).getTime());
    return {
        min: new Date(Math.min(...dates)),
        max: new Date(Math.max(...dates))
    };
}

/**
 * Filter transactions by date range
 * @param {Array} transactions - Array of transaction objects
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Array} Filtered transactions
 */
export function filterByDateRange(transactions, startDate, endDate) {
    return transactions.filter(t => {
        const date = new Date(t.date);
        return date >= startDate && date <= endDate;
    });
}

/**
 * Filter transactions by category
 * @param {Array} transactions - Array of transaction objects
 * @param {string} category - Category name
 * @returns {Array} Filtered transactions
 */
export function filterByCategory(transactions, category) {
    if (!category || category === 'all') return transactions;
    return transactions.filter(t => t.category === category);
}

/**
 * Filter transactions by type
 * @param {Array} transactions - Array of transaction objects
 * @param {string} type - 'income', 'expense', or 'all'
 * @returns {Array} Filtered transactions
 */
export function filterByType(transactions, type) {
    if (!type || type === 'all') return transactions;
    return transactions.filter(t => t.type.toLowerCase() === type.toLowerCase());
}

/**
 * Search transactions by description
 * @param {Array} transactions - Array of transaction objects
 * @param {string} query - Search query
 * @returns {Array} Matching transactions
 */
export function searchTransactions(transactions, query) {
    if (!query) return transactions;
    const lowerQuery = query.toLowerCase();
    return transactions.filter(t =>
        t.description.toLowerCase().includes(lowerQuery) ||
        t.category.toLowerCase().includes(lowerQuery)
    );
}

/**
 * Calculate average transaction amount
 * @param {Array} transactions - Array of transaction objects
 * @param {string} type - 'income', 'expense', or 'all'
 * @returns {number} Average amount
 */
export function calculateAverage(transactions, type = 'all') {
    let filtered = transactions;

    if (type !== 'all') {
        filtered = transactions.filter(t =>
            t.type.toLowerCase() === type.toLowerCase()
        );
    }

    if (filtered.length === 0) return 0;

    const total = filtered.reduce((sum, t) => sum + Math.abs(t.amount), 0);
    return total / filtered.length;
}
