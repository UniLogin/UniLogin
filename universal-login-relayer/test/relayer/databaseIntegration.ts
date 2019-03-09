import {expect} from 'chai';
import {RelayerUnderTest} from '../../lib/utils/relayerUnderTest';
import {getKnexConfig} from '../../lib/utils/knexUtils';

describe('Database integration', () => {
  it('migrates after start', async () => {
    const relayer = await RelayerUnderTest.createPreconfigured();
    await relayer.database.migrate.rollback(getKnexConfig());
    await expect(relayer.start()).to.not.be.rejected;
    await relayer.stop();
  });
});
