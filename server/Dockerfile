# ── Python/FastAPI backend ────────────────────────────────────────────────────
FROM python:3.12-slim

# System deps for Pillow (JPEG/PNG decoding)
RUN apt-get update && apt-get install -y \
    libjpeg-dev \
    zlib1g-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python dependencies.
# NOTE: passlib is explicitly removed after installation because python-jose
# (a transitive dependency path) can pull it in. Our code uses bcrypt and
# PyJWT directly — passlib must not be present.
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt \
    && pip uninstall -y passlib python-jose 2>/dev/null; \
    echo "=== installed packages ===" \
    && pip list | grep -iE "bcrypt|jwt|passlib|jose"

# Copy application source
COPY . .

EXPOSE 3001

# Railway injects $PORT dynamically; fall back to 3001 for local Docker use.
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-3001}"]
