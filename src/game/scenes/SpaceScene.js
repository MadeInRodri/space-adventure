import Phaser from "phaser";
import { GAME_EVENTS } from "../events.js";

// Escena principal: contiene el estado y las reglas de cada partida.
export class SpaceScene extends Phaser.Scene {
  constructor() {
    super("space");
    // Estado de la partida y colecciones de objetos que caen desde la parte superior.
    this.asteroids = [];
    this.coins = [];
    this.lives = 3;
    this.score = 0;
    this.running = false;
    this.paused = false;
    this.invulnerable = false;
    this.musicEnabled = true;
    this.touchDirections = new Set();
  }

  // Precarga fondos, spritesheets y efectos de sonido antes de crear la escena.
  preload() {
    this.load.image("space-background", "/assets/bg-game.png");
    this.load.image("ship", "/assets/ship.png");
    this.load.image("heart", "/assets/heart.png");
    this.load.spritesheet("asteroids", "/assets/asteroids.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.spritesheet("coin-1", "/assets/coin_1.png", {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.spritesheet("coin-5", "/assets/coin_5.png", {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.spritesheet("coin-10", "/assets/coin_10.png", {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.spritesheet("explosion", "/assets/explosion.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.audio("coin-sound", "/assets/coin.wav");
    this.load.audio("hit-sound", "/assets/heart.wav");
    this.load.audio("explosion-sound", "/assets/explosion.wav");
    this.load.audio("lose-sound", "/assets/lose.wav");
    this.load.audio("game-music", "/assets/music-game.mp3");
  }

  // Construye el fondo con scroll, HUD, nave, controles, textos y sonidos.
  create() {
    this.background = this.add
      .tileSprite(240, 240, 480, 480, "space-background")
      .setDepth(0);

    this.createAnimations();
    this.createHud();

    this.player = this.add
      .image(240, 390, "ship")
      .setDisplaySize(44, 44)
      .setDepth(3);
    this.cursors = this.input.keyboard.createCursorKeys();

    this.prompt = this.add
      .text(240, 235, "PREPÁRATE, PILOTO", {
        fontFamily: '"Press Start 2P", monospace',
        fontSize: "12px",
        color: "#a8ffb4",
        align: "center",
        stroke: "#06100d",
        strokeThickness: 4,
      })
      .setOrigin(0.5)
      .setDepth(4);

    this.music = this.sound.add("game-music", { loop: true, volume: 0.24 });
    this.coinSound = this.sound.add("coin-sound", { volume: 0.45 });
    this.hitSound = this.sound.add("hit-sound", { volume: 0.4 });
    this.explosionSound = this.sound.add("explosion-sound", { volume: 0.28 });
    this.loseSound = this.sound.add("lose-sound", { volume: 0.4 });

    this.game.events.on(GAME_EVENTS.START_GAME, this.startGame, this);
    this.game.events.on(GAME_EVENTS.PAUSE_GAME, this.pauseGame, this);
    this.game.events.on(GAME_EVENTS.RESUME_GAME, this.resumeGame, this);
    this.game.events.on(GAME_EVENTS.RESTART_GAME, this.restartGame, this);
    this.game.events.on(
      GAME_EVENTS.TOUCH_DIRECTION,
      this.setTouchDirection,
      this,
    );
    this.game.events.on(
      GAME_EVENTS.CLEAR_TOUCH_DIRECTIONS,
      this.clearTouchDirections,
      this,
    );
    this.game.events.on(
      GAME_EVENTS.MUSIC_CHANGED,
      this.setMusicEnabled,
      this,
    );
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.onShutdown, this);
  }

  // Retira las suscripciones globales cuando Phaser destruye esta escena.
  onShutdown() {
    this.game.events.off(GAME_EVENTS.START_GAME, this.startGame, this);
    this.game.events.off(GAME_EVENTS.PAUSE_GAME, this.pauseGame, this);
    this.game.events.off(GAME_EVENTS.RESUME_GAME, this.resumeGame, this);
    this.game.events.off(GAME_EVENTS.RESTART_GAME, this.restartGame, this);
    this.game.events.off(
      GAME_EVENTS.TOUCH_DIRECTION,
      this.setTouchDirection,
      this,
    );
    this.game.events.off(
      GAME_EVENTS.CLEAR_TOUCH_DIRECTIONS,
      this.clearTouchDirections,
      this,
    );
    this.game.events.off(
      GAME_EVENTS.MUSIC_CHANGED,
      this.setMusicEnabled,
      this,
    );
  }

  // Sincroniza la música de la escena con la preferencia elegida en la interfaz.
  setMusicEnabled(enabled) {
    this.musicEnabled = enabled;
    if (!enabled) {
      this.music.pause();
    } else if (this.running && !this.paused) {
      this.music.play();
    }
  }

