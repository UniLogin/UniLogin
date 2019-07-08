import {expect} from 'chai';
import {utils} from 'ethers';
import {CancelAuthorisationRequest} from '../../../lib/core/models/authorisation';
import {signCancelAuthorisationRequest, verifyCancelAuthorisationRequest, hashCancelAuthorisationRequest, recoverFromCancelAuthorisationRequest} from '../../../lib/core/utils/authorisation';

describe('authorisation sign verify', async () => {
  const contractAddress: string = '0x14791697260E4c9A71f18484C9f997B308e59325';
  const privateKey = '0x9e0f0ab35e7b8d8efc554fa0e9db29235e7c52ea5e2bb53ed50d24ff7a4a6f65';
  const address = '0xa67131F4640294a209fdFF9Ad15a409D22EEB3Dd';
  const expectedSignature: utils.Signature = {
    recoveryParam: 1,
    r: '0x3acc5bc294c2ab3a3469e32efe4dd87df8793e3737314fba64837d26dbec1c31',
    s: '0x4bdfa4c2f26cc09571f1b7336e2daca5bb1c46417a80da11e90b3306b8c8e7e6',
    v: 28
  };
  const expectedPayloadDigest = '0x41a2afe40ed413e2fff512455eab332900c7591e46280498e7f7c69e15bbd862';

  it('Hash cancel authorisation request', async () => {
    const cancelAuthorisationRequest: CancelAuthorisationRequest = {
      walletContractAddress: contractAddress,
      key: address
    };
    const payloadDigest = hashCancelAuthorisationRequest(cancelAuthorisationRequest);
    expect(payloadDigest).to.equal(expectedPayloadDigest);
  });

  it('Sign cancel authorisation request payload', async () => {
    const cancelAuthorisationRequest: CancelAuthorisationRequest = {
      walletContractAddress: contractAddress,
      key: address
    };
    const signature = signCancelAuthorisationRequest(cancelAuthorisationRequest, privateKey);
    expect(signature).to.deep.equal(expectedSignature);
  });

  it('Verify cancel authorisation request payload', async () => {
    const cancelAuthorisationRequest: CancelAuthorisationRequest = {
      walletContractAddress: contractAddress,
      key: address
    };
    const result = verifyCancelAuthorisationRequest(cancelAuthorisationRequest, expectedSignature, address);
    expect(result).to.deep.equal(true);

    const computedAddress = recoverFromCancelAuthorisationRequest(cancelAuthorisationRequest, expectedSignature);
    expect(computedAddress).to.deep.equal(address);
  });

  it('Forged signature', async () => {
    const attackerPrivateKey = '0x8e0f0ab35e7b8d8efc554fa0e9db29235e7c52ea5e2bb53ed50d24ff7a4a6f65';

    const cancelAuthorisationRequest: CancelAuthorisationRequest = {
      walletContractAddress: contractAddress,
      key: address
    };

    const forgedSignature = signCancelAuthorisationRequest(cancelAuthorisationRequest, attackerPrivateKey);
    expect(forgedSignature).to.not.deep.equal(expectedSignature);
  });
});
