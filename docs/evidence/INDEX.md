# Índice de evidencias

| Fase | Qué | Comando | Resultado | Evidencia |
|---|---|---|---|---|
| 00 | Backup completo | `git tag pre-overhaul` + tar.gz ×2 + volumen docker_sandbox-data | OK (`/home/kali/backups/`, 5 ficheros) | hashes en el log del shell |
| 00 | Limpieza entorno | kill node 8020 + `compose down -v` bf-fresh + rm temporales | puertos 8020/8019/8079 libres; solo stack 8080/8010 | `ss -ltnp` |
| 00 | Línea base app escritorio | `chromium --headless --screenshot` 1440×900 | captura + revisión 4.3 | `00-baseline/app__1440x900__nord-dark__es.png` |
| 00 | Línea base app móvil | idem 390×844 | captura con overflow documentado | `00-baseline/app__390x844__nord-dark__es.png` |
| 00 | Línea base docs-site | servidor estático :8877 + chromium 1440×900 y 390×844 | capturas de la web plana actual | `00-baseline/docs-site__*.png` |
