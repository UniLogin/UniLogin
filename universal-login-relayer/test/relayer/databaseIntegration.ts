import {expect} from 'chai';
import RelayerUnderTest from '../../lib/utils/relayerUnderTest';
import {createMockProvider} from 'ethereum-waffle';
import {getKnexConfig} from '../../lib/utils/knexUtils';

describe('Database integration', () => {
  let relayer: RelayerUnderTest;
  let provider;

  beforeEach(async () => {
    provider = createMockProvider();
    relayer = await RelayerUnderTest.createPreconfigured(provider);
  });

  it('migrates after start', async () => {
    await relayer.database.migrate.rollback(getKnexConfig());
    await expect(relayer.start()).to.not.be.rejected;
    await relayer.stop();
  });
});
