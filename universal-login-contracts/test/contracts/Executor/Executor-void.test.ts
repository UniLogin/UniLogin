import {expect} from 'chai';
import {deployContract, MockProvider} from 'ethereum-waffle';
import Executor from '../../../dist/contracts/TestableExecutor.json';
import {constants, Contract} from 'ethers';
import {transferMessage} from '../../helpers/ExampleMessages';
import {getExecutionArgs} from '../../helpers/argumentsEncoding';
import {calculateFinalGasLimit, estimateBaseGasForNoSignature} from '../../helpers/calculations';

describe('Void Executor', () => {
  let walletContractWithZeroKey: Contract;
  let signature: string [];
  let message;
  let wallet;

  beforeEach(async () => {
    [, , , , , , , , , wallet] = new MockProvider().getWallets();
    walletContractWithZeroKey = await deployContract(wallet, Executor, [constants.AddressZero]);
  });

  it('execute signed fails', async () => {
    signature = [];
    message = {...transferMessage, from: walletContractWithZeroKey.address};
    const gasLimit = calculateFinalGasLimit(message.safeTxGas, estimateBaseGasForNoSignature(message));
    await expect(walletContractWithZeroKey.executeSigned(...getExecutionArgs(message), signature, {gasLimit}))
      .to.be.revertedWith('Invalid signatures');
  });
});
