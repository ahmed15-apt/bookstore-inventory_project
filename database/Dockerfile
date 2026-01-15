# Use the official MariaDB 10.11 (standard Debian-based, works best in OpenShift)
FROM mariadb:10.11

# Copy your SQL script
COPY init.sql /docker-entrypoint-initdb.d/

# OpenShift Fix: MariaDB needs these directories to be writable by the root group (0)
RUN mkdir -p /var/run/mysqld /var/lib/mysql && \
    chown -R mysql:0 /var/lib/mysql /var/run/mysqld /docker-entrypoint-initdb.d && \
    chmod -R g+w /var/lib/mysql /var/run/mysqld /docker-entrypoint-initdb.d

# Use the mysql user
USER mysql

EXPOSE 3306