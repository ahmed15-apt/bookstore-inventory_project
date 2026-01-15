FROM redis:7-alpine
# Ensure redis runs as non-root and has permissions for the data dir
RUN mkdir -p /data && chown -R 1001:0 /data && chmod -R g=u /data
USER 1001
EXPOSE 6379
CMD ["redis-server", "--appendonly", "yes"]