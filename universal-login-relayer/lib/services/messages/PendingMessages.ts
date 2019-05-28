import {Wallet, Contract} from 'ethers';
import {calculateMessageHash, concatenateSignatures, SignedMessage, INVALID_KEY} from '@universal-login/commons';
import WalletContract from '@universal-login/contracts/build/WalletMaster.json';
import {DuplicatedSignature, InvalidSignature, DuplicatedExecution, InvalidTransaction, NotEnoughSignatures} from '../../utils/errors';
import IPendingMessagesStore, {CollectedSignatureKeyPair} from './IPendingMessagesStore';
import {getKeyFromHashAndSignature, sortSignatureKeyPairsByKey, newPendingMessage} from '../../utils/utils';

export default class PendingMessages {

  constructor(private wallet : Wallet, private messagesStore: IPendingMessagesStore) {
  }

  isPresent(messageHash : string) {
    return this.messagesStore.isPresent(messageHash);
  }

  async add(message: SignedMessage) : Promise<string> {
    const messageHash = calculateMessageHash(message);
    if (!this.isPresent(messageHash)) {
      const pendingMessage = newPendingMessage(message.from);
      this.messagesStore.add(messageHash, pendingMessage);
    }
    await this.addSignatureToPendingMessage(messageHash, message);
    return messageHash;
  }

  private async addSignatureToPendingMessage(messageHash: string, message: SignedMessage) {
    const pendingMessage = this.messagesStore.get(messageHash);
    this.ensureCorrectTransactionHash(pendingMessage.transactionHash);
    if (this.messagesStore.containSignature(messageHash, message.signature)) {
      throw new DuplicatedSignature();
    }
    const key = getKeyFromHashAndSignature(
      calculateMessageHash(message),
      message.signature
    );
    const walletContract = new Contract(pendingMessage.walletAddress, WalletContract.interface, this.wallet);
    const keyPurpose = await walletContract.getKeyPurpose(key);
    if (keyPurpose.eq(INVALID_KEY)) {
      throw new InvalidSignature('Invalid key purpose');
    }
    this.messagesStore.addSignature(messageHash, message.signature);
  }

  async getStatus(messageHash: string) {
    return this.messagesStore.getStatus(messageHash, this.wallet);
  }

  getMessageWithSignatures(message: SignedMessage, messageHash: string) : SignedMessage {
    const collectedSignatureKeyPairs = this.messagesStore.getCollectedSignatureKeyPairs(messageHash);
    const sortedSignatureKeyPairs = sortSignatureKeyPairsByKey([...collectedSignatureKeyPairs]);
    const sortedSignatures = sortedSignatureKeyPairs.map((value: CollectedSignatureKeyPair) => value.signature);
    const signature = concatenateSignatures(sortedSignatures);
    return  { ...message, signature};
  }

  confirmExecution(messageHash: string, transactionHash: string) {
    if (transactionHash.length !== 66) {
      throw new InvalidTransaction(transactionHash);
    }
    this.messagesStore.updateTransactionHash(messageHash, transactionHash);
  }

  async ensureCorrectExecution(messageHash: string) {
    const {required, transactionHash, totalCollected} = await this.messagesStore.getStatus(messageHash, this.wallet);
    this.ensureCorrectTransactionHash(transactionHash);
    if (!(await this.isEnoughSignatures(messageHash))) {
      throw new NotEnoughSignatures(required, totalCollected);
    }
  }

  private ensureCorrectTransactionHash(transactionHash: string) {
    if (transactionHash !== '0x0') {
      throw new DuplicatedExecution();
    }
  }

  async isEnoughSignatures(messageHash: string) : Promise<boolean> {
    const {totalCollected, required} = await this.messagesStore.getStatus(messageHash, this.wallet);
    return totalCollected >= required;
  }

  get(messageHash: string) {
    return this.messagesStore.get(messageHash);
  }

  remove(messageHash: string) {
    return this.messagesStore.remove(messageHash);
  }
}
