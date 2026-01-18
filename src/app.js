/**
 * Main Application Logic
 */
import { renderHeader } from './components/Header.js';
import { renderFileUpload } from './components/FileUpload.js';
import { renderSummaryCards, getSummaryData } from './components/SummaryCards.js';
import { renderCharts, destroyCharts, getCategoryData, getMonthlyData } from './components/Charts.js';
import { renderTransactionTable, resetTableState } from './components/TransactionTable.js';
import { renderFilterBar } from './components/FilterBar.js';
import { saveTransactions, loadTransactions, clearTransactions } from './utils/storage.js';
import { exportToExcel, exportSummaryReport } from './utils/exportData.js';
import {
    filterByDateRange,
    filterByCategory,
    filterByType,
    searchTransactions
} from './utils/calculations.js';

// Application state
let state = {
    transactions: [],
    filteredTransactions: [],
    filters: {
        search: '',
        category: 'all',
        type: 'all',
        dateFrom: '',
        dateTo: ''
    },
    isLoaded: false
};

/**
 * Initialize the application
 */
export function initApp() {
    // Check for stored data
    const stored = loadTransactions();

    if (stored && stored.transactions && stored.transactions.length > 0) {
        state.transactions = stored.transactions;
        state.filteredTransactions = stored.transactions;
        state.isLoaded = true;
        renderDashboard();
    } else {
        renderUploadView();
    }
}

/**
 * Render the upload view (initial state)
 */
function renderUploadView() {
    const uploadSection = document.getElementById('upload-section');
    const dashboardSection = document.getElementById('dashboard-section');

    uploadSection?.classList.remove('hidden');
    dashboardSection?.classList.add('hidden');

    renderHeader({ hasData: false });
    renderFileUpload({
        onFileLoaded: handleFileLoaded,
        onError: handleError
    });
}

/**
 * Render the dashboard view
 */
function renderDashboard() {
    const uploadSection = document.getElementById('upload-section');
    const dashboardSection = document.getElementById('dashboard-section');

    uploadSection?.classList.add('hidden');
    dashboardSection?.classList.remove('hidden');

    renderHeader({
        hasData: true,
        onClearData: handleClearData,
        onExport: handleExport
    });

    renderFilterBar(state.transactions, state.filters, handleFilterChange);
    renderSummaryCards(state.filteredTransactions);
    renderCharts(state.filteredTransactions);
    renderTransactionTable(state.filteredTransactions, { resetPage: true });
}

/**
 * Handle successful file load
 * @param {Object} result - Parse result
 */
function handleFileLoaded(result) {
    state.transactions = result.transactions;
    state.filteredTransactions = result.transactions;
    state.isLoaded = true;

    // Save to local storage
    saveTransactions(result.transactions);

    // Show success toast
    showToast(`Loaded ${result.parsedRows} transactions from ${result.fileName}`, 'success');

    // Render dashboard
    renderDashboard();
}

/**
 * Handle errors
 * @param {string} message - Error message
 */
function handleError(message) {
    showToast(message, 'error');
}

/**
 * Handle filter changes
 * @param {Object} filters - New filter values
 */
function handleFilterChange(filters) {
    state.filters = filters;
    applyFilters();
}

/**
 * Apply current filters to transactions
 */
function applyFilters() {
    let filtered = [...state.transactions];

    // Search
    if (state.filters.search) {
        filtered = searchTransactions(filtered, state.filters.search);
    }

    // Category
    if (state.filters.category && state.filters.category !== 'all') {
        filtered = filterByCategory(filtered, state.filters.category);
    }

    // Type
    if (state.filters.type && state.filters.type !== 'all') {
        filtered = filterByType(filtered, state.filters.type);
    }

    // Date range
    if (state.filters.dateFrom || state.filters.dateTo) {
        const startDate = state.filters.dateFrom
            ? new Date(state.filters.dateFrom)
            : new Date(0);
        const endDate = state.filters.dateTo
            ? new Date(state.filters.dateTo)
            : new Date(8640000000000000);
        filtered = filterByDateRange(filtered, startDate, endDate);
    }

    state.filteredTransactions = filtered;

    // Update views
    renderSummaryCards(state.filteredTransactions);
    renderCharts(state.filteredTransactions);
    renderTransactionTable(state.filteredTransactions, { resetPage: true });
}

/**
 * Handle data export
 * @param {string} format - Export format ('excel' or 'csv')
 */
function handleExport(format) {
    if (state.filteredTransactions.length === 0) {
        showToast('No data to export', 'error');
        return;
    }

    try {
        const summary = getSummaryData(state.filteredTransactions);
        const categoryData = getCategoryData(state.filteredTransactions);
        const monthlyData = getMonthlyData(state.filteredTransactions);

        if (format === 'excel') {
            exportSummaryReport(summary, categoryData, monthlyData, 'finance_report');
            showToast('Report exported successfully', 'success');
        }
    } catch (error) {
        showToast('Failed to export data', 'error');
        console.error('Export error:', error);
    }
}

/**
 * Handle clear data action
 */
function handleClearData() {
    // Clear state
    state.transactions = [];
    state.filteredTransactions = [];
    state.filters = {
        search: '',
        category: 'all',
        type: 'all',
        dateFrom: '',
        dateTo: ''
    };
    state.isLoaded = false;

    // Clear storage
    clearTransactions();

    // Destroy charts
    destroyCharts();

    // Reset table state
    resetTableState();

    // Render upload view
    renderUploadView();

    showToast('All data cleared', 'success');
}

/**
 * Show toast notification
 * @param {string} message - Message to display
 * @param {string} type - 'success' or 'error'
 */
function showToast(message, type = 'success') {
    // Remove existing toast
    const existing = document.querySelector('.toast');
    if (existing) {
        existing.remove();
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      ${type === 'success'
            ? '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>'
            : '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>'
        }
    </svg>
    <span>${message}</span>
  `;

    document.body.appendChild(toast);

    // Auto remove after 4 seconds
    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}
