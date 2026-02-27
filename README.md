# Wallpapers

A minimal, fast, free-to-host mobile wallpaper gallery.

**Stack:** Astro + Tailwind CSS (static site) · Deployed on Cloudflare Pages · Images served via jsDelivr CDN.

---

## Quick start

```bash
npm install
npm run dev          # local dev server at localhost:4321
```

## Adding wallpapers

### 1. Drop originals

Put your full-resolution photos into:

```
public/images/originals/
```

Supported formats: `.jpg`, `.jpeg`, `.png`, `.webp`, `.tiff`.

### 2. Process images

```bash
npm run add-images
```

This generates:
- **Optimized WebP** at 480 / 720 / 1080 px wide → `public/images/{480,720,1080}/`
- **LQIP placeholders** (tiny base64 images) embedded in metadata
- **Dominant colour** for each image
- **`src/data/metadata.json`** — the single source of truth for the gallery

### 3. Edit metadata (optional)

Open `src/data/metadata.json` and edit:
- `title` — display name
- `tags` — array of strings for filtering (e.g. `["nature", "sunset"]`)
- `createdAt` — date string

Re-running `npm run add-images` preserves your manual edits to `title`, `tags`, and `createdAt`.

### 4. Preview & deploy

```bash
npm run dev       # preview locally
npm run build     # generate static site in dist/
```

---

## Configuration

Edit **`src/config.ts`**:

| Field | Purpose |
|---|---|
| `title` | Site name shown in header |
| `description` | Default meta description |
| `siteUrl` | Your production URL (used for SEO & sitemap) |
| `github.user` | Your GitHub username |
| `github.repo` | Repo name |
| `github.branch` | Branch (usually `main`) |

Also update `site` in **`astro.config.mjs`** to match your production URL.

Update the `Sitemap` line in **`public/robots.txt`** too.

---

## Deploy to Cloudflare Pages

### First time

1. Push your repo to GitHub.
2. Go to [Cloudflare Pages](https://dash.cloudflare.com/?to=/:account/pages).
3. **Create a project** → Connect to your GitHub repo.
4. Build settings:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Node.js version:** `20` (set in Environment Variables: `NODE_VERSION` = `20`)
5. Deploy.

### Ongoing

Every push to `main` triggers a new deploy automatically.

### Custom domain

In the Cloudflare Pages dashboard → Custom domains → Add your domain.

---

## Automated image processing (CI)

The repo includes `.github/workflows/process-images.yml`. When you push new originals to `public/images/originals/`, GitHub Actions will:

1. Run `npm run process`
2. Commit the generated optimized images + metadata
3. Push → triggers Cloudflare Pages deploy

This means you can **upload images via GitHub's web UI** and everything is automatic.

---

## How jsDelivr works

The "Download Original" button fetches from:

```
https://cdn.jsdelivr.net/gh/{user}/{repo}@{branch}/public/images/originals/{file}
```

jsDelivr is a free, fast CDN for public GitHub repos. No setup needed — it just works once your repo is public.

For display, optimized images are served directly from Cloudflare Pages (also a CDN).

---

## Image sizes & performance

| Size | Usage |
|---|---|
| **480w** | Mobile thumbnails (2-col grid) |
| **720w** | Tablet / 3-col grid |
| **1080w** | Viewer modal / desktop / photo page |
| **Original** | Download only (via jsDelivr) |

Additional performance features:
- **Lazy loading** — images load as you scroll (`loading="lazy"`)
- **LQIP** — dominant colour placeholder shown instantly; tiny blurred image baked into metadata
- **Responsive `srcset`** — browser picks the optimal size
- **Immutable caching** — `Cache-Control: max-age=31536000, immutable` on all assets
- **Static HTML** — zero server-side rendering, instant TTFB

---

## Project structure

```
public/
  images/
    originals/        ← your high-res photos (source of truth)
    480/              ← generated
    720/              ← generated
    1080/             ← generated
  favicon.svg
  robots.txt
  _headers            ← Cloudflare cache rules
src/
  config.ts           ← site settings
  data/metadata.json  ← generated image catalogue
  layouts/Layout.astro
  components/
    Header.astro
    Footer.astro
    Gallery.astro
    SEO.astro
  pages/
    index.astro       ← gallery + viewer modal
    license.astro
    p/[id].astro      ← individual photo page (SEO)
  styles/global.css
scripts/
  process-images.mjs  ← image optimization script
```

---

## Features

- **Light / Dark mode** with system preference detection and toggle
- **Gallery** with masonry-like grid, search, tag filters
- **Full-screen viewer** with swipe navigation, keyboard support
- **Download** original quality via jsDelivr (cross-origin blob download)
- **Share** via Web Share API (mobile) or clipboard fallback
- **SEO** — Open Graph tags, per-photo meta, sitemap.xml, robots.txt
- **Zero JavaScript frameworks** — pure Astro + vanilla JS (~5 KB total client JS)

---

## Troubleshooting

**Images not showing after `npm run add-images`:**
- Check that originals are in `public/images/originals/`
- Ensure file extensions are `.jpg`, `.jpeg`, `.png`, `.webp`, or `.tiff`
- Check `src/data/metadata.json` was generated

**Download button opens image in browser instead of downloading:**
- This happens if jsDelivr CORS is blocked. The fallback opens the image in a new tab — users can long-press (mobile) or right-click Save As (desktop).
- Ensure your GitHub repo is **public** (jsDelivr only works with public repos).

**Build fails with "No images" error:**
- The site builds fine with zero images. Check `src/data/metadata.json` exists (even if empty).

**Cloudflare Pages build fails:**
- Set `NODE_VERSION` environment variable to `20` in Cloudflare Pages settings.
- Ensure `npm ci` can install `sharp` — Cloudflare's build image supports it natively.

**Dark mode flickers on load:**
- The inline theme script in `Layout.astro` prevents this. If it flickers, check that the script is in `<head>` and uses `is:inline`.
