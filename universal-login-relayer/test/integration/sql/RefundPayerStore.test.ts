import {expect} from 'chai';
import {RefundPayerStore} from '../../../src/integration/sql/services/RefundPayerStore';
import {clearDatabase} from '../../../src/http/relayers/RelayerUnderTest';
import {getKnexConfig} from '../../testhelpers/knex';

describe('INT: RefundPayerStore', () => {
  const knex = getKnexConfig();
  const refundPayerStore = new RefundPayerStore(knex);
  const refundPayer = {
    name: 'Alex',
    apiKey: 'aaaa-bbbb-cccc',
  };

  it('initially empty', async () => {
    const devices = await refundPayerStore.get(refundPayer.apiKey);
    expect(devices).to.deep.eq(undefined);
  });

  it('add to store 1 element', async () => {
    const [addedRefundPayer] = await refundPayerStore.add(refundPayer);
    expect(addedRefundPayer).deep.eq(refundPayer);
    const gotRefundPayer = await refundPayerStore.get(refundPayer.apiKey);
    expect(gotRefundPayer).deep.eq(refundPayer);
  });

  afterEach(async () => {
    await clearDatabase(knex);
  });

  after(async () => {
    await knex.destroy();
  });
});
