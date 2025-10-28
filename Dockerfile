# ===== Step 1: Build Angular app =====
FROM node:22.12.0-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build -- --configuration production --base-href=/battman-dashboard/ --output-path=dist/Battman-client/browser

# ===== Step 2: Serve via Nginx =====
FROM nginx:1.27.2-alpine

RUN apk update && apk upgrade
RUN rm -rf /usr/share/nginx/html/*

COPY --from=build /app/dist/Battman-client/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
RUN chmod -R 755 /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
