# Railway-only YouTube Niche Finder adapter

This isolated branch contains a Docker build wrapper for the MIT-licensed [pandich93/youtube-niche-finder](https://github.com/pandich93/youtube-niche-finder).

The upstream `backend/Dockerfile` has a `VOLUME` instruction rejected by Railway; this adapter builds the upstream repository at a fixed commit instead and packages its `frontend/` directory.

Use the same build for web (`SERVICE_ROLE=web`), collector (`SERVICE_ROLE=worker`) and MCP (`SERVICE_ROLE=mcp`).
Do not merge this branch into the unrelated repository's `main` branch. The adapter source is under `.deploy/niche-finder` only.
