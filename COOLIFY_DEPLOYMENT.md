# Coolify Deployment Guide

This guide walks you through deploying Pimp your Home on Coolify.

## Prerequisites

- Coolify instance running
- GitHub repository connected to Coolify
- Domain names configured (optional but recommended)

## Deployment Steps

### 1. Create a New Resource in Coolify

1. Go to your Coolify dashboard
2. Click "New Resource"
3. Select "Docker Compose"
4. Connect your GitHub repository

### 2. Configure Build Settings

- **Build Pack**: Docker Compose
- **Docker Compose Location**: `docker-compose.yml` (root level)
- **Base Directory**: Leave empty (uses root)

### 3. Required Environment Variables

Configure these in the Coolify environment variables section:

#### Database & Cache
```bash
POSTGRES_PASSWORD=your-secure-postgres-password
```

#### Medusa Backend
```bash
NODE_ENV=production
JWT_SECRET=your-very-long-random-jwt-secret-at-least-32-chars
COOKIE_SECRET=your-very-long-random-cookie-secret-at-least-32-chars
```

#### CORS Configuration
```bash
STORE_CORS=https://your-storefront-domain.com
ADMIN_CORS=https://your-medusa-domain.com
AUTH_CORS=https://your-medusa-domain.com
```

#### Polar Payment (Required)
```bash
POLAR_ACCESS_TOKEN=your_polar_access_token_from_polar_sh
POLAR_WEBHOOK_SECRET=your_polar_webhook_secret
POLAR_SERVER=sandbox  # or "production"
```

#### Medusa Publishable Key
```bash
MEDUSA_PUBLISHABLE_KEY=pk_xxxxx  # Generate after first deployment
```

#### Optional: Twitch Integration (Phase 2)
```bash
TWITCH_CLIENT_ID=your_twitch_client_id
TWITCH_CLIENT_SECRET=your_twitch_client_secret
TWITCH_WEBHOOK_SECRET=your_twitch_webhook_secret
TWITCH_CHANNEL=your_twitch_channel_name
```

### 4. Service Configuration

Coolify will automatically create these services:

- **postgres**: PostgreSQL database (port 5432)
- **redis**: Redis cache (port 6379)
- **medusa**: Medusa backend API (port 9000)
- **storefront**: Next.js frontend (port 3000)
- **twitch-service**: Twitch integration (port 4000, optional)

### 5. Domain Mapping

In Coolify, map your domains to services:

- `api.yourdomain.com` → medusa service (port 9000)
- `yourdomain.com` → storefront service (port 3000)
- `twitch.yourdomain.com` → twitch-service (port 4000, optional)

### 6. Deploy

Click "Deploy" in Coolify. The deployment process will:

1. Build all Docker images
2. Start PostgreSQL and Redis
3. Run database migrations
4. Seed sample data (optional)
5. Start Medusa backend
6. Build and start Next.js frontend

### 7. Post-Deployment Setup

#### Generate Medusa Publishable Key

1. Access Medusa Admin: `https://your-medusa-domain.com/app`
2. Create an admin user (first time only)
3. Go to Settings → Publishable API Keys
4. Create a new publishable key
5. Copy the key (starts with `pk_`)
6. Add it to Coolify environment variables as `MEDUSA_PUBLISHABLE_KEY`
7. Redeploy the storefront service

#### Configure Polar Webhooks

