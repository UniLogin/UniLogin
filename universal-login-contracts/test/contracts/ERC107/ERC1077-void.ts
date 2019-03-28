import {expect} from 'chai';
import {createMockProvider, deployContract, getWallets} from 'ethereum-waffle';
import ERC1077 from '../../../build/ERC1077.json';
import {constants, Contract} from 'ethers';
import {transferMessage} from '../../fixtures/basicWallet';
import {getExecutionArgs} from '../../utils';
import {DEFAULT_PAYMENT_OPTIONS_NO_GAS_TOKEN} from '../../../lib/defaultPaymentOptions';


describe('Void ERC1077', () => {
  let provider;
  let walletContractWithZeroKey : Contract;
  let signature : string [];
  let message;
  let wallet;

  beforeEach(async () => {
    provider = createMockProvider();
    [, , , , , , , , , wallet] = getWallets(provider);
    walletContractWithZeroKey = await deployContract(wallet, ERC1077, [constants.AddressZero]);
  });

  it('execute signed fails', async () => {
    signature = [];
    message = {...transferMessage, from: walletContractWithZeroKey.address};
    await expect(walletContractWithZeroKey.executeSigned(...getExecutionArgs(message), signature, DEFAULT_PAYMENT_OPTIONS_NO_GAS_TOKEN))
      .to.be.revertedWith('Invalid signature');
  });
});
