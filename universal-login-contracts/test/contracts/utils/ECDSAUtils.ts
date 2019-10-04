import {expect} from 'chai';
import ECDSAUtils from '../../../build/ECDSAUtils.json';
import {Contract, utils} from 'ethers';
import {deployContract, getWallets, createMockProvider} from 'ethereum-waffle';
import {calculateMessageHash, UnsignedMessage, TEST_MESSAGE_HASH,  signHexString, concatenateSignatures} from '@universal-login/commons';
import {transferMessage} from '../../helpers/ExampleMessages.js';

const hash = utils.hashMessage(TEST_MESSAGE_HASH);
const invalidHash = utils.hashMessage(TEST_MESSAGE_HASH.replace('1', '2'));

describe('Contract: ECDSAUtils', async () => {
  const [wallet, wallet2] = getWallets(createMockProvider());
  let ecdsaUtils : Contract;
  let msg: UnsignedMessage;

  before(async () => {
    ecdsaUtils = await deployContract(wallet, ECDSAUtils);
    msg = {...transferMessage, from: wallet.address};
  });

  describe('recoverSigner', () => {
    it('proper recovery (one signature)', async () => {
      const signatures = signHexString(hash, wallet.privateKey);
      expect(await ecdsaUtils.recoverSigner(hash, signatures, 0))
        .to.eq(wallet.address);
    });

    it('proper recovery (two signatures)', async () => {
      const signature1 = signHexString(hash, wallet.privateKey);
      const signature2 = signHexString(hash, wallet2.privateKey);
      const signatures = concatenateSignatures([signature1, signature2]);
      expect(await ecdsaUtils.recoverSigner(hash, signatures, 0))
        .to.eq(wallet.address);
      expect(await ecdsaUtils.recoverSigner(hash, signatures, 1))
        .to.eq(wallet2.address);
    });

    it('invalid recovery (one signature)', async () => {
      const signatures = signHexString(hash, wallet.privateKey);
      expect(await ecdsaUtils.recoverSigner(invalidHash, signatures, 0))
        .not.to.eq(wallet.address);
    });

    it('invalid recovery (two signatures)', async () => {
      const signature1 = signHexString(hash, wallet.privateKey);
      const signature2 = signHexString(hash, wallet2.privateKey);
      const signatures = concatenateSignatures([signature1, signature2]);
      expect(await ecdsaUtils.recoverSigner(invalidHash, signatures, 0))
        .not.to.eq(wallet.address);
      expect(await ecdsaUtils.recoverSigner(invalidHash, signatures, 1))
        .not.to.eq(wallet2.address);
    });

    it('empty signatures', async () => {
      const signatures = '0x';
      await expect(ecdsaUtils.recoverSigner(hash, signatures, 1))
        .to.be.revertedWith('Signature out of bound');
    });

    it('signature invalid length', async () => {
      const signatures = signHexString(hash, wallet.privateKey).slice(0, 64);
      await expect(ecdsaUtils.recoverSigner(invalidHash, signatures, 0))
        .to.be.revertedWith('Invalid signature length');
    });

    it('signature index out of bound', async () => {
      const signatures = signHexString(hash, wallet.privateKey);
      await expect(ecdsaUtils.recoverSigner(hash, signatures, 1))
        .to.be.revertedWith('Signature out of bound');
    });

    it('insecure signature (invalid v)', async () => {
      const signatureWithoutVersion = '0x5d99b6f7f6d1f73d1a26497f2b1c89b24c0993913f86e9a2d02cd69887d9c94f3c880358579d811b21dd1b7fd9bb01c1d81d10e69f0384e675c32b39643be892';
      const signatures = `${signatureWithoutVersion}00`;
      await expect(ecdsaUtils.recoverSigner(hash, signatures, 0))
        .to.be.revertedWith('Invalid signature: v');
    });

    it('insecure signature (s too high)', async () => {
      const signatures = '0xe742ff452d41413616a5bf43fe15dd88294e983d3d36206c2712f39083d638bde0a0fc89be718fbc1033e1d30d78be1c68081562ed2e97af876f286f3453231d1b';
      await expect(ecdsaUtils.recoverSigner(hash, signatures, 0))
        .to.be.revertedWith('Invalid signature: s');
    });
  });

  it('calculateMessageHash', async () => {
    const jsHash = calculateMessageHash(msg);
    const solidityHash = await ecdsaUtils.calculateMessageHash(
      msg.from,
      msg.to,
      msg.value,
      msg.data,
      msg.nonce,
      msg.gasPrice,
      msg.gasToken,
      msg.gasLimitExecution,
      msg.gasData);
    expect(jsHash).to.eq(solidityHash);
  });

});
