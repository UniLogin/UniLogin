import {expect} from 'chai';
import PendingExecutionsStore from '../../../lib/services/transactions/PendingExecutionsStore';
import PendingExecution from '../../../lib/utils/pendingExecution';
import wallet from '../../../lib/routes/wallet';
import {Wallet, Contract} from 'ethers';
import {createMockProvider, getWallets, loadFixture} from 'ethereum-waffle';
import { calculateMessageHash } from '@universal-login/contracts';
import basicWalletContractWithMockToken from '../../fixtures/basicWalletContractWithMockToken';
import getMessageWith from '../../config/message';
import { Message } from '@universal-login/commons';

describe('UNIT: PendingExecutionsStore', async () => {
  let pendingExecutionsStore: PendingExecutionsStore;
  let wallet: Wallet;
  let walletContract: Contract;
  let message: Message;

  beforeEach(async () => {
    ({wallet, walletContract} = await loadFixture(basicWalletContractWithMockToken));
    pendingExecutionsStore = new PendingExecutionsStore();
    message = await getMessageWith(walletContract.address, wallet.privateKey);
  });

  it('should add PendingExecution to store', () => {
    const pendingExecution = new PendingExecution(message.from, wallet);
    const calculatedHash = calculateMessageHash(message);
    const hash = pendingExecutionsStore.add(calculatedHash, pendingExecution);
    expect(typeof hash).to.be.eq('string');
    expect(hash.length).to.be.eq(66);
    expect(pendingExecutionsStore.executions[hash]).to.be.deep.eq(pendingExecution);
  });
});
