import {expect} from 'chai';
import {utils} from 'ethers';
import createSignedMessage from '../../lib/utils/signMessage';
import {transferMessage} from '../fixtures/basicWalletContract';
import {OPERATION_CALL} from '@universal-login/contracts';


describe('UNIT: signTransaction', async () => {
  it('sign a message', async () => {
    const privateKey = '0x899d97b42f840d59d60f3a18514b28042a1d86fa400d6cf9425ec3a9217d0cea';
    const expectedMessage = {
      from: '0x',
      to: '0x0000000000000000000000000000000000000001',
      value: utils.parseEther('0.5'),
      data: utils.formatBytes32String('0'),
      nonce: '0',
      gasPrice: transferMessage.gasPrice,
      gasLimit: transferMessage.gasLimit,
      gasToken: '0x0000000000000000000000000000000000000000',
      operationType: OPERATION_CALL,
      signature: '0x63a39d03344fdb869d372f773cf9f1457a971a9e6eaf3db2cf2dc51ab32fe6072d544e1e6c62c6a77588ed272351d5471438a31cc644ed286e2397321add3d1a1b'
    };
    const signedMessage = await createSignedMessage({...transferMessage, from: '0x'}, privateKey);
    expect(signedMessage).to.deep.eq(expectedMessage);
  });
});
