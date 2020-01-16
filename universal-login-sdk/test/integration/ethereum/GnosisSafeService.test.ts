import {expect} from 'chai';
import {createKeyPair} from '@universal-login/commons';
import {GnosisSafeService} from '../../../src/integration/ethereum/GnosisSafeService';
import {createMockProvider} from 'ethereum-waffle';
import {SENTINEL_OWNERS} from '@universal-login/contracts';
import {Wallet} from 'ethers';

describe('UNIT: GnosisSafeService', () => {
  const keyPair = createKeyPair();
  const gnosisSafeService = new GnosisSafeService(createMockProvider());
  describe('getPreviousOwner', () => {
    it('returns SENTINEL_OWNERS if there is only one owner', async () => {
      expect(await gnosisSafeService.getPreviousOwner([keyPair.publicKey], keyPair.publicKey)).to.eq(SENTINEL_OWNERS);
    });

    it('returns SENTINEL_OWNERS if provided owner is first on list', async () => {
      expect(await gnosisSafeService.getPreviousOwner([keyPair.publicKey, Wallet.createRandom().address], keyPair.publicKey)).to.eq(SENTINEL_OWNERS);
    });

    it('returns previous owner', async () => {
      const someOwner = Wallet.createRandom().address;
      expect(await gnosisSafeService.getPreviousOwner([keyPair.publicKey, someOwner], someOwner)).to.eq(keyPair.publicKey);
    });
  });
});
