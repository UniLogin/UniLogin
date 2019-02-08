import {expect} from 'chai';
import RelayerUnderTest from '../../lib/utils/relayerUnderTest';
import {createMockProvider} from 'ethereum-waffle';

describe('Database integration', () => {
  let relayer: RelayerUnderTest;
  let provider;

  beforeEach(async () => {
    provider = createMockProvider();
    relayer = await RelayerUnderTest.createPreconfigured(provider);
  });

  it('migrates after start', async () => {
    await relayer.database.migrate.rollback(relayer.database.config);
    await expect(relayer.start()).to.not.be.rejected;
    await relayer.stop();
  });
});
