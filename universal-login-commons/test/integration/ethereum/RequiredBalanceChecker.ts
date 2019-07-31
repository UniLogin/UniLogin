import {expect} from 'chai';
import {utils} from 'ethers';
import {createMockProvider, getWallets} from 'ethereum-waffle';
import {BalanceChecker} from '../../../lib/integration/ethereum/BalanceChecker';
import {RequiredBalanceChecker} from '../../../lib/integration/ethereum/RequiredBalanceChecker';
import {ETHER_NATIVE_TOKEN} from '../../../lib/core/constants/constants';
import {TEST_ACCOUNT_ADDRESS} from '../../../lib/core/constants/test';

describe('INT: RequiredBalanceChecker', () => {
  const provider = createMockProvider();
  const balanceChecker = new BalanceChecker(provider);
  const requiredBalanceChecker = new RequiredBalanceChecker(balanceChecker);
  const [wallet] = getWallets(provider);
  const supportedTokens = [{address: ETHER_NATIVE_TOKEN.address, minimalAmount: utils.parseEther('0.5').toString()}];

  it('no tokens with required balance', async () => {
    expect(await requiredBalanceChecker.findTokenWithRequiredBalance(supportedTokens, TEST_ACCOUNT_ADDRESS)).to.be.null;
  });

  it('token with just enough balance', async () => {
    await wallet.sendTransaction({to: TEST_ACCOUNT_ADDRESS, value: utils.parseEther('0.5')});
    expect(await requiredBalanceChecker.findTokenWithRequiredBalance(supportedTokens, TEST_ACCOUNT_ADDRESS)).to.eq(ETHER_NATIVE_TOKEN.address);
  });
});
