# ── Python/FastAPI backend ────────────────────────────────────────────────────
# Replaces the Node.js/Express/TypeScript build.
FROM python:3.12-slim

# System deps for Pillow (JPEG/PNG decoding)
RUN apt-get update && apt-get install -y \
    libjpeg-dev \
    zlib1g-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python dependencies (cached layer)
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy application source
COPY . .

EXPOSE 3001

# uvicorn is the ASGI server; --host 0.0.0.0 is required inside Docker
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "3001"]
