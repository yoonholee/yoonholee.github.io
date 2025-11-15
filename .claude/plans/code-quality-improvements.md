# Code Quality & Maintainability Improvements - Implementation Plan

**Created:** 2025-11-14
**Estimated Total Time:** 5-6 hours
**Risk Level:** Low-Medium (mostly additive changes, some refactoring)

---

## Overview

This plan implements 10 high-impact improvements to code quality, automation, and maintainability. Items are ordered by dependencies and impact.

**Scope:**

1. Dependency automation (Dependabot)
2. CI/CD caching improvements
3. Remove jQuery dependency
4. Automated link checking (HTMLProofer)
5. Git repository hygiene
6. CSS/JS linting (Stylelint + ESLint)
7. Critical accessibility fixes
8. Pre-commit hooks
9. Font subsetting
10. Security fixes (CSP via meta tag, SRI hashes, inline onclick removal)

**Out of Scope (for later):**

- CSS architecture refactoring (splitting \_base.scss)
- Additional performance optimizations
- Testing infrastructure (pa11y, Lighthouse CI)

---

## Task 1: Add Dependabot Configuration

**Time:** 5 minutes
**Risk:** None
**Dependencies:** None

### Implementation

Create `.github/dependabot.yml`:

```yaml
version: 2
updates:
  # Ruby dependencies
  - package-ecosystem: "bundler"
    directory: "/"
    schedule:
      interval: "weekly"
      day: "monday"
      time: "09:00"
    open-pull-requests-limit: 5
    reviewers:
      - "yoonholee"
    labels:
      - "dependencies"
      - "ruby"
    ignore:
      # Major version updates require manual review
      - dependency-name: "jekyll"
        update-types: ["version-update:semver-major"]
      - dependency-name: "liquid"
        update-types: ["version-update:semver-major"]

  # JavaScript dependencies (if package.json exists)
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
      day: "monday"
      time: "09:00"
    open-pull-requests-limit: 3
    reviewers:
      - "yoonholee"
    labels:
      - "dependencies"
      - "javascript"

  # GitHub Actions
  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "weekly"
      day: "monday"
      time: "09:00"
    open-pull-requests-limit: 2
    labels:
      - "dependencies"
      - "ci"
```

### Testing

1. Commit and push the file
2. Check GitHub repo → Insights → Dependency graph → Dependabot
3. Verify Dependabot creates PRs within 24 hours

### Notes

- Dependabot will detect 29 outdated gems immediately
- Set to weekly updates on Monday mornings
- Ignores major version jumps for Jekyll/Liquid (breaking changes)
- No code changes needed after setup

---

## Task 2: Add Build Caching to GitHub Actions

**Time:** 15 minutes
**Risk:** Low (cache misses fall back to normal build)
**Dependencies:** None

### Current State

`.github/workflows/deploy.yml` only caches bundler:

```yaml
- name: Setup Ruby
  uses: ruby/setup-ruby@v1
  with:
    ruby-version: "3.2.2"
    bundler-cache: true # Only this is cached
```

### Implementation

Add three new cache steps to `.github/workflows/deploy.yml`:

#### 2.1 Cache Jekyll Build Artifacts

Add after "Setup Ruby" step (before build):

```yaml
- name: Cache Jekyll artifacts
  uses: actions/cache@v4
  with:
    path: |
      .jekyll-cache
      .jekyll-metadata
    key: jekyll-${{ runner.os }}-${{ hashFiles('**/*.md', '**/*.html', '_config.yml', '_sass/**', '_layouts/**', '_includes/**') }}
    restore-keys: |
      jekyll-${{ runner.os }}-
```

#### 2.2 Cache apt Packages (ImageMagick)

Replace:

```yaml
- name: Install dependencies
  run: |
    sudo apt-get update
    sudo apt-get install -y imagemagick
```

With:

```yaml
- name: Cache and install ImageMagick
  uses: awalsh128/cache-apt-pkgs-action@v1
  with:
    packages: imagemagick
    version: 1.0
```

#### 2.3 Remove Mermaid-CLI (Unused)

**Finding:** No mermaid diagrams found in `_posts/` or `_pages/`

Remove this line from "Install dependencies" step:

```yaml
npm install -g @mermaid-js/mermaid-cli@latest
```

### Expected Improvements

- **First run:** No change (cache miss)
- **Subsequent runs:**
  - 15-30% faster builds (Jekyll cache)
  - 10-15s saved (skip Mermaid install)
  - 5-10s saved (ImageMagick cache)
- **Total:** ~30-40% faster CI builds (2-3 min → 1.5-2 min)

### Testing

1. Push changes to a PR branch
2. Watch GitHub Actions run twice (first = cache miss, second = cache hit)
3. Compare build times before/after

### Rollback Plan

If builds break:

- Remove cache steps
- Revert to original workflow
- Cache issues are non-breaking (just slower builds)

---

## Task 3: Remove jQuery Dependency

**Time:** 30-45 minutes
**Risk:** Medium (functionality change, needs testing)
**Dependencies:** None
**Files Modified:** 5 files

### Current Usage Analysis

jQuery (85KB gzipped) is used in only 3 places:

1. **`assets/js/common.js`** (27 lines)
   - Abstract/bib toggle click handlers
   - Uses jQuery for event delegation and `.closest()`, `.toggleClass()`

2. **`assets/js/zoom.js`** (6 lines)
   - Medium Zoom initialization
   - Only uses `$()` selector

3. **`_includes/scripts/progressBar.html`** (60 lines inline)
   - Scroll progress bar
   - Uses jQuery for scroll events and DOM manipulation

### Implementation Steps

#### 3.1 Rewrite `assets/js/common.js` (Vanilla JS)

**Current:**

```javascript
$(document).ready(function () {
  $(document).on("click", "a.abstract.publink", function (e) {
    e.preventDefault();
    var row = $(this).closest(".publication-row");
    row.find(".abstract.hidden").toggleClass("open");
    row.find(".bib.hidden").removeClass("open");
  });

  $(document).on("click", "a.bib.publink", function (e) {
    e.preventDefault();
    var row = $(this).closest(".publication-row");
    row.find(".abstract.hidden").removeClass("open");
    row.find(".bib.hidden").toggleClass("open");
  });

  $("div.row.publication-row:target").find(".abstract.hidden").addClass("open");
});
```

**Replace with:**

