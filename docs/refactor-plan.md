# Plan de refactorización de SpaceAdventure

## Objetivo

Transformar gradualmente la aplicación monolítica en módulos JavaScript con responsabilidades claras, sin cambiar la experiencia actual del juego. La estructura debe facilitar nuevas mecánicas —por ejemplo, niveles de dificultad y objetos de curación— sin acoplar la lógica del juego al DOM, al almacenamiento del navegador o a los controles de interfaz.

Este documento describe el plan, no el estado ya implementado. La aplicación actual concentra el marcado, las puntuaciones, el audio, la escena Phaser y los controles en `src/main.js`; `src/style.css` reúne los estilos. No hay un script de pruebas automatizadas definido actualmente.

## Principios

- Hacer cambios incrementales y verificables; cada fase debe dejar el proyecto compilable.
- Conservar el comportamiento, los controles y los datos persistidos existentes salvo que una tarea solicite explícitamente cambiarlos.
- Mantener JavaScript, módulos ES, Phaser y Vite. No añadir un framework ni una arquitectura genérica sin una necesidad demostrada.
- Separar reglas del juego de su representación: la escena y los sistemas no deben manipular elementos DOM ni `localStorage`.
- Pasar dependencias explícitamente y comunicar componentes mediante una API pequeña o eventos compartidos.
- Evitar tanto un nuevo monolito de coordinación como dividir la escena en módulos diminutos antes de que exista una necesidad concreta.

## Estructura objetivo

```text
src/
  main.js
  app/
    createApp.js
  game/
    createGame.js
    events.js
    config/
      gameplay.js
    scenes/
      SpaceScene.js
    systems/                 # Añadir conforme las mecánicas lo justifiquen
  ui/
    markup.js
    controls.js
    scoreBoard.js
  scores/
    scoreRepository.js
  audio/
    audioController.js
  style.css
```

`systems/` es un destino posible para reglas y mecánicas que crezcan; no es necesario crear todos sus archivos al comienzo. Mantener `style.css` unificado hasta que la estructura de componentes o la frecuencia de cambios justifique dividirlo.

### Responsabilidades y dependencias

```text
main.js
  └── createApp
      ├── UI ──acciones──> coordinador ──comandos──> juego Phaser
      ├── juego Phaser ──eventos──> coordinador ──estado/datos──> UI
      ├── puntuaciones <── resultados de partida
      └── audio <── estado de menú/partida y preferencia de silencio
```

- `main.js`: importar estilos e iniciar la aplicación.
- `app/createApp.js`: construir componentes, conectar eventos y coordinar el ciclo de vida.
- `game/createGame.js`: crear y configurar Phaser; no añadir reglas de interfaz.
- `game/events.js`: centralizar nombres y contratos de los eventos entre la aplicación y Phaser.
- `game/scenes/SpaceScene.js`: coordinar el ciclo de la escena, objetos de Phaser, entrada y sistemas de juego.
- `game/config/gameplay.js`: reunir valores y opciones de las reglas que deban configurarse, evitando números dispersos.
- `ui/markup.js`, `ui/controls.js`, `ui/scoreBoard.js`: definir la estructura DOM, convertir interacciones en acciones y representar datos.
- `scores/scoreRepository.js`: validar, ordenar, cargar y persistir puntuaciones; mantener aislada la clave actual de `localStorage`.
- `audio/audioController.js`: encapsular música de menú y juego, efectos y preferencia de sonido.
- `game/systems/`: alojar mecánicas separables cuando haya suficiente complejidad; no debe depender del DOM ni del almacenamiento.

## Fases de trabajo

### Fase 0 — Caracterizar y establecer una referencia

**Trabajo**

- Confirmar que `npm run build` pasa antes de reorganizar archivos.
- Registrar los flujos que se deben preservar: primera carga, música de menú, inicio, movimiento con flechas y controles táctiles, colisión e invulnerabilidad, monedas, pausa/reanudación, reinicio, fin de partida, puntuaciones y silencio.
- Anotar el formato y la clave existente de puntuaciones: `space-adventure-high-scores`; comprobar compatibilidad con datos válidos ya guardados.
- Crear una lista de verificación manual repetible. No afirmar que existen pruebas automatizadas mientras no se configuren.

