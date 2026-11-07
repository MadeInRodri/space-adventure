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

- [x] Confirmar que `npm run build` pasa antes de reorganizar archivos.
- [x] Identificar los flujos que deben preservarse y documentar una lista manual repetible.
- [x] Registrar desde el código la clave y el formato que se deben preservar para las puntuaciones.
- [x] Completar la lista manual en un navegador con el estado actual; se ejecutó parcialmente y los resultados están registrados abajo.
- [x] Confirmar en navegador que una puntuación guardada anteriormente se carga.

**Resultados de referencia (7 de noviembre de 2026)**

- `npm run build`: correcto con Vite 8.3.4; generó la compilación de producción.
- Vite informa que el bundle JavaScript principal mide aproximadamente 1,390.93 kB minificado y supera el umbral de advertencia de 500 kB. Se registra como advertencia preexistente, no como fallo ni como alcance de esta fase.
- No hay pruebas automatizadas configuradas en `package.json`.
- Clave de almacenamiento: `space-adventure-high-scores`.
- Formato que admite el código: arreglo JSON de objetos con `score` entero seguro no negativo y `achievedAt` de tipo string interpretable como fecha. Al cargar, filtra entradas inválidas, ordena por puntuación descendente y, en empate, por fecha más reciente; conserva como máximo cinco. La compatibilidad con datos reales del navegador sigue pendiente de comprobación manual.
- Los flujos de partida se conectan mediante eventos de Phaser como `start-game`, `touch-direction`, `clear-touch-directions`, `game-started`, `game-paused`, `game-resumed` y `game-over`.
- En el navegador local: página y canvas visibles; se alternaron música (estado del control), visibilidad del pad, inicio, pausa/reanudación y reinicio; una ronda de prueba terminó y mostró un resultado de 0 puntos.
- Se cargó y recargó un récord sintético válido de 42 puntos para comprobar lectura y persistencia de la forma actual. Se retiró el resultado de prueba de 0 puntos y el dato sintético; tras recargar, la tabla quedó vacía como al inicio.
- La interacción confirma estados de UI, no la audibilidad del audio, el desplazamiento efectivo de la nave, la invulnerabilidad, el bloqueo de scroll táctil ni el funcionamiento en dispositivos físicos.
- El usuario completó después la revisión manual integral y reportó que movimiento, sonido, pausa y el resto de comportamientos probados funcionaron sin anomalías. No se especificaron navegador/dispositivo ni resultados individuales; esta confirmación complementa, pero no sustituye, las comprobaciones automatizadas inexistentes.

**Salida / criterio de aceptación**

- Hay una referencia de compilación y una lista repetible antes de modificar la arquitectura; la lista manual fue completada por el usuario antes de la fase 1.
- Se conoce la clave y el contrato de datos observables en el código; la carga de un registro sintético se verificó en navegador y el usuario reportó que las pruebas del comportamiento actual no presentaron anomalías.
- Los cambios de las siguientes fases no deben incluir arreglos de gameplay no relacionados con la extracción.

**Lista manual de referencia**

Las casillas marcadas inicialmente se comprobaron en la compilación local con interacciones de navegador. El usuario confirmó después haber probado el comportamiento restante y reportó que todo funcionó sin anomalías; no indicó navegador o dispositivo.

- [x] Primera carga: se muestran el canvas y la tabla vacía sin mensaje de error.
- [x] UI de música: el botón alterna el estado accesible de silenciado/activado. Pendiente comprobar reproducción audible.
- [x] UI de partida: iniciar actualiza el estado de los botones; pausa y reanudación cambian sus etiquetas.
- [x] UI táctil: en escritorio, el botón muestra y oculta el pad.
- [x] Reinicio: el botón reinicia una ronda activa.
- [x] Fin de partida: una ronda de prueba llegó al fin y mostró el estado «JUGAR DE NUEVO»; apareció un resultado en la tabla.
- [x] Persistencia de puntuación: un registro sintético válido apareció y sobrevivió una recarga; los datos de prueba se retiraron y se verificó de nuevo el estado vacío.
- [x] Movimiento con flechas y límites: el usuario reporta que el movimiento funcionó correctamente.
- [x] Controles táctiles: el usuario reporta que los controles probados funcionaron correctamente.
- [x] Colisiones y vidas: incluidos en la revisión funcional reportada por el usuario, sin anomalías.
- [x] Monedas: incluidas en la revisión funcional reportada por el usuario, sin anomalías.
- [x] Pausa y reanudación, incluido el audio: el usuario reporta funcionamiento sin anomalías.
- [x] Reinicio desde estados de partida: incluido en la revisión funcional reportada por el usuario, sin anomalías.
- [x] Récords y estados responsive: incluidos en la revisión funcional reportada por el usuario, sin anomalías; la carga sintética también se verificó localmente.
- [x] Audio audible y comportamiento general: el usuario reporta que todo funcionó sin anomalías.

