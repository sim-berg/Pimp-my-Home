FROM node:20-alpine AS base

# Install dependencies for native modules
RUN apk add --no-cache python3 make g++ libc6-compat

# Install dependencies only when needed
FROM base AS deps
WORKDIR /server

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps --production=false

# Build stage
FROM base AS builder
WORKDIR /server

# Accept build args (even though Medusa doesn't need them at build time)
ARG NODE_ENV
ARG DATABASE_URL
ARG REDIS_URL

COPY --from=deps /server/node_modules ./node_modules
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM base AS runner
WORKDIR /server

ENV NODE_ENV=production

COPY --from=builder /server/node_modules ./node_modules
COPY --from=builder /server/dist ./dist
COPY --from=builder /server/package*.json ./
COPY --from=builder /server/medusa-config.ts ./
COPY --from=builder /server/src ./src

# Copy and set up start script
COPY start.sh /start.sh
RUN chmod +x /start.sh

# Expose port
EXPOSE 9000

CMD ["/start.sh"]
