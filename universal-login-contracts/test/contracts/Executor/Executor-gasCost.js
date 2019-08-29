import chai, {expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import {solidity, loadFixture} from 'ethereum-waffle';
import {utils} from 'ethers';
import {calculateMessageSignature} from '@universal-login/commons';
import basicERC1077 from '../../fixtures/basicERC1077';
import {transferMessage, callMessage} from '../../utils/ExampleMessages';
import {getExecutionArgs} from '../../utils';
import MockToken from '../../../build/MockToken.json';

chai.use(chaiAsPromised);
chai.use(solidity);

const callCost = 90000;
const etherTransferCost = 105000;
const tokenTransferCost = 80000;

const overrideOptions = {gasLimit: 120000};

describe('Executor - gas cost', async () => {
  const gasCosts = {};
  let provider;
  let walletContract;
  let managementKeyPair;
  let signature;
  let msg;
  let mockContract;
  let mockToken;
  let wallet;

  beforeEach(async () => {
    ({provider, walletContract, managementKeyPair, mockContract, mockToken, wallet} = await loadFixture(basicERC1077));
  });

  it('Function call', async () => {
    msg = {...callMessage, from: walletContract.address, to: mockContract.address};
    signature = calculateMessageSignature(managementKeyPair.privateKey, msg);
    const transaction = await walletContract.executeSigned(...getExecutionArgs(msg), signature, overrideOptions);
    const {gasUsed} = await provider.getTransactionReceipt(transaction.hash);
    gasCosts['Function call'] = gasUsed;
    expect(gasUsed).to.be.below(callCost);
  });

  it('Ether transfer', async () => {
    msg = {...transferMessage, from: walletContract.address};
    signature = calculateMessageSignature(managementKeyPair.privateKey, msg);
    const transaction = await walletContract.executeSigned(...getExecutionArgs(msg), signature, overrideOptions);
    const {gasUsed} = await provider.getTransactionReceipt(transaction.hash);
    gasCosts['Ether transfer'] = gasUsed;
    expect(gasUsed).to.be.below(etherTransferCost);
  });

  it('Token transfer', async () => {
    const transferTokenData = new utils.Interface(MockToken.abi).functions.transfer.encode([wallet.address, utils.parseEther('0.5')]);
    const transferTokenMsg = {...transferMessage, to: mockToken.address, data: transferTokenData, from: walletContract.address};
    signature = calculateMessageSignature(managementKeyPair.privateKey, transferTokenMsg);
    const transaction = await walletContract.executeSigned(...getExecutionArgs(transferTokenMsg), signature, overrideOptions);
    const {gasUsed} = await provider.getTransactionReceipt(transaction.hash);
    gasCosts['Token transfer'] = gasUsed;
    expect(gasUsed).to.be.below(tokenTransferCost);
  });

  after(() => {
    console.log();
    for (const [label, cost] of Object.entries(gasCosts)) {
      console.log(`    ${label}: ${cost}`);
    }
  });
});
