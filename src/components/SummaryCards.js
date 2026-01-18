/**
 * Summary Cards Component
 */
import { formatCurrency, formatPercentage } from '../utils/formatters.js';
import {
    calculateTotalIncome,
    calculateTotalExpenses,
    calculateBalance,
    calculateSavingsRate
} from '../utils/calculations.js';

/**
 * Render summary cards
 * @param {Array} transactions - Array of transaction objects
 */
export function renderSummaryCards(transactions) {
    const container = document.getElementById('summary-cards');
    if (!container) return;

    const totalIncome = calculateTotalIncome(transactions);
    const totalExpenses = calculateTotalExpenses(transactions);
    const balance = calculateBalance(transactions);
    const savingsRate = calculateSavingsRate(transactions);

    const cards = [
        {
            title: 'Total Income',
            value: formatCurrency(totalIncome),
            subtitle: `${transactions.filter(t => t.type.toLowerCase() === 'income').length} transactions`,
            iconClass: 'card-income',
            icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="12" y1="19" x2="12" y2="5"></line>
        <polyline points="5 12 12 5 19 12"></polyline>
      </svg>`
        },
        {
            title: 'Total Expenses',
            value: formatCurrency(totalExpenses),
            subtitle: `${transactions.filter(t => t.type.toLowerCase() === 'expense').length} transactions`,
            iconClass: 'card-expense',
            icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <polyline points="19 12 12 19 5 12"></polyline>
      </svg>`
        },
        {
            title: 'Net Balance',
            value: formatCurrency(balance),
            subtitle: balance >= 0 ? 'Positive balance' : 'Negative balance',
            iconClass: balance >= 0 ? 'card-income' : 'card-expense',
            icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2"></rect>
        <path d="M12 8v8"></path>
        <path d="M8 12h8"></path>
      </svg>`
        },
        {
            title: 'Savings Rate',
            value: formatPercentage(savingsRate),
            subtitle: savingsRate >= 0.2 ? 'Healthy savings' : 'Could improve',
            iconClass: savingsRate >= 0.2 ? 'card-income' : 'card-expense',
            icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h3v2h4v-4c1-.5 1.7-1 2-2h2v-4h-2c0-1-.5-1.5-1-2h0V5z"></path>
        <path d="M2 9v1c0 1.1.9 2 2 2h1"></path>
        <path d="M16 11h0"></path>
      </svg>`
        }
    ];

    container.innerHTML = cards.map(card => `
    <div class="card ${card.iconClass}">
      <div class="card-header">
        <span class="card-title">${card.title}</span>
        <div class="card-icon">${card.icon}</div>
      </div>
      <div class="card-value">${card.value}</div>
      <p class="card-subtitle">${card.subtitle}</p>
    </div>
  `).join('');
}

/**
 * Get summary data for export
 * @param {Array} transactions - Array of transaction objects
 * @returns {Object} Summary data object
 */
export function getSummaryData(transactions) {
    return {
        totalIncome: calculateTotalIncome(transactions),
        totalExpenses: calculateTotalExpenses(transactions),
        balance: calculateBalance(transactions),
        savingsRate: calculateSavingsRate(transactions),
        transactionCount: transactions.length
    };
}
