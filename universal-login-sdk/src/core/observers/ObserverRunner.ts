import {sleep} from '@unilogin/commons';

type ObserverRunnerState = 'stop' | 'stopping' | 'running';

abstract class ObserverRunner {
  protected state: ObserverRunnerState = 'stop';
  abstract async execute(): Promise<void>;
  tick = 1000;
  timeout: any = null;
  private currentTask?: Promise<any>;

  async loop() {
    if (this.state === 'stop') {
      return;
    }
    this.currentTask = this.execute();
    await this.currentTask;
    if (this.state === 'stopping') {
      this.state = 'stop';
    } else if (this.state === 'running') {
      this.timeout = setTimeout(() => this.loop(), this.tick);
    }
  }

  start() {
    if (this.state === 'stop') {
      this.state = 'running';
      this.loop()
        .catch(console.error);
    }
  }

  stop() {
    this.state = 'stop';
    clearTimeout(this.timeout);
  }

  async finalizeAndStop() {
    this.state = this.isStopped() ? 'stop' : 'stopping';
    clearTimeout(this.timeout);
    await this.currentTask;
    while (!this.isStopped()) {
      await sleep(this.tick);
    }
  }

  isStopped() {
    return this.state === 'stop';
  }
}

export default ObserverRunner;
