import {expect} from 'chai';
import {utils} from 'ethers';
import {createMockProvider, getWallets} from 'ethereum-waffle';
import {TEST_ACCOUNT_ADDRESS, ETHER_NATIVE_TOKEN} from '../../lib';
import {findTokenWithRequiredBalance} from '../../lib/integration/ethereum/balance';

describe('BalanceChecked', () => {
  const provider = createMockProvider();
  const [wallet] = getWallets(provider);

  it('should throw if balance is too small', async () => {
    const supportedTokens = [{address: ETHER_NATIVE_TOKEN.address, minimalAmount: utils.parseEther('0.5').toString()}];
    expect(await findTokenWithRequiredBalance(provider, supportedTokens, TEST_ACCOUNT_ADDRESS)).to.be.undefined;
  });

  it('should return true if balance is bigger than minimal amount', async () => {
    const supportedTokens = [{address: ETHER_NATIVE_TOKEN.address, minimalAmount: utils.parseEther('0.5').toString()}];
    await wallet.sendTransaction({to: TEST_ACCOUNT_ADDRESS, value: utils.parseEther('0.5')});
    expect(await findTokenWithRequiredBalance(provider, supportedTokens, TEST_ACCOUNT_ADDRESS)).to.eq(ETHER_NATIVE_TOKEN.address);
  });
});
