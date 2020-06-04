### STAGE 1: Build ###

FROM node:latest AS build

WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

### STAGE 2: Run ###
FROM nginx:alpine
COPY --from=build /app/dist/frontend /usr/share/nginx/html

EXPOSE 80
