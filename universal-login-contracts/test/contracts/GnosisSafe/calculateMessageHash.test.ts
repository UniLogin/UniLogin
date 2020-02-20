import {expect} from 'chai';
import {Contract, utils, providers} from 'ethers';
import {loadFixture} from 'ethereum-waffle';
import {setupGnosisSafeContractFixture} from '../../fixtures/gnosisSafe';
import {TEST_ACCOUNT_ADDRESS, ETHER_NATIVE_TOKEN, KeyPair} from '@unilogin/commons';
import {calculateMessageHash, calculateGnosisStringHash, signStringMessage} from '../../../src/gnosis-safe@1.1.1/utils';
import {ISignatureValidatorInterface} from '../../../src';

describe('calculateMessageHash', () => {
  let proxy: Contract;
  let keyPair: KeyPair;
  let provider: providers.Provider;

  before(async () => {
    ({proxy, keyPair, provider} = await loadFixture(setupGnosisSafeContractFixture));
  });

  it('calculate transaction hash works', async () => {
    const msg = {
      to: TEST_ACCOUNT_ADDRESS,
      value: 0,
      operationType: 1,
      safeTxGas: '580000',
      baseGas: '200000',
      refundReceiver: TEST_ACCOUNT_ADDRESS,
      data: '0x0',
      nonce: 0,
      gasPrice: 1,
      from: proxy.address,
      gasToken: ETHER_NATIVE_TOKEN.address,
    };
    expect(await proxy.getTransactionHash(
      msg.to,
      msg.value,
      msg.data,
      msg.operationType,
      msg.safeTxGas,
      msg.baseGas,
      msg.gasPrice,
      msg.gasToken,
      msg.refundReceiver,
      msg.nonce)).to.eq(calculateMessageHash(msg));
  });

  it('calculate string message hash', async () => {
    const msg = 'Hi!';
    expect(await proxy.getMessageHash(utils.hexlify(utils.toUtf8Bytes(msg)))).to.eq(calculateGnosisStringHash(utils.arrayify(utils.toUtf8Bytes(msg)), proxy.address));
  });

  it('calculate signature', async () => {
    const msg = 'Hi!';
    const msgHash = calculateGnosisStringHash(utils.arrayify(utils.toUtf8Bytes(msg)), proxy.address);
    const signature = signStringMessage(msgHash, keyPair.privateKey);
    const signatureValidator = new Contract(proxy.address, ISignatureValidatorInterface, provider);
    expect(await signatureValidator.isValidSignature(utils.hexlify(utils.toUtf8Bytes(msg)), signature)).to.eq('0x20c13b0b');
  });
});