  // Define las animaciones en bucle de monedas y la animación de una explosión.
  createAnimations() {
    ["coin-1", "coin-5", "coin-10"].forEach((key) => {
      this.anims.create({
        key,
        frames: this.anims.generateFrameNumbers(key, { start: 0, end: 3 }),
        frameRate: 8,
        repeat: -1,
      });
    });

    this.anims.create({
      key: "explosion-animation",
      frames: this.anims.generateFrameNumbers("explosion", {
        start: 0,
        end: 7,
      }),
      frameRate: 14,
      hideOnComplete: true,
    });
  }

  // Dibuja las tres vidas y el marcador de puntos en la capa superior del canvas.
  createHud() {
    this.heartIcons = [0, 1, 2].map((index) =>
      this.add
        .image(28 + index * 23, 29, "heart")
        .setOrigin(0.5)
        .setScale(1.7)
        .setDepth(5),
    );

    this.add
      .text(453, 20, "PUNTOS", {
        fontFamily: '"Press Start 2P", monospace',
        fontSize: "8px",
        color: "#a8ffb4",
        align: "right",
      })
      .setOrigin(1, 0)
      .setDepth(5);
    this.scoreLabel = this.add
      .text(453, 34, "00000", {
        fontFamily: '"Press Start 2P", monospace',
        fontSize: "13px",
        color: "#ffffff",
        align: "right",
      })
      .setOrigin(1, 0)
      .setDepth(5);
  }

  // Inicia o reinicia la ronda, limpia objetos anteriores y programa sus apariciones.
  startGame() {
    if (this.running) return;

    this.clearTouchDirections();
    this.paused = false;
    this.asteroids.forEach((item) => item.sprite.destroy());
    this.coins.forEach((item) => item.sprite.destroy());
    this.asteroids = [];
    this.coins = [];
    this.lives = 3;
    this.score = 0;
    this.invulnerable = false;
    this.running = true;
    this.player.setPosition(240, 390).setAlpha(1);
    this.heartIcons.forEach((heart) => heart.setVisible(true));
    this.scoreLabel.setText("00000");
    this.prompt.setText("").setFontSize(12);
    this.asteroidTimer?.remove();
    this.coinTimer?.remove();
    this.asteroidTimer = this.time.addEvent({
      delay: 720,
      callback: this.spawnAsteroid,
      callbackScope: this,
      loop: true,
    });
    this.coinTimer = this.time.addEvent({
      delay: 1050,
      callback: this.spawnCoin,
      callbackScope: this,
      loop: true,
    });
    if (this.musicEnabled) this.music.play();
    this.game.events.emit(GAME_EVENTS.GAME_STARTED);
  }

  // Congela la escena y pausa la música sin perder el estado actual de la ronda.
  pauseGame() {
    if (!this.running || this.paused) return;

    this.clearTouchDirections();
    this.paused = true;
    this.prompt.setText("JUEGO EN PAUSA");
    this.music.pause();
    this.scene.pause();
    this.game.events.emit(GAME_EVENTS.GAME_PAUSED);
  }

  // Reanuda la escena y la música si el jugador no la ha silenciado.
  resumeGame() {
    if (!this.running || !this.paused) return;

    this.paused = false;
    this.prompt.setText("");
    this.scene.resume();
    if (this.musicEnabled) this.music.play();
    this.game.events.emit(GAME_EVENTS.GAME_RESUMED);
  }

  // Reinicia desde cero incluso si la escena estaba pausada o la ronda terminó.
  restartGame() {
    this.clearTouchDirections();
    if (this.paused) this.scene.resume();
    this.paused = false;
    this.running = false;
    this.music.stop();
    this.startGame();
  }

  // Mantiene una dirección activa mientras se presiona su botón táctil.
  setTouchDirection(direction, isPressed) {
    if (!["up", "down", "left", "right"].includes(direction)) return;
    if (isPressed) {
      this.touchDirections.add(direction);
    } else {
      this.touchDirections.delete(direction);
    }
  }

  // Evita que una dirección quede pulsada al pausar, reiniciar o cambiar de ventana.
  clearTouchDirections() {
    this.touchDirections.clear();
  }

  // Crea un asteroide aleatorio con tamaño, velocidad y giro propios.
  spawnAsteroid() {
    if (!this.running) return;

    const size = Phaser.Math.Between(32, 58);
    const sprite = this.add
      .image(
        Phaser.Math.Between(28, 452),
        -size,
        "asteroids",
        Phaser.Math.Between(0, 3),
      )
      .setDisplaySize(size, size)
      .setDepth(2);
    this.asteroids.push({
      sprite,
      size,
      speed: Phaser.Math.Between(125, 205),
      spin: Phaser.Math.FloatBetween(-1.2, 1.2),
    });
  }

