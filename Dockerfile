
# ==========================================
# FRONTEND BUILDER
# ==========================================

FROM node:22-alpine AS frontend-builder

WORKDIR /app

COPY frontend/package*.json ./

RUN npm ci

COPY frontend/ ./

ARG VITE_API_URL
ARG VITE_SOCKET_URL

ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_SOCKET_URL=${VITE_SOCKET_URL}

RUN npm run build


# ==========================================
# BACKEND BUILDER
# ==========================================

FROM node:22-alpine AS backend-builder

WORKDIR /app

COPY backend/package*.json ./

RUN npm ci --omit=dev

COPY backend/ ./


# ==========================================
# BACKEND RUNTIME
# ==========================================

FROM node:22-alpine AS backend

WORKDIR /app

ENV NODE_ENV=production

COPY --from=backend-builder /app ./

EXPOSE 3004

CMD ["node", "server.js"]


# ==========================================
# FRONTEND RUNTIME
# ==========================================

FROM nginx:alpine AS frontend

COPY --from=frontend-builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
