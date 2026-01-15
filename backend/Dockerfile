# Stage 1: Build
FROM node:18-alpine3.20 AS builder
WORKDIR /app
COPY package*.json ./
# Changed npm ci to npm install
RUN npm install --omit=dev

# Stage 2: Runtime
FROM node:18-alpine3.20
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .

RUN chown -R 1001:0 /app && chmod -R g=u /app
USER 1001
EXPOSE 3000
CMD ["node", "server.js"]