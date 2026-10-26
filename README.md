# Bash Forge

> Aprende **solo Bash scripting** escribiendo y ejecutando scripts reales en un Ubuntu
> dentro de Docker, a través de una terminal web con acabado profesional.

**Estado:** en desarrollo activo. Implementación de referencia 100 % funcional en local
(Docker 27.x + Compose v2).

## ¿Qué es?

Bash Forge es una plataforma de aprendizaje open source donde cada lección se practica
**escribiendo scripts Bash de verdad** en una terminal real (PTY) dentro de un contenedor
Ubuntu 24.04 aislado, con validación automática de ejercicios, XP e insignias.

- Terminal web completa (xterm.js): colores 24 bit, nano y vim funcionando, TAB-completion.
- Sandbox Ubuntu sin salida a Internet, un usuario Linux sin privilegios por sesión.
- Validación real de ejercicios dentro del sandbox, como usuario separado del alumno.
- Currículum de 80+ lecciones en 9 niveles, retos, Boss Fights y Playground libre.
- Progreso persistente en volumen Docker, exportable a JSON.
- CLI de gestión `bashforge`: install, up, down, status, logs, doctor, backup, purge…

## Quickstart (menos de 5 minutos)

Requisitos: Docker 24+ con Compose v2, Bash, y 2 GB libres de disco.

```bash
git clone https://github.com/D1se0/bash-forge.git
cd bash-forge
./bashforge install   # comprueba requisitos, crea .env y construye las imágenes
./bashforge up        # levanta todo y abre http://localhost:8080
```

Abre `http://localhost:8080`, pulsa **Empezar** y escribe tu primer `hello.sh` en minutos.

### Comandos principales

| Comando | Acción |
|---|---|
| `./bashforge up` | Arranca la plataforma (espera healthchecks y abre el navegador) |
| `./bashforge down` | Para los contenedores conservando tus datos |
| `./bashforge status` | Salud, puertos, CPU/RAM y sesiones activas |
| `./bashforge logs [svc]` | Logs en vivo (web / sandbox) |
| `./bashforge reset-progress` | Borra el progreso de los alumnos (no los contenedores) |
| `./bashforge doctor` | Diagnóstico completo con sugerencias |
| `./bashforge backup` / `restore` | Copia / restaura los datos |
| `./bashforge purge --yes` | Elimina contenedores, imágenes, volúmenes y redes del proyecto |
| `./bashforge test` | Tests unitarios, de lecciones y e2e |
| `./bashforge lint` | ShellCheck, hadolint, eslint, prettier |
| `./bashforge new-lesson <nombre>` | Scaffolding de una lección nueva |

`make` envuelve todo lo mismo: `make up`, `make down`, `make status`, `make help`.

## Arquitectura en una imagen

```
Navegador (React + xterm.js)
     │ HTTPS + WebSocket
[ web ] nginx: SPA + proxy /ws y /api
     │ red Docker interna (sin Internet)
[sandbox] Ubuntu 24.04 + Node (ws + node-pty + validador de lecciones)
     └── usuario Linux efímero por sesión, home aislado, cuotas y TTL
```

Sin `/var/run/docker.sock`, red `internal`, rootfs de solo lectura (`tmpfs` para `/tmp`,
volumen para `/home`), `cap_drop: ALL` + caps mínimas, `no-new-privileges`, límites de
PID/mem/CPU y TTL de sesiones. Detalles en [SECURITY.md](SECURITY.md).

## Documentación

- Web de documentación (GitHub Pages): https://d1se0.github.io/bash-forge/
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — arquitectura detallada
- [docs/DECISIONS.md](docs/DECISIONS.md) — decisiones de diseño y su why
- [docs/LESSON_AUTHORING.md](docs/LESSON_AUTHORING.md) — guía para autores de lecciones
- [CONTRIBUTING.md](CONTRIBUTING.md) · [SECURITY.md](SECURITY.md) · [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)

## Licencia

MIT — ver [LICENSE](LICENSE).
