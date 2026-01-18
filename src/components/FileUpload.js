/**
 * File Upload Component with drag-and-drop
 */
import { parseExcelFile, isValidExcelFile } from '../utils/excelParser.js';
import { downloadSampleTemplate } from '../utils/exportData.js';

/**
 * Render the file upload component
 * @param {Object} options - Component options
 * @param {Function} options.onFileLoaded - Callback when file is successfully parsed
 * @param {Function} options.onError - Callback for errors
 */
export function renderFileUpload(options = {}) {
    const container = document.getElementById('upload-container');
    if (!container) return;

    const { onFileLoaded, onError } = options;

    container.innerHTML = `
    <div class="upload-zone" id="upload-zone">
      <input type="file" id="file-input" accept=".xlsx,.xls,.xlsm" class="visually-hidden">
      <div class="upload-zone-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="17 8 12 3 7 8"></polyline>
          <line x1="12" y1="3" x2="12" y2="15"></line>
        </svg>
      </div>
      <h3 class="upload-zone-title">Upload Your Finance Data</h3>
      <p class="upload-zone-subtitle">Drag and drop your Excel file here, or click to browse</p>
      <p class="upload-zone-formats">Supported formats: .xlsx, .xls</p>
    </div>
    
    <div class="upload-info">
      <h4 class="upload-info-title">Expected File Format</h4>
      <ul class="upload-info-list">
        <li class="upload-info-item">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          Date column (required)
        </li>
        <li class="upload-info-item">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          Description column
        </li>
        <li class="upload-info-item">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          Category column
        </li>
        <li class="upload-info-item">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          Amount column (required)
        </li>
      </ul>
      <button class="btn btn-secondary" id="btn-download-sample" style="margin-top: 1rem;">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="7 10 12 15 17 10"></polyline>
          <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>
        Download Sample Template
      </button>
    </div>
  `;

    const uploadZone = document.getElementById('upload-zone');
    const fileInput = document.getElementById('file-input');
    const downloadBtn = document.getElementById('btn-download-sample');

    // Click to upload
    uploadZone.addEventListener('click', () => {
        fileInput.click();
    });

    // File input change
    fileInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (file) {
            await handleFile(file, onFileLoaded, onError);
        }
    });

    // Drag and drop
    uploadZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadZone.classList.add('drag-over');
    });

    uploadZone.addEventListener('dragleave', () => {
        uploadZone.classList.remove('drag-over');
    });

    uploadZone.addEventListener('drop', async (e) => {
        e.preventDefault();
        uploadZone.classList.remove('drag-over');

        const file = e.dataTransfer.files[0];
        if (file) {
            await handleFile(file, onFileLoaded, onError);
        }
    });

    // Download sample template
    downloadBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        downloadSampleTemplate();
    });
}

/**
 * Handle file upload
 * @param {File} file - The uploaded file
 * @param {Function} onFileLoaded - Success callback
 * @param {Function} onError - Error callback
 */
async function handleFile(file, onFileLoaded, onError) {
    // Show loading state
    const uploadZone = document.getElementById('upload-zone');
    const originalContent = uploadZone.innerHTML;

    uploadZone.innerHTML = `
    <div class="spinner"></div>
    <h3 class="upload-zone-title" style="margin-top: 1rem;">Processing file...</h3>
    <p class="upload-zone-subtitle">${file.name}</p>
  `;

    try {
        // Validate file type
        if (!isValidExcelFile(file)) {
            throw new Error('Invalid file type. Please upload an Excel file (.xlsx or .xls)');
        }

        // Parse file
        const result = await parseExcelFile(file);

        if (result.transactions.length === 0) {
            throw new Error('No valid transactions found in the file. Please check the file format.');
        }

        if (onFileLoaded) {
            onFileLoaded(result);
        }
    } catch (error) {
        // Restore original content and show error
        uploadZone.innerHTML = originalContent;

        if (onError) {
            onError(error.message);
        } else {
            alert(`Error: ${error.message}`);
        }
    }
}
