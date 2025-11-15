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
  - Deferred CSS loading handlers

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
- Pygments themes (github.css, native.css)
- MDB (Material Design Bootstrap)

## HTTPS Enforcement

- Site enforced via GitHub Pages
- No HSTS header (GitHub Pages limitation)
- All external resources loaded via HTTPS

## Dependency Security

- Dependabot monitors dependencies weekly
- Run `bundle audit` for known gem vulnerabilities
- Run `npm audit` for JavaScript package vulnerabilities (if using npm)

## Accessibility & Security

- No inline `onclick` handlers (except legitimate `onload`/`onerror` for performance/fallback)
- WCAG AAA color contrast compliance for footer text (7.1:1 contrast ratio)
- External links use `rel="external nofollow noopener"` to prevent tabnabbing

## Reporting Security Issues

Please report security vulnerabilities to: yoonho@cs.stanford.edu

Do not create public GitHub issues for security vulnerabilities.
