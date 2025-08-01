// Main JavaScript entry point
import { DOM, Format } from './utils.js';
import { Theme } from './theme.js';
import { LEDMatrix } from './led-matrix.js';
import { GitHubIntegration } from './github-integration.js';
import { EasterEggs } from './easter-eggs.js';

// Initialize all components when DOM is ready
function init() {
    // Initialize theme
    Theme.init();
    Theme.setupListeners();
    
    // Initialize LED matrix
    new LEDMatrix('led-display');
    
    // Initialize GitHub integration
    const github = new GitHubIntegration('markjouh');
    github.fetchData();
    
    // Initialize easter eggs
    new EasterEggs();
    
    // Setup time display
    setupTimeDisplay();
    
    // Setup tab navigation
    setupTabNavigation();
    
    // Setup terminal cursor
    setupTerminalCursor();
}

function setupTimeDisplay() {
    const updateTime = () => {
        DOM.update('time', 'textContent', Format.time());
    };
    
    setInterval(updateTime, 1000);
    updateTime();
}

function setupTabNavigation() {
    const tabs = DOM.queryAll('.tab');
    const sections = DOM.queryAll('.content-panel');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetSection = tab.getAttribute('data-section');
            
            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Update active section
            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === targetSection) {
                    section.classList.add('active');
                }
            });
        });
    });
}

function setupTerminalCursor() {
    const cursor = DOM.query('.cursor');
    if (cursor) {
        setInterval(() => {
            cursor.style.opacity = cursor.style.opacity === '0' ? '1' : '0';
        }, 500);
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}