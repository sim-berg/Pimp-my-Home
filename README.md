# Pimp your Home

A self-hosted e-commerce platform for 3D printed crystals and decorative items, featuring Twitch integration for live stream sales alerts.

## Tech Stack

- **Frontend**: Next.js 14+ (App Router, TypeScript, Tailwind CSS)
- **Backend**: Medusa.js (headless e-commerce)
- **Database**: PostgreSQL
- **Cache**: Redis
- **Payments**: Polar (primary), PayPal (Phase 2)
- **Streaming**: Twitch EventSub integration
- **Deployment**: Docker Compose via Coolify

## Project Structure

```
├── storefront/          # Next.js frontend
├── medusa-server/       # Medusa backend
├── twitch-service/      # Twitch EventSub handler
└── docker/              # Docker Compose configs
```

## Quick Start

### Prerequisites

- Node.js 20+
- Docker and Docker Compose
- PostgreSQL 15+
- Redis 7+

### Development Setup

1. **Clone and install dependencies**:
   ```bash
   # Install storefront dependencies
   cd storefront && npm install

   # Install Medusa server dependencies
   cd ../medusa-server && npm install

   # Install Twitch service dependencies
   cd ../twitch-service && npm install
   ```

2. **Configure environment variables**:
   ```bash
   # Copy example env files
   cp docker/.env.example docker/.env
   cp storefront/.env.local.example storefront/.env.local
   ```

3. **Start with Docker Compose (recommended)**:
   ```bash
   cd docker
   docker-compose up -d
   ```

4. **Or run services individually**:
   ```bash
   # Terminal 1: Start PostgreSQL and Redis (or use Docker)
   docker-compose up postgres redis -d

   # Terminal 2: Start Medusa server
   cd medusa-server && npm run dev

   # Terminal 3: Start storefront
   cd storefront && npm run dev
   ```

5. **Access the application**:
   - Storefront: http://localhost:3000
   - Medusa Admin: http://localhost:9000/app
   - API: http://localhost:9000

## Phase 1 Features (Completed)

- Product catalog with categories
- Product detail pages with variants
- Shopping cart with persistence
- Checkout flow with Polar integration
- Crystal cave themed UI (dark mode, purple/teal accents)
- Mobile-responsive design
- Docker Compose deployment setup

## Phase 2 Features (In Progress)

- Twitch embed and live status detection
- Purchase → stream alert pipeline
- PayPal as secondary payment
- User accounts and order history

## Configuration

### Polar Payment Setup

1. Create an account at [polar.sh](https://polar.sh)
2. Create a product and get the price ID
3. Generate an access token
4. Configure webhook endpoint: `https://your-domain/api/webhooks/polar`

### Twitch Integration

1. Register an app at [dev.twitch.tv](https://dev.twitch.tv)
2. Configure EventSub webhooks for `stream.online` and `stream.offline`
3. Set the webhook URL to: `https://your-domain:4000/webhooks/twitch`

## Deployment (Coolify)

**Quick Start**: See [COOLIFY_DEPLOYMENT.md](./COOLIFY_DEPLOYMENT.md) for detailed deployment instructions.

1. Create a new project in Coolify
2. Select "Docker Compose" as the build pack
3. Point to `docker-compose.yml` (root level)
4. Configure environment variables in Coolify dashboard (see `.env.example`)
5. Deploy!

**Important**: Use the `docker-compose.yml` at the root level for Coolify deployments, not `docker/docker-compose.yml`.

## API Endpoints

### Storefront API
- `GET /api/twitch/status` - Get stream status

### Twitch Service
- `GET /stream/status` - Get live status
- `POST /alerts/purchase` - Trigger purchase alert
- `GET /alerts/stream` - SSE endpoint for real-time alerts

## License

MIT
