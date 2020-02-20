import {expect} from 'chai';
import {createKeyPair} from '@unilogin/commons';
import {getPreviousOwner} from '../../../src/gnosis-safe@1.1.1/utils';
import {SENTINEL_OWNERS} from '../../../src/gnosis-safe@1.1.1/constants';
import {Wallet} from 'ethers';

describe('UNIT: GnosisSafeUtils', () => {
  const keyPair = createKeyPair();
  describe('getPreviousOwner', () => {
    it('returns SENTINEL_OWNERS if there is only one owner', () => {
      expect(getPreviousOwner([keyPair.publicKey], keyPair.publicKey)).to.eq(SENTINEL_OWNERS);
    });

    it('returns SENTINEL_OWNERS if provided owner is first on list', () => {
      expect(getPreviousOwner([keyPair.publicKey, Wallet.createRandom().address], keyPair.publicKey)).to.eq(SENTINEL_OWNERS);
    });

    it('returns previous owner', () => {
      const someOwner = Wallet.createRandom().address;
      expect(getPreviousOwner([keyPair.publicKey, someOwner], someOwner)).to.eq(keyPair.publicKey);
    });
  });
});
