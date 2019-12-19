import {expect} from 'chai';
import {utils, Contract, Wallet} from 'ethers';
import {createMockProvider, getWallets, deployContract} from 'ethereum-waffle';
import MockToken from '../../../fixtures/MockToken.json';
import {hasEnoughToken} from '../../../../src/integration/ethereum/validators/SufficientBalanceValidator';
import {TEST_CONTRACT_ADDRESS} from '../../../../src/core/constants/test';
import {BalanceChecker} from '../../../../src/integration/ethereum/BalanceChecker';
import {ETHER_NATIVE_TOKEN} from '../../../../src/core/constants/constants';
import {AddressZero} from 'ethers/constants';

describe('INT: hasEnoughToken', async () => {
  const provider = createMockProvider();
  const balanceChecker = new BalanceChecker(provider);
  const gasLimit = 1000000;
  const walletBalance = utils.parseEther('2');
  const gasPrice = '2';
  let token: Contract;
  let wallet: Wallet;
  const createPaymentOptions = (gasToken: string, gasLimit: utils.BigNumberish, gasPrice: utils.BigNumberish, refundReceiver: string) => ({gasToken, gasLimit, gasPrice, refundReceiver});

  before(async () => {
    [wallet] = await getWallets(provider);
    token = await deployContract(wallet, MockToken);
    await wallet.sendTransaction({to: TEST_CONTRACT_ADDRESS, value: utils.parseEther('2')});
    await token.transfer(TEST_CONTRACT_ADDRESS, utils.parseEther('1'));
  });

  it('Should return true if contract has enough token', async () => {
    expect(await hasEnoughToken(createPaymentOptions(token.address, gasLimit, gasPrice, AddressZero), TEST_CONTRACT_ADDRESS, balanceChecker)).to.be.true;
    expect(await hasEnoughToken(createPaymentOptions(token.address, gasLimit * 2, gasPrice, AddressZero), TEST_CONTRACT_ADDRESS, balanceChecker)).to.be.true;
    expect(await hasEnoughToken(createPaymentOptions(token.address, utils.parseEther('0.09'), '10', AddressZero), TEST_CONTRACT_ADDRESS, balanceChecker)).to.be.true;
    expect(await hasEnoughToken(createPaymentOptions(token.address, '10', utils.parseEther('0.09'), AddressZero), TEST_CONTRACT_ADDRESS, balanceChecker)).to.be.true;
    expect(await hasEnoughToken(createPaymentOptions(token.address, utils.parseEther('0.9'), '1', AddressZero), TEST_CONTRACT_ADDRESS, balanceChecker)).to.be.true;
    expect(await hasEnoughToken(createPaymentOptions(token.address, '1', utils.parseEther('0.9'), AddressZero), TEST_CONTRACT_ADDRESS, balanceChecker)).to.be.true;
  });

  it('Should return false if contract has not enough token', async () => {
    expect(await hasEnoughToken(createPaymentOptions(token.address, utils.parseEther('1.00001'), gasPrice, AddressZero), TEST_CONTRACT_ADDRESS, balanceChecker)).to.be.false;
    expect(await hasEnoughToken(createPaymentOptions(token.address, utils.parseEther('1.1'), gasPrice, AddressZero), TEST_CONTRACT_ADDRESS, balanceChecker)).to.be.false;
    expect(await hasEnoughToken(createPaymentOptions(token.address, utils.parseEther('2'), gasPrice, AddressZero), TEST_CONTRACT_ADDRESS, balanceChecker)).to.be.false;
    expect(await hasEnoughToken(createPaymentOptions(token.address, utils.parseEther('10'), gasPrice, AddressZero), TEST_CONTRACT_ADDRESS, balanceChecker)).to.be.false;
  });

  it('Should return true if contract has enough ethers', async () => {
    expect(await hasEnoughToken(createPaymentOptions(ETHER_NATIVE_TOKEN.address, gasLimit, gasPrice, AddressZero), TEST_CONTRACT_ADDRESS, balanceChecker)).to.be.true;
    expect(await hasEnoughToken(createPaymentOptions(ETHER_NATIVE_TOKEN.address, walletBalance.div(gasPrice), gasPrice, AddressZero), TEST_CONTRACT_ADDRESS, balanceChecker)).to.be.true;
    expect(await hasEnoughToken(createPaymentOptions(ETHER_NATIVE_TOKEN.address, walletBalance, '1', AddressZero), TEST_CONTRACT_ADDRESS, balanceChecker)).to.be.true;
    expect(await hasEnoughToken(createPaymentOptions(ETHER_NATIVE_TOKEN.address, '1', walletBalance, AddressZero), TEST_CONTRACT_ADDRESS, balanceChecker)).to.be.true;
  });

  it('Should return false if contract has not enough ethers', async () => {
    expect(await hasEnoughToken(createPaymentOptions(ETHER_NATIVE_TOKEN.address, utils.parseEther('1.01'), gasPrice, AddressZero), TEST_CONTRACT_ADDRESS, balanceChecker)).to.be.false;
    expect(await hasEnoughToken(createPaymentOptions(ETHER_NATIVE_TOKEN.address, utils.parseEther('2.0'), gasPrice, AddressZero), TEST_CONTRACT_ADDRESS, balanceChecker)).to.be.false;
  });

  it('Should throw error, when passed address is not a token address', async () => {
    await expect(hasEnoughToken(createPaymentOptions(wallet.address, utils.parseEther('2'), gasPrice, AddressZero), TEST_CONTRACT_ADDRESS, balanceChecker)).to.be.eventually.rejectedWith(`Invalid contract address: ${wallet.address}`);
  });
});
