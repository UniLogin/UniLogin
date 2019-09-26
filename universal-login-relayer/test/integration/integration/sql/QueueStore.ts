import {expect} from 'chai';
import {utils} from 'ethers';
import {SignedMessage, calculateMessageHash} from '@universal-login/commons';
import {getTestSignedMessage} from '../../../config/message';
import {getKnexConfig} from '../../../helpers/knex';
import QueueSQLStore from '../../../../lib/integration/sql/services/QueueSQLStore';
import QueueMemoryStore from '../../../helpers/QueueMemoryStore';
import {IExecutionQueue} from '../../../../lib/core/services/messages/IExecutionQueue';
import {clearDatabase} from '../../../../lib/http/relayers/RelayerUnderTest';

for (const config of [{
  type: QueueSQLStore,
}, {
  type: QueueMemoryStore,
}]
) {
describe(`INT: IQueueStore: ${config.type.name}`, async () => {
  let messageQueue: IExecutionQueue;
  let signedMessage: SignedMessage;
  let expectedMessageHash: string;
  const knex = getKnexConfig();

  before(async () => {
    signedMessage = getTestSignedMessage();
    expectedMessageHash = calculateMessageHash(signedMessage);
  });

  beforeEach(async () => {
    let args: any;
    if (config.type.name.includes('SQL')) {
      args = knex;
    }
    messageQueue = new config.type(args);
  });

  it('construction: queue is empty', async () =>  {
    const nextTransaction = await messageQueue.getNext();
    expect(nextTransaction).to.be.undefined;
  });

  it('add message', async () =>  {
    const messageHash = await messageQueue.addMessage(signedMessage);
    expect(messageHash).to.be.a('string');
    expect(messageHash).to.be.eq(expectedMessageHash);
  });

  it('message round trip', async () => {
    const messageHash1 = await messageQueue.addMessage(signedMessage);
    const signedMessage2 = getTestSignedMessage({value: utils.parseEther('2')});
    const messageHash2 = await messageQueue.addMessage(signedMessage2);
    const nextMessageHash = (await messageQueue.getNext())!.hash;
    expect(nextMessageHash).to.be.equal(messageHash1);
    expect(nextMessageHash).to.be.eq(expectedMessageHash);
    await messageQueue.remove(messageHash1);
    const nextMessageHash2 = (await messageQueue.getNext())!.hash;
    expect(nextMessageHash2).to.be.equal(messageHash2);
    expect(nextMessageHash2).to.be.eq(calculateMessageHash(signedMessage2));
    await messageQueue.remove(messageHash2);
    expect(await messageQueue.getNext()).to.be.undefined;
  });

  afterEach(async () => {
    config.type.name.includes('SQL') && await clearDatabase(knex);
  });

  after(async () => {
    await knex.destroy();
  });
});
}
