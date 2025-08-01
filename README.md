# Personal Website

A modern, terminal-inspired personal website with a clean, modular architecture.

## Features

- **Terminal Aesthetic**: Inspired by classic terminal interfaces with a modern twist
- **LED Matrix Display**: Animated scrolling messages in a retro LED style
- **Dark/Light Theme**: System-aware theme switching with manual override
- **Responsive Design**: Mobile-friendly layout that works on all devices
- **Modular Architecture**: Clean separation of concerns with ES6 modules
- **GitHub Integration**: Live project data from GitHub API
- **Blog System**: Markdown-based blog with JSON configuration
- **Easter Eggs**: Hidden interactions for fun discoveries

## Project Structure

```
website/
├── index.html          # Home page
├── about.html          # About/resume page
├── blog.html           # Blog listing page
├── css/               # Modular CSS files
│   ├── main.css       # Main CSS entry point
│   ├── variables.css  # CSS custom properties
│   ├── base.css       # Reset and base styles
│   ├── utilities.css  # Utility classes
│   ├── layout.css     # Layout components
│   ├── components.css # Reusable components
│   ├── pages.css      # Page-specific styles
│   ├── blog.css       # Blog-specific styles
│   └── print.css      # Print media styles
├── js/                # JavaScript modules
│   ├── main.js        # Main entry point
│   ├── config.js      # Centralized configuration
│   ├── utils.js       # Utility functions
│   ├── theme.js       # Theme management
│   ├── led-matrix.js  # LED display animation
│   ├── github-integration.js # GitHub API integration
│   ├── blog.js        # Blog functionality
│   ├── template.js    # HTML templates
│   └── easter-eggs.js # Fun interactions
└── blog/              # Blog content
    ├── posts.json     # Blog post metadata
    └── *.md           # Blog post files

```

## Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Custom properties, Grid, Flexbox
- **JavaScript**: ES6 modules, async/await
- **Marked.js**: Markdown parsing for blog
- **GitHub API**: Live project data

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/markjouh/website.git
   ```

2. Serve the files using any web server. For example:
   ```bash
   python -m http.server 8000
   ```

3. Open `http://localhost:8000` in your browser

## Adding Blog Posts

1. Create a markdown file in the `blog/` directory
2. Add an entry to `blog/posts.json`:
   ```json
   {
     "title": "Your Post Title",
     "date": "2025-08-01",
     "file": "your-post.md",
     "excerpt": "A brief description..."
   }
   ```

## Customization

Edit `js/config.js` to update:
- Personal information
- Social links
- LED messages
- Skills and achievements

## License

This project is open source and available under the MIT License.