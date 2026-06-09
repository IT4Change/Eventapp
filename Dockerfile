# syntax=docker/dockerfile:1
FROM node:22-alpine AS base
WORKDIR /app

# ---- development: live-reload via bind-mount (see docker-compose.override.yml)
FROM base AS development
ENV NODE_ENV=development
COPY package.json package-lock.json* ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev", "--", "--host"]

# ---- build
FROM base AS build
ENV NODE_ENV=production
COPY package.json package-lock.json* ./
RUN npm install
COPY . .
RUN npm run build

# ---- production: minimal runtime serving the Nitro output
FROM node:22-alpine AS production
WORKDIR /app
ENV NODE_ENV=production
ENV NITRO_HOST=0.0.0.0
ENV NITRO_PORT=3000
COPY --from=build /app/.output ./.output
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
