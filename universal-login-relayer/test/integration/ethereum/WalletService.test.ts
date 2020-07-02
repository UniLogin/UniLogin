import {createKeyPair, EMPTY_DEVICE_INFO, ETHER_NATIVE_TOKEN, TEST_GAS_PRICE} from '@unilogin/commons';
import {GnosisSafeInterface} from '@unilogin/contracts';
import chai, {expect} from 'chai';
import {MockProvider} from 'ethereum-waffle';
import {Contract, Wallet} from 'ethers';
import sinonChai from 'sinon-chai';
import ENSService from '../../../src/integration/ethereum/ensService';
import {WalletDeploymentService} from '../../../src/integration/ethereum/WalletDeploymentService';
import setupWalletService, {createFutureWalletUsingEnsService, getSetupDataUsingEnsService} from '../../testhelpers/setupWalletService';

chai.use(require('chai-string'));
chai.use(sinonChai);

describe('INT: WalletService', () => {
  let walletService: WalletDeploymentService;
  let provider: MockProvider;
  let wallet: Wallet;
  let walletContract: Contract;
  let factoryContract: Contract;
  let fallbackHandler: Contract;
  let ensService: ENSService;
  let ensRegistrar: Contract;
  let gnosisSafeMaster: Contract;
  const keyPair = createKeyPair();
  const ensName = 'alex.mylogin.eth';
  let fakeDevicesService: any;

  before(async () => {
    provider = new MockProvider();
    [wallet] = provider.getWallets();
    ({walletService, factoryContract, ensService, provider, fakeDevicesService, ensRegistrar, gnosisSafeMaster, fallbackHandler} = await setupWalletService(wallet));
    const {contractAddress, signature} = await createFutureWalletUsingEnsService(keyPair, ensName, factoryContract, wallet, ensService, ensRegistrar.address, gnosisSafeMaster.address, fallbackHandler.address);
    await walletService.deploy({publicKey: keyPair.publicKey, ensName, gasPrice: TEST_GAS_PRICE, signature, gasToken: ETHER_NATIVE_TOKEN.address}, EMPTY_DEVICE_INFO);
    walletContract = new Contract(contractAddress, GnosisSafeInterface, provider);
  });

  describe('Create', () => {
    it('is initialized with management key', async () => {
      expect(await walletContract.getThreshold()).to.eq(1);
      expect(await walletContract.isOwner(keyPair.publicKey)).to.eq(true);
    });

    it('has ENS name reserved', async () => {
      expect(await provider.resolveName(ensName)).to.eq(walletContract.address);
    });

    it('should fail with not existing ENS name', async () => {
      const creationPromise = walletService.deploy({publicKey: wallet.address, ensName: 'alex.non-existing-id.eth', signature: 'SOME_SIGNATURE', gasPrice: '1', gasToken: ETHER_NATIVE_TOKEN.address}, EMPTY_DEVICE_INFO);
      await expect(creationPromise)
        .to.be.eventually.rejectedWith('ENS domain alex.non-existing-id.eth does not exist or is not compatible with Universal Login');
    });

    it('deploy should add deviceInfo', async () => {
      const keyPair2 = createKeyPair();
      const ensName = 'jarek.mylogin.eth';
      const {contractAddress, signature} = await createFutureWalletUsingEnsService(keyPair2, ensName, factoryContract, wallet, ensService, ensRegistrar.address, gnosisSafeMaster.address, fallbackHandler.address);
      const creationPromise = walletService.deploy({publicKey: keyPair2.publicKey, ensName, signature, gasPrice: TEST_GAS_PRICE, gasToken: ETHER_NATIVE_TOKEN.address}, EMPTY_DEVICE_INFO);
      await expect(creationPromise).to.be.fulfilled;
      expect(fakeDevicesService.addOrUpdate).be.calledOnceWithExactly(contractAddress, keyPair2.publicKey, EMPTY_DEVICE_INFO);
    });

    it('deployed with gasPrice eq zero with gas price from oracle', async () => {
      const ensName = 'name.mylogin.eth';
      const gasPrice = '0';
      const {signature} = await createFutureWalletUsingEnsService(keyPair, ensName, factoryContract, wallet, ensService, ensRegistrar.address, gnosisSafeMaster.address, fallbackHandler.address, gasPrice);
      const transaction = await walletService.deploy({publicKey: keyPair.publicKey, ensName, signature, gasPrice, gasToken: ETHER_NATIVE_TOKEN.address}, EMPTY_DEVICE_INFO);
      expect(transaction.gasPrice.toString()).deep.eq('20000000000');
    });

    it('setup initialize data', async () => {
      const keyPair = createKeyPair();
      const ensName = 'qwertyuiop.mylogin.eth';
      const gasPrice = '1';
      const initializeData = await walletService.setupInitializeData({publicKey: keyPair.publicKey, ensName, gasPrice, gasToken: ETHER_NATIVE_TOKEN.address});
      const expectedInitializeData = await getSetupDataUsingEnsService(keyPair, ensName, ensService, gasPrice, wallet.address, ensRegistrar.address, fallbackHandler.address, ETHER_NATIVE_TOKEN.address);
      expect(initializeData).to.eq(expectedInitializeData);
    });

    afterEach(() => {
      fakeDevicesService.addOrUpdate.resetHistory();
    });
  });
});
