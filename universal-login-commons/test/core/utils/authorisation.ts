import {expect} from 'chai';
import {utils} from 'ethers';
import {CancelAuthorisationRequest} from '../../../lib/core/models/authorisation';
import {signCancelAuthorisationRequest, verifyCancelAuthorisationRequest, hashCancelAuthorisationRequest, recoverFromCancelAuthorisationRequest} from '../../../lib/core/utils/authorisation/cancelAuthorisationRequest';

describe('authorisation sign verify', async () => {
  const contractAddress: string = '0x14791697260E4c9A71f18484C9f997B308e59325';
  const privateKey = '0x9e0f0ab35e7b8d8efc554fa0e9db29235e7c52ea5e2bb53ed50d24ff7a4a6f65';
  const address = '0xa67131F4640294a209fdFF9Ad15a409D22EEB3Dd';
  const expectedSignature = '0x6f69246991e13656c5921f9a610fda2db2b2bb88e34b55e6a413a7bcb35ed715644a6f0e1a230467eb2192babcaf3318739dc9c591607977fe50244e532d96461b';
  const expectedPayloadDigest = '0x41a2afe40ed413e2fff512455eab332900c7591e46280498e7f7c69e15bbd862';
  let cancelAuthorisationRequest: CancelAuthorisationRequest;

  beforeEach('before', async () => {
    cancelAuthorisationRequest = {
      walletContractAddress: contractAddress,
      publicKey: address,
      signature: ''
    };
  });

  it('Hash cancel authorisation request', async () => {
    const payloadDigest = hashCancelAuthorisationRequest(cancelAuthorisationRequest);
    expect(payloadDigest).to.equal(expectedPayloadDigest);
  });

  it('Sign cancel authorisation request payload', async () => {
    signCancelAuthorisationRequest(cancelAuthorisationRequest, privateKey);
    expect(cancelAuthorisationRequest.signature).to.deep.equal(expectedSignature);
    expect(utils.verifyMessage(utils.arrayify(hashCancelAuthorisationRequest(cancelAuthorisationRequest)), cancelAuthorisationRequest.signature!)).to.eq(address);
  });

  it('Verify cancel authorisation request payload', async () => {
    signCancelAuthorisationRequest(cancelAuthorisationRequest, privateKey);
    const result = verifyCancelAuthorisationRequest(cancelAuthorisationRequest, address);
    expect(result).to.deep.equal(true);
    const computedAddress = recoverFromCancelAuthorisationRequest(cancelAuthorisationRequest);
    expect(computedAddress).to.deep.equal(address);
  });

  it('Forged signature', async () => {
    const attackerPrivateKey = '0x8e0f0ab35e7b8d8efc554fa0e9db29235e7c52ea5e2bb53ed50d24ff7a4a6f65';
    signCancelAuthorisationRequest(cancelAuthorisationRequest, attackerPrivateKey);
    expect(cancelAuthorisationRequest.signature).to.not.deep.equal(expectedSignature);
  });
});