**Salida / criterio de aceptación**

- Hay una referencia de compilación y una lista clara de comportamiento actual antes de modificar la arquitectura.
- Se conoce el alcance de cada cambio y no se mezclan arreglos de gameplay no relacionados con la extracción.

### Fase 1 — Extraer puntuaciones y presentación

**Trabajo**

1. Mover lectura, validación, ordenamiento y persistencia a `scores/scoreRepository.js`.
2. Separar el renderizado de la tabla y récord personal en `ui/scoreBoard.js`.
3. Hacer que la aplicación entregue el resultado de una partida al repositorio y notifique a la tabla; la escena no debe llamar a `localStorage` ni renderizar puntuaciones.
4. Conservar el manejo explícito de errores y los mensajes actuales de carga/guardado.

**Salida / criterio de aceptación**

- Los cinco mejores resultados conservan el orden y las fechas actuales.
- Datos guardados válidos siguen cargándose; datos inválidos no rompen el inicio del juego y el error sigue siendo visible.
- La escena termina una partida y comunica su puntuación sin conocer el repositorio ni el DOM.

### Fase 2 — Extraer juego Phaser y eventos

**Trabajo**

1. Mover `SpaceScene` sin alterar mecánicas a `game/scenes/SpaceScene.js`.
2. Mover la configuración y construcción de `Phaser.Game` a `game/createGame.js`.
3. Centralizar en `game/events.js` los eventos actualmente usados para iniciar, actualizar direcciones táctiles, limpiar entradas y notificar estados de partida.
4. Definir claramente comandos de entrada y eventos de salida: iniciar/pausar/reanudar/reiniciar y actualizaciones de estado/resultados.
5. Eliminar dependencias implícitas de la escena a variables externas como el estado global del audio; inyectar dependencias o notificar al coordinador.
6. Desregistrar listeners al terminar el ciclo de vida de una escena o aplicación para prevenir suscripciones duplicadas.

**Salida / criterio de aceptación**

- Phaser se crea mediante una sola función y la escena permanece responsable del ciclo de juego.
- La UI no necesita consultar campos internos de la escena para determinar el estado.
- El conjunto de comportamientos de la fase 0 sigue funcionando.

### Fase 3 — Extraer UI y coordinador

**Trabajo**

1. Mover el template HTML a `ui/markup.js`.
2. Mover las suscripciones de botones, teclado/táctil y actualización de etiquetas a `ui/controls.js`.
3. Crear `app/createApp.js` para montar el marcado, iniciar Phaser y conectar acciones con eventos.
4. Mantener `src/main.js` como punto de entrada pequeño.
5. Asegurar que controladores de UI no llamen a métodos internos de `SpaceScene`; la comunicación pasa por la API/eventos de la aplicación.

**Salida / criterio de aceptación**

- La inicialización, la UI y el juego pueden leerse y cambiarse por separado.
- Los botones conservan estados habilitados, etiquetas, atributos ARIA y comportamiento en móvil/escritorio.
- El montaje no crea listeners ni instancias duplicadas.

### Fase 4 — Centralizar audio y configuración

**Trabajo**

1. Extraer la reproducción de audio del menú y la coordinación con la música del juego a `audio/audioController.js`.
2. Mantener el audio sincronizado con los eventos de inicio, pausa, reanudación, reinicio y fin de partida.
3. Reunir valores de gameplay que ya son parámetros coherentes en `game/config/gameplay.js` (por ejemplo, vidas iniciales, velocidad de movimiento y rangos de aparición).
4. Mantener los valores de presentación dentro de sus módulos de UI/escena cuando no sean reglas compartidas.

**Salida / criterio de aceptación**

- La música se detiene, reanuda y silencia con el mismo comportamiento observado en la fase 0.
- Las reglas configurables tienen una fuente de verdad y no cambian inadvertidamente la dificultad existente.

### Fase 5 — Preparar y añadir nuevas mecánicas

Las nuevas mecánicas son funcionalidades posteriores a la separación; no son requisito para considerar terminada la extracción estructural.

