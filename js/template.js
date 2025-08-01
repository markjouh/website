// HTML Template system for reusable components

export const Templates = {
    header: (activeTab = 'HOME') => `
        <header class="terminal-header border-standard bg-secondary mb-lg">
            <div class="led-matrix p-sm border-bottom">
                <canvas id="led-display" width="400" height="20"></canvas>
            </div>
            <nav class="file-tabs bg-tertiary border-top">
                <a href="index.html" class="tab ${activeTab === 'HOME' ? 'active' : ''} font-mono text-secondary p-sm" data-section="home">HOME</a>
                <a href="about.html" class="tab ${activeTab === 'ABOUT' ? 'active' : ''} font-mono text-secondary p-sm" data-section="about">ABOUT</a>
                <a href="blog.html" class="tab ${activeTab === 'BLOG' ? 'active' : ''} font-mono text-secondary p-sm" data-section="blog">BLOG</a>
                <div class="theme-switch-wrapper">
                    <div class="theme-switch">
                        <input type="checkbox" id="theme-toggle" />
                        <label for="theme-toggle" class="theme-switch-label">
                            <span class="switch-text dark">DARK</span>
                            <div class="switch-slider">
                                <div class="switch-handle">
                                    <div class="handle-indent"></div>
                                </div>
                            </div>
                            <span class="switch-text light">LIGHT</span>
                        </label>
                    </div>
                </div>
            </nav>
        </header>
    `,
    
    footer: (showRepo = false) => `
        <footer class="terminal-footer border-top bg-secondary mt-lg">
            <div class="status-bar p-sm font-mono text-secondary">
                <span class="status-item">UTF-8</span>
                <span class="separator">|</span>
                <span class="status-item" id="time">00:00:00</span>
                ${showRepo ? `
                <span class="separator">|</span>
                <a href="https://github.com/markjouh/website" class="status-item" target="_blank" style="text-decoration: none; color: inherit;">Repository</a>
                ` : ''}
            </div>
        </footer>
    `,
    
    pageWrapper: (content, activeTab = 'HOME', showRepo = false) => `
        <div class="central-column p-lg">
            ${Templates.header(activeTab)}
            <main class="content-area">
                <section class="content-panel active">
                    ${content}
                </section>
            </main>
            ${Templates.footer(showRepo)}
        </div>
    `,
    
    render: (elementId, html) => {
        const element = document.getElementById(elementId);
        if (element) {
            element.innerHTML = html;
        }
    }
};