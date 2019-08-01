import chai, {expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';
import {ApplicationWallet, TEST_CONTRACT_ADDRESS, TEST_ACCOUNT_ADDRESS, TEST_PRIVATE_KEY} from '@universal-login/commons';
import {WalletService} from '../../../lib/core/services/WalletService';

chai.use(chaiAsPromised);

describe('UNIT: WalletService', () => {
  const name = 'name.mylogin.eth';
  const passphrase = 'ik-akainy-vom-zazoji-juynuo';
  const invalidPassphrase = 'ukucas-ahecim-zazgor-ropgys';
  const walletFromPassphrase = sinon.stub();
  const isManagementKeyPurpose = sinon.stub();
  let sdk: any;
  let walletService: WalletService;

  beforeEach(() => {
    isManagementKeyPurpose.resolves(false);
    isManagementKeyPurpose.withArgs(TEST_CONTRACT_ADDRESS, TEST_ACCOUNT_ADDRESS).resolves(true);

    sdk = {
      getWalletContractAddress: sinon.stub().withArgs(name).returns(TEST_CONTRACT_ADDRESS),
      isManagementKeyPurpose
    };

    walletFromPassphrase.withArgs(name, passphrase).resolves({
      address: TEST_ACCOUNT_ADDRESS,
      privateKey: TEST_PRIVATE_KEY
    });
    walletFromPassphrase.resolves({
      address: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      privateKey: TEST_PRIVATE_KEY
      });

    walletService = new WalletService(sdk, walletFromPassphrase);
  });

  it('succesful recover', async () => {
    const expectedPrivateKey = TEST_PRIVATE_KEY;
    const expectedContractAddress = TEST_CONTRACT_ADDRESS;

    await walletService.recover(name, passphrase);
    expect(walletService.state).to.be.eq('Deployed');
    const applicationWallet: ApplicationWallet = walletService.applicationWallet as ApplicationWallet;
    expect(applicationWallet!.name).to.eq(name);
    expect(applicationWallet!.privateKey).to.eq(expectedPrivateKey, 'privateKeys are not equal');
    expect(applicationWallet!.contractAddress).to.eq(expectedContractAddress, 'contractAdressess are not equal');
  });

  it('unsuccesful recover', async () => {
    await expect(walletService.recover(name, invalidPassphrase)).to.be.rejectedWith('Passphrase is not valid');
  });
});
