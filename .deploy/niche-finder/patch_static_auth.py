"""Railway hotfix: do not check DB session for public static assets.

The upstream server serves its frontend from the same ASGI process as its API.
With NF_MULTI_USER=1, dozens of simultaneous JS/module requests otherwise
trigger concurrent AUTH.session_for_token DB queries and exhaust the
20-connection psycopg2 pool. Only /api/* needs authenticated user context.
This patch does not bypass authentication for any API endpoint.
"""
from pathlib import Path

path = Path("/opt/youtube-niche-finder/backend/interfaces/http/api.py")
source = path.read_text(encoding="utf-8")
old = '''async def session_guard(request, call_next):
    request.state.user = request.state.session_id = request.state.impersonation = None
    if not multi_user_enabled():'''
new = '''async def session_guard(request, call_next):
    request.state.user = request.state.session_id = request.state.impersonation = None
    # Frontend assets, legal pages and other non-API routes are public.
    # Skip the database lookup for each CSS/JS file; only API routes need it.
    if not request.url.path.startswith("/api/"):
        request.state.user_id = None
        return await call_next(request)
    if not multi_user_enabled():'''
assert source.count(old) == 1, "Upstream changed: review session_guard before applying patch"
path.write_text(source.replace(old, new, 1), encoding="utf-8")
print("Patched static file requests: skip session DB lookup for non-API routes")
