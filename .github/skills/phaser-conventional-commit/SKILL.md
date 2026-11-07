---
name: phaser-conventional-commit
description: "Use after implementing, fixing, refactoring, testing, or documenting changes in this Phaser JavaScript project to prepare an atomic local Conventional Commit command."
---

# Phaser Conventional Commit

## Propósito

Después de cada cambio implementado en este proyecto, prepara comandos para que el usuario pueda crear un commit local con el estándar Conventional Commits. No ejecutes `git add`, `git commit` ni `git push`: presenta los comandos para que el usuario decida cuándo ejecutarlos.

## Procedimiento

1. Revisa los cambios del trabajo actual y determina qué archivos modificaste. No incluyas cambios preexistentes ni archivos ajenos a la tarea.
2. Elige un tipo Conventional Commit adecuado:
   - `feat`: funcionalidad nueva.
   - `fix`: corrección de un error.
   - `refactor`: cambio interno sin alterar el comportamiento esperado.
   - `docs`: documentación.
   - `style`: formato o estilos sin cambios funcionales.
   - `test`: pruebas.
   - `chore`: mantenimiento o configuración.
   - También puedes usar `perf`, `build` o `ci` cuando describan mejor el cambio.
3. Escribe un asunto breve, en presente, que describa el cambio concreto. Añade un ámbito cuando ayude a identificar la parte afectada, por ejemplo `fix(game): prevent movement outside the canvas` o `refactor(main-scene): simplify asteroid spawning`.
4. Al final de la respuesta que entrega el cambio, muestra un bloque `bash` con los comandos exactos. Añade un `git add --` por cada archivo específico y un único commit para el cambio atómico:

   ```bash
   git add -- "src/main.js"
   git commit --only -m "fix(game): prevent movement outside the canvas" -- "src/main.js"
   ```

5. Si se modificaron varios archivos, enumera explícitamente solo esos archivos tanto al añadir como al crear el commit. Cita las rutas para que sean seguras con espacios. Para archivos eliminados, usa su ruta eliminada; para renombres, especifica las rutas implicadas.
6. Si un archivo contiene cambios preexistentes del usuario mezclados con los de la tarea y no puedes separarlos con seguridad, no propongas un comando que los incluya: indica brevemente el problema y pide que se separen primero.
7. Si no hay cambios de archivos, no generes comandos de commit.

## Límites

- Usa el formato `tipo(ámbito): asunto`; el ámbito es opcional.
- No uses `git add .`, `git add -A` ni otros comandos que añadan cambios indiscriminadamente.
- `git commit --only` limita el commit a las rutas indicadas, aunque ya haya otros archivos preparados en el índice.
- Nunca incluyas `git push`. El commit debe permanecer local.
- No afirmes que el commit se creó: los comandos solo se sugieren y requieren que el usuario los ejecute.
