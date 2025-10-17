# Copilot Instructions for Troy Group Website

## Project Overview
- This is a static website project with the following structure:
  - `index.html`, `test.html`: Main HTML entry points.
  - `assets/`: Contains `main.js` (JavaScript), `style.css` (CSS), and subfolders for `fonts/` and `images/`.
  - `Components/`: Contains reusable HTML fragments like `header.html` and `footer.html`.

## Key Patterns & Conventions
- **Component Inclusion:**
  - Common page sections (header, footer) are split into separate HTML files in `Components/`.
  - Inclusion is likely handled via JavaScript (see `assets/main.js`).
- **Styling:**
  - All global styles are in `assets/style.css`.
  - Use class-based selectors for new styles; avoid inline styles.
- **Assets:**
  - Place images in `assets/images/` and fonts in `assets/fonts/`.
  - Reference assets with relative paths from HTML or CSS.

## Developer Workflow
- No build system or package manager is present; this is a pure static site.
- To test changes, open `index.html` or `test.html` directly in a browser.
- For JavaScript or CSS changes, refresh the browser to see updates.
- No automated tests or CI/CD are configured.

## Integration Points
- No external dependencies or frameworks are detected.
- If you add new libraries, document them in this file and update asset references accordingly.

## Examples
- To add a new section to all pages:
  1. Create a new HTML fragment in `Components/` (e.g., `sidebar.html`).
  2. Update `assets/main.js` to inject the fragment where needed.
- To add a new image:
  1. Place the image in `assets/images/`.
  2. Reference it in HTML or CSS using a relative path (e.g., `assets/images/logo.png`).

## File Reference
- `index.html`, `test.html`: Main pages
- `assets/main.js`: Handles dynamic behaviors and component injection
- `assets/style.css`: All site-wide styles
- `Components/`: HTML fragments for reuse

---
If you introduce new conventions or workflows, update this file to keep AI agents productive.
