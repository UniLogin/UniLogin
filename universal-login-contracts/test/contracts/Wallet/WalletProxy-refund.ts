import chai, {expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import {loadFixture, solidity} from 'ethereum-waffle';
import {transferMessage, createInfiniteCallMessage} from '../../utils/ExampleMessages';
import {utils, Contract, providers, Wallet} from 'ethers';
import {calculateMessageSignature, UnsignedMessage, TEST_ACCOUNT_ADDRESS, ETHER_NATIVE_TOKEN, KeyPair} from '@universal-login/commons';
import {encodeDataForExecuteSigned} from '../../../lib';
import {walletContractWithFundsFixture} from '../../fixtures/walletContract';

chai.use(chaiAsPromised);
chai.use(solidity);

describe('CONTRACT: WalletProxy - refund', async  () => {
  let provider: providers.Provider;
  let signature: string;
  let deployer: Wallet;
  let mockToken: Contract;
  let infiniteCallMessage: UnsignedMessage;
  let initialBalance: utils.BigNumber;
  let keyPair: KeyPair;
  let proxyWallet: Contract;


  beforeEach(async () => {
    ({provider, deployer, proxyWallet, keyPair, mockToken} = await loadFixture(walletContractWithFundsFixture));
    initialBalance = await deployer.getBalance();
  });

  it('refund works', async () => {
    const message = {...transferMessage, gasPrice: 1, from: proxyWallet.address};
    signature = calculateMessageSignature(keyPair.privateKey, message);
    const executeData = encodeDataForExecuteSigned({...message, signature});
    const transaction = await deployer.sendTransaction({to: proxyWallet.address, data: executeData, gasPrice: 1});
    const receipt = await provider.getTransactionReceipt(transaction.hash as string);
    expect(await provider.getBalance(TEST_ACCOUNT_ADDRESS)).to.eq(utils.parseEther('1'));
    const expectedBalance = initialBalance.sub(receipt.gasUsed as utils.BigNumber);
    expect(await deployer.getBalance()).to.be.above(expectedBalance);
  });

  it('ETHER_REFUND_CHARGE is enough for ether refund', async () => {
    infiniteCallMessage = await createInfiniteCallMessage(deployer, {from: proxyWallet.address, gasToken: ETHER_NATIVE_TOKEN.address});
    initialBalance = await deployer.getBalance();
    signature = calculateMessageSignature(keyPair.privateKey, infiniteCallMessage);
    const executeData = encodeDataForExecuteSigned({...infiniteCallMessage, signature});
    const transaction = await deployer.sendTransaction({to: proxyWallet.address, data: executeData, gasPrice: 1, gasLimit: infiniteCallMessage.gasLimit});
    const receipt = await provider.getTransactionReceipt(transaction.hash as string);
    const expectedBalance = initialBalance.sub(receipt.gasUsed as utils.BigNumber);
    expect(await deployer.getBalance()).to.be.above(expectedBalance);
  });

  it('TOKEN_REFUND_CHARGE is enough for token refund', async () => {
    const initialTokenBalance = await mockToken.balanceOf(deployer.address);
    infiniteCallMessage = await createInfiniteCallMessage(deployer, {gasToken: mockToken.address, from: proxyWallet.address});
    signature = calculateMessageSignature(keyPair.privateKey, infiniteCallMessage);
    const executeData = encodeDataForExecuteSigned({...infiniteCallMessage, signature});
    const transaction = await deployer.sendTransaction({to: proxyWallet.address, data: executeData, gasPrice: 1, gasLimit: infiniteCallMessage.gasLimit});
    const receipt = await provider.getTransactionReceipt(transaction.hash as string);
    const expectedBalance = initialTokenBalance.sub(receipt.gasUsed as utils.BigNumber);
    expect(await mockToken.balanceOf(deployer.address)).to.be.above(expectedBalance);
  });
});
