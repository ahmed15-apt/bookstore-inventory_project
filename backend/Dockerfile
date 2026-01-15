FROM node:18-alpine3.20 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine3.20
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
# OpenShift compatibility for restricted SCC
RUN chown -R 1001:0 /app && chmod -R g=u /app
USER 1001
EXPOSE 3000
CMD ["node", "server.js"]