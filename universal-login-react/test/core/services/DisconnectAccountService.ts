import chai, {expect} from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import {disconnectAccount} from '../../../src/core/services/DisconnectAccountService';
import {DeployedWallet, WalletService} from '@universal-login/sdk';
import {Wallet} from 'ethers';
import {getWallets, createMockProvider} from 'ethereum-waffle';
import {setupDeployedWallet} from '../../helpers/setupDeploymentWallet';
import RelayerUnderTest from '@universal-login/relayer';

chai.use(sinonChai);

describe('DisconnectAccountService', () => {
  let wallet: Wallet;
  let walletService: WalletService;
  let deployedWallet: DeployedWallet;
  let relayer: RelayerUnderTest;
  let setErrors: () => void;
  let onAccountDisconnection: sinon.SinonStub;
  let onAccountDisconnected: sinon.SinonStub;
  const ensName = 'test.mylogin.eth';

  before(async () => {
    ([wallet] = getWallets(createMockProvider()));
    ({deployedWallet, relayer} = await setupDeployedWallet(wallet, ensName));
  });

  beforeEach(async () => {
    walletService = new WalletService(deployedWallet.sdk);
    walletService.setWallet(deployedWallet.asApplicationWallet);
    setErrors = sinon.stub();
    onAccountDisconnection = sinon.stub();
    onAccountDisconnected = sinon.stub();
  });

  it('disconnect account if inputs are valid', async () => {
    const promise = disconnectAccount(walletService, {username: 'test.mylogin.eth', verifyField: 'DISCONNECT'}, setErrors, onAccountDisconnection, onAccountDisconnected);
    expect(onAccountDisconnection).to.be.calledOnce;
    await promise;
    expect(setErrors).to.be.calledOnce;
    expect(onAccountDisconnected).to.be.calledOnce;
    expect(() => walletService.getDeployedWallet()).to.throw('Invalid state: expected deployed wallet');
  });

  it('dont disconnect account if username are invalid', async () => {
    await disconnectAccount(walletService, {username: 'test', verifyField: 'DISCONNECT'}, setErrors, onAccountDisconnection, onAccountDisconnected);
    expect(setErrors).to.be.calledOnce;
    expect(onAccountDisconnection).to.not.be.called;
    expect(onAccountDisconnected).to.not.be.called;
    expect(walletService.getDeployedWallet()).to.deep.eq(deployedWallet);
  });

  it('dont disconnect account if verifyField are invalid', async () => {
    await disconnectAccount(walletService, {username: 'test.mylogin.eth', verifyField: 'test'}, setErrors, onAccountDisconnection, onAccountDisconnected);
    expect(setErrors).to.be.calledOnce;
    expect(onAccountDisconnection).to.not.be.called;
    expect(onAccountDisconnected).to.not.be.called;
    expect(walletService.getDeployedWallet()).to.deep.eq(deployedWallet);
  });

  after(async () => {
    await relayer.stop();
  });
});
