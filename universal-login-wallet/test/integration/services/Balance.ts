import chai, {expect} from 'chai';
import {EtherBalanceService} from '../../../src/services/balance/EtherBalanceService';
import {createMockProvider, solidity, getWallets} from 'ethereum-waffle';
import {utils, providers, Wallet} from 'ethers';
import {BalanceService} from '../../../src/services/balance/BalanceService';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import {waitUntil} from '@universal-login/commons';

chai.use(solidity);
chai.use(sinonChai);

const testTick = 30;
const value = utils.parseEther('1');
const walletService = {
  userWallet: {
    contractAddress: '0x0000000000000000000000000000000000000001',
    name: 'name',
    privateKey: '0x012345'
  },
  walletExists: () => true,
  disconnect: () => {},
  isAuthorized: () => true
};

describe('Balance', () => {
  let provider: providers.Provider;
  let wallet: Wallet;
  let etherBalanceService: EtherBalanceService;
  let balanceService: BalanceService;

  beforeEach(async () => {
    provider = createMockProvider();
    [wallet] = await getWallets(provider);
    etherBalanceService = new EtherBalanceService(provider, walletService);
    balanceService = new BalanceService(etherBalanceService, testTick);
    balanceService.start();
  });

  describe('EtherBalanceService', () => {
    it('should return correct balance', async () => {
      expect(await etherBalanceService.getBalance()).to.eq(0);
      await wallet.sendTransaction({to: walletService.userWallet.contractAddress, value});
      expect(await etherBalanceService.getBalance()).to.eq(value);
    });
  });

  describe('BalanceService', () => {
    it('should call callback with 0 balance', async () => {
      const callback = sinon.spy();
      const unsubscribe = balanceService.subscribe(callback);
      await waitUntil(() => !!callback.firstCall);
      expect(callback).to.have.been.called;
      expect(callback.firstCall.args[0]).to.eq(utils.bigNumberify(0));

      await wallet.sendTransaction({to: walletService.userWallet.contractAddress, value});
      await waitUntil(() => !!callback.secondCall);
      expect(callback).to.have.been.calledTwice;
      expect(callback.lastCall.args[0]).to.deep.eq(utils.bigNumberify(value));
      unsubscribe();
    });
  });

  afterEach(() => {
    balanceService.stop();
  });
});
