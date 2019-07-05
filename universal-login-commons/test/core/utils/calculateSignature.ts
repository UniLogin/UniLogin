import {expect} from 'chai';
import {utils, Wallet} from 'ethers';
import {calculateInitializeWithENSSignature} from '../../../lib/core/utils/calculateSignature';

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
    gasPrice
  };
  const signer = Wallet.createRandom();

  it('Should calculate initialize with ENS signature correctly', async () => {
    const signature = await calculateInitializeWithENSSignature(signer.privateKey, args);
    const message = utils.arrayify(utils.solidityKeccak256(
      ['bytes32', 'string', 'bytes32', 'uint'],
      [hashLabel, ensName, node, gasPrice]));
    expect(utils.verifyMessage(message, signature)).to.eq(signer.address);
  });
});
