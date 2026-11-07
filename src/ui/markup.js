// Estructura accesible de la página que contiene el juego y sus controles.
export const GAME_MARKUP = `
  <main class="page-shell">
    <header class="site-header">
      <p class="eyebrow"><span class="status-light"></span> MADEINRODRI // AI POWERED. 2025</p>
      <h1>SPACE<span> ADVENTURE</span></h1>
      <p class="intro">UNA MISIÓN. UN UNIVERSO. ¿CUÁNTO PUEDES SOBREVIVIR?</p>
    </header>

    <section class="game-section" aria-label="Videojuego SpaceAdventure">
      <div class="game-shell">
        <span class="corner corner-top-left" aria-hidden="true"></span>
        <span class="corner corner-top-right" aria-hidden="true"></span>
        <span class="corner corner-bottom-left" aria-hidden="true"></span>
        <span class="corner corner-bottom-right" aria-hidden="true"></span>
        <div id="game-canvas" aria-label="Juego: esquiva asteroides y recoge monedas"></div>
      </div>

      <div class="touch-controls is-hidden" id="touch-controls" role="group" aria-label="Controles táctiles de dirección">
        <button class="direction-button direction-up" type="button" data-direction="up" aria-label="Mover arriba">↑</button>
        <button class="direction-button direction-left" type="button" data-direction="left" aria-label="Mover a la izquierda">←</button>
        <span class="direction-center" aria-hidden="true">✦</span>
        <button class="direction-button direction-right" type="button" data-direction="right" aria-label="Mover a la derecha">→</button>
        <button class="direction-button direction-down" type="button" data-direction="down" aria-label="Mover abajo">↓</button>
      </div>

      <div class="game-actions" aria-label="Controles de la partida">
        <button class="play-button" id="play-button" type="button">
          <span class="play-icon" aria-hidden="true">▶</span>
          <span id="play-label">INICIAR MISIÓN</span>
        </button>
        <button class="secondary-button" id="pause-button" type="button" disabled>
          <span id="pause-icon" aria-hidden="true">Ⅱ</span>
          <span id="pause-label">PAUSAR</span>
        </button>
        <button class="secondary-button" id="restart-button" type="button" disabled>
          <span aria-hidden="true">↻</span>
          <span>REINICIAR</span>
        </button>
      </div>
      <p class="control-hint"><span>←</span> <span>↑</span> <span>↓</span> <span>→</span> PARA MOVERTE</p>

      <section class="player-stats" aria-labelledby="stats-title">
        <div class="stats-heading">
          <div>
            <p class="stats-kicker">ARCHIVO DE MISIONES</p>
            <h2 id="stats-title">TUS MEJORES PUNTUACIONES</h2>
          </div>
          <p class="personal-best">RÉCORD PERSONAL <span id="personal-best">00000</span></p>
        </div>
        <p class="stats-status" id="stats-status" aria-live="polite"></p>
        <div class="scores-table-wrap">
          <table class="scores-table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">PUNTOS</th>
                <th scope="col">FECHA Y HORA</th>
              </tr>
            </thead>
            <tbody id="scores-list"></tbody>
          </table>
        </div>
      </section>
    </section>

    <button class="music-button" id="music-button" type="button" aria-pressed="true">
      <span id="music-icon" aria-hidden="true">♫</span>
      <span id="music-label">APAGAR MÚSICA</span>
    </button>
    <button
      class="touch-controls-toggle"
      id="touch-controls-toggle"
      type="button"
      aria-controls="touch-controls"
      aria-expanded="false"
    >
      <span id="touch-toggle-icon" aria-hidden="true">⌖</span>
      <span id="touch-toggle-label">MOSTRAR CONTROLES</span>
    </button>

    <footer class="site-footer">
      <div class="footer-line"></div>
      <p>CREADO CON <span class="footer-heart">♥</span> Y MUCHO CAFÉ, por MADEINRODRI</p>
      <p class="footer-credit">SPACE ADVENTURE <span>·</span> EXPLORA. ESQUIVA. SOBREVIVE.</p>
    </footer>
  </main>
`;
