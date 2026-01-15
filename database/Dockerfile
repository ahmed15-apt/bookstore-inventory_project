# STEP 1: Use the Alpine version (The key to size reduction)
FROM mariadb:10.11-alpine

# STEP 2: Security & Permissions for OpenShift
# OpenShift runs containers with a random UID. 
# We need to ensure that random user can write to these folders.
RUN mkdir -p /var/run/mysqld && \
    chown -R mysql:mysql /var/lib/mysql /var/run/mysqld /docker-entrypoint-initdb.d && \
    chmod -R 777 /var/run/mysqld && \
    chmod -R g=u /var/lib/mysql /docker-entrypoint-initdb.d

# STEP 3: Init Script
COPY init.sql /docker-entrypoint-initdb.d/

# STEP 4: Network
EXPOSE 3306

# Note: MariaDB is a drop-in replacement for MySQL 8.0 for most use cases.
# It respects the exact same Environment Variables (MYSQL_ROOT_PASSWORD, etc).