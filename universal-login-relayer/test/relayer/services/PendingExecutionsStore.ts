import {expect} from 'chai';
import PendingExecutionsStore from '../../../lib/services/transactions/PendingExecutionsStore';
import PendingExecution from '../../../lib/utils/pendingExecution';
import {Wallet, Contract} from 'ethers';
import {loadFixture} from 'ethereum-waffle';
import { calculateMessageHash } from '@universal-login/contracts';
import basicWalletContractWithMockToken from '../../fixtures/basicWalletContractWithMockToken';
import getMessageWith from '../../config/message';
import { Message } from '@universal-login/commons';

describe('UNIT: PendingExecutionsStore', async () => {
  let pendingExecutionsStore: PendingExecutionsStore;
  let wallet: Wallet;
  let walletContract: Contract;
  let message: Message;
  let pendingExecution: PendingExecution;
  let calculatedHash: string;

  beforeEach(async () => {
    ({wallet, walletContract} = await loadFixture(basicWalletContractWithMockToken));
    pendingExecutionsStore = new PendingExecutionsStore();
    message = await getMessageWith(walletContract.address, wallet.privateKey);

    pendingExecution = new PendingExecution(message.from, wallet);
    calculatedHash = calculateMessageHash(message);
  });

  it('should add PendingExecution to store', () => {
    const hash = pendingExecutionsStore.add(calculatedHash, pendingExecution);
    expect(typeof hash).to.be.eq('string');
    expect(hash.length).to.be.eq(66);
    expect(pendingExecutionsStore.executions[hash]).to.be.deep.eq(pendingExecution);
  });

  it('should check if pending execution with hash in store', () => {
    expect(pendingExecutionsStore.isPresent(calculatedHash)).to.be.eq(false);
    const hash = pendingExecutionsStore.add(calculatedHash, pendingExecution);
    expect(pendingExecutionsStore.isPresent(hash)).to.be.eq(true);
  });

  it('should get added execution', () => {
    const hash = pendingExecutionsStore.add(calculatedHash, pendingExecution);
    expect(pendingExecutionsStore.get(hash)).to.be.deep.eq(pendingExecution);
  });

  it('should remove added execution', () => {
    const hash = pendingExecutionsStore.add(calculatedHash, pendingExecution);
    const removedPendingExecution = pendingExecutionsStore.remove(hash);
    expect(pendingExecutionsStore.isPresent(hash)).to.be.eq(false);
    expect(removedPendingExecution).to.be.deep.eq(pendingExecution);
  });
});
