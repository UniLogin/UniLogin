import {expect} from 'chai';
import {utils} from 'ethers';
import {createMockProvider, getWallets} from 'ethereum-waffle';
import {TEST_ACCOUNT_ADDRESS, ETHER_NATIVE_TOKEN} from '@universal-login/commons';
import {checkBalance} from '../../../lib/services/BalanceChecker';

describe('BalanceChecker', () => {
  const provider = createMockProvider();
  const [wallet] = getWallets(provider);

  it('should throw if balance is too small', async () => {
    const supportedTokens = [{address: ETHER_NATIVE_TOKEN.address, minimalAmount: utils.parseEther('0.5').toString()}];
    await expect(checkBalance(provider, supportedTokens, TEST_ACCOUNT_ADDRESS)).to.be.rejectedWith('Balance is too small.');
  });

  it('should return true if balance is bigger than minimal amount', async () => {
    const supportedTokens = [{address: ETHER_NATIVE_TOKEN.address, minimalAmount: utils.parseEther('0.5').toString()}];
    await wallet.sendTransaction({to: TEST_ACCOUNT_ADDRESS, value: utils.parseEther('0.5')});
    expect(await checkBalance(provider, supportedTokens, TEST_ACCOUNT_ADDRESS)).to.be.true;
  });
});
