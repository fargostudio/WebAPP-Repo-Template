# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY apps/backend/package*.json ./apps/backend/

# Install dependencies
RUN npm ci

# Copy source code
COPY apps/backend ./apps/backend
COPY packages ./packages

# Build application
WORKDIR /app/apps/backend
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy package files and install production dependencies only
COPY apps/backend/package*.json ./
RUN npm ci --omit=dev

# Copy built application
COPY --from=builder /app/apps/backend/dist ./dist

# Create logs directory
RUN mkdir -p logs

# Run as non-root user
USER node

EXPOSE 5000

CMD ["node", "dist/index.js"]
