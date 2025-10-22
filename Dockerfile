# Step 1: Build Angular app
FROM node:20.17.0-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build -- --configuration production

# Step 2: Serve via Nginx (latest alpine)
FROM nginx:1.27.2-alpine
RUN apk update && apk upgrade

COPY --from=build /app/dist/battman-dashboard /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
