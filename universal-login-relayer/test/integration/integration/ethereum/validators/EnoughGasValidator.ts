import {expect} from 'chai';
import {Contract, Wallet, utils} from 'ethers';
import {loadFixture} from 'ethereum-waffle';
import {MessageWithFrom, TEST_ACCOUNT_ADDRESS} from '@universal-login/commons';
import {createSignedMessage, createSignedMessageFromUnsigned} from '@universal-login/contracts';
import basicWalletContractWithMockToken from '../../../../fixtures/basicWalletContractWithMockToken';
import EstimateGasValidator from '../../../../../lib/integration/ethereum/validators/EstimateGasValidator';
import IMessageValidator from '../../../../../lib/core/services/validators/IMessageValidator';

describe('INT: EstimateGasValidator', async () => {
  let message: MessageWithFrom;
  let mockToken: Contract;
  let walletContract: Contract;
  let wallet: Wallet;
  let validator: IMessageValidator;

  before(async () => {
    ({mockToken, wallet, walletContract} = await loadFixture(basicWalletContractWithMockToken));
    message = {from: walletContract.address, gasToken: mockToken.address, to: TEST_ACCOUNT_ADDRESS};
    validator = new EstimateGasValidator(wallet);
  });

  it('successfully pass the validation', async () => {
    const signedMessage = createSignedMessage({...message}, wallet.privateKey);
    await expect(validator.validate(signedMessage)).to.not.be.rejected;
  });

  it('throws when not enough gas', async () => {
    const signedMessage = createSignedMessageFromUnsigned({...message, gasLimitExecution: 100, gasData: 100}, wallet.privateKey);
    await expect(validator.validate(signedMessage)).to.be.eventually.rejectedWith('Not enough gas');
  });

  it('passes when not enough tokens', async () => {
    const signedMessage = createSignedMessage({...message, gasLimit: utils.parseEther('2.0')}, wallet.privateKey);
    await expect(validator.validate(signedMessage)).to.be.eventually.fulfilled;
  });
});
