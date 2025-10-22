# ===== Step 1: Build Angular app =====
FROM node:22.12.0-alpine AS build

WORKDIR /app

# Copy package files and install dependencies (clean install)
COPY package*.json ./
RUN npm ci

# Copy all project files
COPY . .

# Build Angular app for production with correct base-href and output path
RUN npm run build -- --configuration production --base-href=/ --output-path=dist/battman-dashboard

# ===== Step 2: Serve via Nginx =====
FROM nginx:1.27.2-alpine

# Update base system (optional but secure)
RUN apk update && apk upgrade

# Remove default nginx static files
RUN rm -rf /usr/share/nginx/html/*

# Copy built Angular files to Nginx HTML folder
COPY --from=build /app/dist/battman-dashboard /usr/share/nginx/html

# Optional: custom Nginx config for SPA routing (prevents 404 on refresh)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose HTTP port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
