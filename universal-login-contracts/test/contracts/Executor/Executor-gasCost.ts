import chai, {expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import {solidity, loadFixture} from 'ethereum-waffle';
import {utils, providers, Contract, Wallet} from 'ethers';
import {calculateMessageSignature, KeyPair, SignedMessagePaymentOptions} from '@universal-login/commons';
import basicExecutor from '../../fixtures/basicExecutor';
import {transferMessage, callMessage} from '../../helpers/ExampleMessages';
import {getExecutionArgs} from '../../helpers/argumentsEncoding';
import MockToken from '../../../build/MockToken.json';
import {calculatePaymentOptions} from '../../../lib/estimateGas';

chai.use(chaiAsPromised);
chai.use(solidity);

const callCost = 100000;
const etherTransferCost = 105000;
const tokenTransferCost = 80000;


describe('Executor - gas cost', async () => {
  const gasCosts = {} as Record<string, utils.BigNumber>;
  let provider: providers.Provider;
  let walletContract: Contract;
  let managementKeyPair: KeyPair;
  let signature: string;
  let msg;
  let mockContract: Contract;
  let mockToken: Contract;
  let wallet: Wallet;

  beforeEach(async () => {
    ({provider, walletContract, managementKeyPair, mockContract, mockToken, wallet} = await loadFixture(basicExecutor));
  });

  it('Function call', async () => {
    msg = {...callMessage, from: walletContract.address, to: mockContract.address};
    signature = calculateMessageSignature(managementKeyPair.privateKey, msg);
    const transaction = await walletContract.executeSigned(...getExecutionArgs(msg), signature, calculatePaymentOptions(msg as SignedMessagePaymentOptions));
    const {gasUsed} = await provider.getTransactionReceipt(transaction.hash);
    gasCosts['Function call'] = gasUsed!;
    expect(gasUsed).to.be.below(callCost);
  });

  it('Ether transfer', async () => {
    msg = {...transferMessage, from: walletContract.address};
    signature = calculateMessageSignature(managementKeyPair.privateKey, msg);
    const transaction = await walletContract.executeSigned(...getExecutionArgs(msg), signature, calculatePaymentOptions(msg as SignedMessagePaymentOptions));
    const {gasUsed} = await provider.getTransactionReceipt(transaction.hash);
    gasCosts['Ether transfer'] = gasUsed!;
    expect(gasUsed).to.be.below(etherTransferCost);
  });

  it('Token transfer', async () => {
    const transferTokenData = new utils.Interface(MockToken.abi).functions.transfer.encode([wallet.address, utils.parseEther('0.5')]);
    const transferTokenMsg = {...transferMessage, to: mockToken.address, data: transferTokenData, from: walletContract.address};
    signature = calculateMessageSignature(managementKeyPair.privateKey, transferTokenMsg);
    const transaction = await walletContract.executeSigned(...getExecutionArgs(transferTokenMsg), signature, calculatePaymentOptions(transferTokenMsg as SignedMessagePaymentOptions));
    const {gasUsed} = await provider.getTransactionReceipt(transaction.hash);
    gasCosts['Token transfer'] = gasUsed!;
    expect(gasUsed).to.be.below(tokenTransferCost);
  });

  after(() => {
    console.log();
    for (const [label, cost] of Object.entries(gasCosts)) {
      console.log(`    ${label}: ${cost}`);
    }
  });
});
