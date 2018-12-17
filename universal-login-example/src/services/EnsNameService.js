import {sleep} from '../../src/relayer/utils';

class EnsNameService {
  constructor(ensService, historyService) {
    this.ensService = ensService;
    this.historyService = historyService;
    this.running = false;
    this.isWorking = false; 
  }

  subscribe() {
    this.running = true;
    this.loop();
  }
  
  async loop(tick = 1000) {
    do {
      if (!this.isWorking) {
        this.isWorking = true;
        await this.changePressersName();
      }
      await sleep(tick);
    } while (this.running);
  }

  unsubscribeAll() {
    this.running = false;
  }

  async changePressersName() {
    for (let count = this.historyService.pressers.length - 1; count >= 0; count--) {
      if (this.historyService.pressers[count].name.slice(0, 2) === '0x') {
        const ensName = await this.getEnsName(this.historyService.pressers[count].name);
        this.historyService.pressers[count].name = ensName;
      }
    }
    this.isWorking = false;
  }

  async getEnsName(address) {
    return await this.ensService.getEnsName(address);
  }
}

export default EnsNameService;
