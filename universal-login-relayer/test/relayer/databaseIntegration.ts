import {expect} from 'chai';
import {RelayerUnderTest} from '../../lib/utils/relayerUnderTest';

describe('Database integration', () => {
  it('migrates after start', async () => {
    const relayer = await RelayerUnderTest.createPreconfigured();
    await relayer.database.migrate.rollback();
    await expect(relayer.start()).to.not.be.rejected;
    await relayer.stop();
  });
});
