export class MathUtils {
  public static within(a: number, b: number, tolerance: number) {
    return Math.abs(a - b) <= tolerance;
  }

  public static distanceBetween(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
  ) {
    var dx = x1 - x2;
    var dy = y1 - y2;

    return Math.sqrt(dx * dx + dy * dy);
  }
}
