FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Install dependencies for sharp and other native modules
RUN apk add --no-cache libc6-compat python3 make g++

# Copy package files
COPY package.json package-lock.json* ./

# Use npm install instead of npm ci to handle lockfile version mismatches
RUN npm install --frozen-lockfile --production=false

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

# Accept build args from Coolify
ARG NEXT_PUBLIC_MEDUSA_BACKEND_URL
ARG NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_BASE_URL
ARG NEXT_PUBLIC_POLAR_SERVER
ARG NEXT_PUBLIC_TWITCH_CHANNEL
ARG SERVICE_FQDN_MEDUSA
ARG SERVICE_FQDN_STOREFRONT
ARG SERVICE_URL_MEDUSA
ARG SERVICE_URL_STOREFRONT

# Set environment variables for build
# Use SERVICE_URL (includes https://) over SERVICE_FQDN (hostname only)
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV NEXT_PUBLIC_MEDUSA_BACKEND_URL=${SERVICE_URL_MEDUSA:-${NEXT_PUBLIC_MEDUSA_BACKEND_URL:-http://localhost:9000}}
ENV NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=${NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY}
ENV NEXT_PUBLIC_BASE_URL=${SERVICE_URL_STOREFRONT:-${NEXT_PUBLIC_BASE_URL:-http://localhost:3000}}
ENV NEXT_PUBLIC_POLAR_SERVER=${NEXT_PUBLIC_POLAR_SERVER:-sandbox}
ENV NEXT_PUBLIC_TWITCH_CHANNEL=${NEXT_PUBLIC_TWITCH_CHANNEL}

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
