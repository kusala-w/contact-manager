# Build step
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
RUN npm run build

# Serve step
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
