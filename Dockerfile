FROM node:22.12.0-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

RUN npm run build -- --configuration production --base-href=/battman-dashboard/ --output-path=dist/browser

FROM nginx:1.27.2-alpine

RUN apk update && apk upgrade && rm -rf /var/cache/apk/* && rm -rf /usr/share/nginx/html/*

COPY --from=build /app/dist /usr/share/nginx/html

RUN find /usr/share/nginx/html -type f -name "index.html" -exec dirname {} \; | head -n 1 | \
    xargs -I {} sh -c 'cp -r {}/* /usr/share/nginx/html/ && rm -rf /usr/share/nginx/html/browser'

COPY nginx.conf /etc/nginx/conf.d/default.conf
RUN chmod -R 755 /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
