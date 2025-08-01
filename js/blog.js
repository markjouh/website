// Blog-specific functionality
import { Format } from './utils.js';

export class Blog {
    constructor() {
        this.blogPosts = [];
        this.currentPost = null;
        this.init();
    }
    
    async init() {
        await this.loadBlogPosts();
    }
    
    async loadBlogPosts() {
        try {
            // Fetch the auto-generated blog posts data
            const response = await fetch('generated/blog-posts.json').catch(() => null);
            
            if (response && response.ok) {
                this.blogPosts = await response.json();
            } else {
                // Fallback to empty array if blog posts file doesn't exist yet
                this.blogPosts = [];
                console.log('Blog posts data not found. Run the build script or push to GitHub to generate it.');
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
        
        // Content is already pre-parsed in the JSON
        blogContentInner.innerHTML = `
            <h1 class="blog-post-title" style="margin-bottom: 10px;">${post.title}</h1>
            <div class="blog-post-meta" style="margin-bottom: 30px; font-size: 13px; color: var(--text-secondary);">${Format.date(post.date)}</div>
            ${post.content}
        `;
        
        if (blogList) blogList.style.display = 'none';
        blogContent.classList.add('active');
        
        window.scrollTo(0, 0);
    }
    
    showBlogList() {
        this.displayBlogList();
    }
}

// Export instance for global access (needed for onclick handlers)
window.blog = new Blog();