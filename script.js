// LED Matrix display animation
const ledCanvas = document.getElementById('led-display');
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
    const charMap = {
        'A': [[0,1,1,0],[1,0,0,1],[1,1,1,1],[1,0,0,1],[1,0,0,1]],
        'B': [[1,1,1,0],[1,0,0,1],[1,1,1,0],[1,0,0,1],[1,1,1,0]],
        'C': [[0,1,1,1],[1,0,0,0],[1,0,0,0],[1,0,0,0],[0,1,1,1]],
        'D': [[1,1,1,0],[1,0,0,1],[1,0,0,1],[1,0,0,1],[1,1,1,0]],
        'E': [[1,1,1,1],[1,0,0,0],[1,1,1,0],[1,0,0,0],[1,1,1,1]],
        'F': [[1,1,1,1],[1,0,0,0],[1,1,1,0],[1,0,0,0],[1,0,0,0]],
        'G': [[0,1,1,1],[1,0,0,0],[1,0,1,1],[1,0,0,1],[0,1,1,1]],
        'H': [[1,0,0,1],[1,0,0,1],[1,1,1,1],[1,0,0,1],[1,0,0,1]],
        'I': [[1,1,1,0],[0,1,0,0],[0,1,0,0],[0,1,0,0],[1,1,1,0]],
        'J': [[0,1,1,1],[0,0,1,0],[0,0,1,0],[1,0,1,0],[0,1,0,0]],
        'K': [[1,0,0,1],[1,0,1,0],[1,1,0,0],[1,0,1,0],[1,0,0,1]],
        'L': [[1,0,0,0],[1,0,0,0],[1,0,0,0],[1,0,0,0],[1,1,1,1]],
        'M': [[1,0,0,1],[1,1,1,1],[1,0,0,1],[1,0,0,1],[1,0,0,1]],
        'N': [[1,0,0,1],[1,1,0,1],[1,0,1,1],[1,0,0,1],[1,0,0,1]],
        'O': [[0,1,1,0],[1,0,0,1],[1,0,0,1],[1,0,0,1],[0,1,1,0]],
        'P': [[1,1,1,0],[1,0,0,1],[1,1,1,0],[1,0,0,0],[1,0,0,0]],
        'Q': [[0,1,1,0],[1,0,0,1],[1,0,0,1],[1,0,1,0],[0,1,0,1]],
        'R': [[1,1,1,0],[1,0,0,1],[1,1,1,0],[1,0,1,0],[1,0,0,1]],
        'S': [[0,1,1,1],[1,0,0,0],[0,1,1,0],[0,0,0,1],[1,1,1,0]],
        'T': [[1,1,1,1],[0,1,0,0],[0,1,0,0],[0,1,0,0],[0,1,0,0]],
        'U': [[1,0,0,1],[1,0,0,1],[1,0,0,1],[1,0,0,1],[0,1,1,0]],
        'V': [[1,0,0,1],[1,0,0,1],[1,0,0,1],[0,1,1,0],[0,1,0,0]],
        'W': [[1,0,0,1],[1,0,0,1],[1,0,0,1],[1,1,1,1],[1,0,0,1]],
        'X': [[1,0,0,1],[0,1,1,0],[0,1,1,0],[0,1,1,0],[1,0,0,1]],
        'Y': [[1,0,0,1],[0,1,1,0],[0,1,0,0],[0,1,0,0],[0,1,0,0]],
        'Z': [[1,1,1,1],[0,0,0,1],[0,0,1,0],[0,1,0,0],[1,1,1,1]],
        '0': [[0,1,1,0],[1,0,0,1],[1,0,0,1],[1,0,0,1],[0,1,1,0]],
        '1': [[0,1,0,0],[1,1,0,0],[0,1,0,0],[0,1,0,0],[1,1,1,0]],
        '2': [[0,1,1,0],[1,0,0,1],[0,0,1,0],[0,1,0,0],[1,1,1,1]],
        '3': [[1,1,1,0],[0,0,0,1],[0,1,1,0],[0,0,0,1],[1,1,1,0]],
        '4': [[1,0,0,1],[1,0,0,1],[1,1,1,1],[0,0,0,1],[0,0,0,1]],
        '5': [[1,1,1,1],[1,0,0,0],[1,1,1,0],[0,0,0,1],[1,1,1,0]],
        '6': [[0,1,1,0],[1,0,0,0],[1,1,1,0],[1,0,0,1],[0,1,1,0]],
        '7': [[1,1,1,1],[0,0,0,1],[0,0,1,0],[0,1,0,0],[0,1,0,0]],
        '8': [[0,1,1,0],[1,0,0,1],[0,1,1,0],[1,0,0,1],[0,1,1,0]],
        '9': [[0,1,1,0],[1,0,0,1],[0,1,1,1],[0,0,0,1],[0,1,1,0]],
        ' ': [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],
        ':': [[0,0,0,0],[0,1,0,0],[0,0,0,0],[0,1,0,0],[0,0,0,0]],
        '/': [[0,0,0,1],[0,0,1,0],[0,1,0,0],[1,0,0,0],[1,0,0,0]],
        '-': [[0,0,0,0],[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]],
        '_': [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,1,1,1]],
        '.': [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,1,0,0]],
        '@': [[0,1,1,0],[1,0,0,1],[1,0,1,1],[1,0,0,0],[0,1,1,1]],
        '♦': [[0,1,0,0],[1,1,1,0],[0,1,0,0],[0,0,0,0],[0,0,0,0]]
    };
    
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
        const isLightMode = document.body.classList.contains('light-mode');
        ledCtx.fillStyle = isLightMode ? '#333' : '#000';
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
                    ledCtx.fillStyle = isLightMode ? '#555' : '#222';
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
        
        requestAnimationFrame(drawLEDMatrix);
    }
    
    drawLEDMatrix();
}

