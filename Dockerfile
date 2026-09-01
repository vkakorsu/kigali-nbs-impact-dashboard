# Multi-stage build: compile the static site, then serve it with nginx.
# The runtime image is a plain static file server, roughly 50 MB, with no
# Node.js, no database, and no server-side code. It runs unchanged on any
# infrastructure that can run a container, including virtual machines at
# Rwanda's National Data Center.

FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY . .
RUN npm run build

FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK CMD wget -q --spider http://localhost/ || exit 1
