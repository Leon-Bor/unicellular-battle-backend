 
export class GameLoop {
  private isRunning = false;
  private waitTime: number;
  private update: (deltaTime?: number) => void;
  private lastFrameTime: number;
  private targetFps: number;
  private deltaTime: number;
  private currentFrameTime: number;

  constructor(update: (deltaTime?: number) => void, targetFps: number) {
    this.update = update;
    this.targetFps = targetFps;
    this.waitTime = 1000 / targetFps;
  }

  private run() {
    this.currentFrameTime = Date.now();
    this.deltaTime = this.currentFrameTime - this.lastFrameTime;
    if (this.deltaTime < this.waitTime) {
      this.deltaTime = this.waitTime;
    }
    this.deltaTime = (this.deltaTime * this.targetFps) / 1000;
    this.update(this.deltaTime);
    this.lastFrameTime = this.currentFrameTime;
    if (this.isRunning) {
      setTimeout(() => this.run(), this.waitTime);
    }
  }

  public start() {
    this.isRunning = true;
    this.lastFrameTime = Date.now();
    this.run();
  }

  public stop() {
    this.isRunning = false;
  }
}
