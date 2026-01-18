/**
 * Charts Component using Chart.js
 */
import Chart from 'chart.js/auto';
import { calculateByMonth, calculateByCategory } from '../utils/calculations.js';
import { getMonthName } from '../utils/formatters.js';

let monthlyChart = null;
let categoryChart = null;

// Chart.js default configuration
const chartDefaults = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            labels: {
                color: '#a0aec0',
                font: {
                    family: "'Inter', sans-serif",
                    size: 12
                }
            }
        },
        tooltip: {
            backgroundColor: '#2d3542',
            titleColor: '#f7fafc',
            bodyColor: '#a0aec0',
            borderColor: '#3a4453',
            borderWidth: 1,
            padding: 12,
            cornerRadius: 8,
            titleFont: {
                family: "'Inter', sans-serif",
                weight: 600
            },
            bodyFont: {
                family: "'Inter', sans-serif"
            }
        }
    }
};

// Color palette
const chartColors = [
    '#4c9aff',
    '#10b981',
    '#f59e0b',
    '#ef4444',
    '#8b5cf6',
    '#ec4899',
    '#06b6d4',
    '#84cc16'
];

/**
 * Render charts
 * @param {Array} transactions - Array of transaction objects
 */
export function renderCharts(transactions) {
    renderMonthlyChart(transactions);
    renderCategoryChart(transactions);
}

/**
 * Render monthly overview chart
 * @param {Array} transactions - Array of transaction objects
 */
function renderMonthlyChart(transactions) {
    const canvas = document.getElementById('monthly-chart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    // Destroy existing chart
    if (monthlyChart) {
        monthlyChart.destroy();
    }

    const monthlyData = calculateByMonth(transactions);

    const labels = monthlyData.map(m => {
        const [year, month] = m.month.split('-');
        const date = new Date(parseInt(year), parseInt(month) - 1);
        return getMonthName(date, true) + ' ' + year.slice(2);
    });

    monthlyChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [
                {
                    label: 'Income',
                    data: monthlyData.map(m => m.income),
                    backgroundColor: 'rgba(16, 185, 129, 0.8)',
                    borderColor: '#10b981',
                    borderWidth: 1,
                    borderRadius: 4
                },
                {
                    label: 'Expenses',
                    data: monthlyData.map(m => m.expenses),
                    backgroundColor: 'rgba(239, 68, 68, 0.8)',
                    borderColor: '#ef4444',
                    borderWidth: 1,
                    borderRadius: 4
                }
            ]
        },
        options: {
            ...chartDefaults,
            scales: {
                x: {
                    grid: {
                        color: 'rgba(58, 68, 83, 0.5)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#718096',
                        font: {
                            family: "'Inter', sans-serif",
                            size: 11
                        }
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(58, 68, 83, 0.5)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#718096',
                        font: {
                            family: "'Inter', sans-serif",
                            size: 11
                        },
                        callback: function (value) {
                            return '$' + value.toLocaleString();
                        }
                    }
                }
            },
            plugins: {
                ...chartDefaults.plugins,
                legend: {
                    ...chartDefaults.plugins.legend,
                    position: 'top'
                }
            }
        }
    });
}

/**
 * Render category breakdown chart
 * @param {Array} transactions - Array of transaction objects
 */
function renderCategoryChart(transactions) {
    const canvas = document.getElementById('category-chart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    // Destroy existing chart
    if (categoryChart) {
        categoryChart.destroy();
    }

    const categoryData = calculateByCategory(transactions, 'expense');
    const sortedCategories = Object.entries(categoryData)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8); // Top 8 categories

    const labels = sortedCategories.map(([category]) => category);
    const data = sortedCategories.map(([, amount]) => amount);
    const total = data.reduce((sum, val) => sum + val, 0);

    categoryChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels,
            datasets: [{
                data,
                backgroundColor: chartColors.slice(0, data.length),
                borderColor: '#1e2530',
                borderWidth: 3,
                hoverOffset: 8
            }]
        },
        options: {
            ...chartDefaults,
            cutout: '65%',
            plugins: {
                ...chartDefaults.plugins,
                legend: {
                    ...chartDefaults.plugins.legend,
                    position: 'right',
                    labels: {
                        ...chartDefaults.plugins.legend.labels,
                        padding: 16,
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                },
                tooltip: {
                    ...chartDefaults.plugins.tooltip,
                    callbacks: {
                        label: function (context) {
                            const value = context.raw;
                            const percentage = ((value / total) * 100).toFixed(1);
                            return ` $${value.toLocaleString()} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

/**
 * Destroy all charts
 */
export function destroyCharts() {
    if (monthlyChart) {
        monthlyChart.destroy();
        monthlyChart = null;
    }
    if (categoryChart) {
        categoryChart.destroy();
        categoryChart = null;
    }
}

/**
 * Get category data for export
 * @param {Array} transactions - Array of transaction objects
 * @returns {Array} Category breakdown data
 */
export function getCategoryData(transactions) {
    const categoryData = calculateByCategory(transactions, 'expense');
    const total = Object.values(categoryData).reduce((sum, val) => sum + val, 0);

    return Object.entries(categoryData)
        .map(([category, amount]) => ({
            category,
            amount,
            percentage: total > 0 ? (amount / total) * 100 : 0
        }))
        .sort((a, b) => b.amount - a.amount);
}

/**
 * Get monthly data for export
 * @param {Array} transactions - Array of transaction objects
 * @returns {Array} Monthly breakdown data
 */
export function getMonthlyData(transactions) {
    return calculateByMonth(transactions);
}
