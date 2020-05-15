import {expect} from 'chai';
import {
  CollectedSignatureKeyPair,
  TEST_SIGNATURE_KEY_PAIRS,
  getSignatureFrom,
} from '../../../src';

describe('UNIT: getSignatureFrom', () => {
  it('should return valid signature for collected signature-key pairs', async () => {
    const collectedSignatureKeyPairs: CollectedSignatureKeyPair[] = TEST_SIGNATURE_KEY_PAIRS;
    const expectedSignature = '0xf65bc65a5043e6582b38aa2269bafd759fcdfe32a3640a3b2b9086260c5f090306bb9b821eb5e452748687c69b13f3cb67b74fb1f49b45fbe60b0c90b73a73651b97a061e4965a13cda63e18cf4786ef174d04407dbede36982194b2316717afdd5737a0f24458f2798419dcbf6fc3198598c12693db80149ddc9846a7f17b747f1c';
    const signatures = await getSignatureFrom(collectedSignatureKeyPairs);
    expect(signatures).to.eq(expectedSignature);
  });
});
