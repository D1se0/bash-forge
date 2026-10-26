# Dónde estás: pwd, cd y rutas absolutas/relativas

> **Objetivo:** Moverte por el sistema de ficheros y distinguir ruta absoluta de relativa.

## Teoría

`pwd` imprime dónde estás; `cd` te mueve. Una ruta **absoluta** empieza por `/` (`cd /tmp`); una **relativa** parte de donde estás (`cd docs`). `.` es "aquí", `..` es "el padre": `cd ..` sube un nivel y `cd` a secas vuelve a tu `$HOME`.

## Ejemplo guiado

```bash
$ pwd
/home/forge_000
$ cd workspace && pwd
/home/forge_000/workspace
$ cd .. && pwd
/home/forge_000
```

## Tu reto

Crea la carpeta `workspace/proyectos/capitulo1` con **una sola orden** (`mkdir -p`) y guarda la ruta absoluta de `workspace` en `ruta.txt` (un `cd` al interior + `pwd` con redirection).

## Errores típicos

- `mkdir carpeta/subcarpeta` sin `-p` falla si la carpeta padre no existe.
- `cd /workspace` busca un directorio en la raíz; tu workspace está bajo tu home.

## Mini-quiz

Si estás en /home/forge_001/workspace/proyectos, ¿dónde acabas tras `cd ../..`?

<details><summary>Ver respuesta</summary>

En /home/forge_001 (subes dos niveles).

</details>

---

*~6 min · Nivel 0 (Aprendiz de la fragua) · pulsa **Comprobar** cuando lo tengas.*
