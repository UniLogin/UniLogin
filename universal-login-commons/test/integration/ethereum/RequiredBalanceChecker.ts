import {expect} from 'chai';
import {utils, Contract} from 'ethers';
import {createMockProvider, getWallets, deployContract} from 'ethereum-waffle';
import {BalanceChecker} from '../../../lib/integration/ethereum/BalanceChecker';
import {RequiredBalanceChecker} from '../../../lib/integration/ethereum/RequiredBalanceChecker';
import {ETHER_NATIVE_TOKEN} from '../../../lib/core/constants/constants';
import {TEST_ACCOUNT_ADDRESS} from '../../../lib/core/constants/test';
import MockToken from '../../fixtures/MockToken.json';
import {SupportedToken} from '../../../lib';


describe('INT: RequiredBalanceChecker', () => {
  const provider = createMockProvider();
  const balanceChecker = new BalanceChecker(provider);
  const requiredBalanceChecker = new RequiredBalanceChecker(balanceChecker);
  const [wallet] = getWallets(provider);
  let mockToken: Contract;
  let supportedTokens: SupportedToken[];

  beforeEach(async () => {
    mockToken = await deployContract(wallet, MockToken);
    supportedTokens = [
      {
        address: ETHER_NATIVE_TOKEN.address,
        minimalAmount: utils.parseEther('0.5').toString()
      },
      {
        address: mockToken.address,
        minimalAmount: utils.parseEther('0.3').toString()
      }
    ];
  });

  it('no tokens with required balance', async () => {
    expect(await requiredBalanceChecker.findTokenWithRequiredBalance(supportedTokens, TEST_ACCOUNT_ADDRESS)).to.be.null;
  });

  it('one token with just enough balance', async () => {
    await mockToken.transfer(TEST_ACCOUNT_ADDRESS, utils.parseEther('0.3'));
    expect(await requiredBalanceChecker.findTokenWithRequiredBalance(supportedTokens, TEST_ACCOUNT_ADDRESS)).to.eq(mockToken.address);
  });

  it('two tokens with just enough balance', async () => {
    await wallet.sendTransaction({to: TEST_ACCOUNT_ADDRESS, value: utils.parseEther('0.5')});
    await mockToken.transfer(TEST_ACCOUNT_ADDRESS, utils.parseEther('0.3'));
    expect(await requiredBalanceChecker.findTokenWithRequiredBalance(supportedTokens, TEST_ACCOUNT_ADDRESS)).to.eq(ETHER_NATIVE_TOKEN.address);
  });
});
