import {expect} from 'chai';
import {utils} from 'ethers';
import {createSignedMessage, DEFAULT_GAS_PRICE, DEFAULT_GAS_LIMIT, TEST_ACCOUNT_ADDRESS, CollectedSignatureKeyPair, TEST_SIGNATURE_KEY_PAIRS, getMessageWithSignatures, EMPTY_DATA} from '../../../lib';

const transferMessage = {
  to: TEST_ACCOUNT_ADDRESS,
  value: utils.parseEther('0.5'),
  data: EMPTY_DATA,
  nonce: '0',
  gasPrice: DEFAULT_GAS_PRICE,
  gasLimitExecution: DEFAULT_GAS_LIMIT,
  gasData: '0',
  gasToken: '0x0000000000000000000000000000000000000000',
};
const expectedMessage = {
  from: '0x',
  to: TEST_ACCOUNT_ADDRESS,
  value: utils.parseEther('0.5'),
  data: EMPTY_DATA,
  nonce: '0',
  gasPrice: transferMessage.gasPrice,
  gasLimitExecution: transferMessage.gasLimitExecution,
  gasData: '0',
  gasToken: '0x0000000000000000000000000000000000000000',
  signature: '0xea229e2779a9838b660b3c45e12f96c07ea838de3ffef621f4b73ae29c9feda06adb51c4c130d063e2aa251759f442a27109e74faddd8665b73072edd4c924b41c'
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
