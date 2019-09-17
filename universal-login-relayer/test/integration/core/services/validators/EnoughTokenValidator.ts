import {expect} from 'chai';
import {Contract, Wallet, utils} from 'ethers';
import {loadFixture} from 'ethereum-waffle';
import {createSignedMessage, MessageWithFrom, TEST_ACCOUNT_ADDRESS} from '@universal-login/commons';
import basicWalletContractWithMockToken from '../../../../fixtures/basicWalletContractWithMockToken';
import EnoughTokenValidator from '../../../../../lib/integration/ethereum/validators/EnoughTokenValidator';
import IMessageValidator from '../../../../../lib/core/services/validators/IMessageValidator';

describe('INT: EnoughTokenValidator', async () => {
  let message: MessageWithFrom;
  let mockToken: Contract;
  let walletContract: Contract;
  let wallet: Wallet;
  let validator: IMessageValidator;

  before(async () => {
    ({mockToken, wallet, walletContract} = await loadFixture(basicWalletContractWithMockToken));
    message = {from: walletContract.address, gasToken: mockToken.address, to: TEST_ACCOUNT_ADDRESS};
    validator = new EnoughTokenValidator(wallet);
  });

  it('successfully pass the validation', async () => {
    const signedMessage = createSignedMessage({...message}, wallet.privateKey);
    await expect(validator.validate(signedMessage)).to.not.be.rejected;
  });

  it('passes when not enough gas', async () => {
    const signedMessage = createSignedMessage({...message, gasLimitExecution: 100}, wallet.privateKey);
    await expect(validator.validate(signedMessage)).to.be.eventually.fulfilled;
  });

  it('throws when not enough tokens', async () => {
    const signedMessage = createSignedMessage({...message, gasLimitExecution: utils.parseEther('2.0')}, wallet.privateKey);
    await expect(validator.validate(signedMessage))
      .to.be.eventually.rejectedWith('Not enough tokens');
  });
});
