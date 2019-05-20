import {expect} from 'chai';
import {Wallet, Contract} from 'ethers';
import {loadFixture} from 'ethereum-waffle';
import {SignedMessage} from '@universal-login/commons';
import {calculateMessageHash} from '@universal-login/contracts';
import PendingExecutionsStore from '../../../../lib/services/transactions/PendingExecutionsStore';
import PendingExecution from '../../../../lib/utils/pendingExecution';
import basicWalletContractWithMockToken from '../../../fixtures/basicWalletContractWithMockToken';
import createSignedMessage from '../../../../lib/utils/signMessage';

describe('UNIT: PendingExecutionsStore', async () => {
  let pendingExecutionsStore: PendingExecutionsStore;
  let wallet: Wallet;
  let walletContract: Contract;
  let message: SignedMessage;
  let pendingExecution: PendingExecution;
  let messageHash: string;

  beforeEach(async () => {
    ({wallet, walletContract} = await loadFixture(basicWalletContractWithMockToken));
    pendingExecutionsStore = new PendingExecutionsStore();
    message = await createSignedMessage({from: walletContract.address}, wallet.privateKey);

    pendingExecution = new PendingExecution(message.from, wallet);
    messageHash = calculateMessageHash(message);
  });

  it('roundtrip', () => {
    expect(pendingExecutionsStore.isPresent(messageHash)).to.be.eq(false);
    pendingExecutionsStore.add(messageHash, pendingExecution);
    expect(pendingExecutionsStore.isPresent(messageHash)).to.be.eq(true);
    expect(pendingExecutionsStore.get(messageHash)).to.be.deep.eq(pendingExecution);
    expect(pendingExecutionsStore.isPresent(messageHash)).to.be.eq(true);
    const removedPendingExecution = pendingExecutionsStore.remove(messageHash);
    expect(pendingExecutionsStore.isPresent(messageHash)).to.be.eq(false);
    expect(removedPendingExecution).to.be.deep.eq(pendingExecution);
  });
});
