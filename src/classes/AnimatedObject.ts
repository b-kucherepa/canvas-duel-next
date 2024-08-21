import CollisionMask from "./CollisionMask";
import Canvas from "@/classes/Scene";

export abstract class AnimatedObject {
  public collisionMask: CollisionMask;
  public speed: number;
  public posX: number;
  public posY: number;
  protected _scene: Canvas;
  protected _direction: number;
  protected _color: string;
  protected _width: number;
  protected _height: number;

  constructor(
    scene: Canvas,
    posX: number,
    posY: number,
    direction: AnimatedObject.Direction,
    speed: number,
    color: string,
    width: number,
    height?: number
  ) {
    this.collisionMask = new CollisionMask(
      CollisionMask.Shape.Oval,
      posX,
      posY,
      width
    );
    this._scene = scene;
    this.posX = posX;
    this.posY = posY;
    this._direction = direction;
    this.speed = speed;
    this._color = color;
    this._width = width;
    this._height = height ?? width;

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
