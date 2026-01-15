# Stage 1: Build
FROM node:18-alpine3.20 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production
# Stage 2: Runtime (Distroless or Minimal Alpine)
FROM node:18-alpine
WORKDIR /app

# Add non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy dependencies and code
COPY --from=builder /app/node_modules ./node_modules
COPY . .

# Security: Run as non-root
USER appuser

EXPOSE 3000
CMD ["node", "server.js"]