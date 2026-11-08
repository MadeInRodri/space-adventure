# Refactorización y personalización de Space Adventure

## Lógica monolítica anterior

Este fue el primer proyecto que presenté en el bootcamp: un videojuego de naves desarrollado en JavaScript con [Phaser](https://docs.phaser.io/). En su versión inicial, toda la lógica estaba concentrada en `main.js`, un archivo de más de 700 líneas que mezclaba la interfaz, las escenas, las mecánicas del juego, el audio y los controles. Esa organización dificultaba el mantenimiento y la incorporación de nuevas funciones.

## Refactorización

El proyecto se reorganizó gradualmente mediante módulos ES con responsabilidades separadas. El [plan de refactorización](./refactor-plan.md) recoge las fases de trabajo, numeradas del 0 al 7, y los criterios usados para conservar el comportamiento existente mientras se modificaba la arquitectura.

La estructura siguiente refleja el estado final implementado. Se muestran los archivos principales y se omiten los recursos individuales dentro de `public/assets/`:

```text
SpaceAdventure/
├── index.html
├── package.json
├── public/
│   ├── favicon.svg
│   └── assets/                  # Imágenes y audio del sitio y del juego
├── src/
│   ├── main.js                 # Punto de entrada
│   ├── style.css               # Estilos de la aplicación
│   ├── app/
│   │   └── createApp.js        # Montaje y coordinación de UI, juego y audio
│   ├── audio/
│   │   └── audioController.js  # Música, silencio y sincronización con la partida
│   ├── game/
│   │   ├── createGame.js       # Configuración e instancia de Phaser
│   │   ├── events.js           # Eventos compartidos entre la aplicación y el juego
│   │   ├── config/
│   │   │   └── gameplay.js     # Valores de juego y modos de dificultad
│   │   └── scenes/
│   │       └── SpaceScene.js   # Estado y lógica de la partida
│   ├── scores/
│   │   └── scoreRepository.js  # Validación y persistencia de puntuaciones
│   └── ui/
│       ├── controls.js         # Controles y estados de la interfaz
│       ├── markup.js           # Marcado de la interfaz
│       └── scoreBoard.js       # Presentación de las puntuaciones
└── docs/
    ├── nota-tecnica.md
    └── refactor-plan.md
```

La escena mantiene las mecánicas del juego; la interfaz y el audio se comunican con ella a través del coordinador y de eventos compartidos. Las reglas configurables —incluidos los modos Principiante, Normal y Oneshot— se encuentran en `game/config/gameplay.js`. En el modo Principiante se regeneran vidas con corazones, hasta el máximo definido. No se creó una carpeta `game/systems/`: las mecánicas permanecen en la escena mientras no haya una necesidad concreta de separarlas.

## Skills utilizadas

Durante el trabajo se utilizaron tres skills: dos propias del proyecto y una de apoyo para el diseño visual.

### [phaser-conventional-commit](../.github/skills/phaser-conventional-commit/SKILL.md)

Skill del proyecto que prepara comandos para crear commits locales atómicos con el formato [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/). Los comandos se presentan para que la persona usuaria decida si ejecutarlos.

### [document-code-logic](../.github/skills/document-code-logic/SKILL.md)

Skill del proyecto que promueve comentarios breves, descriptivos y en español para explicar decisiones y comportamientos no evidentes en el código.

### [frontend-design](https://github.com/anthropics/skills/tree/main/skills/frontend-design)

Skill externa de diseño de interfaces, disponible en [skills.sh](https://skills.sh/). Se utilizó como apoyo para definir una dirección visual coherente en cuanto a colores, tipografía, jerarquía y composición.
