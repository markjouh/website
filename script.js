// Utility functions for DOM operations
const DOM = {
    get: (id) => document.getElementById(id),
    update: (id, prop, value) => {
        const el = DOM.get(id);
        if (el) el[prop] = value;
        return el;
    },
    query: (selector) => document.querySelector(selector),
    queryAll: (selector) => document.querySelectorAll(selector)
};

// Centralized theme manager
const Theme = {
    isLight: () => document.body.classList.contains('light-mode'),
    getColor: (dark, light) => Theme.isLight() ? light : dark,
    toggle: () => {
        document.body.classList.toggle('light-mode');
        const isLight = Theme.isLight();
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
        return isLight;
    },
    init: () => {
        const saved = localStorage.getItem('theme');
        const system = window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
        const theme = saved || system;
        if (theme === 'light') {
            document.body.classList.add('light-mode');
            const toggle = DOM.get('theme-toggle');
            if (toggle) toggle.checked = true;
        }
    }
};

// Animation loop helper
const Animation = {
    loop: (fn, delay = 0) => {
        const animate = () => {
            fn();
            if (delay > 0) {
                setTimeout(animate, delay);
            } else {
                requestAnimationFrame(animate);
            }
        };
        animate();
    }
};

// LED Matrix display animation
const ledCanvas = DOM.get('led-display');
const ledCtx = ledCanvas ? ledCanvas.getContext('2d') : null;

// LED matrix configuration
const LED_SIZE = 3;
const LED_SPACING = 5;
const LED_ROWS = 5;

