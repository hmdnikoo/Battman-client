# Step 1: Build Angular app
FROM node:22.12.0-alpine AS build

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy all source files
COPY . .

# Build the Angular app (production)
RUN npm run build -- --configuration production

# Step 2: Serve via Nginx
FROM nginx:1.27.2-alpine
RUN apk update && apk upgrade

# Copy built Angular files to Nginx HTML folder
COPY --from=build /app/dist/battman-dashboard /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
