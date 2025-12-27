FROM node:20-alpine

WORKDIR /server

# Install dependencies for native modules
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Expose port
EXPOSE 9000

# Copy and set up start script
COPY start.sh /start.sh
RUN chmod +x /start.sh

CMD ["/start.sh"]