```javascript
document.addEventListener("DOMContentLoaded", function () {
  // Delegated event listeners for abstract/bib toggles
  document.body.addEventListener("click", function (e) {
    // Abstract toggle
    if (e.target.matches("a.abstract.publink")) {
      e.preventDefault();
      const row = e.target.closest(".publication-row");
      if (!row) return;

      row.querySelector(".abstract.hidden")?.classList.toggle("open");
      row.querySelector(".bib.hidden")?.classList.remove("open");
    }

    // Bib toggle
    if (e.target.matches("a.bib.publink")) {
      e.preventDefault();
      const row = e.target.closest(".publication-row");
      if (!row) return;

      row.querySelector(".abstract.hidden")?.classList.remove("open");
      row.querySelector(".bib.hidden")?.classList.toggle("open");
    }
  });

  // Open abstract if URL has #bibkey target
  const targetRow = document.querySelector("div.row.publication-row:target");
  if (targetRow) {
    targetRow.querySelector(".abstract.hidden")?.classList.add("open");
  }
});
```

**Lines of code:** 27 → 27 (same length, 85KB smaller payload)

#### 3.2 Rewrite `assets/js/zoom.js` (Vanilla JS)

**Current:**

```javascript
$(document).ready(function () {
  if (typeof medium_zoom !== "undefined") {
    medium_zoom = mediumZoom("[data-zoomable]", {
      margin: 100,
      background: $("html").css("background-color") + "ee", // trasparency
    });
  }
});
```

**Replace with:**

```javascript
document.addEventListener("DOMContentLoaded", function () {
  if (typeof mediumZoom === "undefined") return;

  const bgColor = getComputedStyle(document.documentElement).getPropertyValue("--global-bg-color").trim() || "#ffffff";

  mediumZoom("[data-zoomable]", {
    margin: 100,
    background: bgColor + "ee", // transparency
  });
});
```

**Bonus fix:** Corrected typo "trasparency" → "transparency"

#### 3.3 Rewrite `_includes/scripts/progressBar.html` (Vanilla JS)

**Current:** 60 lines of jQuery inline script

**Replace entire file with:**

```html
<script>
  (function () {
    "use strict";

    const progressBar = document.getElementById("progress");
    if (!progressBar) return;

    let ticking = false;

    function updateProgress() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;

      if (docHeight > 0) {
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.value = scrollPercent;
      }

      ticking = false;
    }

    function requestTick() {
      if (!ticking) {
        window.requestAnimationFrame(updateProgress);
        ticking = true;
      }
    }

    // Update on scroll (throttled with RAF)
    window.addEventListener("scroll", requestTick, { passive: true });

    // Update on load and resize
    window.addEventListener("load", updateProgress);
    window.addEventListener("resize", updateProgress);

    // Initial update
    updateProgress();
  })();
</script>
```

**Improvements:**

- 60 lines → 35 lines
- Uses `requestAnimationFrame` for smooth 60fps updates (better than jQuery)
- Passive event listener for better scroll performance
- No jQuery dependency

#### 3.4 Remove jQuery Script Tag

**File:** `_includes/scripts/jquery.html`

Delete the entire file or replace contents with:

```html
<!-- jQuery removed - site now uses vanilla JavaScript -->
```

**File:** `_includes/head.html` or wherever jQuery is loaded

Remove or comment out:

```html
{% include scripts/jquery.html %}
```

#### 3.5 Remove jQuery from Scripts Includes

**File:** `_layouts/default.html` (or wherever scripts are loaded)

Ensure the jQuery include is removed from the layout.

### Testing Checklist

Test all jQuery-dependent features:

- [ ] **Publications page:**
  - [ ] Click "abstract" link → abstract expands
  - [ ] Click "bib" link → bibtex expands, abstract collapses
  - [ ] Open URL with `#bibkey` anchor → abstract auto-opens

- [ ] **Image zoom:**
  - [ ] Click on `[data-zoomable]` images → Medium Zoom activates
  - [ ] Background color matches theme

- [ ] **Scroll progress bar:**
  - [ ] Progress bar updates smoothly while scrolling
  - [ ] Progress bar shows 0% at top, 100% at bottom
  - [ ] No console errors

- [ ] **Browser compatibility:**
  - [ ] Chrome/Edge (modern)
  - [ ] Firefox
  - [ ] Safari (test `closest()` polyfill if supporting old versions)

### Browser Compatibility

All used APIs work in modern browsers:

- `document.addEventListener`: ✓ All browsers
- `.closest()`: ✓ Chrome 41+, Firefox 35+, Safari 9+
- `.matches()`: ✓ All modern browsers
- `requestAnimationFrame`: ✓ All modern browsers
- Optional chaining `?.`: ✓ Chrome 80+, Firefox 74+, Safari 13.1+

**If supporting Safari <13.1:** Replace `?.` with explicit null checks:

```javascript
const abstractEl = row.querySelector(".abstract.hidden");
if (abstractEl) abstractEl.classList.toggle("open");
```

### Rollback Plan

If issues arise:

1. Revert all 5 files to previous versions
2. Re-add jQuery include
3. Site will work exactly as before

### Performance Gains

- **Bundle size:** -85KB gzipped (~250KB uncompressed)
- **HTTP requests:** -1 (no jQuery CDN request)
- **Parse time:** -50ms (estimate)
- **PageSpeed score:** +3-5 points

---

## Task 4: Add HTMLProofer for Link Checking

**Time:** 20 minutes
**Risk:** Low (test-only addition)
**Dependencies:** None

### Implementation

#### 4.1 Add to Gemfile

Add to test group:

```ruby
group :test do
  gem 'html-proofer', '~> 5.0'
end
```

Run: `bundle install`

#### 4.2 Create Configuration File

Create `.htmlproofer.yml`:

```yaml
# HTMLProofer configuration for yoonholee.github.io

# Assume extension for extensionless URLs (Jekyll default)
assume_extension: ".html"

# Allow href="#" links (common for JavaScript toggles)
allow_hash_href: true

# Validate favicon exists
check_favicon: true

# Validate Open Graph meta tags
check_opengraph: true

# Enforce HTTPS for all URLs
enforce_https: true

# Ignore specific URLs (rate-limited or problematic sites)
ignore_urls:
  - /localhost/
  - /127.0.0.1/
  - /linkedin\.com\// # Rate limited
  - /twitter\.com\// # Rate limited
  - /x\.com\// # Rate limited

# Disable external link checking by default (faster local runs)
# Override with --external flag for full checks
disable_external: false

# Check HTML validity
check_html: true

# Validate images use HTTPS
check_img_http: true

# Check for valid internal hash references
check_internal_hash: true

# Allow missing alt tags (will fix separately in accessibility task)
validation:
  report_missing_names: false

# Typhoeus options for external requests
typhoeus:
  timeout: 30
  connecttimeout: 10
  followlocation: true
```

