/**
 * Header Component
 */
import { downloadSampleTemplate } from '../utils/exportData.js';

/**
 * Render the header component
 * @param {Object} options - Component options
 * @param {boolean} options.hasData - Whether data is loaded
 * @param {Function} options.onClearData - Callback for clearing data
 * @param {Function} options.onExport - Callback for exporting data
 */
export function renderHeader(options = {}) {
  const container = document.getElementById('header');
  if (!container) return;

  const { hasData = false, onClearData, onExport } = options;

  container.innerHTML = `
    <div class="header-brand">
      <div class="header-logo">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="1" x2="12" y2="23"></line>
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
        </svg>
      </div>
      <h1 class="header-title">Finance Dashboard</h1>
    </div>
    <div class="header-actions">
      ${hasData ? `
        <button class="btn btn-secondary" id="btn-export-excel">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          <span>Export</span>
        </button>
        <button class="btn btn-ghost" id="btn-clear-data">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 6h18"></path>
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
          </svg>
          <span>Clear Data</span>
        </button>
      ` : `
        <button class="btn btn-secondary" id="btn-download-template">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <line x1="10" y1="9" x2="8" y2="9"></line>
          </svg>
          <span>Download Template</span>
        </button>
      `}
    </div>
  `;

  // Attach event listeners
  const downloadBtn = document.getElementById('btn-download-template');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      downloadSampleTemplate();
    });
  }

  const exportBtn = document.getElementById('btn-export-excel');
  if (exportBtn && onExport) {
    exportBtn.addEventListener('click', () => {
      onExport('excel');
    });
  }

  const clearBtn = document.getElementById('btn-clear-data');
  if (clearBtn && onClearData) {
    clearBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
        onClearData();
      }
    });
  }
}
