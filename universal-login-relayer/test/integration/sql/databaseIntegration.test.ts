import {expect} from 'chai';
import {RelayerUnderTest} from '../../../src';
import {getWallets, createMockProvider} from 'ethereum-waffle';

before('BEFORE: Database migration', async () => {
  const [wallet] = getWallets(createMockProvider());
  const {relayer} = await RelayerUnderTest.createPreconfigured(wallet);
  await relayer.database.migrate.rollback();
  await expect(relayer.start()).to.not.be.reverted;
  await relayer.stop();
});
