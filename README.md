# Sobia Akbar — Portfolio

Personal portfolio of Sobia Akbar, Senior Android Engineer. Live at **https://thesobiaakbar.github.io/**

## Folder structure

```
.
├── index.html                      # the whole page
├── assets/
│   ├── css/style.css               # design tokens + all styling
│   ├── js/main.js                  # theme toggle, mobile nav, filters, popup, scroll effects
│   └── img/projects/<slug>.jpg     # one cover per project, 1200×900 JPEG
├── .github/workflows/deploy.yml    # publishes to GitHub Pages on every push to main
├── .nojekyll                       # serve files as-is
├── README.md
└── LICENSE
```

## Run locally

```bash
python -m http.server 8000
```

Then open http://localhost:8000 (or just double-click `index.html`).

## Edit

- **Text and links** → `index.html`
- **Add a project** → copy one `<article class="project-card">` block in `index.html`, add a 1200×900 image to `assets/img/projects/`, and set `data-tags` to match a filter chip (`ai`, `productivity`, `media`, `fullstack`).
- **Colours** → the CSS variables at the top of `assets/css/style.css` (teal `--accent`, coral `--accent-2`).

## Publishing

Repository → **Settings → Pages → Build and deployment → Source: GitHub Actions**. Every push to `main` redeploys the site.
