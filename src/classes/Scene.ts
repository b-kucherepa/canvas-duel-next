import AnimatedObject from "@/classes/AnimatedObject";
import { drawImage, fillRectangle } from "../helpers/contextFunctions";
import Character from "./Character";

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
    if (this.isPaused) {
      this.isPaused = false;
      return (this._animationFrameId = requestAnimationFrame((timeStamp) =>
        this.tickFrame(timeStamp, 0)
      ));
    }
    return 0;
  }

  private initPlayers(): Character[] {
    const player = new Character(
      this,
      100,
      this.height / 2,
      Character.Direction.Up,
      5,
      "white",
      Character.Direction.Right,
      1,
      "cyan",
      100
    );

    const enemy = new Character(
      this,
      this.width - 100,
      this.height / 2,
      Character.Direction.Down,
      5,
      "black",
      Character.Direction.Left,
      1,
      "red",
      100
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
      this.renderFrame();
    }

    this._animationFrameId = requestAnimationFrame((timeStamp) =>
      this.tickFrame(timeStamp, updatedPrevTime ?? prevTime)
    );
  }

  private renderFrame() {
    this._context.clearRect(0, 0, this.width, this.height);

    if (this._context) {
      fillRectangle.call(this, this._context, "blue", this.width, this.height);

      if (this._renderedObjects.length > 0) {
        for (let rObj of this._renderedObjects) {
          rObj.update();
          rObj.render(this._context);
        }
      }
    }
  }

  private handleMouseMove(event: MouseEvent) {
    this.mouseX = event.pageX;
    this.mouseY = event.pageY;
  }
}
