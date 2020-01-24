import {createKeyPair, EMPTY_DEVICE_INFO, ETHER_NATIVE_TOKEN, TEST_GAS_PRICE} from '@universal-login/commons';
import {GnosisSafeInterface} from '@universal-login/contracts';
import chai, {expect} from 'chai';
import {createMockProvider, getWallets} from 'ethereum-waffle';
import {Contract, providers, utils, Wallet} from 'ethers';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import ENSService from '../../../src/integration/ethereum/ensService';
import {WalletDeploymentService} from '../../../src/integration/ethereum/WalletDeploymentService';
import setupWalletService, {createFutureWallet, getSetupData} from '../../testhelpers/setupWalletService';

chai.use(require('chai-string'));
chai.use(sinonChai);

describe('INT: WalletService', async () => {
  let walletService: WalletDeploymentService;
  let provider: providers.Provider;
  let wallet: Wallet;
  let callback: sinon.SinonSpy;
  let walletContract: Contract;
  let factoryContract: Contract;
  let ensService: ENSService;
  let ensRegistrar: string;
  let walletContractAddress: string;
  const keyPair = createKeyPair();
  const ensName = 'alex.mylogin.eth';
  let transaction: utils.Transaction;
  let fakeDevicesService: any;

  before(async () => {
    provider = createMockProvider();
    [wallet] = getWallets(provider);
    ({walletService, callback, factoryContract, ensService, provider, fakeDevicesService, ensRegistrar, walletContractAddress} = await setupWalletService(wallet));
    const {futureContractAddress, signature} = await createFutureWallet(keyPair, ensName, factoryContract, wallet, ensService, ensRegistrar, walletContractAddress);
    transaction = await walletService.deploy({publicKey: keyPair.publicKey, ensName, gasPrice: TEST_GAS_PRICE, signature, gasToken: ETHER_NATIVE_TOKEN.address}, EMPTY_DEVICE_INFO);
    walletContract = new Contract(futureContractAddress, GnosisSafeInterface, provider);
  });

  describe('Create', async () => {
    it('is initialized with management key', async () => {
      expect(await walletContract.getThreshold()).to.eq(1);
      expect(await walletContract.isOwner(keyPair.publicKey)).to.eq(true);
    });

    it('has ENS name reserved', async () => {
      expect(await provider.resolveName(ensName)).to.eq(walletContract.address);
    });

    it('should emit created event', async () => {
      expect(callback).to.be.calledWith(sinon.match({transaction}));
    });

    it('should fail with not existing ENS name', async () => {
      const creationPromise = walletService.deploy({publicKey: wallet.address, ensName: 'alex.non-existing-id.eth', signature: 'SOME_SIGNATURE', gasPrice: '1', gasToken: ETHER_NATIVE_TOKEN.address}, EMPTY_DEVICE_INFO);
      await expect(creationPromise)
        .to.be.eventually.rejectedWith('ENS domain alex.non-existing-id.eth does not exist or is not compatible with Universal Login');
    });

    it('deploy should add deviceInfo', async () => {
      const keyPair2 = createKeyPair();
      const ensName = 'jarek.mylogin.eth';
      const {futureContractAddress, signature} = await createFutureWallet(keyPair2, ensName, factoryContract, wallet, ensService, ensRegistrar, walletContractAddress);
      const creationPromise = walletService.deploy({publicKey: keyPair2.publicKey, ensName, signature, gasPrice: '1', gasToken: ETHER_NATIVE_TOKEN.address}, EMPTY_DEVICE_INFO);
      await expect(creationPromise).to.be.fulfilled;
      expect(fakeDevicesService.addOrUpdate).be.calledOnceWithExactly(futureContractAddress, keyPair2.publicKey, EMPTY_DEVICE_INFO);
    });

    it('throw error if gasPrice is 0', async () => {
      const ensName = 'name.mylogin.eth';
      const gasPrice = '0';
      const {signature} = await createFutureWallet(keyPair, ensName, factoryContract, wallet, ensService, ensRegistrar, walletContractAddress, gasPrice);
      const creationPromise = walletService.deploy({publicKey: keyPair.publicKey, ensName, signature, gasPrice, gasToken: ETHER_NATIVE_TOKEN.address}, EMPTY_DEVICE_INFO);
      await expect(creationPromise).to.be.rejectedWith('Not enough gas');
    });

    it('setup initialize data', async () => {
      const keyPair = createKeyPair();
      const ensName = 'qwertyuiop.mylogin.eth';
      const gasPrice = '1';
      const initializeData = await walletService.setupInitializeData({publicKey: keyPair.publicKey, ensName, gasPrice, gasToken: ETHER_NATIVE_TOKEN.address});
      const expectedInitializeData = await getSetupData(keyPair, ensName, ensService, gasPrice, wallet.address, ensRegistrar, ETHER_NATIVE_TOKEN.address);
      expect(initializeData).to.eq(expectedInitializeData);
    });

    afterEach(() => {
      fakeDevicesService.addOrUpdate.resetHistory();
    });
  });
});
