import {expect} from 'chai';
import {Contract, Wallet, utils} from 'ethers';
import {loadFixture} from 'ethereum-waffle';
import {TEST_ACCOUNT_ADDRESS, Message, IMessageValidator} from '@universal-login/commons';
import {unsignedMessageToSignedMessage} from '@universal-login/contracts';
import {emptyMessage} from '@universal-login/contracts/testutils';
import basicWalletContractWithMockToken from '../../../../fixtures/basicWalletContractWithMockToken';
import EstimateGasValidator from '../../../../../lib/integration/ethereum/validators/EstimateGasValidator';
import {getTestSignedMessage} from '../../../../config/message';

describe('INT: EstimateGasValidator', async () => {
  let message: Message;
  let mockToken: Contract;
  let walletContract: Contract;
  let wallet: Wallet;
  let validator: IMessageValidator;

  beforeEach(async () => {
    ({mockToken, wallet, walletContract} = await loadFixture(basicWalletContractWithMockToken));
    message = {...emptyMessage, from: walletContract.address, gasToken: mockToken.address, to: TEST_ACCOUNT_ADDRESS, gasLimit: '200000', nonce: 1};
    validator = new EstimateGasValidator(wallet);
  });

  it('successfully pass the validation', async () => {
    const signedMessage = getTestSignedMessage({...message}, wallet.privateKey);
    await expect(validator.validate(signedMessage)).to.not.be.rejected;
  });

  it('throws when not enough gas', async () => {
    const signedMessage = unsignedMessageToSignedMessage({...message, safeTxGas: 100, baseGas: 100}, wallet.privateKey);
    await expect(validator.validate(signedMessage)).to.be.eventually.rejectedWith('Not enough gas');
  });

  it('throws when not enough tokens', async () => {
    const signedMessage = getTestSignedMessage({...message, gasLimit: utils.parseEther('2.0')}, wallet.privateKey);
    await expect(validator.validate(signedMessage)).to.be.rejectedWith('Not enough gas');
  });

  it('throws when not gas price is zero', async () => {
    const signedMessage = getTestSignedMessage({...message, gasPrice: 0}, wallet.privateKey);
    await expect(validator.validate(signedMessage)).to.be.rejectedWith('Not enough gas');
  });
});
