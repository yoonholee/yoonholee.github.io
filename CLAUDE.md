# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Quick Reference: Where to Find Things

### "I need to change X" lookup table

| Change needed | Primary file(s) |
|--------------|-----------------|
| Site styling | `_sass/_*.scss` (see CSS Architecture below) |
| Script loading | `_includes/scripts.html` (single manifest) |
| Blog post layout | `_layouts/post.html` + `_sass/_blog.scss` + `_sass/_toc.scss` |
| Homepage | `_pages/about.md` + `_layouts/about.html` |
| Publication list | `_bibliography/papers.bib` |
| Navigation bar | `_includes/header.html` + `_sass/_navigation.scss` |
| SEO/meta tags | `_includes/head.html` + `_includes/schema_org.html` |
| Performance JS | `assets/js/performance.js`, `skeleton.js`, `web-vitals.js` |
| Site config | `_config.yml` (requires Jekyll restart) |

### File counts by directory

- `_sass/`: 12 SCSS files (~1,400 lines)
- `_includes/`: 23 HTML fragments (7 in scripts/)
- `_layouts/`: 11 templates
- `assets/js/`: 6 JS files (~550 lines)

## CSS Architecture

All styles are imported via `assets/css/main.scss` in this order:

```
main.scss
├── Foundation (load first)
│   ├── _fonts.scss      # @font-face declarations
│   ├── _variables.scss  # Modular scale, colors, spacing, layout measurements
│   ├── _themes.scss     # CSS custom properties for light/dark modes
│   └── _layout.scss     # Container, body, profile sections
├── Core
│   ├── _typography.scss # Headings, links, code blocks
│   ├── _components.scss # Buttons, badges, cards, skeleton loaders
│   └── _navigation.scss # Navbar, footer, dropdowns
└── Page-specific
    ├── _about.scss       # Profile card
    ├── _publications.scss # Paper cards
    ├── _blog.scss        # Post lists, metadata
    ├── _toc.scss         # Table of contents sidebar
    └── _print.scss       # Print media queries
```

## Script Loading

All JavaScript loads from `_includes/scripts.html` (single manifest). Loading order:

1. **Bootstrap** - Framework (required first)
2. **common.js** - Abstract/BibTeX toggles
3. **toc.js** - ToC generation (post layout only)
4. **zoom.js** - Image zoom (if enabled)
5. **skeleton.js** - Lazy image loading with placeholders
6. **performance.js** - Animation observer, deferred resources
7. **web-vitals.js** - Core Web Vitals tracking
8. **mathjax.html** - Math rendering (if page has math)
9. **analytics.html** - Google Analytics
10. **progressBar.html** - Reading progress bar
11. **littlefoot.html** - Margin note footnotes
12. **service_worker.html** - Offline support

## Layout Measurements (Keep in Sync)

These values appear in both SCSS and JS. If you change one, update the other.

| Value | SCSS variable | JS constant | Purpose |
|-------|---------------|-------------|---------|
| 56px | `$navbar-height` | - | Bootstrap navbar height |
| 800px | `$post-content-width` | - | Blog post max width |
| 250px | `$toc-sidebar-width` | - | ToC sidebar width |
| 670px | `$toc-sidebar-offset` | - | Distance from center to ToC |
| 150px | `$toc-scroll-offset` | `SCROLL_OFFSET` in toc.js | Offset when clicking ToC links |
| 6rem | `$toc-sidebar-top` | - | Top position of ToC |
| 1280px | `$toc-breakpoint` | - | Hide ToC below this width |

All defined in `_sass/_variables.scss`. JS references via comments ("sync with _variables.scss").

## Template Hierarchy

```
default.html (root - loads all scripts via scripts.html)
├── about.html (homepage)
├── page.html (static pages)
├── post.html (blog posts, includes ToC sidebar)
├── cv.html (CV page)
└── unlisted.html (draft content)

bib.html (standalone - Jekyll Scholar template)
archive-*.html (standalone - jekyll-archives)
```

## Overview

Academic personal website built with Jekyll, based on [al-folio](https://github.com/alshedivat/al-folio). Showcases research publications, blog posts, and professional information.

**Live site:** https://www.yoonholee.com

## Local Development

```bash
bundle exec jekyll serve  # http://localhost:4000, live reload
```

Config changes require restart. Docker alternative: `docker-compose up` (port 8080).

## Content Organization

- **`_pages/`**: Static pages (about.md, publications.md)
- **`_posts/`**: Blog posts (YYYY-MM-DD-title.md format)
- **`_bibliography/`**: BibTeX files (papers.bib, official.bib)
- **`_unlisted/`**: Draft/unlisted content (not indexed)

## Blog Features

### Table of Contents

Blog posts auto-generate a ToC from H1/H2 headings:
- Sticky sidebar on desktop (hidden on mobile)
- Active section highlighting via IntersectionObserver
- Smooth scrolling with highlight animation

Implementation: `assets/js/toc.js` + `_sass/_toc.scss`

### Margin Note Footnotes

Uses littlefoot.js for margin notes on wide screens. Standard Markdown footnotes work:
```markdown
Here is text with a footnote[^1].

[^1]: This appears in the margin on desktop.
```

## Publications System

Publications managed via `jekyll-scholar`:
- BibTeX files in `_bibliography/`
- Custom fields: `abbr`, `tldr`, `code`, `paper`, `video`, `selected`, `preview`
- Homepage (`about.md`) manually lists selected papers with Schema.org markup

## Configuration

**`_config.yml`** key values:

```yaml
url: https://www.yoonholee.com
google_analytics: G-FS7MW2SLV7

# Performance (all enabled)
enable_image_optimization: true
enable_lazy_loading: true
enable_medium_zoom: true
enable_progressbar: true
enable_math: true

# Jekyll Scholar
scholar:
  bibliography: papers.bib
  style: apa
  sort_by: year, month
  order: descending
```

## Deployment

GitHub Actions auto-deploy on push to `master`:
1. Lint CSS/JS
2. Build site
3. Test links
4. Deploy to `gh-pages`

Manual: `bash bin/deploy --verbose --src master --deploy gh-pages`

## Common Commands

```bash
bundle exec jekyll serve     # Local dev
bundle exec jekyll build     # Build only
npm run lint:css             # Lint SCSS
npm run lint:js              # Lint JS
bundle exec rake test        # Test internal links
```

## Pre-commit Hook

A pre-commit hook in `.githooks/pre-commit` runs before each commit:
1. Jekyll build (catches Liquid/SCSS errors)
2. SCSS lint (if .scss files changed)
3. JS lint (if .js files changed)

To enable after cloning: `git config core.hooksPath .githooks`

## Performance

Target: Core Web Vitals 2025 (LCP <2.5s, INP <200ms, CLS <0.1)

- Image optimization via ImageMagick (WebP + multiple sizes)
- Lazy loading with skeleton placeholders (skeleton.js)
- Deferred JS loading
- Service worker for offline support
- Web Vitals tracking to Google Analytics
