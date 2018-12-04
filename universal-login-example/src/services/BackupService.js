import {utils, wordlists, Wallet} from 'ethers';
import {toWords} from '../vendors/Daefen';

class BackupService {
  constructor(identityService) {
    this.identityService = identityService;
    this.backupCodes = [];
    this.publicKeys = [];
  }

  clearBackupCodes() {
    this.backupCodes = [];
    this.publicKeys = [];
  }

  async createWallet(backupCode) {
    const bytes = utils.formatBytes32String(backupCode);
    const mnemonic = utils.HDNode.entropyToMnemonic(bytes, wordlists.en);
    return await Wallet.fromMnemonic(mnemonic);
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
      const wallet = await this.createWallet(backupCode);
      this.backupCodes.push(backupCode);
      this.publicKeys.push(wallet.address);
    }
    return [this.backupCodes, this.publicKeys];
  }
}

export default BackupService;
