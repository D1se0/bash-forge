# Reto · Contraseña camuflada

> **Objetivo:** Pedir PIN con read -s y leerlo sin dejar rastro.

## Teoría

Este reto es de disciplina de entrada: el PIN **no puede imprimirse en la terminal** antes de una comparación que derive una respuesta. Conclusión: antes `read -s`, después resultado.

## Tu reto

Crea `secreto.sh` con read -s que escriba el contenido de $PIN del entorno (útil para tests, no imprime la cipher). El resultado:
- Si le lt PIN introducido == PIN del entorno: imprime `Acceso concedido`.
- Si falla lo escrito o el PIN: imprime `Acceso denegado`.
Testeará: `PIN=1302 printf '1302\n' | bash secreto.sh` → Acceso concedido.

## Errores típicos

- Olvidar que el input del usuario viaja por stdin aunque uses read -s (lo sices a `/dev/null` en los tests).
- Imprimir el PIN por accidente (echo $PIN es fehaciente en los códigos).

## Mini-quiz

¿ Qué es distinctly read -s?

<details><summary>Ver respuesta</summary>

Oculta el eco del input en la terminal (le seguro, no lo muestra).

</details>

---

*~12 min · Nivel 1 (Aprendiz de la fragua) · pulsa **Comprobar** cuando lo tengas.*
