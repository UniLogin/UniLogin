import { expect } from 'chai';
import { Wallet, Contract } from 'ethers';
import { loadFixture } from 'ethereum-waffle';
import { Message } from '@universal-login/commons';
import { calculateMessageSignature, calculateMessageHash } from '@universal-login/contracts';
import PendingExecution from '../../../lib/utils/pendingExecution';
import PendingExecutions from '../../../lib/services/transactions/PendingExecutions';
import basicWalletContractWithMockToken from '../../fixtures/basicWalletContractWithMockToken';
import PendingExecutionsStore from '../../../lib/services/transactions/PendingExecutionsStore';
import getMessageWith from '../../config/message';

describe('PendingExecutions', () => {
  let executions : PendingExecutions;
  let message : Message;
  let wallet: Wallet;
  let walletContract: Contract;
  let actionKey: string;

  beforeEach(async () => {
    ({ wallet, walletContract, actionKey } = await loadFixture(basicWalletContractWithMockToken));
    const pendingExecutionsStore = new PendingExecutionsStore();
    executions = new PendingExecutions(wallet, pendingExecutionsStore);
    message = await getMessageWith(walletContract.address, wallet.privateKey);
    await walletContract.setRequiredSignatures(2);
  });

  it('not present initally', () => {
    expect(executions.isPresent('0x0123')).to.be.false;
  });

  it('should be addded', async () => {
    const hash = await executions.add(message);
    expect(executions.isPresent(hash)).to.be.true;
  });

  it('getStatus should throw error', async () => {
    const hash = calculateMessageHash(message);
    await expect(executions.getStatus(hash)).to.eventually.rejectedWith('Could not find execution with hash: 0xebe90ddbb50c7ae5bf5acee0a0779adeedcf07c30640d215e62ad9f476908a81');
  });

  it('should sign message', async () => {
    const signature = await calculateMessageSignature(actionKey, message);
    const hash1 = await executions.add(message);
    const hash2 = await executions.add({ ...message, signature });
    expect(hash1).to.be.eq(hash2);
    const collectedSignatures = (await executions.getStatus(hash1)).collectedSignatures;
    expect(collectedSignatures).to.be.deep.eq([message.signature, signature]);
  });

  it('should check if execution is ready to execute', async () => {
    const signature = await calculateMessageSignature(actionKey, message);
    const hash1 = await executions.add(message);
    expect(await executions.isEnoughSignatures(hash1)).to.eq(false);
    const hash2 = await executions.add({ ...message, signature });
    expect(await executions.isEnoughSignatures(hash2)).to.eq(true);
  });

  it('should return message with signature', async () => {
    const hash = await executions.add(message);
    const messageWithSignaures = await executions.getMessageWithSignatures(message, hash);
    expect(messageWithSignaures).to.deep.eq(message);
  });

  it('should get added signed transaction', async () => {
    const pendingExecution = new PendingExecution(message.from, wallet);
    const hash = await executions.add(message);
    await pendingExecution.push(message);
    expect(executions.get(hash).toString()).to.eq(pendingExecution.toString());
  });
});