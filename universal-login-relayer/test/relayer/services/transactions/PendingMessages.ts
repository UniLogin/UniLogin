import {expect} from 'chai';
import {Wallet, Contract} from 'ethers';
import {loadFixture} from 'ethereum-waffle';
import {calculateMessageHash, createSignedMessage, SignedMessage} from '@universal-login/commons';
import PendingExecution from '../../../../lib/utils/pendingExecution';
import PendingMessages from '../../../../lib/services/transactions/PendingMessages';
import basicWalletContractWithMockToken from '../../../fixtures/basicWalletContractWithMockToken';
import PendingMessagesStore from '../../../../lib/services/transactions/PendingMessagesStore';

describe('INT: PendingMessages', () => {
  let pendingMessages : PendingMessages;
  let message : SignedMessage;
  let wallet: Wallet;
  let walletContract: Contract;
  let actionKey: string;

  beforeEach(async () => {
    ({ wallet, walletContract, actionKey } = await loadFixture(basicWalletContractWithMockToken));
    const pendingMessagesStore = new PendingMessagesStore();
    pendingMessages = new PendingMessages(wallet, pendingMessagesStore);
    message = await createSignedMessage({from: walletContract.address, to: '0x'}, wallet.privateKey);
    await walletContract.setRequiredSignatures(2);
  });

  it('not present initally', () => {
    expect(pendingMessages.isPresent('0x0123')).to.be.false;
  });

  it('should be addded', async () => {
    const hash = await pendingMessages.add(message);
    expect(pendingMessages.isPresent(hash)).to.be.true;
  });

  it('getStatus should throw error', async () => {
    const hash = calculateMessageHash(message);
    await expect(pendingMessages.getStatus(hash)).to.eventually.rejectedWith(`Could not find execution with hash: ${hash}`);
  });

  it('should sign message', async () => {
    const signedMessage = await createSignedMessage(message, actionKey);
    const hash1 = await pendingMessages.add(message);
    const hash2 = await pendingMessages.add(signedMessage);
    expect(hash1).to.be.eq(hash2);
    const collectedSignatures = (await pendingMessages.getStatus(hash1)).collectedSignatures;
    expect(collectedSignatures).to.be.deep.eq([message.signature, signedMessage.signature]);
  });

  it('should check if execution is ready to execute', async () => {
    const signedMessage = await createSignedMessage(message, actionKey);
    const hash1 = await pendingMessages.add(message);
    expect(await pendingMessages.isEnoughSignatures(hash1)).to.eq(false);
    const hash2 = await pendingMessages.add(signedMessage);
    expect(await pendingMessages.isEnoughSignatures(hash2)).to.eq(true);
  });

  it('should return message with signature', async () => {
    const hash = await pendingMessages.add(message);
    const messageWithSignaures = await pendingMessages.getMessageWithSignatures(message, hash);
    expect(messageWithSignaures).to.deep.eq(message);
  });

  it('should get added signed transaction', async () => {
    const pendingExecution = new PendingExecution(message.from, wallet);
    const hash = await pendingMessages.add(message);
    await pendingExecution.push(message);
    expect(pendingMessages.get(hash).toString()).to.eq(pendingExecution.toString());
  });
});