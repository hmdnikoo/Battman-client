# ===== Step 1: Build Angular app =====
FROM node:22.12.0-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Build Angular app for production with base-href matching Traefik route
RUN npm run build -- --configuration production --base-href=/battman-dashboard/ --output-path=dist/browser

# ===== Step 2: Serve via Nginx =====
FROM nginx:1.27.2-alpine

RUN apk update && apk upgrade
RUN rm -rf /usr/share/nginx/html/*

# Copy built Angular files
COPY --from=build /app/dist/browser /usr/share/nginx/html

# Copy custom Nginx config for Angular SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
