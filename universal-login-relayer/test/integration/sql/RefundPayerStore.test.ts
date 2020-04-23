import {expect} from 'chai';
import {RefundPayerStore} from '../../../src/integration/sql/services/RefundPayerStore';
import {clearDatabase} from '../../../src/http/relayers/RelayerUnderTest';
import {getKnexConfig} from '../../testhelpers/knex';
import {TEST_REFUND_PAYER} from '../../testhelpers/constants';

describe('INT: RefundPayerStore', () => {
  const knex = getKnexConfig();
  const refundPayerStore = new RefundPayerStore(knex);

  it('initially empty', async () => {
    const devices = await refundPayerStore.get(TEST_REFUND_PAYER.apiKey);
    expect(devices).to.deep.eq(undefined);
  });

  it('add to store 1 element', async () => {
    const [addedRefundPayer] = await refundPayerStore.add(TEST_REFUND_PAYER);
    expect(addedRefundPayer).deep.eq(TEST_REFUND_PAYER);
    const gotRefundPayer = await refundPayerStore.get(TEST_REFUND_PAYER.apiKey);
    expect(gotRefundPayer).deep.eq(TEST_REFUND_PAYER);
  });

  afterEach(async () => {
    await clearDatabase(knex);
  });

  after(async () => {
    await knex.destroy();
  });
});
