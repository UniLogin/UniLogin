import {expect} from 'chai';
import {createMockProvider, deployContract, getWallets} from 'ethereum-waffle';
import Executor from '../../../build/TestableExecutor.json';
import {constants, Contract} from 'ethers';
import {transferMessage} from '../../helpers/ExampleMessages';
import {getExecutionArgs} from '../../helpers/argumentsEncoding';
import {DEFAULT_PAYMENT_OPTIONS_NO_GAS_TOKEN} from '../../../lib/defaultPaymentOptions';


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
    await expect(walletContractWithZeroKey.executeSigned(...getExecutionArgs(message), signature, DEFAULT_PAYMENT_OPTIONS_NO_GAS_TOKEN))
      .to.be.revertedWith('Invalid signature');
  });
});
