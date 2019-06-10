import {expect} from 'chai';
import {utils} from 'ethers';
import {getKnex} from '../../../../lib/utils/knexUtils';
import MessageQueueStore from '../../../../lib/services/messages/MessageQueueStore';
import {SignedMessage} from '@universal-login/commons';
import {getTestSignedMessage} from '../../../config/message';

describe('INT: Message Queue Store', async () => {
  let messageQueueStore: MessageQueueStore;
  let signedMessage: SignedMessage;

  before(async () => {
    signedMessage = await getTestSignedMessage();
  });

  beforeEach(async () => {
    messageQueueStore = new MessageQueueStore(getKnex());
  });

  it('construction: queue is empty', async () =>  {
    const nextTransaction = await messageQueueStore.getNext();
    expect(nextTransaction).to.be.undefined;
  });

  it('add message', async () =>  {
    const [idFirst] = await messageQueueStore.add(signedMessage);

    expect(idFirst).to.be.a('number');
    expect(idFirst).to.be.at.least(1);
  });

  it('get message', async () => {
    const [id] = await messageQueueStore.add(signedMessage);
    const messageEntity = await messageQueueStore.get(id);
    expect(messageEntity.message.gasLimit.toString()).to.deep.eq(signedMessage.gasLimit);
    expect(messageEntity.message.gasPrice.toString()).to.deep.eq(signedMessage.gasPrice);
    expect(messageEntity.message.value.toString()).to.deep.eq(signedMessage.value);
    expect(messageEntity.message.gasToken).to.deep.eq(signedMessage.gasToken);
    expect(messageEntity.message.data).to.deep.eq(signedMessage.data);
    expect(messageEntity.message.from).to.deep.eq(signedMessage.from);
    expect(messageEntity.message.to).to.deep.eq(signedMessage.to);
    expect(messageEntity.message.signature).to.deep.eq(signedMessage.signature);
  });

  it('message round trip', async () => {
    const [idFirst] = await messageQueueStore.add(signedMessage);
    const signedMessage2 = await getTestSignedMessage({value: utils.parseEther('2')});
    const [idSecond] = await messageQueueStore.add(signedMessage2);
    const id = (await messageQueueStore.getNext()).id;
    expect(id).to.be.equal(idFirst);
    expect(id).to.be.a('number');
    expect(id).to.be.at.least(1);
    await messageQueueStore.markAsSuccess(idFirst, '0x000');
    const id2 = (await messageQueueStore.getNext()).id;
    expect(id2).to.be.equal(idSecond);
    expect(id2).to.be.a('number');
    expect(id2).to.be.at.least(2);
    await messageQueueStore.markAsSuccess(idSecond, '0x000');
    expect(await messageQueueStore.getNext()).to.be.undefined;
  });

  afterEach(async () => {
    await messageQueueStore.database.delete().from('transactions');
    await messageQueueStore.database.destroy();
  });
});
