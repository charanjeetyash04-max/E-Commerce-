# Single image that builds the React client and serves it from the Node API
# (same-origin deployment). Build from the REPOSITORY ROOT:
#   docker build -f infra/docker/Dockerfile -t maison .
#   docker compose -f infra/docker/docker-compose.yml up --build
# The compiled client lives at apps/web/build and is served by Express when
# NODE_ENV=production.

# ---- Build the web client ----------------------------------------------------
FROM node:22-alpine AS web
WORKDIR /app/apps/web

COPY apps/web/package*.json ./
RUN npm ci

COPY apps/web/ ./

# Vite inlines VITE_* / REACT_APP_* at build time, so pass any that are needed
# as build args. Same-origin means the socket/API URLs default to the current origin.
ARG REACT_APP_GOOGLE_CLIENT_ID
ARG REACT_APP_CASHFREE_MODE
ARG REACT_APP_SOCKET_URL
ENV REACT_APP_GOOGLE_CLIENT_ID=$REACT_APP_GOOGLE_CLIENT_ID \
    REACT_APP_CASHFREE_MODE=$REACT_APP_CASHFREE_MODE \
    REACT_APP_SOCKET_URL=$REACT_APP_SOCKET_URL
RUN npm run build

# ---- Runtime image -----------------------------------------------------------
FROM node:22-alpine
WORKDIR /app

COPY apps/api/package*.json ./apps/api/
RUN cd apps/api && npm ci --omit=dev

COPY apps/api/ ./apps/api/
COPY --from=web /app/apps/web/build ./apps/web/build

ENV NODE_ENV=production
# Documentation only: Render sets PORT and the app listens on it.
EXPOSE 4000

USER node
CMD ["node", "apps/api/server.js"]
