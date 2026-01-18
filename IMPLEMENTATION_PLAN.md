# Zero-Config Personal Finance Dashboard

A professional, template-driven personal finance dashboard that allows users to upload Excel files containing their financial data and visualize it through charts, summary statistics, and a sortable transaction table.

## Key Features

- **Excel Template Upload**: Drag-and-drop or click to upload Excel (.xlsx/.xls) files
- **Automatic Data Parsing**: Uses SheetJS library to parse Excel data client-side
- **Financial Summary Cards**: Display total income, expenses, balance, and savings rate
- **Interactive Charts**: Monthly trends, category breakdown using Chart.js
- **Transaction Table**: Sortable, filterable, searchable transaction list
- **Data Persistence**: Local storage to persist data between sessions
- **Export Functionality**: Download parsed data as Excel or CSV
- **Privacy-First**: All processing happens client-side, no server required

## Technology Stack

| Component | Technology |
|-----------|------------|
| Framework | Vite + Vanilla JavaScript |
| Styling | Custom CSS with design tokens |
| Excel Parsing | SheetJS (xlsx library) |
| Charts | Chart.js |
| Icons | Lucide Icons (professional, no emojis) |
| Build Tool | Vite |

---

## Proposed Changes

### Project Setup

#### [NEW] [package.json](file:///c:/Users/sauca/Desktop/tpi_project/package.json)
Project configuration with dependencies: vite, xlsx, chart.js, lucide

#### [NEW] [vite.config.js](file:///c:/Users/sauca/Desktop/tpi_project/vite.config.js)
Vite configuration for development and production builds

#### [NEW] [index.html](file:///c:/Users/sauca/Desktop/tpi_project/index.html)
Main HTML entry point with semantic structure

---

### Design System

#### [NEW] [src/styles/variables.css](file:///c:/Users/sauca/Desktop/tpi_project/src/styles/variables.css)
CSS custom properties for colors, typography, spacing, shadows

#### [NEW] [src/styles/base.css](file:///c:/Users/sauca/Desktop/tpi_project/src/styles/base.css)
Base styles, resets, and global typography

#### [NEW] [src/styles/components.css](file:///c:/Users/sauca/Desktop/tpi_project/src/styles/components.css)
Component-specific styles (cards, buttons, tables, forms)

#### [NEW] [src/styles/layout.css](file:///c:/Users/sauca/Desktop/tpi_project/src/styles/layout.css)
Grid layouts, responsive breakpoints, page structure

---

### Core Application

#### [NEW] [src/main.js](file:///c:/Users/sauca/Desktop/tpi_project/src/main.js)
Application entry point, imports and initializes all modules

#### [NEW] [src/app.js](file:///c:/Users/sauca/Desktop/tpi_project/src/app.js)
Main application logic, state management, event coordination

---

### Components

#### [NEW] [src/components/FileUpload.js](file:///c:/Users/sauca/Desktop/tpi_project/src/components/FileUpload.js)
Drag-and-drop Excel file upload component with validation

#### [NEW] [src/components/SummaryCards.js](file:///c:/Users/sauca/Desktop/tpi_project/src/components/SummaryCards.js)
Financial summary cards (income, expenses, balance, savings rate)

#### [NEW] [src/components/TransactionTable.js](file:///c:/Users/sauca/Desktop/tpi_project/src/components/TransactionTable.js)
Sortable, filterable transaction table with pagination

#### [NEW] [src/components/Charts.js](file:///c:/Users/sauca/Desktop/tpi_project/src/components/Charts.js)
Chart.js visualizations (line chart for trends, doughnut for categories)

#### [NEW] [src/components/Header.js](file:///c:/Users/sauca/Desktop/tpi_project/src/components/Header.js)
Application header with navigation and export actions

#### [NEW] [src/components/FilterBar.js](file:///c:/Users/sauca/Desktop/tpi_project/src/components/FilterBar.js)
Date range and category filter controls

---

### Utilities

#### [NEW] [src/utils/excelParser.js](file:///c:/Users/sauca/Desktop/tpi_project/src/utils/excelParser.js)
Excel file parsing logic using SheetJS, data normalization

#### [NEW] [src/utils/calculations.js](file:///c:/Users/sauca/Desktop/tpi_project/src/utils/calculations.js)
Financial calculations (totals, averages, category sums)

#### [NEW] [src/utils/storage.js](file:///c:/Users/sauca/Desktop/tpi_project/src/utils/storage.js)
Local storage wrapper for data persistence

#### [NEW] [src/utils/formatters.js](file:///c:/Users/sauca/Desktop/tpi_project/src/utils/formatters.js)
Currency, date, and number formatting utilities

#### [NEW] [src/utils/exportData.js](file:///c:/Users/sauca/Desktop/tpi_project/src/utils/exportData.js)
Export functionality for Excel and CSV downloads

---

### Sample Template

#### [NEW] [public/template/finance_template.xlsx](file:///c:/Users/sauca/Desktop/tpi_project/public/template/finance_template.xlsx)
Sample Excel template showing expected format with columns: Date, Description, Category, Amount, Type (Income/Expense)

---

## Excel Template Format

The expected Excel format:

| Column | Description | Example |
|--------|-------------|---------|
| Date | Transaction date | 2026-01-15 |
| Description | Transaction description | Grocery Store |
| Category | Category name | Food & Dining |
| Amount | Transaction amount | 125.50 |
| Type | Income or Expense | Expense |

---

## Verification Plan

### Automated Tests

Since this is a client-side application with file handling, automated testing is limited. The verification will focus on:

1. **Build Verification**
   ```bash
   cd c:\Users\sauca\Desktop\tpi_project
   npm install
   npm run build
   ```
   - Verify no build errors
   - Check that dist folder is created with all assets

2. **Development Server**
   ```bash
   npm run dev
   ```
   - Verify server starts without errors

### Browser Testing

Using the browser tools, I will verify:

1. **UI Rendering**
   - Dashboard loads with professional design
   - No emojis present anywhere
   - All components render correctly

2. **File Upload**
   - Drag-and-drop zone is visible
   - Excel file can be uploaded
   - Data is parsed and displayed

3. **Data Visualization**
   - Summary cards show correct totals
   - Charts render with data
   - Transaction table displays all records

4. **Interactivity**
   - Sorting works on table columns
   - Filters update displayed data
   - Export buttons function correctly

5. **Responsive Design**
   - Layout adapts to different screen sizes

### Manual User Verification

After implementation, the user can verify:
- Upload their own Excel file matching the template format
- Confirm calculations are accurate
- Test the export functionality
