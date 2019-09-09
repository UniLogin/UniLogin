import {expect} from 'chai';
import {utils} from 'ethers';
import {RelayerRequest} from '../../../lib/core/models/relayerRequest';
import {signRelayerRequest, verifyRelayerRequest, hashRelayerRequest, recoverFromRelayerRequest} from '../../../lib/core/utils/relayerRequest';

describe('UNIT: RelayerRequest', () => {
  const privateKey = '0x9e0f0ab35e7b8d8efc554fa0e9db29235e7c52ea5e2bb53ed50d24ff7a4a6f65';
  const signerAddress = utils.computeAddress(privateKey);
  const expectedSignature = '0xbb32164e253c9f92b5ca5c2e11c169e9630ce5b3bd7c7881f035d1c3e609a71e208b0c9cebb780a381432cf206b42b959fc77b49134c8d8643187826f5aa4cab1b';

  const contractAddress = '0x14791697260E4c9A71f18484C9f997B308e59325';
  let relayerRequest: RelayerRequest;

  beforeEach(() => {
    relayerRequest = {
      contractAddress,
      signature: ''
    };
  });

  describe('signRelayerRequest', () => {
    it('valid signature', () => {
      signRelayerRequest(relayerRequest, privateKey);

      expect(relayerRequest.signature).to.deep.equal(expectedSignature);

      const payloadDigest = utils.arrayify(hashRelayerRequest(relayerRequest));
      expect(utils.verifyMessage(payloadDigest, relayerRequest.signature!)).to.eq(signerAddress);
    });

    it('forged signature', () => {
      const attackerPrivateKey = '0x8e0f0ab35e7b8d8efc554fa0e9db29235e7c52ea5e2bb53ed50d24ff7a4a6f65';

      signRelayerRequest(relayerRequest, attackerPrivateKey);

      expect(relayerRequest.signature).to.not.deep.equal(expectedSignature);
    });
  });

  it('verifyRelayerRequest', () => {
    signRelayerRequest(relayerRequest, privateKey);

    expect(verifyRelayerRequest(relayerRequest, signerAddress)).to.be.true;

    const computedAddress = recoverFromRelayerRequest(relayerRequest);
    expect(computedAddress).to.equal(signerAddress);
  });

  it('hashRelayerRequest', () => {
    const expectedPayloadDigest = '0x513741ffb1226167f112de55d110bf11ff18ebc0afe0068c899d583a66d755c8';

    const payloadDigest = hashRelayerRequest(relayerRequest);

    expect(payloadDigest).to.equal(expectedPayloadDigest);
  });
});
