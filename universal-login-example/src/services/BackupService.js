import {toWords} from '../vendors/Daefen';
import {fromBrainWallet} from '../utils';

class BackupService {
  constructor(walletContractService) {
    this.walletContractService = walletContractService;
    this.backupCodes = [];
    this.publicKeys = [];
  }

  clearBackupCodes() {
    this.backupCodes = [];
    this.publicKeys = [];
  }

  async generateBackupCodes(numCodes) {
    for (let index = 0; index < numCodes; index++) {
      const prefix = toWords(Math.floor(Math.random() * Math.pow(3456, 4)))
        .replace(/\s/g, '-')
        .toLowerCase();
      const suffix = toWords(Math.floor(Math.random() * Math.pow(3456, 4)))
        .replace(/\s/g, '-')
        .toLowerCase();
      const backupCode = `${prefix}-${suffix}`;
      const wallet = await fromBrainWallet(this.walletContractService.identity.name, backupCode);
      this.backupCodes.push(backupCode);
      this.publicKeys.push(wallet.address);
    }
    return [this.backupCodes, this.publicKeys];
  }
}

export default BackupService;
