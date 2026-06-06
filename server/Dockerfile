# ── Python/FastAPI backend ────────────────────────────────────────────────────
FROM python:3.12-slim

# System deps for Pillow (JPEG/PNG decoding)
RUN apt-get update && apt-get install -y \
    libjpeg-dev \
    zlib1g-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy ALL source first.
# This ensures any code change (auth.py, main.py, …) invalidates every
# subsequent layer — including the pip-install step — so Railway can never
# serve a stale image that still has the old passlib-based code.
COPY . .

# Install deps, then hard-remove passlib/python-jose if anything dragged them
# in as a transitive dependency.  Fail the build immediately if passlib is
# still importable so the problem surfaces at build time, not at runtime.
RUN pip install --no-cache-dir -r requirements.txt \
    && pip uninstall -y passlib python-jose 2>/dev/null || true \
    && if python -c "import passlib" 2>/dev/null; then \
         echo "BUILD FAILED: passlib is still present after uninstall"; \
         pip show passlib; \
         exit 1; \
       fi \
    && echo "OK: passlib absent" \
    && pip list | grep -iE "bcrypt|pyjwt|passlib|jose"

EXPOSE 3001

# Railway injects $PORT dynamically; fall back to 3001 for local Docker use.
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-3001}"]
