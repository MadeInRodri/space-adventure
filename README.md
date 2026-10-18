# Space Adventure

SpaceAdventure es un videojuego arcade de desplazamiento vertical construido con JavaScript y Phaser. Pilota una nave, esquiva asteroides y recoge monedas para conseguir la mayor puntuación posible.

## Funciones

### Sitio web

- Interfaz adaptable con estética futurista, colores verde y negro y tipografía pixel art.
- Fondo galáctico y marco decorativo alrededor del canvas del juego.
- Música relajante en el menú, con un botón flotante para activar o detener la música.
- Los controles táctiles se muestran inicialmente en dispositivos con puntero táctil. En computadoras empiezan ocultos y se pueden mostrar u ocultar con el botón flotante.
- Sección con récord personal y las cinco mejores puntuaciones, incluyendo fecha y hora. El historial se carga y guarda en `localStorage` del navegador.
- Footer con créditos del proyecto.

### Juego

- Desplazamiento vertical: asteroides y monedas aparecen desde la parte superior.
- Movimiento de la nave con las flechas del teclado o con la botonera táctil.
- Tres vidas; los choques con asteroides restan una vida y activan una invulnerabilidad temporal.
- Tres tipos de monedas que suman 1, 5 o 10 puntos.
- Animaciones, efectos de sonido y música de juego.
- Controles para iniciar, pausar, reanudar y reiniciar la partida.
- La ronda termina al perder las tres vidas y registra el resultado en el historial.

## Tecnologías

- **JavaScript** con módulos ES.
- **Phaser 4** para el canvas, la escena y la lógica del videojuego.
- **Vite** para ejecutar el servidor de desarrollo y generar la compilación de producción.
- **HTML y CSS** para la interfaz, estilos adaptables y controles externos al canvas.
- **localStorage** para guardar las mejores puntuaciones en el navegador; no requiere servidor ni base de datos.

## Recursos visuales del sitio web

Estos recursos corresponden a la interfaz de la página, no a los sprites que aparecen dentro del juego:

- **Fondo galáctico:** `public/assets/bg-page.png`.
- **Fuente:** [Press Start 2P](https://fonts.google.com/specimen/Press+Start+2P), cargada desde Google Fonts. Se utilizan fuentes monoespaciadas de respaldo si no está disponible.
- **Favicon:** `public/favicon.svg`, utilizado como icono de la pestaña del navegador.

La interfaz y el canvas del juego también usan CSS para generar bordes, brillos, paneles y botones; no requieren imágenes adicionales para esos detalles.

## Requisitos

- Node.js compatible con Vite 8 (Node.js 20.19+ o 22.12+).
- npm.

## Ejecución local

Instala las dependencias:

```bash
npm install
```

Inicia el servidor de desarrollo:

```bash
npm run dev
```

Vite mostrará la dirección local donde puedes abrir el juego.

## Compilación y vista previa

Genera la versión optimizada:

```bash
npm run build
```

Los archivos listos para publicar se generan en `dist/`. Para probar esa compilación localmente:

```bash
npm run preview
```

## Publicación en Netlify

Al conectar el repositorio a Netlify, configura:

- **Build command:** `npm run build`
- **Publish directory:** `dist`
- **Base directory:** vacío, si `package.json` está en la raíz del repositorio.

Netlify genera `dist/` durante la compilación; no es necesario versionar esa carpeta.

## Controles

| Acción                        | Control                                    |
| ----------------------------- | ------------------------------------------ |
| Mover la nave                 | Flechas del teclado o botonera direccional |
| Iniciar la partida            | Botón «Iniciar misión»                     |
| Pausar o reanudar             | Botón «Pausar» / «Reanudar»                |
| Reiniciar                     | Botón «Reiniciar»                          |
| Mostrar u ocultar la botonera | Botón flotante de controles táctiles       |
| Activar o detener la música   | Botón flotante de música                   |