1. Go to [polar.sh](https://polar.sh/settings/webhooks)
2. Add webhook endpoint: `https://your-storefront-domain.com/api/webhooks/polar`
3. Select events: `checkout.completed`, `order.created`
4. Save and copy the webhook secret
5. Update `POLAR_WEBHOOK_SECRET` in Coolify if needed

#### Configure Twitch (Phase 2)

1. Go to [dev.twitch.tv](https://dev.twitch.tv/console/apps)
2. Create a new application
3. Set OAuth Redirect URL: `https://your-domain.com/api/twitch/callback`
4. Set EventSub webhook: `https://twitch.yourdomain.com/webhooks/twitch`
5. Copy Client ID and Client Secret
6. Update environment variables in Coolify

## Troubleshooting

### Build Fails with "path not found"

**Error**: `path "/artifacts/medusa-server" not found`

**Solution**: Make sure you're using the `docker-compose.yml` at the root level, not `docker/docker-compose.yml`

### Storefront Build Fails with "npm ci" Error

**Error**: `process "/bin/sh -c npm ci" did not complete successfully: exit code: 1`

**Solution**: Fixed in updated Dockerfile. The storefront now uses `npm install --frozen-lockfile` instead of `npm ci` to handle version mismatches. Also adds required build dependencies for Sharp image processing.

**What Changed**:
- Added Alpine Linux build dependencies (`libc6-compat`, `python3`, `make`, `g++`)
- Changed from `npm ci` to `npm install --frozen-lockfile`
- Added build args for Next.js environment variables

### Database Connection Errors

**Error**: `ECONNREFUSED postgres:5432`

**Solution**:
- Check if PostgreSQL service is healthy
- Verify `POSTGRES_PASSWORD` is set correctly
- Check service dependencies in docker-compose.yml

### Medusa Build Fails

**Error**: `ERR_INVALID_ARG_TYPE` or `cmd is not a function`

**Solution**:
- Ensure `@medusajs/cli` is in dependencies (not `@medusajs/medusa-cli`)
- Check package.json in medusa-server directory
- Rebuild the medusa service

### Frontend Shows ECONNREFUSED

**Error**: `Failed to fetch categories: ECONNREFUSED`

**Solution**:
- Wait for Medusa backend to fully start (check logs)
- Verify `NEXT_PUBLIC_MEDUSA_BACKEND_URL` points to the correct domain
- For internal communication, use `http://medusa:9000`
- For external/browser requests, use the public domain

### Sharp Missing Error

**Error**: `'sharp' is required to be installed`

**Solution**: Already fixed - `sharp` is now in dependencies

### Seed Data Fails

**Error**: Script fails during seeding

**Solution**:
- Check if database is accessible
- Verify migrations ran successfully
- Check medusa service logs
- Seeding is optional and can be skipped

## Environment Variable Reference

### Required for All Deployments

- `POSTGRES_PASSWORD`: Database password (min 16 chars recommended)
- `JWT_SECRET`: JWT signing secret (min 32 chars)
- `COOKIE_SECRET`: Cookie signing secret (min 32 chars)
- `POLAR_ACCESS_TOKEN`: Polar payment access token
- `POLAR_WEBHOOK_SECRET`: Polar webhook secret

### Required for Next.js Build (Storefront)

These MUST be set BEFORE deploying the storefront:
- `NEXT_PUBLIC_MEDUSA_BACKEND_URL`: Your Medusa API domain (e.g., `https://api.yourdomain.com`)
- `NEXT_PUBLIC_BASE_URL`: Your storefront domain (e.g., `https://yourdomain.com`)
- `NEXT_PUBLIC_POLAR_SERVER`: `sandbox` or `production`

### Required After First Deployment

- `MEDUSA_PUBLISHABLE_KEY`: Generated from Medusa Admin UI
- `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`: Same as above (for frontend build)

### Optional but Recommended

- `STORE_CORS`: Storefront domain for CORS
- `ADMIN_CORS`: Admin domain for CORS
- `AUTH_CORS`: Auth domain for CORS
- `POLAR_SERVER`: "sandbox" or "production"

### Optional (Phase 2)

- `TWITCH_CLIENT_ID`: Twitch app client ID
- `TWITCH_CLIENT_SECRET`: Twitch app secret
- `TWITCH_WEBHOOK_SECRET`: Twitch webhook verification
- `TWITCH_CHANNEL`: Your Twitch channel name

## Coolify-Specific Tips

1. **Logs**: Access service logs in Coolify dashboard → Service → Logs
2. **Restart**: Individual services can be restarted without full rebuild
3. **Scaling**: Adjust resource limits in Coolify service settings
4. **Backups**: Set up automated PostgreSQL backups via Coolify
5. **SSL**: Coolify automatically provisions Let's Encrypt certificates

## Performance Optimization

1. **Database Connection Pooling**: Already configured in Medusa
2. **Redis Caching**: Configured for session storage
3. **Next.js Standalone**: Optimized Docker image for storefront
4. **Image Optimization**: Sharp is installed for Next.js images

## Security Checklist

- [ ] Change all default secrets (JWT_SECRET, COOKIE_SECRET)
- [ ] Use strong POSTGRES_PASSWORD (16+ chars)
- [ ] Enable SSL/HTTPS via Coolify
- [ ] Configure proper CORS domains
- [ ] Restrict database port (5432) to internal network only
- [ ] Set NODE_ENV=production
- [ ] Review and limit exposed ports
- [ ] Configure Polar webhook secret verification
- [ ] Use environment variables, never hardcode secrets

## Support

For issues:
1. Check Coolify service logs
2. Check medusa-server logs for backend errors
3. Check storefront logs for frontend errors
4. Review this troubleshooting guide
5. Open an issue on GitHub

## Updating the Deployment

1. Push changes to your GitHub repository
2. Coolify auto-deploys (if enabled) or click "Deploy" manually
3. Services will rebuild and restart automatically
4. Database migrations run automatically via start.sh

## Rollback

If deployment fails:
1. Go to Coolify → Deployments
2. Find the last successful deployment
3. Click "Redeploy"
