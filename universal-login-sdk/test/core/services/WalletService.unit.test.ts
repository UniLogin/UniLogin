import chai, {expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';
import {TEST_ACCOUNT_ADDRESS, TEST_CONTRACT_ADDRESS, TEST_PRIVATE_KEY, ApplicationWallet, TEST_MESSAGE_HASH, ETHER_NATIVE_TOKEN, TEST_TRANSACTION_HASH, TEST_GAS_PRICE} from '@unilogin/commons';
import {WalletService} from '../../../src/core/services/WalletService';
import {Wallet} from 'ethers';
import {DeployedWallet} from '../../../src/api/wallet/DeployedWallet';
import {FutureWallet} from '../../../src/api/wallet/FutureWallet';
import {DeployingWallet} from '../../../src';

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
      walletContractService: {keyExist},
      relayerApi: {
        getDeploymentStatus: sinon.stub().resolves({transactionHash: TEST_TRANSACTION_HASH, state: 'Success'}),
      },
      sdkConfig: {
        mineableFactoryTick: 10,
        mineableFactoryTimeout: 100,
      },
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
    const deployingWallet = new DeployingWallet({
      contractAddress: TEST_ACCOUNT_ADDRESS,
      name: 'justyna.mylogin.eth',
      privateKey: TEST_PRIVATE_KEY,
      deploymentHash: TEST_MESSAGE_HASH,
    }, sdk);

    futureWallet = {
      contractAddress: TEST_ACCOUNT_ADDRESS,
      privateKey: TEST_PRIVATE_KEY,
      ensName: 'justyna.mylogin.eth',
      gasPrice: TEST_GAS_PRICE,
      gasToken: ETHER_NATIVE_TOKEN.address,
      deploy: sinon.stub().resolves(deployingWallet),
      waitForBalance: (async () => {}) as any,
      setSupportedToken: (() => {}) as any,
    } as any;

    storage = {
      get: () => JSON.stringify({kind: 'Deployed', wallet: applicationWallet}),
      set: sinon.fake(),
      remove: sinon.fake(),
    };
  });

  beforeEach(() => {
    walletService = new WalletService(sdk, walletFromPassphrase, storage);
    storage.set.resetHistory();
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
    expect(storage.set).to.be.calledWith('wallet', JSON.stringify({kind: 'None'}));
  });

  it('connect set state to Deployed', () => {
    walletService.setWallet(applicationWallet);
    expect(walletService.state.kind).to.eq('Deployed');
    expect((walletService.state as any).wallet).to.deep.include(applicationWallet);
    expect(storage.set).to.be.calledWith('wallet', JSON.stringify({kind: 'Deployed', wallet: applicationWallet}));
  });

  it('roundtrip', () => {
    expect(walletService.state).to.deep.eq({kind: 'None'});

    walletService.setFutureWallet(futureWallet, 'justyna.mylogin.eth');
    expect(storage.set).to.be.calledWith('wallet', JSON.stringify({kind: 'Future', name: 'justyna.mylogin.eth', wallet: futureWallet}));
    expect(storage.set).to.be.calledWith(
      'wallet',
      JSON.stringify({
        kind: 'Future',
        name: 'justyna.mylogin.eth',
        wallet: {
          contractAddress: futureWallet.contractAddress,
          privateKey: futureWallet.privateKey,
          ensName: 'justyna.mylogin.eth',
          gasPrice: TEST_GAS_PRICE,
          gasToken: ETHER_NATIVE_TOKEN.address,
        },
      }));

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

    expect(storage.set).to.be.calledWith('wallet', JSON.stringify({kind: 'Deployed', wallet: applicationWallet}));
  });

  it('should throw if future wallet is not set', () => {
    expect(() => walletService.setDeployed()).to.throw('Wallet state is None, but expected Future');
  });

  it('should throw if wallet is overridden', () => {
    walletService.setWallet(applicationWallet);
    expect(() => walletService.setFutureWallet(futureWallet, 'name.mylogin.eth')).to.throw('Wallet cannot be overridden');
  });

  it('should load from storage', () => {
    walletService.loadFromStorage();
    expect(walletService.state.kind).to.eq('Deployed');
    expect((walletService.state as any).wallet).to.deep.include(applicationWallet);
  });

  it('deployFutureWallet returns deployedWallet', async () => {
    expect(walletService.state).to.deep.eq({kind: 'None'});

    walletService.setFutureWallet(futureWallet, 'justyna.mylogin.eth');
    expect(walletService.state).to.deep.eq({kind: 'Future', name: 'justyna.mylogin.eth', wallet: futureWallet});
    expect(await walletService.deployFutureWallet()).to.deep.include(applicationWallet);
  });
});
