import chai, {expect} from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import {Wallet} from 'ethers';
import {MockProvider} from 'ethereum-waffle';
import {DeployedWallet, WalletService} from '@unilogin/sdk';
import RelayerUnderTest from '@unilogin/relayer';
import {setupDeployedWallet} from '../../helpers/setupDeploymentWallet';
import {DISCONNECT} from '../../../src/core/constants/verifyFields';
import {disconnectAccount} from '../../../src/core/services/DisconnectAccountService';
import {waitExpect} from '@unilogin/commons/testutils';

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
    ([wallet] = new MockProvider().getWallets());
    ({deployedWallet, relayer} = await setupDeployedWallet(wallet, ensName));
  });

  beforeEach(async () => {
    walletService = new WalletService(deployedWallet.sdk);
    walletService.setWallet(deployedWallet.asSerializedDeployedWallet);
    setErrors = sinon.stub();
    onAccountDisconnection = sinon.stub();
    onAccountDisconnected = sinon.stub();
  });

  it('disconnect account if inputs are valid', async () => {
    const promise = disconnectAccount(walletService, {username: 'test.mylogin.eth', verifyField: DISCONNECT}, setErrors, onAccountDisconnection, onAccountDisconnected);
    expect(onAccountDisconnection).to.be.calledOnce;
    await promise;
    expect(setErrors).to.be.calledOnce;
    expect(onAccountDisconnected).to.be.calledOnce;
    await waitExpect(() => expect(walletService.state).to.deep.eq({kind: 'None'}));
    expect(() => walletService.getDeployedWallet()).to.throw('Wallet state is None, but expected Deployed');
  });

  it('dont disconnect account if username are invalid', async () => {
    await disconnectAccount(walletService, {username: 'test', verifyField: DISCONNECT}, setErrors, onAccountDisconnection, onAccountDisconnected);
    expect(setErrors).to.be.calledOnce;
    expect(onAccountDisconnection).to.not.be.called;
    expect(onAccountDisconnected).to.not.be.called;
    expect(walletService.getDeployedWallet()).to.deep.include(deployedWallet.asSerializedDeployedWallet);
  });

  it('dont disconnect account if verifyField are invalid', async () => {
    await disconnectAccount(walletService, {username: 'test.mylogin.eth', verifyField: 'test'}, setErrors, onAccountDisconnection, onAccountDisconnected);
    expect(setErrors).to.be.calledOnce;
    expect(onAccountDisconnection).to.not.be.called;
    expect(onAccountDisconnected).to.not.be.called;
    expect(walletService.getDeployedWallet()).to.deep.include(deployedWallet.asSerializedDeployedWallet);
  });

  after(async () => {
    deployedWallet.sdk.stop();
    await relayer.stop();
  });
});
