import {sleep} from '@universal-login/commons';

type ObserverRunnerState = 'stop' | 'stopping' | 'running';

abstract class ObserverRunner {
  protected state: ObserverRunnerState = 'stop';
  abstract async execute(): Promise<void>;
  step = 1000;
  timeout: any = null;

  async loop() {
    if (this.state === 'stop') {
      return;
    }
    await this.execute();
    if (this.state === 'stopping') {
      this.state = 'stop';
    } else if (this.state === 'running') {
      this.timeout = setTimeout(() => this.loop(), this.step);
    }
  }

  start() {
    if (this.state === 'stop') {
      this.state = 'running';
      this.loop();
    }
  }

  stop() {
    this.state = 'stop';
    clearTimeout(this.timeout);
  }

  async finalizeAndStop() {
    this.state = this.isStopped() ? 'stop' : 'stopping';
    do {
      await sleep(this.step);
    } while (!this.isStopped());
  }

  protected isStopped() {
    return this.state === 'stop';
  }
}

export default ObserverRunner;
