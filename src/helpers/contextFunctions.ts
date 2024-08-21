export function drawImage(
  context: CanvasRenderingContext2D,
  src: string,
  width: number,
  height: number,
  x: number = 0,
  y: number = 0
): void {
  const img = new Image(width, height);
  img.src = src;

  img.addEventListener("load", () => {
    context.drawImage(img, x, y);
  });
}

export function fillRectangle(
  context: CanvasRenderingContext2D,
  color: string,
  width: number,
  height: number,
  x: number = 0,
  y: number = 0
): void {
  context.fillStyle = color;
  context.fillRect(x, y, width, height);
}
