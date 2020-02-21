import {expect} from 'chai';
import {utils} from 'ethers';
import {SignedMessage, calculateMessageHash} from '@unilogin/commons';
import {getTestSignedMessage} from '../../testconfig/message';
import {getKnexConfig} from '../../testhelpers/knex';
import QueueSQLStore from '../../../src/integration/sql/services/QueueSQLStore';
import QueueMemoryStore from '../../mock/QueueMemoryStore';
import {IExecutionQueue} from '../../../src/core/models/execution/IExecutionQueue';
import {clearDatabase} from '../../../src/http/relayers/RelayerUnderTest';

for (const config of [{
  Type: QueueSQLStore,
}, {
  Type: QueueMemoryStore,
}]
) {
  describe(`INT: IQueueStore: ${config.Type.name}`, () => {
    let executionQueue: IExecutionQueue;
    let signedMessage: SignedMessage;
    let messageHash: string;
    const knex = getKnexConfig();

    before(() => {
      signedMessage = getTestSignedMessage();
      messageHash = calculateMessageHash(signedMessage);
    });

    beforeEach(() => {
      let args: any;
      if (config.Type.name.includes('SQL')) {
        args = knex;
      }
      executionQueue = new config.Type(args);
    });

    it('construction: queue is empty', async () => {
      const nextTransaction = await executionQueue.getNext();
      expect(nextTransaction).to.be.undefined;
    });

    it('add message', async () => {
      const returnedMessageHash = await executionQueue.addMessage(messageHash);
      expect(messageHash).to.be.a('string');
      expect(messageHash).to.eq(returnedMessageHash);
    });

    it('message round trip', async () => {
      const messageHash1 = await executionQueue.addMessage(messageHash);
      const signedMessage2 = getTestSignedMessage({value: utils.parseEther('2')});
      const messageHash2 = calculateMessageHash(signedMessage2);
      await executionQueue.addMessage(messageHash2);
      const nextMessageHash = (await executionQueue.getNext())!.hash;
      expect(nextMessageHash).to.eq(messageHash1);
      expect(nextMessageHash).to.eq(messageHash);
      await executionQueue.remove(messageHash1);
      const nextMessageHash2 = (await executionQueue.getNext())!.hash;
      expect(nextMessageHash2).to.eq(messageHash2);
      expect(nextMessageHash2).to.eq(calculateMessageHash(signedMessage2));
      await executionQueue.remove(messageHash2);
      expect(await executionQueue.getNext()).to.be.undefined;
    });

    afterEach(async () => {
      config.Type.name.includes('SQL') && await clearDatabase(knex);
    });

    after(async () => {
      await knex.destroy();
    });
  });
}
