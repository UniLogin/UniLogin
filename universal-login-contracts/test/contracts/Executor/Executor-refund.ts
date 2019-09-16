import chai, {expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import {loadFixture, solidity, deployContract} from 'ethereum-waffle';
import {utils, Contract, providers, Wallet} from 'ethers';
import {calculateMessageSignature, UnsignedMessage, TEST_ACCOUNT_ADDRESS, ETHER_NATIVE_TOKEN, KeyPair} from '@universal-login/commons';
import basicExecutor from '../../fixtures/basicExecutor';
import {transferMessage} from '../../helpers/ExampleMessages';
import Loop from '../../../build/Loop.json';
import {encodeFunction} from '../../helpers/argumentsEncoding';
import {encodeDataForExecuteSigned, computeGasFields} from '../../../lib';
import TEST_PAYMENT_OPTIONS from '../../../lib/defaultPaymentOptions';

chai.use(chaiAsPromised);
chai.use(solidity);

describe('CONTRACT: Executor - refund', async () => {
  let provider: providers.Provider;
  let walletContract: Contract;
  let signature: string;
  let wallet: Wallet;
  let mockToken: Contract;
  let managementKeyPair: KeyPair;
  let loopContract: Contract;
  let infiniteCallMessage: UnsignedMessage;
  let initialBalance: utils.BigNumber;

  beforeEach(async () => {
    ({provider, walletContract, managementKeyPair, mockToken, wallet} = await loadFixture(basicExecutor));
    loopContract = await deployContract(wallet, Loop);
    initialBalance = await wallet.getBalance();
  });

  it('refund works', async () => {
    const unsignedMessage = {...transferMessage, gasPrice: 1, from: walletContract.address};
    const unsignedMessageWithEstimates = {...unsignedMessage, ...computeGasFields(unsignedMessage, TEST_PAYMENT_OPTIONS.gasLimit)};
    signature = calculateMessageSignature(managementKeyPair.privateKey, unsignedMessageWithEstimates);
    const executeData = encodeDataForExecuteSigned({...unsignedMessageWithEstimates, signature});

    const transaction = await wallet.sendTransaction({to: walletContract.address, data: executeData, gasPrice: 1});
    const receipt = await provider.getTransactionReceipt(transaction.hash as string);

    expect(await provider.getBalance(TEST_ACCOUNT_ADDRESS)).to.eq(utils.parseEther('1'));
    const balanceAfter = await wallet.getBalance();
    const gasFee = receipt.gasUsed!.div(5); // 20% fee
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
        gasLimitExecution: 0,
        gasData: 0
      };
    });

    it('ETHER_REFUND_CHARGE is enough for ether refund', async () => {
      infiniteCallMessage = {...infiniteCallMessage, gasToken: ETHER_NATIVE_TOKEN.address};
      const unsignedMessageWithEstimates = {...infiniteCallMessage, ...computeGasFields(infiniteCallMessage, TEST_PAYMENT_OPTIONS.gasLimit)};
      signature = calculateMessageSignature(managementKeyPair.privateKey, unsignedMessageWithEstimates);
      const executeData = encodeDataForExecuteSigned({...unsignedMessageWithEstimates, signature});

      const transaction = await wallet.sendTransaction({to: walletContract.address, data: executeData, gasPrice: 1, gasLimit: unsignedMessageWithEstimates.gasLimitExecution});
      const receipt = await provider.getTransactionReceipt(transaction.hash as string);

      const balanceAfter = await wallet.getBalance();
      const gasFee = receipt.gasUsed!.div(5); // 20% fee
      expect(balanceAfter).to.be.above(initialBalance.add(gasFee));
    });

    it('TOKEN_REFUND_CHARGE is enough for token refund', async () => {
      const initialTokenBalance = await mockToken.balanceOf(wallet.address);
      infiniteCallMessage = {...infiniteCallMessage, gasToken: mockToken.address};
      const unsignedMessageWithEstimates = {...infiniteCallMessage, ...computeGasFields(infiniteCallMessage, TEST_PAYMENT_OPTIONS.gasLimit)};
      signature = calculateMessageSignature(managementKeyPair.privateKey, unsignedMessageWithEstimates);
      const executeData = encodeDataForExecuteSigned({...unsignedMessageWithEstimates, signature});

      const transaction = await wallet.sendTransaction({to: walletContract.address, data: executeData, gasPrice: 1, gasLimit: unsignedMessageWithEstimates.gasLimitExecution});
      const receipt = await provider.getTransactionReceipt(transaction.hash as string);

      const gasFee = receipt.gasUsed!.div(5); // 20% fee
      const balanceAfter = await mockToken.balanceOf(wallet.address);
      expect(balanceAfter).to.be.above(initialTokenBalance.add(gasFee));
    });
  });
});