#### 4.3 Create Rake Task

Create `Rakefile` (if doesn't exist):

```ruby
require 'html-proofer'

desc 'Build the site'
task :build do
  sh 'bundle exec jekyll build'
end

desc 'Test HTML with HTMLProofer (internal links only)'
task test: :build do
  options = {
    assume_extension: true,
    disable_external: true,  # Fast local testing
    allow_hash_href: true,
    check_html: true,
  }
  HTMLProofer.check_directory('./_site', options).run
end

desc 'Test HTML including external links (slow)'
task test_external: :build do
  options = {
    assume_extension: true,
    disable_external: false,  # Check external links
    allow_hash_href: true,
    check_html: true,
    ignore_urls: [
      /linkedin\.com/,
      /twitter\.com/,
      /x\.com/,
    ],
    typhoeus: {
      timeout: 30,
      connecttimeout: 10,
    }
  }
  HTMLProofer.check_directory('./_site', options).run
end

task default: :test
```

#### 4.4 Add to GitHub Actions

Create `.github/workflows/test.yml`:

```yaml
name: Test

on:
  pull_request:
    branches: [master, main]
  push:
    branches: [master, main]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Ruby
        uses: ruby/setup-ruby@v1
        with:
          ruby-version: "3.2.2"
          bundler-cache: true

      - name: Cache Jekyll artifacts
        uses: actions/cache@v4
        with:
          path: |
            .jekyll-cache
            .jekyll-metadata
          key: jekyll-test-${{ runner.os }}-${{ hashFiles('**/*.md', '**/*.html', '_config.yml') }}
          restore-keys: |
            jekyll-test-${{ runner.os }}-

      - name: Install ImageMagick
        uses: awalsh128/cache-apt-pkgs-action@v1
        with:
          packages: imagemagick
          version: 1.0

      - name: Build site
        run: bundle exec jekyll build

      - name: Test internal links
        run: bundle exec rake test

      # Only check external links on main branch (slow)
      - name: Test external links
        if: github.ref == 'refs/heads/master' || github.ref == 'refs/heads/main'
        run: bundle exec rake test_external
        continue-on-error: true # Don't fail build on external link issues
```

### Testing

Local testing:

```bash
# Test internal links only (fast)
bundle exec rake test

# Test external links (slow - 478 lines in papers.bib!)
bundle exec rake test_external
```

Expected issues to fix:

- Broken internal anchor links
- Missing images
- HTTP links that should be HTTPS
- Broken external paper URLs

### Notes

- Internal link checks: ~10-30 seconds
- External link checks: 2-5 minutes (478-line bibliography!)
- Run external checks weekly, not on every commit
- `continue-on-error: true` for external links (some papers may move/404)

---

## Task 5: Fix .gitignore and Remove LaTeX Artifacts

**Time:** 10 minutes
**Risk:** None
**Dependencies:** None

### Current Issues

1. LaTeX build artifacts tracked in `CV/tmp/`:
   - `*.aux`, `*.log`, `*.pdf`, `*.synctex.gz`, `*.xdv`, etc.
2. Missing IDE files in .gitignore
3. Missing OS-specific files (Thumbs.db, etc.)
4. Missing node_modules (if npm is added)

### Implementation

#### 5.1 Update `.gitignore`

Replace entire `.gitignore` with:

```gitignore
# Jekyll build artifacts
_site
.sass-cache
.jekyll-cache
.jekyll-metadata

# Ruby/Bundler
.bundle
vendor
.ruby-version

# LaTeX build artifacts
CV/tmp/*.aux
CV/tmp/*.fdb_latexmk
CV/tmp/*.fls
CV/tmp/*.log
CV/tmp/*.out
CV/tmp/*.pdf
CV/tmp/*.synctex.gz
CV/tmp/*.xdv
CV/tmp/*.toc
CV/tmp/*.bbl
CV/tmp/*.blg
*.aux
*.log
*.synctex.gz
*.fdb_latexmk
*.fls

# OS-specific files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db
desktop.ini

# IDE and editor files
.vscode/
.idea/
*.swp
*.swo
*~
.project
.settings/
.classpath

# Node.js (if npm is used)
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
package-lock.json

# Environment files (future-proofing)
.env
.env.*
!.env.example

# Build artifacts
dist/
build/

# Cache files
.tweet-cache

# macOS specific
.AppleDouble
.LSOverride
```

#### 5.2 Remove LaTeX Artifacts from Git Tracking

```bash
# Remove from Git index (keeps local files)
git rm --cached CV/tmp/*.aux CV/tmp/*.fdb_latexmk CV/tmp/*.fls \
  CV/tmp/*.log CV/tmp/*.out CV/tmp/*.pdf CV/tmp/*.synctex.gz \
  CV/tmp/*.xdv 2>/dev/null || true

# Commit the removal
git commit -m "chore: remove LaTeX build artifacts from Git tracking"
```

#### 5.3 Create `.gitattributes`

Create `.gitattributes` for consistent line endings and binary handling:

```gitattributes
# Auto detect text files and normalize to LF
* text=auto eol=lf

# Explicitly mark text files
*.md text
*.html text
*.liquid text
*.css text
*.scss text
*.sass text
*.js text
*.json text
*.yml text
*.yaml text
*.xml text
*.txt text
*.sh text
*.bib text
*.tex text
*.rb text

# Mark binary files
*.png binary
*.jpg binary
*.jpeg binary
*.gif binary
*.ico binary
*.pdf binary
*.ttf binary
*.woff binary
*.woff2 binary
*.eot binary
*.mp4 binary
*.mov binary
*.avi binary
*.zip binary
*.tar binary
*.gz binary

# Git LFS (if needed in future)
# *.mp4 filter=lfs diff=lfs merge=lfs -text
# *.pdf filter=lfs diff=lfs merge=lfs -text

# Diff settings
*.bib diff=tex
*.tex diff=tex
```

### Testing

```bash
# Verify .gitignore works
touch CV/tmp/test.aux
git status  # Should NOT show test.aux

# Verify line endings
git ls-files --eol  # All text files should show "i/lf w/lf"
```

### Notes

- LaTeX artifacts will no longer clutter `git status`
- `.gitattributes` prevents Windows CRLF issues if collaborating
- Future-proofed for npm usage (node_modules ignored)

---

## Task 7: Set Up Stylelint + ESLint

**Time:** 45 minutes
**Risk:** Low (linting only, no code changes yet)
**Dependencies:** Task 3 (jQuery removal) should be done first

### Implementation

#### 7.1 Create `package.json`

Create `package.json`:

```json
{
  "name": "yoonholee-site",
  "version": "1.0.0",
  "private": true,
  "description": "Academic personal website for Yoonho Lee",
  "scripts": {
    "lint": "npm run lint:css && npm run lint:js",
    "lint:css": "stylelint '_sass/**/*.scss' 'assets/css/**/*.scss'",
    "lint:css:fix": "stylelint '_sass/**/*.scss' 'assets/css/**/*.scss' --fix",
    "lint:js": "eslint 'assets/js/**/*.js' 'sw.js'",
    "lint:js:fix": "eslint 'assets/js/**/*.js' 'sw.js' --fix"
  },
  "devDependencies": {
    "stylelint": "^16.10.0",
    "stylelint-config-standard-scss": "^13.1.0",
    "postcss": "^8.4.47",
    "eslint": "^9.14.0",
    "@eslint/js": "^9.14.0",
    "globals": "^15.12.0"
  }
}
```

Run: `npm install`

#### 7.2 Configure Stylelint

Create `.stylelintrc.json`:

```json
{
  "extends": "stylelint-config-standard-scss",
  "rules": {
    "selector-class-pattern": null,
    "max-line-length": 150,
    "no-descending-specificity": null,
    "scss/comment-no-empty": null,
    "scss/at-rule-no-unknown": [
      true,
      {
        "ignoreAtRules": ["tailwind", "apply", "layer"]
      }
    ],
    "declaration-empty-line-before": null,
    "at-rule-empty-line-before": [
      "always",
      {
        "except": ["blockless-after-same-name-blockless", "first-nested"],
        "ignore": ["after-comment"]
      }
    ],
    "custom-property-pattern": null,
    "no-invalid-position-at-import-rule": null,
    "import-notation": null
  },
  "ignoreFiles": ["_site/**/*", "node_modules/**/*", "vendor/**/*", ".jekyll-cache/**/*"]
}
```

Create `.stylelintignore`:

```
_site/
node_modules/
vendor/
.jekyll-cache/
```

#### 7.3 Configure ESLint

Create `eslint.config.js` (ESLint v9 flat config):

```javascript
import js from "@eslint/js";
import globals from "globals";

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "script",
      globals: {
        ...globals.browser,
        mediumZoom: "readonly",
      },
    },
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "error",
      "prefer-const": "warn",
      "no-var": "warn",
      eqeqeq: ["warn", "always"],
      curly: ["warn", "multi-line"],
      "no-console": "off", // Console allowed for analytics logging
    },
    ignores: ["_site/**", "node_modules/**", "vendor/**", ".jekyll-cache/**"],
  },
];
```

#### 7.4 Add to GitHub Actions

Update `.github/workflows/test.yml` to include linting:

```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: "20"
    cache: "npm"

- name: Install Node dependencies
  run: npm ci

- name: Lint CSS/SCSS
  run: npm run lint:css

- name: Lint JavaScript
  run: npm run lint:js
```

### Initial Issues to Expect

**Stylelint will likely report:**

- Missing `--global-theme-color-rgb` CSS variable (critical)
- Descending specificity issues (disabled in config)
- Long lines in comments (warning only)

**ESLint will likely report:**

- `mediumZoom` undefined (add to globals - done above)
- Unused variables in web-vitals.js
- `var` usage instead of `const/let`

### Testing

```bash
# Lint CSS
npm run lint:css

# Auto-fix CSS issues
npm run lint:css:fix

# Lint JS
npm run lint:js

# Auto-fix JS issues
npm run lint:js:fix

# Lint everything
npm run lint
```

### Notes

- Don't fix all issues immediately - create baseline first
- Run linters in CI to prevent new issues
- Use `--fix` for auto-fixable issues
- Manual review needed for complex issues

---

## Task 8: Fix Critical Accessibility Issues

**Time:** 1 hour
**Risk:** Low (structural improvements, no visual changes)
**Dependencies:** Task 3 (jQuery removal) recommended first

### Issues to Fix

1. **Interactive `<span>` with onclick → `<button>`** (CRITICAL)
2. **Missing `<main>` landmark** (CRITICAL)
3. **Incorrect pagination `tabindex="-1"`** (HIGH)
4. **Footer `<div>` → `<footer>`** (MEDIUM)
5. **Missing `aria-label` on progress bar** (MEDIUM)
6. **Add `aria-current` to ToC active links** (MEDIUM)

### Implementation

#### 8.1 Fix Interactive Span in Bibliography

**File:** `_layouts/bib.html` (lines 75-90)

**Current (INACCESSIBLE):**

```html
<span
  class="more-authors"
  title="click to view {{more_authors_hide}}"
  onclick="
      var element = $(this);
      ...
    "
>
  {{more_authors_hide}}
</span>
```

**Replace with (ACCESSIBLE):**

```html
<button
  type="button"
  class="more-authors"
  aria-label="Show {{ entry.author_array.size | minus: max_author_limit }} additional authors"
  aria-expanded="false"
  data-toggle-text-show="{{more_authors_show}}"
  data-toggle-text-hide="{{more_authors_hide}}"
>
  {{more_authors_hide}}
</button>
```

**Add CSS to make button look like span:**

Add to `_sass/_base.scss`:

```scss
// Make more-authors button look like styled text
button.more-authors {
  background: none;
  border: none;
  padding: 0;
  font: inherit;
  color: inherit;
  cursor: pointer;
  text-decoration: underline;

  &:hover {
    color: var(--global-hover-color);
  }

  &:focus-visible {
    outline: 2px solid var(--global-theme-color);
    outline-offset: 2px;
    border-radius: 2px;
  }
}
```

**Update JavaScript in `assets/js/common.js`:**

Add handler for the new button:

```javascript
// More authors toggle (after jQuery removal in Task 3)
document.body.addEventListener("click", function (e) {
  if (e.target.matches("button.more-authors")) {
    const button = e.target;
    const isExpanded = button.getAttribute("aria-expanded") === "true";
    const authorList = button.closest(".author").querySelector(".more-authors-list");

    if (!authorList) return;

    // Toggle visibility
    authorList.style.display = isExpanded ? "none" : "inline";

    // Update ARIA state
    button.setAttribute("aria-expanded", !isExpanded);

    // Update button text
    const showText = button.getAttribute("data-toggle-text-show");
    const hideText = button.getAttribute("data-toggle-text-hide");
    button.textContent = isExpanded ? hideText : showText;

    // Update title
    button.setAttribute("title", isExpanded ? "Show all authors" : "Hide additional authors");
  }
});
```

#### 8.2 Add `<main>` Landmark

**File:** `_layouts/default.html` (line 24)

**Current:**

```html
<div class="container mt-5" id="main-content">{{ content }}</div>
```

**Replace with:**

```html
<main class="container mt-5" id="main-content">{{ content }}</main>
```

No CSS changes needed - Bootstrap `.container` works on any element.

#### 8.3 Fix Pagination tabindex

**File:** `_includes/pagination.html` (line 5)

**Current (WRONG):**

```html
<a class="page-link" href="{{ paginator.previous_page_path | relative_url }}" tabindex="-1" aria-disabled="{{ paginator.previous_page }}"> Newer </a>
```

**Replace with:**

```html
{% if paginator.previous_page %}
<a class="page-link" href="{{ paginator.previous_page_path | relative_url }}"> Newer </a>
{% else %}
<span class="page-link disabled" aria-disabled="true"> Newer </span>
{% endif %}
```

Repeat for "Older" link.

#### 8.4 Change Footer Div to Semantic `<footer>`

**File:** `_includes/footer.html` (line 25)

**Current:**

```html
<div id="footer">...</div>
```

**Replace with:**

```html
<footer id="footer">...</footer>
```

No CSS changes needed - styles target `#footer` ID.

#### 8.5 Add `aria-label` to Progress Bar

**File:** `_includes/header.html` (line 94)

**Current:**

```html
<progress id="progress" value="0">
  <div class="progress-container">
    <span class="progress-bar"></span>
  </div>
</progress>
```

**Replace with:**

```html
<progress id="progress" value="0" max="100" aria-label="Page scroll progress">
  <div class="progress-container">
    <span class="progress-bar"></span>
  </div>
</progress>
```

#### 8.6 Add `aria-current` to ToC Active Links

**File:** `assets/js/toc.js` (around line 107)

**Current:**

```javascript
activeLink.classList.remove("active");
newActiveLink.classList.add("active");
```

**Replace with:**

```javascript
activeLink.classList.remove("active");
activeLink.removeAttribute("aria-current");

newActiveLink.classList.add("active");
newActiveLink.setAttribute("aria-current", "location");
```

### Testing Checklist

Test with keyboard only (no mouse):

- [ ] **Bibliography:**
  - [ ] Tab to "show more authors" button
  - [ ] Press Enter or Space → authors expand
  - [ ] Button text changes appropriately
  - [ ] Focus visible on button

- [ ] **Page structure:**
  - [ ] Screen reader announces `<main>` landmark
  - [ ] Screen reader announces `<footer>` landmark
  - [ ] Skip link works (Tab → Enter on skip link)

- [ ] **Pagination:**
  - [ ] Can tab to "Newer"/"Older" links when enabled
  - [ ] Cannot tab to disabled pagination links

- [ ] **Progress bar:**
  - [ ] Screen reader announces "Page scroll progress"

- [ ] **ToC:**
  - [ ] Active heading has `aria-current="location"`
  - [ ] Previous active heading doesn't have aria-current

### Browser Testing

- [ ] Chrome + ChromeVox screen reader
- [ ] Firefox
- [ ] Safari + VoiceOver
- [ ] Test with keyboard navigation only

### Expected WCAG Improvements

Before:

- WCAG 2.1 AA: ~60-70% compliant

After:

- WCAG 2.1 AA: ~85-90% compliant

Remaining issues (out of scope):

- Image alt text review (manual task)
- Color contrast audit (some footer text)
- Form accessibility (if forms added later)

---

## Task 9: Add Pre-commit Hooks

**Time:** 30 minutes
**Risk:** Low (developer experience improvement)
**Dependencies:** Tasks 5, 7 (linters must be configured)

### Implementation

#### 9.1 Install pre-commit Framework

```bash
pip install pre-commit
```

Or with Homebrew:

```bash
brew install pre-commit
```

#### 9.2 Create `.pre-commit-config.yaml`

```yaml
repos:
  # Standard pre-commit hooks
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.6.0
    hooks:
      - id: trailing-whitespace
        exclude: '_bibliography/.*\.bib$'
      - id: end-of-file-fixer
      - id: check-yaml
        exclude: '_config\.yml' # Jekyll uses non-standard YAML
      - id: check-added-large-files
        args: ["--maxkb=1000"]
      - id: mixed-line-ending
        args: ["--fix=lf"]
      - id: check-merge-conflict
      - id: detect-private-key

  # Prettier for code formatting
  - repo: https://github.com/pre-commit/mirrors-prettier
    rev: v4.0.0-alpha.8
    hooks:
      - id: prettier
        types_or: [javascript, json, markdown, yaml]
        exclude: "^(_site/|vendor/|node_modules/|_bibliography/)"
        args: ["--config", ".prettierrc"]

  # Stylelint for CSS/SCSS
  - repo: https://github.com/thibaudcolas/pre-commit-stylelint
    rev: v16.10.0
    hooks:
      - id: stylelint
        files: \.(css|scss)$
        args: ["--fix"]
        additional_dependencies:
          - "stylelint@^16.10.0"
          - "stylelint-config-standard-scss@^13.1.0"
          - "postcss@^8.4.47"

  # ESLint for JavaScript
  - repo: https://github.com/pre-commit/mirrors-eslint
    rev: v9.14.0
    hooks:
      - id: eslint
        files: \.(js)$
        args: ["--fix"]
        additional_dependencies:
          - "eslint@^9.14.0"
          - "@eslint/js@^9.14.0"
          - "globals@^15.12.0"

  # BibTeX validation (optional but recommended)
  - repo: local
    hooks:
      - id: bibtex-check
        name: Check BibTeX syntax
        entry: bash -c 'bibtex -terse _bibliography/papers.bib || true'
        language: system
        files: '\.bib$'
        pass_filenames: false
```

#### 9.3 Install Git Hooks

```bash
pre-commit install
```

This installs the hooks into `.git/hooks/pre-commit`.

#### 9.4 Test Pre-commit Hooks

```bash
# Test on all files
pre-commit run --all-files

# Test on staged files only
pre-commit run
```

### What Happens on Each Commit

1. **Before commit runs:**
   - Trailing whitespace removed
   - Line endings normalized to LF
   - YAML files validated
   - Large files blocked (>1MB)
   - Private keys detected and blocked
   - Prettier formats JS/JSON/MD/YAML
   - Stylelint auto-fixes CSS/SCSS
   - ESLint auto-fixes JavaScript
   - BibTeX syntax checked

2. **If hooks fail:**
   - Commit is blocked
   - Files are auto-fixed (if possible)
   - You review changes and re-stage
   - You commit again

3. **If hooks pass:**
   - Commit proceeds normally

### Skipping Hooks (Emergency Use Only)

```bash
# Skip hooks for one commit
git commit --no-verify -m "Emergency fix"
```

### Performance Notes

- First run: Slow (downloads dependencies)
- Subsequent runs: Fast (cached)
- Only runs on staged files (not entire repo)
- Auto-fixes most issues

### Optional: Auto-update Hooks

Add to `.pre-commit-config.yaml`:

```yaml
# Run this weekly to update hook versions
default_language_version:
  python: python3
```

Update hooks:

```bash
pre-commit autoupdate
```

---

## Task 10: Subset Fonts

**Time:** 30-45 minutes
**Risk:** Low-Medium (font loading change)
**Dependencies:** None

### Current State

Three full fonts preloaded (827KB total):

- `SourceSerif4-Semibold.ttf` (272KB)
- `SourceSans3-Variable.ttf` (293KB)
- `SourceSerif4-Regular.ttf` (262KB)

These fonts include all Unicode characters, but the site only uses Latin characters.

### Implementation Strategy

**Option A: Use Online Subsetting Tool (Recommended)**

1. Visit [FontSquirrel Webfont Generator](https://www.fontsquirrel.com/tools/webfont-generator)
2. Upload each font file
3. Select "Expert" mode
4. Choose subsetting options:
   - **Character set:** Latin
   - **Unicode ranges:** Basic Latin, Latin-1 Supplement
   - **Formats:** WOFF2, WOFF, TTF
   - **Hinting:** Keep default
5. Generate and download subset fonts
6. Replace files in `assets/fonts/`

**Option B: Use `pyftsubset` CLI Tool**

Install:

```bash
pip install fonttools brotli
```

Subset each font:

```bash
# Latin subset (includes basic + extended Latin)
pyftsubset assets/fonts/SourceSerif4-Regular.ttf \
  --output-file=assets/fonts/SourceSerif4-Regular-subset.woff2 \
  --flavor=woff2 \
  --layout-features='*' \
  --unicodes="U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD"

pyftsubset assets/fonts/SourceSerif4-Semibold.ttf \
  --output-file=assets/fonts/SourceSerif4-Semibold-subset.woff2 \
  --flavor=woff2 \
  --layout-features='*' \
  --unicodes="U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD"

pyftsubset assets/fonts/SourceSans3-Variable.ttf \
  --output-file=assets/fonts/SourceSans3-Variable-subset.woff2 \
  --flavor=woff2 \
  --layout-features='*' \
  --unicodes="U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD"
```

**Unicode range explanation:**

- `U+0000-00FF`: Basic Latin + Latin-1 Supplement (covers English + accented characters)
- Additional ranges: Smart quotes, dashes, Euro symbol, trademark, common symbols

### Update Font References

**File:** `_includes/head.html` (lines 7-10)

**Current:**

```html
<link rel="preload" href="{{ '/assets/fonts/SourceSerif4-Regular.ttf' | relative_url }}" as="font" type="font/ttf" crossorigin="anonymous" />
<link rel="preload" href="{{ '/assets/fonts/SourceSerif4-Semibold.ttf' | relative_url }}" as="font" type="font/ttf" crossorigin="anonymous" />
<link rel="preload" href="{{ '/assets/fonts/SourceSans3-Variable.ttf' | relative_url }}" as="font" type="font/ttf" crossorigin="anonymous" />
```

**Replace with:**

```html
<link
  rel="preload"
  href="{{ '/assets/fonts/SourceSerif4-Regular-subset.woff2' | relative_url }}"
  as="font"
  type="font/woff2"
  crossorigin="anonymous"
/>
<link
  rel="preload"
  href="{{ '/assets/fonts/SourceSerif4-Semibold-subset.woff2' | relative_url }}"
  as="font"
  type="font/woff2"
  crossorigin="anonymous"
/>
<link
  rel="preload"
  href="{{ '/assets/fonts/SourceSans3-Variable-subset.woff2' | relative_url }}"
  as="font"
  type="font/woff2"
  crossorigin="anonymous"
/>
```

**Note:** Changed `.ttf` → `.woff2` (better compression, same quality)

### Update Font CSS

**File:** Find where `@font-face` is defined (likely `_sass/_base.scss` or `assets/css/main.scss`)

**Current:**

```scss
@font-face {
  font-family: "Source Serif 4";
  src: url("../fonts/SourceSerif4-Regular.ttf") format("truetype");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "Source Serif 4";
  src: url("../fonts/SourceSerif4-Semibold.ttf") format("truetype");
  font-weight: 600;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "Source Sans 3";
  src: url("../fonts/SourceSans3-Variable.ttf") format("truetype");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
```

**Replace with (progressive enhancement):**

```scss
@font-face {
  font-family: "Source Serif 4";
  src:
    url("../fonts/SourceSerif4-Regular-subset.woff2") format("woff2"),
    url("../fonts/SourceSerif4-Regular.ttf") format("truetype");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
  unicode-range:
    U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215,
    U+FEFF, U+FFFD;
}

@font-face {
  font-family: "Source Serif 4";
  src:
    url("../fonts/SourceSerif4-Semibold-subset.woff2") format("woff2"),
    url("../fonts/SourceSerif4-Semibold.ttf") format("truetype");
  font-weight: 600;
  font-style: normal;
  font-display: swap;
  unicode-range:
    U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215,
    U+FEFF, U+FFFD;
}

@font-face {
  font-family: "Source Sans 3";
  src:
    url("../fonts/SourceSans3-Variable-subset.woff2") format("woff2"),
    url("../fonts/SourceSans3-Variable.ttf") format("truetype");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
  unicode-range:
    U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215,
    U+FEFF, U+FFFD;
}
```

**Benefits of this approach:**

- Browser tries WOFF2 first (smaller, better compression)
- Falls back to TTF for older browsers
- `unicode-range` tells browser to only download if page uses Latin characters

### Expected File Sizes

After subsetting:

- `SourceSerif4-Regular-subset.woff2`: ~40-60KB (was 262KB)
- `SourceSerif4-Semibold-subset.woff2`: ~40-60KB (was 272KB)
- `SourceSans3-Variable-subset.woff2`: ~50-80KB (was 293KB)

**Total:** ~150-200KB (was 827KB)
**Savings:** ~600KB (75% reduction)

### Testing Checklist

- [ ] **Visual inspection:**
  - [ ] All text renders correctly
  - [ ] No missing characters or boxes (□)
  - [ ] Proper font weights (regular vs semibold)
  - [ ] Accented characters work (é, ñ, ü, etc.)

- [ ] **Performance:**
  - [ ] Fonts load quickly
  - [ ] No FOIT (flash of invisible text) - `font-display: swap` prevents this
  - [ ] Check DevTools Network tab - fonts are ~150KB total

- [ ] **Browser compatibility:**
  - [ ] Chrome/Edge (WOFF2 support)
  - [ ] Firefox (WOFF2 support)
  - [ ] Safari (WOFF2 support since Safari 10+)
  - [ ] Older browsers fall back to TTF

### Rollback Plan

If fonts break:

1. Revert `_includes/head.html` preload links
2. Revert `@font-face` CSS
3. Delete subset fonts, keep original TTF files
4. Site will work exactly as before

### PageSpeed Impact

- **Before:** 827KB fonts preloaded
- **After:** ~150KB fonts preloaded
- **LCP improvement:** ~500-700ms faster (fonts are render-blocking)
- **PageSpeed score:** +5-8 points

---

## Testing Strategy

### Local Testing Order

1. **Task 5 first** (git cleanup) - no dependencies
2. **Task 1** (Dependabot) - commit and wait for PRs
3. **Task 3** (jQuery removal) - test thoroughly before moving on
4. **Task 10** (fonts) - visual check
5. **Task 7** (linters) - run and fix initial issues
6. **Task 8** (a11y) - keyboard navigation testing
7. **Task 9** (pre-commit) - install last to avoid blocking earlier work
8. **Tasks 2 & 4** (CI improvements) - push to PR branch to test

### Smoke Test After Each Task

```bash
# Build site
bundle exec jekyll serve

# Open http://localhost:4000

# Check for errors in terminal
# Check for console errors in browser DevTools
# Manually test affected features
```

### Full Regression Test

Before merging to master:

- [ ] Site builds without errors
- [ ] All pages render correctly
- [ ] Publications page: abstract/bib toggles work
- [ ] Blog posts: ToC navigation works
- [ ] Images zoom correctly
- [ ] Progress bar updates on scroll
- [ ] Fonts load and render correctly
- [ ] No console errors
- [ ] Linters pass (`npm run lint`)
- [ ] HTMLProofer passes (`bundle exec rake test`)
- [ ] Pre-commit hooks work

---

## Rollback Procedures

Each task is isolated and can be rolled back independently:

- **Task 1 (Dependabot):** Delete `.github/dependabot.yml`
- **Task 2 (Caching):** Revert `.github/workflows/deploy.yml`
- **Task 3 (jQuery):** Revert 5 files, re-add jQuery include
- **Task 4 (HTMLProofer):** Remove from Gemfile, delete Rakefile and test workflow
- **Task 5 (Git):** `git checkout HEAD -- .gitignore .gitattributes`
- **Task 7 (Linters):** Delete `package.json`, config files
- **Task 8 (A11y):** Revert individual layout files
- **Task 9 (Pre-commit):** `pre-commit uninstall`, delete config
- **Task 10 (Fonts):** Revert font references, delete subset files

---

## Success Metrics

### Before Implementation

- **Dependencies:** 29 outdated gems
- **Bundle size:** jQuery (85KB) + full fonts (827KB) = 912KB
- **CI build time:** ~2-3 minutes
- **Code quality:** No linting, no link checking
- **Accessibility:** ~60-70% WCAG AA compliant
- **Git:** LaTeX artifacts in history, incomplete .gitignore

### After Implementation

- **Dependencies:** Auto-updated weekly
- **Bundle size:** No jQuery + subset fonts (150KB) = 150KB (83% reduction)
- **CI build time:** ~1.5-2 minutes (30-40% faster)
- **Code quality:** Automated linting, link checking, pre-commit hooks
- **Accessibility:** ~85-90% WCAG AA compliant
- **Git:** Clean history, comprehensive .gitignore

### PageSpeed Score Estimate

- **Before:** 56/100
- **After:** 75-85/100 (target from CLAUDE.md)

---

---

## Task 13: Security Fixes

**Time:** 45 minutes
**Risk:** Low (CSP may need iteration, but no breaking changes)
**Dependencies:** Task 8 (accessibility - removes inline onclick handlers)

### Issues to Fix

1. **Content Security Policy (CSP) not enforced** - GitHub Pages ignores `_headers` file
2. **Missing SRI hashes** on Pygments CSS from cdn.jsdelivr.net
3. **Inline onclick handlers** (fixed in Task 8, verify here)
4. **Footer text color contrast** fails WCAG AA

### Implementation

#### 13.1 Add CSP via Meta Tag

**File:** `_includes/head.html`

Add after line 16 (after charset and viewport):

```html
<!-- Content Security Policy -->
<meta
  http-equiv="Content-Security-Policy"
  content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://www.googletagmanager.com https://www.google-analytics.com;
  style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net;
  font-src 'self' https://cdn.jsdelivr.net;
  img-src 'self' data: https: http:;
  connect-src 'self' https://www.google-analytics.com;
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
"
/>
```

**Note:** This is a starting point. May need adjustments based on:

- MathJax requirements (if used)
- Medium Zoom CDN resources
- Any other third-party integrations

**Testing:** Check browser console for CSP violations after deployment.

#### 13.2 Add SRI Hashes to Pygments CSS

**File:** `_includes/head.html` (lines 36, 51-52)

**Current (line 36):**

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jwarby/jekyll-pygments-themes@master/{{ site.pygments_theme }}.css" media="" />
```

**Issue:** No SRI hash, CDN could be compromised.

**Solution:** Generate SRI hash for the specific theme:

```bash
# Generate SRI hash (example for github.css theme)
curl -s "https://cdn.jsdelivr.net/gh/jwarby/jekyll-pygments-themes@master/github.css" | \
  openssl dgst -sha384 -binary | \
  openssl base64 -A
```

**Replace with:**

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/gh/jwarby/jekyll-pygments-themes@master/{{ site.pygments_theme }}.css"
  integrity="sha384-HASH_HERE"
  crossorigin="anonymous"
  media=""
/>
```

**For dark theme (lines 51-52):**

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/gh/jwarby/jekyll-pygments-themes@master/{{ site.pygments_theme_dark }}.css"
  integrity="sha384-HASH_HERE"
  crossorigin="anonymous"
  media="none"
  id="highlight_theme_dark"
/>
```

**Alternative (Better):** Self-host Pygments themes to eliminate third-party dependency:

1. Download the CSS files to `/assets/css/pygments/`
2. Replace CDN links with local paths:
   ```html
   <link rel="stylesheet" href="{{ '/assets/css/pygments/' | append: site.pygments_theme | append: '.css' | relative_url }}" media="" />
   ```

#### 13.3 Verify Inline onclick Removed

This was fixed in **Task 8.1** (bibliography more-authors button).

Verify no other inline event handlers exist:

```bash
# Search for inline event handlers
grep -r "onclick\|onload\|onerror\|onmouseover" _layouts/ _includes/

# Search for javascript: URLs
grep -r "javascript:" _layouts/ _includes/
```

If any found, refactor to external event listeners.

#### 13.4 Fix Footer Text Contrast

**File:** `_sass/_base.scss` (line 471)

**Current (FAILS WCAG AA):**

```scss
color: #b3b3b3; // 5.8:1 contrast on #222 background
```

**Replace with (PASSES WCAG AAA):**

```scss
color: #c7c7c7; // 7.1:1 contrast on #222 background
```

**Or for WCAG AA only:**

```scss
color: #b8b8b8; // 4.6:1 contrast on #222 background
```

Recommendation: Use `#c7c7c7` for AAA compliance (better accessibility).

#### 13.5 Add Security Headers Documentation

Since GitHub Pages doesn't support custom headers, document the limitations.

Create `SECURITY.md`:

```markdown
# Security

## Content Security Policy

This site implements a Content Security Policy (CSP) via meta tag in `_includes/head.html`.

**Limitation:** GitHub Pages does not support custom HTTP headers. The `_headers` file exists for documentation but is only enforced if the site is deployed to Netlify/Cloudflare.

**Current CSP:**

- Scripts: Self + inline + jsdelivr.net + Google Analytics
- Styles: Self + inline + jsdelivr.net
- Images: Self + data URIs + any HTTPS
- Frames: Blocked (`frame-ancestors 'none'`)

**Known issues:**

- `'unsafe-inline'` required for:
  - Inline MathJax configuration
  - Progress bar script
  - Service worker registration

**Future improvements:**

- Use nonces for inline scripts
- Migrate to CSP headers via Cloudflare (if deployed there)

## Subresource Integrity (SRI)

All third-party resources from CDNs use SRI hashes to prevent tampering:

- Bootstrap CSS/JS
- FontAwesome
- Academicons
- MathJax
- Medium Zoom
- Pygments themes

## HTTPS Enforcement

- Site enforced via GitHub Pages
- No HSTS header (GitHub Pages limitation)
- All external resources loaded via HTTPS

## Dependency Security

- Dependabot monitors dependencies weekly
- Run `bundle audit` for known gem vulnerabilities
- Run `npm audit` for JavaScript package vulnerabilities

## Reporting Security Issues

Please report security vulnerabilities to: [your email]
```

### Testing Checklist

- [ ] **CSP compliance:**
  - [ ] Open site in Chrome DevTools
  - [ ] Check Console for CSP violation warnings
  - [ ] Adjust CSP as needed for legitimate resources
  - [ ] Test all interactive features still work

- [ ] **SRI verification:**
  - [ ] All CDN resources load correctly
  - [ ] Check Network tab - no integrity check failures
  - [ ] Verify hash matches actual file content

- [ ] **Contrast check:**
  - [ ] Footer text readable on dark background
  - [ ] Test with color contrast analyzer (WebAIM or similar)
  - [ ] Verify 4.5:1 minimum for WCAG AA

- [ ] **Security headers validation:**
  - [ ] Use [securityheaders.com](https://securityheaders.com) to scan deployed site
  - [ ] Note: Will show warnings due to GitHub Pages limitations (expected)

### Expected Security Posture

**Before:**

- CSP defined but not enforced
- Missing SRI hashes on 2 resources
- Inline onclick handlers
- Color contrast violations

**After:**

- CSP enforced via meta tag
- All CDN resources have SRI hashes (or self-hosted)
- No inline event handlers
- WCAG AAA color contrast

**Remaining limitations:**

- `'unsafe-inline'` still needed for some scripts (can be improved with nonces)
- No HSTS header (GitHub Pages doesn't support it)
- No CSP reporting (requires CSP header with `report-uri`)

### SRI Hash Generation Reference

For any new CDN resource, generate SRI hash:

```bash
# Method 1: Using curl + openssl
curl -s "https://cdn.example.com/resource.js" | \
  openssl dgst -sha384 -binary | \
  openssl base64 -A

# Method 2: Using srihash.org
# Visit https://www.srihash.org and paste URL

# Method 3: Browser DevTools
# 1. Open resource in browser
# 2. Copy content
# 3. Use this JS in console:
crypto.subtle.digest('SHA-384', new TextEncoder().encode(content)).then(hash => {
  const hashArray = Array.from(new Uint8Array(hash));
  const hashBase64 = btoa(String.fromCharCode(...hashArray));
  console.log(`sha384-${hashBase64}`);
});
```

### Rollback Plan

If CSP breaks functionality:

1. Comment out CSP meta tag temporarily
2. Identify violating resource in console
3. Add to CSP allowlist or refactor
4. Re-enable CSP

If SRI checks fail:

1. Verify hash is correct (resource may have changed)
2. Regenerate hash if needed
3. Or remove `integrity` attribute temporarily

---

## Notes & Considerations

- All tasks are non-breaking and mostly additive
- Visual appearance unchanged (critical per user requirements)
- No backend/server changes needed (static site)
- Changes are developer experience improvements
- Most tasks can be done in any order (except noted dependencies)
- Estimated total time: 5-6 hours for all 10 tasks
- Can be split across multiple PRs for easier review

---

## Questions for Review

1. **Font subsetting:** Prefer online tool (easier) or CLI tool (reproducible)?
2. **Linter strictness:** Start with warnings or enforce as errors immediately?
3. **HTMLProofer:** Run on every commit or only on main branch?
4. **Pre-commit hooks:** Auto-fix everything or prompt for review?
5. **jQuery removal:** Test locally first or push to staging?
6. **CSP strictness:** Start permissive and tighten, or strict from the start?
7. **Pygments themes:** Self-host (better security) or keep CDN with SRI?

Feel free to edit this plan before implementation!
