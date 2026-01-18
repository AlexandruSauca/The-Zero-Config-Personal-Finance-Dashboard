/**
 * Excel file parsing utility using SheetJS
 */
import * as XLSX from 'xlsx';
import { parseDate } from './formatters.js';

/**
 * Expected column mappings (case-insensitive)
 */
const COLUMN_MAPPINGS = {
    date: ['date', 'transaction date', 'trans date', 'posting date'],
    description: ['description', 'desc', 'memo', 'narrative', 'details', 'transaction'],
    category: ['category', 'type', 'transaction type', 'group'],
    amount: ['amount', 'value', 'sum', 'total', 'debit', 'credit'],
    type: ['income/expense', 'transaction kind', 'in/out', 'direction']
};

/**
 * Parse an Excel file and extract transaction data
 * @param {File} file - The Excel file to parse
 * @returns {Promise<Object>} Object containing transactions and metadata
 */
export async function parseExcelFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array', cellDates: true });

                // Get the first sheet
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];

                // Convert to JSON
                const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

                if (rawData.length < 2) {
                    reject(new Error('File appears to be empty or has no data rows'));
                    return;
                }

                // Parse headers and data
                const result = parseSheetData(rawData);

                resolve({
                    transactions: result.transactions,
                    fileName: file.name,
                    sheetName: sheetName,
                    totalRows: rawData.length - 1,
                    parsedRows: result.transactions.length,
                    columns: result.columns
                });
            } catch (error) {
                reject(new Error(`Failed to parse Excel file: ${error.message}`));
            }
        };

        reader.onerror = () => {
            reject(new Error('Failed to read file'));
        };

        reader.readAsArrayBuffer(file);
    });
}

/**
 * Parse sheet data into transactions
 * @param {Array} rawData - Raw 2D array from sheet
 * @returns {Object} Object with transactions and column info
 */
function parseSheetData(rawData) {
    const headers = rawData[0].map(h => String(h || '').toLowerCase().trim());
    const columnMap = mapColumns(headers);

    const transactions = [];

    for (let i = 1; i < rawData.length; i++) {
        const row = rawData[i];
        if (!row || row.length === 0) continue;

        const transaction = parseRow(row, columnMap, headers);
        if (transaction) {
            transaction.id = i;
            transactions.push(transaction);
        }
    }

    return {
        transactions,
        columns: Object.keys(columnMap).filter(k => columnMap[k] !== -1)
    };
}

/**
 * Map column headers to expected fields
 * @param {Array} headers - Array of header strings
 * @returns {Object} Column index mapping
 */
function mapColumns(headers) {
    const map = {
        date: -1,
        description: -1,
        category: -1,
        amount: -1,
        type: -1
    };

    headers.forEach((header, index) => {
        const lowerHeader = header.toLowerCase();

        for (const [field, aliases] of Object.entries(COLUMN_MAPPINGS)) {
            if (aliases.some(alias => lowerHeader.includes(alias))) {
                if (map[field] === -1) {
                    map[field] = index;
                }
            }
        }
    });

    return map;
}

/**
 * Parse a single row into a transaction object
 * @param {Array} row - Row data array
 * @param {Object} columnMap - Column index mapping
 * @param {Array} headers - Original headers
 * @returns {Object|null} Transaction object or null if invalid
 */
function parseRow(row, columnMap, headers) {
    // Get date
    let date = null;
    if (columnMap.date !== -1 && row[columnMap.date] !== undefined) {
        const dateVal = row[columnMap.date];
        if (dateVal instanceof Date) {
            date = dateVal;
        } else {
            date = parseDate(String(dateVal));
        }
    }

    if (!date) return null; // Date is required

    // Get description
    let description = '';
    if (columnMap.description !== -1 && row[columnMap.description] !== undefined) {
        description = String(row[columnMap.description]).trim();
    }

    // Get category
    let category = 'Uncategorized';
    if (columnMap.category !== -1 && row[columnMap.category] !== undefined) {
        category = String(row[columnMap.category]).trim() || 'Uncategorized';
    }

    // Get amount
    let amount = 0;
    if (columnMap.amount !== -1 && row[columnMap.amount] !== undefined) {
        const amountVal = row[columnMap.amount];
        if (typeof amountVal === 'number') {
            amount = amountVal;
        } else {
            // Parse string amount, removing currency symbols
            const cleaned = String(amountVal).replace(/[^0-9.\-+]/g, '');
            amount = parseFloat(cleaned) || 0;
        }
    }

    if (amount === 0) return null; // Amount is required

    // Determine type (income or expense)
    let type = 'Expense';
    if (columnMap.type !== -1 && row[columnMap.type] !== undefined) {
        const typeVal = String(row[columnMap.type]).toLowerCase();
        if (typeVal.includes('income') || typeVal.includes('in') || typeVal.includes('credit')) {
            type = 'Income';
        }
    } else {
        // Infer from amount sign
        type = amount > 0 ? 'Income' : 'Expense';
    }

    return {
        date,
        description,
        category,
        amount: Math.abs(amount),
        type
    };
}

/**
 * Validate file type
 * @param {File} file - File to validate
 * @returns {boolean} True if valid Excel file
 */
export function isValidExcelFile(file) {
    const validTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
        'application/excel',
        'application/x-excel'
    ];

    const validExtensions = ['.xlsx', '.xls', '.xlsm'];
    const extension = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));

    return validTypes.includes(file.type) || validExtensions.includes(extension);
}

/**
 * Get sample template data structure
 * @returns {Array} Sample data rows
 */
export function getSampleTemplateData() {
    return [
        ['Date', 'Description', 'Category', 'Amount', 'Type'],
        ['2026-01-01', 'Monthly Salary', 'Salary', 5000, 'Income'],
        ['2026-01-02', 'Grocery Store', 'Food & Dining', -150, 'Expense'],
        ['2026-01-03', 'Electric Bill', 'Utilities', -120, 'Expense'],
        ['2026-01-05', 'Freelance Project', 'Side Income', 800, 'Income'],
        ['2026-01-07', 'Restaurant Dinner', 'Food & Dining', -65, 'Expense'],
        ['2026-01-10', 'Gas Station', 'Transportation', -45, 'Expense'],
        ['2026-01-12', 'Online Shopping', 'Shopping', -200, 'Expense'],
        ['2026-01-15', 'Gym Membership', 'Health & Fitness', -50, 'Expense']
    ];
}
