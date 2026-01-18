/**
 * Export data functionality for Excel and CSV downloads
 */
import * as XLSX from 'xlsx';
import { formatDate, formatCurrency } from './formatters.js';

/**
 * Export transactions to Excel file
 * @param {Array} transactions - Array of transaction objects
 * @param {string} filename - Output filename (without extension)
 */
export function exportToExcel(transactions, filename = 'finance_export') {
    // Prepare data for export
    const data = transactions.map(t => ({
        'Date': formatDate(t.date, 'medium'),
        'Description': t.description,
        'Category': t.category,
        'Amount': t.amount,
        'Type': t.type
    }));

    // Create workbook and worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();

    // Set column widths
    worksheet['!cols'] = [
        { wch: 15 },  // Date
        { wch: 40 },  // Description
        { wch: 20 },  // Category
        { wch: 12 },  // Amount
        { wch: 10 }   // Type
    ];

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Transactions');

    // Generate and download file
    XLSX.writeFile(workbook, `${filename}.xlsx`);
}

/**
 * Export transactions to CSV file
 * @param {Array} transactions - Array of transaction objects
 * @param {string} filename - Output filename (without extension)
 */
export function exportToCSV(transactions, filename = 'finance_export') {
    // Prepare data for export
    const data = transactions.map(t => ({
        'Date': formatDate(t.date, 'medium'),
        'Description': t.description,
        'Category': t.category,
        'Amount': t.amount,
        'Type': t.type
    }));

    // Create worksheet and convert to CSV
    const worksheet = XLSX.utils.json_to_sheet(data);
    const csv = XLSX.utils.sheet_to_csv(worksheet);

    // Create and trigger download
    downloadFile(csv, `${filename}.csv`, 'text/csv;charset=utf-8;');
}

/**
 * Export a summary report
 * @param {Object} summary - Summary data object
 * @param {Array} categoryData - Category breakdown data
 * @param {Array} monthlyData - Monthly breakdown data
 * @param {string} filename - Output filename
 */
export function exportSummaryReport(summary, categoryData, monthlyData, filename = 'finance_summary') {
    const workbook = XLSX.utils.book_new();

    // Summary sheet
    const summarySheet = XLSX.utils.aoa_to_sheet([
        ['Personal Finance Summary Report'],
        [''],
        ['Metric', 'Value'],
        ['Total Income', formatCurrency(summary.totalIncome)],
        ['Total Expenses', formatCurrency(summary.totalExpenses)],
        ['Net Balance', formatCurrency(summary.balance)],
        ['Savings Rate', `${(summary.savingsRate * 100).toFixed(1)}%`],
        ['Transaction Count', summary.transactionCount]
    ]);
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');

    // Category breakdown sheet
    if (categoryData && categoryData.length > 0) {
        const categorySheet = XLSX.utils.json_to_sheet(categoryData.map(c => ({
            'Category': c.category,
            'Amount': c.amount,
            'Percentage': `${c.percentage.toFixed(1)}%`
        })));
        XLSX.utils.book_append_sheet(workbook, categorySheet, 'By Category');
    }

    // Monthly breakdown sheet
    if (monthlyData && monthlyData.length > 0) {
        const monthlySheet = XLSX.utils.json_to_sheet(monthlyData.map(m => ({
            'Month': m.month,
            'Income': m.income,
            'Expenses': m.expenses,
            'Net': m.income - m.expenses
        })));
        XLSX.utils.book_append_sheet(workbook, monthlySheet, 'By Month');
    }

    // Generate and download
    XLSX.writeFile(workbook, `${filename}.xlsx`);
}

/**
 * Download the sample template file
 */
export function downloadSampleTemplate() {
    const data = [
        ['Date', 'Description', 'Category', 'Amount', 'Type'],
        ['2026-01-01', 'Monthly Salary', 'Salary', 5000, 'Income'],
        ['2026-01-02', 'Grocery Store', 'Food & Dining', -150, 'Expense'],
        ['2026-01-03', 'Electric Bill', 'Utilities', -120, 'Expense'],
        ['2026-01-05', 'Freelance Project', 'Side Income', 800, 'Income'],
        ['2026-01-07', 'Restaurant Dinner', 'Food & Dining', -65, 'Expense'],
        ['2026-01-10', 'Gas Station', 'Transportation', -45, 'Expense'],
        ['2026-01-12', 'Online Shopping', 'Shopping', -200, 'Expense'],
        ['2026-01-15', 'Gym Membership', 'Health & Fitness', -50, 'Expense'],
        ['2026-01-18', 'Internet Bill', 'Utilities', -60, 'Expense'],
        ['2026-01-20', 'Coffee Shop', 'Food & Dining', -12, 'Expense']
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(data);
    const workbook = XLSX.utils.book_new();

    worksheet['!cols'] = [
        { wch: 12 },
        { wch: 30 },
        { wch: 18 },
        { wch: 10 },
        { wch: 10 }
    ];

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Transactions');
    XLSX.writeFile(workbook, 'finance_template.xlsx');
}

/**
 * Helper function to trigger file download
 * @param {string} content - File content
 * @param {string} filename - Filename
 * @param {string} mimeType - MIME type
 */
function downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
}
