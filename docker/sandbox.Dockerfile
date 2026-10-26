# Imagen del sandbox-server: el proceso con node-pty y los usuarios de forja
FROM node:22-bookworm-slim

ENV NODE_ENV=production
ARG NODE_OPTIONS=""
WORKDIR /opt/bashforge

RUN apt-get update \
 && apt-get install -y --no-install-recommends ca-certificates bash curl util-linux procps \
 && rm -rf /var/lib/apt/lists/*

# dependencias (incluye node-pty: hay que compilar módulos nativos)
COPY package.json package-lock.json ./
COPY apps/sandbox-server/package.json apps/sandbox-server/package.json
COPY packages/shared/package.json packages/shared/package.json
RUN npm ci -w apps/sandbox-server -w packages/shared --include-workspace-root --no-audit --no-fund

# fuentes y build
COPY packages/lessons packages/lessons
COPY packages/shared packages/shared
COPY apps/sandbox-server apps/sandbox-server
RUN npm run build -w apps/sandbox-server

# lecciones generadas al módulo LESSONS_DIR por defecto
COPY packages/lessons/lessons /opt/bashforge/lessons

# usuarios de forja pre-creados (los ids que reserva pool.ts)
RUN for i in $(seq 1 40); do \
      useradd -m -u $((2000 + i)) -s /bin/bash forge_$i 2>/dev/null || true; \
    done

ENV LESSONS_DIR=/opt/bashforge/lessons
ENV PORT=8010
EXPOSE 8010
CMD ["node", "apps/sandbox-server/dist/server.cjs"]
