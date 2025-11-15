# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is an academic personal website built with Jekyll, based on the [al-folio](https://github.com/alshedivat/al-folio) theme. The site showcases research publications, blog posts, and professional information for Yoonho Lee, a Ph.D. candidate at Stanford CS.

## Local Development

### Running the Site Locally

```bash
bundle exec jekyll serve
```

This starts a local server at `http://localhost:4000` with live reload enabled.

### Docker Development (Alternative)

```bash
docker-compose up
```

Runs Jekyll in a Docker container accessible at `http://localhost:8080`.

## Site Architecture

### Content Organization

- **`_pages/`**: Static pages (about, publications)
  - `about.md` uses the `about` layout and renders profile, research description, and selected papers
  - Papers in `about.md` use Schema.org structured data for SEO
- **`_posts/`**: Blog posts with special features (see Blog Features below)
- **`_bibliography/`**: BibTeX files for publications
  - `papers.bib` is the main bibliography file
  - `official.bib` contains additional publication metadata
- **`_layouts/`**: HTML templates
  - `about.html`: Profile page with news/papers sections
  - `post.html`: Blog post layout with ToC sidebar
  - `bib.html`: Bibliography entry template
- **`_includes/`**: Reusable HTML components
  - `selected_papers.html`: Renders papers marked with `selected=true` in BibTeX
  - `schema_org.html`: Schema.org structured data (newly added)
- **`_sass/`**: SCSS stylesheets
  - `_toc.scss`: Table of contents and sidenote styles
- **`assets/js/`**: JavaScript functionality
  - `toc.js`: Auto-generates ToC with scrollspy using IntersectionObserver API

### Configuration

**`_config.yml`** contains all site settings:

- Personal info (name, email, social links)
- Jekyll Scholar settings (bibliography formatting)
- Plugin configuration (jekyll-archives, jekyll-scholar, etc.)
- Performance settings (image optimization, lazy loading - currently disabled)
- SEO settings (Google Analytics, Open Graph, Schema.org)

**Important config values:**

- `scholar.bibliography: papers.bib` - main bibliography source
- `collections.obsidian` - custom collection for obsidian notes
- Performance optimizations are **enabled** (see lines 23-28):
  - Image optimization: true
  - Lazy loading: true
  - Critical CSS: true
  - Defer JS: true

## Blog Features

### Automatic Table of Contents

Blog posts automatically generate a table of contents from H1 headings:

- Sticky sidebar navigation on desktop
- Active section highlighting via scrollspy (IntersectionObserver)
- Smooth scrolling with highlight animation on click
- Responsive: collapses on mobile

Implementation: `assets/js/toc.js` + `_sass/_toc.scss`

### Tufte-Style Sidenotes

Blog posts support margin notes that appear alongside text on desktop:

```html
<p>
  Main text.<label for="sn-id" class="sidenote-toggle-label">⊕</label>
  <input type="checkbox" id="sn-id" class="sidenote-toggle" />
  <span class="sidenote">Sidenote content.</span>
</p>
```

- Desktop: Notes in right margin
- Mobile: Hidden by default, toggle with ⊕ symbol
- CSS-only implementation using checkbox hack

## Publications System

### Jekyll Scholar

Publications are managed via Jekyll Scholar (`jekyll-scholar` gem):

- BibTeX files in `_bibliography/` directory
- Custom fields supported: `abbr`, `tldr`, `code`, `paper`, `video`, `selected`
- Filter out internal keywords via `filtered_bibtex_keywords` in `_config.yml`

### About Page Papers

The `about.md` page manually lists selected papers with:

- Schema.org structured data (`itemscope`, `itemtype="ScholarlyArticle"`)
- Custom data attributes for filtering (`data-year`, `data-venue`, `data-topics`)
- Main paper links marked with `main-paper-link` attribute

### SEO Enhancements

- `serve_schema_org: true` in `_config.yml` enables Schema.org metadata
- `_includes/schema_org.html` provides structured data for research/person
- Open Graph meta tags enabled via `serve_og_meta: true`
- Google Analytics tracking via `google_analytics: G-FS7MW2SLV7` (GA4 format)

### Analytics: Tracking LLM Referrals

