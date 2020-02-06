import {expect} from 'chai';
import {utils, Wallet} from 'ethers';
import {calculateInitializeWithENSSignature} from '../../../src/core/utils/calculateSignature';
import {TEST_CONTRACT_ADDRESS, DEFAULT_GAS_PRICE, ETHER_NATIVE_TOKEN, OperationType, UnsignedMessage, calculateMessageSignatures, calculateMessageSignature, concatenateSignatures, DEFAULT_GAS_LIMIT_EXECUTION, TEST_ACCOUNT_ADDRESS, createKeyPair, createFullHexString} from '../../../src';
import {AddressZero} from 'ethers/constants';
import {removeSignaturePrefix, removeHexStringPrefix} from '../../../src/core/utils/messages/calculateMessageSignature';

describe('Calculate Signature', () => {
  const name = 'justyna';
  const domain = 'mylogin.eth';
  const ensName = `${name}.${domain}`;
  const hashLabel = utils.keccak256(utils.toUtf8Bytes(name));
  const node = utils.namehash(ensName);
  const gasPrice = '10000';
  const args = {
    ensName,
    hashLabel,
    node,
    gasPrice,
  };
  const signer = Wallet.createRandom();

  it('Should calculate initialize with ENS signature correctly', () => {
    const signature = calculateInitializeWithENSSignature(args, signer.privateKey);
    const message = utils.arrayify(utils.solidityKeccak256(
      ['bytes32', 'string', 'bytes32', 'uint'],
      [hashLabel, ensName, node, gasPrice]));
    expect(utils.verifyMessage(message, signature)).to.eq(signer.address);
  });
});

describe('Calculate signatures', () => {
  const message: UnsignedMessage = {
    from: TEST_CONTRACT_ADDRESS,
    to: TEST_CONTRACT_ADDRESS,
    value: utils.parseEther('1'),
    gasPrice: DEFAULT_GAS_PRICE,
    gasToken: ETHER_NATIVE_TOKEN.address,
    data: '0xbeef',
    baseGas: '100000',
    safeTxGas: '200000',
    nonce: 0,
    operationType: OperationType.call,
    refundReceiver: AddressZero,
  };

  it('calculates message signatures and concentrate it properly', () => {
    const privateKey1 = '0xec6ff6b4fee247a39206624b35efdb8cb5c292485b395580bfc4e39c0095ebd3'; // address: 0x39AF878ecC527Fef8906B2Fc02B04E273d1BFbFf
    const privateKey2 = '0x07e43985fdec21a7fb3239139cd5e061b7aa76094f3a0391fd065f2c4f9ce903'; // address: 0x03D0Ea9D4A15B08E736F96E03191575807DF1Ec6
    const signature1 = calculateMessageSignature(privateKey1, message);
    const signature2 = calculateMessageSignature(privateKey2, message);
    const calculatedSignatures = calculateMessageSignatures([privateKey1, privateKey2], message);
    expect(calculatedSignatures).to.eq(`0x${signature2.slice(2)}${signature1.slice(2)}`);
  });
});

describe('concatenateSignatures', () => {
  let signature1: string;
  let signature2: string;
  const keyPair1 = createKeyPair();
  const keyPair2 = createKeyPair();
  const message = {
    from: TEST_CONTRACT_ADDRESS,
    to: TEST_ACCOUNT_ADDRESS,
    value: utils.parseEther('0.1'),
    data: utils.hexlify(0),
    nonce: 0,
    gasToken: ETHER_NATIVE_TOKEN.address,
    gasPrice: DEFAULT_GAS_PRICE,
    safeTxGas: DEFAULT_GAS_LIMIT_EXECUTION,
    baseGas: '100000',
    operationType: OperationType.call,
    refundReceiver: AddressZero,
  };

  signature1 = calculateMessageSignature(keyPair1.privateKey, message);
  signature2 = calculateMessageSignature(keyPair2.privateKey, message);

  it('Should concatenate two signatures arrays', () => {
    const expected = `${signature1}${signature2.replace('0x', '')}`;
    const concatenate = concatenateSignatures([signature1, signature2]);
    expect(concatenate).to.eq(expected);
  });

  it('concentrates 3 signatures', () => {
    const keyPair3 = createKeyPair();
    const signature3 = calculateMessageSignature(keyPair3.privateKey, message);
    const expected = `${signature1}${signature2.replace('0x', '')}${signature3.replace('0x', '')}`;
    expect(concatenateSignatures([signature1, signature2, signature3])).to.eq(expected);
  });

  it('Should not concatenate two signatures arrays without 0x prefix', () => {
    signature1 = `${signature1.replace('0x', '')}aa`;
    signature2 = `${signature2.replace('0x', '')}aa`;
    expect(concatenateSignatures.bind(null, [signature1, signature2])).to.throw(`${signature1} is not a valid hex string`);
  });

  it('Should not concatenate two signatures arrays with invalid length', () => {
    const sig1 = '0xffff';
    const sig2 = '0xffe2';
    expect(concatenateSignatures.bind(null, [sig1, sig2])).to.throw(`${sig1} length should be 132`);
  });
});

describe('removeSignaturePrefix', () => {
  it('removes 0x prefix', () => {
    const signature = createFullHexString(65);
    expect(removeSignaturePrefix(signature)).to.eq(signature.slice(2));
  });

  it('throws if signature lenght is invalid', () => {
    const invalidSignature = '0x1111';
    expect(() => removeSignaturePrefix(invalidSignature)).to.throw(`${invalidSignature} length should be 132`);
  });

  it('throws if signature prefix is invalid', () => {
    const invalidSignature = createFullHexString(65).replace('0x', '11');
    expect(() => removeSignaturePrefix(invalidSignature)).to.throw(`${invalidSignature} is not a valid hex string`);
  });

  it('throws if signature is not a valid hex', () => {
    const invalidSignature = `0x${'z'.repeat(130)}`;
    expect(() => removeSignaturePrefix(invalidSignature)).to.throw(`${invalidSignature} is not a valid hex string`);
  });

  describe('removeHexStringPrefix', () => {
    it('removes 0x prefix', () => {
      const validHexString = createFullHexString(10);
      expect(removeHexStringPrefix(validHexString)).to.eq(validHexString.slice(2));
    });

    it('throws if string is not a valid hex', () => {
      const invalidHexString = `0x${'z'.repeat(130)}`;
      expect(() => removeHexStringPrefix(invalidHexString)).to.throw(`${invalidHexString} is not a valid hex string`);
    });
  });
});
