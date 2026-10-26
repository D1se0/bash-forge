# nginx: SPA + proxy de /api (lessons) y /ws (terminal PTY)
FROM node:22-bookworm-slim AS build
WORKDIR /src
COPY package.json package-lock.json ./
COPY apps/web/package.json apps/web/package.json
COPY packages/shared/package.json packages/shared/package.json
RUN npm ci -w apps/web -w packages/shared --include-workspace-root --no-audit --no-fund
COPY apps/web apps/web
COPY packages/shared packages/shared
RUN npm run build -w apps/web

FROM nginx:1.27-alpine
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /src/apps/web/dist /usr/share/nginx/html
EXPOSE 80
