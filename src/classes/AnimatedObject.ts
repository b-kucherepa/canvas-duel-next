import Canvas from "@/classes/Scene";

export abstract class AnimatedObject {
  public speed: number;
  public posX: number;
  public posY: number;
  public color: string;
  protected _scene: Canvas;
  protected _direction: number;
  protected _radius: number;

  constructor(
    scene: Canvas,
    posX: number,
    posY: number,
    direction: AnimatedObject.Direction,
    speed: number,
    color: string,
    radius: number
  ) {
    this._scene = scene;
    this.posX = posX;
    this.posY = posY;
    this._direction = direction;
    this.speed = speed;
    this.color = color;
    this._radius = radius;

    scene.registerRenderedObject(this);
  }

  public abstract update(): void;

  public abstract render(context: CanvasRenderingContext2D): void;

  protected abstract destroy(): void;

  protected move() {
    switch (this._direction) {
      case AnimatedObject.Direction.Up:
        this.posY -= this.speed;
        return;
      case AnimatedObject.Direction.Down:
        this.posY += this.speed;
        return;
      case AnimatedObject.Direction.Left:
        this.posX -= this.speed;
        return;
      case AnimatedObject.Direction.Right:
        this.posX += this.speed;
        return;
      default:
        throw Error("No such Direction!");
    }
  }
}

export namespace AnimatedObject {
  export enum Direction {
    Up,
    Down,
    Left,
    Right,
  }
}

export default AnimatedObject;
