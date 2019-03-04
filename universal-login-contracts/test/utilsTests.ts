import chai, {expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import {createMockProvider, getWallets, solidity} from 'ethereum-waffle';
import {messageSignature, getExecutionArgs} from './utils';
import {utils} from 'ethers';
import DEFAULT_PAYMENT_OPTIONS from '../lib/defaultPaymentOptions';
import {concatenateSignatures} from '../lib/calculateMessageSignature';

chai.use(chaiAsPromised);
chai.use(solidity);

const {gasToken, gasPrice, gasLimit} = DEFAULT_PAYMENT_OPTIONS;

describe('Tools test', async () => {
  const provider = createMockProvider();
  const [wallet] = getWallets(provider);
  const value = utils.parseEther('0.1');
  const data = utils.hexlify(0);
  const nonce = 0;

  it('Should return correct message signature', async () => {
    const from = wallet.address;
    const signature = await messageSignature(wallet, wallet.address, from, value, data, nonce, gasToken, gasPrice, gasLimit);
    const message = utils.arrayify(utils.solidityKeccak256(
      ['address', 'address', 'uint256', 'bytes', 'uint256', 'address', 'uint', 'uint'],
      [wallet.address, from, value, data, nonce, gasToken, gasPrice, gasLimit]));
    expect(utils.verifyMessage(message, signature)).to.eq(wallet.address);
  });

  it('Should concatenate two bytes arrays', async () => {
      const sig1 = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';
      const sig2 = '0xe241748c6bd2bf25fcc0ab862501180914ed5281773803e4cd8f7c14e0b16cd46e6495a3879b1dd7841bdebe8d773ecbc2ec7a9c53500db230280a885e1119a81b';
      const expected = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe241748c6bd2bf25fcc0ab862501180914ed5281773803e4cd8f7c14e0b16cd46e6495a3879b1dd7841bdebe8d773ecbc2ec7a9c53500db230280a885e1119a81b';
      const concatenate = concatenateSignatures([sig1, sig2]);
      expect(concatenate).to.be.equal(expected);
  });

  it('Should not concatenate two bytes arrays without 0x prefix', async () => {
      const sig1 = 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';
      const sig2 = 'ffe241748c6bd2bf25fcc0ab862501180914ed5281773803e4cd8f7c14e0b16cd46e6495a3879b1dd7841bdebe8d773ecbc2ec7a9c53500db230280a885e1119a81b';
      expect(concatenateSignatures.bind(null, [sig1, sig2])).to.throw(`Invalid Signature: ${sig1} needs prefix 0x`);
  });

    it('Should not concatenate two bytes arrays without 0x prefix', async () => {
      const sig1 = 'ffff';
      const sig2 = 'ffe2';
      expect(concatenateSignatures.bind(null, [sig1, sig2])).to.throw(`Invalid signature length: ${sig1} should be 132`);
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
        operationType: 0,
      };

      const expectedResult = [
        '0x0000000000000000000000000000000000000001',
        utils.parseEther('1.0'),
        0x0,
        0,
        0,
        '0x0000000000000000000000000000000000000000',
        0,
        0,
      ];
      expect(getExecutionArgs(msg)).to.deep.eq(expectedResult);
    });
  });
});
