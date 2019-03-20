import {expect} from 'chai';
import GreetingService from '../../src/services/GreetingService';
import {createMockProvider, getWallets, deployContract} from 'ethereum-waffle';
import KeyHolder from 'universal-login-contracts/build/KeyHolder';
import {ACTION_KEY} from 'universal-login-contracts';

describe('Greeting service', async () => {
  let greetingService;
  let provider;
  let walletContract;

  before(() => {
    provider = createMockProvider();
  });

  describe('created', () => {
    before(async () => {
      const [wallet] = await getWallets(provider);
      const key = wallet.address;
      walletContract = await deployContract(wallet, KeyHolder, [key]);
      greetingService = new GreetingService(provider);
    });

    it('by default is created', async () => {
      expect(await greetingService.getStatus(walletContract.address)).to.deep.eq({
        create: 'old',
        addKey: 'unfinished',
        backupKeys: 'unfinished'
      });
    });

    it('created is fresh if eventName created', async () => {
      expect(await greetingService.getStatus(walletContract.address, 'created')).to.deep.eq({
        create: 'fresh',
        addKey: 'unfinished',
        backupKeys: 'unfinished'
      });
    });
  });

  describe('keyAdded', () => {
    before(async () => {
      const [wallet, someOtherWallet] = await getWallets(provider);
      const key = wallet.address;
      const key2 = someOtherWallet.address;
      walletContract = await deployContract(wallet, KeyHolder, [key]);
      await walletContract.addKey(key2, ACTION_KEY);
      greetingService = new GreetingService(provider);
    });

    it('keyAdded old if key event emitted', async () => {
      expect(await greetingService.getStatus(walletContract.address, '')).to.deep.eq({
        create: 'old',
        addKey: 'old',
        backupKeys: 'unfinished'
      });
    });

    it('keyAdded fresh if key event emitted and event addKey', async () => {
      expect(await greetingService.getStatus(walletContract.address,'addKey')).to.deep.eq({
        create: 'old',
        addKey: 'fresh',
        backupKeys: 'unfinished'
      });
    });
  });

  describe('backupKeys', () => {
    before(async () => {
      const [wallet, wallet2, wallet3] = await getWallets(provider);
      const key = wallet.address;
      const key2 = wallet2.address;
      const key3 = wallet3.address;
      walletContract = await deployContract(wallet, KeyHolder, [key]);
      await walletContract.addKeys([key2, key3], [ACTION_KEY, ACTION_KEY]);
      greetingService = new GreetingService(provider, walletContract.address);
    });

    it('keyAdded old if key event emitted', async () => {
      expect(await greetingService.getStatus(walletContract.address, '')).to.deep.eq({
        create: 'old',
        addKey: 'unfinished',
        backupKeys: 'old'
      });
    });

    it('keyAdded fresh if key event emitted and event addKey', async () => {
      expect(await greetingService.getStatus(walletContract.address, 'backupKeys')).to.deep.eq({
        create: 'old',
        addKey: 'unfinished',
        backupKeys: 'fresh'
      });
    });
  });
});
