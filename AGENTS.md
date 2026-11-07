# Guía del proyecto SpaceAdventure

## Contexto

SpaceAdventure es un videojuego arcade de desplazamiento vertical para navegador, construido con JavaScript, Phaser 4 y Vite. El jugador mueve una nave, esquiva asteroides, recoge monedas, administra tres vidas y consulta sus mejores puntuaciones, guardadas en `localStorage`. La interfaz incluye controles de teclado y táctiles, música, efectos de sonido y acciones para iniciar, pausar y reiniciar.

Los recursos del juego y del sitio están en `public/assets/`. La página se monta desde `index.html`; `src/style.css` contiene actualmente todos los estilos.

## Estado actual y dirección arquitectónica

La refactorización está en curso. `src/main.js` es el punto de entrada; `src/app/createApp.js` monta y coordina la aplicación; `src/ui/markup.js` define el marcado y `src/ui/controls.js` conecta controles DOM con eventos del juego. La presentación y persistencia de puntuaciones viven en `src/ui/scoreBoard.js` y `src/scores/scoreRepository.js`. La escena Phaser vive en `src/game/scenes/SpaceScene.js`, su configuración en `src/game/createGame.js` y los nombres de eventos compartidos en `src/game/events.js`. El audio aún se coordina desde `createApp.js` y podría extraerse en la fase correspondiente. Inspecciona los archivos actuales antes de asumir qué fases o módulos existen.

La estructura siguiente es el destino gradual de la refactorización, no describe archivos que necesariamente ya existan:

```text
src/
  main.js                    # Punto de entrada
  app/
    createApp.js             # Inicialización y coordinación entre UI y juego
  game/
    createGame.js            # Configuración e instancia de Phaser
    events.js                # Nombres compartidos de eventos del juego
    scenes/
      SpaceScene.js          # Estado y lógica de la partida
  ui/
    markup.js                # Marcado de la interfaz
    controls.js              # Acciones y estado visual de los controles
    scoreBoard.js            # Presentación de puntuaciones
  scores/
    scoreRepository.js       # Lectura, validación y persistencia de récords
  audio/
    audioController.js       # Coordinación de música y efectos
  style.css                 # Estilos; mantenerlo unificado hasta que dividirlo aporte claridad
```

El plan y las fases de migración están documentados en [docs/refactor-plan.md](docs/refactor-plan.md).

Al trabajar durante la transición:

- No asumas que la estructura objetivo ya fue implementada. Inspecciona el estado real antes de editar.
- Si una solicitud no incluye refactorización, realiza el cambio en la estructura existente y evita mezclar una reorganización amplia con una corrección o funcionalidad.
- Al crear o modificar lógica JavaScript, aplica la skill `.github/skills/document-code-logic` para documentar en español las decisiones y comportamientos no obvios con comentarios breves; evita comentar instrucciones evidentes.
- Al refactorizar, extrae responsabilidades de forma incremental y conserva el comportamiento visible y las mecánicas actuales.
- Mantén límites claros: la escena gestiona la partida; el repositorio de puntuaciones gestiona validación y almacenamiento; la UI representa datos y emite acciones; el coordinador conecta UI y juego; el controlador de audio coordina reproducción y silencio.
- Evita que la escena manipule el DOM o `localStorage`, y evita que los controladores de UI dependan directamente de detalles internos de la escena. Usa eventos o una API explícita del coordinador para comunicar componentes.
- Define los nombres de eventos compartidos en un solo lugar. Limpia listeners al destruir o reinicializar componentes para evitar registros duplicados.
- Mantén la solución en JavaScript con módulos ES nativos, Phaser y Vite. No añadas un framework, gestor global de estado ni capas de abstracción sin una necesidad concreta o una solicitud explícita.
- Extrae la escena como una unidad antes de dividir sus mecánicas en más módulos. Divide CSS solo cuando facilite cambios localizados.
- Actualiza comentarios que hayan quedado obsoletos al cambiar una funcionalidad.

## Desarrollo y validación

- `npm run dev`: inicia el servidor local de Vite.
- `npm run build`: genera la compilación de producción en `dist/`.
- `npm run preview`: sirve localmente la compilación.
- No hay un script de pruebas automatizadas definido actualmente en `package.json`. No informes que se ejecutaron pruebas automatizadas si no se añadieron o configuraron.
- Para cambios en lógica, UI, controles, audio o puntuaciones, valida el flujo afectado además de ejecutar `npm run build` cuando sea posible.

## Convenciones del proyecto

- Sigue el estilo existente de JavaScript y CSS, usa nombres descriptivos y conserva la interfaz en español.
- Preserva accesibilidad y estados de interacción de la página: etiquetas ARIA, foco visible, botones deshabilitados cuando corresponda y mensajes de estado.
- Conserva el soporte para teclado, controles táctiles y pantallas pequeñas al modificar el movimiento o la interfaz.
- No cambies formatos ni claves persistidas en `localStorage` sin contemplar compatibilidad con los datos ya guardados.
- Mantén assets estáticos en `public/` y referencia sus rutas públicas como `/assets/...`.
