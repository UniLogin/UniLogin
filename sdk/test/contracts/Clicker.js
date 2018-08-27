import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import Clicker from '../../build/Clicker';
import {createMockProvider, deployContract, getWallets, solidity} from 'ethereum-waffle';


chai.use(chaiAsPromised);
chai.use(solidity);

const {expect} = chai;

describe('Clicker', async () => { 
  let provider;
  let wallet;
  let clicker;
  let args;

  const initialClicks = 10;

  beforeEach(async () => {
    provider = createMockProvider();
    [wallet] = await getWallets(provider);
    args = [];
    clicker = await deployContract(wallet, Clicker, args);
  });

  describe('Create', async () => {
    it('Should be deployed successfully', async () => {
      const {address} = clicker;
      expect(address).to.not.be.null;
    });

    it('Should initiate successfully', async () => {
      await clicker.initiate();
      const click = await clicker.clicks(wallet.address);
      expect(click[0]).to.eq(initialClicks);
      expect(click[1]).to.be.true;
    });

    it('Should not allow to second inititate', async () => {
      await clicker.initiate();
      await expect(clicker.initiate()).to.be.reverted;
    });

    it('Should return clicks left correctly', async () => {
      await clicker.initiate();
      const clicksLeft = await clicker.getClicks(wallet.address);
      expect(clicksLeft).to.eq(initialClicks);
    });

    it('Should click successfully', async () => {
      await clicker.initiate();
      await clicker.click();
      const clicksLeft = await clicker.getClicks(wallet.address);
      expect(clicksLeft).not.to.eq(initialClicks);
    });

    it('should not allow to click unknown user', async () => {
      await expect(clicker.click()).to.be.reverted;
    });

    it('should not allow to click more than 10 times', async () => {
      await clicker.initiate();
      for (let counter = 0; counter < 10; counter++) {
        await clicker.click();
      }
      await expect(clicker.click()).to.be.reverted;
    });
  });
});
