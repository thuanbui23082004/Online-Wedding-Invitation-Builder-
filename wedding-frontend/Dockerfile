# syntax=docker/dockerfile:1

# ---------- Stage 1: build ----------
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .

# Vite ghi giá trị này vào bundle LÚC BUILD. Đây là URL mà TRÌNH DUYỆT gọi tới.
ARG VITE_API_URL=http://localhost:8000
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# ---------- Stage 2: runtime ----------
FROM nginxinc/nginx-unprivileged:stable-alpine AS runtime
USER 0
RUN apk upgrade --no-cache
USER 101
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 CMD ["wget", "-qO-", "http://127.0.0.1:8080/"]