if (ledCtx) {
    const messages = [
        '♦ XINYUN ZHOU ♦',
        'HIGH SCHOOL SENIOR', 
        'NEWTOWN PA',
        'STATUS: LEARNING',
        '@MARKJOUH',
        'HELLO WORLD'
    ];
    
    let currentMessage = 0;
    let scrollX = 0;
    let LED_COLS = 80;
    
    // Calculate responsive LED columns
    function updateLEDSize() {
        const container = ledCanvas.parentElement;
        const maxWidth = container.clientWidth - 20; // padding
        LED_COLS = Math.floor(maxWidth / LED_SPACING);
        ledCanvas.width = LED_COLS * LED_SPACING;
        ledCanvas.height = LED_ROWS * LED_SPACING;
        scrollX = LED_COLS;
    }
    
    updateLEDSize();
    window.addEventListener('resize', updateLEDSize);
    
    // Character bitmaps - unique stylized font (5x4)
    // Each character is a 5x4 bitmap (5 rows, 4 columns)
    const charMapData = {
        'A': [
            [0,1,1,0],
            [1,0,0,1],
            [1,1,1,1],
            [1,0,0,1],
            [1,0,0,1]
        ],
        'B': [
            [1,1,1,0],
            [1,0,0,1],
            [1,1,1,0],
            [1,0,0,1],
            [1,1,1,0]
        ],
        'C': [
            [0,1,1,1],
            [1,0,0,0],
            [1,0,0,0],
            [1,0,0,0],
            [0,1,1,1]
        ],
        'D': [
            [1,1,1,0],
            [1,0,0,1],
            [1,0,0,1],
            [1,0,0,1],
            [1,1,1,0]
        ],
        'E': [
            [1,1,1,1],
            [1,0,0,0],
            [1,1,1,0],
            [1,0,0,0],
            [1,1,1,1]
        ],
        'F': [
            [1,1,1,1],
            [1,0,0,0],
            [1,1,1,0],
            [1,0,0,0],
            [1,0,0,0]
        ],
        'G': [
            [0,1,1,1],
            [1,0,0,0],
            [1,0,1,1],
            [1,0,0,1],
            [0,1,1,1]
        ],
        'H': [
            [1,0,0,1],
            [1,0,0,1],
            [1,1,1,1],
            [1,0,0,1],
            [1,0,0,1]
        ],
        'I': [
            [1,1,1,0],
            [0,1,0,0],
            [0,1,0,0],
            [0,1,0,0],
            [1,1,1,0]
        ],
        'J': [
            [0,1,1,1],
            [0,0,1,0],
            [0,0,1,0],
            [1,0,1,0],
            [0,1,0,0]
        ],
        'K': [
            [1,0,0,1],
            [1,0,1,0],
            [1,1,0,0],
            [1,0,1,0],
            [1,0,0,1]
        ],
        'L': [
            [1,0,0,0],
            [1,0,0,0],
            [1,0,0,0],
            [1,0,0,0],
            [1,1,1,1]
        ],
        'M': [
            [1,0,0,1],
            [1,1,1,1],
            [1,0,0,1],
            [1,0,0,1],
            [1,0,0,1]
        ],
        'N': [
            [1,0,0,1],
            [1,1,0,1],
            [1,0,1,1],
            [1,0,0,1],
            [1,0,0,1]
        ],
        'O': [
            [0,1,1,0],
            [1,0,0,1],
            [1,0,0,1],
            [1,0,0,1],
            [0,1,1,0]
        ],
        'P': [
            [1,1,1,0],
            [1,0,0,1],
            [1,1,1,0],
            [1,0,0,0],
            [1,0,0,0]
        ],
        'Q': [
            [0,1,1,0],
            [1,0,0,1],
            [1,0,0,1],
            [1,0,1,0],
            [0,1,0,1]
        ],
        'R': [
            [1,1,1,0],
            [1,0,0,1],
            [1,1,1,0],
            [1,0,1,0],
            [1,0,0,1]
        ],
        'S': [
            [0,1,1,1],
            [1,0,0,0],
            [0,1,1,0],
            [0,0,0,1],
            [1,1,1,0]
        ],
        'T': [
            [1,1,1,1],
            [0,1,0,0],
            [0,1,0,0],
            [0,1,0,0],
            [0,1,0,0]
        ],
        'U': [
            [1,0,0,1],
            [1,0,0,1],
            [1,0,0,1],
            [1,0,0,1],
            [0,1,1,0]
        ],
        'V': [
            [1,0,0,1],
            [1,0,0,1],
            [1,0,0,1],
            [0,1,1,0],
            [0,1,0,0]
        ],
        'W': [
            [1,0,0,1],
            [1,0,0,1],
            [1,0,0,1],
            [1,1,1,1],
            [1,0,0,1]
        ],
        'X': [
            [1,0,0,1],
            [0,1,1,0],
            [0,1,1,0],
            [0,1,1,0],
            [1,0,0,1]
        ],
        'Y': [
            [1,0,0,1],
            [0,1,1,0],
            [0,1,0,0],
            [0,1,0,0],
            [0,1,0,0]
        ],
        'Z': [
            [1,1,1,1],
            [0,0,0,1],
            [0,0,1,0],
            [0,1,0,0],
            [1,1,1,1]
        ],
        '0': [
            [0,1,1,0],
            [1,0,0,1],
            [1,0,0,1],
            [1,0,0,1],
            [0,1,1,0]
        ],
        '1': [
            [0,1,0,0],
            [1,1,0,0],
            [0,1,0,0],
            [0,1,0,0],
            [1,1,1,0]
        ],
        '2': [
            [0,1,1,0],
            [1,0,0,1],
            [0,0,1,0],
            [0,1,0,0],
            [1,1,1,1]
        ],
        '3': [
            [1,1,1,0],
            [0,0,0,1],
            [0,1,1,0],
            [0,0,0,1],
            [1,1,1,0]
        ],
        '4': [
            [1,0,0,1],
            [1,0,0,1],
            [1,1,1,1],
            [0,0,0,1],
            [0,0,0,1]
        ],
        '5': [
            [1,1,1,1],
            [1,0,0,0],
            [1,1,1,0],
            [0,0,0,1],
            [1,1,1,0]
        ],
        '6': [
            [0,1,1,0],
            [1,0,0,0],
            [1,1,1,0],
            [1,0,0,1],
            [0,1,1,0]
        ],
        '7': [
            [1,1,1,1],
            [0,0,0,1],
            [0,0,1,0],
            [0,1,0,0],
            [0,1,0,0]
        ],
        '8': [
            [0,1,1,0],
            [1,0,0,1],
            [0,1,1,0],
            [1,0,0,1],
            [0,1,1,0]
        ],
        '9': [
            [0,1,1,0],
            [1,0,0,1],
            [0,1,1,1],
            [0,0,0,1],
            [1,1,1,0]
        ],
        ' ': [
            [0,0,0,0],
            [0,0,0,0],
            [0,0,0,0],
            [0,0,0,0],
            [0,0,0,0]
        ],
        ':': [
            [0,0,0,0],
            [0,1,0,0],
            [0,0,0,0],
            [0,1,0,0],
            [0,0,0,0]
        ],
        '/': [
            [0,0,0,1],
            [0,0,1,0],
            [0,1,0,0],
            [1,0,0,0],
            [1,0,0,0]
        ],
        '-': [
            [0,0,0,0],
            [0,0,0,0],
            [1,1,1,1],
            [0,0,0,0],
            [0,0,0,0]
        ],
        '_': [
            [0,0,0,0],
            [0,0,0,0],
            [0,0,0,0],
            [0,0,0,0],
            [1,1,1,1]
        ],
        '.': [
            [0,0,0,0],
            [0,0,0,0],
            [0,0,0,0],
            [0,0,0,0],
            [0,0,0,1]
        ],
        '@': [
            [0,1,1,0],
            [1,0,0,1],
            [1,0,1,1],
            [1,0,0,0],
            [0,1,1,1]
        ],
        '♦': [
            [0,1,0,0],
            [1,1,1,0],
            [0,1,0,0],
            [0,0,0,0],
            [0,0,0,0]
        ]
    };
    
    // Use character data directly
    const charMap = charMapData;
    
    // Convert text to LED matrix
    function textToMatrix(text) {
        const matrix = [];
        for (let char of text.toUpperCase()) {
            const charBitmap = charMap[char] || charMap[' '];
            for (let col = 0; col < 4; col++) {
                const column = [];
                for (let row = 0; row < 5; row++) {
                    column.push(charBitmap[row][col]);
                }
                matrix.push(column);
            }
            // Add space between characters
            matrix.push([0,0,0,0,0]);
        }
        return matrix;
    }
    
    let textMatrix = textToMatrix(messages[currentMessage]);
    
    function drawLEDMatrix() {
        // Clear canvas - match background to theme
        ledCtx.fillStyle = Theme.getColor('#000', '#333');
        ledCtx.fillRect(0, 0, ledCanvas.width, ledCanvas.height);
        
        // Draw all LED dots
        for (let x = 0; x < LED_COLS; x++) {
            for (let y = 0; y < LED_ROWS; y++) {
                // Get the value from text matrix
                const matrixX = Math.floor(x - scrollX);
                let isLit = false;
                
                if (matrixX >= 0 && matrixX < textMatrix.length) {
                    isLit = textMatrix[matrixX][y] === 1;
                }
                
                // Draw LED dot
                const centerX = x * LED_SPACING + LED_SIZE/2;
                const centerY = y * LED_SPACING + LED_SIZE/2;
                
                ledCtx.beginPath();
                ledCtx.arc(centerX, centerY, LED_SIZE/2, 0, Math.PI * 2);
                
                if (isLit) {
                    // Lit LED - subtly pink-tinted red
                    ledCtx.fillStyle = '#ff1458';
                    ledCtx.shadowBlur = 0;
                } else {
                    // Unlit LED - adjust for theme
                    ledCtx.fillStyle = Theme.getColor('#222', '#555');
                    ledCtx.shadowBlur = 0;
                }
                
                ledCtx.fill();
                ledCtx.shadowBlur = 0;
            }
        }
        
        // Scroll text
        scrollX -= 0.3;
        if (scrollX < -textMatrix.length) {
            scrollX = LED_COLS;
            currentMessage = (currentMessage + 1) % messages.length;
            textMatrix = textToMatrix(messages[currentMessage]);
        }
        
    }
    
    Animation.loop(drawLEDMatrix);
}

