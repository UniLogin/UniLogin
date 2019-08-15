import {expect} from 'chai';
import {utils} from 'ethers';
import {createSignedMessage, DEFAULT_GAS_PRICE, DEFAULT_GAS_LIMIT, OPERATION_CALL, TEST_ACCOUNT_ADDRESS, CollectedSignatureKeyPair, TEST_SIGNATURE_KEY_PAIRS, getMessageWithSignatures} from '../../../lib';

const transferMessage = {
  to: TEST_ACCOUNT_ADDRESS,
  value: utils.parseEther('0.5'),
  data: utils.formatBytes32String('0'),
  nonce: '0',
  gasPrice: DEFAULT_GAS_PRICE,
  gasLimit: DEFAULT_GAS_LIMIT,
  gasToken: '0x0000000000000000000000000000000000000000',
  operationType: OPERATION_CALL,
};
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
  signature: '0x6572c8e10ddeeb5a1845f78d8fc914ea12897cc9b87048ac79def61f4a82a68b452a1230415d9d8560cae371c6d05374bc56a0850400b487d3a721311ad0f5bc1b'
};

describe('UNIT: signMessage', async () => {
  describe('createSignedMessage', async () => {
    it('sign a message', async () => {
      const privateKey = '0x899d97b42f840d59d60f3a18514b28042a1d86fa400d6cf9425ec3a9217d0cea';

      const signedMessage = createSignedMessage({...transferMessage, from: '0x'}, privateKey);
      expect(signedMessage).to.deep.eq(expectedMessage);
    });
  });

  describe('getMessageWithSignatures', async () => {
    it('should return message with signature', async () => {
      const collectedSignatureKeyPairs: CollectedSignatureKeyPair[] = TEST_SIGNATURE_KEY_PAIRS;
      const {signature, ...unsignedMessage} = expectedMessage;
      const expectedSignature = '0xf65bc65a5043e6582b38aa2269bafd759fcdfe32a3640a3b2b9086260c5f090306bb9b821eb5e452748687c69b13f3cb67b74fb1f49b45fbe60b0c90b73a73651b97a061e4965a13cda63e18cf4786ef174d04407dbede36982194b2316717afdd5737a0f24458f2798419dcbf6fc3198598c12693db80149ddc9846a7f17b747f1c';
      const messageWithSignaures = await getMessageWithSignatures(unsignedMessage, collectedSignatureKeyPairs);
      expect(messageWithSignaures).to.deep.eq({...unsignedMessage, signature: expectedSignature});
    });
  });
});
