
import chai, {expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import {createMockProvider, getWallets, solidity, deployContract} from 'ethereum-waffle';
import {utils, providers, Wallet, Contract} from 'ethers';
import {ETHER_NATIVE_TOKEN} from '@universal-login/commons';
import MockToken from '@universal-login/contracts/build/MockToken.json';
import KeyHolder from '@universal-login/contracts/build/KeyHolder.json';
import {hasEnoughToken} from '../../../lib/services/messages/validations';

chai.use(chaiAsPromised);
chai.use(solidity);

describe('Tools test', async () => {
  let provider : providers.Provider;
  let wallet : Wallet;
  let otherWallet : Wallet;
  const gasLimit = 1000000;

  before(async () => {
    provider = createMockProvider();
    [wallet, otherWallet] = await getWallets(provider);
  });

  describe('hasEnoughToken', async () => {
    let token : Contract;
    let walletContract : Contract;

    before(async () => {
      token = await deployContract(wallet, MockToken, []);
      walletContract = await deployContract(wallet, KeyHolder, [wallet.address]);
      await wallet.sendTransaction({to: walletContract.address, value: utils.parseEther('1.0')});
      await token.transfer(walletContract.address, utils.parseEther('1'));
    });

    it('Should return true if contract has enough token', async () => {
      expect(await hasEnoughToken(token.address, walletContract.address, gasLimit, provider)).to.be.true;
      expect(await hasEnoughToken(token.address, walletContract.address, gasLimit * 2, provider)).to.be.true;
      expect(await hasEnoughToken(token.address, walletContract.address, utils.parseEther('0.09'), provider)).to.be.true;
      expect(await hasEnoughToken(token.address, walletContract.address, utils.parseEther('0.9'), provider)).to.be.true;
    });

    it('Should return false if contract has not enough token', async () => {
      expect(await hasEnoughToken(token.address, walletContract.address, utils.parseEther('1.00001'), provider)).to.be.false;
      expect(await hasEnoughToken(token.address, walletContract.address, utils.parseEther('1.1'), provider)).to.be.false;
      expect(await hasEnoughToken(token.address, walletContract.address, utils.parseEther('2'), provider)).to.be.false;
      expect(await hasEnoughToken(token.address, walletContract.address, utils.parseEther('10'), provider)).to.be.false;
    });

    it('Should return true if contract has enough ethers', async () => {
      expect(await hasEnoughToken(ETHER_NATIVE_TOKEN.address, walletContract.address, gasLimit, provider)).to.be.true;
      expect(await hasEnoughToken(ETHER_NATIVE_TOKEN.address, walletContract.address, utils.parseEther('1.0'), provider)).to.be.true;
    });

    it('Should return false if contract has not enough ethers', async () => {
      expect(await hasEnoughToken(ETHER_NATIVE_TOKEN.address, walletContract.address, utils.parseEther('1.01'), provider)).to.be.false;
      expect(await hasEnoughToken(ETHER_NATIVE_TOKEN.address, walletContract.address, utils.parseEther('2.0'), provider)).to.be.false;
    });

    it('Should throw error, when passed address is not a token address', async () => {
      expect(hasEnoughToken(otherWallet.address, walletContract.address, utils.parseEther('2'), provider)).to.be.eventually.rejectedWith(Error);
    });
  });
});
