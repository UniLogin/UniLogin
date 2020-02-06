import {expect} from 'chai';
import {SufficientBalanceValidator} from '../../../../src/integration/ethereum/validators/SufficientBalanceValidator';
import {utils, providers} from 'ethers';
import {TEST_CONTRACT_ADDRESS, TEST_PRIVATE_KEY} from '../../../../src/core/constants/test';
import {deployContract, getWallets, createMockProvider} from 'ethereum-waffle';
import MockToken from '../../../fixtures/MockToken.json';
import {SignedMessage} from '../../../../src';
import {getTestSignedMessage} from '../../../helpers/getTestMessage';

describe('INT: SufficientBalanceValidator', () => {
  const provider: providers.Provider = createMockProvider();
  const validator = new SufficientBalanceValidator(provider);
  let signedMessage: SignedMessage;

  before(async () => {
    const [wallet] = await getWallets(provider);
    const token = await deployContract(wallet, MockToken);
    await token.transfer(TEST_CONTRACT_ADDRESS, utils.parseEther('1'));
    signedMessage = getTestSignedMessage(TEST_PRIVATE_KEY, {gasToken: token.address});
  });

  it('successfully pass the validation', async () => {
    await expect(validator.validate(signedMessage)).to.not.be.rejected;
  });

  it('passes when not enough gas', async () => {
    await expect(validator.validate({...signedMessage, safeTxGas: 100, baseGas: 1000})).to.be.eventually.fulfilled;
  });

  it('throws when not enough tokens', async () => {
    await expect(validator.validate({...signedMessage, safeTxGas: utils.parseEther('2.0')})).to.be.eventually.rejectedWith('Not enough tokens');
  });
});
