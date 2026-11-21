#!/bin/sh
set -eu
case "${SERVICE_ROLE:-web}" in
  web)
    if [ -n "${NF_ADMIN_EMAIL:-}" ] && [ -n "${NF_BOOTSTRAP_PASSWORD:-}" ]; then
      if printf '%s\n' "$NF_BOOTSTRAP_PASSWORD" | python cli.py create-user "$NF_ADMIN_EMAIL" --admin --password-stdin; then
        echo "Initial admin account created."
      else
        echo "Admin bootstrap skipped: account may already exist." >&2
      fi
    fi
    exec python -m uvicorn api:app --host 0.0.0.0 --port "${PORT:-8080}"
    ;;
  worker)
    exec python worker.py
    ;;
  mcp)
    exec python server.py
    ;;
  *)
    echo "Unknown SERVICE_ROLE: ${SERVICE_ROLE}" >&2
    exit 2
    ;;
esac
