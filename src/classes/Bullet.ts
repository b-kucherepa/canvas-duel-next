import Character from "./Character";
import Canvas from "./Scene";
import AnimatedObject from "./AnimatedObject";

export default class Bullet extends AnimatedObject {
  public owner: Character;

  constructor(
    owner: Character,
    canvas: Canvas,
    posX: number,
    posY: number,
    color: string,
    speed: number,
    direction: number,
    radius: number
  ) {
    super(canvas, posX, posY, direction, speed, color, radius);
    this.owner = owner;
  }

  public update(): void {
    this.move();
    this.checkBorderCollision();
  }

  public render(context: CanvasRenderingContext2D): void {
    context.beginPath();
    context.arc(this.posX, this.posY, this._radius, 0, 2 * Math.PI);
    context.fillStyle = this.color;
    context.fill();
  }

  protected checkBorderCollision() {
    const halfWidth = this._radius;
    const isOutOfLeft = this.posX + halfWidth < 0;
    const isOutOfRight = this.posX - halfWidth > this._scene.width;

    if (isOutOfLeft || isOutOfRight) {
      this.destroy();
    }
  }

  protected destroy() {
    this._scene.forgetRenderedObject(this);
  }
}
