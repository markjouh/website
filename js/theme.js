// Centralized theme manager
export const Theme = {
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
            const toggle = document.getElementById('theme-toggle');
            if (toggle) toggle.checked = true;
        }
    },
    
    setupListeners: () => {
        const themeToggle = document.getElementById('theme-toggle');
        
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
    }
};