### Fase 1 — Extraer puntuaciones y presentación

**Trabajo**

1. [x] Mover lectura, validación, ordenamiento y persistencia a `scores/scoreRepository.js`.
2. [x] Separar el renderizado de la tabla y récord personal en `ui/scoreBoard.js`.
3. [x] Hacer que la aplicación entregue el resultado de una partida al repositorio y notifique a la tabla; la escena no debe llamar a `localStorage` ni renderizar puntuaciones.
4. [x] Conservar el manejo explícito de errores y los mensajes actuales de carga/guardado.

**Resultados**

- `src/scores/scoreRepository.js` encapsula la clave existente, la validación del formato, el orden por puntuación/fecha, el límite de cinco y lectura/escritura. Acepta un proveedor de almacenamiento inyectable para verificar su lógica sin modificar el `localStorage` del navegador.
- `src/ui/scoreBoard.js` se ocupa exclusivamente de mostrar el récord, las filas de la tabla y el estado accesible.
- `src/main.js` coordina ambos módulos al cargar y al recibir `game-over`; `SpaceScene.endGame()` ya solo emite la puntuación y no conoce almacenamiento ni DOM.
- Los errores de lectura/escritura siguen registrados en consola y producen los mensajes de estado que existían.
- La lógica del repositorio se verificó con almacenamiento en memoria: carga vacía, filtrado de entradas no válidas, orden y límite de cinco, persistencia bajo la clave actual, carga con JSON inválido y errores de almacenamiento.
- En una carga de navegador sin iniciar una partida, el marcador mostró correctamente el récord ya existente de 48 puntos. Esta verificación fue de solo lectura y no modificó los datos del usuario.
- `npm run build` pasa después de la extracción. La advertencia previa de tamaño de bundle se mantiene y no fue introducida por esta fase.
- No se modificó ni migró el formato o los datos guardados existentes.

**Salida / criterio de aceptación**

- [x] Los cinco mejores resultados conservan el orden y las fechas actuales.
- [x] Datos guardados válidos siguen cargándose; datos inválidos no rompen el inicio del juego y el error sigue siendo visible.
- [x] La escena termina una partida y comunica su puntuación sin conocer el repositorio ni el DOM.

### Fase 2 — Extraer juego Phaser y eventos

**Trabajo**

1. [x] Mover `SpaceScene` sin alterar mecánicas a `game/scenes/SpaceScene.js`.
2. [x] Mover la configuración y construcción de `Phaser.Game` a `game/createGame.js`.
3. [x] Centralizar en `game/events.js` los eventos usados para iniciar, controlar pausa/reinicio, actualizar direcciones táctiles, cambiar música y notificar el estado/resultados.
4. [x] Definir comandos explícitos para iniciar/pausar/reanudar/reiniciar y eventos de salida para estados/resultados.
5. [x] Eliminar dependencias de la escena a estado de la página, bloqueo de scroll y música de menú; la preferencia de música se comunica mediante evento.
6. [x] Desregistrar listeners globales al cerrar la escena.

**Resultados**

- `SpaceScene` conserva la lógica y los recursos de Phaser, pero ahora vive en su propio módulo y solo exporta la escena.
- `createGame()` concentra la configuración de Phaser. La interfaz ya no instancia Phaser directamente ni consulta propiedades internas de la escena para controlar pausa o reinicio.
- `GAME_EVENTS` define los nombres de comandos y notificaciones usados por la página y la escena.
- La escena emite cambios de estado; `main.js` coordina la interfaz, el bloqueo de scroll y la música del menú. El evento de preferencia de música mantiene la música del juego sincronizada sin que la escena lea variables del módulo principal.
- `SpaceScene` retira sus listeners del emisor global cuando Phaser cierra la escena.
- Se mantiene la preferencia inicial de música habilitada y el comportamiento previo al comenzar, pausar, reanudar, reiniciar y terminar una partida.
- Al comenzar cada ronda, la página vuelve a sincronizar la preferencia de música con la escena para cubrir también cambios ocurridos durante la carga inicial.
- `npm run build` pasa. La advertencia de bundle mayor a 500 kB persiste; la extracción modular no incorpora división de código.
- En navegador se verificaron carga del canvas y récord existente, inicio, pausa, reanudación, alternancia de música, reinicio de una ronda y que el récord no cambiara durante la prueba.
- La lista completa de regresión de gameplay de la fase 0 queda pendiente de volver a ejecutar tras la extracción.

**Salida / criterio de aceptación**

- [x] Phaser se crea mediante una sola función y la escena permanece responsable del ciclo de juego.
- [x] La UI no necesita consultar campos internos de la escena para determinar el estado.
- [ ] Completar la lista de regresión manual de la fase 0 tras la extracción, incluidos movimiento, controles táctiles, colisiones/vidas, monedas y fin de partida.

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
