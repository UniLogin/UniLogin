import chai, {expect} from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { providers, Wallet, Contract } from 'ethers';
import setupWalletService from '../../helpers/setupWalletService';
import WalletService from '../../../lib/services/WalletService';

chai.use(require('chai-string'));
chai.use(sinonChai);


describe('Relayer - WalletService', async () => {
  let walletService: WalletService;
  let provider: providers.Provider;
  let wallet: Wallet;
  let callback: sinon.SinonSpy;
  let walletContract: Contract;

  before(async () => {
    ({wallet, provider, walletService, callback, walletContract} = await setupWalletService());
  });

  describe('Create', async () => {
    it('returns contract address', async () => {
      expect(walletContract.address).to.be.properAddress;
    });

    it('is initialized with management key', async () => {
      expect(await walletContract.keyExist(wallet.address)).to.eq(true);
    });

    it('has ENS name reserved', async () => {
      expect(await provider.resolveName('alex.mylogin.eth')).to.eq(walletContract.address);
    });

    it('should emit created event', async () => {
      const transaction = await walletService.create(wallet.address, 'example.mylogin.eth');
      expect(callback).to.be.calledWith(sinon.match(transaction));
    });

    it('should fail with not existing ENS name', async () => {
      const creationPromise = walletService.create(wallet.address, 'alex.non-existing-id.eth');
      await expect(creationPromise).to.be.eventually.rejectedWith('domain not existing / not universal ID compatible');
    });
  });
});
