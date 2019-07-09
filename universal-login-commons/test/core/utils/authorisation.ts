import {expect} from 'chai';
import {CancelAuthorisationRequest} from '../../../lib/core/models/authorisation';
import {signCancelAuthorisationRequest, verifyCancelAuthorisationRequest, hashCancelAuthorisationRequest, recoverFromCancelAuthorisationRequest} from '../../../lib/core/utils/authorisation';

describe('authorisation sign verify', async () => {
  const contractAddress: string = '0x14791697260E4c9A71f18484C9f997B308e59325';
  const privateKey = '0x9e0f0ab35e7b8d8efc554fa0e9db29235e7c52ea5e2bb53ed50d24ff7a4a6f65';
  const address = '0xa67131F4640294a209fdFF9Ad15a409D22EEB3Dd';
  const expectedSignature = '0x3acc5bc294c2ab3a3469e32efe4dd87df8793e3737314fba64837d26dbec1c314bdfa4c2f26cc09571f1b7336e2daca5bb1c46417a80da11e90b3306b8c8e7e61c';
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
  });

  it('Verify cancel authorisation request payload', async () => {
    cancelAuthorisationRequest.signature = '0x3acc5bc294c2ab3a3469e32efe4dd87df8793e3737314fba64837d26dbec1c314bdfa4c2f26cc09571f1b7336e2daca5bb1c46417a80da11e90b3306b8c8e7e61c';
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
