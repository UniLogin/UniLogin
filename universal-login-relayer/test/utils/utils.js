import chai, {expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import {createMockProvider, getWallets, solidity, deployContract} from 'ethereum-waffle';
import {messageSignature, isEnoughGasLimit, addressToBytes32, hasEnoughToken} from '../../lib/utils/utils';
import {utils, Wallet} from 'ethers';
import MockToken from 'universal-login-contracts/build/MockToken';
import ERC725ApprovalScheme from 'universal-login-contracts/build/ERC725ApprovalScheme';

chai.use(chaiAsPromised);
chai.use(solidity);

describe('Tools test', async () => {
  let provider;
  let wallet;
  const value = utils.parseEther('0.1');
  const data = utils.hexlify(0);
  const gasToken = '0x0000000000000000000000000000000000000000';
  const gasPrice = 1000000000;
  const gasLimit = 1000000;
  const nonce = 0;
  
  before(async () => {
    provider = createMockProvider();
    [wallet] = await getWallets(provider);
  });

  describe('messageSignature', async () => {
    it('Should return correct message signature', async () => {
      const from = wallet.address;
      const signature = await messageSignature(wallet, wallet.address, from, value, data, nonce, gasToken, gasPrice, gasLimit);
      const message = utils.arrayify(utils.solidityKeccak256(
        ['address', 'address', 'uint256', 'bytes', 'uint256', 'address', 'uint', 'uint'],
        [wallet.address, from, value, data, nonce, gasToken, gasPrice, gasLimit]));
      expect(Wallet.verifyMessage(message, signature)).to.eq(wallet.address);
    });  
  });

  describe('isEnoughGasLimit', async () => {
    it('Should return true if is enough gasLimit', async () => {
      expect(isEnoughGasLimit(gasLimit - 1 , gasLimit)).to.be.true;
      expect(isEnoughGasLimit(gasLimit, gasLimit)).to.be.true;
    });

    it('Should return false if is not enough gasLimit', async () => {
      expect(isEnoughGasLimit(gasLimit * 2, gasLimit)).to.be.false;
      expect(isEnoughGasLimit(gasLimit + 1, gasLimit)).to.be.false;
    });
  });

  describe('hasEnoughToken', async () => {
    let token;
    let identity;

    before(async () => {
      token = await deployContract(wallet, MockToken, []);
      identity = await deployContract(wallet, ERC725ApprovalScheme, [addressToBytes32(wallet.address)]);
    });

    it('Should return true if contract has enough token', async () => {
      await token.transfer(identity.address, utils.parseEther('1'));
      expect(await hasEnoughToken(token.address, identity.address, gasLimit, wallet)).to.be.true;
    });

    it('Should return false if contract has not enough token', async () => {
      expect(await hasEnoughToken(token.address, identity.address, utils.parseEther('2'), wallet)).to.be.false;
    });
  });
});
