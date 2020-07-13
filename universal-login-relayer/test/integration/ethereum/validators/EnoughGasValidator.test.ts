import {Message, TEST_ACCOUNT_ADDRESS} from '@unilogin/commons';
import {unsignedMessageToSignedMessage} from '@unilogin/contracts';
import {emptyMessage} from '@unilogin/contracts/testutils';
import {expect} from 'chai';
import {loadFixture, MockProvider} from 'ethereum-waffle';
import {Contract, utils, Wallet} from 'ethers';
import EstimateGasValidator from '../../../../src/integration/ethereum/validators/EstimateGasValidator';
import {getTestSignedMessage} from '../../../testconfig/message';
import {basicWalletContractWithMockToken} from '../../../fixtures/basicWalletContractWithMockToken';
import {setupWalletContractService} from '../../../testhelpers/setupWalletContractService';

describe('INT: EstimateGasValidator', () => {
  let message: Message;
  let mockToken: Contract;
  let provider: MockProvider;
  let walletContract: Contract;
  let wallet: Wallet;
  let validator: EstimateGasValidator;

  beforeEach(async () => {
    ({mockToken, provider, wallet, walletContract} = await loadFixture(basicWalletContractWithMockToken));
    message = {...emptyMessage, from: walletContract.address, gasToken: mockToken.address, to: TEST_ACCOUNT_ADDRESS, gasLimit: '200000', nonce: 1};
    const walletContractService = setupWalletContractService(provider);
    validator = new EstimateGasValidator(wallet, walletContractService);
  });

  it('successfully pass the validation', async () => {
    const signedMessage = getTestSignedMessage({...message}, wallet.privateKey);
    await expect(validator.validate(signedMessage, '1')).to.not.be.rejected;
  });

  it('throws when not enough gas', async () => {
    const signedMessage = unsignedMessageToSignedMessage({...message, safeTxGas: 100, baseGas: 100}, wallet.privateKey);
    await expect(validator.validate(signedMessage, '1')).to.be.eventually.rejectedWith('Not enough gas');
  });

  it('throws when not enough tokens', async () => {
    const signedMessage = getTestSignedMessage({...message, gasLimit: utils.parseEther('2.0')}, wallet.privateKey);
    await expect(validator.validate(signedMessage, '1')).to.be.rejectedWith('Not enough gas');
  });

  it('won\'t throw when gas price is zero', async () => {
    const signedMessage = getTestSignedMessage({...message, gasPrice: 0}, wallet.privateKey);
    await expect(validator.validate(signedMessage, '1')).to.be.fulfilled;
  });
});
