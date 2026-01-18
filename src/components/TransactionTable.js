/**
 * Transaction Table Component
 */
import { formatCurrency, formatDate } from '../utils/formatters.js';

let currentPage = 1;
let pageSize = 10;
let sortColumn = 'date';
let sortDirection = 'desc';

/**
 * Render transaction table
 * @param {Array} transactions - Array of transaction objects
 * @param {Object} options - Table options
 */
export function renderTransactionTable(transactions, options = {}) {
    const container = document.getElementById('table-container');
    if (!container) return;

    // Reset to page 1 if it's a new dataset
    if (options.resetPage) {
        currentPage = 1;
    }

    // Sort transactions
    const sorted = sortTransactions(transactions, sortColumn, sortDirection);

    // Paginate
    const totalPages = Math.ceil(sorted.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const paginated = sorted.slice(startIndex, startIndex + pageSize);

    container.innerHTML = `
    <div class="table-header">
      <span class="table-count">${transactions.length} transactions</span>
      <div class="table-page-size">
        <label class="filter-label">Show:</label>
        <select class="input select" id="page-size-select" style="min-width: 80px;">
          <option value="10" ${pageSize === 10 ? 'selected' : ''}>10</option>
          <option value="25" ${pageSize === 25 ? 'selected' : ''}>25</option>
          <option value="50" ${pageSize === 50 ? 'selected' : ''}>50</option>
          <option value="100" ${pageSize === 100 ? 'selected' : ''}>100</option>
        </select>
      </div>
    </div>
    <div class="table-wrapper">
      <table class="table">
        <thead>
          <tr>
            <th class="sortable ${sortColumn === 'date' ? 'sorted' : ''}" data-column="date">
              Date
              <span class="sort-icon">${getSortIcon('date')}</span>
            </th>
            <th class="sortable ${sortColumn === 'description' ? 'sorted' : ''}" data-column="description">
              Description
              <span class="sort-icon">${getSortIcon('description')}</span>
            </th>
            <th class="sortable ${sortColumn === 'category' ? 'sorted' : ''}" data-column="category">
              Category
              <span class="sort-icon">${getSortIcon('category')}</span>
            </th>
            <th class="sortable ${sortColumn === 'amount' ? 'sorted' : ''}" data-column="amount" style="text-align: right;">
              Amount
              <span class="sort-icon">${getSortIcon('amount')}</span>
            </th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          ${paginated.length > 0 ? paginated.map(t => `
            <tr>
              <td>${formatDate(t.date, 'medium')}</td>
              <td>${escapeHtml(t.description || '-')}</td>
              <td><span class="badge">${escapeHtml(t.category)}</span></td>
              <td class="amount-cell ${t.type.toLowerCase() === 'income' ? 'amount-income' : 'amount-expense'}" style="text-align: right;">
                ${t.type.toLowerCase() === 'expense' ? '-' : '+'}${formatCurrency(t.amount)}
              </td>
              <td>
                <span class="badge ${t.type.toLowerCase() === 'income' ? 'badge-success' : 'badge-error'}">
                  ${t.type}
                </span>
              </td>
            </tr>
          `).join('') : `
            <tr>
              <td colspan="5" style="text-align: center; padding: 2rem;">
                No transactions found
              </td>
            </tr>
          `}
        </tbody>
      </table>
    </div>
    ${totalPages > 1 ? renderPagination(currentPage, totalPages, transactions.length) : ''}
  `;

    // Attach event listeners
    attachTableEventListeners(transactions, options.onUpdate);
}

/**
 * Sort transactions
 * @param {Array} transactions - Array of transaction objects
 * @param {string} column - Column to sort by
 * @param {string} direction - 'asc' or 'desc'
 * @returns {Array} Sorted transactions
 */
function sortTransactions(transactions, column, direction) {
    return [...transactions].sort((a, b) => {
        let valA, valB;

        switch (column) {
            case 'date':
                valA = new Date(a.date).getTime();
                valB = new Date(b.date).getTime();
                break;
            case 'description':
                valA = (a.description || '').toLowerCase();
                valB = (b.description || '').toLowerCase();
                break;
            case 'category':
                valA = a.category.toLowerCase();
                valB = b.category.toLowerCase();
                break;
            case 'amount':
                valA = a.amount;
                valB = b.amount;
                break;
            default:
                return 0;
        }

        if (valA < valB) return direction === 'asc' ? -1 : 1;
        if (valA > valB) return direction === 'asc' ? 1 : -1;
        return 0;
    });
}

/**
 * Render pagination controls
 * @param {number} current - Current page
 * @param {number} total - Total pages
 * @param {number} totalItems - Total items
 * @returns {string} HTML string
 */
function renderPagination(current, total, totalItems) {
    const startItem = (current - 1) * pageSize + 1;
    const endItem = Math.min(current * pageSize, totalItems);

    let pages = [];

    // Always show first page
    pages.push(1);

    // Show pages around current
    for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
        if (!pages.includes(i)) {
            if (pages[pages.length - 1] !== i - 1) {
                pages.push('...');
            }
            pages.push(i);
        }
    }

    // Always show last page
    if (total > 1) {
        if (pages[pages.length - 1] !== total - 1 && pages[pages.length - 1] !== total) {
            pages.push('...');
        }
        if (!pages.includes(total)) {
            pages.push(total);
        }
    }

    return `
    <div class="pagination">
      <button class="pagination-btn" data-page="prev" ${current === 1 ? 'disabled' : ''}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>
      ${pages.map(p => p === '...'
        ? '<span class="pagination-info">...</span>'
        : `<button class="pagination-btn ${p === current ? 'active' : ''}" data-page="${p}">${p}</button>`
    ).join('')}
      <button class="pagination-btn" data-page="next" ${current === total ? 'disabled' : ''}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>
      <span class="pagination-info" style="margin-left: var(--space-4);">
        ${startItem}-${endItem} of ${totalItems}
      </span>
    </div>
  `;
}

