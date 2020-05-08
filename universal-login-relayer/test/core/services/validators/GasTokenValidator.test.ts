import chai, {expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';
import {utils} from 'ethers';
import {StoredFutureWallet, TEST_GAS_PRICES, TEST_CONTRACT_ADDRESS, TEST_ACCOUNT_ADDRESS, TEST_TOKEN_ADDRESS} from '@unilogin/commons';
import {GasTokenValidator} from '../../../../src/core/services/validators/GasTokenValidator';

chai.use(chaiAsPromised);

describe('UNIT: GasTokenValidator', () => {
  const oracle = {getGasPrices: sinon.stub().resolves(TEST_GAS_PRICES)} as any;
  const validator = new GasTokenValidator(oracle);

  const getStoredFutureWallet = (tokenPriceInGwei: string) => ({
    publicKey: TEST_ACCOUNT_ADDRESS,
    contractAddress: TEST_CONTRACT_ADDRESS,
    ensName: 'user.unilogin.eth',
    gasPrice: '1',
    gasToken: TEST_TOKEN_ADDRESS,
    tokenPriceInETH: utils.parseUnits(tokenPriceInGwei, 'gwei').toString(),
  });

  describe('bellow gasPrice from oracle (1*20 < 24 gwei)', () => {
    const storedFutureWallet: StoredFutureWallet = getStoredFutureWallet('20');

    it('throw when gasToken is less than minimum expected', async () => {
      await expect(validator.validate(storedFutureWallet, 0.1)).to.be.rejectedWith('Gas price is not enough');
    });

    it('fulfilled when tolerance allows', async () => {
      await expect(validator.validate(storedFutureWallet, 0.2)).to.be.fulfilled;
    });

    it('reject without specified tolerance', async () => {
      await expect(validator.validate(storedFutureWallet)).to.be.rejectedWith('Gas price is not enough');
    });
  });

  it('eq gasPrice from oracle (1*24 = 24 gwei)', async () => {
    const storedFutureWallet: StoredFutureWallet = getStoredFutureWallet('24');
    await expect(validator.validate(storedFutureWallet, 0.1)).to.be.fulfilled;
    await expect(validator.validate(storedFutureWallet)).to.be.fulfilled;
  });

  it('under gasPrice from oracle (1*24 < 28 gwei)', async () => {
    const storedFutureWallet: StoredFutureWallet = getStoredFutureWallet('28');
    await expect(validator.validate(storedFutureWallet, 0.1)).to.be.fulfilled;
    await expect(validator.validate(storedFutureWallet)).to.be.fulfilled;
  });
});
