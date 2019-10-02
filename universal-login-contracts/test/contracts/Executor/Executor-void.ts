import {expect} from 'chai';
import {createMockProvider, deployContract, getWallets} from 'ethereum-waffle';
import Executor from '../../../build/TestableExecutor.json';
import {constants, Contract} from 'ethers';
import {transferMessage} from '../../helpers/ExampleMessages';
import {getExecutionArgs, estimateGasDataForNoSignature} from '../../helpers/argumentsEncoding';
import {calculateFinalGasLimit} from '../../../lib/estimateGas';


describe('Void Executor', () => {
  let provider;
  let walletContractWithZeroKey : Contract;
  let signature : string [];
  let message;
  let wallet;

  beforeEach(async () => {
    provider = createMockProvider();
    [, , , , , , , , , wallet] = getWallets(provider);
    walletContractWithZeroKey = await deployContract(wallet, Executor, [constants.AddressZero]);
  });

  it('execute signed fails', async () => {
    signature = [];
    message = {...transferMessage, from: walletContractWithZeroKey.address};
    const gasLimit = calculateFinalGasLimit(message.gasLimitExecution, estimateGasDataForNoSignature(message));
    await expect(walletContractWithZeroKey.executeSigned(...getExecutionArgs(message), signature, {gasLimit}))
      .to.be.revertedWith('Invalid signatures');
  });
});
