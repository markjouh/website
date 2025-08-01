// Easter eggs and fun interactions

export class EasterEggs {
    constructor() {
        this.konamiCode = [];
        this.konamiPattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
        this.init();
    }
    
    init() {
        this.setupKonamiCode();
        this.addMatrixAnimation();
    }
    
    setupKonamiCode() {
        document.addEventListener('keydown', (e) => {
            this.konamiCode.push(e.key);
            this.konamiCode = this.konamiCode.slice(-10);
            
            if (this.konamiCode.join(',') === this.konamiPattern.join(',')) {
                this.triggerMatrixEffect();
            }
        });
    }
    
    triggerMatrixEffect() {
        document.body.style.animation = 'matrix 2s';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 2000);
    }
    
    addMatrixAnimation() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes matrix {
                0% { filter: hue-rotate(0deg); }
                100% { filter: hue-rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }
}