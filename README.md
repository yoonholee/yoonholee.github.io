## Academic Jekyll Website

This website includes enhanced blog features for academic writing.

### Running Locally

```bash
bundle exec jekyll serve
```

### Blog Features

#### Automatic Table of Contents (ToC) with Scrollspy

- Automatically generates a table of contents for blog posts with H2 and H3 headings
- Sticky sidebar navigation with active section highlighting
- Uses IntersectionObserver API for performant scrollspy functionality
- Responsive design: shows as sidebar on desktop, collapses to header on mobile

#### Tufte-Style Sidenotes

Blog posts support Tufte-style sidenotes that appear in the margin on desktop and are toggleable on mobile.

**Usage:**

```html
<p>
  Your main text here.<label for="sn-unique-id" class="sidenote-toggle-label">⊕</label>
  <input type="checkbox" id="sn-unique-id" class="sidenote-toggle" />
  <span class="sidenote">Your sidenote content here.</span>
  Rest of your text.
</p>
```

**Features:**

- Desktop: Notes appear in right margin alongside relevant text
- Mobile: Notes are hidden by default, click ⊕ symbol to toggle visibility
- CSS-only implementation using checkbox hack for mobile toggling
- Responsive design that adapts to screen size
