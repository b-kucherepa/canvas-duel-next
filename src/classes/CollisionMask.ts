export class CollisionMask {
  private _shape: CollisionMask.Shape;
  private _width: number;
  private _height: number;
  private posX: number;
  private _poxY: number;

  constructor(
    shape: CollisionMask.Shape,
    posX: number,
    poxY: number,
    width: number,
    height?: number
  ) {
    this._shape = shape;
    this.posX = posX;
    this._poxY = poxY;

    this._width = width;
    this._height = height ?? width;
  }

  getIfOverlaps(otherMask: CollisionMask): boolean {
    throw Error();
  }
}

export namespace CollisionMask {
  export enum Shape {
    Rectangle,
    Oval,
  }
}

export default CollisionMask;
