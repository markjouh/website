// Utility functions for DOM operations
export const DOM = {
    get: (id) => document.getElementById(id),
    update: (id, prop, value) => {
        const el = DOM.get(id);
        if (el) el[prop] = value;
        return el;
    },
    query: (selector) => document.querySelector(selector),
    queryAll: (selector) => document.querySelectorAll(selector)
};

// Animation loop helper
export const Animation = {
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

// Format utilities
export const Format = {
    date: (dateString) => {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    },
    
    size: (sizeInKB) => {
        if (sizeInKB < 1000) return sizeInKB + 'K';
        return (sizeInKB / 1000).toFixed(1) + 'M';
    },
    
    time: () => {
        const now = new Date();
        return now.toTimeString().split(' ')[0];
    }
};