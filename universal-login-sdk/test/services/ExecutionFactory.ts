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
  let getStatus: SinonSpy;
  const callCount = 2;

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
      execute: sinon.stub().returns({status: {messageHash, required: 1, totalCollected: 1}}),
      getStatus
    } as any;
    executionFactory = new ExecutionFactory(relayerApi);
  });

  it('waitForMined success', async () => {
    const execution = await executionFactory.createExecution(signedMessage);
    await execution.waitForMined();
    expect(getStatus.callCount).be.eq(callCount);
  });

  it('waitForMined error', async () => {
    status.transactionHash = null;
    status.error = 'Error: waitForMined';
    const execution = await executionFactory.createExecution(signedMessage);
    await expect(execution.waitForMined()).to.be.rejectedWith('Error: waitForMined');
    expect(getStatus.callCount).be.eq(callCount);
  });

  it('waitForMined for message with no enough signatures', async () => {
    const expectedStatus = {
      ...status,
      transactionHash: null,
      error: undefined,
      required: 2
    };
    relayerApi.execute = sinon.stub().returns({status: expectedStatus});
    const execution = await executionFactory.createExecution(signedMessage);
    expect(await execution.waitForMined()).to.be.deep.eq(expectedStatus);
    expect(getStatus.callCount).be.eq(0);
  });

  afterEach(() => {
    getStatus.resetHistory();
  });
});
