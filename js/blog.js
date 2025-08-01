// Blog-specific functionality
import { Format } from './utils.js';

export class Blog {
    constructor() {
        this.blogPosts = [];
        this.init();
    }
    
    async init() {
        await this.loadBlogPosts();
    }
    
    parseFrontMatter(content) {
        const frontMatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
        const match = content.match(frontMatterRegex);
        
        if (match) {
            const frontMatter = {};
            const metaData = match[1];
            const markdownContent = match[2];
            
            // Parse YAML-like front matter
            metaData.split('\n').forEach(line => {
                const [key, ...valueParts] = line.split(':');
                if (key && valueParts.length) {
                    const value = valueParts.join(':').trim();
                    frontMatter[key.trim()] = value.replace(/^["']|["']$/g, '');
                }
            });
            
            return { frontMatter, content: markdownContent };
        }
        
        // If no front matter, extract title from first heading
        const titleMatch = content.match(/^#\s+(.+)$/m);
        return {
            frontMatter: {
                title: titleMatch ? titleMatch[1] : 'Untitled Post',
                date: new Date().toISOString().split('T')[0]
            },
            content
        };
    }
    
    async loadBlogPosts() {
        try {
            // Fetch the auto-generated index.json
            const response = await fetch('blog/index.json').catch(() => null);
            
            if (response && response.ok) {
                this.blogPosts = await response.json();
            } else {
                // Fallback to empty array if index doesn't exist yet
                this.blogPosts = [];
                console.log('Blog index not found. Run the build script or push to GitHub to generate it.');
            }
            
            this.displayBlogList();
        } catch (error) {
            console.error('Error loading blog posts:', error);
            this.blogPosts = [];
            this.displayBlogList();
        }
    }
    
    displayBlogList() {
        const blogList = document.getElementById('blog-list');
        const blogContent = document.getElementById('blog-content');
        
        if (!blogList) return;
        
        blogList.style.display = 'block';
        if (blogContent) blogContent.classList.remove('active');
        
        if (this.blogPosts.length === 0) {
            blogList.innerHTML = `
                <div class="no-posts">
                    <p>No blog posts yet.</p>
                    <p style="margin-top: 20px; font-size: 12px;">To get started:</p>
                    <ol style="text-align: left; display: inline-block; margin-top: 10px; font-size: 12px;">
                        <li>Add markdown files to the posts/ directory</li>
                        <li>Run: <code>node scripts/build-blog.js</code></li>
                        <li>Or push to GitHub to auto-generate the index</li>
                    </ol>
                </div>
            `;
            return;
        }
        
        blogList.innerHTML = this.blogPosts.map((post, index) => `
            <div class="blog-post" onclick="blog.loadBlogPost(${index})">
                <h2 class="blog-post-title">${post.title}</h2>
                <div class="blog-post-meta">${Format.date(post.date)}</div>
                <p class="blog-post-excerpt">${post.excerpt}</p>
            </div>
        `).join('');
    }
    
    async loadBlogPost(index) {
        const post = this.blogPosts[index];
        const blogList = document.getElementById('blog-list');
        const blogContent = document.getElementById('blog-content');
        const blogContentInner = document.getElementById('blog-content-inner');
        
        if (!post || !blogContent || !blogContentInner) return;
        
        try {
            const response = await fetch(`posts/${post.file}`);
            const markdown = await response.text();
            const { frontMatter, content } = this.parseFrontMatter(markdown);
            const html = marked.parse(content);
            
            blogContentInner.innerHTML = `
                <h1 class="blog-post-title" style="margin-bottom: 10px;">${frontMatter.title || post.title}</h1>
                <div class="blog-post-meta" style="margin-bottom: 30px; font-size: 13px; color: var(--text-secondary);">${Format.date(frontMatter.date || post.date)}</div>
                ${html}
            `;
            
            if (blogList) blogList.style.display = 'none';
            blogContent.classList.add('active');
            
            window.scrollTo(0, 0);
        } catch (error) {
            console.error('Error loading blog post:', error);
            alert('Error loading blog post. Please try again.');
        }
    }
    
    showBlogList() {
        this.displayBlogList();
    }
}

// Export instance for global access (needed for onclick handlers)
window.blog = new Blog();