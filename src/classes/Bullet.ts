import Character from "./Character";
import Scene from "./Scene";
import AnimatedObject from "./AnimatedObject";

export default class Bullet extends AnimatedObject {
  public owner: Character;

  constructor(
    owner: Character,
    canvas: Scene,
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
    context.arc(this.posX, this.posY, this.radius, 0, 2 * Math.PI);
    context.fillStyle = this.color;
    context.fill();
  }

  public hitCharacter() {
    this.destroy();
  }

  protected checkBorderCollision() {
    const halfWidth = this.radius;
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
