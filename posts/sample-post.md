---
title: How to Use This Blog System
date: 2025-01-08
excerpt: A quick guide on how to add new blog posts using markdown files with front matter
---

This blog system now automatically scans for markdown files in the `blog/` directory. No more editing `posts.json`!

## How to Add a New Post

1. Create a new `.md` file in the `blog/` directory
2. Add front matter at the top of your file between `---` markers
3. Write your content in markdown below the front matter

## Front Matter Format

```yaml
---
title: Your Post Title
date: YYYY-MM-DD
excerpt: A brief description of your post (optional)
---
```

## Features

- **Automatic Discovery**: Just drop `.md` files in the blog folder
- **Front Matter Support**: Add metadata at the top of your markdown files
- **Date Sorting**: Posts are automatically sorted by date (newest first)
- **Excerpt Generation**: If you don't provide an excerpt, one will be generated from your content
- **Fallback Support**: If no front matter is found, the first heading becomes the title

## Example Post

```markdown
---
title: My Awesome Post
date: 2025-08-01
excerpt: This is a great post about something interesting
---

# Introduction

Your content goes here...
```

That's it! Just save your markdown file and refresh the blog page.