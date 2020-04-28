import {expect} from 'chai';
import {TEST_REFUND_PAYER} from '@unilogin/commons';
import {RefundPayerStore} from '../../../src/integration/sql/services/RefundPayerStore';
import {clearDatabase} from '../../../src/http/relayers/RelayerUnderTest';
import {getKnexConfig} from '../../testhelpers/knex';

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
    expect(gotRefundPayer).to.not.be.undefined;
    const {id, ...refundPayer} = gotRefundPayer!;
    expect(typeof id).eq('number');
    expect(id).at.least(1);
    expect(refundPayer).deep.eq(TEST_REFUND_PAYER);
  });

  afterEach(async () => {
    await clearDatabase(knex);
  });

  after(async () => {
    await knex.destroy();
  });
});