// Tab switching
const tabs = document.querySelectorAll('.tab');
const sections = document.querySelectorAll('.content-panel');

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
    const timeElement = document.getElementById('time');
    if (timeElement) {
        timeElement.textContent = timeString;
    }
}

setInterval(updateTime, 1000);
updateTime();

// Activity graph initialization moved to initActivityGraph()

// Terminal cursor blink
const cursor = document.querySelector('.cursor');
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
    
    const metricsPanel = document.querySelector('.metrics-panel');
    if (metricsPanel) {
        metricsPanel.innerHTML = metricsHTML;
    }
}

function updateProjectTree(reposData) {
    const fileTreeHTML = reposData.slice(0, 5).map((repo, index) => `
        <div class="tree-entry directory" data-index="${index}">
            <span class="icon">▼</span> ${repo.name}/
            <span class="meta">${repo.language || 'misc'}</span>
        </div>
        <div class="tree-children" id="children-${index}" style="display: block;">
            <div class="tree-entry file">
                <span class="icon">●</span> README.md
                <span class="meta">${formatSize(repo.size)}</span>
            </div>
            ${repo.language ? `<div class="tree-entry file">
                <span class="icon">●</span> ${getMainFile(repo.language)}
                <span class="meta">${repo.language}</span>
            </div>` : ''}
            ${repo.has_pages ? `<div class="tree-entry file">
                <span class="icon">●</span> index.html
                <span class="meta">pages</span>
            </div>` : ''}
        </div>
    `).join('');
    
    const fileTree = document.querySelector('.file-tree');
    if (fileTree) {
        fileTree.innerHTML = fileTreeHTML;
        
        // Add click handlers for directories
        document.querySelectorAll('.tree-entry.directory').forEach(dir => {
            dir.addEventListener('click', () => {
                const index = dir.getAttribute('data-index');
                const children = document.getElementById(`children-${index}`);
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

// Initialize activity graph separately
function initActivityGraph() {
    const activityCanvas = document.getElementById('activity');
    const activityCtx = activityCanvas ? activityCanvas.getContext('2d') : null;

    if (activityCtx) {
        const data = [];
        for (let i = 0; i < 50; i++) {
            data.push(Math.random() * 40 + 10);
        }
        
        function drawActivityGraph() {
            activityCtx.clearRect(0, 0, activityCanvas.width, activityCanvas.height);
            
            // Create gradient for the line
            const gradient = activityCtx.createLinearGradient(0, 0, activityCanvas.width, 0);
            gradient.addColorStop(0, '#8338ec');
            gradient.addColorStop(0.5, '#00f5ff');
            gradient.addColorStop(1, '#06ffa5');
            
            activityCtx.strokeStyle = gradient;
            activityCtx.lineWidth = 2;
            
            activityCtx.beginPath();
            data.forEach((value, index) => {
                const x = (index / data.length) * activityCanvas.width;
                const y = activityCanvas.height - value;
                
                if (index === 0) {
                    activityCtx.moveTo(x, y);
                } else {
                    activityCtx.lineTo(x, y);
                }
            });
            activityCtx.stroke();
            
            // Update data
            data.shift();
            data.push(Math.random() * 40 + 10);
            
            setTimeout(drawActivityGraph, 100);
        }
        
        drawActivityGraph();
    }
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
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Check for saved theme preference or default to dark mode
const currentTheme = localStorage.getItem('theme') || 'dark';
if (currentTheme === 'light') {
    body.classList.add('light-mode');
    themeToggle.checked = true;
}

// Theme toggle handler
themeToggle.addEventListener('change', () => {
    if (themeToggle.checked) {
        body.classList.add('light-mode');
        localStorage.setItem('theme', 'light');
    } else {
        body.classList.remove('light-mode');
        localStorage.setItem('theme', 'dark');
    }
});