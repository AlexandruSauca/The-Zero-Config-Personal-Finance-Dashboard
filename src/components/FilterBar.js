/**
 * Filter Bar Component
 */
import { getUniqueCategories, getDateRange } from '../utils/calculations.js';

/**
 * Render filter bar
 * @param {Array} transactions - Array of transaction objects
 * @param {Object} filters - Current filter values
 * @param {Function} onFilterChange - Callback when filters change
 */
export function renderFilterBar(transactions, filters = {}, onFilterChange) {
    const container = document.getElementById('filter-bar');
    if (!container) return;

    const categories = getUniqueCategories(transactions);
    const dateRange = getDateRange(transactions);

    // Format dates for input
    const formatDateForInput = (date) => {
        if (!date) return '';
        return date.toISOString().split('T')[0];
    };

    container.innerHTML = `
    <div class="filter-group">
      <label class="filter-label">Search:</label>
      <input 
        type="text" 
        class="input search-input" 
        id="filter-search"
        placeholder="Search transactions..."
        value="${filters.search || ''}"
      >
    </div>
    
    <div class="filter-group">
      <label class="filter-label">Category:</label>
      <select class="input select" id="filter-category">
        <option value="all">All Categories</option>
        ${categories.map(cat => `
          <option value="${cat}" ${filters.category === cat ? 'selected' : ''}>${cat}</option>
        `).join('')}
      </select>
    </div>
    
    <div class="filter-group">
      <label class="filter-label">Type:</label>
      <select class="input select" id="filter-type">
        <option value="all" ${!filters.type || filters.type === 'all' ? 'selected' : ''}>All Types</option>
        <option value="income" ${filters.type === 'income' ? 'selected' : ''}>Income</option>
        <option value="expense" ${filters.type === 'expense' ? 'selected' : ''}>Expense</option>
      </select>
    </div>
    
    <div class="filter-group">
      <label class="filter-label">From:</label>
      <input 
        type="date" 
        class="input" 
        id="filter-date-from"
        value="${filters.dateFrom || formatDateForInput(dateRange.min)}"
      >
    </div>
    
    <div class="filter-group">
      <label class="filter-label">To:</label>
      <input 
        type="date" 
        class="input" 
        id="filter-date-to"
        value="${filters.dateTo || formatDateForInput(dateRange.max)}"
      >
    </div>
    
    <div class="filter-actions">
      <button class="btn btn-ghost" id="filter-reset">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
          <path d="M3 3v5h5"></path>
        </svg>
        Reset
      </button>
    </div>
  `;

    // Attach event listeners
    attachFilterEventListeners(onFilterChange);
}

/**
 * Attach event listeners to filter controls
 * @param {Function} onFilterChange - Callback when filters change
 */
function attachFilterEventListeners(onFilterChange) {
    const searchInput = document.getElementById('filter-search');
    const categorySelect = document.getElementById('filter-category');
    const typeSelect = document.getElementById('filter-type');
    const dateFromInput = document.getElementById('filter-date-from');
    const dateToInput = document.getElementById('filter-date-to');
    const resetBtn = document.getElementById('filter-reset');

    // Debounce search input
    let searchTimeout;
    searchInput?.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            triggerFilterChange(onFilterChange);
        }, 300);
    });

    // Immediate changes for selects and dates
    [categorySelect, typeSelect, dateFromInput, dateToInput].forEach(el => {
        el?.addEventListener('change', () => {
            triggerFilterChange(onFilterChange);
        });
    });

    // Reset button
    resetBtn?.addEventListener('click', () => {
        if (searchInput) searchInput.value = '';
        if (categorySelect) categorySelect.value = 'all';
        if (typeSelect) typeSelect.value = 'all';
        if (dateFromInput) dateFromInput.value = '';
        if (dateToInput) dateToInput.value = '';
        triggerFilterChange(onFilterChange);
    });
}

/**
 * Get current filter values and trigger callback
 * @param {Function} onFilterChange - Callback function
 */
function triggerFilterChange(onFilterChange) {
    if (!onFilterChange) return;

    const filters = getFilterValues();
    onFilterChange(filters);
}

/**
 * Get current filter values
 * @returns {Object} Filter values
 */
export function getFilterValues() {
    return {
        search: document.getElementById('filter-search')?.value || '',
        category: document.getElementById('filter-category')?.value || 'all',
        type: document.getElementById('filter-type')?.value || 'all',
        dateFrom: document.getElementById('filter-date-from')?.value || '',
        dateTo: document.getElementById('filter-date-to')?.value || ''
    };
}
