import { GAME_EVENTS } from "../game/events.js";

// Coordina la música del menú, la del juego y la preferencia de silencio.
export function createAudioController(
  game,
  {
    doc = document,
    win = window,
    menuTrack = "/assets/music-menu.mp3",
  } = {},
) {
  const menuMusic = new win.Audio(menuTrack);
  const listeners = [];
  let musicEnabled = true;
  let gameRunning = false;

  menuMusic.loop = true;
  menuMusic.volume = 0.25;

  function listenToGame(eventName, handler) {
    game.events.on(eventName, handler);
    listeners.push(() => game.events.off(eventName, handler));
  }

  function listen(target, eventName, handler, options) {
    target.addEventListener(eventName, handler, options);
    listeners.push(() => target.removeEventListener(eventName, handler, options));
  }

  // Respeta la preferencia del jugador y los bloqueos de reproducción del navegador.
  function playMenuMusic() {
    if (!musicEnabled || gameRunning || !menuMusic.paused) return;

    menuMusic.play().catch((error) => {
      if (error.name !== "NotAllowedError") {
        console.error("No se pudo reproducir la música del menú.", error);
      }
    });
  }

  listenToGame(GAME_EVENTS.GAME_STARTED, () => {
    gameRunning = true;
    menuMusic.pause();
    game.events.emit(GAME_EVENTS.MUSIC_CHANGED, musicEnabled);
  });

  listenToGame(GAME_EVENTS.GAME_OVER, () => {
    gameRunning = false;
    playMenuMusic();
  });

  listenToGame(GAME_EVENTS.MUSIC_CHANGED, (enabled) => {
    musicEnabled = enabled;
    if (!enabled) {
      menuMusic.pause();
    } else if (!gameRunning) {
      playMenuMusic();
    }
  });

  // Los primeros gestos permiten reproducir audio en navegadores que bloquean el autoplay.
  listen(doc, "pointerdown", playMenuMusic, { once: true });
  listen(doc, "keydown", playMenuMusic, { once: true });
  playMenuMusic();

  return {
    destroy() {
      listeners.splice(0).forEach((removeListener) => removeListener());
      menuMusic.pause();
    },
  };
}
