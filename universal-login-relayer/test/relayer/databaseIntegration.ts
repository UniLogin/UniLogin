import {expect} from 'chai';
import RelayerUnderTest from '../../lib/utils/relayerUnderTest';
import {getKnexConfig} from '../../lib/utils/knexUtils';

describe('Database integration', () => {
  let relayer: RelayerUnderTest;

  beforeEach(async () => {
    relayer = await RelayerUnderTest.createPreconfigured();
  });

  it('migrates after start', async () => {
    await relayer.database.migrate.rollback(getKnexConfig());
    await expect(relayer.start()).to.not.be.rejected;
    await relayer.stop();
  });
});
