import {expect} from 'chai';
import {utils, Wallet} from 'ethers';
import {calculateInitializeWithENSSignature} from '../../../lib/core/utils/calculateSignature';

describe('Calculate Signature', () => {
  const name = 'justyna';
  const domain = 'mylogin.eth';
  const ensName = `${name}.${domain}`;
  const hashLabel = utils.keccak256(utils.toUtf8Bytes(name));
  const node = utils.namehash(ensName);
  const relayerAddress = '0x123939393';
  const gasPrice = utils.bigNumberify('10000');
  const args = {
    name: ensName,
    hashLabel,
    node,
    relayerAddress,
    gasPrice
  };
  const signer = Wallet.createRandom();
  
  it('Should calculate initialize with ENS signature correctly', async () => {
    const signature = await calculateInitializeWithENSSignature(signer.privateKey, args);
    const message = utils.arrayify(utils.solidityKeccak256(
      ['bytes32', 'string', 'bytes32', 'address', 'uint'],
      [hashLabel, ensName, node, relayerAddress, gasPrice]));
    expect(utils.verifyMessage(message, signature)).to.eq(signer.address);
  });
});
