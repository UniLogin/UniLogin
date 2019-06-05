import {Wallet, Contract, providers} from 'ethers';
import {calculateMessageHash, concatenateSignatures, SignedMessage, INVALID_KEY, ensure, MessageStatus} from '@universal-login/commons';
import WalletContract from '@universal-login/contracts/build/WalletMaster.json';
import {DuplicatedSignature, InvalidSignature, DuplicatedExecution, InvalidTransaction, NotEnoughSignatures} from '../../utils/errors';
import IPendingMessagesStore, {CollectedSignatureKeyPair} from './IPendingMessagesStore';
import {getKeyFromHashAndSignature, sortSignatureKeyPairsByKey, createPendingMessage} from '../../utils/utils';

declare type DoExecute = (message: SignedMessage) => Promise<providers.TransactionResponse>;

export default class PendingMessages {

  constructor(private wallet : Wallet, private messagesStore: IPendingMessagesStore, public doExecute: DoExecute) {
  }

  async isPresent(messageHash : string) {
    return this.messagesStore.isPresent(messageHash);
  }

  async add(message: SignedMessage) : Promise<providers.TransactionResponse | MessageStatus> {
    const messageHash = calculateMessageHash(message);
    if (!await this.isPresent(messageHash)) {
      const pendingMessage = createPendingMessage(message.from);
      await this.messagesStore.add(messageHash, pendingMessage);
    }
    await this.addSignatureToPendingMessage(messageHash, message);
    if (await this.isEnoughSignatures(messageHash)) {
      return this.onReadyToExecute(messageHash, message);
    } else {
      return this.getStatus(messageHash);
    }
  }

  private async onReadyToExecute(messageHash: string, message: SignedMessage) {
    const finalMessage = await this.getMessageWithSignatures(message, messageHash);
    await this.ensureCorrectExecution(messageHash);
    const transaction: providers.TransactionResponse = await this.doExecute(finalMessage);
    await this.confirmExecution(messageHash, transaction.hash!);
    return transaction;
  }

  private async addSignatureToPendingMessage(messageHash: string, message: SignedMessage) {
    const pendingMessage = await this.messagesStore.get(messageHash);
    ensure(pendingMessage.transactionHash === '0x0', DuplicatedExecution);
    const isContainSignature = await this.messagesStore.containSignature(messageHash, message.signature);
    ensure(!isContainSignature, DuplicatedSignature);
    await this.ensureCorrectKeyPurpose(message, pendingMessage.walletAddress, this.wallet);
    await this.messagesStore.addSignature(messageHash, message.signature);
  }

  private async ensureCorrectKeyPurpose(message: SignedMessage, walletAddress: string, wallet: Wallet) {
    const key = getKeyFromHashAndSignature(
      calculateMessageHash(message),
      message.signature
    );
    const walletContract = new Contract(walletAddress, WalletContract.interface, wallet);
    const keyPurpose = await walletContract.getKeyPurpose(key);
    ensure(!keyPurpose.eq(INVALID_KEY), InvalidSignature, 'Invalid key purpose');
  }

  async getStatus(messageHash: string) {
    return this.messagesStore.getStatus(messageHash, this.wallet);
  }

  async getMessageWithSignatures(message: SignedMessage, messageHash: string) : Promise<SignedMessage> {
    const collectedSignatureKeyPairs = await this.messagesStore.getCollectedSignatureKeyPairs(messageHash);
    const sortedSignatureKeyPairs = sortSignatureKeyPairsByKey([...collectedSignatureKeyPairs]);
    const sortedSignatures = sortedSignatureKeyPairs.map((value: CollectedSignatureKeyPair) => value.signature);
    const signature = concatenateSignatures(sortedSignatures);
    return  { ...message, signature};
  }

  async confirmExecution(messageHash: string, transactionHash: string) {
    ensure(transactionHash.length === 66, InvalidTransaction, transactionHash);
    await this.messagesStore.setTransactionHash(messageHash, transactionHash);
  }

  async ensureCorrectExecution(messageHash: string) {
    const {required, transactionHash, totalCollected} = await this.messagesStore.getStatus(messageHash, this.wallet);
    ensure(transactionHash === '0x0', DuplicatedExecution);
    ensure(await this.isEnoughSignatures(messageHash), NotEnoughSignatures, required, totalCollected);
  }

  async isEnoughSignatures(messageHash: string) : Promise<boolean> {
    const {totalCollected, required} = await this.messagesStore.getStatus(messageHash, this.wallet);
    return totalCollected >= required;
  }

  async get(messageHash: string) {
    return this.messagesStore.get(messageHash);
  }

  async remove(messageHash: string) {
    return this.messagesStore.remove(messageHash);
  }
}
