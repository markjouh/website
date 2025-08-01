import { DOM, Animation } from './utils.js';
import { Theme } from './theme.js';

// Character bitmaps for LED display
const charMapData = {
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
    '9': [[0,1,1,0],[1,0,0,1],[0,1,1,1],[0,0,0,1],[1,1,1,0]],
    ' ': [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],
    ':': [[0,0,0,0],[0,1,0,0],[0,0,0,0],[0,1,0,0],[0,0,0,0]],
    '/': [[0,0,0,1],[0,0,1,0],[0,1,0,0],[1,0,0,0],[1,0,0,0]],
    '-': [[0,0,0,0],[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]],
    '_': [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,1,1,1]],
    '.': [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,1]],
    '@': [[0,1,1,0],[1,0,0,1],[1,0,1,1],[1,0,0,0],[0,1,1,1]],
    '♦': [[0,1,0,0],[1,1,1,0],[0,1,0,0],[0,0,0,0],[0,0,0,0]]
};

// LED matrix configuration
const LED_SIZE = 3;
const LED_SPACING = 5;
const LED_ROWS = 5;

export class LEDMatrix {
    constructor(canvasId) {
        this.canvas = DOM.get(canvasId);
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.messages = [
            '♦ MARK ZHOU ♦',
            'HIGH SCHOOL SENIOR', 
            'NEWTOWN PA',
            'STATUS: LEARNING',
            '@MARKJOUH',
            'HELLO WORLD'
        ];
        
        this.currentMessage = 0;
        this.scrollX = 0;
        this.LED_COLS = 80;
        this.textMatrix = [];
        
        this.init();
    }
    
    init() {
        this.updateSize();
        window.addEventListener('resize', () => this.updateSize());
        this.textMatrix = this.textToMatrix(this.messages[this.currentMessage]);
        Animation.loop(() => this.draw());
    }
    
    updateSize() {
        const container = this.canvas.parentElement;
        const maxWidth = container.clientWidth - 20;
        this.LED_COLS = Math.floor(maxWidth / LED_SPACING);
        this.canvas.width = this.LED_COLS * LED_SPACING;
        this.canvas.height = LED_ROWS * LED_SPACING;
        this.scrollX = this.LED_COLS;
    }
    
    textToMatrix(text) {
        const matrix = [];
        for (let char of text.toUpperCase()) {
            const charBitmap = charMapData[char] || charMapData[' '];
            for (let col = 0; col < 4; col++) {
                const column = [];
                for (let row = 0; row < 5; row++) {
                    column.push(charBitmap[row][col]);
                }
                matrix.push(column);
            }
            matrix.push([0,0,0,0,0]); // Space between characters
        }
        return matrix;
    }
    
    draw() {
        // Clear canvas
        this.ctx.fillStyle = Theme.getColor('#000', '#333');
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw LED dots
        for (let x = 0; x < this.LED_COLS; x++) {
            for (let y = 0; y < LED_ROWS; y++) {
                const matrixX = Math.floor(x - this.scrollX);
                let isLit = false;
                
                if (matrixX >= 0 && matrixX < this.textMatrix.length) {
                    isLit = this.textMatrix[matrixX][y] === 1;
                }
                
                const centerX = x * LED_SPACING + LED_SIZE/2;
                const centerY = y * LED_SPACING + LED_SIZE/2;
                
                this.ctx.beginPath();
                this.ctx.arc(centerX, centerY, LED_SIZE/2, 0, Math.PI * 2);
                
                if (isLit) {
                    this.ctx.fillStyle = '#ff1458';
                } else {
                    this.ctx.fillStyle = Theme.getColor('#222', '#555');
                }
                
                this.ctx.fill();
            }
        }
        
        // Scroll text
        this.scrollX -= 0.3;
        if (this.scrollX < -this.textMatrix.length) {
            this.scrollX = this.LED_COLS;
            this.currentMessage = (this.currentMessage + 1) % this.messages.length;
            this.textMatrix = this.textToMatrix(this.messages[this.currentMessage]);
        }
    }
}