import { createGame } from "../game/createGame.js";
import { GAME_EVENTS } from "../game/events.js";
import { createAudioController } from "../audio/audioController.js";
import { createScoreRepository } from "../scores/scoreRepository.js";
import { bindGameControls } from "../ui/controls.js";
import { GAME_MARKUP } from "../ui/markup.js";
import { createScoreBoard } from "../ui/scoreBoard.js";

// Construye y conecta las partes de la aplicación sin mezclar sus responsabilidades.
export function createApp({
  root = document.querySelector("#app"),
} = {}) {
  if (!root) {
    throw new Error('No se encontró el elemento raíz "#app".');
  }
  if (root.dataset.spaceAdventureInitialized === "true") {
    throw new Error("SpaceAdventure ya está inicializado en este elemento.");
  }

  const doc = root.ownerDocument;
  const win = doc.defaultView;
  root.innerHTML = GAME_MARKUP;
  root.dataset.spaceAdventureInitialized = "true";

  const scoreRepository = createScoreRepository();
  const scoreBoard = createScoreBoard(root);
  const initialScores = scoreRepository.load();
  scoreBoard.render(initialScores.scores);
  if (initialScores.error) {
    scoreBoard.setStatus("NO SE PUDIERON CARGAR LOS RÉCORDS GUARDADOS.");
  }

  const game = createGame(root.querySelector("#game-canvas"));
  const audioController = createAudioController(game, { doc, win });
  const unbindControls = bindGameControls(game, { root, win });
  const listeners = [];
  const hasCoarsePointer = win.matchMedia("(pointer: coarse)").matches;

  // Bloquea el desplazamiento solo en dispositivos táctiles durante la partida.
  function setPageScrollLocked(locked) {
    if (hasCoarsePointer) {
      doc.documentElement.classList.toggle("game-scroll-locked", locked);
    }
  }

  function listenToGame(eventName, handler) {
    game.events.on(eventName, handler);
    listeners.push(() => game.events.off(eventName, handler));
  }

  listenToGame(GAME_EVENTS.GAME_STARTED, () => {
    setPageScrollLocked(true);
  });

  listenToGame(GAME_EVENTS.GAME_PAUSED, () => {
    setPageScrollLocked(false);
  });

  listenToGame(GAME_EVENTS.GAME_RESUMED, () => {
    setPageScrollLocked(true);
  });

  listenToGame(GAME_EVENTS.GAME_OVER, (score) => {
    setPageScrollLocked(false);

    // La escena entrega el resultado; aquí se persiste y se actualiza la interfaz.
    const result = scoreRepository.save(score);
    if (result.error) {
      scoreBoard.setStatus(
        "NO SE PUDO GUARDAR ESTA PUNTUACIÓN EN ESTE NAVEGADOR.",
      );
    } else {
      scoreBoard.setStatus("");
      scoreBoard.render(result.scores);
    }
  });

  return {
    game,
    destroy() {
      unbindControls();
      listeners.splice(0).forEach((removeListener) => removeListener());
      audioController.destroy();
      game.destroy(true);
      setPageScrollLocked(false);
      root.replaceChildren();
      delete root.dataset.spaceAdventureInitialized;
    },
  };
}
