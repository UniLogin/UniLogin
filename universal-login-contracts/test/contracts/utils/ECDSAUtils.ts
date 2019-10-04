import {expect} from 'chai';
import ECDSAUtils from '../../../build/ECDSAUtils.json';
import {constants, Contract, utils} from 'ethers';
import {deployContract, getWallets, createMockProvider} from 'ethereum-waffle';
import {calculateMessageHash, UnsignedMessage, TEST_MESSAGE_HASH,  signHexString} from '@universal-login/commons';
import {transferMessage} from '../../helpers/ExampleMessages.js';

describe('Contract: ECDSAUtils', async () => {
  const [wallet] = getWallets(createMockProvider());
  let ecdsaUtils : Contract;
  let msg: UnsignedMessage;

  before(async () => {
    ecdsaUtils = await deployContract(wallet, ECDSAUtils);
    msg = {...transferMessage, from: wallet.address};
  });

  describe('recoverSigner', () => {
    it('empty signatures', async () => {
      const signatures = '0x';
      expect(await ecdsaUtils.recoverSigner(TEST_MESSAGE_HASH, signatures, 0))
        .to.eq(constants.AddressZero);
    });


    it('proper recovery (off-chain)', async () => {
      const hash = utils.hashMessage(TEST_MESSAGE_HASH);
      const signatures = signHexString(hash, wallet.privateKey);
      const recoveredAddress = utils.verifyMessage(utils.arrayify(hash), signatures);
      expect(recoveredAddress).to.eq(wallet.address);
    });

    it('proper recovery (one signature)', async () => {
      const hash = utils.hashMessage(TEST_MESSAGE_HASH);
      const signatures = signHexString(hash, wallet.privateKey);
      expect(await ecdsaUtils.recoverSigner(hash, signatures, 0))
        .to.eq(wallet.address);
    });

    xit('proper recovery (two signatures)', async () => {
    });

    xit('signatures too short (one signature)');
    xit('signatures too short (two signature)');
    xit('invalid recovery (one signature)');
    xit('invalid recovery (two signatures)');
    xit('signature insecure');
    // .to.be.revertedWith('Invalid signature or nonce');
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
