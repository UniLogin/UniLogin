import {expect} from 'chai';
import {utils} from 'ethers';
import {CancelAuthorisationRequest} from '../../../lib/core/models/authorisation';
import {signCancelAuthorisationRequest, verifyCancelAuthorisationRequest, hashCancelAuthorisationRequest} from '../../../lib/core/utils/authorisation';

describe('authorisation sign verify', async () => {
  const contractAddress: string = '0x14791697260E4c9A71f18484C9f997B308e59325';
  const privateKey = '0x9e0f0ab35e7b8d8efc554fa0e9db29235e7c52ea5e2bb53ed50d24ff7a4a6f65';
  const address = '0xa67131F4640294a209fdFF9Ad15a409D22EEB3Dd';
  const correctSignature: utils.Signature = {
    recoveryParam: 0,
    r: '0x9e7a71072e325f28b36027296dae75e73b74d0e0f684047b72862229a7d4fae2',
    s: '0x745c49528b42b6ff026d1aed5b87e612f083f2dd87ad211879fccca44caafd70',
    v: 27
  };
  const correctPayloadDigest = '0x2d0177d23495e90de42405735b860ec1837aa8afcfc6ee6a45b638598db933bc';

  it('Hash cancel authorisation request', async () => {
    const cancelAuthorisationRequest: CancelAuthorisationRequest = {
      walletContractAddress: contractAddress,
      key: address.toLowerCase()
    };
    const payloadDigest = hashCancelAuthorisationRequest(cancelAuthorisationRequest);
    expect(payloadDigest).to.equal(correctPayloadDigest);
  });

  it('Sign cancel authorisation request payload', async () => {
    const cancelAuthorisationRequest: CancelAuthorisationRequest = {
      walletContractAddress: contractAddress,
      key: address.toLowerCase()
    };
    const signature = signCancelAuthorisationRequest(cancelAuthorisationRequest, privateKey);
    expect(signature).to.deep.equal(correctSignature);
  });

  it('Verify cancel authorisation request payload', async () => {
    const cancelAuthorisationRequest: CancelAuthorisationRequest = {
      walletContractAddress: contractAddress,
      key: address.toLowerCase()
    };
    const [result, computedAddress] = verifyCancelAuthorisationRequest(cancelAuthorisationRequest, correctSignature, address);
    expect(result).to.deep.equal(true);
    expect(computedAddress).to.deep.equal(address);
  });

  it('Forged signature', async () => {
    const attackerPrivateKey = '0x8e0f0ab35e7b8d8efc554fa0e9db29235e7c52ea5e2bb53ed50d24ff7a4a6f65';

    const cancelAuthorisationRequest: CancelAuthorisationRequest = {
      walletContractAddress: contractAddress,
      key: address.toLowerCase()
    };

    const forgedSignature = signCancelAuthorisationRequest(cancelAuthorisationRequest, attackerPrivateKey);
    expect(forgedSignature).to.not.deep.equal(correctSignature);
  });
});