/**
 * Get sort icon for column
 * @param {string} column - Column name
 * @returns {string} SVG icon
 */
function getSortIcon(column) {
    if (sortColumn !== column) {
        return `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M7 15l5 5 5-5"></path>
      <path d="M7 9l5-5 5 5"></path>
    </svg>`;
    }

    if (sortDirection === 'asc') {
        return `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="18 15 12 9 6 15"></polyline>
    </svg>`;
    }

    return `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>`;
}

/**
 * Attach event listeners to table
 * @param {Array} transactions - Transaction data
 * @param {Function} onUpdate - Update callback
 */
function attachTableEventListeners(transactions, onUpdate) {
    // Sort headers
    const headers = document.querySelectorAll('.table th.sortable');
    headers.forEach(header => {
        header.addEventListener('click', () => {
            const column = header.dataset.column;
            if (sortColumn === column) {
                sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
            } else {
                sortColumn = column;
                sortDirection = 'desc';
            }
            renderTransactionTable(transactions, { onUpdate });
        });
    });

    // Page size
    const pageSizeSelect = document.getElementById('page-size-select');
    if (pageSizeSelect) {
        pageSizeSelect.addEventListener('change', (e) => {
            pageSize = parseInt(e.target.value);
            currentPage = 1;
            renderTransactionTable(transactions, { onUpdate });
        });
    }

    // Pagination
    const paginationBtns = document.querySelectorAll('.pagination-btn');
    paginationBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const page = btn.dataset.page;
            const totalPages = Math.ceil(transactions.length / pageSize);

            if (page === 'prev' && currentPage > 1) {
                currentPage--;
            } else if (page === 'next' && currentPage < totalPages) {
                currentPage++;
            } else if (page !== 'prev' && page !== 'next') {
                currentPage = parseInt(page);
            }

            renderTransactionTable(transactions, { onUpdate });
        });
    });
}

/**
 * Escape HTML to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Reset table state
 */
export function resetTableState() {
    currentPage = 1;
    sortColumn = 'date';
    sortDirection = 'desc';
}
