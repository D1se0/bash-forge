# Imagen del sandbox-server: el proceso con node-pty y los usuarios de forja
FROM node:22-bookworm-slim

ARG NODE_ENV=development
ENV NODE_ENV=$NODE_ENV
WORKDIR /opt/bashforge

RUN apt-get update \
 && apt-get install -y --no-install-recommends ca-certificates bash curl util-linux procps python3 make g++ \
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
RUN for i in $(seq 1 500); do \
      useradd -m -u $((2000 + i)) -s /bin/bash forge_$i 2>/dev/null || true; \
    done

# prompt propio de la forja, en /etc/bash.bashrc, en el skel y en cada home ya creado
COPY docker/forge-prompt.sh /tmp/forge-prompt.sh
RUN for f in /etc/bash.bashrc /etc/skel/.bashrc $(ls /home/forge_*/.bashrc 2>/dev/null); do \
      grep -q PROMPT_BASH_FORGE "$f" 2>/dev/null || cat /tmp/forge-prompt.sh >> "$f"; \
    done && rm /tmp/forge-prompt.sh

# helper de arranque de PTY: se ejecuta como root y cae al usuario de la sesión
RUN printf '#!/bin/bash\nUSERX="$1"\ncd "/home/$USERX" 2>/dev/null || cd /\nexec runuser -u "$USERX" -- bash -i\n' > /usr/local/bin/forge-spawn \
 && chmod 755 /usr/local/bin/forge-spawn

ENV LESSONS_DIR=/opt/bashforge/lessons
ENV PORT=8010
ENV LANG=C.UTF-8
ENV LC_ALL=C.UTF-8
EXPOSE 8010
CMD ["node", "apps/sandbox-server/dist/server.cjs"]