// Tab switching
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

// Time display
function updateTime() {
    const now = new Date();
    const timeString = now.toTimeString().split(' ')[0];
    DOM.update('time', 'textContent', timeString);
}

setInterval(updateTime, 1000);
updateTime();


// Terminal cursor blink
const cursor = DOM.query('.cursor');
if (cursor) {
    setInterval(() => {
        cursor.style.opacity = cursor.style.opacity === '0' ? '1' : '0';
    }, 500);
}

// Fetch GitHub data
async function fetchGitHubData() {
    try {
        // Fetch user data
        const userResponse = await fetch('https://api.github.com/users/markjouh');
        const userData = await userResponse.json();
        
        // Fetch repositories
        const reposResponse = await fetch('https://api.github.com/users/markjouh/repos?sort=updated&per_page=10');
        const reposData = await reposResponse.json();
        
        // Update metrics
        updateGitHubMetrics(userData, reposData);
        
        // Update file tree with real repos
        updateProjectTree(reposData);
    } catch (error) {
        console.error('Error fetching GitHub data:', error);
    }
}

function updateGitHubMetrics(userData, reposData) {
    // Get languages used
    const languages = [...new Set(reposData.map(repo => repo.language).filter(lang => lang))];
    const recentActivity = reposData.filter(repo => {
        const updated = new Date(repo.updated_at);
        const daysAgo = (Date.now() - updated) / (1000 * 60 * 60 * 24);
        return daysAgo < 30;
    }).length;
    
    // Update the metrics panel if it exists
    const metricsHTML = `
        <h3>PROJECT_INFO</h3>
        <table class="data-table">
            <tr>
                <td class="ticker">REPOS</td>
                <td class="value">${userData.public_repos}</td>
                <td class="trend">—</td>
            </tr>
            <tr>
                <td class="ticker">ACTIVE</td>
                <td class="value">${recentActivity}</td>
                <td class="trend">30d</td>
            </tr>
            <tr>
                <td class="ticker">LANGS</td>
                <td class="value">${languages.length}</td>
                <td class="trend">—</td>
            </tr>
        </table>
        <div class="lang-list">
            ${languages.slice(0, 5).map(lang => `<span class="lang-tag">${lang}</span>`).join('')}
        </div>
    `;
    
    const metricsPanel = DOM.query('.metrics-panel');
    if (metricsPanel) {
        metricsPanel.innerHTML = metricsHTML;
    }
}

