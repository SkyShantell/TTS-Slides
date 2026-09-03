# TTS Slides / Carousel Factory — Skill Engine V5

This V5 keeps the Vercel-native Phase 1 infrastructure but replaces the generic campaign brain with the user's original `tiktok-product-slides.skill` creative system.

## What V5 changes

### Original creative system is now primary

The Campaign Builder now uses:

- Master A — Signs & Solution
- Master B — Social Story + Product
- Master C — Skincare Education
- Gadget / Tool Story
- Story Hybrid (original slide system + secondary Greymike-style angle)
- Auto — Pick Best

The app no longer treats generic Greymike-style skeletons as the main deck architecture. They are secondary angle mechanisms only.

### Slide types are explicit

Each planned slide now receives a source-system type such as:

- N1 Character Hook
- N2 Problem Character
- N3A Problem Dialogue Scene
- N3B Resolution Dialogue Scene
- N3C Continuous Scene Sequence
- N4 Feature Product Shot
- N5 Ingredient / Feature Reveal
- N6 UGC Hold & Tell
- N7 How-To / Routine
- N8 CTA Product Closer
- N10 Social Proof / Fact
- N11 Secret Tip

The older 4-panel/grid types are intentionally not defaulted because the current project rule is one complete scene per slide / no collage.

### Dani system restored

Dani is available as the default character preset with:

- locked identity description
- expression IDs E1–E6
- pose IDs P1–P6
- flat/cel, editorial, original animated-dialogue and premium-3D rendering directions

Custom recurring character and no-character modes are also available.

### Copy system restored

Slides can use:

- Type 1 — Editorial Problem
- Type 2 — Hook Keyword (deep burgundy editorial emphasis)
- Type 3 — White Pill Box
- Type 4 — Raw White Outline
- Type 5 — Product/Variant Label

The exact-text renderer now changes typography based on that copy style instead of applying the same white headline treatment to every slide.

### Old dataset habits are gated rather than blindly hard-coded

The app does NOT automatically invent or force:

- “they taste like sweets”
- flavor ratings
- sale/free shipping
- fake urgency
- reviews/statistics
- “combine with a healthy lifestyle”

Those are only used when supported by the listing/user input or when the user explicitly asks.

## Existing Phase 1 features retained

- SocialVault TikTok Shop importer
- manual product-reference selection
- product library
- GPT structured concept + slide planning
- GPT Image product-reference generation
- exact post-generation text rendering
- per-slide regenerate
- text-only re-render
- upload replacement image
- Vercel Blob persistence
- unique/versioned Blob filenames (no overwrite collision dependency)
- dedupe latest product/campaign record by ID
- campaign ZIP export
- 3:4 default, plus 9:16 and 4:5

## Deploy / update existing Vercel project

Use the SAME GitHub repo and SAME Vercel project.

1. Replace the repo contents with the contents of this V5 folder.
2. Important: root should contain `proxy.js` and MUST NOT contain `middleware.js`.
3. Commit/push to `main`.
4. Vercel will redeploy automatically.

Keep existing environment variables / Blob connection:

- `OPENAI_API_KEY`
- `SOCIAVAULT_API_KEY`
- `OPENAI_TEXT_MODEL`
- `OPENAI_IMAGE_MODEL`
- Vercel Blob connection / token

No custom Start Command is needed.

## Suggested first test

Use the same Beet Root product that exposed the weak generic campaign issue.

In Campaign Builder:

- Deck formula: `Master A — Signs & Solution`
- Visual style: `Mixed Illustrated + UGC`
- Character: `Dani — Original Skill Default` (or No Recurring Character if not appropriate)
- Aspect: `3:4`
- Slides: `8`

Generate concepts, pick one, and inspect the resulting slide plan BEFORE generating images. The plan should now visibly alternate between character/problem slide types and later real-product UGC types rather than producing generic buyer-guide concepts.
