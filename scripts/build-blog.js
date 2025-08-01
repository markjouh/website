const fs = require('fs');
const path = require('path');

// Parse front matter from markdown content
function parseFrontMatter(content) {
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

// Extract excerpt from markdown content
function extractExcerpt(content, length = 150) {
    const plainText = content
        .replace(/^#+\s+.*$/gm, '') // Remove headings
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Convert links to text
        .replace(/[*_`~]/g, '') // Remove formatting
        .replace(/\n+/g, ' ') // Replace newlines with spaces
        .trim();
    
    return plainText.substring(0, length) + (plainText.length > length ? '...' : '');
}

// Main function
function buildBlogIndex() {
    const postsDir = path.join(__dirname, '..', 'posts');
    const outputFile = path.join(__dirname, '..', 'blog', 'index.json');
    
    // Read all markdown files from posts directory
    const files = fs.readdirSync(postsDir)
        .filter(file => file.endsWith('.md'));
    
    // Process each file
    const posts = files.map(filename => {
        const filePath = path.join(postsDir, filename);
        const content = fs.readFileSync(filePath, 'utf-8');
        const { frontMatter, content: markdownContent } = parseFrontMatter(content);
        
        // Generate excerpt if not provided
        if (!frontMatter.excerpt) {
            frontMatter.excerpt = extractExcerpt(markdownContent);
        }
        
        return {
            file: filename,
            title: frontMatter.title,
            date: frontMatter.date,
            excerpt: frontMatter.excerpt,
            ...frontMatter
        };
    });
    
    // Sort by date (newest first)
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Write the index file
    fs.writeFileSync(outputFile, JSON.stringify(posts, null, 2));
    
    console.log(`Generated blog index with ${posts.length} posts`);
    console.log('Posts:', posts.map(p => `- ${p.title} (${p.file})`).join('\n'));
}

// Run the build
buildBlogIndex();