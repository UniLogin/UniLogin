import chai, {expect} from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import {deleteAccount} from '../../../src/core/services/DeleteAccountService';
import {DeployedWallet, WalletService} from '@universal-login/sdk';
import {Wallet} from 'ethers';
import {getWallets, createMockProvider} from 'ethereum-waffle';
import {setupDeployedWallet} from '../../helpers/setupDeploymentWallet';
import Relayer from '@universal-login/relayer';

chai.use(sinonChai);

describe('DeleteAccountService', () => {
  let wallet: Wallet;
  let walletService: WalletService;
  let deployedWallet: DeployedWallet;
  let relayer: Relayer;
  let setErrors: () => void;
  let onDeleteAccountClick: sinon.SinonStub;
  const ensName = `test.mylogin.eth`;

  before(async () => {
    ([wallet] = getWallets(createMockProvider()));
    ({deployedWallet, relayer} = await setupDeployedWallet(wallet, ensName));
  });

  beforeEach(async () => {
    walletService = new WalletService(deployedWallet.sdk);
    walletService.setWallet(deployedWallet.asApplicationWallet);
    setErrors = sinon.stub();
    onDeleteAccountClick = sinon.stub();
  });

  it('delete account if inputs are valid', async () => {
    await deleteAccount(walletService, {username: 'test.mylogin.eth', verifyField: 'DELETE MY ACCOUNT'}, setErrors, onDeleteAccountClick);
    expect(setErrors).to.be.calledOnce;
    expect(onDeleteAccountClick).to.be.calledOnce;
    expect(() => walletService.getDeployedWallet()).to.throw('Invalid state: expected deployed wallet');
  });

  it('dont delete account if inputs are invalid', async () => {
    await deleteAccount(walletService, {username: 'test', verifyField: 'DELETE MY ACCOUNT'}, setErrors, onDeleteAccountClick);
    expect(setErrors).to.be.calledOnce;
    expect(onDeleteAccountClick).to.not.be.called;
    expect(walletService.getDeployedWallet()).to.deep.eq(deployedWallet);
  });

  after(async () => {
    await relayer.stop();
  });
});