To track traffic from AI chatbots (ChatGPT, Claude, Perplexity, etc.) in Google Analytics 4:

1. **Go to GA4 Admin** → Data Streams → Web → Click your data stream
2. **Navigate to Explore** → Create new exploration report
3. **Add regex filter** to identify LLM traffic sources:
   ```
   ^.*\.openai.*|.*copilot.*|.*chatgpt.*|.*gemini.*|.*gpt.*|.*neeva.*|.*perplexity.*|.*claude.*
   ```
4. **Apply to dimensions**: Source, Medium, or Campaign
5. **Create custom dimension** (optional):
   - Dimension name: `LLM Referral`
   - Scope: Event
   - Filter: Apply the regex above

This helps measure how AI chatbots drive traffic to your research publications.

## Deployment

### GitHub Actions

The site auto-deploys via `.github/workflows/deploy.yml`:

- Triggers on push to `master` or `main` branches
- Builds Jekyll site and deploys to `gh-pages` branch
- Uses `bin/deploy` script for deployment
- Installs ImageMagick and Mermaid CLI for diagrams

### Manual Deployment

```bash
bash bin/deploy --verbose --src master --deploy gh-pages
```

## Key Plugins

- **jekyll-scholar**: Bibliography/citation management
- **jekyll-archives**: Automatic year/tag/category archives for blog
- **jekyll-minifier**: Minifies HTML/CSS/JS output
- **jekyll-paginate-v2**: Blog pagination
- **jekyll-diagrams**: Diagram rendering support
- **jemoji**: GitHub-style emoji support

## Code Quality & CI/CD

Configuration files:

- `purgecss.config.js`: Removes unused CSS from built site

### Performance Optimizations

Enabled features:

- **Image optimization**: ImageMagick processes images into multiple sizes and WebP format
- **Lazy loading**: Images load on-demand as user scrolls
- **Responsive images**: Multiple sizes generated (480px, 800px, 1400px) for different viewports
- **Profile image**: Optimized to 622x800px (65KB) with explicit dimensions to prevent layout shift
- **CSS optimization**:
  - Preconnect hints for CDN origins (jsdelivr, Google Fonts, GTM)
  - Preload critical CSS (Bootstrap, MDB)
  - Deferred non-critical CSS (FontAwesome, Academicons, Fonts)
  - Critical CSS extraction enabled
- **JavaScript optimization**:
  - Defer non-critical JS enabled
  - Service worker for offline support (caches key resources)
- **LCP optimization**: `fetchpriority="high"` on profile image
- **Font optimization**: `font-display: swap` added to Google Fonts to prevent FOIT
- **PurgeCSS**: Removes unused CSS during build
- **Core Web Vitals 2025**: Targeting LCP <2.5s, INP <200ms, CLS <0.1

Expected PageSpeed score: **80-85/100** (up from 56)

**Optional: Self-host Google Fonts**
To further optimize font loading and reduce DNS lookups:

1. Use [google-webfonts-helper](https://gwfh.mranftl.com/fonts) to download Roboto and Roboto Slab
2. Subset fonts to Latin charset only
3. Place fonts in `/assets/fonts/`
4. Update `_includes/head.html` to reference local fonts
5. Add `@font-face` declarations to `_sass/_base.scss`

See `PERFORMANCE_NOTES.md` for details on remaining optimizations and `CLOUDFLARE_SETUP.md` for optional CDN caching improvements.

## Customization Notes

This site has been customized beyond the base al-folio template:

1. Custom ToC implementation with scrollspy for blog posts
2. Tufte-style sidenotes for academic writing
3. Manual paper listing in `about.md` with Schema.org markup (instead of using Jekyll Scholar's auto-generation)
4. Custom Schema.org include for SEO
5. Performance optimizations intentionally disabled for simpler setup

## File Modification Patterns

When editing content:

- **Publications**: Edit `_bibliography/papers.bib` and/or manually update `_pages/about.md`
- **Blog posts**: Create new markdown files in `_posts/` with YAML frontmatter
- **About page**: Edit `_pages/about.md` (includes manual HTML for structured papers)
- **Styling**: Edit SCSS files in `_sass/` (imports via `assets/css/main.scss`)
- **Site config**: Modify `_config.yml` (requires Jekyll restart)
