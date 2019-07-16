import chai, {expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import {loadFixture, solidity, deployContract} from 'ethereum-waffle';
import basicERC1077 from '../../fixtures/basicERC1077';
import {transferMessage} from '../../utils/ExampleMessages';
import {utils, Contract, providers, Wallet} from 'ethers';
import {calculateMessageSignature, UnsignedMessage, TEST_ACCOUNT_ADDRESS, ETHER_NATIVE_TOKEN, KeyPair, OPERATION_CALL} from '@universal-login/commons';
import Loop from '../../../build/Loop.json';
import {encodeFunction} from '../../utils';
import {encodeDataForExecuteSigned} from '../../../lib';

chai.use(chaiAsPromised);
chai.use(solidity);

describe('CONTRACT: ERC1077 - refund', async  () => {
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
    ({provider, walletContract, managementKeyPair, mockToken, wallet} = await loadFixture(basicERC1077));
    loopContract = await deployContract(wallet, Loop);
    initialBalance = await wallet.getBalance();
    const loopFunctionData = encodeFunction(Loop, 'loop');
    infiniteCallMessage = {
      from: walletContract.address,
      to: loopContract.address,
      value: utils.parseEther('0'),
      data: loopFunctionData,
      nonce: 0,
      gasPrice: 1,
      gasToken: '0x0',
      gasLimit: utils.bigNumberify('240000'),
      operationType: OPERATION_CALL
    };
  });

  it('refund works', async () => {
    const message = {...transferMessage, gasPrice: 1, from: walletContract.address};
    signature = calculateMessageSignature(managementKeyPair.privateKey, message);
    const executeData = encodeDataForExecuteSigned({...message, signature});
    const transaction = await wallet.sendTransaction({to: walletContract.address, data: executeData, gasPrice: 1});
    const receipt = await provider.getTransactionReceipt(transaction.hash as string);
    expect(await provider.getBalance(TEST_ACCOUNT_ADDRESS)).to.eq(utils.parseEther('1'));
    const balanceAfter = await wallet.getBalance();
    expect(balanceAfter).to.be.above(initialBalance.sub(receipt.gasUsed as utils.BigNumber));
  });

  it('ETHER_REFUND_CHARGE is enough for ether refund', async () => {
    infiniteCallMessage = {...infiniteCallMessage, gasToken: ETHER_NATIVE_TOKEN.address};
    signature = calculateMessageSignature(managementKeyPair.privateKey, infiniteCallMessage);
    const executeData = encodeDataForExecuteSigned({...infiniteCallMessage, signature});
    const transaction = await wallet.sendTransaction({to: walletContract.address, data: executeData, gasPrice: 1, gasLimit: infiniteCallMessage.gasLimit});
    const receipt = await provider.getTransactionReceipt(transaction.hash as string);
    const balanceAfter = await wallet.getBalance();
    expect(balanceAfter).to.be.above(initialBalance.sub(receipt.gasUsed as utils.BigNumber));
  });

  it('TOKEN_REFUND_CHARGE is enough for token refund', async () => {
    const initialTokenBalance = await mockToken.balanceOf(wallet.address);
    infiniteCallMessage = {...infiniteCallMessage, gasToken: mockToken.address};
    signature = calculateMessageSignature(managementKeyPair.privateKey, infiniteCallMessage);
    const executeData = encodeDataForExecuteSigned({...infiniteCallMessage, signature});
    const transaction = await wallet.sendTransaction({to: walletContract.address, data: executeData, gasPrice: 1, gasLimit: infiniteCallMessage.gasLimit});
    const receipt = await provider.getTransactionReceipt(transaction.hash as string);
    const balanceAfter = await mockToken.balanceOf(wallet.address);
    expect(balanceAfter).to.be.above(initialTokenBalance.sub(receipt.gasUsed as utils.BigNumber));
  });
});
