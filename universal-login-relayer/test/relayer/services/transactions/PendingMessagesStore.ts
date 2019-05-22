import {expect} from 'chai';
import {Wallet, Contract} from 'ethers';
import {loadFixture} from 'ethereum-waffle';
import {calculateMessageHash, createSignedMessage, SignedMessage} from '@universal-login/commons';
import PendingMessagesStore from '../../../../lib/services/transactions/PendingMessagesStore';
import PendingExecution from '../../../../lib/utils/pendingExecution';
import basicWalletContractWithMockToken from '../../../fixtures/basicWalletContractWithMockToken';

describe('UNIT: PendingMessagesStore', async () => {
  let pendingMessagesStore: PendingMessagesStore;
  let wallet: Wallet;
  let walletContract: Contract;
  let message: SignedMessage;
  let pendingExecution: PendingExecution;
  let messageHash: string;

  beforeEach(async () => {
    ({wallet, walletContract} = await loadFixture(basicWalletContractWithMockToken));
    pendingMessagesStore = new PendingMessagesStore();
    message = await createSignedMessage({from: walletContract.address, to: '0x'}, wallet.privateKey);

    pendingExecution = new PendingExecution(message.from, wallet);
    messageHash = calculateMessageHash(message);
  });

  it('roundtrip', () => {
    expect(pendingMessagesStore.isPresent(messageHash)).to.be.eq(false);
    pendingMessagesStore.add(messageHash, pendingExecution);
    expect(pendingMessagesStore.isPresent(messageHash)).to.be.eq(true);
    expect(pendingMessagesStore.get(messageHash)).to.be.deep.eq(pendingExecution);
    expect(pendingMessagesStore.isPresent(messageHash)).to.be.eq(true);
    const removedPendingExecution = pendingMessagesStore.remove(messageHash);
    expect(pendingMessagesStore.isPresent(messageHash)).to.be.eq(false);
    expect(removedPendingExecution).to.be.deep.eq(pendingExecution);
  });
});
