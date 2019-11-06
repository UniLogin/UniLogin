import {expect} from 'chai';
import {hasEnoughToken, EnoughTokenValidator} from '../../../../lib/integration/ethereum/validators/EnoughTokenValidator';
import {utils, providers, Wallet, Contract} from 'ethers';
import {ETHER_NATIVE_TOKEN, EMPTY_DATA} from '../../../../lib/core/constants/constants';
import {TEST_ACCOUNT_ADDRESS, TEST_CONTRACT_ADDRESS, TEST_PRIVATE_KEY} from '../../../../lib/core/constants/test';
import {deployContract, getWallets, createMockProvider} from 'ethereum-waffle';
import MockToken from '../../../fixtures/MockToken.json';
import {SignedMessage, calculateMessageSignature} from '../../../../lib';

describe('INT: EnoughTokenValidator', () => {
  let provider: providers.Provider;
  let wallet: Wallet;
  let validator: EnoughTokenValidator;
  const gasLimit = 1000000;
  const gasPrice = '2';
  let token: Contract;
  const walletBalance = utils.parseEther('2');
  let signedMessage: SignedMessage;

  before(async () => {
    provider = createMockProvider();
    [wallet] = await getWallets(provider);
    token = await deployContract(wallet, MockToken);
    await wallet.sendTransaction({to: TEST_CONTRACT_ADDRESS, value: walletBalance});
    await token.transfer(TEST_CONTRACT_ADDRESS, utils.parseEther('1'));
    validator = new EnoughTokenValidator(provider);
    const message = {
      from: TEST_CONTRACT_ADDRESS,
      to: TEST_ACCOUNT_ADDRESS,
      value: utils.parseEther('1.0'),
      data: EMPTY_DATA,
      nonce: 0,
      gasPrice,
      gasLimitExecution: utils.bigNumberify(190000),
      gasData: utils.bigNumberify(10000),
      gasToken: token.address,
    };
    signedMessage = {
      ...message,
      signature: calculateMessageSignature(TEST_PRIVATE_KEY, message)};
  });

  it('successfully pass the validation', async () => {
    await expect(validator.validate(signedMessage)).to.not.be.rejected;
  });

  it('passes when not enough gas', async () => {
    await expect(validator.validate({...signedMessage, gasLimitExecution: 100, gasData: 1000})).to.be.eventually.fulfilled;
  });

  it('throws when not enough tokens', async () => {
    await expect(validator.validate({...signedMessage, gasLimitExecution: utils.parseEther('2.0')})).to.be.eventually.rejectedWith('Not enough tokens');
  });

  describe('hasEnoughToken', async () => {
    const createPaymentOptions = (gasToken: string, gasLimit: utils.BigNumberish, gasPrice: utils.BigNumberish) => ({gasToken, gasLimit, gasPrice});

    it('Should return true if contract has enough token', async () => {
      expect(await hasEnoughToken(createPaymentOptions(token.address, gasLimit, gasPrice), TEST_CONTRACT_ADDRESS, provider)).to.be.true;
      expect(await hasEnoughToken(createPaymentOptions(token.address, gasLimit * 2, gasPrice), TEST_CONTRACT_ADDRESS, provider)).to.be.true;
      expect(await hasEnoughToken(createPaymentOptions(token.address, utils.parseEther('0.09'), '10'), TEST_CONTRACT_ADDRESS, provider)).to.be.true;
      expect(await hasEnoughToken(createPaymentOptions(token.address, '10', utils.parseEther('0.09')), TEST_CONTRACT_ADDRESS, provider)).to.be.true;
      expect(await hasEnoughToken(createPaymentOptions(token.address, utils.parseEther('0.9'), '1'), TEST_CONTRACT_ADDRESS, provider)).to.be.true;
      expect(await hasEnoughToken(createPaymentOptions(token.address, '1', utils.parseEther('0.9')), TEST_CONTRACT_ADDRESS, provider)).to.be.true;
    });

    it('Should return false if contract has not enough token', async () => {
      expect(await hasEnoughToken(createPaymentOptions(token.address, utils.parseEther('1.00001'), gasPrice), TEST_CONTRACT_ADDRESS, provider)).to.be.false;
      expect(await hasEnoughToken(createPaymentOptions(token.address, utils.parseEther('1.1'), gasPrice), TEST_CONTRACT_ADDRESS, provider)).to.be.false;
      expect(await hasEnoughToken(createPaymentOptions(token.address, utils.parseEther('2'), gasPrice), TEST_CONTRACT_ADDRESS, provider)).to.be.false;
      expect(await hasEnoughToken(createPaymentOptions(token.address, utils.parseEther('10'), gasPrice), TEST_CONTRACT_ADDRESS, provider)).to.be.false;
    });

    it('Should return true if contract has enough ethers', async () => {
      expect(await hasEnoughToken(createPaymentOptions(ETHER_NATIVE_TOKEN.address, gasLimit, gasPrice), TEST_CONTRACT_ADDRESS, provider)).to.be.true;
      expect(await hasEnoughToken(createPaymentOptions(ETHER_NATIVE_TOKEN.address, walletBalance.div(gasPrice), gasPrice), TEST_CONTRACT_ADDRESS, provider)).to.be.true;
      expect(await hasEnoughToken(createPaymentOptions(ETHER_NATIVE_TOKEN.address, walletBalance, '1'), TEST_CONTRACT_ADDRESS, provider)).to.be.true;
      expect(await hasEnoughToken(createPaymentOptions(ETHER_NATIVE_TOKEN.address, '1', walletBalance), TEST_CONTRACT_ADDRESS, provider)).to.be.true;
    });

    it('Should return false if contract has not enough ethers', async () => {
      expect(await hasEnoughToken(createPaymentOptions(ETHER_NATIVE_TOKEN.address, utils.parseEther('1.01'), gasPrice), TEST_CONTRACT_ADDRESS, provider)).to.be.false;
      expect(await hasEnoughToken(createPaymentOptions(ETHER_NATIVE_TOKEN.address, utils.parseEther('2.0'), gasPrice), TEST_CONTRACT_ADDRESS, provider)).to.be.false;
    });

    it('Should throw error, when passed address is not a token address', async () => {
      expect(hasEnoughToken(createPaymentOptions(wallet.address, utils.parseEther('2'), gasPrice), TEST_CONTRACT_ADDRESS, provider)).to.be.eventually.rejectedWith(Error);
    });
  });
});
