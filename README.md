# Carousel Factory — Vercel Edition (Phase 1)

This is the Vercel-native replacement for the earlier Streamlit/Railway build.

## What changed

The earlier app used Streamlit + SQLite + local files. That is a good fit for a long-running Python host such as Railway, but not the deployment model requested here.

This build uses:

- Next.js UI and API routes (native on Vercel)
- SocialVault TikTok Shop Product Details importer
- OpenAI GPT-5.6 Sol for concepts, slide plans, and captions
- GPT Image 2 for image generation/editing
- Vercel Blob for persistent product references, campaign JSON, generated images, and exports
- Sharp for exact text overlays after image generation
- Optional Basic Auth for a private VA-facing app

## Deploy to Vercel — no terminal/start command needed

### 1. Put this folder in a private GitHub repository

Upload the contents of this folder to the root of a new private repo. `package.json` must be visible at the repo root.

### 2. Import the repo in Vercel

Vercel → Add New → Project → Import the GitHub repository.

Vercel should detect **Next.js** automatically.

Do **not** add a custom Build Command, Output Directory, or Start Command. Leave those on the Vercel defaults.

### 3. Add Environment Variables

In Vercel → Project → Settings → Environment Variables add:

- `OPENAI_API_KEY` = your OpenAI API key
- `SOCIAVAULT_API_KEY` = your SocialVault API key
- `OPENAI_TEXT_MODEL` = `gpt-5.6-sol`
- `OPENAI_IMAGE_MODEL` = `gpt-image-2`

Optional app password:

- `APP_USER` = a username you choose
- `APP_PASSWORD` = a password you choose

If both are set, the site and API are protected by browser Basic Auth.

### 4. Create Vercel Blob storage

In the same Vercel project:

**Storage → Create Database / Store → Blob**

Choose **Public** access and connect it to this project. The current app stores generated/reference image URLs directly, so public Blob is required by this Phase 1 build.

Vercel supplies the Blob credentials/store identity to the project when connected.

### 5. Deploy

Click **Deploy**.

There is no `streamlit run ...`, no `$PORT`, no Railway volume, and no custom start command in this version.

## App workflow

1. Products
   - Paste TikTok Shop product URL
   - SocialVault pulls official title/details/listing photos
   - Select only the product images you want
   - Add audience / approved claims / prohibited claims
   - Save product

2. Campaign Builder
   - Select product
   - Choose Casual UGC / Illustrated Carousel / Product UGC / Mixed Story
   - Default aspect ratio is 3:4
   - Generate 5 scored concepts
   - Pick one
   - Generate 5–8 slide plan
   - Edit every slide before image generation

3. Generate & Review
   - Generate/regenerate one slide at a time
   - Product-visible slides use saved real product reference images
   - Edit exact headline independently
   - `Text only` re-renders the text without another image-generation call
   - Upload your own replacement image if desired

4. Export
   - Generate/edit caption
   - Download a ZIP containing completed PNG slides, caption.txt, campaign.json, and slide_plan.csv

## Notes

- Product and campaign records are stored as JSON in Vercel Blob in this Phase 1 build. Their paths use random UUIDs, but a **Public** Blob store means anyone with an exact Blob URL can access that object. For a stricter production/private-data setup, move record metadata to Postgres/Neon and keep media in Blob/private object storage.
- GPT Image 2 may require OpenAI organization verification depending on your API account.
- If Vercel says Blob is not connected, create/connect the store and redeploy.
