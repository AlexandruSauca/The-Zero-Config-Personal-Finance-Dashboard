/**
 * Application Entry Point
 */
import './styles/variables.css';
import './styles/base.css';
import './styles/components.css';
import './styles/layout.css';

import { initApp } from './app.js';

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});
