import Bullet from "./Bullet";
import Canvas from "@/classes/Scene";
import AnimatedObject from "./AnimatedObject";

import Menu from "../components/Menu";

export default class Character extends AnimatedObject {
  public fireRate: number;
  public shotColor: string;
  public isMenuOpened: boolean = false;
  private _shotDirection: number;
  private _shotReadiness: number = 0;

  constructor(
    scene: Canvas,
    posX: number,
    posY: number,
    direction: number,
    speed: number,
    color: string,
    shotDirection: number,
    fireRate: number,
    shotColor: string,
    width: number,
    height?: number
  ) {
    super(scene, posX, posY, direction, speed, color, width);
    this._shotDirection = shotDirection;
    this.fireRate = fireRate;
    this.shotColor = shotColor;
    window.addEventListener("click", () => this.handleClick());
  }

  public update() {
    this.move();
    this.checkBorderCollision();
    this.checkMouseCollision();
    this.shoot();
  }

  public render(context: CanvasRenderingContext2D) {
    context.beginPath();
    context.arc(this.posX, this.posY, this._width / 2, 0, 2 * Math.PI);
    context.fillStyle = this._color;
    context.fill();
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
        20,
        this._shotDirection,
        15
      );
    }
  }

  protected checkBorderCollision() {
    const halfHeight = this._height / 2;
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

  protected checkMouseCollision() {
    const deltaX: number = this.posX - this._scene.mouseX;
    const deltaY: number = this.posY - this._scene.mouseY;
    const distance: number = Math.sqrt(
      Math.pow(deltaX, 2) + Math.pow(deltaY, 2)
    );

    if (this._height * 0.25 < distance && distance < this._height * 0.6) {
      if (this._scene.mouseY < this.posY) {
        this._direction = Character.Direction.Down;
      }

      if (this._scene.mouseY > this.posY) {
        this._direction = Character.Direction.Up;
      }
    }
  }

  protected destroy() {
    this._scene.forgetRenderedObject(this);
  }

  private getBulletSpawnPoint(): number[] {
    let x, y: number;
    switch (this._shotDirection) {
      case AnimatedObject.Direction.Up:
        x = this.posX;
        y = this.posY - this._height / 2;
        break;
      case AnimatedObject.Direction.Down:
        x = this.posX;
        y = this.posY + this._height / 2;
        break;
      case AnimatedObject.Direction.Left:
        x = this.posX - this._width / 2;
        y = this.posY;
        break;
      case AnimatedObject.Direction.Right:
        x = this.posX + this._width / 2;
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

    if (distance < this._height) {
      this.openMenu();
    }
  }
}
