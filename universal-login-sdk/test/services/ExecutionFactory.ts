import {expect} from 'chai';
import sinon, {SinonSpy} from 'sinon';
import {utils} from 'ethers';
import {createSignedMessage, TEST_ACCOUNT_ADDRESS, TEST_TRANSACTION_HASH, calculateMessageHash, SignedMessage, MessageStatus, TEST_PRIVATE_KEY} from '@universal-login/commons';

import {ExecutionFactory} from '../../lib/services/ExecutionFactory';
import {RelayerApi} from '../../lib/RelayerApi';

describe('UNIT: ExecutionFactory', async () => {
  let executionFactory: ExecutionFactory;
  let relayerApi: RelayerApi;
  let signedMessage: SignedMessage;
  let status: MessageStatus;
  let executionStatus: MessageStatus;
  let getStatus: SinonSpy;
  const callCount = 2;

  before(async () => {
    signedMessage = await createSignedMessage({from: TEST_ACCOUNT_ADDRESS, value: utils.parseEther('3'), to: TEST_ACCOUNT_ADDRESS}, TEST_PRIVATE_KEY);
    const messageHash = await calculateMessageHash(signedMessage);
    status = {
      transactionHash: TEST_TRANSACTION_HASH,
      required: 1,
      totalCollected: 1,
      state: 'AwaitSignature',
      messageHash,
      collectedSignatures: [signedMessage.signature]
    };
    executionStatus = {
      ...status,
    };
    getStatus = sinon.stub()
      .returns({status: {}})
      .onCall(callCount - 1).returns(status);
    relayerApi = {
      execute: sinon.stub().returns({status: executionStatus}),
      getStatus
    } as any;
    executionFactory = new ExecutionFactory(relayerApi);
  });

  it('waitToBeMined success', async () => {
    const execution = await executionFactory.createExecution(signedMessage);
    await execution.waitToBeMined();
    expect(execution.messageStatus).to.be.deep.eq(executionStatus);
    expect(getStatus.callCount).be.eq(callCount);
  });

  it('waitToBeMined error', async () => {
    delete status.transactionHash;
    status.error = 'Error: waitToBeMined';
    const execution = await executionFactory.createExecution(signedMessage);
    expect(execution.messageStatus).to.be.deep.eq(executionStatus);
    await expect(execution.waitToBeMined()).to.be.rejectedWith('Error: waitToBeMined');
    expect(getStatus.callCount).be.eq(callCount);
  });

  it('waitToBeMined for message with no enough signatures', async () => {
    const expectedStatus = {
      ...status,
      required: 2
    };
    delete expectedStatus.transactionHash;
    delete expectedStatus.error;
    relayerApi.execute = sinon.stub().returns({status: expectedStatus});
    const execution = await executionFactory.createExecution(signedMessage);
    expect(await execution.waitToBeMined()).to.be.deep.eq(expectedStatus);
    expect(getStatus.callCount).be.eq(0);
  });

  afterEach(() => {
    getStatus.resetHistory();
  });
});
