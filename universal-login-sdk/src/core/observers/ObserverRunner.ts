abstract class ObserverRunner {
  protected running = false;
  abstract async execute(): Promise<void>;
  tick = 1000;
  timeout: any = null;
  private workCompleted: Promise<void> = Promise.resolve();
  private markWorkCompleted: () => void = () => {};

  private async loop() {
    await this.doWork().catch(console.error);
    if (this.running) {
      this.timeout = setTimeout(() => this.loop(), this.tick);
    }
  }

  private async doWork() {
    this.workCompleted = new Promise(resolve => {
      this.markWorkCompleted = resolve;
    });
    await this.execute();
    this.markWorkCompleted();
  }

  start() {
    if (!this.running) {
      this.running = true;
      this.loop();
    }
  }

  async finalizeAndStop() {
    this.running = false;
    clearTimeout(this.timeout);
    await this.workCompleted;
  }

  protected isStopped() {
    return !this.running;
  }
}

export default ObserverRunner;
