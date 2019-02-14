import {expect} from 'chai';
import RelayerUnderTest from '../../lib/utils/relayerUnderTest';
import {createMockProvider} from 'ethereum-waffle';
import {getKnexConfig, PostgreDB} from '../../lib/utils/postgreDB';

describe('Database integration', () => {
  let relayer: RelayerUnderTest;
  let provider;

  beforeEach(async () => {
    provider = createMockProvider();
    database = new PostgreDB();
    relayer = await RelayerUnderTest.createPreconfigured(database, provider);
  });

  it('migrates after start', async () => {
    await relayer.database.getKnex().migrate.rollback(getKnexConfig());
    await expect(relayer.start()).to.not.be.rejected;
    await relayer.stop();
  });
});
