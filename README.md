# S.K. Agro Tourism & Hotel — Static Site Scaffold

This repository contains a polished static-site scaffold built to present S.K. Agro Tourism & Hotel with a premium editorial design and smooth storytelling interactions.

Files added:
- `index.html` — photography-first editorial layout referencing uploaded photos.
- `css/style.css` — updated editorial design system, spacing and responsive rules.
- `js/main.js` — GSAP/ScrollTrigger interactions: cinematic hero, scroll transition, lightbox.
- `assets/photos/` — your uploaded photos are used directly by the layout.

How to use:
1. The redesign already uses the photos you uploaded under `assets/photos/`.

Used images (primary references in the layout):
- `assets/photos/WhatsApp Image 2026-08-21 at 3.19.47 PM.jpeg` — hero / primary garden image
- `assets/photos/WhatsApp Image 2026-08-21 at 3.19.43 PM.jpeg` — property wide / tent
- `assets/photos/WhatsApp Image 2026-08-21 at 3.19.46 PM.jpeg` — water feature
- `assets/photos/WhatsApp Image 2026-08-21 at 3.20.01 PM.jpeg` — camping tents
- `assets/photos/WhatsApp Image 2026-08-21 at 3.20.15 PM.jpeg` — room interior

If you'd like different primary images, either rename your preferred files to match the names above, or update the `src` attributes in `index.html`.
2. Serve the folder with any static server. Example:

```bash
# from project root
python3 -m http.server 8000
# then visit http://localhost:8000
```

Accessibility & performance notes:
- The scaffold respects `prefers-reduced-motion`.
- Images use `loading="lazy"` by default (except hero which is eager). Replace with responsive `srcset` images for better performance.

Next recommended steps:
- Provide property photography and replace placeholders in `assets/`.
- Provide verified review snippets and contact channels for footer/structured data.
- Replace `canonical`/OG image URL with production URL.
