# Step 1: Build the Angular app
FROM node:20 AS build

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy all files and build the project
COPY . .
RUN npm run build -- --configuration production

# Step 2: Serve the app with Nginx
FROM nginx:alpine

# Copy built Angular files to Nginx HTML folder
COPY --from=build /app/dist/my-app /usr/share/nginx/html

# Copy a custom Nginx configuration (optional)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
