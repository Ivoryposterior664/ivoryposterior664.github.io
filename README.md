# Photography Gallery — plain HTML site (no build step)

This site has **no build process**. GitHub Pages will just serve these files
exactly as they are — no Jekyll, no Actions build, nothing that can get stuck
or fail to compile. That's what the `.nojekyll` file does: it tells GitHub
Pages to skip processing entirely and just publish the files as-is.

## Deploying (same as before)

1. Create a repo on GitHub named `your-username.github.io`
2. Upload every file in this folder (not the folder itself — its contents:
   `index.html`, `.nojekyll`, `assets/`) to the repo
3. Settings → Pages → Source: "Deploy from a branch" → `main` → `/ (root)` → Save
4. Visit `https://your-username.github.io`

Because there's no build, once you commit a change it's usually live within
seconds of the page finishing its (very short) deploy — no more watching a
yellow dot.

## Editing

Everything lives in **one file**: `index.html`. Open it, click the pencil
icon, edit, commit. There's no template language, no `_config.yml`, no
separate data file — what you see in the file is exactly what renders.

### Change the name / heading / subheading

Near the top, inside `<header class="site-head">`:
```html
<h1>Your Name</h1>
<p>A collection of photographs — portraits, streets, and landscapes.</p>
```
Also update the `<title>` tag near the very top of the file (controls the
browser tab text), and the `mailto:` link and copyright name in the
`<footer>` at the bottom.

### Add a photo

Each photo is one `<figure>` block inside `<main class="grid" id="grid">`.
Copy an existing block and edit it:
```html
<figure class="photo" data-tags="portrait, travel, color">
  <img src="YOUR-IMAGE-URL" data-full="YOUR-LARGER-IMAGE-URL" alt="Short description">
  <figcaption class="photo__tags">portrait · travel · color</figcaption>
</figure>
```
- `data-tags` — comma-separated tags. These automatically become filter
  buttons in the side panel — no extra step needed.
- `src` — the thumbnail shown in the grid (can be a smaller image for speed)
- `data-full` — the larger image shown when someone clicks it open in the
  lightbox (can be the same URL as `src` if you don't have a bigger version)
- `figcaption` text is just what's shown on hover — keep it matching the tags,
  or leave it off if you don't want that hover label

### Upload your own photo files (instead of placeholder URLs)

1. In the repo, go into `assets` → **Add file → Upload files** → create/upload
   into a new `images` folder
2. In your `<figure>` block, set `src="assets/images/yourfile.jpg"`

### Remove a photo

Delete its whole `<figure>...</figure>` block.

## How the pieces work (so nothing feels like magic)

- **Grid + hover-enlarge** — pure CSS Grid. Every photo normally takes up a
  4×4 block of a fine grid; on hover it becomes 8×8, and the grid
  automatically reflows the rest around it (`grid-auto-flow: dense` in
  `assets/css/main.css`).
- **Tag filter word cloud** — `assets/js/main.js` scans every photo's
  `data-tags` on page load, counts how often each tag appears, and builds a
  button for each one — sized bigger the more often it's used. Click a tag to
  show only matching photos; click it again to remove the filter.
- **Lightbox** — same script tracks whichever photos are currently visible
  (respecting the active filter) so the ‹ › arrows and arrow keys move
  correctly through just the filtered set.

## File map

```
index.html          everything — heading, grid, filters, lightbox, footer
assets/css/main.css  all styling
assets/js/main.js    filter + lightbox behavior
.nojekyll            tells GitHub Pages not to run a build
```
