# Blog System Documentation

## How to Add New Blog Posts

1. Create a new markdown file in this `blog` directory (e.g., `my-post.md`)

2. Add an entry to `posts.json` with the following format:
   ```json
   {
     "title": "Your Post Title",
     "date": "YYYY-MM-DD",
     "file": "my-post.md",
     "excerpt": "A brief description of your post..."
   }
   ```

3. Write your content in the markdown file using standard markdown syntax

4. The blog will automatically display your new post!

## Supported Markdown Features

- Headers (# H1, ## H2, etc.)
- Bold and italic text
- Links
- Code blocks with syntax highlighting
- Blockquotes
- Lists (ordered and unordered)
- Images

## Tips

- Keep excerpts short and engaging (1-2 sentences)
- Use descriptive filenames for your markdown files
- Posts are displayed in the order they appear in posts.json