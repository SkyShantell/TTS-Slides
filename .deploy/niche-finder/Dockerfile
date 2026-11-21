# Railway adapter for https://github.com/pandich93/youtube-niche-finder
# Upstream is MIT-licensed. Pin the source so deployments are reproducible.
FROM python:3.12-slim
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1 \
    FASTEMBED_CACHE_PATH=/tmp/niche-models \
    HF_HOME=/tmp/niche-models \
    XDG_CACHE_HOME=/tmp/niche-models \
    FRONTEND_DIR=/opt/youtube-niche-finder/frontend
RUN apt-get update && apt-get install -y --no-install-recommends git ca-certificates libgomp1 \
    && rm -rf /var/lib/apt/lists/*
ARG UPSTREAM_SHA=bde0dc52916d32ad0f7411b745e00e3dd411e03a
RUN mkdir -p /opt/youtube-niche-finder && cd /opt/youtube-niche-finder \
    && git init -q \
    && git remote add origin https://github.com/pandich93/youtube-niche-finder.git \
    && git fetch --depth 1 origin "${UPSTREAM_SHA}" \
    && git checkout -q FETCH_HEAD \
    && rm -rf .git
RUN pip install -r /opt/youtube-niche-finder/backend/requirements.txt
COPY entrypoint.sh /opt/niche-entrypoint.sh
RUN chmod 755 /opt/niche-entrypoint.sh \
    && useradd --create-home --uid 10001 niche \
    && mkdir -p /tmp/niche-models \
    && chown -R niche:niche /tmp/niche-models /opt/youtube-niche-finder
USER niche
WORKDIR /opt/youtube-niche-finder/backend
EXPOSE 8080 8765
ENTRYPOINT ["/opt/niche-entrypoint.sh"]
