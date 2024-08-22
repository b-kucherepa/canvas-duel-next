import Bullet from "./Bullet";
import Scene from "@/classes/Scene";
import AnimatedObject from "./AnimatedObject";
import { BACKGROUND_COLOR } from "@/data/const";

export default class Character extends AnimatedObject {
  public fireRate: number;
  public shotSpeed: number;
  public shotColor: string;
  public isMenuOpened: boolean = false;
  private _shotDirection: number;
  private _shotReadiness: number = 0;
  private _score: number = 0;

  constructor(
    scene: Scene,
    posX: number,
    posY: number,
    direction: number,
    speed: number,
    color: string,
    shotDirection: number,
    fireRate: number,
    shotSpeed: number,
    shotColor: string,
    radius: number
  ) {
    super(scene, posX, posY, direction, speed, color, radius);
    this._shotDirection = shotDirection;
    this.fireRate = fireRate;
    this.shotSpeed = shotSpeed;
    this.shotColor = shotColor;
    window.addEventListener("click", () => this.handleClick());
  }

  public update() {
    this.move();
    this.handleOutOfBoundaries();
    this.handleMouseCollision();
    this.shoot();
  }

  public render(context: CanvasRenderingContext2D) {
    context.beginPath();
    context.arc(this.posX, this.posY, this.radius, 0, 2 * Math.PI);
    context.fillStyle = this.color;
    context.fill();
    context.fillStyle = BACKGROUND_COLOR;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.font = this.radius + "px serif";
    context.fillText(
      this._score.toString(),
      this.posX,
      this.posY,
      this.radius * 2
    );
  }

  public openMenu() {
    this.isMenuOpened = true;
    this._scene.pause();
  }

  public closeMenu() {
    this.isMenuOpened = false;
    this._scene.start();
  }

  public shoot() {
    if (this._shotReadiness < this.fireRate) {
      this._shotReadiness++;
    } else {
      this._shotReadiness = 0;
      const [bulletX, bulletY] = this.getBulletSpawnPoint();
      new Bullet(
        this,
        this._scene,
        bulletX,
        bulletY,
        this.shotColor,
        this.shotSpeed,
        this._shotDirection,
        this.radius / 5
      );
    }
  }

  public countHit() {
    this._score++;
  }

  protected destroy() {
    this._scene.removeRenderedObject(this);
  }

  protected handleOutOfBoundaries() {
    const halfHeight = this.radius;
    const isOutOfTop = this.posY - halfHeight < 0;
    const isOutOfBottom = this.posY + halfHeight > this._scene.height;

    if (isOutOfTop) {
      this._direction = Character.Direction.Down;
      const overflow = this.posY - halfHeight;
      this.posY = 0 - overflow + halfHeight;
    }

    if (isOutOfBottom) {
      this._direction = Character.Direction.Up;
      const overflow = this.posY + halfHeight - this._scene.height;
      this.posY = this._scene.height - overflow - halfHeight;
    }
  }

  protected handleMouseCollision() {
    const deltaX: number = this.posX - this._scene.mouseX;
    const deltaY: number = this.posY - this._scene.mouseY;
    const distance: number = Math.sqrt(
      Math.pow(deltaX, 2) + Math.pow(deltaY, 2)
    );

    if (this.radius * 0.5 < distance && distance < this.radius * 1.1) {
      if (this._scene.mouseY < this.posY) {
        this._direction = Character.Direction.Down;
      }

      if (this._scene.mouseY > this.posY) {
        this._direction = Character.Direction.Up;
      }
    }
  }

  private getBulletSpawnPoint(): number[] {
    let x, y: number;
    switch (this._shotDirection) {
      case AnimatedObject.Direction.Up:
        x = this.posX;
        y = this.posY - this.radius;
        break;
      case AnimatedObject.Direction.Down:
        x = this.posX;
        y = this.posY + this.radius;
        break;
      case AnimatedObject.Direction.Left:
        x = this.posX - this.radius;
        y = this.posY;
        break;
      case AnimatedObject.Direction.Right:
        x = this.posX + this.radius;
        y = this.posY;
        break;
      default:
        throw Error("No such Direction!");
    }

    return [x, y];
  }

  private handleClick() {
    const deltaX: number = this.posX - this._scene.mouseX;
    const deltaY: number = this.posY - this._scene.mouseY;
    const distance: number = Math.sqrt(
      Math.pow(deltaX, 2) + Math.pow(deltaY, 2)
    );

    if (distance < this.radius * 2) {
      this.openMenu();
    }
  }
}
