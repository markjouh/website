import { DOM } from './utils.js';

export class GitHubIntegration {
    constructor(username) {
        this.username = username;
        this.apiBase = 'https://api.github.com';
    }
    
    async fetchData() {
        try {
            const [userData, reposData] = await Promise.all([
                this.fetchUser(),
                this.fetchRepos()
            ]);
            
            this.updateMetrics(userData, reposData);
            this.updateProjectTree(reposData);
        } catch (error) {
            console.error('Error fetching GitHub data:', error);
        }
    }
    
    async fetchUser() {
        const response = await fetch(`${this.apiBase}/users/${this.username}`);
        return response.json();
    }
    
    async fetchRepos() {
        const response = await fetch(`${this.apiBase}/users/${this.username}/repos?sort=updated&per_page=10`);
        return response.json();
    }
    
    updateMetrics(userData, reposData) {
        const languages = [...new Set(reposData.map(repo => repo.language).filter(lang => lang))];
        const recentActivity = reposData.filter(repo => {
            const updated = new Date(repo.updated_at);
            const daysAgo = (Date.now() - updated) / (1000 * 60 * 60 * 24);
            return daysAgo < 30;
        }).length;
        
        const metricsPanel = DOM.query('.metrics-panel');
        if (!metricsPanel) return;
        
        metricsPanel.innerHTML = `
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
    }
    
    updateProjectTree(reposData) {
        const fileTree = DOM.query('.file-tree');
        if (!fileTree) return;
        
        fileTree.innerHTML = reposData.slice(0, 5).map((repo, index) => `
            <div class='tree-entry directory' data-index='${index}'>
                <span class='icon'>▼</span> ${repo.name}/
                <span class='meta'>${repo.language || 'misc'}</span>
            </div>
            <div class='tree-children' id='children-${index}' style='display: block;'>
                <div class="tree-entry file">
                    <span class='icon'>●</span> README.md
                    <span class='meta'>${this.formatSize(repo.size)}</span>
                </div>
                ${repo.language ? `<div class="tree-entry file">
                    <span class='icon'>●</span> ${this.getMainFile(repo.language)}
                    <span class='meta'>${repo.language}</span>
                </div>` : ''}
                ${repo.has_pages ? `<div class="tree-entry file">
                    <span class='icon'>●</span> index.html
                    <span class='meta'>pages</span>
                </div>` : ''}
            </div>
        `).join('');
        
        this.attachTreeHandlers();
    }
    
    attachTreeHandlers() {
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
    
    getMainFile(language) {
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
    
    formatSize(sizeInKB) {
        if (sizeInKB < 1000) return sizeInKB + 'K';
        return (sizeInKB / 1000).toFixed(1) + 'M';
    }
}