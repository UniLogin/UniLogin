import chai, {expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import {loadFixture, solidity, deployContract} from 'ethereum-waffle';
import {utils, Contract, providers, Wallet} from 'ethers';
import {TEST_ACCOUNT_ADDRESS, ETHER_NATIVE_TOKEN, KeyPair, Message, DEFAULT_GAS_LIMIT} from '@universal-login/commons';
import basicExecutor from '../../fixtures/basicExecutor';
import {transferMessage} from '../../helpers/ExampleMessages';
import Loop from '../../../build/Loop.json';
import {encodeFunction} from '../../helpers/argumentsEncoding';
import {encodeDataForExecuteSigned} from '../../../lib/encode';
import {messageToSignedMessage} from '../../../lib/message';
import {estimateGasLimit} from '../../../lib/estimateGas';

chai.use(chaiAsPromised);
chai.use(solidity);

describe('CONTRACT: Executor - refund', async () => {
  let provider: providers.Provider;
  let walletContract: Contract;
  let wallet: Wallet;
  let mockToken: Contract;
  let managementKeyPair: KeyPair;
  let loopContract: Contract;
  let infiniteCallMessage: Message;
  let initialBalance: utils.BigNumber;


  const computeFeeFor = (gasUsed: utils.BigNumber) => gasUsed.div(5); // 20% fee

  beforeEach(async () => {
    ({provider, walletContract, managementKeyPair, mockToken, wallet} = await loadFixture(basicExecutor));
    loopContract = await deployContract(wallet, Loop);
    initialBalance = await wallet.getBalance();
  });

  it('refund works', async () => {
    const message = {...transferMessage, gasPrice: 1, from: walletContract.address,  gasLimit: DEFAULT_GAS_LIMIT};
    const signedMessage = messageToSignedMessage(message, managementKeyPair.privateKey);
    const executeData = encodeDataForExecuteSigned(signedMessage);
    const gasLimit = estimateGasLimit(signedMessage.gasLimitExecution, signedMessage.gasData);
    const transaction = await wallet.sendTransaction({to: walletContract.address, data: executeData, gasPrice: 1, gasLimit});
    const receipt = await provider.getTransactionReceipt(transaction.hash as string);

    expect(await provider.getBalance(TEST_ACCOUNT_ADDRESS)).to.eq(utils.parseEther('1'));
    const balanceAfter = await wallet.getBalance();
    const gasFee = computeFeeFor(receipt.gasUsed!);
    expect(balanceAfter).to.be.above(initialBalance.add(gasFee));
  });

  describe('Loop Contract - infiniteCallMessage', async () => {
    beforeEach(async () => {
      const loopFunctionData = encodeFunction(Loop, 'loop');
      infiniteCallMessage = {
        from: walletContract.address,
        to: loopContract.address,
        value: utils.parseEther('0'),
        data: loopFunctionData,
        nonce: 0,
        gasPrice: 1,
        gasToken: '0x0',
        gasLimit: DEFAULT_GAS_LIMIT
      };
    });

    it('ETHER_REFUND_CHARGE is enough for ether refund', async () => {
      const signedMessage = messageToSignedMessage({...infiniteCallMessage, gasToken: ETHER_NATIVE_TOKEN.address}, managementKeyPair.privateKey);
      const executeData = encodeDataForExecuteSigned(signedMessage);
      const gasLimit = estimateGasLimit(signedMessage.gasLimitExecution, signedMessage.gasData);

      const transaction = await wallet.sendTransaction({to: walletContract.address, data: executeData, gasPrice: 1, gasLimit});
      const receipt = await provider.getTransactionReceipt(transaction.hash as string);

      const balanceAfter = await wallet.getBalance();
      const gasFee = computeFeeFor(receipt.gasUsed!);
      expect(balanceAfter).to.be.above(initialBalance.add(gasFee));
    });

    it('TOKEN_REFUND_CHARGE is enough for token refund', async () => {
      const initialTokenBalance = await mockToken.balanceOf(wallet.address);
      const signedMessage = messageToSignedMessage({...infiniteCallMessage, gasToken: mockToken.address}, managementKeyPair.privateKey);
      const executeData = encodeDataForExecuteSigned(signedMessage);
      const gasLimit = estimateGasLimit(signedMessage.gasLimitExecution, signedMessage.gasData);

      const transaction = await wallet.sendTransaction({to: walletContract.address, data: executeData, gasPrice: 1, gasLimit});
      const receipt = await provider.getTransactionReceipt(transaction.hash as string);

      const gasFee = computeFeeFor(receipt.gasUsed!);
      const balanceAfter = await mockToken.balanceOf(wallet.address);
      expect(balanceAfter).to.be.above(initialTokenBalance.add(gasFee));
    });
  });
});