  // Selecciona una moneda (1, 5 o 10 puntos) y la inicia con su animación.
  spawnCoin() {
    if (!this.running) return;

    const value = Phaser.Utils.Array.GetRandom([1, 1, 1, 5, 5, 10]);
    const key = `coin-${value}`;
    const sprite = this.add
      .sprite(Phaser.Math.Between(25, 455), -24, key)
      .setDisplaySize(34, 34)
      .setDepth(2)
      .play(key);
    this.coins.push({ sprite, value, speed: Phaser.Math.Between(105, 155) });
  }

  // Se ejecuta cada frame: desplaza el fondo, controla la nave y actualiza objetos.
  update(_time, delta) {
    this.background.tilePositionY -= delta * (this.running ? 0.035 : 0.012);
    if (!this.running) return;

    const movement = (delta / 1000) * 245;
    if (this.cursors.left.isDown || this.touchDirections.has("left"))
      this.player.x -= movement;
    if (this.cursors.right.isDown || this.touchDirections.has("right"))
      this.player.x += movement;
    if (this.cursors.up.isDown || this.touchDirections.has("up"))
      this.player.y -= movement;
    if (this.cursors.down.isDown || this.touchDirections.has("down"))
      this.player.y += movement;
    this.player.x = Phaser.Math.Clamp(this.player.x, 24, 456);
    this.player.y = Phaser.Math.Clamp(this.player.y, 42, 456);

    this.updateFallingObjects(this.asteroids, delta, "asteroid");
    this.updateFallingObjects(this.coins, delta, "coin");
  }

  // Mueve monedas y asteroides, resuelve recogidas/choques y retira objetos vencidos.
  updateFallingObjects(items, delta, type) {
    const speedScale = 1 + Math.min(this.score / 200, 0.45);
    items.forEach((item) => {
      item.sprite.y += (item.speed * speedScale * delta) / 1000;
      if (type === "asteroid")
        item.sprite.rotation += (item.spin * delta) / 1000;

      if (type === "coin" && this.isTouching(item.sprite, 22)) {
        this.score += item.value;
        this.scoreLabel.setText(String(this.score).padStart(5, "0"));
        this.coinSound.play();
        item.sprite.destroy();
        item.collected = true;
      } else if (
        type === "asteroid" &&
        !this.invulnerable &&
        this.isTouching(item.sprite, item.size * 0.34 + 13)
      ) {
        item.sprite.destroy();
        item.hit = true;
        this.loseLife();
      } else if (item.sprite.y > 510) {
        item.sprite.destroy();
        item.expired = true;
      }
    });

    const finished = (item) => item.collected || item.hit || item.expired;
    if (type === "asteroid") {
      this.asteroids = this.asteroids.filter((item) => !finished(item));
    } else {
      this.coins = this.coins.filter((item) => !finished(item));
    }
  }

  // Comprueba la colisión circular entre la nave y un objeto según su radio efectivo.
  isTouching(sprite, distance) {
    return (
      Phaser.Math.Distance.Between(
        this.player.x,
        this.player.y,
        sprite.x,
        sprite.y,
      ) < distance
    );
  }

  // Resta una vida, anima el impacto y concede invulnerabilidad temporal si sigue viva.
  loseLife() {
    if (!this.running || this.invulnerable) return;

    this.lives -= 1;
    this.heartIcons[this.lives]?.setVisible(false);
    this.hitSound.play();
    this.explosionSound.play();
    const explosion = this.add
      .sprite(this.player.x, this.player.y, "explosion")
      .setDisplaySize(48, 48)
      .setDepth(4)
      .play("explosion-animation");
    explosion.once("animationcomplete", () => explosion.destroy());

    if (this.lives === 0) {
      this.endGame();
      return;
    }

    this.invulnerable = true;
    this.tweens.add({
      targets: this.player,
      alpha: 0.25,
      duration: 90,
      yoyo: true,
      repeat: 7,
      onComplete: () => {
        this.player.setAlpha(1);
        this.invulnerable = false;
      },
    });
  }

  // Detiene la ronda al perder las vidas, muestra el resultado y devuelve la música al menú.
  endGame() {
    this.clearTouchDirections();
    this.running = false;
    this.paused = false;
    this.asteroidTimer?.remove();
    this.coinTimer?.remove();
    this.music.stop();
    this.loseSound.play();
    this.prompt.setText(
      `MISIÓN FALLIDA\nPUNTOS: ${this.score}\n\nPULSA JUGAR DE NUEVO`,
    );
    this.prompt.setFontSize(10);
    this.game.events.emit(GAME_EVENTS.GAME_OVER, this.score);
  }
}
