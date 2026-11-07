---
name: document-code-logic
description: "Use whenever you implement, refactor, fix, or modify JavaScript or Phaser logic in this project, to add or update concise, descriptive Spanish code comments."
---

# Documentar la lógica del código

## Propósito

Explicar en el propio código, con comentarios breves y correctos en español, las decisiones y comportamientos que no sean evidentes. Esta skill aplica cada vez que se crea o modifica lógica JavaScript del proyecto, no solo cuando se solicita documentación.

## Procedimiento

1. Al terminar el cambio, revisa las funciones y secciones cuya intención, reglas o efectos secundarios podrían no ser evidentes para quien mantenga el código.
2. Añade o actualiza comentarios junto al código correspondiente. Explica el propósito, la razón de una decisión, una restricción o una interacción entre componentes; no narres línea por línea lo que ya expresa el código.
3. Usa español natural, preciso y gramaticalmente correcto. Mantén cada comentario tan breve como sea posible sin perder el contexto necesario.
4. Conserva los comentarios existentes que sigan siendo correctos y actualiza o elimina los que hayan quedado obsoletos tras el cambio.
5. Prioriza comentarios `//` para aclaraciones locales. Usa un bloque de documentación solo cuando aporte contexto útil sobre una función o API que se reutilizará.
6. Revisa ortografía, acentuación y puntuación, además de comprobar que cada comentario describe fielmente el comportamiento final.

## Criterios

- Documenta decisiones no obvias, límites, validaciones, manejo de fallos, efectos secundarios y comunicación entre módulos cuando ayude a mantener el código.
- No comentes asignaciones, llamadas o condiciones evidentes por sí solas.
- No agregues comentarios genéricos, repetitivos, redundantes ni promesas sobre comportamientos que el código no garantiza.
- No alteres la lógica únicamente para añadir comentarios.
- En código y comentarios nuevos, mantén el español como idioma de documentación. No traduzcas identificadores ni mensajes preexistentes fuera del alcance.
