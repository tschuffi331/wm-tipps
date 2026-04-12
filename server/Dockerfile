FROM node:20-slim

# Build deps for better-sqlite3 (native addon) and sharp
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install dependencies first (cached layer)
COPY package*.json ./
RUN npm ci

# Copy source and compile TypeScript
COPY . .
RUN npm run build

EXPOSE 3001

CMD ["node", "dist/server.js"]
