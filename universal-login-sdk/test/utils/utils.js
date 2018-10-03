import chai, {expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import {createMockProvider, getWallets, solidity} from 'ethereum-waffle';
import {waitForTransactionReceipt} from '../../lib/utils/utils';
import {utils} from 'ethers';

chai.use(chaiAsPromised);
chai.use(solidity);

describe('SDK - utils test', async () => {
  let provider;
  let wallet;
  let anotherWallet;

  before(async () => {
    provider = createMockProvider();
    [wallet, anotherWallet] = await getWallets(provider);
  });

  it('Should return transaction receipt', async () => {
    const deployTransaction = {
      value: utils.parseEther('0.1'),
      gasLimit: 4000000,
      gasPrice: 9000000000,
      to: anotherWallet.address
    };
    const transaction = await wallet.sendTransaction(deployTransaction);
    expect(await waitForTransactionReceipt(provider, transaction.hash)).to.deep.eq(await provider.getTransactionReceipt(transaction.hash));
  });
});
