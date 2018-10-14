import chai, {expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import {createMockProvider, getWallets, solidity, deployContract} from 'ethereum-waffle';
import {messageSignature, addressToBytes32, hasEnoughToken, getKeyFromData, isAddKeyCall, isAddKeysCall} from '../../lib/utils/utils';
import {utils, Wallet, Interface} from 'ethers';
import MockToken from 'universal-login-contracts/build/MockToken';
import ERC725ApprovalScheme from 'universal-login-contracts/build/ERC725ApprovalScheme';
import {MANAGEMENT_KEY, ECDSA_TYPE, ACTION_KEY} from 'universal-login-contracts';
import Identity from 'universal-login-contracts/build/Identity';

chai.use(chaiAsPromised);
chai.use(solidity);

describe('Tools test', async () => {
  let provider;
  let wallet;
  let otherWallet;
  const value = utils.parseEther('0.1');
  const data = utils.hexlify(0);
  const ether = '0x0000000000000000000000000000000000000000';
  const gasPrice = 1000000000;
  const gasLimit = 1000000;
  
  before(async () => {
    provider = createMockProvider();
    [wallet, otherWallet] = await getWallets(provider);
  });

  describe('messageSignature', async () => {
    it('Should return correct message signature', async () => {
      const from = wallet.address;
      const signature = await messageSignature(wallet, wallet.address, from, value, data, 0, ether, gasPrice, gasLimit);
      const message = utils.arrayify(utils.solidityKeccak256(
        ['address', 'address', 'uint256', 'bytes', 'uint256', 'address', 'uint', 'uint'],
        [wallet.address, from, value, data, 0, ether, gasPrice, gasLimit]));
      expect(Wallet.verifyMessage(message, signature)).to.eq(wallet.address);
    });  
  });

  describe('hasEnoughToken', async () => {
    let token;
    let identity;

    before(async () => {
      token = await deployContract(wallet, MockToken, []);
      identity = await deployContract(wallet, ERC725ApprovalScheme, [addressToBytes32(wallet.address)]);
      await token.transfer(identity.address, utils.parseEther('1'));
    });

    it('Should return true if contract has enough token', async () => {
      expect(await hasEnoughToken(token.address, identity.address, gasLimit, provider)).to.be.true;
      expect(await hasEnoughToken(token.address, identity.address, gasLimit * 2, provider)).to.be.true;
      expect(await hasEnoughToken(token.address, identity.address, utils.parseEther('0.09'), provider)).to.be.true;
      expect(await hasEnoughToken(token.address, identity.address, utils.parseEther('0.9'), provider)).to.be.true;
    });

    it('Should return false if contract has not enough token', async () => {
      expect(await hasEnoughToken(token.address, identity.address, utils.parseEther('1.00001'), provider)).to.be.false;
      expect(await hasEnoughToken(token.address, identity.address, utils.parseEther('1.1'), provider)).to.be.false;
      expect(await hasEnoughToken(token.address, identity.address, utils.parseEther('2'), provider)).to.be.false;
      expect(await hasEnoughToken(token.address, identity.address, utils.parseEther('10'), provider)).to.be.false;
    });

    it('Should throw error, when ether refunds', async () => {
      expect(hasEnoughToken(ether, identity.address, utils.parseEther('1'), provider)).to.be.eventually.rejectedWith(Error);
    });

    it('Should throw error, when passed address is not a token address', async () => {
      expect(hasEnoughToken(otherWallet.address, identity.address, utils.parseEther('2'), provider)).to.be.eventually.rejectedWith(Error);
    });
  });

  describe('getKeyFromData', async () => {
    it('Should return proper key', async () => {
      const {data} = new Interface(Identity.interface).functions.addKey(addressToBytes32(wallet.address), ACTION_KEY, ECDSA_TYPE);
      expect(getKeyFromData(data)).to.eq(wallet.address.toLowerCase()); // OK?
    });
  });

  describe('isAddKeyCall', async () => {
    it('Should return true if addKey call', async () => {
      const {data} = new Interface(Identity.interface).functions.addKey(addressToBytes32(wallet.address), ACTION_KEY, ECDSA_TYPE);
      expect(isAddKeyCall(data)).to.be.true;
    });

    it('Should return false if no addKey call', async () => {
      const {data} = new Interface(Identity.interface).functions.removeKey(addressToBytes32(wallet.address), ACTION_KEY);
      expect(isAddKeyCall(data)).to.be.false;
    });
  });

  describe('isAddKeysCall', async () => {
    it('Should return true if addKeys call', async () => {
      const keys = [addressToBytes32(wallet.address), addressToBytes32(otherWallet.address)];
      const keyRoles = new Array(keys.length).fill(MANAGEMENT_KEY);
      const keyTypes = new Array(keys.length).fill(ECDSA_TYPE);
      const {data} = new Interface(Identity.interface).functions.addKeys(keys, keyRoles, keyTypes);
      expect(isAddKeysCall(data)).to.be.true; 
    });

    it('Should return false if no addKeys call', async () => {
      const {data} = new Interface(Identity.interface).functions.removeKey(addressToBytes32(wallet.address), ACTION_KEY);
      expect(isAddKeysCall(data)).to.be.false;
    });
  });
});
