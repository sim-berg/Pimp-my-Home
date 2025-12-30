FROM node:20-alpine

WORKDIR /server

# Install dependencies for native modules
RUN apk add --no-cache python3 make g++ libc6-compat

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy source code and config
COPY . .

# Set placeholder environment variables for build
# These are overridden at runtime by docker-compose
ENV DATABASE_URL="postgres://placeholder:placeholder@localhost:5432/placeholder"
ENV REDIS_URL="redis://localhost:6379"
ENV NODE_ENV="production"

# Build the application
RUN npm run build

# Copy and set up start script
RUN chmod +x /server/start.sh

# Expose port
EXPOSE 9000

CMD ["/server/start.sh"]
