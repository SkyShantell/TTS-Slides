# Carousel Factory — Vercel Edition (Phase 1, v3)

## v3 fixes
- Fixed Vercel Blob regeneration/update failures by enabling overwrite for deterministic product/campaign/slide paths.
- Replaced the generic Phase 1 skeletons with the 10 stronger Greymike-style story categories: Delayed Recognition, Signs You, What Stopped Happening, Nobody Talks About, Things That Changed, POV You Finally, This Helped Me, Wrong Way/Shortcut, Hidden Value, and Judgment Game.
- Hard-banned the bland concept types that appeared in the first deployed build (generic buyer checklists, label-reading, format explainers, corporate wellness copy) unless explicitly requested.
- Keeps the v2 Creative Direction field, setup diagnostics, clearer image errors, and exact 3:4 rendering.

## Updating the existing Vercel project
Replace the files in the existing GitHub repository with this folder and commit to `main`. Do not create a new Vercel project. Keep the existing environment variables and Blob connection. Vercel will redeploy automatically.
