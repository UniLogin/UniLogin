import chai, {expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import {createMockProvider, getWallets, solidity} from 'ethereum-waffle';
import {messageSignature, getExecutionArgs} from './utils';
import {utils} from 'ethers';
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
    expect(utils.verifyMessage(message, signature)).to.eq(wallet.address);
  });

  describe('getExecutionArgs', () => {
    it('should return corect array', async () => {
      const msg = {
        to: '0x0000000000000000000000000000000000000001',
        value: utils.parseEther('1.0'),
        data: 0x0,
        nonce: 0,
        gasPrice: 0,
        gasLimit: 0,
        gasToken: '0x0000000000000000000000000000000000000000',
        operationType: 0
      };

      const expectedResult = [
        '0x0000000000000000000000000000000000000001',
        utils.parseEther('1.0'),
        0x0,
        0,
        0,
        '0x0000000000000000000000000000000000000000',
        0,
        0
      ];
      expect(getExecutionArgs(msg)).to.deep.eq(expectedResult);
    });
  });
});
