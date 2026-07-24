# Hadi_X_Hacker — Cyber Security Portfolio

Personal cyber security portfolio for Muhammad Usman, built with plain HTML, CSS and JavaScript (no frameworks).

## Structure
- `index.html` — all page content and sections
- `style.css` — design system and styling
- `script.js` — all interactivity (loader, canvas backgrounds, terminal, forms, GitHub API, etc.)
- `assets/` — profile photo, certificate images, generated resume PDF, favicon
- `manifest.json`, `robots.txt`, `sitemap.xml`, `404.html`, `vercel.json`

## Deploy on Vercel
1. Push this folder to a GitHub repository.
2. Import the repo on vercel.com → Deploy (no build step needed, it's static).
3. Update `sitemap.xml` / meta `og:url` if you use a different domain than `hadixhacker.vercel.app`.

## Notes
- Contact form opens the visitor's email client with a pre-filled message (no backend required).
- GitHub section pulls live data from the public GitHub API for `usman2559`.
- Visitor counter is stored in `localStorage` (per-browser, not a global count).
