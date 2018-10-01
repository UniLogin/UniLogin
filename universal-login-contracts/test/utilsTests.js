import chai, {expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import {createMockProvider, getWallets, solidity} from 'ethereum-waffle';
import {messageSignature} from './utils';
import {utils, Wallet} from 'ethers';

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

  it('Should return correct message signature', async () => {
    const from = wallet.address;
    const signature = await messageSignature(wallet, wallet.address, from, value, data, nonce, gasToken, gasPrice, gasLimit);
    const message = utils.arrayify(utils.solidityKeccak256(
      ['address', 'address', 'uint256', 'bytes', 'uint256', 'address', 'uint', 'uint'],
      [wallet.address, from, value, data, nonce, gasToken, gasPrice, gasLimit]));
    expect(Wallet.verifyMessage(message, signature)).to.eq(wallet.address);
  });
});
