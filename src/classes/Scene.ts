import AnimatedObject from "@/classes/AnimatedObject";
import Character from "./Character";
import {
  BACKGROUND_COLOR,
  DEFAULT_CHARACTER_SPEED,
  DEFAULT_ENEMY_COLOR,
  DEFAULT_ENEMY_SHOT_COLOR,
  DEFAULT_FIRE_RATE,
  DEFAULT_HERO_COLOR,
  DEFAULT_HERO_SHOT_COLOR,
  DEFAULT_SHOT_SPEED,
} from "@/data/const";
import Bullet from "./Bullet";

export default class Scene {
  public canvas: HTMLCanvasElement;
  public width: number;
  public height: number;
  public mouseX: number = 0;
  public mouseY: number = 0;
  public player: Character;
  public enemy: Character;
  public isPaused: boolean = true;
  private _context: CanvasRenderingContext2D;
  private _fpsInterval: number = 1000 / 30;
  private _renderedObjects: AnimatedObject[];
  private _animationFrameId: number;

  constructor() {
    this.canvas = document.createElement("canvas");
    this._context = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    this._renderedObjects = [];
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    [this.player, this.enemy] = this.initPlayers();

    this.handleResizeAndOnload();

    window.addEventListener("resize", () => this.handleResizeAndOnload());
    window.addEventListener("onload", () => this.handleResizeAndOnload());
    window.addEventListener("mousemove", (event) =>
      this.handleMouseMove(event)
    );

    this._animationFrameId = this.start();
  }

  public registerRenderedObject(...objects: AnimatedObject[]) {
    this._renderedObjects.push(...objects);
  }

  public forgetRenderedObject(...objects: AnimatedObject[]) {
    for (let o of objects) {
      const indexToForget = this._renderedObjects.findIndex(
        (renderedObject) => renderedObject === o
      );
      this._renderedObjects.splice(indexToForget, 1);
    }
  }

  public pause() {
    if (!this.isPaused) {
      this.isPaused = true;
      cancelAnimationFrame(this._animationFrameId);
    }
  }

  public start(): number {
    if (
      this.isPaused &&
      !this.player.isMenuOpened &&
      !this.enemy.isMenuOpened
    ) {
      this.isPaused = false;
      return (this._animationFrameId = requestAnimationFrame((timeStamp) =>
        this.tickFrame(timeStamp, 0)
      ));
    }
    return 0;
  }

  private initPlayers(): Character[] {
    const characterRadius = this.height / 15;
    const screenHeightCenter = this.height / 2;

    const player = new Character(
      this,
      characterRadius * 2,
      screenHeightCenter,
      Character.Direction.Up,
      DEFAULT_CHARACTER_SPEED,
      DEFAULT_HERO_COLOR,
      Character.Direction.Right,
      DEFAULT_FIRE_RATE,
      DEFAULT_SHOT_SPEED,
      DEFAULT_HERO_SHOT_COLOR,
      characterRadius
    );

    const enemy = new Character(
      this,
      this.width - characterRadius * 2,
      screenHeightCenter,
      Character.Direction.Down,
      DEFAULT_CHARACTER_SPEED,
      DEFAULT_ENEMY_COLOR,
      Character.Direction.Left,
      DEFAULT_FIRE_RATE,
      DEFAULT_SHOT_SPEED,
      DEFAULT_ENEMY_SHOT_COLOR,
      characterRadius
    );
    this.registerRenderedObject(player, enemy);
    return [player, enemy];
  }

  private handleResizeAndOnload() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  private tickFrame(timeStamp: number, prevTime: number) {
    const deltaTime = timeStamp - prevTime;

    let updatedPrevTime: number;
    if (deltaTime >= this._fpsInterval) {
      updatedPrevTime = timeStamp - (deltaTime % this._fpsInterval);
      this.calculateBulletCollision();
      this.renderFrame();
    }

    this._animationFrameId = requestAnimationFrame((timeStamp) =>
      this.tickFrame(timeStamp, updatedPrevTime ?? prevTime)
    );
  }

  private renderFrame() {
    this._context.clearRect(0, 0, this.width, this.height);

    if (this._context) {
      this._context.fillStyle = BACKGROUND_COLOR;
      this._context.fillRect(0, 0, this.width, this.height);

      if (this._renderedObjects.length > 0) {
        for (let rObj of this._renderedObjects) {
          rObj.update();
          rObj.render(this._context);
        }
      }
    }
  }

  private calculateBulletCollision() {
    for (let o of this._renderedObjects) {
      if (o instanceof Bullet) {
        const isPlayerHit = this.calculateCollision(
          this.player.radius,
          this.player.posX,
          this.player.posY,
          o.radius,
          o.posX,
          o.posY
        );
        const isEnemyHit = this.calculateCollision(
          this.enemy.radius,
          this.enemy.posX,
          this.enemy.posY,
          o.radius,
          o.posX,
          o.posY
        );

        if (isPlayerHit) {
          this.enemy.countHit();
          o.hitCharacter();
          return;
        }

        if (isEnemyHit) {
          this.player.countHit();
          o.hitCharacter();
          return;
        }
      }
    }
  }

  private calculateCollision(
    radiusA: number,
    posXA: number,
    posYA: number,
    radiusB: number,
    posXB: number,
    posYB: number
  ) {
    const deltaX: number = posXA - posXB;
    const deltaY: number = posYA - posYB;
    const distance: number = Math.sqrt(
      Math.pow(deltaX, 2) + Math.pow(deltaY, 2)
    );

    return distance < radiusA + radiusB;
  }

  private handleMouseMove(event: MouseEvent) {
    this.mouseX = event.pageX;
    this.mouseY = event.pageY;
  }
}
