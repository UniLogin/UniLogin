import {expect} from 'chai';
import sinon, {SinonSpy} from 'sinon';
import {utils} from 'ethers';
import {createSignedMessage, stringifySignedMessageFields, TEST_ACCOUNT_ADDRESS, TEST_TRANSACTION_HASH, calculateMessageHash, SignedMessage, MessageStatus, TEST_PRIVATE_KEY, TEST_MESSAGE_HASH} from '@universal-login/commons';

import {ExecutionFactory} from '../../lib/services/ExecutionFactory';
import {RelayerApi} from '../../lib/RelayerApi';

describe('UNIT: ExecutionFactory', async () => {
  let executionFactory: ExecutionFactory;
  let relayerApi: RelayerApi;
  let signedMessage: SignedMessage;
  let status: MessageStatus;
  let getStatus: SinonSpy;
  const callCount = 3;

  before(async () => {
    signedMessage = await createSignedMessage({from: TEST_ACCOUNT_ADDRESS, value: utils.parseEther('3'), to: TEST_ACCOUNT_ADDRESS}, TEST_PRIVATE_KEY);
    const messageHash = await calculateMessageHash(signedMessage);
    status = {
      transactionHash: TEST_TRANSACTION_HASH,
      required: 1,
      totalCollected: 1,
      messageHash,
      collectedSignatures: [signedMessage.signature]
    };
    getStatus = sinon.stub()
      .returns({status: {}})
      .onCall(callCount - 1).returns(status);
    relayerApi = {
      execute: sinon.stub().returns({status: {messageHash: TEST_MESSAGE_HASH}}),
      getStatus
    } as any;
    executionFactory = new ExecutionFactory(relayerApi);
  });

  it('waitForMined success', async () => {
    const result = await relayerApi.execute(stringifySignedMessageFields(signedMessage));
    const execution = executionFactory.createExecution(result.status.messageHash);
    await execution.waitForMined();
    expect(getStatus.callCount).be.eq(callCount);
  });

  it('waitForMined error', async () => {
    status.transactionHash = null;
    status.error = 'Error: waitForMined';
    const result = await relayerApi.execute(stringifySignedMessageFields(signedMessage));
    const execution = executionFactory.createExecution(result.status.messageHash);
    await expect(execution.waitForMined()).to.be.rejectedWith('Error: waitForMined');
    expect(getStatus.callCount).be.eq(callCount);
  });

  afterEach(() => {
    getStatus.resetHistory();
  });
});
