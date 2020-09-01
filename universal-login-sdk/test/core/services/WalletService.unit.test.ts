import chai, {expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';
import {TEST_ACCOUNT_ADDRESS, TEST_CONTRACT_ADDRESS, TEST_PRIVATE_KEY, TEST_MESSAGE_HASH, ETHER_NATIVE_TOKEN, TEST_TRANSACTION_HASH, TEST_GAS_PRICE} from '@unilogin/commons';
import {WalletService} from '../../../src/core/services/WalletService';
import {Wallet} from 'ethers';
import {DeployedWithoutEmailWallet} from '../../../src/api/wallet/DeployedWallet';
import {FutureWallet} from '../../../src/api/wallet/FutureWallet';
import {DeployingWallet} from '../../../src';
import {TEST_STORAGE_KEY} from '../../helpers/constants';
import {RequestedCreatingWallet} from '../../../src/api/wallet/RequestedCreatingWallet';
import {ConfirmedWallet} from '../../../src/api/wallet/ConfirmedWallet';
import {SerializedDeployedWithoutEmailWallet} from '../../../src/core/models/WalletService';

chai.use(chaiAsPromised);

describe('UNIT: WalletService', () => {
  const name = 'name.mylogin.eth';
  const passphrase = 'ik-akainy-vom-zazoji-juynuo';
  const invalidPassphrase = 'ukucas-ahecim-zazgor-ropgys';
  const walletFromPassphrase = sinon.stub();
  const keyExist = sinon.stub();
  let storage: any;
  let deployedWallet: DeployedWithoutEmailWallet;
  let futureWallet: FutureWallet;
  let sdk: any;
  let walletService: WalletService;
  let serializedDeployedWithoutEmailWallet: SerializedDeployedWithoutEmailWallet;

  before(() => {
    keyExist.resolves(false);
    keyExist.withArgs(TEST_CONTRACT_ADDRESS, TEST_ACCOUNT_ADDRESS).resolves(true);

    sdk = {
      getWalletContractAddress: sinon.stub().withArgs(name).returns(TEST_CONTRACT_ADDRESS),
      provider: Wallet.createRandom(),
      walletContractService: {keyExist},
      relayerApi: {
        getDeploymentStatus: sinon.stub().resolves({transactionHash: TEST_TRANSACTION_HASH, state: 'Success'}),
      },
      config: {
        mineableFactoryTick: 10,
        mineableFactoryTimeout: 100,
        network: 'ganache',
      },
      getRelayerConfig: sinon.stub().returns({network: 'ganache'}),
    };

    walletFromPassphrase.withArgs(name, passphrase).resolves({
      address: TEST_ACCOUNT_ADDRESS,
      privateKey: TEST_PRIVATE_KEY,
    });

    walletFromPassphrase.resolves({
      address: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      privateKey: TEST_PRIVATE_KEY,
    });

    deployedWallet = new DeployedWithoutEmailWallet(TEST_ACCOUNT_ADDRESS, 'justyna.mylogin.eth', TEST_PRIVATE_KEY, sdk);
    serializedDeployedWithoutEmailWallet = deployedWallet.asSerializedDeployedWithoutEmailWallet;
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
    } as any;

    storage = {
      get: () => JSON.stringify({kind: 'DeployedWithoutEmail', wallet: serializedDeployedWithoutEmailWallet}),
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
    expect(walletService.state.kind).to.eq('DeployedWithoutEmail');
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
    walletService.setWallet(serializedDeployedWithoutEmailWallet);
    walletService.disconnect();
    expect(walletService.state).to.deep.eq({kind: 'None'});
    expect(storage.set).to.be.calledWith(TEST_STORAGE_KEY, JSON.stringify({kind: 'None'}));
  });

  it('connect set state to DeployedWithoutEmail', () => {
    walletService.setWallet(serializedDeployedWithoutEmailWallet);
    expect(walletService.state.kind).to.eq('DeployedWithoutEmail');
    expect((walletService.state as any).wallet).to.deep.include(serializedDeployedWithoutEmailWallet);
    expect(storage.set).to.be.calledWith(TEST_STORAGE_KEY, JSON.stringify({kind: 'DeployedWithoutEmail', wallet: serializedDeployedWithoutEmailWallet}));
  });

  it('roundtrip', async () => {
    expect(walletService.state).to.deep.eq({kind: 'None'});

    walletService.setFutureWallet(futureWallet, 'justyna.mylogin.eth');
    expect(storage.set).to.be.calledWith(
      TEST_STORAGE_KEY,
      JSON.stringify({
        kind: 'Future',
        name: 'justyna.mylogin.eth',
        wallet: futureWallet,
      }));
    await walletService.deployFutureWallet();

    expect(walletService.state.kind).to.eq('DeployedWithoutEmail');
    expect((walletService.state as any).wallet).to.deep.include({
      contractAddress: futureWallet.contractAddress,
      name: serializedDeployedWithoutEmailWallet.name,
      privateKey: futureWallet.privateKey,
    });

    walletService.disconnect();
    expect(walletService.state).to.deep.eq({kind: 'None'});

    walletService.setWallet(serializedDeployedWithoutEmailWallet);
    expect(walletService.state.kind).to.eq('DeployedWithoutEmail');
    expect((walletService.state as any).wallet).to.deep.include(serializedDeployedWithoutEmailWallet);

    expect(storage.set).to.be.calledWith(TEST_STORAGE_KEY, JSON.stringify({kind: 'DeployedWithoutEmail', wallet: serializedDeployedWithoutEmailWallet}));
  });

  it('should throw if wallet is overridden', () => {
    walletService.setWallet(serializedDeployedWithoutEmailWallet);
    expect(() => walletService.setFutureWallet(futureWallet, 'name.mylogin.eth')).to.throw('Wallet cannot be overridden');
  });

  it('e-mail flow roundtrip', () => {
    expect(walletService.state).to.deep.eq({kind: 'None'});
    walletService.setRequested(new RequestedCreatingWallet(sdk, 'name@gmail.com', 'name.myklogin.eth'));
    expect(walletService.state.kind).to.eq('RequestedCreating');
    const confirmedWallet = new ConfirmedWallet('name@gmail.com', 'name.myklogin.eth', '111111');
    walletService.setConfirmed(confirmedWallet);
    expect(walletService.state.kind).to.eq('Confirmed');
    expect(walletService.getConfirmedWallet()).to.deep.eq(confirmedWallet);
    walletService.setFutureWallet(futureWallet, 'justyna.mylogin.eth');
    expect(walletService.state.kind).to.eq('Future');
  });

  it('should load from storage', async () => {
    await walletService.loadFromStorage();
    expect(walletService.state.kind).to.eq('DeployedWithoutEmail');
    expect((walletService.state as any).wallet).to.deep.include(serializedDeployedWithoutEmailWallet);
  });

  it('deployFutureWallet returns deployedWallet', async () => {
    expect(walletService.state).to.deep.eq({kind: 'None'});

    walletService.setFutureWallet(futureWallet, 'justyna.mylogin.eth');
    expect(walletService.state).to.deep.eq({kind: 'Future', name: 'justyna.mylogin.eth', wallet: futureWallet});
    expect(await walletService.deployFutureWallet()).to.deep.include(serializedDeployedWithoutEmailWallet);
  });
});
