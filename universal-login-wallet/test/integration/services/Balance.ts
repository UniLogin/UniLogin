import chai, {expect} from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import {utils, providers, Wallet} from 'ethers';
import {createMockProvider, solidity, getWallets} from 'ethereum-waffle';
import {TEST_ACCOUNT_ADDRESS, waitUntil} from '@universal-login/commons';
import {WalletService} from '@universal-login/sdk';
import {EtherBalanceService} from '../../../src/integration/ethereum/EtherBalanceService';
import {BalanceService} from '../../../src/core/services/BalanceService';

chai.use(solidity);
chai.use(sinonChai);

const testTick = 30;
const value = utils.parseEther('1');
const walletService = {
  applicationWallet: {
    contractAddress: TEST_ACCOUNT_ADDRESS,
    name: 'name',
    privateKey: '0x012345'
  },
  walletDeployed: () => true,
  disconnect: () => {},
  isAuthorized: () => true
} as WalletService;

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
      await wallet.sendTransaction({to: walletService.applicationWallet!.contractAddress, value});
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

      await wallet.sendTransaction({to: walletService.applicationWallet!.contractAddress, value});
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
