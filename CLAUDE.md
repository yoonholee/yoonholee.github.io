# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is an academic personal website built with Jekyll, based on the [al-folio](https://github.com/alshedivat/al-folio) theme. The site showcases research publications, blog posts, and professional information for Yoonho Lee, a Ph.D. candidate at Stanford CS advised by Chelsea Finn.

**Live site:** https://www.yoonholee.com

## Local Development

### Running the Site Locally

```bash
bundle exec jekyll serve
```

Starts a local server at `http://localhost:4000` with live reload.

### Docker Development (Alternative)

```bash
docker-compose up
```

Runs Jekyll in a Docker container at `http://localhost:8080`.

## Site Architecture

### Content Organization

- **`_pages/`**: Static pages
  - `about.md` - Homepage with profile, research description, and selected papers (uses Schema.org structured data)
  - `publications.md` - Full publications list
  - `unlisted.md` - Index for unlisted content
- **`_posts/`**: Blog posts (currently: `2025-11-25-feedback-descent.md`)
- **`_bibliography/`**: BibTeX files
  - `papers.bib` - Main bibliography (~51KB)
  - `official.bib` - Additional publication metadata
- **`_unlisted/`**: Draft/unlisted content (not indexed)
- **`_news/`**: News items (currently disabled in config)

### Layouts (`_layouts/`)

- `about.html` - Profile page with news/papers sections
- `post.html` - Blog post layout with ToC sidebar
- `bib.html` - Bibliography entry template
- `default.html` - Base layout
- `archive-*.html` - Archive pages for year/tag/category

### Includes (`_includes/`)

- `head.html` - HTML head with meta tags, CSS, performance optimizations
- `header.html` - Navigation bar
- `footer.html` - Footer
- `schema_org.html` - Schema.org structured data for SEO
- `paper_schema.html` - Schema.org for individual papers
- `blog_post_schema.html` - Schema.org for blog posts
- `service_worker.html` - Service worker registration
- `scripts/` - Subdirectory for script includes

### Stylesheets (`_sass/`)

- `_base.scss` - Base styles (~21KB, main styling)
- `_toc.scss` - Table of contents and sidenote styles
- `_themes.scss` - Light/dark theme variables
- `_fonts.scss` - Font declarations
- `_distill.scss` - Distill-style article formatting
- `_print.scss` - Print styles

### JavaScript (`assets/js/`)

- `toc.js` - Auto-generates ToC with scrollspy (IntersectionObserver)
- `common.js` - Shared utilities
- `performance.js` - Performance monitoring
- `web-vitals.js` - Core Web Vitals tracking
- `skeleton.js` - Loading skeleton screens
- `zoom.js` - Image zoom functionality

## Configuration

**`_config.yml`** contains all site settings. Key values:

```yaml
url: https://www.yoonholee.com
google_analytics: G-FS7MW2SLV7

# Performance (all enabled)
enable_image_optimization: true
enable_lazy_loading: true
enable_critical_css: true
enable_defer_js: true

# Jekyll Scholar
scholar:
  bibliography: papers.bib
  style: apa
  sort_by: year, month
  order: descending

# Collections
collections:
  unlisted: { output: true }
  obsidian: { output: true }
```

## Blog Features

### Automatic Table of Contents

Blog posts auto-generate a ToC from H1 headings:

- Sticky sidebar navigation on desktop
- Active section highlighting via scrollspy
- Smooth scrolling with highlight animation
- Responsive (collapses on mobile)

Implementation: `assets/js/toc.js` + `_sass/_toc.scss`

### Tufte-Style Sidenotes

Blog posts support margin notes:

```html
<p>
  Main text.<label for="sn-id" class="sidenote-toggle-label">⊕</label>
  <input type="checkbox" id="sn-id" class="sidenote-toggle" />
  <span class="sidenote">Sidenote content.</span>
</p>
```

- Desktop: Notes in right margin
- Mobile: Toggle visibility with ⊕ symbol
- CSS-only implementation (checkbox hack)

