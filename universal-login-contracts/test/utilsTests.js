import chai, {expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import {createMockProvider, getWallets, solidity} from 'ethereum-waffle';
import {messageSignature} from './utils';
import {utils, Wallet} from 'ethers';
import DEFAULT_PAYMENT_OPTIONS from '../lib/defaultPaymentOptions';

chai.use(chaiAsPromised);
chai.use(solidity);

const {gasToken, gasPrice, gasLimit} = DEFAULT_PAYMENT_OPTIONS;

describe('Tools test', async () => {
  let provider;
  let wallet;
  const value = utils.parseEther('0.1');
  const data = utils.hexlify(0);
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
