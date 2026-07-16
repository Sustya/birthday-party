# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

A static birthday party invitation webpage (in Russian) for three people: Masha, Nastya, and Seryozha. The party is on September 19, 2026 in Amsterdam. No build step, no dependencies, no server — open `index.html` directly in a browser.

## Running the site

```bash
open index.html        # macOS
python3 -m http.server # or serve via local HTTP to avoid CORS issues with mask images
```

## Architecture

**Three files do everything:**

- `data.js` — party content (title, date, section text). Loaded before `script.js`; exposes a single `invitationData` global object. Edit this to change event details.
- `script.js` — all interactivity. On `DOMContentLoaded`, populates dynamic fields from `invitationData`, then calls `initTVAnimation()`. That function drives:
  - Scroll-based slide switching inside the TV frame (5 slides mapped to `400vh` of scroll distance via `IntersectionObserver` + scroll progress math)
  - TV/decor appearance animations toggled via `.visible` CSS classes
  - Menu button clicks that programmatically scroll to a target slide
- `style.css` — layout and theming. Uses CSS custom properties (`--pixel-font`, `--display-font`, `--body-font`) and container queries (`cqh`) for font scaling inside the TV screen.

**TV frame technique:** `.tv__masked-screen` uses a PNG mask (`images/tv_screen.png`) to clip content to the screen shape. Content lives inside `.tv__content-safe-area > .tv-content`, inset 16–18% from the TV container edges. The CRT effect is pure CSS (scanlines via `linear-gradient` + `static_noise.png` animation).

**Scroll animation:** `.tv-scroll-section` is `400vh` tall with a sticky child (`.tv-sticky`). As the user scrolls through those 400vh, `updateTvScroll()` maps scroll progress [0–1] to one of 5 equal segments, showing the corresponding `.tv-slide`. Menu buttons jump to the midpoint of a slide's scroll segment.

**Font stack:** Silkscreen (pixel/channel labels), Russo One (headings), Montserrat (body). Loaded from Google Fonts.

## Content edits

All party details (date, location, program) are in `data.js`. The HTML slides in `index.html` currently contain their own inline text — `data.js` is only partially wired up (page title and date field). If adding new sections or changing slide content, edit both `index.html` and `data.js` to keep them in sync.

## Images

All assets live in `images/`. Key files:
- `tv_frame.png` — decorative TV border overlay
- `tv_screen.png` — PNG mask that clips content to the screen shape
- `header_subheader.png` — main title image
- `futurist-texture-wallpaper.jpg` — fixed background
- `static_noise.png` — animated CRT noise texture
- `random.png`, `random_2/3/4.png` — decorative corner stickers
