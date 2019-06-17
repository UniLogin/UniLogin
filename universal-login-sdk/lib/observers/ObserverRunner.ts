import {sleep} from '@universal-login/commons';

type ObserverRunnerState = 'stop' | 'stopping' | 'running';

abstract class ObserverRunner {
  protected state: ObserverRunnerState = 'stop';
  abstract async tick(): Promise<void>;

  constructor(private step = 1000) {}

  async loop() {
    if (this.state === 'stop') {
      return;
    }
    await this.tick();
    if (this.state === 'stopping') {
      this.state = 'stop';
    } else {
      setTimeout(this.loop.bind(this), this.step);
    }
  }

  stop() {
    this.state = 'stop';
  }

  async finalizeAndStop() {
    this.state = 'stopping';
    do {
      await sleep(this.step);
    } while (this.isRunning());
  }

  private isRunning() {
    return this.state !== 'stop';
  }
}

export default ObserverRunner;
