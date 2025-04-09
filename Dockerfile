# # Build stage
# FROM node:16 as build-stage
# WORKDIR /app
# COPY package*.json ./
# RUN yarn
# COPY . .
# RUN yarn build

# # Production stage
# FROM nginx:stable-alpine as production-stage
# COPY --from=build-stage /app/dist /usr/share/nginx/html
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# # Create a startup script
# RUN echo '#!/bin/sh' > /docker-entrypoint.d/00-update-port.sh && \
#     echo 'sed -i "s/listen 8080/listen $PORT/g" /etc/nginx/conf.d/default.conf' >> /docker-entrypoint.d/00-update-port.sh && \
#     chmod +x /docker-entrypoint.d/00-update-port.sh

# EXPOSE 8080
# CMD ["nginx", "-g", "daemon off;"]

# Build stage
FROM node:16 as build-stage
WORKDIR /app
COPY package*.json ./
RUN yarn
COPY . .
RUN yarn build

# Production stage
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Add a startup script for debugging
RUN echo '#!/bin/sh' > /start.sh && \
    echo 'echo "Starting nginx with PORT=$PORT"' >> /start.sh && \
    echo 'cat /etc/nginx/conf.d/default.conf' >> /start.sh && \
    echo 'nginx -g "daemon off;"' >> /start.sh && \
    chmod +x /start.sh

EXPOSE 8080
CMD ["/start.sh"]

# EXPOSE 8080

# CMD ["nginx", "-g", "daemon off;"]