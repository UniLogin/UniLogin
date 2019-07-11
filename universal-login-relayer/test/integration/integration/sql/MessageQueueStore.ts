import {expect} from 'chai';
import {utils} from 'ethers';
import {SignedMessage, calculateMessageHash} from '@universal-login/commons';
import {getTestSignedMessage} from '../../../config/message';
import {getKnex} from '../../../../lib/core/utils/knexUtils';
import MessageQueueStore from '../../../../lib/integration/sql/services/MessageQueueSQLStore';
import MessageQueueMemoryStore from '../../../helpers/MessageQueueMemoryStore';
import IMessageQueueStore from '../../../../lib/core/services/messages/IMessageQueueStore';
import {clearDatabase} from '../../../../lib/http/relayers/RelayerUnderTest';

for (const config of [{
  name: 'MessageQueueSQLStore',
  type: MessageQueueStore,
}, {
  type: MessageQueueMemoryStore,
  name: 'MessageQueueMemoryStore',
}]
) {
describe(`INT: IMessageQueueStore: ${config.name}`, async () => {
  let messageQueueStore: IMessageQueueStore;
  let signedMessage: SignedMessage;
  let expectedMessageHash: string;
  const knex = getKnex();

  before(async () => {
    signedMessage = await getTestSignedMessage();
    expectedMessageHash = calculateMessageHash(signedMessage);
  });

  beforeEach(async () => {
    let args: any;
    if (config.name.includes('SQL')) {
      args = knex;
    }
    messageQueueStore = new config.type(args);
  });

  it('construction: queue is empty', async () =>  {
    const nextTransaction = await messageQueueStore.getNext();
    expect(nextTransaction).to.be.undefined;
  });

  it('add message', async () =>  {
    const messageHash = await messageQueueStore.add(signedMessage);
    expect(messageHash).to.be.a('string');
    expect(messageHash).to.be.eq(expectedMessageHash);
  });

  it('message round trip', async () => {
    const messageHash1 = await messageQueueStore.add(signedMessage);
    const signedMessage2 = await getTestSignedMessage({value: utils.parseEther('2')});
    const messageHash2 = await messageQueueStore.add(signedMessage2);
    const nextMessageHash = (await messageQueueStore.getNext())!.messageHash;
    expect(nextMessageHash).to.be.equal(messageHash1);
    expect(nextMessageHash).to.be.eq(expectedMessageHash);
    await messageQueueStore.remove(messageHash1);
    const nextMessageHash2 = (await messageQueueStore.getNext())!.messageHash;
    expect(nextMessageHash2).to.be.equal(messageHash2);
    expect(nextMessageHash2).to.be.eq(calculateMessageHash(signedMessage2));
    await messageQueueStore.remove(messageHash2);
    expect(await messageQueueStore.getNext()).to.be.undefined;
  });

  afterEach(async () => {
    config.name.includes('SQL') && await clearDatabase(knex);
  });

  after(async () => {
    await knex.destroy();
  });
});
}
