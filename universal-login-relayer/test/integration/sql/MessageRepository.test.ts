import {expect} from 'chai';
import {Wallet, Contract} from 'ethers';
import {loadFixture} from 'ethereum-waffle';
import {calculateMessageHash, SignedMessage, TEST_TRANSACTION_HASH, bignumberifySignedMessageFields, stringifySignedMessageFields, CollectedSignatureKeyPair, TEST_ACCOUNT_ADDRESS, UnsignedMessage, CURRENT_WALLET_VERSION, CURRENT_NETWORK_VERSION, TEST_REFUND_PAYER} from '@unilogin/commons';
import {messageToUnsignedMessage, unsignedMessageToSignedMessage} from '@unilogin/contracts';
import {executeSetRequiredSignatures, emptyMessage} from '@unilogin/contracts/testutils';
import IMessageRepository from '../../../src/core/models/messages/IMessagesRepository';
import MessageItem from '../../../src/core/models/messages/MessageItem';
import {basicWalletContractWithMockToken} from '../../fixtures/basicWalletContractWithMockToken';
import {getKeyFromHashAndSignature} from '../../../src/core/utils/encodeData';
import {getKnexConfig} from '../../testhelpers/knex';
import MessageSQLRepository from '../../../src/integration/sql/services/MessageSQLRepository';
import MessageMemoryRepository from '../../mock/MessageMemoryRepository';
import {clearDatabase} from '../../../src/http/relayers/RelayerUnderTest';
import {RefundPayerStore} from '../../../src/integration/sql/services/RefundPayerStore';
import {createTestMessageItem} from '../../testhelpers/createTestMessageItem';

