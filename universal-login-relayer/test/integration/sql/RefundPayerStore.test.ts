import {expect} from 'chai';
import {RefundPayerStore} from '../../../src/integration/sql/services/RefundPayerStore';
import {clearDatabase} from '../../../src/http/relayers/RelayerUnderTest';
import {getKnexConfig} from '../../testhelpers/knex';

describe('INT: RefundPayerStore', () => {
  const knex = getKnexConfig();
  const refundPayerStore = new RefundPayerStore(knex);
  const refundPayer = {
    name: 'Alex',
    apiKey: 'Example api key',
  };

  it('initially empty', async () => {
    const devices = await refundPayerStore.get(1);
    expect(devices).to.deep.eq(undefined);
  });

  it('add to store 1 element', async () => {
    const id = await refundPayerStore.add(refundPayer);
    expect(typeof id).eq('number');
    expect(id).to.be.at.least(1);
  });

  afterEach(async () => {
    await clearDatabase(knex);
  });

  after(async () => {
    await knex.destroy();
  });
});
