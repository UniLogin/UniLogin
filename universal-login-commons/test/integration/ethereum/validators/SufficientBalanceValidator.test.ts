import {expect} from 'chai';
import {SufficientBalanceValidator} from '../../../../src/integration/ethereum/validators/SufficientBalanceValidator';
import {utils} from 'ethers';
import {TEST_CONTRACT_ADDRESS, TEST_PRIVATE_KEY} from '../../../../src/core/constants/test';
import {deployContract, MockProvider} from 'ethereum-waffle';
import MockToken from '../../../fixtures/MockToken.json';
import {SignedMessage, ProviderService} from '../../../../src';
import {getTestSignedMessage} from '../../../helpers/getTestMessage';

describe('INT: SufficientBalanceValidator', () => {
  const provider = new MockProvider();
  const validator = new SufficientBalanceValidator(new ProviderService(provider));
  let signedMessage: SignedMessage;

  before(async () => {
    const [wallet] = provider.getWallets();
    const token = await deployContract(wallet, MockToken);
    await token.transfer(TEST_CONTRACT_ADDRESS, utils.parseEther('1'));
    await wallet.sendTransaction({to: TEST_CONTRACT_ADDRESS, value: utils.parseEther('1')});
    signedMessage = getTestSignedMessage(TEST_PRIVATE_KEY, {gasToken: token.address});
  });

  it('successfully pass the validation', async () => {
    await expect(validator.validate(signedMessage)).to.not.be.rejected;
  });

  describe('Different tokens', () => {
    it('passes when enough gas', async () => {
      await expect(validator.validate({...signedMessage, safeTxGas: 100, baseGas: 1000})).to.be.eventually.fulfilled;
    });

    it('passes when gas and value have different token addresses', async () => {
      await expect(validator.validate({...signedMessage, value: utils.parseUnits('1'), safeTxGas: utils.parseUnits('0.05', 'gwei'), baseGas: 0})).to.be.eventually.fulfilled;
    });

    it('throws when not enough funds for transfer value', async () => {
      await expect(validator.validate({...signedMessage, value: utils.parseEther('2.0')})).to.be.eventually.rejectedWith('Not enough tokens');
    });

    it('throws when not enough tokens', async () => {
      await expect(validator.validate({...signedMessage, safeTxGas: utils.parseUnits('0.1', 'gwei')})).to.be.eventually.rejectedWith('Not enough tokens');
    });
  });

  describe('Same tokens', () => {
    it('passes when gas and value have same token addresses', async () => {
      const signedMessage = getTestSignedMessage(TEST_PRIVATE_KEY);
      await expect(validator.validate({...signedMessage, value: utils.parseEther('0.5'), safeTxGas: utils.parseUnits('0.025', 'gwei'), baseGas: 0})).to.be.eventually.fulfilled;
      await expect(validator.validate({...signedMessage, value: utils.parseEther('0.5'), safeTxGas: 0, baseGas: utils.parseUnits('0.025', 'gwei')})).to.be.eventually.fulfilled;
      await expect(validator.validate({...signedMessage, value: utils.parseEther('0.3'), safeTxGas: utils.parseUnits('0.01', 'gwei'), baseGas: utils.parseUnits('0.025', 'gwei')})).to.be.eventually.fulfilled;
    });

    it('throws when gas and value have same token addresses', async () => {
      const signedMessage = getTestSignedMessage(TEST_PRIVATE_KEY);
      await expect(validator.validate({...signedMessage, value: utils.parseEther('0.5'), safeTxGas: utils.parseUnits('0.03', 'gwei'), baseGas: 0})).to.be.eventually.rejectedWith('Not enough tokens');
      await expect(validator.validate({...signedMessage, value: utils.parseEther('0.6'), safeTxGas: 0, baseGas: utils.parseUnits('0.025', 'gwei')})).to.be.eventually.rejectedWith('Not enough tokens');
      await expect(validator.validate({...signedMessage, value: utils.parseEther('0.3'), safeTxGas: utils.parseUnits('0.015', 'gwei'), baseGas: utils.parseUnits('0.025', 'gwei')})).to.be.eventually.rejectedWith('Not enough tokens');
      await expect(validator.validate({...signedMessage, value: utils.parseEther('1.3'), safeTxGas: 0, baseGas: 0})).to.be.eventually.rejectedWith('Not enough tokens');
      await expect(validator.validate({...signedMessage, value: 0, safeTxGas: utils.parseUnits('0.065', 'gwei'), baseGas: 0})).to.be.eventually.rejectedWith('Not enough tokens');
      await expect(validator.validate({...signedMessage, value: 0, safeTxGas: 0, baseGas: utils.parseUnits('0.065', 'gwei')})).to.be.eventually.rejectedWith('Not enough tokens');
    });
  });
});
