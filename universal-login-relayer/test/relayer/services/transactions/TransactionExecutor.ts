import {expect} from 'chai';
import {loadFixture} from 'ethereum-waffle';
import TransactionExecutor from '../../../../lib/services/transactions/TransactionExecutor';
import basicWalletContractWithMockToken from '../../../fixtures/basicWalletContractWithMockToken';
import {SignedMessage, createSignedMessage, TEST_ACCOUNT_ADDRESS} from '@universal-login/commons';
import {providers, Wallet, Contract} from 'ethers';
import {bigNumberify} from 'ethers/utils';

describe('TransactionExecutor', async () => {
  let transactionExecutor: TransactionExecutor;
  let signedMessage: SignedMessage;
  let provider: providers.Provider;
  let wallet: Wallet;
  let walletContract: Contract;

  before(async () => {
    ({wallet, walletContract, provider} = await loadFixture(basicWalletContractWithMockToken));
    transactionExecutor = new TransactionExecutor(wallet, async (tx: providers.TransactionResponse) => {});
    signedMessage = await createSignedMessage({from: walletContract.address, to: TEST_ACCOUNT_ADDRESS, value: bigNumberify(2)}, wallet.privateKey);
  });

  it('should execute transaction', async () =>  {
    const expectedBalance = (await provider.getBalance(signedMessage.to)).add(signedMessage.value);
    await transactionExecutor.execute(signedMessage);
    const balance = await provider.getBalance(signedMessage.to);
    expect(balance).to.be.eq(expectedBalance);
  });
});
