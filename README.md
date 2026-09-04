# TTS Slides — V6 Reference-Style Edition

V6 changes the creative system from loose prompt presets into reference-driven production systems based on the user's Google Drive examples.

## What V6 changes

- Reference Style is now the PRIMARY campaign control.
- Each reference style controls:
  - default slide count
  - slide-type flow
  - copy rhythm / text density
  - character/photo treatment
  - text renderer
  - composition/layout exceptions
- Representative user-provided reference images are bundled under `public/reference-styles/` and are used only on appropriate visual slide types as high-level composition/style references.
- Image prompts explicitly tell the image model to ignore all reference text, products, logos, exact people/scenes, and copyrighted character designs.
- Exact overlay text is still rendered programmatically after generation.
- Reference Style Character mode lets each preset determine whether it needs a clean cartoon creator, original adult-animation-inspired cast, realistic UGC creator, or no recurring person.

## Reference systems

The Drive root contained nine named folders (two different folders are both named as Style 3 variants), so V6 preserves all nine rather than dropping one:

1. Style 1 — Cartoon Signs → UGC
2. Style 2 — Animated Education
3. Style 3 — Two-Character Social Dialogue
4. Style 3B — Realistic Editorial Macro
5. Style 4 — Clean Animated Signs
6. Style 5 — Realistic Problem Cover
7. Style 6 — Two-Slide Fashion
8. Style 7 — Problem → Solution
9. Style 8 — Mobile Chat Story

## New special renderers

- Editorial serif problem copy with colored numbered emphasis
- Editorial emphasis hooks with black + red/burgundy hierarchy
- White product pill labels
- Speaker-separated outlined dialogue copy
- Blue italic fashion headline treatment
- Generic mobile-chat UI built programmatically (not branded as Snapchat)
- Problem/Solution split labels + red arrow

## Generation rules

- Default final ratio: 3:4
- One complete scene per slide by default
- Reference-specific layout exceptions only:
  - Style 5 cover: controlled 2×2 issue montage
  - Style 7 opener: controlled vertical problem/solution split
  - Style 8 opener: one generic chat screen with one embedded UGC photo
- The image model is told to generate NO text; exact copy is added afterward.
- Product-visible slides use the saved SocialVault product references as packaging source of truth.
- Style reference images are used only for high-level composition/treatment and never as product/identity source of truth.

## Deployment

Upload the CONTENTS of this folder to the root of the existing GitHub repository and commit to `main`.

Important:
- `proxy.js` should exist.
- `middleware.js` should NOT exist.
- Keep your existing Vercel environment variables and Blob connection.
- No custom Vercel start command is required.

Environment variables:
- `OPENAI_API_KEY`
- `SOCIAVAULT_API_KEY`
- `OPENAI_TEXT_MODEL=gpt-5.6-sol`
- `OPENAI_IMAGE_MODEL=gpt-image-2`

Vercel Blob remains the persistent store.
