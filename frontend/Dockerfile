# Stage 1: Build (Optional if using React/Angular, here just for pattern)
FROM node:18-alpine3.20 AS build
WORKDIR /app
COPY html/ .

# Stage 2: Runtime
FROM nginx:1.24-alpine
LABEL maintainer="devsecops-team"

# Copy custom config
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app /usr/share/nginx/html

# Security: Ensure Nginx can run as non-root on OpenShift
RUN touch /var/run/nginx.pid && \
    chown -R 1001:0 /var/run/nginx.pid /var/cache/nginx /var/log/nginx /usr/share/nginx/html && \
    chmod -R g=u /var/run/nginx.pid /var/cache/nginx /var/log/nginx /usr/share/nginx/html

USER 1001
EXPOSE 8080