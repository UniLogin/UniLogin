import {expect} from 'chai';
import RelayerUnderTest from '../../lib/utils/relayerUnderTest';
import {createMockProvider} from 'ethereum-waffle';


describe('Database integration', () => {
  let relayer;
  let provider;
  
  beforeEach(async () => {
    provider = createMockProvider();
    relayer = await RelayerUnderTest.createPreconfigured(provider);  
  });

  it('won`t start if no migrations', async () => {
    await relayer.database.migrate.rollback(relayer.database.config);
    await relayer.database.migrate.rollback(relayer.database.config);
    await expect(relayer.start()).to.be.eventually.rejectedWith('Database is out of date.');
  });

  it('won`t start if not all migrations', async () => {
    await relayer.database.migrate.rollback(relayer.database.config);
    await expect(relayer.start()).to.be.eventually.rejectedWith('Database is out of date.');
  });

  describe('', () => {
    it('starts', async () => {
      await relayer.database.migrate.latest();
      await expect(relayer.start()).to.not.be.rejected;
    });
    after(() => {
      relayer.stop();
    });
  });
});
