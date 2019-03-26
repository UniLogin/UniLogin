import chai, {expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import {solidity, loadFixture} from 'ethereum-waffle';
import basicWallet, {transferMessage, callMessage} from '../fixtures/basicWallet';
import {utils} from 'ethers';
import {calculateMessageSignature} from '../../lib/calculateMessageSignature';
import {getExecutionArgs} from '../utils';

chai.use(chaiAsPromised);
chai.use(solidity);

const callCost = 90000;
const transferCost = 105000;

const overrideOptions = {gasLimit: 120000};

describe('ERC1077 - gas cost', async () => {
  const gasCosts = {};
  let provider;
  let walletContract;
  let privateKey;
  let signature;
  let msg;
  let mockContract;

  beforeEach(async () => {
    ({provider, walletContract, privateKey, mockContract} = await loadFixture(basicWallet));
  });

  it('Function call', async () => {
    msg = {...callMessage, from: walletContract.address, to: mockContract.address};
    signature = calculateMessageSignature(privateKey, msg);
    const transaction = await walletContract.executeSigned(...getExecutionArgs(msg), signature, overrideOptions);
    const {gasUsed} = await provider.getTransactionReceipt(transaction.hash);
    gasCosts['Function call'] = gasUsed;
    expect(gasUsed).to.be.below(callCost);
  });

  it('Ether transfer', async () => {
    msg = {...transferMessage, from: walletContract.address};
    signature = calculateMessageSignature(privateKey, msg);
    const transaction = await walletContract.executeSigned(...getExecutionArgs(msg), signature, overrideOptions);
    const {gasUsed} = await provider.getTransactionReceipt(transaction.hash);
    gasCosts['Ether transfer'] = gasUsed;
    expect(gasUsed).to.be.below(transferCost);
  });

  after(() => {
    console.log();
    for (const [label, cost] of Object.entries(gasCosts)) {
      console.log(`    ${label}: ${cost}`);
    }
  });
});
