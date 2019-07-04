import {expect} from 'chai';
import {RelayerUnderTest} from '../../../../lib';
import {getWallets, createMockProvider} from 'ethereum-waffle';

describe('INT: Database integration', () => {
  it('migrates after start', async () => {
    const [wallet] = getWallets(createMockProvider());
    const {relayer} = await RelayerUnderTest.createPreconfigured(wallet);
    await relayer.database.migrate.rollback();
    await expect(relayer.start()).to.not.be.reverted;
    await relayer.stop();
  });
});
