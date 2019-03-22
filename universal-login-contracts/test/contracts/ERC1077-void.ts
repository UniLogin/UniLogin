import {expect} from 'chai';
import {createMockProvider, deployContract, getWallets} from 'ethereum-waffle';
import ERC1077 from '../../build/ERC1077.json';
import {constants, Contract} from 'ethers';
import {transferMessage} from '../fixtures/basicWallet';
import {getExecutionArgs} from '../utils';
import {DEFAULT_PAYMENT_OPTIONS_NO_GAS_TOKEN} from '../../lib/defaultPaymentOptions';


describe('Void ERC1077', () => {
  let provider;
<<<<<<< HEAD
  let walletContractWithZeroKey : Contract;
=======
  let identityWithZeroKey : Contract;
>>>>>>> Move ERC1077 void test to seperate file
  let signature : string [];
  let message;
  let wallet;

  beforeEach(async () => {
    provider = createMockProvider();
    [, , , , , , , , , wallet] = getWallets(provider);
<<<<<<< HEAD
    walletContractWithZeroKey = await deployContract(wallet, ERC1077, [constants.AddressZero]);
=======
    identityWithZeroKey = await deployContract(wallet, ERC1077, [constants.AddressZero]);
>>>>>>> Move ERC1077 void test to seperate file
  });

  it('execute signed fails', async () => {
    signature = [];
<<<<<<< HEAD
    message = {...transferMessage, from: walletContractWithZeroKey.address};
    await expect(walletContractWithZeroKey.executeSigned(...getExecutionArgs(message), signature, DEFAULT_PAYMENT_OPTIONS_NO_GAS_TOKEN))
=======
    message = {...transferMessage, from: identityWithZeroKey.address};
    await expect(identityWithZeroKey.executeSigned(...getExecutionArgs(message), signature, DEFAULT_PAYMENT_OPTIONS_NO_GAS_TOKEN))
>>>>>>> Move ERC1077 void test to seperate file
      .to.be.revertedWith('Invalid signature');
  });
});
