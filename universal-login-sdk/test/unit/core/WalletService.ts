import chai, {expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';
import {TEST_ACCOUNT_ADDRESS, TEST_CONTRACT_ADDRESS, TEST_PRIVATE_KEY} from '@universal-login/commons';
import {WalletService} from '../../../lib/core/services/WalletService';
import {DeployedWallet} from '../../../lib';

chai.use(chaiAsPromised);

describe('UNIT: WalletService', () => {
  const name = 'name.mylogin.eth';
  const passphrase = 'ik-akainy-vom-zazoji-juynuo';
  const invalidPassphrase = 'ukucas-ahecim-zazgor-ropgys';
  const walletFromPassphrase = sinon.stub();
  const keyExist = sinon.stub();
  let sdk: any;
  let walletService: WalletService;

  before(() => {
    keyExist.resolves(false);
    keyExist.withArgs(TEST_CONTRACT_ADDRESS, TEST_ACCOUNT_ADDRESS).resolves(true);

    sdk = {
      getWalletContractAddress: sinon.stub().withArgs(name).returns(TEST_CONTRACT_ADDRESS),
      keyExist
    };

    walletFromPassphrase.withArgs(name, passphrase).resolves({
      address: TEST_ACCOUNT_ADDRESS,
      privateKey: TEST_PRIVATE_KEY
    });

    walletFromPassphrase.resolves({
      address: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      privateKey: TEST_PRIVATE_KEY
      });
  });

  beforeEach(() => {
    walletService = new WalletService(sdk, walletFromPassphrase);
  });
  it('succesful recover', async () => {
    const expectedWallet = new DeployedWallet(TEST_CONTRACT_ADDRESS, name, TEST_PRIVATE_KEY, sdk);

    await walletService.recover(name, passphrase);
    expect(walletService.state).to.deep.eq({
      kind: 'Deployed',
      wallet: expectedWallet,
    });
  });

  it('unsuccesful recover', async () => {
    await expect(walletService.recover(name, invalidPassphrase)).to.be.rejectedWith('Passphrase is not valid');
  });
});
