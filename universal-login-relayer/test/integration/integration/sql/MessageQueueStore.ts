import {expect} from 'chai';
import {utils} from 'ethers';
import {SignedMessage, calculateMessageHash} from '@universal-login/commons';
import {getTestSignedMessage} from '../../../config/message';
import {getKnex} from '../../../../lib/core/utils/knexUtils';
import QueueSQLStore from '../../../../lib/integration/sql/services/QueueSQLStore';
import QueueMemoryStore from '../../../helpers/QueueMemoryStore';
import IQueueStore from '../../../../lib/core/services/messages/IQueueStore';
import {clearDatabase} from '../../../../lib/http/relayers/RelayerUnderTest';

for (const config of [{
  type: QueueSQLStore,
}, {
  type: QueueMemoryStore,
}]
) {
describe(`INT: IQueueStore: ${config.type.name}`, async () => {
  let queueStore: IQueueStore;
  let signedMessage: SignedMessage;
  let expectedMessageHash: string;
  const knex = getKnex();

  before(async () => {
    signedMessage = await getTestSignedMessage();
    expectedMessageHash = calculateMessageHash(signedMessage);
  });

  beforeEach(async () => {
    let args: any;
    if (config.type.name.includes('SQL')) {
      args = knex;
    }
    queueStore = new config.type(args);
  });

  it('construction: queue is empty', async () =>  {
    const nextTransaction = await queueStore.getNext();
    expect(nextTransaction).to.be.undefined;
  });

  it('add message', async () =>  {
    const messageHash = await queueStore.add(signedMessage);
    expect(messageHash).to.be.a('string');
    expect(messageHash).to.be.eq(expectedMessageHash);
  });

  it('message round trip', async () => {
    const messageHash1 = await queueStore.add(signedMessage);
    const signedMessage2 = await getTestSignedMessage({value: utils.parseEther('2')});
    const messageHash2 = await queueStore.add(signedMessage2);
    const nextMessageHash = (await queueStore.getNext())!.hash;
    expect(nextMessageHash).to.be.equal(messageHash1);
    expect(nextMessageHash).to.be.eq(expectedMessageHash);
    await queueStore.remove(messageHash1);
    const nextMessageHash2 = (await queueStore.getNext())!.hash;
    expect(nextMessageHash2).to.be.equal(messageHash2);
    expect(nextMessageHash2).to.be.eq(calculateMessageHash(signedMessage2));
    await queueStore.remove(messageHash2);
    expect(await queueStore.getNext()).to.be.undefined;
  });

  afterEach(async () => {
    config.type.name.includes('SQL') && await clearDatabase(knex);
  });

  after(async () => {
    await knex.destroy();
  });
});
}
