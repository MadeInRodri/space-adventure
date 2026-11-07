import Phaser from "phaser";
import { SpaceScene } from "./scenes/SpaceScene.js";

// Mantiene en un solo lugar la configuración y el montaje del juego.
export function createGame() {
  return new Phaser.Game({
    type: Phaser.AUTO,
    parent: "game-canvas",
    width: 480,
    height: 480,
    backgroundColor: "#030811",
    pixelArt: true,
    roundPixels: true,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [SpaceScene],
  });
}
