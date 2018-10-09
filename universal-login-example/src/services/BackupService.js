import ethers from 'ethers';
import { toWords } from '../vendors/Daefen';

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

  async generateBackupCodes(numCodes) {
    for (var i = 0; i < numCodes; i++) {
      const backupCode =
        toWords(Math.floor(Math.random() * Math.pow(3456, 4)))
          .replace(/\s/g, '-')
          .toLowerCase() +
        '-' +
        toWords(Math.floor(Math.random() * Math.pow(3456, 4)))
          .replace(/\s/g, '-')
          .toLowerCase();
      const wallet = await ethers.Wallet.fromBrainWallet(
        this.identityService.identity.name,
        backupCode
      );
      this.backupCodes.push(backupCode);
      this.publicKeys.push(wallet.address);
    }
    return [this.backupCodes, this.publicKeys];
  }
}

export default BackupService;