## Publications System

### Jekyll Scholar

Publications managed via `jekyll-scholar` gem:

- BibTeX files in `_bibliography/`
- Custom fields: `abbr`, `tldr`, `code`, `paper`, `video`, `selected`, `preview`
- Filtered keywords (not shown in output): `abbr`, `abstract`, `arxiv`, `bibtex_show`, `html`, `pdf`, `selected`, `supp`, `blog`, `code`, `poster`, `slides`, `website`, `preview`, `altmetric`

### About Page Papers

The homepage (`about.md`) manually lists selected papers with:

- Schema.org structured data (`itemscope`, `itemtype="ScholarlyArticle"`)
- Custom data attributes (`data-year`)
- Paper tooltips with TLDRs
- `{% include paper_schema.html %}` for each paper

## SEO

- Schema.org metadata via `serve_schema_org: true`
- Open Graph meta tags via `serve_og_meta: true`
- Google Analytics (GA4): `G-FS7MW2SLV7`
- Custom keywords in `_config.yml`

## Deployment

### GitHub Actions

**`.github/workflows/deploy.yml`** - Auto-deploys on push to `master`:

1. Checkout code
2. Setup Ruby 3.2.2
3. Cache Jekyll artifacts
4. Install ImageMagick
5. Run `bin/deploy` to build and push to `gh-pages`

**`.github/workflows/test.yml`** - Runs on push/PR:

1. Lint CSS/SCSS (`npm run lint:css`)
2. Lint JavaScript (`npm run lint:js`)
3. Build site (`bundle exec jekyll build`)
4. Test internal links (`bundle exec rake test`)
5. Test external links (main branch only, non-blocking)

### Manual Deployment

```bash
bash bin/deploy --verbose --src master --deploy gh-pages
```

## Key Plugins

- `jekyll-scholar` - Bibliography/citation management
- `jekyll-archives` - Year/tag/category archives
- `jekyll-minifier` - HTML/CSS/JS minification
- `jekyll-paginate-v2` - Blog pagination
- `jekyll-imagemagick` - Responsive image generation
- `jekyll-diagrams` - Diagram rendering
- `jemoji` - GitHub-style emoji

## Performance Optimizations

All enabled in `_config.yml`:

- **Image optimization**: ImageMagick generates WebP + multiple sizes (480, 800, 1400px)
- **Lazy loading**: Images load on scroll
- **Critical CSS**: Extracted and inlined
- **Deferred JS**: Non-critical JS deferred
- **CSS optimization**: Preconnect hints, preload critical CSS, defer non-critical
- **Service worker**: Caches key resources for offline support
- **LCP optimization**: `fetchpriority="high"` on profile image
- **Font optimization**: `font-display: swap` prevents FOIT

Target: Core Web Vitals 2025 (LCP <2.5s, INP <200ms, CLS <0.1)

## Customizations from Base al-folio

1. Custom ToC implementation with scrollspy
2. Tufte-style sidenotes for academic writing
3. Manual paper listing in `about.md` with Schema.org markup
4. Custom Schema.org includes for SEO
5. Performance optimizations enabled
6. Service worker for offline support
7. Web Vitals tracking

## File Modification Patterns

| Task         | Files to Edit                                       |
| ------------ | --------------------------------------------------- |
| Publications | `_bibliography/papers.bib` and/or `_pages/about.md` |
| Blog posts   | Create `_posts/YYYY-MM-DD-title.md`                 |
| About page   | `_pages/about.md`                                   |
| Styling      | `_sass/_*.scss` files                               |
| Site config  | `_config.yml` (requires Jekyll restart)             |
| Navigation   | `_includes/header.html`                             |
| SEO/meta     | `_includes/head.html`, `_includes/schema_org.html`  |

## Common Commands

```bash
# Local development
bundle exec jekyll serve

# Build only
bundle exec jekyll build

# Lint
npm run lint:css
npm run lint:js

# Test links
bundle exec rake test
bundle exec rake test_external
```