**Dificultad**

- Definir primero el comportamiento deseado: selección manual, progresión automática o ambas; niveles, límites y efecto sobre aparición/velocidad.
- Modelar dificultad como configuración de gameplay explícita, no como constantes repartidas por la escena.
- Hacer que un `difficultySystem` o función pura derive parámetros activos a partir de la configuración y del estado de partida. La escena/sistema de aparición consume dichos parámetros.
- Mantener límites para que progresión por tiempo o puntuación no escale indefinidamente.
- Si se agrega selección manual, la UI solo comunica la opción seleccionada; la regla y su validación pertenecen al juego/configuración.

**Curación**

- Modelar los objetos como pickups con tipo/efecto explícito, evitando condicionales de colisión cada vez más extensos.
- Un efecto de curación debe tener reglas declaradas: cantidad recuperada, máximo de vidas y si se permite recoger estando al máximo.
- Aplicar el efecto en una frontera común de recolección y actualizar el estado de vida/HUD mediante la misma ruta usada por otros cambios de vida.
- Definir una probabilidad/rango de aparición balanceado y mantener claramente diferenciados los pickups de monedas que afectan puntuación.

**Diseño de sistemas**

- Extraer, cuando corresponda, sistemas enfocados como `spawnSystem`, `collisionSystem`, `difficultySystem` o gestión de efectos de pickups. Introducir solo los que reduzcan acoplamiento real.
- Preferir reglas puras o configurables para balanceo cuando facilite la validación; Phaser se reserva para sprites, temporizadores, animaciones y colisiones visuales.
- Evitar que los sistemas se comuniquen por mutaciones ocultas entre sí. Las entradas, salidas y cambios de estado deben ser explícitos.

**Salida / criterio de aceptación**

- Cada mecánica nueva puede añadirse sin ampliar indiscriminadamente `SpaceScene` ni acoplar la UI a las reglas.
- Las reglas de salud, dificultad y recompensas tienen límites y casos de borde definidos antes de codificarse.

### Fase 6 — Pruebas y consolidación

**Trabajo**

- Tras extraer funciones puras (validación/ordenamiento de puntuaciones, configuración y reglas de dificultad/pickups), cubrirlas con pruebas unitarias. Evaluar primero las herramientas nativas de Node antes de sumar dependencias.
- Mantener verificación manual para renderizado Phaser, controles de puntero, audio y comportamiento responsive que no queden cubiertos por pruebas unitarias.
- El flujo mínimo de entrega es compilar con `npm run build` y probar los flujos afectados.
- Revisar comentarios obsoletos, imports circulares, dependencias invertidas y listeners que no se limpian.
- No añadir un framework de pruebas de navegador salvo que el alcance de interacciones automatizadas lo justifique.

**Salida / criterio de aceptación**

- Compilación limpia, reglas extraídas cubiertas donde sea razonable y lista manual ejecutada para las áreas visuales/interactivas afectadas.
- Sin cambios de gameplay no intencionados ni escrituras a una clave de almacenamiento distinta.

## Orden de dependencias y commits

El orden recomendado es: **Fase 0 → Fase 1 → Fase 2 → Fase 3 → Fase 4 → Fase 5**, con la Fase 6 aplicada desde que existan unidades comprobables y completada al final. Cada extracción debe ser un cambio acotado y revisable; ejecutar la compilación después de cada fase y conservar commits atómicos por responsabilidad. No hacer una reescritura completa en un único cambio.

## Fuera de alcance por ahora

- Migrar a React/Vue, TypeScript, un gestor global de estado o una arquitectura de plugins.
- Cambiar el diseño, la economía de puntos, las claves/datos guardados o el balance actual como parte de una extracción.
- Dividir CSS o la escena en numerosos módulos sin una necesidad surgida durante el trabajo.
- Implementar dificultad o curación antes de que se acuerden sus reglas de gameplay.

## Documentación relacionada

- [Guía del proyecto](../AGENTS.md): contexto e instrucciones que deben respetarse durante las intervenciones.
- [README](../README.md): funciones, tecnologías, ejecución y publicación actuales.
