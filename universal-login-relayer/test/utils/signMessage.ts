import {expect} from 'chai';
import {utils} from 'ethers';
import {createSignedMessage, OPERATION_CALL, TEST_ACCOUNT_ADDRESS} from '@universal-login/commons';
import {transferMessage} from '../fixtures/basicWalletContract';


describe('UNIT: signMessage', async () => {
  it('sign a message', async () => {
    const privateKey = '0x899d97b42f840d59d60f3a18514b28042a1d86fa400d6cf9425ec3a9217d0cea';
    const expectedMessage = {
      from: '0x',
      to: TEST_ACCOUNT_ADDRESS,
      value: utils.parseEther('0.5'),
      data: utils.formatBytes32String('0'),
      nonce: '0',
      gasPrice: transferMessage.gasPrice,
      gasLimit: transferMessage.gasLimit,
      gasToken: '0x0000000000000000000000000000000000000000',
      operationType: OPERATION_CALL,
      signature: '0x7999d4b43c50b5e603bd2e13b0bc0ff88c501d0371cd07b042fcf41c0c2e54410c3576a33c0bbe3d74784f6145501ca9c505f401dcdf3c6cc407f6b95b2c17a91c'
    };
    const signedMessage = await createSignedMessage({...transferMessage, from: '0x'}, privateKey);
    expect(signedMessage).to.deep.eq(expectedMessage);
  });
});
