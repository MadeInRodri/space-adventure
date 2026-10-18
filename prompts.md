# Prompts del proyecto SpaceAdventure

Registro personal de los pedidos realizados durante esta sesión y de los cambios o respuestas asociados.

## 1. Interfaz inicial y videojuego

**Prompt:** Vamos a hacer un videojuego en Javascript utilizando Phaser.

Genera lo que será la interfaz del videojuego, siendo el título arriba (SpaceAdventure), el canvas que contendrá el videojuego en medio, y detalles de la creación abajo (Footer).

La página deberá seguir una estética futurista, con una fuente 8-bit de color verde, esta parte centrada en la pantalla, atrás llevará un fondo de una galaxia que se encuentra en assets (bg-page), esto irá abajo del canva que contendrá el juego. El canva será cuadrado, con unos bordes parecidos a una interfaz de futurista siguiendo la misma línea del título, abajo tendrá un botón centrado el cual será el botón de play para inicializar el juego.

El juego es un Shoot’em up en el cual deberás de esquivar asteroides y recoger monedas para ganar puntos, el juego tendrá un desplazamiento de tipo Vertical Scrolling, dónde los obstáculos y recompensas vendrán desde arriba. El usuario debe controlar la nave con las flechas del teclado. El jugador contará con un contador de 3 vidas en la esquina superior izquierda las cuales irá perdiendo conforme choque con los asteroides que aparecerán de manera aleatoria en la pantalla, además de un contador de puntos (las monedas) que estará en la esquina superior derecha, hay 3 tipos de monedas, una que brinda 1 punto, otra de 5 y otra de 10.

Utiliza los assets en la carpeta /public/assets, la mayoría son estáticos, pero las monedas, denomidadas (coin_n.png) son un tile con 4 imágenes en horizontal, ya que es una animación, lo mismo. la imagen asteroids.png contiene 4 imágenes de asteroides en horizontal, del más grande al más pequeño de izquierda a derecha, para utilizarlos de manera variada.

**Resumen:** Se creó la interfaz de la página y el juego con Phaser, incluyendo movimiento, colisiones, vidas, puntuación, animaciones y sonidos.

## 2. Música de fondo

**Prompt:** Lo siguiente que vamos a hacer es agregar música de fondo a la página web.

En los assets existe un archivo llamado `music-menu.mp3` el cual es una pista de una música relajante que debe sonar cuando el usuario entre a página.

La música debe deneterse cuando el usuario esté jugando, además de eso, agrega un botón flotante para detener la música en cualquier momento.

**Resumen:** Se añadió música en bucle para el menú, cambio entre música del menú y del juego, y un botón flotante para activar o silenciar el audio.

## 3. Comentarios en el código

**Prompt:** Documenta el código por medio de comentarios.

Agrega comentarios separando la lógica del juego, las distintas funcionalidades, y explicación de funciones implementadas que existen actualmente y en las que generes después.

**Resumen:** Se agregaron comentarios en español a las secciones principales de `main.js` y se anotaron posibles mejoras futuras.

## 4. Pausa y reinicio

**Prompt:** Agrega un botón de pausa y otro de reiniciar al juego.

Agrega dos botones al lado del botón de play para pausar y reiniciar, aplica un estilo inverso al botón primario para estos, para que el jugador puede ver que son botones con acciones secundarias.

**Resumen:** Se añadieron los controles para pausar, reanudar y reiniciar una partida, con estilos y estados habilitados según corresponda.

## 5. Récords personales

**Prompt:** Agrega un record personal que se guarde en `localStorage` para que el usuario sepa su puntuación máxima en todo momento.

Agrega una sección de stats del jugador debajo de la zona de botones, en dónde el usuario pueda consultar un top 5 de sus máximas puntuaciones, debe contener la cantidad de puntos obtenida, y la fecha y hora del momento en que se obtuvo, todo guardado y cargado desde el `localStorage`.

**Resumen:** Se agregó una sección de estadísticas con récord personal e historial de cinco puntuaciones, persistidos en el navegador.

## 6. Controles táctiles

**Prompt:** Agrega controles para móviles.

Agrega una botonera debajo del canvas con la dirección de la nave, de manera que pueda ser controlada en dispositivos táctiles.

La botonera debe seguir el estilo futurista de la página y la gama de colores verde y negro.

**Resumen:** Se implementó un pad direccional con botones de presión sostenida integrado a la misma lógica de movimiento que las flechas.

## 7. Mostrar u ocultar controles táctiles

**Prompt:** Agregar un botón flotante para ocultar los controles táctiles; en computadoras deben iniciar ocultos y poder activarse con ese botón.

**Resumen:** Se añadió un control flotante accesible para alternar la botonera. El estado inicial se determina según la capacidad de puntero táctil.

## 8. README

**Prompt:** Crea un README documentando la creación del proyecto

Este debe incluir el título del juego, las funciones que este implementa, la librería utilizada, assets utilizados como la fuente e imágenes (solo el sitio web).

**Resumen:** Se creó `README.md` con la descripción del proyecto, tecnologías, recursos del sitio, comandos de desarrollo y pasos básicos de despliegue.

## 9. Evitar selección accidental de texto y bloquear scroll durante la partida móvil

**Prompt:** Evita que el texto de la página se pueda seleccionar durante el juego en móvil, además en teléfonos, bloquea el scroll al iniciar el juego y restablecerlo al perder o pausar.

**Resumen:** Se aplicó `user-select: none` globalmente, incluyendo la variante para navegadores WebKit.

Se agregó un bloqueo de scroll condicionado a dispositivos táctiles, activo durante el juego y liberado al pausar o perder.

# Validación del resultado

El videojuego fue testeado en cada prompt, verificando las nuevas funciones imlpementadas, además de identificando errores o bugs que corregir en el próximo prompt.

Ya en su despliege con Netlify el juego fue probado por tres personas en distintos dispositivos para confirmar su funcionamiento en móviles.

# Reflexión final

**Lo que aprendí:** La IA es la herramienta más versátil cuando se utiliza como un agente correctamente, pero se le debe de dar un contexto acertado para conseguir los resultados esperados, en esta práctica antes de siquiera hacer el primer promtp investigué sobre la tecnología que quería aplicar (en este caso una librería de JS llamada Phaser) y cuando se tiene un conocimiento básico de la tecnología a utilizar y la idea de lo que se debe hacer, se pueden conseguir resultados muy buenos.

**Ventajas y límites de la IA:** Pude identificar que la ventaja más grande al utilizar una IA es la rapidez con la que se puede generar código funcional basado en documentación oficial de las tecnologías utilizadas, lo cual es un ahorro enorme de tiempo y esfuerzo.

Pero como límite, está la parte creativa, pues la IA no puede proponer una idea, o estilo artístico para el proyecto que sea original, puesto que se basa en lo que ya está construído, por lo qué para la identidad del juego, (música, assets y fondos), usé mi criterio, y mi creatividad para buscar los recursos que me ayudaron a llegar a un resultado estéticamente satisfactorio.

**Partes del código que comprendo y lo que hay que reforzar:** En mi caso, al haber realizado una investigación y un pequeño proyecto demo antes de hacer vibecoding, entiendo lo básico necesario para este proyecto, como lo puede ser la creación del escenario, el seteo de los recursos y variables que interactúan en el canvas, además de algoritmos de ordenamiento para el puntaje y almacenamiento en el local storage.

Las partes que necesitaría reforzar serían las que tienen que ver con el gameplay, ya sea el sistema de vidas, o las colisiones de la nave con los asteroides.
