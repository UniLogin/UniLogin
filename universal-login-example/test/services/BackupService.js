import {expect} from 'chai';
import BackupService from '../../src/services/BackupService';
import {Wallet} from 'ethers';

const walletContractService = {
  walletContract: {
    name: 'kyle'
  }
};

const generateWalletMock = () => Wallet.createRandom();


describe('BackupService', async () => {
  let backupService;

  it('INT: generates one backup code', async () => {
    backupService = new BackupService(walletContractService);
    await backupService.generateBackupCodes(1);
    expect(backupService.backupCodes.length).to.eq(1);
    expect(backupService.backupCodes[0]).to.match(/^\w+(-\w+)+$/);
  });

  it('UNIT: generates more than one backup code', async () => {
    backupService = new BackupService(walletContractService, generateWalletMock);
    await backupService.generateBackupCodes(1);
    expect(backupService.backupCodes.length).to.eq(1);
    await backupService.generateBackupCodes(2);
    expect(backupService.backupCodes.length).to.eq(3);
  });

  it('UNIT: clears backup codes', async () => {
    backupService = new BackupService(walletContractService, generateWalletMock);
    await backupService.clearBackupCodes();
    expect(backupService.backupCodes.length).to.eq(0);
  });
});