function updateProjectTree(reposData) {
    const fileTreeHTML = reposData.slice(0, 5).map((repo, index) => `
        <div class='tree-entry directory' data-index='${index}'>
            <span class='icon'>▼</span> ${repo.name}/
            <span class='meta'>${repo.language || 'misc'}</span>
        </div>
        <div class='tree-children' id='children-${index}' style='display: block;'>
            <div class="tree-entry file">
                <span class='icon'>●</span> README.md
                <span class='meta'>${formatSize(repo.size)}</span>
            </div>
            ${repo.language ? `<div class="tree-entry file">
                <span class='icon'>●</span> ${getMainFile(repo.language)}
                <span class='meta'>${repo.language}</span>
            </div>` : ''}
            ${repo.has_pages ? `<div class="tree-entry file">
                <span class='icon'>●</span> index.html
                <span class='meta'>pages</span>
            </div>` : ''}
        </div>
    `).join('');
    
    const fileTree = DOM.query('.file-tree');
    if (fileTree) {
        fileTree.innerHTML = fileTreeHTML;
        
        // Add click handlers for directories
        DOM.queryAll('.tree-entry.directory').forEach(dir => {
            dir.addEventListener('click', () => {
                const index = dir.getAttribute('data-index');
                const children = DOM.get(`children-${index}`);
                const icon = dir.querySelector('.icon');
                
                if (children.style.display === 'none') {
                    children.style.display = 'block';
                    icon.textContent = '▼';
                } else {
                    children.style.display = 'none';
                    icon.textContent = '▶';
                }
            });
        });
    }
}

function getMainFile(language) {
    const mainFiles = {
        'JavaScript': 'index.js',
        'TypeScript': 'index.ts',
        'Python': 'main.py',
        'Java': 'Main.java',
        'C++': 'main.cpp',
        'C': 'main.c',
        'Go': 'main.go',
        'Rust': 'main.rs',
        'HTML': 'index.html'
    };
    return mainFiles[language] || 'main.' + language.toLowerCase();
}

function formatSize(sizeInKB) {
    if (sizeInKB < 1000) return sizeInKB + 'K';
    return (sizeInKB / 1000).toFixed(1) + 'M';
}


// Call fetchGitHubData when the page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fetchGitHubData);
} else {
    fetchGitHubData();
}

// Terminal cursor blink behavior is handled above

// Konami code easter egg
let konamiCode = [];
const konamiPattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join(',') === konamiPattern.join(',')) {
        document.body.style.animation = 'matrix 2s';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 2000);
    }
});

// Add matrix rain CSS animation
const style = document.createElement('style');
style.textContent = `
    @keyframes matrix {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
`;
document.head.appendChild(style);

// Theme switching
const themeToggle = DOM.get('theme-toggle');

// Initialize theme
Theme.init();

// Theme toggle handler
if (themeToggle) {
    themeToggle.addEventListener('change', () => {
        Theme.toggle();
        themeToggle.checked = Theme.isLight();
    });
}

// Listen for system theme changes
window.matchMedia?.('(prefers-color-scheme: light)').addEventListener('change', (e) => {
    // Only update if user hasn't manually set a preference
    if (!localStorage.getItem('theme')) {
        if (e.matches !== Theme.isLight()) {
            Theme.toggle();
            if (themeToggle) themeToggle.checked = Theme.isLight();
        }
    }
});