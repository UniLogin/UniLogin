import chai, {expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';
import {TEST_ACCOUNT_ADDRESS, TEST_CONTRACT_ADDRESS, TEST_PRIVATE_KEY, ApplicationWallet, TEST_MESSAGE_HASH, ETHER_NATIVE_TOKEN} from '@universal-login/commons';
import {WalletService} from '../../../lib/core/services/WalletService';
import {Wallet, constants} from 'ethers';
import {DeployedWallet} from '../../../lib/api/DeployedWallet';
import {FutureWallet} from '../../../lib/api/FutureWalletFactory';
import {SerializedWalletState} from '../../../lib/core/models/WalletService';

chai.use(chaiAsPromised);

describe('UNIT: WalletService', () => {
  const name = 'name.mylogin.eth';
  const passphrase = 'ik-akainy-vom-zazoji-juynuo';
  const invalidPassphrase = 'ukucas-ahecim-zazgor-ropgys';
  const walletFromPassphrase = sinon.stub();
  const keyExist = sinon.stub();
  let applicationWallet: ApplicationWallet;
  let storage: any;
  let deployedWallet: DeployedWallet;
  let futureWallet: FutureWallet;
  let sdk: any;
  let walletService: WalletService;

  before(() => {
    keyExist.resolves(false);
    keyExist.withArgs(TEST_CONTRACT_ADDRESS, TEST_ACCOUNT_ADDRESS).resolves(true);

    sdk = {
      getWalletContractAddress: sinon.stub().withArgs(name).returns(TEST_CONTRACT_ADDRESS),
      keyExist,
      provider: Wallet.createRandom(),
    };

    walletFromPassphrase.withArgs(name, passphrase).resolves({
      address: TEST_ACCOUNT_ADDRESS,
      privateKey: TEST_PRIVATE_KEY,
    });

    walletFromPassphrase.resolves({
      address: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      privateKey: TEST_PRIVATE_KEY,
    });

    deployedWallet = new DeployedWallet(TEST_ACCOUNT_ADDRESS, 'justyna.mylogin.eth', TEST_PRIVATE_KEY, sdk);
    applicationWallet = deployedWallet.asApplicationWallet;

    futureWallet = {
      contractAddress: TEST_ACCOUNT_ADDRESS,
      privateKey: TEST_PRIVATE_KEY,
      deploy: async () => ({
        contractAddress: TEST_ACCOUNT_ADDRESS,
        name: 'justyna.mylogin.eth',
        privateKey: TEST_PRIVATE_KEY,
        deploymentHash: TEST_MESSAGE_HASH,
        waitForTransactionHash: sinon.stub().returns({transactionHash: '0x123'}),
        waitToBeSuccess: async () => new DeployedWallet(TEST_ACCOUNT_ADDRESS, 'justyna.mylogin.eth', TEST_PRIVATE_KEY, sdk),
      }),
      waitForBalance: (async () => { }) as any,
      setSupportedTokens: (() => {}) as any,
    };

    storage = {
      load: (): SerializedWalletState => ({kind: 'Deployed', wallet: applicationWallet}),
      save: sinon.fake(),
      remove: sinon.fake(),
    };
  });

  beforeEach(() => {
    walletService = new WalletService(sdk, walletFromPassphrase, storage);
    storage.save.resetHistory();
  });

  it('successful recover', async () => {
    await walletService.recover(name, passphrase);
    expect(walletService.state.kind).to.eq('Deployed');
    expect((walletService.state as any).wallet).to.include({
      contractAddress: TEST_CONTRACT_ADDRESS,
      name,
      privateKey: TEST_PRIVATE_KEY,
    });
  });

  it('unsuccessful recover', async () => {
    await expect(walletService.recover(name, invalidPassphrase)).to.be.rejectedWith('Passphrase is not valid');
  });

  it('disconnect resets state to None', () => {
    walletService.setWallet(applicationWallet);
    walletService.disconnect();
    expect(walletService.state).to.deep.eq({kind: 'None'});
    expect(storage.save).to.be.calledWith({kind: 'None'});
  });

  it('connect set state to Deployed', () => {
    walletService.setWallet(applicationWallet);
    expect(walletService.state.kind).to.eq('Deployed');
    expect((walletService.state as any).wallet).to.deep.include(applicationWallet);
    expect(storage.save).to.be.calledWith({kind: 'Deployed', wallet: applicationWallet});
  });

  it('roundtrip', () => {
    expect(walletService.state).to.deep.eq({kind: 'None'});

    walletService.setFutureWallet(futureWallet, 'justyna.mylogin.eth');
    expect(walletService.state).to.deep.eq({kind: 'Future', name: 'justyna.mylogin.eth', wallet: futureWallet});
    expect(storage.save).to.be.calledWith({
      kind: 'Future',
      name: 'justyna.mylogin.eth',
      wallet: {contractAddress: futureWallet.contractAddress, privateKey: futureWallet.privateKey},
    });

    walletService.setDeployed();
    expect(walletService.state.kind).to.eq('Deployed');
    expect((walletService.state as any).wallet).to.deep.include({
      contractAddress: futureWallet.contractAddress,
      name: applicationWallet.name,
      privateKey: futureWallet.privateKey,
    });

    walletService.disconnect();
    expect(walletService.state).to.deep.eq({kind: 'None'});

    walletService.setWallet(applicationWallet);
    expect(walletService.state.kind).to.eq('Deployed');
    expect((walletService.state as any).wallet).to.deep.include(applicationWallet);

    expect(storage.save).to.be.calledWith({kind: 'Deployed', wallet: applicationWallet});
  });

  it('should throw if future wallet is not set', () => {
    expect(() => walletService.setDeployed()).to.throw('Wallet state is None, but expected Future');
  });

  it('should throw if wallet is overridden', () => {
    walletService.setWallet(applicationWallet);
    expect(() => walletService.setFutureWallet(futureWallet, 'name.mylogin.eth')).to.throw('Wallet cannot be overridden');
  });

  it('should load from storage', async () => {
    await walletService.loadFromStorage();
    expect(walletService.state.kind).to.eq('Deployed');
    expect((walletService.state as any).wallet).to.deep.include(applicationWallet);
  });

  it('deployFutureWallet returns deployedWallet', async () => {
    expect(walletService.state).to.deep.eq({kind: 'None'});

    walletService.setFutureWallet(futureWallet, 'justyna.mylogin.eth');
    expect(walletService.state).to.deep.eq({kind: 'Future', name: 'justyna.mylogin.eth', wallet: futureWallet});
    walletService.setGasParameters({
      gasPrice: constants.One,
      gasToken: ETHER_NATIVE_TOKEN.address,
    });
    expect(await walletService.deployFutureWallet()).to.deep.include(applicationWallet);
  });
});
