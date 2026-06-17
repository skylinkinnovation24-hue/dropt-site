# Dropt — Marketing Website

Production build of the **Dropt** site (hyperlocal quick-commerce
infrastructure for fashion brands), recreated pixel-faithfully from the
Claude Design handoff.

## Stack & rationale

A **static multi-page site** — semantic HTML, one shared design-system
stylesheet, and a small vanilla-JS module. For a marketing site this is
the right call: zero build step, instant loads, deploys to any static
host (Netlify, Vercel, S3/CloudFront, GitHub Pages), and nothing to
patch or keep secure. No framework runtime needed for content + a few
interactions.

## Pages

| File | Page |
|------|------|
| `index.html` | Home |
| `how-it-works.html` | How It Works (animated eligibility check) |
| `pricing.html` | Pricing (savings calculator) |
| `for-brands.html` | For Brands (phone PDP mock + ops dashboard) |
| `for-riders.html` | For Riders |
| `about.html` | About |
| `pilot.html` | Pilot application (validated form) |
| `blog.html` | Blog |

## Shared assets

- `assets/css/styles.css` — design tokens + every component style.
- `assets/js/app.js` — core behaviour: **cursor heat-map glow**, sticky
  nav, parallax orbs, reveal-on-scroll, animated counters.
- `assets/js/footer.js` — single source of truth for the footer,
  injected into every page.

Page-specific widgets (engine selector, journey timeline, eligibility
sequence, pricing calculator, PDP tier picker, delivery heatmap, pilot
form) live in each page's own inline `<script>` and reuse the helpers on
`window.Dropt`.

## Signature animation

The cursor "heat map" is a fixed radial bloom that trails the pointer
with an eased lerp (factor `0.1`) so it *flows* rather than snaps — see
`initGlow()` in `app.js`. It respects `prefers-reduced-motion`.

## Run locally

Any static server works. A dependency-free PowerShell server is
included:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .claude/serve.ps1
# → http://localhost:4173/
```

Or open `index.html` directly in a browser.

## Notes

- Fonts: Space Grotesk, DM Sans, JetBrains Mono (Google Fonts).
- Fully responsive (desktop → tablet → mobile breakpoints).
- The pilot form validates client-side and shows a success state; wire
  its submit handler to your backend/CRM before going live.
