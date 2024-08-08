FROM node:current-slim

# Set the working directory inside the container
WORKDIR /app

# copy file from local device
COPY /server ./server
COPY /client ./client
COPY /socket ./socket

WORKDIR /app/server
RUN npm i

WORKDIR /app/socket
RUN npm i

WORKDIR /app

# Update the package list and install git
RUN apt-get update && apt-get install -y git

# Install dependencies for FileBrowser
RUN apt-get update && apt-get install -y curl && \
    curl -fsSL https://github.com/filebrowser/filebrowser/releases/download/v2.30.0/linux-amd64-filebrowser.tar.gz -o filebrowser.tar.gz && \
    tar -xzf filebrowser.tar.gz && \
    mv filebrowser /usr/local/bin/filebrowser && \
    rm filebrowser.tar.gz && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Copy the default FileBrowser configuration (optional, customize as needed)
COPY filebrowser.json /app/filebrowser.json

# Install Nginx
RUN apt-get update && apt-get install -y nginx && \
    rm /etc/nginx/sites-enabled/default

# Create an Nginx configuration file
RUN echo 'server {' > /etc/nginx/sites-available/app && \
    echo '    listen 80;' >> /etc/nginx/sites-available/app && \
    echo '    listen [::]:80;' >> /etc/nginx/sites-available/app && \
    echo '    server_name localhost;' >> /etc/nginx/sites-available/app && \
    echo '    client_max_body_size 100M;' >> /etc/nginx/sites-available/app && \
    echo '    root /app/client/dist;' >> /etc/nginx/sites-available/app && \
    echo '    index index.html;' >> /etc/nginx/sites-available/app && \
    echo '    location / {' >> /etc/nginx/sites-available/app && \
    echo '        try_files $uri $uri/ /index.html;' >> /etc/nginx/sites-available/app && \
    echo '    }' >> /etc/nginx/sites-available/app && \
    echo '}' >> /etc/nginx/sites-available/app && \
    ln -s /etc/nginx/sites-available/app /etc/nginx/sites-enabled/app

# Expose ports
EXPOSE 80
EXPOSE 8080
EXPOSE 5000
EXPOSE 9000

# Create an entrypoint script
RUN echo '#!/bin/sh' > /entrypoint.sh && \
    echo 'cd /app/server' >> /entrypoint.sh && \
    echo 'npm start &' >> /entrypoint.sh && \
    echo 'cd /app/socket' >> /entrypoint.sh && \
    echo 'npm start &' >> /entrypoint.sh && \
    echo 'cd /app' >> /entrypoint.sh && \
    echo 'nginx &' >> /entrypoint.sh && \
    echo 'filebrowser -r /app --config /app/filebrowser.json --port 8080' >> /entrypoint.sh && \
    chmod +x /entrypoint.sh

# Use the entrypoint script
ENTRYPOINT ["/entrypoint.sh"]