for (const config of [{
  Type: MessageSQLRepository,
}, {
  Type: MessageMemoryRepository,
}]
) {
  describe(`INT: IMessageRepository (${config.Type.name})`, () => {
    let messageRepository: IMessageRepository;
    let wallet: Wallet;
    let walletContract: Contract;
    let unsignedMessage: UnsignedMessage;
    let signedMessage: SignedMessage;
    let messageItem: MessageItem;
    let messageHash: string;
    let actionKey: string;
    let actionWallet: Wallet;
    const knex = getKnexConfig();

    const setupRefundPayerStore = async () => {
      const refundPayerStore = new RefundPayerStore(knex);
      await refundPayerStore.add(TEST_REFUND_PAYER);
      const refundPayerEntity = await refundPayerStore.get(TEST_REFUND_PAYER.apiKey);
      return refundPayerEntity!.id;
    };

    beforeEach(async () => {
      ({wallet, walletContract, actionKey, actionWallet} = await loadFixture(basicWalletContractWithMockToken));
      let args: any;
      if (config.Type.name.includes('SQL')) {
        args = knex;
      }
      messageRepository = new config.Type(args);
      const message = {...emptyMessage, from: walletContract.address, to: TEST_ACCOUNT_ADDRESS, nonce: await walletContract.lastNonce()};
      unsignedMessage = messageToUnsignedMessage(message, CURRENT_NETWORK_VERSION, CURRENT_WALLET_VERSION);
      signedMessage = unsignedMessageToSignedMessage(unsignedMessage, wallet.privateKey);

      const refundPayerId = await setupRefundPayerStore();
      messageItem = createTestMessageItem(signedMessage, refundPayerId);
      messageHash = calculateMessageHash(signedMessage);
    });

    it('roundtrip', async () => {
      expect(await messageRepository.isPresent(messageHash)).to.eq(false, 'store is not initially empty');
      await messageRepository.add(messageHash, messageItem);
      expect(await messageRepository.isPresent(messageHash)).to.eq(true);
      messageItem.message = bignumberifySignedMessageFields(stringifySignedMessageFields({...unsignedMessage, signature: '0x'}));
      expect(await messageRepository.get(messageHash)).to.deep.eq(messageItem);
      expect(await messageRepository.isPresent(messageHash)).to.eq(true);
      const removedPendingExecution = await messageRepository.remove(messageHash);
      expect(await messageRepository.isPresent(messageHash)).to.eq(false);
      expect(removedPendingExecution).to.deep.eq(messageItem);
    });

    it('containSignature should return false if signature not collected', async () => {
      expect(await messageRepository.containSignature(messageHash, signedMessage.signature)).to.be.false;
    });

    it('containSignature should return true if signature already collected', async () => {
      await messageRepository.add(messageHash, messageItem);
      await messageRepository.addSignature(messageHash, signedMessage.signature, wallet.address);
      expect(await messageRepository.containSignature(messageHash, signedMessage.signature)).to.be.true;
    });

    it('get throws error if message doesn`t exist', async () => {
      await expect(messageRepository.get(messageHash)).to.be.eventually.rejectedWith(`Could not find message with hash: ${messageHash}`);
    });

    it('should add signature', async () => {
      await executeSetRequiredSignatures(walletContract, 2, wallet.privateKey);
      await messageRepository.add(messageHash, messageItem);
      const message2 = unsignedMessageToSignedMessage(unsignedMessage, actionKey);
      await messageRepository.addSignature(messageHash, message2.signature, actionWallet.address);
      const returnedMessageItem = await messageRepository.get(messageHash);
      const signatures = returnedMessageItem.collectedSignatureKeyPairs.map((signatureKeyPair: CollectedSignatureKeyPair) => signatureKeyPair.signature);
      expect(signatures).to.contains(message2.signature);
    });

    describe('markAsPending', () => {
      const mockedGasPrice = '2020';

      it('should mark message item as pending', async () => {
        await messageRepository.add(messageHash, messageItem);
        const expectedTransactionHash = TEST_TRANSACTION_HASH;
        await messageRepository.markAsPending(messageHash, expectedTransactionHash, mockedGasPrice);
        const {transactionHash, state} = await messageRepository.get(messageHash);
        expect(transactionHash).to.eq(expectedTransactionHash);
        expect(state).to.eq('Pending');
      });

      it('should throw error if transactionHash is invalid', async () => {
        await messageRepository.add(messageHash, messageItem);
        const invalidTransactionHash = '0x0';
        await expect(messageRepository.markAsPending(messageHash, invalidTransactionHash, mockedGasPrice)).to.be.rejectedWith(`Invalid transaction: ${invalidTransactionHash}`);
      });
    });

    it('should set message state', async () => {
      await messageRepository.add(messageHash, messageItem);
      const expectedState = 'Queued';
      await messageRepository.setState(messageHash, expectedState);
      const {state} = await messageRepository.get(messageHash);
      expect(state).to.eq(expectedState);
    });

    it('should mark message item as error', async () => {
      await messageRepository.add(messageHash, messageItem);
      const expectedMessageError = 'Pending Message Store Error';
      await messageRepository.markAsError(messageHash, expectedMessageError);
      const {error, state} = await messageRepository.get(messageHash);
      expect(error).to.eq(expectedMessageError);
      expect(state).to.eq('Error');
    });

    it('should throw error if signed message is missed', async () => {
      delete messageItem.message;
      await expect(messageRepository.add(messageHash, messageItem)).to.rejectedWith(`Message not found for hash: ${messageHash}`);
    });

    it('should get signatures', async () => {
      await messageRepository.add(messageHash, messageItem);
      await messageRepository.addSignature(messageHash, signedMessage.signature, wallet.address);
      const key = getKeyFromHashAndSignature(messageHash, signedMessage.signature);
      expect(await messageRepository.getCollectedSignatureKeyPairs(messageHash)).to.deep.eq([{key, signature: signedMessage.signature}]);
      const {signature} = unsignedMessageToSignedMessage(unsignedMessage, actionKey);
      await messageRepository.addSignature(messageHash, signature, actionWallet.address);
      const key2 = getKeyFromHashAndSignature(messageHash, signature);
      expect(await messageRepository.getCollectedSignatureKeyPairs(messageHash)).to.deep.eq([{key, signature: signedMessage.signature}, {key: key2, signature}]);
    });

    afterEach(async () => {
      config.Type.name.includes('SQL') && await clearDatabase(knex);
    });

    after(async () => {
      await knex.destroy();
    });
  });
}
