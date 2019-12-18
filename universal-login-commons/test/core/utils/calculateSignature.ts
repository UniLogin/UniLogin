import {expect} from 'chai';
import {utils, Wallet} from 'ethers';
import {calculateInitializeWithENSSignature} from '../../../lib/core/utils/calculateSignature';
import {TEST_CONTRACT_ADDRESS, DEFAULT_GAS_PRICE, ETHER_NATIVE_TOKEN, OperationType, UnsignedMessage, calculateMessageSignatures, calculateMessageSignature} from '../../../lib';
import {AddressZero} from 'ethers/constants';

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
