type ObserverRunnerState = 'stop' | 'stopping' | 'running';

abstract class ObserverRunner {
  private state: ObserverRunnerState = 'stop';
  abstract async execute(): Promise<void>;
  tick = 1000;
  timeout: any = null;
  private workCompleted: Promise<void> = Promise.resolve();
  private markWorkCompleted: () => void = () => {};

  private async loop() {
    await this.doWork().catch(console.error);
    if (this.state === 'running') {
      this.timeout = setTimeout(() => this.loop(), this.tick);
    }
    if (this.state === 'stopping') {
      this.state = 'stop';
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
    if (this.state === 'stop') {
      this.state = 'running';
      this.loop();
    }
    if (this.state === 'stopping') {
      this.state = 'running';
    }
  }

  async finalizeAndStop() {
    this.state = 'stopping';
    clearTimeout(this.timeout);
    await this.workCompleted;
  }

  isStopped() {
    return this.state === 'stop';
  }
}

export default ObserverRunner;
